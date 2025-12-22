"use client";

import { TopicsTable } from "@/components/dashboard/topics-table";
import LevelCard from "@/components/dashboard/levelCard";
import LoginStreakCard from "@/components/dashboard/loginStreakCard";
import PerformanceCard from "@/components/dashboard/performanceCard";
import { StudyReminder } from "@/components/dashboard/studyreminder";
import { Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 bg-background text-foreground">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back! 👋
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/analytics/">
              <Button variant="outline">
                <TrendingUp className="h-4 w-4" />
                <span className="md:block hidden">Analytics</span>
              </Button>
            </Link>
            <Link href="/folder/">
              <Button variant="default">
                <Plus className="h-4 w-4" />
                <span className="md:block hidden">New Folder</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Performance stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Stats Cards */}
          <LevelCard />

          {/* User Login Streak */}
          <LoginStreakCard />

          {/* performance Chart */}
          <PerformanceCard />
        </div>

        {/*Study Reminder Modal */}
        <StudyReminder />

        {/* Active Folders Table */}
        <TopicsTable />
      </div>
    </main>
  );
}
