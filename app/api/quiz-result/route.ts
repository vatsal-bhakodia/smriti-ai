import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getLevelAndTtile } from "@/lib/levelUtils";

// Define a type for the data we expect from the frontend
type QuizSubmission = {
  quizId: string;
  answers: {
    quizQAId: string;
    selectedOption: string;
  }[];
};

// POST: Save quiz result
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quizId, answers }: QuizSubmission = await req.json();

    if (!quizId || !answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { message: "Invalid submission data" },
        { status: 400 }
      );
    }

    // CHANGE 2: More efficient answer fetching.
    // 1. Get all question IDs from the submission.
    const questionIds = answers.map((answer) => answer.quizQAId);

    // 2. Fetch all correct answers for those questions in a single database call.
    const correctAnswersData = await prisma.quizQA.findMany({
      where: {
        id: { in: questionIds },
        quizId: quizId, // Ensure questions belong to the correct quiz
      },
      select: {
        id: true,
        correctAnswer: true,
      },
    });

    // 3. Create a Map for instant O(1) lookups.
    const answerMap = new Map(
      correctAnswersData.map((qa) => [qa.id, qa.correctAnswer])
    );

    let correctAnswersCount = 0;
    const userAnswersToCreate = answers.map((submittedAnswer) => {
      const correctAnswer = answerMap.get(submittedAnswer.quizQAId);
      const isCorrect = correctAnswer !== undefined && submittedAnswer.selectedOption === correctAnswer;

      if (isCorrect) {
        correctAnswersCount++;
      }

      return {
        userId,
        quizId,
        quizQAId: submittedAnswer.quizQAId,
        selectedOption: submittedAnswer.selectedOption,
        isCorrect,
      };
    });
    
    // CHANGE 1: Using a Prisma transaction to ensure all database writes succeed or none do.
    const xpGain = correctAnswersCount * 5; // 5 XP per correct answer

    const [_, quizResult, updatedUser] = await prisma.$transaction(async (tx) => {
      // Operation 1: Save all the detailed user answers
      const userAnswerCreation = tx.userAnswer.createMany({
        data: userAnswersToCreate,
      });

      // Operation 2: Create the final quiz result summary
      const quizResultCreation = tx.quizResult.create({
        data: {
          quizId,
          score: correctAnswersCount,
          totalQuestions: answers.length, 
        },
      });

      // Operation 3: Award XP to the user
      const userUpdate = tx.user.update({
        where: { id: userId },
        data: {
          experience: {
            increment: xpGain,
          },
        },
      });

      // All three operations are executed together
      return Promise.all([userAnswerCreation, quizResultCreation, userUpdate]);
    });
    
    // After the transaction, update the user's level based on their new XP
    const { level } = getLevelAndTtile(updatedUser.experience);
    if (updatedUser.level !== level) {
        await prisma.user.update({
            where: { id: userId },
            data: { level },
        });
    }

    return NextResponse.json(
      {
        message: "Quiz result and answers saved successfully",
        quizResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET handler remains unchanged as it was already well-written.
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json(
        { message: "Missing quizId parameter" },
        { status: 400 }
      );
    }

    const quizResults = await prisma.quizResult.findMany({
      where: { quizId,
        quiz: {
            resource: {
                topic: {
                    userId: userId
                }
            }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quizResults });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}