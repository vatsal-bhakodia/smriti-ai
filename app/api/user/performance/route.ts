import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { QuizResult } from "@prisma/client";

// type for accumulator object in the reduce function
type MonthlyPerformanceAccumulator = {
  [key: string]: {
    totalScore: number;
    count: number;
    date: Date;
  };
};

// type for the values within the accumulator
type MonthlyPerformanceValue = {
  totalScore: number;
  count: number;
  date: Date;
};

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quizResults = await db.quizResult.findMany({
      where: {
        quiz: {
          resource: {
            folder: {
              userId: userId,
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const monthlyPerformance = quizResults.reduce(
      (acc: MonthlyPerformanceAccumulator, result: QuizResult) => {
        const month = result.createdAt.toLocaleString("default", {
          month: "long",
        });
        const year = result.createdAt.getFullYear();
        const key = `${month} ${year}`;

        if (!acc[key]) {
          acc[key] = { totalScore: 0, count: 0, date: result.createdAt };
        }

        acc[key].totalScore += result.score;
        acc[key].count += 1;

        return acc;
      },
      {}
    );

    // Format data for the chart
    const chartData = (
      Object.values(monthlyPerformance) as MonthlyPerformanceValue[]
    )
      .map((value) => ({
        month: value.date.toLocaleString("default", { month: "long" }),
        marks: Math.round(value.totalScore / value.count),
        date: value.date,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-6)
      .map(({ month, marks }) => ({ month, marks }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("[PERFORMANCE_DATA_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
