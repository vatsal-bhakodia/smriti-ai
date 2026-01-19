"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ProcessedSemester } from "@/types/result";

interface SemesterSummaryTableProps {
  semesters: ProcessedSemester[];
}

export default function SemesterSummaryTable({
  semesters,
}: SemesterSummaryTableProps) {
  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          SEMESTER SUMMARY
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
                <th className="text-left p-3 text-white font-semibold">SGPA</th>
                <th className="text-left p-3 text-white font-semibold">
                  CREDITS SECURED
                </th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((sem) => (
                <tr key={sem.euno} className="border-b border-zinc-800">
                  <td className="p-3 text-zinc-300">Sem {sem.euno}</td>
                  <td className="p-3 text-zinc-300">{sem.totalMarks}</td>
                  <td className="p-3 text-primary font-semibold">
                    {sem.sgpa.toFixed(2)}
                  </td>
                  <td className="p-3 text-zinc-300">{sem.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
