import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { processPrompt } from "@/lib/processPrompt";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const language = url.searchParams.get("language");
    const domainsCsv = url.searchParams.get("domains");
    const wantInsights = url.searchParams.get("insights") === "true";

    const timeFilter: any = {};
    if (from) timeFilter.gte = new Date(from);
    if (to) timeFilter.lte = new Date(to);

    // Filter results by time, language and domains through the related quiz
    const baseWhere: any = {
      userId,
      ...(from || to ? { createdAt: timeFilter } : {}),
    };

    const quizFilter: any = {};
    if (language) quizFilter.language = language;
    if (domainsCsv) {
      const domainList = domainsCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (domainList.length > 0) {
        // match if the concatenated domain string or any of stored domains overlaps
        quizFilter.OR = [
          { domain: { contains: domainList[0] } },
          { domains: { hasSome: domainList } },
        ];
      }
    }

    const [results, latest] = await Promise.all([
      prisma.interviewResult.findMany({
        where: baseWhere,
        orderBy: { createdAt: "asc" },
        select: {
          score: true,
          totalQuestions: true,
          createdAt: true,
          quizId: true,
        },
      }),
      prisma.interviewResult.findFirst({
        where: baseWhere,
        orderBy: { createdAt: "desc" },
        select: {
          score: true,
          totalQuestions: true,
          createdAt: true,
          quizId: true,
        },
      }),
    ]);

    // If language/domains filters applied, we need to post-filter results by their quiz
    let filtered = results;
    if (language || domainsCsv) {
      const quizIds = Array.from(new Set(results.map((r) => r.quizId)));
      const quizzes = await prisma.interviewQuiz.findMany({
        where: {
          id: { in: quizIds },
          ...(Object.keys(quizFilter).length ? quizFilter : {}),
        },
        select: { id: true },
      });
      const allowed = new Set(quizzes.map((q) => q.id));
      filtered = results.filter((r) => allowed.has(r.quizId));
    }

    const totalAnswered = filtered.reduce(
      (acc, r) => acc + (r.totalQuestions || 0),
      0
    );
    const totalScores = filtered.reduce((acc, r) => acc + (r.score || 0), 0);
    const averagePct =
      totalAnswered > 0
        ? Number(((totalScores / totalAnswered) * 100).toFixed(2))
        : 0;
    const questionsPractised = results.length;
    const latestScorePct =
      latest && latest.totalQuestions > 0
        ? Number(((latest.score / latest.totalQuestions) * 100).toFixed(2))
        : null;

    // Performance trend: map results by day, compute daily average %
    const trendMap = new Map<string, { sumPct: number; count: number }>();
    for (const r of filtered) {
      const day = new Date(r.createdAt);
      day.setHours(0, 0, 0, 0);
      const key = day.toISOString();
      const pct = r.totalQuestions ? (r.score / r.totalQuestions) * 100 : 0;
      const cur = trendMap.get(key) || { sumPct: 0, count: 0 };
      cur.sumPct += pct;
      cur.count += 1;
      trendMap.set(key, cur);
    }
    const performanceTrend = Array.from(trendMap.entries())
      .map(([date, v]) => ({
        date,
        averageScore: Number((v.sumPct / v.count).toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    let aiInsights: string | null = null;
    if (wantInsights) {
      const prompt = [
        "You are a learning coach.",
        `Average Score: ${averagePct}%`,
        `Latest Score: ${latestScorePct ?? "-"}%`,
        `Total Answered: ${totalAnswered}`,
        `Trend: ${JSON.stringify(performanceTrend.slice(-10))}`,
        "Give 4 concise, actionable recommendations (<=100 words).",
      ].join("\n");
      try {
        aiInsights = await processPrompt(prompt);
      } catch {}
    }

    return NextResponse.json({
      averageScore: averagePct,
      questionsPractised,
      totalQuestionsAnswered: totalAnswered,
      latestScore: latestScorePct,
      performanceTrend,
      aiInsights,
    });
  } catch (e) {
    console.error("[INTERVIEW_ANALYTICS]", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
