"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ResultAPIResponse, ProcessedData } from "./types";
import { marksToGrade } from "./utils";
import StudentHeader from "@/components/result/StudentHeader";
import GradeDistributionChart from "@/components/result/GradeDistributionChart";
import GPATrendChart from "@/components/result/GPATrendChart";
import SemesterSummaryTable from "@/components/result/SemesterSummaryTable";
import DetailedResultsTable from "@/components/result/DetailedResultsTable";
import SemesterStatsCard from "@/components/result/SemesterStatsCard";
import SemesterBarChart from "@/components/result/SemesterBarChart";
import GradeCircleChart from "@/components/result/GradeCircleChart";
import NativeBanner from "@/components/ads/NativeBanner";
import PopunderScript from "@/components/ads/PopunderScript";
import { Loader2 } from "lucide-react";

// Filter to only keep latest attempt for each subject code
function filterLatestAttempts(
  subjects: ResultAPIResponse[]
): ResultAPIResponse[] {
  const subjectMap = new Map<string, ResultAPIResponse>();

  subjects.forEach((subject) => {
    const existing = subjectMap.get(subject.papercode);

    if (!existing) {
      // First occurrence of this subject code
      subjectMap.set(subject.papercode, subject);
    } else {
      // Compare dates to find the latest attempt
      const existingDate = existing.declareddate
        ? new Date(existing.declareddate)
        : new Date(existing.ryear, existing.rmonth - 1);
      const currentDate = subject.declareddate
        ? new Date(subject.declareddate)
        : new Date(subject.ryear, subject.rmonth - 1);

      // If current date is later or if dates are equal but current has better marks
      if (
        currentDate > existingDate ||
        (currentDate.getTime() === existingDate.getTime() &&
          (parseFloat(subject.moderatedprint) || 0) >
            (parseFloat(existing.moderatedprint) || 0))
      ) {
        subjectMap.set(subject.papercode, subject);
      }
    }
  });

  return Array.from(subjectMap.values());
}

export default function ResultsPage() {
  const [rawResults, setRawResults] = useState<ResultAPIResponse[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | "OVERALL">(
    "OVERALL"
  );
  const [showMarksBreakdown, setShowMarksBreakdown] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Process results data
  const processedData = useMemo<ProcessedData | null>(() => {
    if (!rawResults || rawResults.length === 0) return null;

    const firstEntry = rawResults[0];
    const semesterMap = new Map<number, ResultAPIResponse[]>();

    // Group by semester
    rawResults.forEach((entry) => {
      if (!semesterMap.has(entry.euno)) {
        semesterMap.set(entry.euno, []);
      }
      semesterMap.get(entry.euno)!.push(entry);
    });

    // Process each semester
    const semesters = Array.from(semesterMap.entries())
      .map(([euno, subjects]) => {
        // Filter to keep only latest attempts for credit calculation
        const filteredSubjects = filterLatestAttempts(subjects);

        // Use eugpa directly from the response (all subjects in a semester have the same eugpa)
        const sgpa = subjects[0]?.eugpa || 0;
        const totalMarks = filteredSubjects.reduce(
          (sum, sub) => sum + (parseFloat(sub.moderatedprint) || 0),
          0
        );
        // Calculate credits only from latest attempts (no duplicates)
        const credits = filteredSubjects.reduce((sum, sub) => {
          const isLab = sub.papername.toLowerCase().includes("lab");
          return sum + (isLab ? 1 : 3);
        }, 0);

        return { euno, subjects, filteredSubjects, totalMarks, sgpa, credits };
      })
      .sort((a, b) => a.euno - b.euno);

    // Get all grades for grade distribution (using only latest attempts)
    // First filter all results to get latest attempts only
    const allLatestAttempts = filterLatestAttempts(rawResults);
    const allGrades = allLatestAttempts.map((entry) => {
      const marks = parseFloat(entry.moderatedprint) || 0;
      return marksToGrade(marks);
    });

    // Count grade frequency
    const gradeCount: Record<string, number> = {};
    allGrades.forEach((grade) => {
      gradeCount[grade] = (gradeCount[grade] || 0) + 1;
    });

    const gradeDistribution = Object.entries(gradeCount).map(
      ([grade, count]) => ({
        grade,
        count,
      })
    );

    // GPA trend data
    const gpaTrend = semesters.map((sem) => ({
      semester: `Sem ${sem.euno}`,
      sgpa: sem.sgpa,
    }));

    // Calculate CGPA from SGPA values (weighted by credits)
    const totalCredits = semesters.reduce((sum, sem) => sum + sem.credits, 0);
    const weightedSGPA = semesters.reduce(
      (sum, sem) => sum + sem.sgpa * sem.credits,
      0
    );
    const cgpa = totalCredits > 0 ? weightedSGPA / totalCredits : 0;

    return {
      studentInfo: {
        name: firstEntry.stname || "",
        enrollmentNumber: firstEntry.nrollno || "",
        institute: firstEntry.iname || "",
        instituteCode: firstEntry.icode || "",
        program: firstEntry.prgname || "",
        programCode: firstEntry.prgcode || "",
        yearOfAdmission: firstEntry.yoa || firstEntry.byoa || 0,
      },
      semesters,
      gradeDistribution,
      gpaTrend,
      cgpa,
      allResults: rawResults,
    };
  }, [rawResults]);

  // Filter results based on selected semester
  const filteredResults = useMemo(() => {
    if (!processedData) return [];

    if (selectedSemester === "OVERALL") {
      return processedData.allResults;
    }

    const semester = processedData.semesters.find(
      (s) => s.euno === selectedSemester
    );
    return semester ? semester.subjects : [];
  }, [processedData, selectedSemester]);

  // Detect mobile/desktop and set default for showMarksBreakdown (only on initial load)
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    // Set initial default based on screen size
    const initialMobile = window.innerWidth < 1024;
    setIsMobile(initialMobile);
    // On mobile, default to hidden; on desktop, default to shown
    setShowMarksBreakdown(!initialMobile);

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Load results from sessionStorage on mount
  useEffect(() => {
    const storedResults = sessionStorage.getItem("resultData");
    if (storedResults) {
      try {
        const results: ResultAPIResponse[] = JSON.parse(storedResults);
        setRawResults(results);
      } catch (error) {
        console.error("Error parsing stored results:", error);
        // If there's an error, redirect to login
        window.location.replace("/result/login");
      }
    } else {
      // No results found, redirect to login
      window.location.replace("/result/login");
    }
  }, []);

  const handleReset = () => {
    sessionStorage.removeItem("resultData");
    setRawResults([]);
    setSelectedSemester("OVERALL");
    window.location.replace("/result/login");
  };

  return (
    <>
      <PopunderScript />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#a3ff19 1px, transparent 1px), linear-gradient(90deg, #a3ff19 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="min-h-[70vh] p-4 relative">
        <div className="w-full max-w-7xl mb-6 mx-auto">
          {processedData ? (
            <div className="space-y-6">
              <StudentHeader
                data={processedData}
                selectedSemester={selectedSemester}
                onSemesterChange={setSelectedSemester}
                onReset={handleReset}
              />

              {selectedSemester === "OVERALL" ? (
                <>
                  {/* Charts Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GPATrendChart data={processedData.gpaTrend} />
                    <GradeDistributionChart
                      data={processedData.gradeDistribution}
                    />
                  </div>
                  <SemesterSummaryTable semesters={processedData.semesters} />
                </>
              ) : (
                <>
                  {/* Semester-specific views */}
                  {(() => {
                    const currentSemester = processedData.semesters.find(
                      (s) => s.euno === selectedSemester
                    );
                    if (!currentSemester) return null;

                    const maxMarks =
                      currentSemester.filteredSubjects.length * 100;
                    const percentage =
                      (currentSemester.totalMarks / maxMarks) * 100;

                    return (
                      <>
                        {/* Stats Summary */}
                        <SemesterStatsCard
                          totalMarks={currentSemester.totalMarks}
                          maxMarks={maxMarks}
                          sgpa={currentSemester.sgpa}
                          percentage={percentage}
                          totalCredits={currentSemester.credits}
                        />

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <SemesterBarChart
                            subjects={currentSemester.filteredSubjects}
                          />
                          {/* Grade Distribution */}
                          <GradeCircleChart
                            subjects={currentSemester.filteredSubjects}
                          />
                        </div>
                      </>
                    );
                  })()}
                </>
              )}

              {/* Toggle for showing/hiding marks breakdown */}
              <Card className="bg-zinc-900/95 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="marks-breakdown-toggle"
                        className="text-sm font-medium text-white cursor-pointer"
                      >
                        Show Internal & External Marks
                      </label>
                      <p className="text-xs text-zinc-400">
                        Toggle to view detailed marks breakdown
                      </p>
                    </div>
                    <Switch
                      id="marks-breakdown-toggle"
                      checked={showMarksBreakdown}
                      onCheckedChange={setShowMarksBreakdown}
                    />
                  </div>
                </CardContent>
              </Card>

              <DetailedResultsTable
                results={filteredResults}
                selectedSemester={selectedSemester}
                semesters={processedData.semesters}
                showMarksBreakdown={showMarksBreakdown}
              />

              {/* Back Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                >
                  Check Another Result
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-[70vh] flex items-center justify-center">
              <Card className="bg-zinc-900/95 border-zinc-800 max-w-md mx-auto shadow-2xl backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-6">
                    {/* Animated Spinner */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-lime-500/20 blur-xl animate-pulse"></div>
                      <div className="relative bg-zinc-800 rounded-full p-4 border border-zinc-700">
                        <Loader2 className="w-12 h-12 text-lime-500 animate-spin" />
                      </div>
                    </div>

                    {/* Loading Text */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">
                        Loading Results
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Please wait while we fetch your data...
                      </p>
                    </div>

                    {/* Animated Dots */}
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <NativeBanner />
      </div>
    </>
  );
}
