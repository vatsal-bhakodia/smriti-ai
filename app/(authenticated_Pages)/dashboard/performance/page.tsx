"use client";

// Mark as dynamic to prevent build-time errors when Clerk key is missing
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LoaderCircle,
  TrendingUp,
  Trophy,
  Award,
  Target,
  ArrowLeft,
} from "lucide-react";
import ErrorBoundary from "./error-boundary";

type AnalyticsData = {
  averageScorePerFolder: {
    folderId: string;
    title: string;
    averageScore: number;
  }[];
  performanceTrends30Days: {
    createdAt: string;
    score: number;
    totalQuestions: number;
  }[];
  performanceTrends7Days: {
    createdAt: string;
    score: number;
    totalQuestions: number;
  }[];
  aiInsights: string;
};

// Helper function to parse insights text into list items
const parseInsights = (insightsText: string): string[] | null => {
  const trimmed = insightsText.trim();
  if (!trimmed) return null;

  // Split by numbered items (1., 2., 3., etc.)
  const listItems = trimmed
    .split(/\d+\.\s+/)
    .filter((item) => item.trim().length > 0)
    .map((item) => item.trim());

  // Return list items if we have multiple items, otherwise null (render as paragraph)
  return listItems.length > 1 ? listItems : null;
};

interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const maskUsername = (username: string) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (emailRegex.test(username)) {
    const parts = username.split("@");
    if (parts.length === 2) {
      const localPart = parts[0];
      const domain = parts[1];
      if (localPart.length > 0) {
        const maskedLocalPart = localPart[0] + "***";
        return `${maskedLocalPart}@${domain}`;
      }
    }
  }
  return username;
};

const PerformancePageContent = () => {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [parsedInsights, setParsedInsights] = useState<string[] | null>(null);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(
    []
  );
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, leaderboardRes, achievementsRes] =
          await Promise.allSettled([
            axios.get<AnalyticsData>("/api/user/analytics?insights=true"),
            axios.get<LeaderboardUser[]>("/api/leaderboard"),
            axios.get<Achievement[]>("/api/user/achievements"),
          ]);

        if (analyticsRes.status === "fulfilled") {
          const data = analyticsRes.value.data;
          setAnalyticsData(data);
          // Parse insights when setting state
          if (data.aiInsights) {
            setParsedInsights(parseInsights(data.aiInsights));
          } else {
            setParsedInsights(null);
          }
        }

        if (leaderboardRes.status === "fulfilled") {
          setLeaderboardUsers(leaderboardRes.value.data);
        }

        if (achievementsRes.status === "fulfilled") {
          setAchievements(achievementsRes.value.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">
            Failed to load analytics data.
          </p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const barChartData = analyticsData.averageScorePerFolder.map((item) => ({
    name: item.title || item.folderId.slice(0, 20),
    score: item.averageScore,
  }));

  // Create a map to merge 30-day and 7-day data by date
  const dateMap = new Map<
    string,
    { date: string; score30Days?: number; score7Days?: number }
  >();

  analyticsData.performanceTrends30Days.forEach((item) => {
    const dateKey = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const score = item.totalQuestions
      ? (item.score / item.totalQuestions) * 100
      : 0;
    dateMap.set(dateKey, {
      date: dateKey,
      score30Days: score,
    });
  });

  analyticsData.performanceTrends7Days.forEach((item) => {
    const dateKey = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const score = item.totalQuestions
      ? (item.score / item.totalQuestions) * 100
      : 0;
    const existing = dateMap.get(dateKey) || { date: dateKey };
    existing.score7Days = score;
    dateMap.set(dateKey, existing);
  });

  const lineChartData = Array.from(dateMap.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const radarChartData = analyticsData.averageScorePerFolder.map((item) => ({
    subject: item.title || item.folderId.slice(0, 15),
    score: item.averageScore,
    fullMark: 100,
  }));

  // Chart configurations
  const barChartConfig = {
    score: {
      label: "Average Score",
      color: "hsl(90, 60%, 50%)", // primary color
    },
  } satisfies ChartConfig;

  const lineChartConfig = {
    score30Days: {
      label: "Last 30 Days",
      color: "hsl(90, 60%, 50%)", // primary color
    },
    score7Days: {
      label: "Last 7 Days",
      color: "hsl(90, 60%, 65%)", // lighter shade of primary
    },
  } satisfies ChartConfig;

  const radarChartConfig = {
    score: {
      label: "Performance",
      color: "hsl(90, 60%, 50%)", // primary color
    },
  } satisfies ChartConfig;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header with Back Button */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="gap-2 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Performance Details
          </h1>
          <p className="text-muted-foreground">
            Comprehensive view of your learning progress, achievements, and
            rankings
          </p>
        </div>
      </div>

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Score by Folder - Bar Chart */}
        <Card className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Average Score by Folder
            </CardTitle>
            <CardDescription className="text-xs">
              Your performance across different study folders
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-4">
            {barChartData.length > 0 ? (
              <div className="w-full h-full min-h-[280px]">
                <ChartContainer
                  config={barChartConfig}
                  className="h-full w-full"
                >
                  <BarChart data={barChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval={0}
                      tick={{ fontSize: 9 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      domain={[0, 100]}
                      width={35}
                      tick={{ fontSize: 10 }}
                    />
                    <ChartTooltip
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="score"
                      fill="var(--color-score)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Over Time - Line Chart */}
        <Card className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Performance Over Time
            </CardTitle>
            <CardDescription className="text-xs">
              7-day vs 30-day performance trends
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-4">
            {lineChartData.length > 0 ? (
              <div className="w-full h-full min-h-[280px]">
                <ChartContainer
                  config={lineChartConfig}
                  className="h-full w-full"
                >
                  <LineChart data={lineChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      domain={[0, 100]}
                      width={35}
                      tick={{ fontSize: 10 }}
                    />
                    <ChartTooltip
                      cursor={{ stroke: "hsl(var(--muted))" }}
                      content={<ChartTooltipContent />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      type="monotone"
                      dataKey="score30Days"
                      stroke="var(--color-score30Days)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="score7Days"
                      stroke="var(--color-score7Days)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strengths and Weaknesses - Radar Chart */}
        {radarChartData.length > 0 && (
          <Card className="flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-primary" />
                Strengths and Weaknesses
              </CardTitle>
              <CardDescription className="text-xs">
                Performance breakdown by folder
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-4">
              <div className="w-full h-full min-h-[280px]">
                <ChartContainer
                  config={radarChartConfig}
                  className="h-full w-full"
                >
                  <RadarChart data={radarChartData}>
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 10,
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 9,
                      }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Radar
                      name="Performance"
                      dataKey="score"
                      stroke="var(--color-score)"
                      fill="var(--color-score)"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Insights */}
      {analyticsData.aiInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {parsedInsights ? (
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed">
                {parsedInsights.map((item, index) => (
                  <li key={index} className="pl-2">
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {analyticsData.aiInsights}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Leaderboard - Full Width Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
          <CardDescription>Top performers with active scores</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboardUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-bold text-lg">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {maskUsername(user.username)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {user.points} XP
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No users with scores yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Your Achievements
            </CardTitle>
            <CardDescription>
              Unlock achievements as you progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    ach.unlocked
                      ? "border-primary bg-primary/5"
                      : "border-muted opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{ach.icon}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{ach.name}</h4>
                        {ach.unlocked && (
                          <Badge variant="default" className="text-xs">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const PerformancePage = () => (
  <ErrorBoundary>
    <PerformancePageContent />
  </ErrorBoundary>
);

export default PerformancePage;
