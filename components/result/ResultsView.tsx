"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProcessedData, ResultAPIResponse, CreditsMap } from "@/types/result";
import StudentHeader from "@/components/result/StudentHeader";
import DetailedResultsTable from "@/components/result/DetailedResultsTable";
import OverallView from "./OverallView";
import SemesterDetailView from "./SemesterDetailView";
import { ManualCreditsData } from "./CGPACalculatorModal";
import { STORAGE_KEYS } from "@/utils/result";

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
  const [manualCredits, setManualCredits] = useState<ManualCreditsData | null>(null);

  // Load manual credits from sessionStorage on mount
  useEffect(() => {
    try {
      const savedCredits = sessionStorage.getItem(STORAGE_KEYS.MANUAL_CREDITS);
      if (savedCredits) {
        const credits = JSON.parse(savedCredits);
        setManualCredits(credits);
      }
    } catch (error) {
      console.error("Error loading manual credits from storage:", error);
    }
  }, []);

  const handleManualCreditsChange = useCallback((credits: ManualCreditsData | null) => {
    setManualCredits(credits);
  }, []);

  const currentSemester =
    selectedSemester !== "OVERALL"
      ? processedData.semesters.find((s) => s.euno === selectedSemester)
      : null;

  // Determine if we should show credits column
  const hasCreditsData = processedData.hasCompleteCredits || manualCredits !== null;

  return (
    <div className="space-y-6">
      <StudentHeader
        data={processedData}
        selectedSemester={selectedSemester}
        onSemesterChange={onSemesterChange}
        onReset={onReset}
        creditsMap={creditsMap}
        onManualCreditsChange={handleManualCreditsChange}
        manualCredits={manualCredits}
      />

      {selectedSemester === "OVERALL" ? (
        <OverallView data={processedData} manualCredits={manualCredits} />
      ) : (
        currentSemester && (
          <SemesterDetailView
            semester={currentSemester}
            hasCreditsData={hasCreditsData}
            manualCredits={manualCredits}
          />
        )
      )}

      <DetailedResultsTable
        results={filteredResults}
        selectedSemester={selectedSemester}
        semesters={processedData.semesters}
        showMarksBreakdown={showMarksBreakdown}
        onToggleMarksBreakdown={onToggleMarksBreakdown}
        creditsMap={creditsMap}
        programName={processedData.studentInfo.program}
        hasCreditsData={hasCreditsData}
        manualCredits={manualCredits}
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
