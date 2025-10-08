import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

type SubmittedAnswer = {
  questionId: string;
  selectedOption: string;
};

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { quizId, answers }: { quizId: string; answers: SubmittedAnswer[] } = await req.json();
    if (!quizId || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const questions = await prisma.interviewQuestion.findMany({
      where: { quizId, id: { in: answers.map((a) => a.questionId) } },
      select: { id: true, correctAnswer: true },
    });
    const answerMap = new Map(questions.map((q) => [q.id, q.correctAnswer]));

    let correct = 0;
    for (const a of answers) {
      const c = answerMap.get(a.questionId);
      if (c && c === a.selectedOption) correct++;
    }

    // Some environments may have a stale client without the 'answers' field.
    // Fall back gracefully if validation fails.
    let result;
    try {
      result = await prisma.interviewResult.create({
      data: {
        userId,
        quizId,
        score: correct,
        totalQuestions: answers.length,
          answers: answers as any,
        },
      } as any);
    } catch (e: any) {
      // Retry without answers field
      result = await prisma.interviewResult.create({
        data: {
          userId,
          quizId,
          score: correct,
          totalQuestions: answers.length,
        },
      });
    }

    // award experience similar to regular quizzes: 5 XP per correct
    const xpGain = correct * 5;
    await prisma.user.update({
      where: { id: userId },
      data: { experience: { increment: xpGain }, points: { increment: correct } },
    });

    return NextResponse.json({ message: "Submitted", result });
  } catch (e) {
    console.error("[INTERVIEW_SUBMIT]", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


