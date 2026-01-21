"use client";

import { useState, useEffect, useMemo } from "react";
import { ResultAPIResponse, ProcessedData, CreditsMap } from "@/types/result";
import {
  marksToGrade,
  getSubjectCredits,
  checkAvailableCreditData,
  filterLatestAttempts,
  STORAGE_KEYS,
} from "@/utils/result";

// Re-export for backward compatibility
export { normalizeResultsPaperCodes, filterLatestAttempts } from "@/utils/result";

interface UseResultsDataReturn {
  rawResults: ResultAPIResponse[];
  setRawResults: React.Dispatch<React.SetStateAction<ResultAPIResponse[]>>;
  creditsMap: CreditsMap;
  processedData: ProcessedData | null;
  selectedSemester: number | "OVERALL";
  setSelectedSemester: React.Dispatch<React.SetStateAction<number | "OVERALL">>;
  filteredResults: ResultAPIResponse[];
  showMarksBreakdown: boolean;
  setShowMarksBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useResultsData(): UseResultsDataReturn {
  const [rawResults, setRawResults] = useState<ResultAPIResponse[]>([]);
  const [creditsMap, setCreditsMap] = useState<CreditsMap>({});
  const [selectedSemester, setSelectedSemester] = useState<number | "OVERALL">(
    "OVERALL"
  );
  const [showMarksBreakdown, setShowMarksBreakdown] = useState(true);

  // Load credits from sessionStorage
  const loadCachedCredits = (): CreditsMap | null => {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEYS.CREDITS_DATA);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Error loading cached credits:", error);
    }
    return null;
  };

  // Save credits to sessionStorage
  const saveCachedCredits = (credits: CreditsMap) => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.CREDITS_DATA, JSON.stringify(credits));
    } catch (error) {
      console.error("Error saving credits to cache:", error);
    }
  };

  // Fetch subject credits from CMS (only for programs with available credit data)
  const fetchCredits = async (results: ResultAPIResponse[]) => {
    try {
      // Check if we have credit data available for this program
      const programName = results[0]?.prgname || "";
      if (!checkAvailableCreditData(programName)) {
        // No credit data available for this program, skip API call
        return;
      }

      // Check sessionStorage first
      const cachedCredits = loadCachedCredits();
      if (cachedCredits && Object.keys(cachedCredits).length > 0) {
        setCreditsMap(cachedCredits);
        return;
      }

      // Get unique paper codes
      const paperCodes = [...new Set(results.map((r) => r.papercode))];

      if (paperCodes.length === 0) return;

      const response = await fetch("/api/result/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paperCodes }),
      });

      if (response.ok) {
        const data = await response.json();
        const credits = data.credits || {};
        setCreditsMap(credits);
        // Cache credits to sessionStorage
        saveCachedCredits(credits);
      }
    } catch (error) {
      console.error("Error fetching subject credits:", error);
    }
  };

  // Fetch credits when results change
  useEffect(() => {
    if (rawResults.length > 0) {
      fetchCredits(rawResults);
    }
  }, [rawResults]);

  // Process results data
  const processedData = useMemo<ProcessedData | null>(() => {
    if (!rawResults || rawResults.length === 0) return null;

    const firstEntry = rawResults[0];
    const programName = firstEntry.prgname || "";
    const semesterMap = new Map<number, ResultAPIResponse[]>();

    // Group by semester
    rawResults.forEach((entry) => {
      if (!semesterMap.has(entry.euno)) {
        semesterMap.set(entry.euno, []);
      }
      semesterMap.get(entry.euno)!.push(entry);
    });

    // Track if any subject is missing credits (only matters for non-B.Tech/BCA programs)
    let hasCompleteCredits = true;

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
        // Calculate credits using CMS data with fallback for B.Tech/BCA
        let semesterCredits = 0;
        for (const sub of filteredSubjects) {
          const subCredits = getSubjectCredits(sub, creditsMap, programName);
          if (subCredits === null) {
            hasCompleteCredits = false;
          } else {
            semesterCredits += subCredits.total;
          }
        }

        return { euno, subjects, filteredSubjects, totalMarks, sgpa, credits: semesterCredits };
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
    // Only calculate if all credits are known OR if there's only one semester (SGPA = CGPA)
    let cgpa: number | null = null;
    if (semesters.length === 1) {
      // If only one semester, SGPA equals CGPA
      cgpa = semesters[0].sgpa;
    } else if (hasCompleteCredits) {
      const totalCredits = semesters.reduce((sum, sem) => sum + sem.credits, 0);
      const weightedSGPA = semesters.reduce(
        (sum, sem) => sum + sem.sgpa * sem.credits,
        0
      );
      cgpa = totalCredits > 0 ? weightedSGPA / totalCredits : 0;
    }

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
      hasCompleteCredits,
      allResults: rawResults,
    };
  }, [rawResults, creditsMap]);

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

  return {
    rawResults,
    setRawResults,
    creditsMap,
    processedData,
    selectedSemester,
    setSelectedSemester,
    filteredResults,
    showMarksBreakdown,
    setShowMarksBreakdown,
  };
}
