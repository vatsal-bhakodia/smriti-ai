"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Calculator } from "lucide-react";

interface Subject {
  id: string;
  credits: string;
  marks: string;
}

interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
}

// IP University grading system
const getGradePoint = (marks: number): number => {
  if (marks >= 90) return 10;
  if (marks >= 75) return 9;
  if (marks >= 65) return 8;
  if (marks >= 55) return 7;
  if (marks >= 50) return 6;
  if (marks >= 45) return 5;
  if (marks >= 40) return 4;
  return 0; // F grade
};

const getGrade = (marks: number): string => {
  if (marks >= 90) return "O";
  if (marks >= 75) return "A+";
  if (marks >= 65) return "A";
  if (marks >= 55) return "B+";
  if (marks >= 50) return "B";
  if (marks >= 45) return "C";
  if (marks >= 40) return "P";
  return "F";
};

const getDivision = (cgpa: number): string => {
  if (cgpa === 10) return "Exemplary Performance";
  if (cgpa >= 6.5) return "First Division";
  if (cgpa >= 5.0) return "Second Division";
  if (cgpa >= 4.0) return "Third Division";
  return "Below Pass Grade";
};

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: "1",
      name: "Semester 1",
      subjects: [{ id: "1", credits: "", marks: "" }],
    },
  ]);
  const [calculatedCGPA, setCalculatedCGPA] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const addSemester = () => {
    const newId = String(semesters.length + 1);
    setSemesters([
      ...semesters,
      {
        id: newId,
        name: `Semester ${newId}`,
        subjects: [{ id: "1", credits: "", marks: "" }],
      },
    ]);
  };

  const removeSemester = (semesterId: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter((sem) => sem.id !== semesterId));
      setCalculatedCGPA(null);
    }
  };

  const addSubject = (semesterId: string) => {
    setSemesters(
      semesters.map((sem) => {
        if (sem.id === semesterId) {
          const newSubjectId = String(sem.subjects.length + 1);
          return {
            ...sem,
            subjects: [
              ...sem.subjects,
              { id: newSubjectId, credits: "", marks: "" },
            ],
          };
        }
        return sem;
      })
    );
  };

  const removeSubject = (semesterId: string, subjectId: string) => {
    setSemesters(
      semesters.map((sem) => {
        if (sem.id === semesterId && sem.subjects.length > 1) {
          return {
            ...sem,
            subjects: sem.subjects.filter((sub) => sub.id !== subjectId),
          };
        }
        return sem;
      })
    );
    setCalculatedCGPA(null);
  };

  const updateSubject = (
    semesterId: string,
    subjectId: string,
    field: "credits" | "marks",
    value: string
  ) => {
    setSemesters(
      semesters.map((sem) => {
        if (sem.id === semesterId) {
          return {
            ...sem,
            subjects: sem.subjects.map((sub) => {
              if (sub.id === subjectId) {
                return { ...sub, [field]: value };
              }
              return sub;
            }),
          };
        }
        return sem;
      })
    );
    setCalculatedCGPA(null);
  };

  const calculateCGPA = () => {
    let totalCreditGradePoints = 0;
    let totalCredits = 0;

    for (const semester of semesters) {
      for (const subject of semester.subjects) {
        const credits = parseFloat(subject.credits);
        const marks = parseFloat(subject.marks);

        if (!isNaN(credits) && !isNaN(marks) && marks >= 0 && marks <= 100) {
          const gradePoint = getGradePoint(marks);
          totalCreditGradePoints += credits * gradePoint;
          totalCredits += credits;
        }
      }
    }

    if (totalCredits > 0) {
      const cgpa = totalCreditGradePoints / totalCredits;
      setCalculatedCGPA(parseFloat(cgpa.toFixed(2)));
    } else {
      setCalculatedCGPA(null);
    }
  };

  const resetCalculator = () => {
    setSemesters([
      {
        id: "1",
        name: "Semester 1",
        subjects: [{ id: "1", credits: "", marks: "" }],
      },
    ]);
    setCalculatedCGPA(null);
  };

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              IP University CGPA Calculator
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Calculate your CGPA based on IP University grading system
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInstructions(!showInstructions)}
            className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
          >
            {showInstructions ? "Hide" : "Show"} Instructions
          </Button>
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="mb-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3">
            <h4 className="font-semibold text-white text-sm">How to Calculate CGPA:</h4>
            <div className="text-sm text-zinc-300 space-y-2">
              <p>
                <strong className="text-primary">Formula:</strong> CGPA = Σ(Credits × Grade
                Points) / Σ(Credits)
              </p>
              <p>1. Enter the number of credits for each subject</p>
              <p>2. Enter marks obtained (0-100) for each subject</p>
              <p>3. Add more subjects or semesters as needed</p>
              <p>4. Click "Calculate CGPA" to see your result</p>
            </div>

            <div className="mt-4">
              <h5 className="font-semibold text-white text-sm mb-2">Grading System:</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-zinc-300">
                <div className="flex justify-between bg-zinc-900 p-2 rounded">
                  <span>90-100:</span>
                  <span className="text-primary font-semibold">O (10)</span>
                </div>
                <div className="flex justify-between bg-zinc-900 p-2 rounded">
                  <span>75-89:</span>
                  <span className="text-primary font-semibold">A+ (9)</span>
                </div>
                <div className="flex justify-between bg-zinc-900 p-2 rounded">
                  <span>65-74:</span>
                  <span className="text-primary font-semibold">A (8)</span>
                </div>
                <div className="flex justify-between bg-zinc-900 p-2 rounded">
                  <span>55-64:</span>
                  <span className="text-primary font-semibold">B+ (7)</span>
                </div>
                <div className="flex justify-between bg-zinc-900 p-2 rounded">
                  <span>50-54:</span>
                  <span className="text-primary font-semibold">B (6)</span>
                </div>
                <div className="flex justify-between bg-zinc-900 p-2 rounded">
                  <span>45-49:</span>
                  <span className="text-primary font-semibold">C (5)</span>
                </div>
                <div className="flex justify-between bg-zinc-900 p-2 rounded">
                  <span>40-44:</span>
                  <span className="text-primary font-semibold">P (4)</span>
                </div>
                <div className="flex justify-between bg-zinc-900 p-2 rounded">
                  <span>&lt;40:</span>
                  <span className="text-red-500 font-semibold">F (0)</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="font-semibold text-white text-sm mb-2">Divisions:</h5>
              <div className="text-xs text-zinc-300 space-y-1">
                <p>• <strong className="text-primary">10.0:</strong> Exemplary Performance (all courses passed in first attempt)</p>
                <p>• <strong className="text-primary">6.50+:</strong> First Division</p>
                <p>• <strong className="text-primary">5.00-6.49:</strong> Second Division</p>
                <p>• <strong className="text-primary">4.00-4.99:</strong> Third Division</p>
              </div>
            </div>
          </div>
        )}

        {/* Semesters */}
        <div className="space-y-6">
          {semesters.map((semester, semIndex) => (
            <div
              key={semester.id}
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg"
            >
              {/* Semester Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white text-sm">
                  {semester.name}
                </h4>
                {semesters.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSemester(semester.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Subjects */}
              <div className="space-y-3">
                {semester.subjects.map((subject, subIndex) => (
                  <div
                    key={subject.id}
                    className="flex flex-col md:flex-row gap-2 items-start md:items-center"
                  >
                    <span className="text-xs text-zinc-400 w-20">
                      Subject {subIndex + 1}
                    </span>
                    <Input
                      type="number"
                      placeholder="Credits"
                      value={subject.credits}
                      onChange={(e) =>
                        updateSubject(
                          semester.id,
                          subject.id,
                          "credits",
                          e.target.value
                        )
                      }
                      className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 w-full md:w-32"
                      min="0"
                      step="0.5"
                    />
                    <Input
                      type="number"
                      placeholder="Marks (0-100)"
                      value={subject.marks}
                      onChange={(e) =>
                        updateSubject(
                          semester.id,
                          subject.id,
                          "marks",
                          e.target.value
                        )
                      }
                      className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 w-full md:flex-1"
                      min="0"
                      max="100"
                    />
                    {subject.marks && (
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded font-semibold">
                          {getGrade(parseFloat(subject.marks))}
                        </span>
                        <span className="px-2 py-1 bg-zinc-900 text-zinc-300 rounded">
                          GP: {getGradePoint(parseFloat(subject.marks))}
                        </span>
                      </div>
                    )}
                    {semester.subjects.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeSubject(semester.id, subject.id)
                        }
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Subject Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSubject(semester.id)}
                className="mt-3 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Subject
              </Button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            onClick={addSemester}
            variant="outline"
            className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Semester
          </Button>
          <Button
            onClick={calculateCGPA}
            className="bg-primary hover:bg-lime-400 text-black font-semibold"
          >
            <Calculator className="h-4 w-4 mr-1" />
            Calculate CGPA
          </Button>
          <Button
            onClick={resetCalculator}
            variant="outline"
            className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
          >
            Reset
          </Button>
        </div>

        {/* Result */}
        {calculatedCGPA !== null && (
          <div className="mt-6 p-6 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-zinc-300 mb-2">Your CGPA</p>
              <p className="text-6xl font-bold text-primary mb-3">
                {calculatedCGPA.toFixed(2)}
              </p>
              <p className="text-lg text-white font-semibold mb-2">
                {getDivision(calculatedCGPA)}
              </p>
              <p className="text-sm text-zinc-400">
                Equivalent Percentage: <span className="text-primary font-semibold">{(calculatedCGPA * 10).toFixed(2)}%</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
