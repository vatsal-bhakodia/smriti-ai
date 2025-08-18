"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

interface ApiResponse {
  currentStreak: number;
}

interface LoginStreakProps {
  days?: number;
}

export default function LoginStreakCard({ days = 90 }: LoginStreakProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Define milestone goals
  const milestones = [
    { days: 7, label: "1 Week" },
    { days: 14, label: "2 Weeks" },
    { days: 30, label: "1 Month" },
    { days: 60, label: "2 Months" },
    { days: 90, label: "3 Months" },
    { days: 180, label: "6 Months" },
    { days: 365, label: "1 Year" },
  ];

  // Find current goal and progress
  const getCurrentGoal = () => {
    const nextMilestone = milestones.find(
      (milestone) => currentStreak < milestone.days
    );
    return nextMilestone || milestones[milestones.length - 1];
  };

  const currentGoal = getCurrentGoal();
  const progressPercentage = Math.min(
    (currentStreak / currentGoal.days) * 100,
    100
  );

  // Calculate growth trend (simplified example)
  const getGrowthTrend = () => {
    if (currentStreak >= 30) return "Excellent!";
    if (currentStreak >= 14) return "Great progress";
    if (currentStreak >= 7) return "Building habit";
    return "Getting started";
  };

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/user-login?days=${days}`
        );
        setCurrentStreak(response.data.currentStreak);
      } catch (error) {
        console.error("Error fetching streak:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreak();
  }, [days]);

 if (isLoading) {
  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-all light:bg-white light:border light:border-gray-200">
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="bg-muted/50 light:bg-gray-100 rounded-lg p-3">
            <CalendarCheck className="text-primary light:text-lime-600 h-5 w-5" />
          </div>
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground light:text-gray-900">Study Streak</p>
              <span className="text-xs font-medium text-primary light:text-lime-600 bg-primary/10 light:bg-lime-100 px-3 py-1 rounded-full">
                Loading...
              </span>
            </div>
            <p className="text-xl font-bold text-muted-foreground light:text-gray-700">--</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

return (
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-all light:bg-white light:border light:border-gray-200">
    <CardContent>
      <div className="flex items-center gap-4">
        <div className="bg-muted/50 light:bg-gray-100 rounded-lg p-3">
          <CalendarCheck className="text-primary light:text-lime-600 h-5 w-5" />
        </div>
        <div className="space-y-1 w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground light:text-gray-900">Study Streak</p>
            <span className="text-xs font-medium text-[#adff2f] bg-[#adff2f]/10 px-3 py-1 rounded-full flex items-center gap-1 border border-[#adff2f]/20 light:text-lime-600 light:bg-lime-100 light:border-lime-200">
              {getGrowthTrend()}
            </span>
          </div>
          <p className="text-xl font-bold text-[#adff2f] light:text-lime-600">
            {currentStreak} days
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full bg-muted light:bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary light:bg-lime-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-right text-xs text-muted-foreground light:text-gray-700 mt-1">
          {Math.round(progressPercentage)}% to {currentGoal.label}
        </p>
      </div>
    </CardContent>
  </Card>
);

}
