import { ResultAPIResponse, CreditsMap, DetailedCredits } from "@/types/result";

 // Session storage keys
export const STORAGE_KEYS = {
  RESULT_DATA: "resultData",
  CREDITS_DATA: "creditsData",
  MANUAL_CREDITS: "manualCredits",
  MANUAL_CGPA: "manualCGPA",
} as const;

// Convert marks to grade
export function marksToGrade(marks: number): string {
  if (marks >= 90 && marks <= 100) return "O";
  if (marks >= 75 && marks <= 89) return "A+";
  if (marks >= 65 && marks <= 74) return "A";
  if (marks >= 55 && marks <= 64) return "B+";
  if (marks >= 50 && marks <= 54) return "B";
  if (marks >= 45 && marks <= 49) return "C";
  if (marks >= 40 && marks <= 44) return "P";
  return "F";
}

// Add dash between letters and numbers (e.g., "HS301" -> "HS-301")
export function normalizePaperCode(code: string): string {
  return code
    .trim()
    .toUpperCase()
    .replace(/([A-Z]+)(\d)/, "$1-$2");
}

// Normalize paper codes in all subjects
export function normalizeResultsPaperCodes(
  results: ResultAPIResponse[]
): ResultAPIResponse[] {
  return results.map((result) => ({
    ...result,
    papercode: normalizePaperCode(result.papercode),
  }));
}

// Filter to only keep latest attempt for each subject code
export function filterLatestAttempts(
  subjects: ResultAPIResponse[]
): ResultAPIResponse[] {
  const subjectMap = new Map<string, ResultAPIResponse>();

  subjects.forEach((subject) => {
    const existing = subjectMap.get(subject.papercode);

    if (!existing) {
      subjectMap.set(subject.papercode, subject);
    } else {
      // Compare dates to find the latest attempt
      const existingDate = existing.declareddate
        ? new Date(existing.declareddate)
        : new Date(existing.ryear, existing.rmonth - 1);
      const currentDate = subject.declareddate
        ? new Date(subject.declareddate)
        : new Date(subject.ryear, subject.rmonth - 1);

      // If current date is later or if dates are equal but current has better marks
      if (
        currentDate > existingDate ||
        (currentDate.getTime() === existingDate.getTime() &&
          (parseFloat(subject.moderatedprint) || 0) >
            (parseFloat(existing.moderatedprint) || 0))
      ) {
        subjectMap.set(subject.papercode, subject);
      }
    }
  });

  return Array.from(subjectMap.values());
}

export function checkAvailableCreditData(programName: string): boolean {
  const upperProgram = programName.toUpperCase();

  const branchesAvailable = [
    "CE", "CSE", "CST", "ECE", "EE", "EEE",
    "ICE", "IT", "ITE", "MAE", "ME",
  ];

  // Check BCA directly
  if (upperProgram.startsWith("BACHELOR OF COMPUTER APPLICATION")) {
    return true;
  }

  // Check BTech + valid branch
  if (upperProgram.startsWith("BACHELOR OF TECHNOLOGY")) {
    // Extract branch name inside brackets
    const match = upperProgram.match(/\(([^)]+)\)/);
    if (!match) return false;

    const branchName = match[1].trim();

    // Convert branch name to short form
    const branchShortForm = branchName
      .split(/\s+/)
      .map(word => {
        // Filter to only alphabetic characters and take first character
        const alphabeticChars = word.match(/[A-Za-z]/g);
        return alphabeticChars ? alphabeticChars[0].toUpperCase() : "";
      })
      .filter(char => char !== "")
      .join("");

    return branchesAvailable.includes(branchShortForm);
  }

  return false;
}

// Helper function to get credits for a subject
export function getSubjectCredits(
  subject: ResultAPIResponse,
  creditsMap: CreditsMap,
  programName: string
): DetailedCredits | null {
  const creditData = creditsMap[subject.papercode];

  if (creditData?.credits) {
    return {
      total: creditData.credits,
      theory: creditData.credits,
      practical: null,
      isFallback: false,
    };
  }

  // Fallback: If program credits not found, use 1 credit
  if (checkAvailableCreditData(programName)) {
    return {
      total: 1,
      theory: 1,
      practical: null,
      isFallback: true,
    };
  }

  // No fallback for other programs
  return null;
}

// Alias for backward compatibility - use filterLatestAttempts instead
export const getUniqueSubjectsLatestAttempt = filterLatestAttempts;

// Helper function to calculate total marks from subjects
export function calculateTotalMarks(subjects: ResultAPIResponse[]): number {
  return subjects.reduce((total, subject) => {
    const minor = parseInt(subject.minorprint) || 0;
    const major = parseInt(subject.majorprint) || 0;
    return total + minor + major;
  }, 0);
}

// Helper function to calculate semester credits from subject-level manual credits
export function calculateSemesterCreditsFromSubjects(
  semesterNumber: number,
  subjects: ResultAPIResponse[],
  manualCredits: { type: "semester" | "subject"; subjectCredits?: Record<string, number> }
): number {
  if (manualCredits.type !== "subject" || !manualCredits.subjectCredits) {
    return 0;
  }
  
  return subjects.reduce((total, subject) => {
    const key = `${semesterNumber}-${subject.papercode}`;
    const credits = manualCredits.subjectCredits![key] || 0;
    return total + credits;
  }, 0);
}
