"use client";

import { Card, CardContent } from "@/components/ui/card";

interface SemesterStatsCardProps {
  totalMarks: number;
  maxMarks: number;
  sgpa: number;
  percentage: number;
  totalCredits: number;
}

export default function SemesterStatsCard({
  totalMarks,
  maxMarks,
  sgpa,
  percentage,
  totalCredits,
}: SemesterStatsCardProps) {
  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* MARKS */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Marks
            </p>
            <p className="text-3xl font-bold text-primary">
              {totalMarks} <span className="text-xl text-zinc-500">/ {maxMarks}</span>
            </p>
            <p className="text-xs text-zinc-400">Total Marks Obtained</p>
          </div>

          {/* SGPA */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">SGPA</p>
            <p className="text-3xl font-bold text-primary">{sgpa.toFixed(3)}</p>
            <p className="text-xs text-zinc-400">Semester Grade Point Average</p>
          </div>

          {/* PERCENTAGE */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Percentage
            </p>
            <p className="text-3xl font-bold text-primary">
              {percentage.toFixed(2)}%
            </p>
            <p className="text-xs text-zinc-400">Percentage of Marks Obtained</p>
          </div>

          {/* TOTAL CREDITS */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Total Credits
            </p>
            <p className="text-3xl font-bold text-primary">{totalCredits}</p>
            <p className="text-xs text-zinc-400">Total Credits for the Semester</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
