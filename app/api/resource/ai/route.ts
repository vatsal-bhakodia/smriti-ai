import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { processPrompt, processPromptStream } from "@/lib/processPrompt";
import {
  ROADMAP_PROMPT,
  QA_PROMPTS,
  MINDMAP_PROMPT,
  QUIZ_PROMPT,
  FLASHCARD_PROMPT,
  SUMMARY_PROMPTS,
} from "@/lib/prompts";
import {
  getOrGenerateSummary,
  getResourceText,
  getSummaryPrompt,
  extractJSON,
} from "@/lib/resourceService";

// ============================
// HELPERS
// ============================

/**
 * Creates a streaming HTTP response from an AI ReadableStream.
 * Optionally collects the full text and runs an onComplete callback (e.g. to persist to DB).
 */
function createStreamResponse(
  aiStream: ReadableStream<string>,
  onComplete?: (fullText: string) => Promise<void>
): Response {
  const encoder = new TextEncoder();

  const outStream = new ReadableStream({
    async start(controller) {
      const reader = aiStream.getReader();
      let fullText = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += value;
          controller.enqueue(encoder.encode(value));
        }
        controller.close();

        // Fire-and-forget: persist summary / other data after stream ends
        if (onComplete) {
          onComplete(fullText).catch((err) =>
            console.error("onComplete callback failed:", err)
          );
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(outStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * Creates a "fake stream" response that sends cached text as a single chunk.
 * The frontend will animate it character-by-character.
 * We use a special header to tell the frontend this is cached content.
 */
function createCachedResponse(text: string): Response {
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Cached": "true",
    },
  });
}

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

/**
 * Summary handler — returns cached text instantly or streams a fresh generation.
 * When streaming, persists the generated summary to DB after completion.
 */
async function handleSummary(resourceId: string) {
  // Check if summary is already cached
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    return NextResponse.json(
      { message: "Resource not found" },
      { status: 404 }
    );
  }

  // Return cached summary (frontend will fake-stream it)
  if (resource.summary && resource.summary.length > 0) {
    return createCachedResponse(resource.summary);
  }

  // Generate fresh summary via streaming
  const prompt = await getSummaryPrompt(resourceId);
  if (!prompt) {
    return NextResponse.json(
      { message: "Could not build summary prompt" },
      { status: 500 }
    );
  }

  const aiStream = await processPromptStream(prompt.system, prompt.user);

  return createStreamResponse(aiStream, async (fullText) => {
    // Persist the generated summary for future requests
    if (fullText && fullText.length > 0) {
      await prisma.resource.update({
        where: { id: resourceId },
        data: { summary: fullText },
      });
    }
  });
}

/**
 * Roadmap handler — streams a learning roadmap based on the resource summary.
 */
async function handleRoadmap(resourceId: string) {
  const { summary } = await getOrGenerateSummary(resourceId);
  const prompt = ROADMAP_PROMPT(summary);
  const aiStream = await processPromptStream(prompt.system, prompt.user);
  return createStreamResponse(aiStream);
}

/**
 * Q&A handler — streams an answer based on resource content.
 * Uses full source text when available, falls back to summary.
 */
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

  let prompt;

  // Try to use full source text for better answers
  try {
    const sourceText = await getResourceText(resource);
    if (sourceText && sourceText.length > 0) {
      // Use full text directly (truncated if too long) instead of broken vector search
      const truncated =
        sourceText.length > 12000
          ? sourceText.slice(0, 12000) + "\n\n[...truncated]"
          : sourceText;
      prompt = QA_PROMPTS.withContext(truncated, question);
    }
  } catch (err) {
    console.warn("Source text extraction failed, falling back to summary.", err);
  }

  // Fallback: use summary
  if (!prompt) {
    const { summary } = await getOrGenerateSummary(resource.id);
    prompt = QA_PROMPTS.withSummary(summary, question);
  }

  const aiStream = await processPromptStream(prompt.system, prompt.user);
  return createStreamResponse(aiStream);
}

/**
 * Mindmap handler — streams mermaid.js code for a mind map.
 */
async function handleMindmap(resourceId: string) {
  const { summary } = await getOrGenerateSummary(resourceId);
  const prompt = MINDMAP_PROMPT(summary);
  const aiStream = await processPromptStream(prompt.system, prompt.user);
  return createStreamResponse(aiStream);
}

/**
 * Quiz handler — returns cached quiz or generates a new one.
 * Quizzes require structured JSON so we use non-streaming generation.
 */
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

  // Generate new quiz (non-streaming — needs structured JSON)
  const { summary } = await getOrGenerateSummary(resource.id);
  const prompt = QUIZ_PROMPT(summary);
  const mcqText = await processPrompt(prompt.system, prompt.user);
  const mcqs = extractJSON(mcqText);

  interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }

  const quizRecord = await prisma.quiz.create({
    data: { resourceId: resource.id },
  });

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

/**
 * Flashcards handler — returns cached deck or generates new flashcards.
 * Non-streaming since it needs structured JSON.
 */
async function handleFlashcards(resource: { id: string; title: string }) {
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

  const { summary } = await getOrGenerateSummary(resource.id);
  const prompt = FLASHCARD_PROMPT(summary);
  const flashcardText = await processPrompt(prompt.system, prompt.user);
  const flashcards = extractJSON(flashcardText);

  interface Flashcard {
    term: string;
    definition: string;
  }

  const deckRecord = await prisma.flashcardDeck.create({
    data: {
      resourceId: resource.id,
      title: `Flashcards for ${resource.title}`,
    },
  });

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
