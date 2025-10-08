import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const quizzesRaw = await prisma.interviewQuiz.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        results: {
          orderBy: { createdAt: "desc" },
          select: { id: true, score: true, totalQuestions: true, createdAt: true },
        },
      },
    });

    const quizzes = quizzesRaw.map((q: any) => ({
      id: q.id,
      language: q.language,
      domain: q.domain,
      domains: Array.isArray(q.domains) ? q.domains : [],
      createdAt: q.createdAt,
      results: q.results,
    }));

    return NextResponse.json({ quizzes });
  } catch (e) {
    console.error("[INTERVIEW_HISTORY]", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


