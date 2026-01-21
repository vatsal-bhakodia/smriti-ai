"use client";

import { ProcessedData } from "@/types/result";
import GPATrendChart from "@/components/result/GPATrendChart";
import GradeDistributionChart from "@/components/result/GradeDistributionChart";
import ResultBreakdown from "@/components/result/ResultBreakdown";
import YearwiseResultBreakdown from "@/components/result/YearwiseResultBreakdown";
import CumulativeResultBreakdown from "@/components/result/CumulativeResultBreakdown";
import { ManualCreditsData } from "./CGPACalculatorModal";

interface OverallViewProps {
  data: ProcessedData;
  manualCredits?: ManualCreditsData | null;
}

export default function OverallView({ data, manualCredits }: OverallViewProps) {
  // Show YearwiseResultBreakdown if we have complete credits OR manual credits
  const shouldShowYearwise = data.hasCompleteCredits || manualCredits !== null;
  // Show CumulativeResultBreakdown if we have complete credits OR manual credits
  const shouldShowCumulative = data.hasCompleteCredits || manualCredits !== null;

  return (
    <>
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GPATrendChart data={data.gpaTrend} />
        <GradeDistributionChart data={data.gradeDistribution} />
      </div>
      <ResultBreakdown
        semesters={data.semesters}
      />
      {shouldShowYearwise && (
        <YearwiseResultBreakdown
          semesters={data.semesters}
          hasCompleteCredits={data.hasCompleteCredits || manualCredits !== null}
          manualCredits={manualCredits}
        />
      )}
      {shouldShowCumulative && (
        <CumulativeResultBreakdown
          semesters={data.semesters}
          manualCredits={manualCredits}
        />
      )}
    </>
  );
}
