"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubjectSelector } from "./subject-selector";
import { SubjectsSheet } from "./subjects-sheet";

interface Subject {
  id: string;
  programId: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface Branch {
  id: string;
  programId: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface SubjectSelectorWrapperProps {
  currentSubject?: {
    name: string;
    url: string;
  };
  semester?: string;
  branchSlug?: string;
  selectedBranch?: Branch;
  hasBranch: boolean;
  universitySlug: string;
  programSlug: string;
  shouldShowSheetInitially: boolean;
}

export function SubjectSelectorWrapper({
  currentSubject,
  semester,
  branchSlug,
  selectedBranch,
  hasBranch,
  universitySlug,
  programSlug,
  shouldShowSheetInitially,
}: SubjectSelectorWrapperProps) {
  const router = useRouter();
  const [showSheet, setShowSheet] = useState(shouldShowSheetInitially);

  // Update sheet visibility when initial state changes
  useEffect(() => {
    setShowSheet(shouldShowSheetInitially);
  }, [shouldShowSheetInitially]);

  const canOpenSheet =
    !!semester && (!hasBranch || !!branchSlug);

  const handleOpenSheet = () => {
    if (canOpenSheet) {
      // Navigate to the URL that includes semester/branch to trigger subject fetching
      let url = `/resources/${universitySlug}/${programSlug}/${semester}`;
      if (hasBranch && branchSlug) {
        url += `/${branchSlug}`;
      }
      router.push(url);
    }
  };

  return (
    <>
      <SubjectSelector
        currentSubject={currentSubject}
        semester={semester}
        branchSlug={branchSlug}
        hasBranch={hasBranch}
        onOpenSheet={handleOpenSheet}
        canOpenSheet={canOpenSheet}
      />

      {/* Sheet - controlled by manual trigger or initial state */}
      {showSheet && semester && canOpenSheet && (
        <SubjectsSheet
          semester={semester}
          branch={selectedBranch}
          universitySlug={universitySlug}
          programSlug={programSlug}
          currentSubjectUrl={currentSubject?.url}
        />
      )}
    </>
  );
}
