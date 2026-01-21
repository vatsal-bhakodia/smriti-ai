"use client";

import { ProcessedData } from "@/types/result";
import GPATrendChart from "@/components/result/GPATrendChart";
import GradeDistributionChart from "@/components/result/GradeDistributionChart";
import ResultBreakdown from "@/components/result/ResultBreakdown";
import YearwiseResultBreakdown from "@/components/result/YearwiseResultBreakdown";
import CumulativeResultBreakdown from "@/components/result/CumulativeResultBreakdown";

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
      <ResultBreakdown 
        semesters={data.semesters} 
        hasCompleteCredits={data.hasCompleteCredits} 
      />
      <YearwiseResultBreakdown 
        semesters={data.semesters} 
        hasCompleteCredits={data.hasCompleteCredits} 
      />
      <CumulativeResultBreakdown 
        semesters={data.semesters} 
        hasCompleteCredits={data.hasCompleteCredits} 
      />
    </>
  );
}
