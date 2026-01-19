"use client";

import { Button } from "@/components/ui/button";
import { ProcessedData, ResultAPIResponse, CreditsMap } from "@/types/result";
import StudentHeader from "@/components/result/StudentHeader";
import DetailedResultsTable from "@/components/result/DetailedResultsTable";
import OverallView from "./OverallView";
import SemesterDetailView from "./SemesterDetailView";

interface ResultsViewProps {
  processedData: ProcessedData;
  selectedSemester: number | "OVERALL";
  onSemesterChange: (semester: number | "OVERALL") => void;
  onReset: () => void;
  filteredResults: ResultAPIResponse[];
  showMarksBreakdown: boolean;
  onToggleMarksBreakdown: (show: boolean) => void;
  creditsMap: CreditsMap;
}

export default function ResultsView({
  processedData,
  selectedSemester,
  onSemesterChange,
  onReset,
  filteredResults,
  showMarksBreakdown,
  onToggleMarksBreakdown,
  creditsMap,
}: ResultsViewProps) {
  const currentSemester =
    selectedSemester !== "OVERALL"
      ? processedData.semesters.find((s) => s.euno === selectedSemester)
      : null;

  return (
    <div className="space-y-6">
      <StudentHeader
        data={processedData}
        selectedSemester={selectedSemester}
        onSemesterChange={onSemesterChange}
        onReset={onReset}
        showMarksBreakdown={showMarksBreakdown}
      />

      {selectedSemester === "OVERALL" ? (
        <OverallView data={processedData} />
      ) : (
        currentSemester && <SemesterDetailView semester={currentSemester} />
      )}

      <DetailedResultsTable
        results={filteredResults}
        selectedSemester={selectedSemester}
        semesters={processedData.semesters}
        showMarksBreakdown={showMarksBreakdown}
        onToggleMarksBreakdown={onToggleMarksBreakdown}
        creditsMap={creditsMap}
        programName={processedData.studentInfo.program}
      />

      {/* Back Button */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
        >
          Check Another Result
        </Button>
      </div>
    </div>
  );
}
