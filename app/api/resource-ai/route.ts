import {
  FALLBACK_PROMPT,
  SUMMARY_PROMPT,
  QA_PROMPT,
  MINDMAP_PROMPT,
  ROADMAP_PROMPT,
  QUIZ_PROMPT,
  FLASHCARD_PROMPT,
  FALLBACK_PROMPT_PDF,
  SUMMARY_PROMPT_PDF,
  QA_PROMPT_PDF,
  MINDMAP_PROMPT_PDF,
  ROADMAP_PROMPT_PDF,
  QUIZ_PROMPT_PDF,
  FLASHCARD_PROMPT_PDF,
} from "@/lib/prompts";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getYoutubeTranscript } from "@/utils/youtube";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper: ask Gemini
async function askGemini(prompt: string): Promise<string> {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest"; // default fallback
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  return result.response.text();
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
        try {
          // Download PDF bytes from Cloudinary (or any URL) and extract text
          console.log(summary);
        } catch (err) {
          console.error(
            "PDF parse failed. Falling back to title-based summary.",
            err
          );
          const fallbackPrompt = FALLBACK_PROMPT_PDF(resource.title);
          summary = await askGemini(fallbackPrompt);
        }
      } else if (resource.type === "ARTICLE") {
        // For notes/text resources, we treat current resource.summary (if provided during creation)
        // as the raw content to summarize. If empty, fall back to the title.
        const baseText =
          resource.summary && resource.summary.length > 0
            ? resource.summary
            : resource.title;
        try {
          const prompt = SUMMARY_PROMPT(baseText);
          summary = await askGemini(prompt);
        } catch (err) {
          console.error("ARTICLE summary generation failed.", err);
          const fallbackPrompt = FALLBACK_PROMPT(resource.title);
          summary = await askGemini(fallbackPrompt);
        }
      }

      // Persist computed summary back to the resource for future reuse
      if (summary && summary.length > 0) {
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
      const prompt =
        resource.type == "VIDEO"
          ? ROADMAP_PROMPT(summary)
          : ROADMAP_PROMPT_PDF(summary);

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

      const prompt =
        resource.type == "VIDEO"
          ? QA_PROMPT(summary, question)
          : QA_PROMPT_PDF(summary, question);

      const answer = await askGemini(prompt);
      return NextResponse.json({ message: "Answer generated", answer });
    }

    if (task === "mindmap") {
      const prompt =
        resource.type == "VIDEO"
          ? MINDMAP_PROMPT(summary)
          : MINDMAP_PROMPT_PDF(summary);

      const mindmap = await askGemini(prompt);
      return NextResponse.json({ message: "Mindmap code generated", mindmap });
    }

    if (task === "quiz") {
      // Step 1: Check if a quiz already exists for this resourceId
      const existingQuiz = await prisma.quiz.findFirst({
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
        const prompt =
          resource.type == "VIDEO"
            ? QUIZ_PROMPT(summary)
            : QUIZ_PROMPT_PDF(summary);

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

    if (task === "flashcards") {
      // Step 1: Check if a flashcard deck already exists for this resourceId
      const existingDeck = await prisma.flashcardDeck.findUnique({
        where: { resourceId: resource.id },
        include: {
          cards: true, // Include related flashcards
        },
      });

      if (existingDeck) {
        return NextResponse.json({
          message: "Flashcard deck already exists for this resource",
          deck: existingDeck,
          cards: existingDeck.cards,
        });
      } else {
        // Step 2: Generate new flashcards
        const prompt =
          resource.type == "VIDEO"
            ? FLASHCARD_PROMPT(summary)
            : FLASHCARD_PROMPT_PDF(summary);

        const flashcardText = await askGemini(prompt);
        const flashcards = extractJSON(flashcardText);

        interface Flashcard {
          term: string;
          definition: string;
        }

        // Step 3: Create a new flashcard deck record
        const deckRecord = await prisma.flashcardDeck.create({
          data: {
            resourceId: resource.id,
            title: `Flashcards for ${resource.title}`,
          },
        });

        // Step 4: Add the flashcards to the Flashcard model
        const cards = await Promise.all(
          flashcards.map((card: Flashcard) =>
            prisma.flashcard.create({
              data: {
                deckId: deckRecord.id,
                term: card.term,
                definition: card.definition,
              },
            })
          )
        );

        return NextResponse.json({
          message: "Flashcard deck created with cards",
          deck: deckRecord,
          cards,
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
