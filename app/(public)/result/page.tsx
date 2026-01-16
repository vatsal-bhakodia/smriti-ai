"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResultAPIResponse, ProcessedData } from "./types";
import StudentHeader from "@/components/result/StudentHeader";
import GradeDistributionChart from "@/components/result/GradeDistributionChart";
import GPATrendChart from "@/components/result/GPATrendChart";
import SemesterSummaryTable from "@/components/result/SemesterSummaryTable";
import DetailedResultsTable from "@/components/result/DetailedResultsTable";
import NativeBanner from "@/components/ads/NativeBanner";
import PopunderScript from "@/components/ads/PopunderScript";
import { Loader2 } from "lucide-react";

export default function ResultsPage() {
  const [rawResults, setRawResults] = useState<ResultAPIResponse[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | "OVERALL">(
    "OVERALL"
  );

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
        // Use eugpa directly from the response (all subjects in a semester have the same eugpa)
        const sgpa = subjects[0]?.eugpa || 0;
        const totalMarks = subjects.reduce(
          (sum, sub) => sum + (parseFloat(sub.moderatedprint) || 0),
          0
        );
        const credits = subjects.reduce((sum, sub) => {
          const isLab = sub.papername.toLowerCase().includes("lab");
          return sum + (isLab ? 1 : 3);
        }, 0);

        return { euno, subjects, totalMarks, sgpa, credits };
      })
      .sort((a, b) => a.euno - b.euno);

    // Get all grades for grade distribution
    const allGrades = rawResults.map((entry) => {
      const marks = parseFloat(entry.moderatedprint) || 0;
      // Simple grade calculation inline
      let grade = "F";
      if (marks >= 90) grade = "O";
      else if (marks >= 80) grade = "A+";
      else if (marks >= 70) grade = "A";
      else if (marks >= 60) grade = "B+";
      else if (marks >= 50) grade = "B";
      else if (marks >= 45) grade = "C";
      else if (marks >= 40) grade = "D";
      return grade;
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
      <div className="min-h-[70vh] bg-black bg-[radial-gradient(circle_at_1px_1px,rgba(132,204,22,0.15)_1px,transparent_0)] bg-[length:20px_20px] p-4">
        <div className="w-full max-w-7xl mb-6 mx-auto">
          {processedData ? (
            <div className="space-y-6">
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

              <StudentHeader
                data={processedData}
                selectedSemester={selectedSemester}
                onSemesterChange={setSelectedSemester}
              />

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GradeDistributionChart
                  data={processedData.gradeDistribution}
                />
                <GPATrendChart data={processedData.gpaTrend} />
              </div>

              <SemesterSummaryTable semesters={processedData.semesters} />

              <DetailedResultsTable
                results={filteredResults}
                selectedSemester={selectedSemester}
                semesters={processedData.semesters}
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
