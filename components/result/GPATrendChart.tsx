"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface GPATrendChartProps {
  data: { semester: string; sgpa: number }[];
}

export default function GPATrendChart({ data }: GPATrendChartProps) {
  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          OVERALL STATISTICS (GPA TREND)
        </h3>
        {data.length > 0 ? (
          <ChartContainer
            config={{
              sgpa: {
                label: "SGPA",
                color: "#84cc16",
              },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-zinc-700"
                />
                <XAxis
                  dataKey="semester"
                  className="text-zinc-400"
                  tick={{ fill: "#a1a1aa" }}
                />
                <YAxis
                  className="text-zinc-400"
                  tick={{ fill: "#a1a1aa" }}
                  domain={[0, 10]}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ stroke: "#84cc16" }}
                />
                <Line
                  type="monotone"
                  dataKey="sgpa"
                  stroke="#84cc16"
                  strokeWidth={3}
                  dot={{ fill: "#84cc16", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-zinc-400">
            No GPA trend data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
