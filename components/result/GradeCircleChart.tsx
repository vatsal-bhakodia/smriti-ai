"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResultAPIResponse } from "@/types/result";
import { marksToGrade } from "@/utils/result";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

interface GradeCircleChartProps {
  subjects: ResultAPIResponse[];
}

export default function GradeCircleChart({ subjects }: GradeCircleChartProps) {
  // NOTE: ChartContainer turns config keys into CSS vars like `--color-${key}`.
  // Keep keys CSS-safe (no "+") and store display labels separately.
  const GRADE_ORDER = ["O", "A+", "A", "B+", "B", "C", "P", "F"] as const;
  const GRADE_KEY: Record<(typeof GRADE_ORDER)[number], string> = {
    O: "o",
    "A+": "aPlus",
    A: "a",
    "B+": "bPlus",
    B: "b",
    C: "c",
    P: "p",
    F: "f",
  };

  const gradeCount: Record<(typeof GRADE_ORDER)[number], number> = {
    O: 0,
    "A+": 0,
    A: 0,
    "B+": 0,
    B: 0,
    C: 0,
    P: 0,
    F: 0,
  };

  for (const subject of subjects) {
    const marks = parseFloat(subject.moderatedprint) || 0;
    const grade = marksToGrade(marks) as (typeof GRADE_ORDER)[number];
    if (grade in gradeCount) gradeCount[grade]++;
  }

  const totalSubjects = subjects.length;
  const chartData = GRADE_ORDER.map((grade) => ({
    gradeKey: GRADE_KEY[grade],
    gradeLabel: grade,
    count: gradeCount[grade],
    fill: `var(--color-${GRADE_KEY[grade]})`,
  })).filter((d) => d.count > 0);

  const chartConfig = {
    count: { label: "Subjects" },
    o: { label: "O", color: "#84cc16" },
    aPlus: { label: "A+", color: "#a3e635" },
    a: { label: "A", color: "#84cc16" },
    bPlus: { label: "B+", color: "#65a30d" },
    b: { label: "B", color: "#4d7c0f" },
    c: { label: "C", color: "#365314" },
    p: { label: "P", color: "#4d7c0f" },
    f: { label: "F", color: "#365314" },
  } satisfies ChartConfig;

  const top = chartData.reduce<{ gradeLabel: string; count: number } | null>(
    (acc, cur) =>
      !acc || cur.count > acc.count
        ? { gradeLabel: cur.gradeLabel, count: cur.count }
        : acc,
    null
  );
  const passCount = subjects.reduce((sum, s) => {
    const marks = parseFloat(s.moderatedprint) || 0;
    return sum + (marksToGrade(marks) !== "F" ? 1 : 0);
  }, 0);
  const passRate =
    totalSubjects > 0 ? Math.round((passCount / totalSubjects) * 100) : 0;

  // Calculate additional stats
  const allMarks = subjects.map((s) => parseFloat(s.moderatedprint) || 0);
  const totalMarks = allMarks.reduce((sum, m) => sum + m, 0);
  const averageMarks = totalSubjects > 0 ? totalMarks / totalSubjects : 0;
  const highestMarks = allMarks.length > 0 ? Math.max(...allMarks) : 0;
  const lowestMarks = allMarks.length > 0 ? Math.min(...allMarks) : 0;
  const failCount = gradeCount.F;

  return (
    <Card className="flex flex-col bg-zinc-900/95 border-zinc-800">
      <CardHeader className="pb-0">
        <CardTitle className="text-white">GRADE DISTRIBUTION</CardTitle>
        <CardDescription className="text-zinc-400">
          Breakdown of grades for this semester
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        {chartData.length > 0 ? (
          <div className="block md:grid grid-cols-2">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={-90}
                endAngle={380}
                innerRadius={30}
                outerRadius={110}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="gradeKey" />}
                />
                <RadialBar dataKey="count" background>
                  <LabelList
                    position="insideStart"
                    dataKey="gradeLabel"
                    className="fill-white capitalize mix-blend-luminosity"
                    fontSize={11}
                  />
                </RadialBar>
              </RadialBarChart>
            </ChartContainer>

            <div className="flex flex-col gap-3 text-sm">
              <div className="space-y-2">
                <div className="w-full flex items-center justify-between text-zinc-300">
                  <span className="text-muted-foreground">Total Subjects</span>
                  <span className="font-medium text-white">
                    {totalSubjects}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between text-zinc-300">
                  <span className="text-muted-foreground">Pass Rate</span>
                  <span className="font-medium text-white">{passRate}%</span>
                </div>
                <div className="w-full flex items-center justify-between text-zinc-300">
                  <span className="text-muted-foreground">Average Marks</span>
                  <span className="font-medium text-white">
                    {averageMarks.toFixed(1)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between text-zinc-300">
                  <span className="text-muted-foreground">Highest Marks</span>
                  <span className="font-medium text-white">
                    {highestMarks.toFixed(1)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between text-zinc-300">
                  <span className="text-muted-foreground">Lowest Marks</span>
                  <span className="font-medium text-white">
                    {lowestMarks.toFixed(1)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between text-zinc-300">
                  <span className="text-muted-foreground">Failed Subjects</span>
                  <span className="font-medium text-white">{failCount}</span>
                </div>
                {top ? (
                  <div className="w-full flex items-center justify-between text-zinc-300">
                    <span className="text-muted-foreground">
                      Most Common Grade
                    </span>
                    <span className="font-medium text-white">
                      {top.gradeLabel} ({top.count})
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <div className="text-xs text-muted-foreground mb-2">
                  Grade Breakdown
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {GRADE_ORDER.map((grade) => {
                    const count = gradeCount[grade];
                    if (count === 0) return null;
                    const percentage =
                      totalSubjects > 0
                        ? Math.round((count / totalSubjects) * 100)
                        : 0;
                    return (
                      <div
                        key={grade}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-zinc-400">{grade}</span>
                        <span className="text-white font-medium">
                          {count} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-zinc-400">
            No grade data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
