"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ResultAPIResponse, ProcessedData } from "./types";
import { calculateSGPA } from "./utils";
import LoginForm from "@/components/result/LoginForm";
import StudentHeader from "@/components/result/StudentHeader";
import GradeDistributionChart from "@/components/result/GradeDistributionChart";
import GPATrendChart from "@/components/result/GPATrendChart";
import SemesterSummaryTable from "@/components/result/SemesterSummaryTable";
import DetailedResultsTable from "@/components/result/DetailedResultsTable";

export default function ResultsPage() {
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);
  const [rawResults, setRawResults] = useState<ResultAPIResponse[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | "OVERALL">(
    "OVERALL"
  );
  const [error, setError] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        const sgpa = calculateSGPA(subjects);
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

    // Get CGPA (from first entry eugpa)
    const cgpa = firstEntry.eugpa || 0;

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

  // Fetch captcha image
  const fetchCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const response = await fetch("/api/result/captcha", {
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setCaptchaImage(imageUrl);
        setError("");
      } else {
        toast.error("Failed to load captcha. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching captcha:", error);
      toast.error("Failed to load captcha. Please try again.");
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
    return () => {
      if (captchaImage) {
        URL.revokeObjectURL(captchaImage);
      }
    };
  }, []);

  const handleRefreshCaptcha = () => {
    if (captchaImage) {
      URL.revokeObjectURL(captchaImage);
    }
    fetchCaptcha();
    setCaptcha("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!enrollmentNumber || !password || !captcha) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/result/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          enrollmentNumber,
          password,
          captcha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error ||
          data.message ||
          `Login failed with status ${response.status}. Please check your credentials.`;
        setError(errorMessage);
        toast.error(errorMessage);
        handleRefreshCaptcha();
        setIsLoading(false);
        return;
      }

      if (!data.results || data.results.length === 0) {
        const errorMessage =
          "No results found. Please check your enrollment number.";
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      setRawResults(data.results || []);
      setIsLoggedIn(true);
      setSelectedSemester("OVERALL");
      setError("");
      toast.success("Results fetched successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      handleRefreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRawResults([]);
    setEnrollmentNumber("");
    setPassword("");
    setCaptcha("");
    setSelectedSemester("OVERALL");
    setIsLoggedIn(false);
    handleRefreshCaptcha();
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(circle_at_1px_1px,rgba(132,204,22,0.15)_1px,transparent_0)] bg-[length:20px_20px] p-4">
      <div className="w-full max-w-7xl mx-auto">
        {!isLoggedIn ? (
          <LoginForm
            enrollmentNumber={enrollmentNumber}
            password={password}
            captcha={captcha}
            captchaImage={captchaImage}
            isLoading={isLoading}
            isLoadingCaptcha={isLoadingCaptcha}
            error={error}
            onEnrollmentChange={setEnrollmentNumber}
            onPasswordChange={setPassword}
            onCaptchaChange={setCaptcha}
            onRefreshCaptcha={handleRefreshCaptcha}
            onSubmit={handleSubmit}
          />
        ) : processedData ? (
          <div className="space-y-6">
            <StudentHeader
              data={processedData}
              selectedSemester={selectedSemester}
              onSemesterChange={setSelectedSemester}
            />

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GradeDistributionChart data={processedData.gradeDistribution} />
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
          <Card className="bg-zinc-900/95 border-zinc-800 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center text-zinc-400">
              No results available
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
