"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessedSemester, ResultAPIResponse } from "@/types/result";

interface YearwiseResultBreakdownProps {
  semesters: ProcessedSemester[];
  hasCompleteCredits: boolean;
}

// Helper function to get unique subjects by taking the latest attempt for each paper code
function getUniqueSubjectsLatestAttempt(subjects: ResultAPIResponse[]): ResultAPIResponse[] {
  const subjectMap = new Map<string, ResultAPIResponse>();
  
  subjects.forEach((subject) => {
    const existingSubject = subjectMap.get(subject.papercode);
    if (!existingSubject) {
      subjectMap.set(subject.papercode, subject);
    } else {
      // Compare by declared date (ryear and rmonth) to get the latest attempt
      const existingDate = new Date(existingSubject.ryear, existingSubject.rmonth - 1);
      const currentDate = new Date(subject.ryear, subject.rmonth - 1);
      if (currentDate > existingDate) {
        subjectMap.set(subject.papercode, subject);
      }
    }
  });
  
  return Array.from(subjectMap.values());
}

// Helper function to calculate total marks from subjects
function calculateTotalMarks(subjects: ResultAPIResponse[]): number {
  return subjects.reduce((total, subject) => {
    const minor = parseInt(subject.minorprint) || 0;
    const major = parseInt(subject.majorprint) || 0;
    return total + minor + major;
  }, 0);
}

interface YearRowData {
  year: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  gpa: number;
  credits: number;
}

export default function YearwiseResultBreakdown({
  semesters,
  hasCompleteCredits,
}: YearwiseResultBreakdownProps) {
  // Sort semesters by semester number
  const sortedSemesters = useMemo(() => 
    [...semesters].sort((a, b) => a.euno - b.euno),
    [semesters]
  );

  // Calculate year-wise data (2 semesters per year, only complete years)
  const yearData: YearRowData[] = useMemo(() => {
    const data: YearRowData[] = [];
    
    // Group semesters by year (2 semesters per year)
    // Only include complete years (years with exactly 2 semesters)
    for (let i = 0; i + 1 < sortedSemesters.length; i += 2) {
      const yearNumber = Math.floor(i / 2) + 1;
      const yearSemesters = sortedSemesters.slice(i, i + 2);
      
      let yearMarks = 0;
      let yearMaxMarks = 0;
      let yearCredits = 0;
      let yearGradePoints = 0;

      yearSemesters.forEach((sem) => {
        // Get unique subjects (latest attempt only)
        const uniqueSubjects = getUniqueSubjectsLatestAttempt(sem.subjects);
        const semesterMarks = calculateTotalMarks(uniqueSubjects);
        const semesterMaxMarks = uniqueSubjects.length * 100;
        
        yearMarks += semesterMarks;
        yearMaxMarks += semesterMaxMarks;
        yearCredits += sem.credits;
        yearGradePoints += sem.sgpa * sem.credits;
      });

      const yearGPA = yearCredits > 0 ? yearGradePoints / yearCredits : 0;
      const yearPercentage = yearMaxMarks > 0 ? (yearMarks / yearMaxMarks) * 100 : 0;

      data.push({
        year: yearNumber,
        totalMarks: yearMarks,
        maxMarks: yearMaxMarks,
        percentage: yearPercentage,
        gpa: yearGPA,
        credits: yearCredits,
      });
    }

    return data;
  }, [sortedSemesters]);

  // Don't render if we don't have at least 2 semesters (1 complete year)
  if (sortedSemesters.length < 2) {
    return null;
  }

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Yearwise Result Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-3 text-white font-semibold">
                  YEAR
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  TOTAL MARKS
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  PERCENTAGE
                </th>
                {hasCompleteCredits && (
                  <th className="text-left p-3 text-white font-semibold">GPA</th>
                )}
              </tr>
            </thead>
            <tbody>
              {yearData.map((year) => (
                <tr key={year.year} className="border-b border-zinc-800">
                  <td className="p-3 text-zinc-300">Year {year.year}</td>
                  <td className="p-3 text-zinc-300">
                    {year.totalMarks} / {year.maxMarks}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {year.percentage.toFixed(2)}%
                  </td>
                  {hasCompleteCredits && (
                    <td className="p-3 text-primary font-semibold">
                      {year.gpa.toFixed(2)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
