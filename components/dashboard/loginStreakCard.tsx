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
          `/api/user/login?days=${days}`
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
      <Card className="rounded-xl shadow-sm hover:shadow-md transition-all">
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <CalendarCheck className="text-primary h-5 w-5" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Study Streak</p>
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Loading...
                </span>
              </div>
              <p className="text-xl font-bold">--</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-all">
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <CalendarCheck className="text-primary h-5 w-5" />
          </div>
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Study Streak</p>
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                {getGrowthTrend()}
              </span>
            </div>
            <p className="text-xl font-bold">{currentStreak} days</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-right text-xs text-muted-foreground mt-1">
            {Math.round(progressPercentage)}% to {currentGoal.label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
