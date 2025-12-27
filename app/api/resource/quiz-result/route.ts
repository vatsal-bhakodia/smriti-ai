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

async function checkAndUnlockAchievement(userId: string, criteria: string) {
  const achievement = await prisma.achievement.findUnique({ where: { criteria } });
  if (!achievement) return null;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      });
      await tx.user.update({
        where: { id: userId },
        data: { points: { increment: achievement.points } },
      });
    });
    return achievement; // Return the achievement to notify the user
  } catch (e: any) {
    // If already unlocked (unique constraint), no-op; otherwise rethrow
    if (e?.code === "P2002") return null;
    throw e;
  }
}

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

    const questionIds = answers.map((answer) => answer.quizQAId);

    const correctAnswersData = await prisma.quizQA.findMany({
      where: {
        id: { in: questionIds },
        quizId: quizId,
      },
      select: {
        id: true,
        correctAnswer: true,
      },
    });

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
    
    const xpGain = correctAnswersCount * 5;

    const [_, quizResult, updatedUser] = await prisma.$transaction(async (tx) => {
      const userAnswerCreation = tx.userAnswer.createMany({
        data: userAnswersToCreate,
      });

      const quizResultCreation = tx.quizResult.create({
        data: {
          userId, // THE ONLY CHANGE: Added the userId here
          quizId,
          score: correctAnswersCount,
          totalQuestions: answers.length, 
        },
      });

      const userUpdate = tx.user.update({
        where: { id: userId },
        data: {
          experience: {
            increment: xpGain,
          },
          points: { 
            increment: correctAnswersCount 
          },
        },
      });

      return Promise.all([userAnswerCreation, quizResultCreation, userUpdate]);
    });
    
    const { level } = getLevelAndTtile(updatedUser.experience);
    if (updatedUser.level !== level) {
        await prisma.user.update({
            where: { id: userId },
            data: { level },
        });
    }

    const completedQuizzesCount = await prisma.quizResult.count({ where: { userId } });

    let unlockedAchievement = null;
    if (completedQuizzesCount >= 10) {
        unlockedAchievement = await checkAndUnlockAchievement(userId, "completed_10_quizzes");
    }

    return NextResponse.json(
      {
        message: "Quiz result and answers saved successfully",
        quizResult,
        unlockedAchievement,
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

// GET handler remains unchanged.
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

    // This query correctly ensures a user can only fetch results for their own topics.
    const quizResults = await prisma.quizResult.findMany({
      where: { 
        quizId,
        userId
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