"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessedSemester, ResultAPIResponse } from "@/types/result";

interface ResultBreakdownProps {
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

interface SemesterRowData {
  euno: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  sgpa: number;
  credits: number;
}

export default function ResultBreakdown({
  semesters,
  hasCompleteCredits,
}: ResultBreakdownProps) {
  // Calculate semester data with unique subjects (latest attempt only)
  const semesterData: SemesterRowData[] = useMemo(() => {
    return semesters.map((sem) => {
      const uniqueSubjects = getUniqueSubjectsLatestAttempt(sem.subjects);
      const totalMarks = calculateTotalMarks(uniqueSubjects);
      const maxMarks = uniqueSubjects.length * 100;
      const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;

      return {
        euno: sem.euno,
        totalMarks,
        maxMarks,
        percentage,
        sgpa: sem.sgpa,
        credits: sem.credits,
      };
    }).sort((a, b) => a.euno - b.euno);
  }, [semesters]);

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Result Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-3 text-white font-semibold">
                  SEMESTER
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  TOTAL MARKS
                </th>
                <th className="text-left p-3 text-white font-semibold">
                  PERCENTAGE
                </th>
                {hasCompleteCredits && (
                  <>
                    <th className="text-left p-3 text-white font-semibold">SGPA</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {semesterData.map((sem) => (
                <tr key={sem.euno} className="border-b border-zinc-800">
                  <td className="p-3 text-zinc-300">Sem {sem.euno}</td>
                  <td className="p-3 text-zinc-300">
                    {sem.totalMarks} / {sem.maxMarks}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {sem.percentage.toFixed(2)}%
                  </td>
                  {hasCompleteCredits && (
                    <>
                      <td className="p-3 text-primary font-semibold">
                        {sem.sgpa.toFixed(2)}
                      </td>
                    </>
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
