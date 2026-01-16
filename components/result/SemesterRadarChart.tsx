"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ResultAPIResponse } from "../../app/(public)/result/types";

interface SemesterRadarChartProps {
  subjects: ResultAPIResponse[];
}

const chartConfig = {
  marks: {
    label: "Marks",
    color: "#84cc16",
  },
} satisfies ChartConfig;

export default function SemesterRadarChart({
  subjects,
}: SemesterRadarChartProps) {
  const chartData = subjects.map((subject) => ({
    subject: subject.papercode,
    marks: parseFloat(subject.moderatedprint) || 0,
    fullMark: 100,
  }));

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="px-6 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <RadarChart data={chartData}>
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-white text-sm">
                          {payload[0].payload.subject}
                        </p>
                        <p className="text-sm text-lime-500 font-bold">
                          {payload[0].value}/100
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
              />
              <PolarGrid stroke="#3f3f46" />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#a1a1aa" }}
              />
              <Radar
                name="marks"
                dataKey="marks"
                stroke="#84cc16"
                fill="#84cc16"
                fillOpacity={0.5}
                dot={{
                  r: 4,
                  fill: "#84cc16",
                  fillOpacity: 1,
                }}
              />
            </RadarChart>
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
