"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessedSemester } from "@/types/result";
import {
  filterLatestAttempts,
  calculateTotalMarks,
  calculateSemesterCreditsFromSubjects,
} from "@/utils/result";
import { ManualCreditsData } from "./CGPACalculatorModal";

interface CumulativeResultBreakdownProps {
  semesters: ProcessedSemester[];
  manualCredits?: ManualCreditsData | null;
}

interface CumulativeRow {
  label: string;
  marks: string;
  percentage: string;
  gpa: string;
}

export default function CumulativeResultBreakdown({
  semesters,
  manualCredits,
}: CumulativeResultBreakdownProps) {
  // Sort semesters by semester number
  const sortedSemesters = useMemo(
    () => [...semesters].sort((a, b) => a.euno - b.euno),
    [semesters],
  );

  // Calculate cumulative semester data using unique subjects (latest attempt only)
  const semesterCumulativeData: CumulativeRow[] = useMemo(() => {
    const data: CumulativeRow[] = [];
    let cumulativeMarks = 0;
    let cumulativeMaxMarks = 0;
    let cumulativeCredits = 0;
    let cumulativeGradePoints = 0;

    sortedSemesters.forEach((sem, index) => {
      // Get unique subjects (latest attempt only)
      const uniqueSubjects = filterLatestAttempts(sem.subjects);
      const semesterMarks = calculateTotalMarks(uniqueSubjects);
      // Each unique subject has max 100 marks
      const semesterMaxMarks = uniqueSubjects.length * 100;

      cumulativeMarks += semesterMarks;
      cumulativeMaxMarks += semesterMaxMarks;

      // Calculate semester credits based on manual credits type
      let semCredits = sem.credits;
      if (
        manualCredits?.type === "semester" &&
        manualCredits.semesterCredits?.[sem.euno]
      ) {
        // Use semester-level manual credits
        semCredits = manualCredits.semesterCredits[sem.euno];
      } else if (
        manualCredits?.type === "subject" &&
        manualCredits.subjectCredits
      ) {
        // Calculate total from subject-level manual credits
        semCredits = calculateSemesterCreditsFromSubjects(
          sem.euno,
          uniqueSubjects,
          manualCredits,
        );
      }

      cumulativeCredits += semCredits;
      cumulativeGradePoints += sem.sgpa * semCredits;

      const cumulativeGPA =
        cumulativeCredits > 0 ? cumulativeGradePoints / cumulativeCredits : 0;
      const percentage =
        cumulativeMaxMarks > 0
          ? (cumulativeMarks / cumulativeMaxMarks) * 100
          : 0;

      // Generate label like "Sem 1", "Sem 1+2", "Sem 1+2+3", etc.
      const label =
        index === 0
          ? `Sem ${sem.euno}`
          : `Sem ${sortedSemesters
              .slice(0, index + 1)
              .map((s) => s.euno)
              .join("+")}`;

      data.push({
        label,
        marks: `${cumulativeMarks} / ${cumulativeMaxMarks}`,
        percentage: `${percentage.toFixed(2)} %`,
        gpa: cumulativeGPA.toFixed(2),
      });
    });

    return data;
  }, [sortedSemesters, manualCredits]);

  // Calculate year-wise cumulative data (2 semesters per year, only complete years)
  const yearCumulativeData: CumulativeRow[] = useMemo(() => {
    const data: CumulativeRow[] = [];
    let yearCumulativeMarks = 0;
    let yearCumulativeMaxMarks = 0;
    let yearCumulativeCredits = 0;
    let yearCumulativeGradePoints = 0;
    let yearCount = 0;

    // Group semesters by year (2 semesters per year)
    // Only include complete years (years with exactly 2 semesters)
    for (let i = 0; i + 1 < sortedSemesters.length; i += 2) {
      yearCount++;
      const yearSemesters = sortedSemesters.slice(i, i + 2);

      yearSemesters.forEach((sem) => {
        // Get unique subjects (latest attempt only)
        const uniqueSubjects = filterLatestAttempts(sem.subjects);
        const semesterMarks = calculateTotalMarks(uniqueSubjects);
        const semesterMaxMarks = uniqueSubjects.length * 100;

        yearCumulativeMarks += semesterMarks;
        yearCumulativeMaxMarks += semesterMaxMarks;

        // Calculate semester credits based on manual credits type
        let semCredits = sem.credits;
        if (
          manualCredits?.type === "semester" &&
          manualCredits.semesterCredits?.[sem.euno]
        ) {
          // Use semester-level manual credits
          semCredits = manualCredits.semesterCredits[sem.euno];
        } else if (
          manualCredits?.type === "subject" &&
          manualCredits.subjectCredits
        ) {
          // Calculate total from subject-level manual credits
          semCredits = calculateSemesterCreditsFromSubjects(
            sem.euno,
            uniqueSubjects,
            manualCredits,
          );
        }

        yearCumulativeCredits += semCredits;
        yearCumulativeGradePoints += sem.sgpa * semCredits;
      });

      const yearGPA =
        yearCumulativeCredits > 0
          ? yearCumulativeGradePoints / yearCumulativeCredits
          : 0;
      const yearPercentage =
        yearCumulativeMaxMarks > 0
          ? (yearCumulativeMarks / yearCumulativeMaxMarks) * 100
          : 0;

      // Generate label like "Year 1", "Year 1+2", etc.
      const yearLabel =
        yearCount === 1
          ? `Year ${yearCount}`
          : `Year ${Array.from({ length: yearCount }, (_, idx) => idx + 1).join("+")}`;

      data.push({
        label: yearLabel,
        marks: `${yearCumulativeMarks} / ${yearCumulativeMaxMarks}`,
        percentage: `${yearPercentage.toFixed(2)} %`,
        gpa: yearGPA.toFixed(2),
      });
    }

    return data;
  }, [sortedSemesters, manualCredits]);

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="px-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Cumulative Result Breakdown
        </h3>

        {/* Semester Cumulative Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-3 text-white font-semibold">
                  SEMESTER
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  MARKS
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  PERCENTAGE
                </th>
                <th className="text-left p-3 text-white font-semibold">GPA</th>
              </tr>
            </thead>
            <tbody>
              {semesterCumulativeData.map((row) => (
                <tr key={row.label} className="border-b border-zinc-800">
                  <td className="p-3 text-zinc-300">{row.label}</td>
                  <td className="p-3 text-zinc-300">{row.marks}</td>
                  <td className="p-3 text-zinc-300">{row.percentage}</td>
                  <td className="p-3 text-primary font-semibold">{row.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Year Cumulative Table */}
        {yearCumulativeData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-3 text-white font-semibold">
                    YEAR
                  </th>
                  <th className="text-left p-3 text-white font-semibold">
                    MARKS
                  </th>
                  <th className="text-left p-3 text-white font-semibold">
                    PERCENTAGE
                  </th>
                  <th className="text-left p-3 text-white font-semibold">
                    GPA
                  </th>
                </tr>
              </thead>
              <tbody>
                {yearCumulativeData.map((row) => (
                  <tr key={row.label} className="border-b border-zinc-800">
                    <td className="p-3 text-zinc-300">{row.label}</td>
                    <td className="p-3 text-zinc-300">{row.marks}</td>
                    <td className="p-3 text-zinc-300">{row.percentage}</td>
                    <td className="p-3 text-primary font-semibold">
                      {row.gpa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
