"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Flame } from "lucide-react";

interface ApiResponse {
  currentStreak: number;
}

interface LoginStreakProps {
  days?: number;
}

export default function LoginStreak({ days = 90 }: LoginStreakProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
    <Card className="pt-3 pb-0 gap-3 light:bg-white light:border light:border-gray-200">
      <div className="flex items-center gap-4 px-4">
        <div className="bg-muted/50 light:bg-gray-100 rounded-lg p-3">
          <CalendarCheck className="text-primary light:text-lime-600 h-5 w-5" />
        </div>
        <div className="space-y-1 w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm light:text-gray-900">Study Consistency</p>
            <span className="text-xs font-medium text-primary light:text-lime-600 bg-primary/10 light:bg-lime-100 px-3 py-1 rounded-full">
              Loading...
            </span>
          </div>
        </div>
      </div>
      <CardContent className="px-2">
        <div className="flex items-center justify-center h-[80px]">
          <div className="text-center">
            <div className="text-4xl font-bold text-muted-foreground light:text-gray-700 mb-1">
              --
            </div>
            <div className="text-sm text-muted-foreground light:text-gray-700">
              days streak
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

return (
  <Card className="pt-3 pb-0 gap-3 light:bg-white light:border light:border-gray-200">
    <div className="flex items-center gap-4 px-4">
      <div className="bg-muted/50 light:bg-gray-100 rounded-lg p-3">
        <CalendarCheck className="text-primary light:text-lime-600 h-5 w-5" />
      </div>
      <div className="space-y-1 w-full">
        <div className="flex items-center justify-between">
          <p className="text-sm light:text-gray-900">Study Consistency</p>
          <span className="text-xs font-medium text-[#adff2f] bg-[#adff2f]/10 px-3 py-1 rounded-full flex items-center gap-1 border border-[#adff2f]/20 light:text-lime-600 light:bg-lime-100 light:border-lime-200">
            <Flame className="h-3 w-3" />
            {currentStreak} {currentStreak === 1 ? "day" : "days"} streak
          </span>
        </div>
      </div>
    </div>
    <CardContent className="px-2">
      <div className="flex items-center justify-center h-[80px]">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#adff2f] light:text-lime-600 mb-1">
            {currentStreak}
          </div>
          <div className="text-sm text-muted-foreground light:text-gray-700">
            {currentStreak === 1 ? "day" : "days"} streak
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

}
