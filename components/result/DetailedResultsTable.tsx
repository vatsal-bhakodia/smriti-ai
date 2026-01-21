"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  CreditsMap,
} from "@/types/result";
import { marksToGrade, getSubjectCredits, getUniqueSubjectsLatestAttempt, calculateTotalMarks, calculateSemesterCreditsFromSubjects } from "@/utils/result";
import { ManualCreditsData } from "./CGPACalculatorModal";

interface DetailedResultsTableProps {
  results: ResultAPIResponse[];
  selectedSemester: number | "OVERALL";
  semesters: ProcessedSemester[];
  showMarksBreakdown?: boolean;
  onToggleMarksBreakdown?: (value: boolean) => void;
  creditsMap?: CreditsMap;
  programName?: string;
  hasCreditsData?: boolean;
  manualCredits?: ManualCreditsData | null;
}

// Reusable table component for displaying results
interface ResultsTableProps {
  results: ResultAPIResponse[];
  showMarksBreakdown: boolean;
  creditsMap: CreditsMap;
  programName: string;
  getGradeBadgeClass: (grade: string) => string;
  hasCreditsData: boolean;
  manualCredits?: ManualCreditsData | null;
}

function ResultsTable({
  results,
  showMarksBreakdown,
  creditsMap,
  programName,
  getGradeBadgeClass,
  hasCreditsData,
  manualCredits,
}: ResultsTableProps) {
  // Helper to get credits for a subject
  const getCreditsForSubject = (result: ResultAPIResponse, euno: number): number | null => {
    // If manual credits exist and it's subject mode, use those
    if (manualCredits?.type === "subject") {
      const key = `${euno}-${result.papercode}`;
      const credits = manualCredits.subjectCredits?.[key];
      if (credits && credits > 0) return credits;
    }
    
    // Otherwise use CMS credits
    const credits = getSubjectCredits(result, creditsMap, programName);
    return credits ? credits.total : null;
  };

  // Only show credits column if hasCreditsData AND (no manual credits OR manual credits are subject-level)
  const showCreditsColumn = hasCreditsData && (!manualCredits || manualCredits.type === "subject");

  return (
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
          {showCreditsColumn && (
            <TableHead className="text-center p-3 text-white font-semibold hidden md:table-cell">
              CREDITS
            </TableHead>
          )}
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
        {results.map((result, index) => {
          const totalMarks = parseFloat(result.moderatedprint) || 0;
          const grade = marksToGrade(totalMarks);
          const credits = getCreditsForSubject(result, result.euno);
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
              {showCreditsColumn && (
                <TableCell className="p-3 text-center text-zinc-300 hidden md:table-cell">
                  {credits !== null ? (
                    <span>{credits}</span>
                  ) : (
                    <span className="text-zinc-500" title="Credit not found">
                      -
                    </span>
                  )}
                </TableCell>
              )}
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
              <TableCell className="p-3 text-center text-white font-semibold">
                {result.moderatedprint}
              </TableCell>
              <TableCell className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${getGradeBadgeClass(grade)}`}
                >
                  {grade}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function DetailedResultsTable({
  results,
  selectedSemester,
  semesters,
  showMarksBreakdown = true,
  onToggleMarksBreakdown,
  creditsMap = {},
  programName = "",
  hasCreditsData = false,
  manualCredits,
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

  // Header component with toggle
  const renderHeader = (title: string, subtitle: string, toggleId: string) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-400">{subtitle}</p>
      </div>
      {onToggleMarksBreakdown && (
        <div className="flex items-center gap-3 shrink-0">
          <label
            htmlFor={toggleId}
            className="text-sm text-zinc-400 cursor-pointer"
          >
            Show Marks Breakdown
          </label>
          <Switch
            id={toggleId}
            checked={showMarksBreakdown}
            onCheckedChange={onToggleMarksBreakdown}
          />
        </div>
      )}
    </div>
  );

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
          {renderHeader(
            "DETAILED RESULTS - ALL SEMESTERS",
            `Showing all ${results.length} subjects across all semesters`,
            "marks-breakdown-toggle-overall"
          )}
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
                      {semData && (() => {
                        // Calculate max marks based on unique subjects
                        const uniqueSubjects = getUniqueSubjectsLatestAttempt(semResults);
                        const maxMarks = uniqueSubjects.length * 100;
                        return (
                          <div className="flex gap-4 text-sm">
                            <span className="text-zinc-400">
                              Total:{" "}
                              <span className="text-white font-medium">
                                {semData.totalMarks} / {maxMarks}
                              </span>
                            </span>
                            <span className="text-zinc-400">
                              SGPA:{" "}
                            <span className="text-primary font-semibold">
                              {semData.sgpa.toFixed(2)}
                            </span>
                          </span>
                          {(hasCreditsData || manualCredits !== null) && (
                            <span className="text-zinc-400">
                              Credits:{" "}
                              <span className="text-white font-medium">
                                {(() => {
                                  if (manualCredits?.type === "semester" && manualCredits.semesterCredits?.[semNum]) {
                                    return manualCredits.semesterCredits[semNum];
                                  } else if (manualCredits?.type === "subject" && manualCredits.subjectCredits) {
                                    // Calculate total from subject-level manual credits
                                    const uniqueSubjects = getUniqueSubjectsLatestAttempt(semData.subjects);
                                    return calculateSemesterCreditsFromSubjects(semNum, uniqueSubjects, manualCredits);
                                  } else if (hasCreditsData) {
                                    return semData.credits;
                                  }
                                  return "-";
                                })()}
                              </span>
                            </span>
                          )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Semester Table */}
                  <div className="-mx-4 px-4">
                    <ResultsTable
                      results={semResults}
                      showMarksBreakdown={showMarksBreakdown}
                      creditsMap={creditsMap}
                      programName={programName}
                      getGradeBadgeClass={getGradeBadgeClass}
                      hasCreditsData={hasCreditsData}
                      manualCredits={manualCredits}
                    />
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
        {renderHeader(
          `SEMESTER ${selectedSemester} - DETAILED RESULTS`,
          `Showing ${results.length} subjects`,
          "marks-breakdown-toggle-semester"
        )}
        <div className="-mx-6 px-6">
          <ResultsTable
            results={results}
            showMarksBreakdown={showMarksBreakdown}
            creditsMap={creditsMap}
            programName={programName}
            getGradeBadgeClass={getGradeBadgeClass}
            hasCreditsData={hasCreditsData}
            manualCredits={manualCredits}
          />
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
