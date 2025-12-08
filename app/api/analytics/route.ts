export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { processPrompt } from "@/lib/processPrompt";

// Helper: ask AI via unified client (guarded + timeout)
function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("AI timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      }
    );
  });
}

async function askAI(prompt: string): Promise<string | null> {
  try {
    return await withTimeout(
      processPrompt(
        "You are a learning coach. Keep answers concise and actionable.",
        prompt
      ),
      8000
    );
  } catch (e) {
    console.error("[ANALYTICS_AI]", e);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const url = new URL(req.url);
    const wantInsights = url.searchParams.get("insights") === "true";

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Average score per topic (percentage)
    const results = await prisma.quizResult.findMany({
      where: { userId },
      select: {
        score: true,
        totalQuestions: true,
        createdAt: true,
        quiz: {
          select: {
            resource: {
              select: { topicId: true, topic: { select: { title: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const topicAgg = new Map<
      string,
      { title?: string; sumPct: number; count: number }
    >();
    for (const r of results) {
      const topicId = r.quiz?.resource?.topicId;
      if (!topicId) continue;
      const pct = r.totalQuestions ? (r.score / r.totalQuestions) * 100 : 0;
      const cur = topicAgg.get(topicId) ?? {
        title: r.quiz?.resource?.topic?.title,
        sumPct: 0,
        count: 0,
      };
      cur.sumPct += pct;
      cur.count += 1;
      cur.title ||= r.quiz?.resource?.topic?.title;
      topicAgg.set(topicId, cur);
    }
    const averageScorePerTopic = Array.from(topicAgg, ([topicId, v]) => ({
      topicId,
      title: v.title ?? "",
      averageScore: Number((v.sumPct / v.count).toFixed(2)),
    }));

    // Most frequently missed questions (top 10)
    const misses = await prisma.userAnswer.groupBy({
      by: ["quizQAId"],
      where: { userId, isCorrect: false, quizQAId: { not: undefined } },
      _count: { quizQAId: true },
      orderBy: { _count: { quizQAId: "desc" } },
      take: 10,
    });
    const quizQAIds = misses.map((m) => m.quizQAId!).filter(Boolean);
    const missedQA = quizQAIds.length
      ? await prisma.quizQA.findMany({
          where: { id: { in: quizQAIds } },
          select: { id: true, question: true },
        })
      : [];
    const qaMap = new Map(missedQA.map((q) => [q.id, q.question]));
    const missedQuestions = misses.map((m) => ({
      quizQAId: m.quizQAId,
      misses: m._count.quizQAId,
      question: qaMap.get(m.quizQAId!) ?? null,
    }));

    // Performance trends (last 30 days)
    const performanceTrends30Days = await prisma.quizResult.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Performance trends (last 7 days)
    const performanceTrends7Days = await prisma.quizResult.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let aiInsights = null;
    if (wantInsights) {
      const aiPrompt = [
        "You are a learning coach.",
        "Using ONLY these aggregates, give 5 concise, actionable recommendations (<=120 words total).",
        `averageScorePerTopic: ${JSON.stringify(averageScorePerTopic)}`,
        `trend7Days: ${JSON.stringify(performanceTrends7Days)}`,
        `topMissed: ${JSON.stringify(
          missedQuestions.map((m) => ({ id: m.quizQAId, misses: m.misses }))
        )}`,
      ].join("\n");
      aiInsights = await askAI(aiPrompt);
    }

    // Return the aggregated data and AI insights
    return NextResponse.json(
      {
        averageScorePerTopic,
        missedQuestions,
        performanceTrends30Days,
        performanceTrends7Days,
        aiInsights,
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
