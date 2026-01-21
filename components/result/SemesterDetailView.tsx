"use client";

import { ProcessedSemester } from "@/types/result";
import SemesterStatsCard from "@/components/result/SemesterStatsCard";
import SemesterBarChart from "@/components/result/SemesterBarChart";
import GradeCircleChart from "@/components/result/GradeCircleChart";
import { ManualCreditsData } from "./CGPACalculatorModal";

interface SemesterDetailViewProps {
  semester: ProcessedSemester;
  hasCreditsData?: boolean;
  manualCredits?: ManualCreditsData | null;
}

export default function SemesterDetailView({
  semester,
  hasCreditsData = false,
  manualCredits,
}: SemesterDetailViewProps) {
  const maxMarks = semester.filteredSubjects.length * 100;
  const percentage = (semester.totalMarks / maxMarks) * 100;

  // Get manual credits for this semester if available
  const semesterManualCredits =
    manualCredits?.type === "semester"
      ? manualCredits.semesterCredits?.[semester.euno] ?? null
      : null;

  return (
    <>
      {/* Stats Summary */}
      <SemesterStatsCard
        totalMarks={semester.totalMarks}
        maxMarks={maxMarks}
        sgpa={semester.sgpa}
        percentage={percentage}
        totalCredits={semester.credits}
        hasCreditsData={hasCreditsData}
        manualCredits={semesterManualCredits}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SemesterBarChart subjects={semester.filteredSubjects} />
        {/* Grade Distribution */}
        <GradeCircleChart subjects={semester.filteredSubjects} />
      </div>
    </>
  );
}
