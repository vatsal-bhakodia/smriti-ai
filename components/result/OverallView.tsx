"use client";

import { ProcessedData } from "@/types/result";
import GPATrendChart from "@/components/result/GPATrendChart";
import GradeDistributionChart from "@/components/result/GradeDistributionChart";
import SemesterSummaryTable from "@/components/result/SemesterSummaryTable";
import OverallCGPACard from "@/components/result/OverallCGPACard";

interface OverallViewProps {
  data: ProcessedData;
}

export default function OverallView({ data }: OverallViewProps) {
  return (
    <>
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GPATrendChart data={data.gpaTrend} />
        <GradeDistributionChart data={data.gradeDistribution} />
      </div>
      <SemesterSummaryTable semesters={data.semesters} />
      
      {/* Overall CGPA Calculation */}
      <OverallCGPACard data={data} />
    </>
  );
}
