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
import { extractPDFText, cleanPDFText } from "@/utils/pdf";

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

  const body = await req.json();
  const { resourceId, task, question } = body;

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

    if (!resource) {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }

    // Check if resource type is supported
    if (!["VIDEO", "PDF"].includes(resource.type)) {
      return NextResponse.json(
        { message: "Unsupported resource type. Only VIDEO and PDF are supported." },
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
      } else if (resource.type === "PDF") {
        console.log("Processing PDF resource:", resource.title);
        console.log("PDF URL:", resource.url);
        
        // Step 1: Extract text from PDF
        console.log("Step 1: Extracting text from PDF...");
        const pdfText = await extractPDFText(resource.url);
        
        // Step 2: Clean the extracted text
        console.log("Step 2: Cleaning extracted text...");
        const cleanedText = cleanPDFText(pdfText);
        
        if (!cleanedText || cleanedText.trim().length === 0) {
          throw new Error("No text content found in PDF after cleaning");
        }

        console.log("Step 3: Generating prompt for AI...");
        console.log("Cleaned text length:", cleanedText.length);
        
        // Step 3: Create prompt and generate summary using AI
        const prompt = SUMMARY_PROMPT(cleanedText);
        console.log("Step 4: Calling askGemini with prompt...");
        summary = await askGemini(prompt);
        
        console.log("✅ PDF summary generated successfully");
      }

      // Step 5: Save the generated summary to database
      if (summary) {
        console.log("Step 5: Saving summary to database...");
        await prisma.resource.update({
          where: { id: resourceId },
          data: { summary },
        });
        console.log("✅ Summary saved to database successfully");
      } else {
        console.log("⚠️ No summary generated to save");
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
}
