"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResultAPIResponse,
  ProcessedSemester,
} from "../../app/(public)/result/types";
import { marksToGrade } from "../../app/(public)/result/utils";

interface DetailedResultsTableProps {
  results: ResultAPIResponse[];
  selectedSemester: number | "OVERALL";
  semesters: ProcessedSemester[];
  showMarksBreakdown?: boolean;
}

export default function DetailedResultsTable({
  results,
  selectedSemester,
  semesters,
  showMarksBreakdown = true,
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
                  <div className="-mx-4 px-4">
                    <Table className="w-full min-w-[600px]">
                      <TableHeader>
                        <TableRow className="border-b border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900/50">
                          {/* Mobile: Combined column, Desktop: Separate columns */}
                          <TableHead className="text-left p-3 text-white font-semibold md:hidden w-[180px]">
                            SUBJECT
                          </TableHead>
                          <TableHead className="text-left p-3 text-white font-semibold hidden md:table-cell">
                            PAPER CODE
                          </TableHead>
                          <TableHead className="text-left p-3 text-white font-semibold hidden md:table-cell">
                            SUBJECT NAME
                          </TableHead>
                          {showMarksBreakdown && (
                            <>
                              <TableHead className="text-center p-3 text-white font-semibold hidden md:table-cell">
                                INTERNAL
                              </TableHead>
                              <TableHead className="text-center p-3 text-white font-semibold hidden md:table-cell">
                                EXTERNAL
                              </TableHead>
                            </>
                          )}
                          <TableHead className="text-center p-3 text-white font-semibold w-[70px]">
                            TOTAL
                          </TableHead>
                          <TableHead className="text-center p-3 text-white font-semibold">
                            GRADE
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semResults.map((result, index) => {
                          const totalMarks =
                            parseFloat(result.moderatedprint) || 0;
                          const grade = marksToGrade(totalMarks);
                          return (
                            <TableRow
                              key={`${result.papercode}-${index}`}
                              className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                            >
                              {/* Mobile: Combined column */}
                              <TableCell className="p-3 text-zinc-200 md:hidden min-w-0 max-w-[200px]">
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs text-zinc-400 font-mono mb-1">
                                    {result.papercode}
                                  </span>
                                  <span className="text-sm md:text-base text-wrap">
                                    {result.papername}
                                  </span>
                                </div>
                              </TableCell>
                              {/* Desktop: Separate columns */}
                              <TableCell className="p-3 text-zinc-300 font-mono text-sm hidden md:table-cell">
                                {result.papercode}
                              </TableCell>
                              <TableCell className="p-3 text-zinc-200 hidden md:table-cell">
                                {result.papername}
                              </TableCell>
                              {showMarksBreakdown && (
                                <>
                                  <TableCell className="p-3 text-center text-zinc-300 hidden md:table-cell">
                                    {result.minorprint === "-"
                                      ? "-"
                                      : result.minorprint}
                                  </TableCell>
                                  <TableCell className="p-3 text-center text-zinc-300 hidden md:table-cell">
                                    {result.majorprint}
                                  </TableCell>
                                </>
                              )}
                              <TableCell className="p-3 text-center text-white font-semibold">
                                {result.moderatedprint}
                              </TableCell>
                              <TableCell className="p-3 text-center">
                                <span
                                  className={`px-2 py-1 rounded text-sm font-semibold ${getGradeBadgeClass(
                                    grade
                                  )}`}
                                >
                                  {grade}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
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
        <div className="-mx-6 px-6">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              <TableRow className="border-b border-zinc-700 hover:bg-transparent">
                {/* Mobile: Combined column, Desktop: Separate columns */}
                <TableHead className="text-left p-3 text-white font-semibold md:hidden w-[180px]">
                  SUBJECT
                </TableHead>
                <TableHead className="text-left p-3 text-white font-semibold hidden md:table-cell">
                  PAPER CODE
                </TableHead>
                <TableHead className="text-left p-3 text-white font-semibold hidden md:table-cell">
                  SUBJECT NAME
                </TableHead>
                {showMarksBreakdown && (
                  <>
                    <TableHead className="text-center p-3 text-white font-semibold hidden md:table-cell">
                      MINOR
                    </TableHead>
                    <TableHead className="text-center p-3 text-white font-semibold hidden md:table-cell">
                      MAJOR
                    </TableHead>
                  </>
                )}
                <TableHead className="text-center p-3 text-white font-semibold w-[70px]">
                  TOTAL
                </TableHead>
                <TableHead className="text-center p-3 text-white font-semibold">
                  GRADE
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => {
                const totalMarks = parseFloat(result.moderatedprint) || 0;
                const grade = marksToGrade(totalMarks);
                return (
                  <TableRow
                    key={`${result.papercode}-${index}`}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    {/* Mobile: Combined column */}
                    <TableCell className="p-3 text-zinc-200 md:hidden min-w-0 max-w-[200px]">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-zinc-400 font-mono mb-1 break-words">
                          {result.papercode}
                        </span>
                        <span className="text-sm md:text-base text-wrap">
                          {result.papername}
                        </span>
                      </div>
                    </TableCell>
                    {/* Desktop: Separate columns */}
                    <TableCell className="p-3 text-zinc-300 font-mono text-sm hidden md:table-cell">
                      {result.papercode}
                    </TableCell>
                    <TableCell className="p-3 text-zinc-200 hidden md:table-cell">
                      {result.papername}
                    </TableCell>
                    {showMarksBreakdown && (
                      <>
                        <TableCell className="p-3 text-center text-zinc-300 hidden md:table-cell">
                          {result.minorprint === "-" ? "-" : result.minorprint}
                        </TableCell>
                        <TableCell className="p-3 text-center text-zinc-300 hidden md:table-cell">
                          {result.majorprint}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="p-3 text-center text-white font-semibold w-[70px]">
                      {result.moderatedprint}
                    </TableCell>
                    <TableCell className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${getGradeBadgeClass(
                          grade
                        )}`}
                      >
                        {grade}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
