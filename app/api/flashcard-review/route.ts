import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Calculate next review date based on difficulty and spaced repetition algorithm
function calculateNextReview(difficulty: number): Date {
  const now = new Date();
  let daysToAdd = 1; // Default: review tomorrow

  // Simple spaced repetition algorithm
  // Difficulty 1-2: Easy, review in 1-3 days
  // Difficulty 3: Medium, review in 1 week
  // Difficulty 4-5: Hard, review in 3-7 days
  switch (difficulty) {
    case 1:
      daysToAdd = 1;
      break;
    case 2:
      daysToAdd = 3;
      break;
    case 3:
      daysToAdd = 7;
      break;
    case 4:
      daysToAdd = 14;
      break;
    case 5:
      daysToAdd = 21;
      break;
    default:
      daysToAdd = 1;
  }

  const nextReview = new Date(now);
  nextReview.setDate(now.getDate() + daysToAdd);
  return nextReview;
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cardId, difficulty } = body;

    if (!cardId || !difficulty || difficulty < 1 || difficulty > 5) {
      return NextResponse.json(
        { message: "Invalid cardId or difficulty" },
        { status: 400 }
      );
    }

    // Check if the flashcard exists and belongs to the user
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: cardId },
      include: {
        deck: {
          include: {
            resource: {
              include: {
                folder: true,
              },
            },
          },
        },
      },
    });

    if (
      !flashcard ||
      !flashcard.deck.resource.folder ||
      flashcard.deck.resource.folder.userId !== userId
    ) {
      return NextResponse.json(
        { message: "Flashcard not found or access denied" },
        { status: 404 }
      );
    }

    const nextReview = calculateNextReview(difficulty);

    // Check if review already exists
    const existingReview = await prisma.flashcardReview.findFirst({
      where: {
        cardId,
      },
    });

    let review;
    if (existingReview) {
      // Update existing review
      review = await prisma.flashcardReview.update({
        where: {
          id: existingReview.id,
        },
        data: {
          difficulty,
          nextReview,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new review
      review = await prisma.flashcardReview.create({
        data: {
          cardId,
          difficulty,
          nextReview,
        },
      });
    }

    return NextResponse.json({
      message: "Review saved successfully",
      review,
    });
  } catch (error) {
    console.error("Error saving flashcard review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("cardId");

    if (!cardId) {
      return NextResponse.json(
        { message: "cardId is required" },
        { status: 400 }
      );
    }

    const review = await prisma.flashcardReview.findFirst({
      where: { cardId },
    });

    return NextResponse.json({
      review,
    });
  } catch (error) {
    console.error("Error fetching flashcard review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
