// components/dashboard/performanceCard.tsx

"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartColumnBig, LoaderCircle } from "lucide-react";
import useSWR from 'swr';

// A simple fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const chartConfig = {
  marks: {
    label: "marks",
    color: "hsl(90, 60%, 50%)", // vibrant yellow-green
  },
} satisfies ChartConfig;

// The chart component now accepts 'data' as a prop
function PerformanceChart({ data }: { data: any[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[80px] w-full"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="marks"
          type="natural"
          fill="var(--color-marks)"
          fillOpacity={0.4}
          stroke="var(--color-marks)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export default function PerformanceCard() {
  // SWR to fetch data from API endpoint
  const { data: chartData, error, isLoading } = useSWR('/api/performance-data', fetcher);

return (
  <Card className="pt-3 pb-0 gap-3 rounded-xl shadow-sm hover:shadow-md transition-all light:bg-white light:border light:border-gray-200">
    <div className="flex items-center gap-4 px-4">
      <div className="bg-muted/50 light:bg-gray-100 rounded-lg p-3">
        <ChartColumnBig className="text-primary light:text-lime-600 h-5 w-5" />
      </div>
      <div className="space-y-1 w-full">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground light:text-gray-900">Performance</p>
          {/* This part can be dynamic later */}
          <span className="text-xs font-medium text-[#adff2f] light:text-lime-600 bg-[#adff2f]/10 light:bg-lime-100 px-3 py-1 rounded-full flex items-center gap-1 border border-[#adff2f]/20 light:border-lime-200">
            Last 6 Months
          </span>
        </div>
      </div>
    </div>
    <CardContent className="px-2">
      {isLoading && (
        <div className="h-[80px] flex items-center justify-center">
          <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground light:text-gray-700" />
        </div>
      )}
      {error && (
        <div className="h-[80px] flex items-center justify-center text-red-500 text-xs">
          Failed to load chart data.
        </div>
      )}
      {chartData && <PerformanceChart data={chartData} />}
    </CardContent>
  </Card>
);

}