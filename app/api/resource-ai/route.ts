import {
  FALLBACK_PROMPT,
  SUMMARY_PROMPT,
  QA_PROMPT,
  MINDMAP_PROMPT,
  ROADMAP_PROMPT,
  QUIZ_PROMPT,
} from "@/lib/prompts";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getYoutubeTranscript } from "@/utils/youtube";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper: ask Gemini
async function askGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function extractJSON(text: string): any {
  const match = text.match(/\[.*\]/s); // non-greedy multiline match
  if (!match) throw new Error("No JSON found in Gemini response.");
  return JSON.parse(match[0]);
}

// Main handler
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Parse and validate input
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  let resourceId: string | undefined;
  let task: string | undefined;
  let question: string | undefined;
  if (typeof (data as any).resourceId === "string") resourceId = (data as any).resourceId;
  if (typeof (data as any).task === "string") task = (data as any).task;
  if (typeof (data as any).question === "string") question = (data as any).question;

  if (!resourceId || !task) {
    return NextResponse.json(
      { message: "resourceId and task are required" },
      { status: 400 }
    );
  }

  try {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource || resource.type !== "VIDEO") {
      return NextResponse.json(
        { message: "Invalid or unsupported resource" },
        { status: 400 }
      );
    }
    let summary = resource.summary;

    if (!summary || summary.length === 0) {
      if (resource.type === "VIDEO") {
        try {
          const transcript = await getYoutubeTranscript(resource.url);
          const prompt = SUMMARY_PROMPT(transcript);
          summary = await askGemini(prompt);
        } catch (err) {
          console.error(
            "Transcript fetch failed. Falling back to title-based summary.",
            err
          );

          const fallbackPrompt = FALLBACK_PROMPT(resource.title);
          summary = await askGemini(fallbackPrompt);
        }

        await prisma.resource.update({
      where: { id: resourceId },
          data: { summary },
        });
      }
    }

    if (task === "summary") {
      return NextResponse.json({
        message: "Summary generated",
        summary,
      });
    }

    if (task === "roadmap") {
      const prompt = ROADMAP_PROMPT(summary);

      const answer = await askGemini(prompt);
      return NextResponse.json({ message: "Roadmap generated", answer });
    }

    if (task === "qa") {
      if (!question) {
        return NextResponse.json(
          { message: "Question is required for Q&A" },
          { status: 400 }
        );
      }

      const prompt = QA_PROMPT(summary, question);

      const answer = await askGemini(prompt);
      return NextResponse.json({ message: "Answer generated", answer });
    }

    if (task === "mindmap") {
      const prompt = MINDMAP_PROMPT(summary);

      const mindmap = await askGemini(prompt);
      return NextResponse.json({ message: "Mindmap code generated", mindmap });
    }

    if (task === "quiz") {
      // Step 1: Check if a quiz already exists for this resourceId
      const existingQuiz = await prisma.quiz.findUnique({
        where: { resourceId: resource.id },
        include: {
          quizQAs: true, // Include related questions and answers
        },
      });

      if (existingQuiz) {
        return NextResponse.json({
          message: "Quiz already exists for this resource",
          quiz: existingQuiz,
          quizQAs: existingQuiz.quizQAs,
        });
      } else {
        // Step 2: Generate new quiz questions
        const prompt = QUIZ_PROMPT(summary);

        const mcqText = await askGemini(prompt);
        const mcqs = extractJSON(mcqText);

        interface QuizQuestion {
          question: string;
          options: string[];
          answer: string;
          explanation: string;
        }

        // Step 3: Create a new quiz record
        const quizRecord = await prisma.quiz.create({
          data: {
            resourceId: resource.id,
          },
        });

        // Step 4: Add the questions and answers to the QuizQA model
        const quizQAs = await Promise.all(
          mcqs.map((q: QuizQuestion) =>
            prisma.quizQA.create({
              data: {
                quizId: quizRecord.id,
                question: q.question,
                options: q.options,
                correctAnswer: q.answer,
                explanation: q.explanation,
              },
            })
          )
        );

        return NextResponse.json({
          message: "Quiz created with questions",
          quiz: quizRecord,
          quizQAs,
        });
      }
    }
  } catch (error) {
    console.error("Error in resource AI task:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

  // If no task matched, return a 400 error
  return NextResponse.json({ message: "Invalid task type" }, { status: 400 });
}
