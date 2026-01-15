"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const GRADE_COLORS: Record<string, string> = {
  O: "#10b981", // green
  "A+": "#3b82f6", // blue
  A: "#8b5cf6", // purple
  "B+": "#f59e0b", // amber
  B: "#ef4444", // red
  C: "#f97316", // orange
  D: "#6b7280", // gray
  F: "#dc2626", // dark red
};

interface GradeDistributionChartProps {
  data: { grade: string; count: number }[];
}

export default function GradeDistributionChart({
  data,
}: GradeDistributionChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    fill: GRADE_COLORS[item.grade] || "#6b7280",
  }));

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          GRADE DISTRIBUTION
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          FREQUENCY OF GRADES ACROSS ALL SEMESTERS
        </p>
        {chartData.length > 0 ? (
          <ChartContainer config={{}} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ grade, percent }) =>
                    `${grade} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-zinc-400">
            No grade data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
