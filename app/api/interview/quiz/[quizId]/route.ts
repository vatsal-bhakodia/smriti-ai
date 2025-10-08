import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ quizId: string }> }
) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    // Await params as required in Next.js 15+
    const { quizId } = await ctx.params;

    if (!quizId) {
      return NextResponse.json(
        { message: "quizId is required" },
        { status: 400 }
      );
    }

    const quiz = await prisma.interviewQuiz.findFirst({
      where: { id: quizId, userId },
      include: {
        questions: true,
        results: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!quiz)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ quiz });
  } catch (e) {
    console.error("[INTERVIEW_QUIZ_DETAIL]", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
