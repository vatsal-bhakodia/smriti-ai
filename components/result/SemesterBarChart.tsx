"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ResultAPIResponse } from "@/types/result";

interface SemesterBarChartProps {
  subjects: ResultAPIResponse[];
}

export default function SemesterBarChart({ subjects }: SemesterBarChartProps) {
  // Subjects are already filtered (latest attempts only) from the parent component
  const chartData = useMemo(() => {
    return subjects.map((subject) => {
      const internalMarks = parseFloat(subject.minorprint) || 0;
      const externalMarks = parseFloat(subject.majorprint) || 0;
      const totalMarks = parseFloat(subject.moderatedprint) || 0;

      return {
        code: subject.papercode,
        name: subject.papername,
        internalMarks,
        externalMarks,
        totalMarks,
      };
    });
  }, [subjects]);

  return (
    <Card className="bg-zinc-900/95 pb-0 border-zinc-800">
      <CardContent className="px-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          SEMESTER STATISTICS
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Subject-wise marks distribution
        </p>
        {chartData.length > 0 ? (
          <ChartContainer
            config={{
              internalMarks: {
                label: "Internal",
                color: "#84cc16",
              },
              externalMarks: {
                label: "External",
                color: "#e0ff07",
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-zinc-700"
                />
                <XAxis
                  dataKey="code"
                  className="text-zinc-400"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  className="text-zinc-400"
                  tick={{ fill: "#a1a1aa" }}
                  domain={[0, 100]}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-lg">
                          <p className="text-xs text-zinc-400 mb-2">
                            {data.code}
                          </p>
                          <p className="font-semibold text-white text-sm mb-1">
                            {data.name}
                          </p>
                          <p className="text-sm text-white font-bold">
                            Total: {data.totalMarks}/100
                          </p>
                          <div className="mt-2 space-y-1 text-xs">
                            <p className="text-primary">
                              Internal: {data.internalMarks}
                            </p>
                            <p className="text-white">
                              External: {data.externalMarks}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="internalMarks" stackId="a" fill="#84cc16" />
                <Bar dataKey="externalMarks" stackId="a" fill="#e0ff07" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-zinc-400">
            No subject data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
