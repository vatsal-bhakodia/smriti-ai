"use client";

import { useState, useEffect, useMemo } from "react";
import { ResultAPIResponse, ProcessedData, CreditsMap } from "@/types/result";
import {
  marksToGrade,
  marksToGradePoint,
  getSubjectCredits,
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

  // Extract subject credits directly from API result items (login API now embeds them)
  // Works for any program — the CMS DB returns credits for whatever subjects it has.
  const extractCredits = (results: ResultAPIResponse[]) => {
    try {
      // Try sessionStorage cache first (avoids redundant reprocessing on re-render)
      const cachedCredits = loadCachedCredits();
      if (cachedCredits && Object.keys(cachedCredits).length > 0) {
        setCreditsMap(cachedCredits);
        return;
      }

      // Extract credits embedded in each result item by the login API
      const credits: CreditsMap = {};
      results.forEach(r => {
        if (r.credits !== undefined && r.credits !== null) {
          credits[r.papercode] = { credits: r.credits };
        }
      });

      if (Object.keys(credits).length > 0) {
        setCreditsMap(credits);
        saveCachedCredits(credits);
      }
    } catch (error) {
      console.error("Error extracting subject credits:", error);
    }
  };

  // Fetch credits when results change
  useEffect(() => {
    if (rawResults.length > 0) {
      extractCredits(rawResults);
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

        const totalMarks = filteredSubjects.reduce(
          (sum, sub) => sum + (parseFloat(sub.moderatedprint) || 0),
          0
        );
        // Calculate credits + SGPA from marks × credits (eugpa is now 0 from API)
        let semesterCredits = 0;
        let weightedGradePoints = 0;
        let semAllCreditsKnown = true;
        for (const sub of filteredSubjects) {
          const subCredits = getSubjectCredits(sub, creditsMap, programName);
          if (subCredits === null) {
            hasCompleteCredits = false;
            semAllCreditsKnown = false;
          } else {
            const gp = marksToGradePoint(parseFloat(sub.moderatedprint) || 0);
            weightedGradePoints += gp * subCredits.total;
            semesterCredits += subCredits.total;
          }
        }

        // SGPA = Σ(GP × credits) / Σcredits for this semester
        const sgpa = semesterCredits > 0 ? weightedGradePoints / semesterCredits : 0;

        return { euno, subjects, filteredSubjects, totalMarks, sgpa, credits: semesterCredits, allCreditsKnown: semAllCreditsKnown };
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
