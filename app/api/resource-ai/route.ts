import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { processPrompt } from "@/lib/processPrompt";
import {
  ROADMAP_PROMPT,
  QA_PROMPTS,
  MINDMAP_PROMPT,
  QUIZ_PROMPT,
  FLASHCARD_PROMPT,
} from "@/lib/prompts";
import {
  getOrGenerateSummary,
  getResourceText,
  buildContextualSnippet,
  extractJSON,
} from "@/lib/resourceService";

// ============================
// MAIN HANDLER
// ============================

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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

    // Route to appropriate handler
    switch (task) {
      case "summary":
        return await handleSummary(resourceId);

      case "roadmap":
        return await handleRoadmap(resourceId);

      case "qa":
        return await handleQA(resource, question);

      case "mindmap":
        return await handleMindmap(resourceId);

      case "quiz":
        return await handleQuiz(resource);

      case "flashcards":
        return await handleFlashcards(resource);

      default:
        return NextResponse.json({ message: "Invalid task" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in resource AI task:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

// ============================
// TASK HANDLERS
// ============================

async function handleSummary(resourceId: string) {
  const summary = await getOrGenerateSummary(resourceId);
  return NextResponse.json({
    message: "Summary generated",
    summary,
  });
}

async function handleRoadmap(resourceId: string) {
  const summary = await getOrGenerateSummary(resourceId);
  const prompt = ROADMAP_PROMPT(summary);
  const answer = await processPrompt(prompt.system, prompt.user);

  return NextResponse.json({
    message: "Roadmap generated",
    answer,
  });
}

async function handleQA(
  resource: { id: string; type: string; url: string; summary?: string | null },
  question?: string
) {
  if (!question) {
    return NextResponse.json(
      { message: "Question is required for Q&A" },
      { status: 400 }
    );
  }

  // Always try contextual retrieval first for better answers
  let prompt;
  try {
    const sourceText = await getResourceText(resource);

    if (sourceText) {
      const context = await buildContextualSnippet(
        sourceText,
        question,
        resource.id
      );

      if (context && context.length > 0) {
        prompt = QA_PROMPTS.withContext(context, question);
      }
    }
  } catch (err) {
    console.warn(
      "Contextual retrieval failed, falling back to summary-based Q&A.",
      err
    );
  }

  // Fallback: use summary if contextual retrieval failed
  if (!prompt) {
    const summary = await getOrGenerateSummary(resource.id);
    prompt = QA_PROMPTS.withSummary(summary, question);
  }

  const answer = await processPrompt(prompt.system, prompt.user);

  return NextResponse.json({
    message: "Answer generated",
    answer,
  });
}

async function handleMindmap(resourceId: string) {
  const summary = await getOrGenerateSummary(resourceId);
  const prompt = MINDMAP_PROMPT(summary);
  const mindmap = await processPrompt(prompt.system, prompt.user);

  return NextResponse.json({
    message: "Mindmap code generated",
    mindmap,
  });
}

async function handleQuiz(resource: { id: string; type: string }) {
  // Check if quiz already exists
  const existingQuiz = await prisma.quiz.findFirst({
    where: { resourceId: resource.id },
    include: { quizQAs: true },
  });

  if (existingQuiz) {
    return NextResponse.json({
      message: "Quiz already exists for this resource",
      quiz: existingQuiz,
      quizQAs: existingQuiz.quizQAs,
    });
  }

  // Generate new quiz
  const summary = await getOrGenerateSummary(resource.id);
  const prompt = QUIZ_PROMPT(summary);
  const mcqText = await processPrompt(prompt.system, prompt.user);
  const mcqs = extractJSON(mcqText);

  interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }

  // Create quiz record
  const quizRecord = await prisma.quiz.create({
    data: { resourceId: resource.id },
  });

  // Create quiz questions
  const quizQAs = await Promise.all(
    mcqs.map((q: QuizQuestion) =>
      prisma.quizQA.create({
        data: {
          quizId: quizRecord.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
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

async function handleFlashcards(resource: { id: string; title: string }) {
  // Check if flashcard deck already exists
  const existingDeck = await prisma.flashcardDeck.findUnique({
    where: { resourceId: resource.id },
    include: { cards: true },
  });

  if (existingDeck) {
    return NextResponse.json({
      message: "Flashcard deck already exists for this resource",
      deck: existingDeck,
      cards: existingDeck.cards,
    });
  }

  // Generate new flashcards
  const summary = await getOrGenerateSummary(resource.id);
  const prompt = FLASHCARD_PROMPT(summary);
  const flashcardText = await processPrompt(prompt.system, prompt.user);
  const flashcards = extractJSON(flashcardText);

  interface Flashcard {
    term: string;
    definition: string;
  }

  // Create flashcard deck
  const deckRecord = await prisma.flashcardDeck.create({
    data: {
      resourceId: resource.id,
      title: `Flashcards for ${resource.title}`,
    },
  });

  // Create flashcards
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
