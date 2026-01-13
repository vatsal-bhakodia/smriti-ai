"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Program {
  id: string;
  universityId: string;
  name: string;
  slug: string;
  hasBranch: boolean;
  semesterCount: number;
  createdAt: string;
}

interface Branch {
  id: string;
  programId: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface SemesterBranchSelectorProps {
  program: Program;
  branches: Branch[];
  universitySlug: string;
  programSlug: string;
  currentSemester?: string;
  currentBranch?: string;
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "ST";
  if (j === 2 && k !== 12) return "ND";
  if (j === 3 && k !== 13) return "RD";
  return "TH";
}

export function SemesterBranchSelector({
  program,
  branches,
  universitySlug,
  programSlug,
  currentSemester,
  currentBranch,
}: SemesterBranchSelectorProps) {
  const router = useRouter();

  // Local state to track selected values for immediate UI update
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);
  const [selectedBranch, setSelectedBranch] = useState(currentBranch);

  // Sync local state with props when URL changes
  useEffect(() => {
    setSelectedSemester(currentSemester);
  }, [currentSemester]);

  useEffect(() => {
    setSelectedBranch(currentBranch);
  }, [currentBranch]);

  const semesterOptions = Array.from(
    { length: program.semesterCount },
    (_, i) => i + 1
  ).map((num) => ({
    value: num.toString(),
    label: `${num}${getOrdinalSuffix(num)}`,
  }));

  const handleSemesterChange = (newSemester: string) => {
    // Update local state immediately for responsive UI
    setSelectedSemester(newSemester);

    // For programs without branch, navigate to show subjects sheet
    if (!program.hasBranch) {
      router.push(`/resources/${universitySlug}/${programSlug}/${newSemester}`);
    } else {
      // For programs with branch, navigate with current branch if exists
      if (selectedBranch) {
        router.push(
          `/resources/${universitySlug}/${programSlug}/${newSemester}/${selectedBranch}`
        );
      } else {
        // Just update semester in URL, keep on selection page
        router.push(`/resources/${universitySlug}/${programSlug}`);
      }
    }
  };

  const handleBranchChange = (newBranch: string) => {
    // Update local state immediately for responsive UI
    setSelectedBranch(newBranch);

    // If semester is selected, navigate to show subjects sheet
    if (selectedSemester) {
      router.push(
        `/resources/${universitySlug}/${programSlug}/${selectedSemester}/${newBranch}`
      );
    } else {
      // No semester selected yet, stay on base page
      router.push(`/resources/${universitySlug}/${programSlug}`);
    }
  };

  return (
    <>
      {/* Semester Selection */}
      <div>
        <label className="text-sm font-medium mb-2 block">Semester</label>
        <Select value={selectedSemester} onValueChange={handleSemesterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* branch Selection (if program has branches) */}
      {program.hasBranch && branches.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Branch</label>
          <Select value={selectedBranch} onValueChange={handleBranchChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((spec) => (
                <SelectItem key={spec.id} value={spec.slug}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
