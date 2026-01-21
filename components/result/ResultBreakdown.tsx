"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessedSemester } from "@/types/result";
import { getUniqueSubjectsLatestAttempt, calculateTotalMarks } from "@/utils/result";

interface ResultBreakdownProps {
  semesters: ProcessedSemester[];
}

interface SemesterRowData {
  euno: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  sgpa: number;
  credits: number;
}

export default function ResultBreakdown({
  semesters,
}: ResultBreakdownProps) {
  // Calculate semester data with unique subjects (latest attempt only)
  const semesterData: SemesterRowData[] = useMemo(() => {
    return semesters.map((sem) => {
      const uniqueSubjects = getUniqueSubjectsLatestAttempt(sem.subjects);
      const totalMarks = calculateTotalMarks(uniqueSubjects);
      const maxMarks = uniqueSubjects.length * 100;
      const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;

      return {
        euno: sem.euno,
        totalMarks,
        maxMarks,
        percentage,
        sgpa: sem.sgpa,
        credits: sem.credits,
      };
    }).sort((a, b) => a.euno - b.euno);
  }, [semesters]);

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Result Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-3 text-white font-semibold">
                  SEMESTER
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  TOTAL MARKS
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  PERCENTAGE
                </th>
                <th className="text-left p-3 text-white font-semibold">SGPA</th>
              </tr>
            </thead>
            <tbody>
              {semesterData.map((sem) => (
                <tr key={sem.euno} className="border-b border-zinc-800">
                  <td className="p-3 text-zinc-300">Sem {sem.euno}</td>
                  <td className="p-3 text-zinc-300">
                    {sem.totalMarks} / {sem.maxMarks}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {sem.percentage.toFixed(2)}%
                  </td>
                  <td className="p-3 text-primary font-semibold">
                    {sem.sgpa.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
