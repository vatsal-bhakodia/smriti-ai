import { ResultAPIResponse } from "./types";

// Convert marks to grade
export function marksToGrade(marks: number): string {
  if (marks >= 90) return "O";
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B+";
  if (marks >= 50) return "B";
  if (marks >= 45) return "C";
  if (marks >= 40) return "D";
  return "F";
}

// Calculate SGPA for a semester
export function calculateSGPA(subjects: ResultAPIResponse[]): number {
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach((entry) => {
    const marks = parseFloat(entry.moderatedprint) || 0;
    const grade = marksToGrade(marks);
    const gradePoints: Record<string, number> = {
      O: 10,
      "A+": 9,
      A: 8,
      "B+": 7,
      B: 6,
      C: 5,
      D: 4,
      F: 0,
    };

    const isLab = entry.papername.toLowerCase().includes("lab");
    const credits = isLab ? 1 : 3;
    const points = gradePoints[grade] || 0;

    totalPoints += credits * points;
    totalCredits += credits;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}
