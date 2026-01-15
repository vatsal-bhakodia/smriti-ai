"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ResultAPIResponse,
  ProcessedSemester,
} from "../../app/(public)/result/types";
import { marksToGrade } from "../../app/(public)/result/utils";

interface DetailedResultsTableProps {
  results: ResultAPIResponse[];
  selectedSemester: number | "OVERALL";
  semesters: ProcessedSemester[];
}

export default function DetailedResultsTable({
  results,
  selectedSemester,
  semesters,
}: DetailedResultsTableProps) {
  const getGradeBadgeClass = (grade: string) => {
    switch (grade) {
      case "O":
        return "bg-primary/20 text-primary";
      case "A+":
        return "bg-green-500/20 text-green-400";
      case "A":
        return "bg-blue-500/20 text-blue-400";
      case "B+":
        return "bg-cyan-500/20 text-cyan-400";
      case "B":
        return "bg-yellow-500/20 text-yellow-400";
      case "C":
        return "bg-orange-500/20 text-orange-400";
      case "P":
        return "bg-zinc-500/20 text-zinc-400";
      default:
        return "bg-red-500/20 text-red-400";
    }
  };

  if (selectedSemester === "OVERALL") {
    // Group by semester
    const groupedBySemester: Record<number, ResultAPIResponse[]> = {};
    results.forEach((result) => {
      if (!groupedBySemester[result.euno]) {
        groupedBySemester[result.euno] = [];
      }
      groupedBySemester[result.euno].push(result);
    });

    const sortedSemesters = Object.keys(groupedBySemester)
      .map(Number)
      .sort((a, b) => a - b);

    return (
      <Card className="bg-zinc-900/95 border-zinc-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            DETAILED RESULTS - ALL SEMESTERS
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Showing all {results.length} subjects across all semesters
          </p>
          <div className="overflow-x-auto space-y-6">
            {sortedSemesters.map((semNum) => {
              const semResults = groupedBySemester[semNum];
              const semData = semesters.find((s) => s.euno === semNum);

              return (
                <div
                  key={semNum}
                  className="border border-zinc-800 rounded-lg overflow-hidden"
                >
                  {/* Semester Header */}
                  <div className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-700">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-white font-semibold text-lg">
                        SEMESTER {semNum}
                      </h4>
                      {semData && (
                        <div className="flex gap-4 text-sm">
                          <span className="text-zinc-400">
                            Total:{" "}
                            <span className="text-white font-medium">
                              {semData.totalMarks}
                            </span>
                          </span>
                          <span className="text-zinc-400">
                            SGPA:{" "}
                            <span className="text-primary font-semibold">
                              {semData.sgpa.toFixed(2)}
                            </span>
                          </span>
                          <span className="text-zinc-400">
                            Credits:{" "}
                            <span className="text-white font-medium">
                              {semData.credits}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Semester Table */}
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-700 bg-zinc-900/50">
                        <th className="text-left p-3 text-white font-semibold">
                          PAPER CODE
                        </th>
                        <th className="text-left p-3 text-white font-semibold">
                          SUBJECT NAME
                        </th>
                        <th className="text-center p-3 text-white font-semibold">
                          INTERNAL
                        </th>
                        <th className="text-center p-3 text-white font-semibold">
                          EXTERNAL
                        </th>
                        <th className="text-center p-3 text-white font-semibold">
                          TOTAL
                        </th>
                        <th className="text-center p-3 text-white font-semibold">
                          GRADE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {semResults.map((result, index) => {
                        const totalMarks =
                          parseFloat(result.moderatedprint) || 0;
                        const grade = marksToGrade(totalMarks);
                        return (
                          <tr
                            key={`${result.papercode}-${index}`}
                            className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                          >
                            <td className="p-3 text-zinc-300 font-mono text-sm">
                              {result.papercode}
                            </td>
                            <td className="p-3 text-zinc-200">
                              {result.papername}
                            </td>
                            <td className="p-3 text-center text-zinc-300">
                              {result.minorprint === "-"
                                ? "-"
                                : result.minorprint}
                            </td>
                            <td className="p-3 text-center text-zinc-300">
                              {result.majorprint}
                            </td>
                            <td className="p-3 text-center text-white font-semibold">
                              {result.moderatedprint}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-2 py-1 rounded text-sm font-semibold ${getGradeBadgeClass(
                                  grade
                                )}`}
                              >
                                {grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Single semester view
  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          SEMESTER {selectedSemester} - DETAILED RESULTS
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Showing {results.length} subjects
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-3 text-white font-semibold">
                  PAPER CODE
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  SUBJECT NAME
                </th>
                <th className="text-center p-3 text-white font-semibold">
                  MINOR
                </th>
                <th className="text-center p-3 text-white font-semibold">
                  MAJOR
                </th>
                <th className="text-center p-3 text-white font-semibold">
                  TOTAL
                </th>
                <th className="text-center p-3 text-white font-semibold">
                  GRADE
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                const totalMarks = parseFloat(result.moderatedprint) || 0;
                const grade = marksToGrade(totalMarks);
                return (
                  <tr
                    key={`${result.papercode}-${index}`}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="p-3 text-zinc-300 font-mono text-sm">
                      {result.papercode}
                    </td>
                    <td className="p-3 text-zinc-200">{result.papername}</td>
                    <td className="p-3 text-center text-zinc-300">
                      {result.minorprint === "-" ? "-" : result.minorprint}
                    </td>
                    <td className="p-3 text-center text-zinc-300">
                      {result.majorprint}
                    </td>
                    <td className="p-3 text-center text-white font-semibold">
                      {result.moderatedprint}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${getGradeBadgeClass(
                          grade
                        )}`}
                      >
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {results.length === 0 && (
            <div className="text-center py-8 text-zinc-400">
              No subjects found for the selected semester
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
