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
