"use client";

import { ProcessedSemester } from "@/types/result";
import SemesterStatsCard from "@/components/result/SemesterStatsCard";
import SemesterBarChart from "@/components/result/SemesterBarChart";
import GradeCircleChart from "@/components/result/GradeCircleChart";

interface SemesterDetailViewProps {
  semester: ProcessedSemester;
}

export default function SemesterDetailView({ semester }: SemesterDetailViewProps) {
  const maxMarks = semester.filteredSubjects.length * 100;
  const percentage = (semester.totalMarks / maxMarks) * 100;

  return (
    <>
      {/* Stats Summary */}
      <SemesterStatsCard
        totalMarks={semester.totalMarks}
        maxMarks={maxMarks}
        sgpa={semester.sgpa}
        percentage={percentage}
        totalCredits={semester.credits}
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
