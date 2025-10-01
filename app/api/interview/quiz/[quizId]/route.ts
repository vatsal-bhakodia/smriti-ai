import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ quizId?: string }> } | { params?: { quizId?: string } }
) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    // Support Next.js versions where params must be awaited
    let quizIdFromParams: string | undefined;
    const p: any = (ctx as any)?.params;
    quizIdFromParams = typeof p?.then === "function" ? (await p)?.quizId : p?.quizId;
    const quizIdFromQuery = url.searchParams.get("quizId") || undefined;
    const quizId = quizIdFromParams || quizIdFromQuery;

    if (!quizId) {
      return NextResponse.json({ message: "quizId is required" }, { status: 400 });
    }

    const quiz = await prisma.interviewQuiz.findFirst({
      where: { id: quizId, userId },
      include: {
        questions: true,
        results: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!quiz) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ quiz });
  } catch (e) {
    console.error("[INTERVIEW_QUIZ_DETAIL]", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


