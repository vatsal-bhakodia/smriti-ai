"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const GRADE_COLORS: Record<string, string> = {
  O: "#d9f99d", // lime-200 - brightest (90-100)
  "A+": "#bef264", // lime-300 (75-89)
  A: "#a3e635", // lime-400 (65-74)
  "B+": "#84cc16", // lime-500 (55-64)
  B: "#65a30d", // lime-600 (50-54)
  C: "#4d7c0f", // lime-700 (45-49)
  P: "#65a30d", // lime-600 (40-44) - lighter for visibility
  F: "#4d7c0f", // lime-700 (<40) - lighter but still darker than P
};

interface GradeDistributionChartProps {
  data: { grade: string; count: number }[];
}

export default function GradeDistributionChart({
  data,
}: GradeDistributionChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    fill: GRADE_COLORS[item.grade] || "#65a30d",
  }));

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="px-6">
        <h3 className="md:text-left text-center text-lg font-semibold text-white mb-4">
          GRADE DISTRIBUTION
        </h3>
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
