import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { folderId } = await params;

  if (!folderId) {
    return NextResponse.json(
      { message: "Folder ID is required" },
      { status: 400 }
    );
  }

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      select: {
        userId: true,
      },
    });

    if (!folder || folder.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Fetch all user answers for this folder
    const userAnswers = await prisma.userAnswer.findMany({
      where: {
        userId: userId,
        quiz: {
          resource: {
            folderId: folderId,
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
