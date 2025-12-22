"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bar, Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  ChartOptions,
  InteractionItem,
} from "chart.js";

import { getElementAtEvent } from "react-chartjs-2";
import ErrorBoundary from "./error-boundary";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale
);

type AnalyticsData = {
  averageScorePerFolder: {
    folderId: string;
    title: string;
    averageScore: number;
  }[];
  performanceTrends30Days: { createdAt: string; score: number }[];
  performanceTrends7Days: { createdAt: string; score: number }[];
  aiInsights: string;
};

type InterviewAnalytics = {
  averageScore: number;
  latestScore: number | null;
  totalQuestionsAnswered: number;
  performanceTrend: Array<{ date: string; averageScore: number }>;
  aiInsights?: string | null;
};

const AnalyticsPageContent = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [interviewData, setInterviewData] = useState<InterviewAnalytics | null>(
    null
  );
  const barRef = useRef<ChartJS<"bar">>(null);
  const lineRef = useRef<ChartJS<"line">>(null);
  const radarRef = useRef<ChartJS<"radar">>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const { data } = await axios.get<AnalyticsData>("/api/analytics");
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      }
    };
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    const fetchInterviewAnalytics = async () => {
      try {
        const { data } = await axios.get<InterviewAnalytics>(
          "/api/interview/analytics"
        );
        setInterviewData(data);
      } catch (error) {
        console.error("Failed to fetch interview analytics:", error);
      }
    };
    fetchInterviewAnalytics();
  }, []);

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-8 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Average Score by Folder",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance Over Time",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
  };

  const radarOptions: ChartOptions<"radar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Strengths and Weaknesses",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.r !== null) {
              label += context.parsed.r;
            }
            return label;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  const handleBarClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (barRef.current) {
      const elements: InteractionItem[] = getElementAtEvent(
        barRef.current,
        event
      );
      if (elements.length > 0) {
        console.log("Bar clicked:", elements[0]);
      }
    }
  };

  const handleLineClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (lineRef.current) {
      const elements: InteractionItem[] = getElementAtEvent(
        lineRef.current,
        event
      );
      if (elements.length > 0) {
        console.log("Line clicked:", elements[0]);
      }
    }
  };

  const handleRadarClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (radarRef.current) {
      const elements: InteractionItem[] = getElementAtEvent(
        radarRef.current,
        event
      );
      if (elements.length > 0) {
        console.log("Radar clicked:", elements[0]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Performance Analytics</h1>

      <div className="grid md:gird-cols-3 grid-cols-1 gap-10">
        {/* Average Score by Folder */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Average Score by Folder
          </h2>
          <Bar
            ref={barRef}
            options={barOptions}
            onClick={handleBarClick}
            data={{
              labels: analyticsData.averageScorePerFolder.map(
                (item) => item.title || item.folderId
              ),
              datasets: [
                {
                  label: "Average Score",
                  data: analyticsData.averageScorePerFolder.map(
                    (item) => item.averageScore
                  ),
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>

        {/* Performance Over Time */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Performance Over Time (7 vs 30 days)
          </h2>
          <Line
            ref={lineRef}
            options={lineOptions}
            onClick={handleLineClick}
            data={{
              labels: analyticsData.performanceTrends30Days.map((item) =>
                new Date(item.createdAt).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Last 30 Days",
                  data: analyticsData.performanceTrends30Days.map(
                    (item) => item.score
                  ),
                  borderColor: "rgb(75, 192, 192)",
                  backgroundColor: "rgba(75, 192, 192, 0.5)",
                  tension: 0.1,
                },
                {
                  label: "Last 7 Days",
                  data: analyticsData.performanceTrends7Days.map(
                    (item) => item.score
                  ),
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                  tension: 0.1,
                },
              ],
            }}
          />
        </div>

        {/* Strengths and Weaknesses */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Strengths and Weaknesses
          </h2>
          <Radar
            ref={radarRef}
            options={radarOptions}
            onClick={handleRadarClick}
            data={{
              labels: analyticsData.averageScorePerFolder.map(
                (item) => item.title || item.folderId
              ),
              datasets: [
                {
                  label: "Your Performance",
                  data: analyticsData.averageScorePerFolder.map(
                    (item) => item.averageScore
                  ),
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>

        {/* Interview Prep: Performance Trend */}
        {interviewData && (
          <div className="md:col-span-2 col-span-1">
            <h2 className="text-xl font-semibold mb-2">Interview Prep Trend</h2>
            <div className="text-sm text-gray-600 mb-3">
              Average: {interviewData.averageScore}% • Latest:{" "}
              {interviewData.latestScore ?? "-"}% • Total Answered:{" "}
              {interviewData.totalQuestionsAnswered}
            </div>
            <Line
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text: "Interview Average Score Over Time",
                  },
                },
              }}
              data={{
                labels: interviewData.performanceTrend.map((p) =>
                  new Date(p.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: "Interview Avg%",
                    data: interviewData.performanceTrend.map(
                      (p) => p.averageScore
                    ),
                    borderColor: "rgb(99, 102, 241)",
                    backgroundColor: "rgba(99, 102, 241, 0.4)",
                    tension: 0.2,
                  },
                ],
              }}
            />
          </div>
        )}

        {/* AI Insights */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Personalized Recommendations
          </h2>
          <p className="text-gray-700">{analyticsData.aiInsights}</p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => (
  <ErrorBoundary>
    <AnalyticsPageContent />
  </ErrorBoundary>
);

export default AnalyticsPage;
