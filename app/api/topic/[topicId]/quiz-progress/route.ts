// app/api/topic/[topicId]/quiz-progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { topicId } = await params;

  if (!topicId) {
    return NextResponse.json(
      { message: "Topic ID is required" },
      { status: 400 }
    );
  }

  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: {
        userId: true,
      },
    });

    if (!topic || topic.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Fetch all user answers for this topic
    const userAnswers = await prisma.userAnswer.findMany({
      where: {
        userId: userId,
        quiz: {
          resource: {
            topicId: topicId,
          },
        },
      },
      select: {
        isCorrect: true,
      },
    });

    return NextResponse.json(
      {
        message: "Quiz progress data fetched successfully",
        data: userAnswers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quiz progress data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}