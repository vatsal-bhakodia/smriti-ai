"use client";

import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { LearningStatusChart } from "@/components/dashboard/learning-chart";
import { Award, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TopicsTable from "@/components/dashboard/topics-table";

const stats = [
  {
    title: "Mastery Level",
    value: "Intermediate",
    progress: "65% complete",
    icon: <Award className="text-primary h-5 w-5" />,
    trend: "12% growth",
  },
  {
    title: "Study Consistency",
    value: "85%",
    icon: <CalendarCheck className="text-primary h-5 w-5" />,
    trend: "5% from last month",
    progress: 85,
  },
];

export default function Page() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 bg-background text-foreground">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back! 👋
            </h1>
          </div>
          <Link href="/dashboard/topic/">
            <Button variant="default">New Topic</Button>
          </Link>
        </div>

        {/* Performance Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat) => (
              <Card
                key={stat.title}
                className="rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      {stat.icon}
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {stat.title}
                        </p>
                        <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-muted-foreground mt-1">
                      {stat.progress}% achieved
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <PerformanceChart />
          <LearningStatusChart />
        </div>

        {/* Active Topics Table */}
        <TopicsTable />
      </div>
    </main>
  );
}
