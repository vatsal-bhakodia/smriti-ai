import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const allAchievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });

    const unlockedIds = new Set(userAchievements.map((a) => a.achievementId));
    const result = allAchievements.map((ach) => ({
      ...ach,
      unlocked: unlockedIds.has(ach.id),
    }));

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[ACHIEVEMENTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
