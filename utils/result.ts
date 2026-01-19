import { ResultAPIResponse, CreditsMap, DetailedCredits } from "@/types/result";

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
      .map(word => word.charAt(0))
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
  const allCredits = creditsMap[subject.papercode];

  if (allCredits) {
    return {
      total: allCredits.totalCredits,
      theory: allCredits.theoryCredits,
      practical: allCredits.practicalCredits,
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
