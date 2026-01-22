"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { ProcessedSemester } from "@/types/result";
import { filterLatestAttempts, STORAGE_KEYS } from "@/utils/result";
import CGPAFormula from "./CGPAFormula";

export interface ManualCreditsData {
  type: "semester" | "subject";
  semesterCredits?: Record<number, number>;
  subjectCredits?: Record<string, number>;
}

interface CGPACalculatorModalProps {
  semesters: ProcessedSemester[];
  onCGPACalculated?: (cgpa: number | null, credits?: ManualCreditsData) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CGPACalculatorModal({
  semesters,
  onCGPACalculated,
  open: controlledOpen,
  onOpenChange,
}: CGPACalculatorModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"semester" | "subject">("semester");
  const [showResult, setShowResult] = useState(false);
  const [displayedCGPA, setDisplayedCGPA] = useState<number | null>(null);
  const [showFormula, setShowFormula] = useState(false);

  // Support both controlled and uncontrolled modes
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => { })) : setInternalOpen;

  // Sort semesters
  const sortedSemesters = useMemo(
    () => [...semesters].sort((a, b) => a.euno - b.euno),
    [semesters]
  );

  // Semester-wise credits state
  const [semesterCredits, setSemesterCredits] = useState<Record<number, string>>(
    () => {
      const initial: Record<number, string> = {};
      sortedSemesters.forEach((sem) => {
        initial[sem.euno] = "";
      });
      return initial;
    }
  );

  // Subject-wise credits state
  const [subjectCredits, setSubjectCredits] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    sortedSemesters.forEach((sem) => {
      const uniqueSubjects = filterLatestAttempts(sem.subjects);
      uniqueSubjects.forEach((subject) => {
        initial[`${sem.euno}-${subject.papercode}`] = "";
      });
    });
    return initial;
  });

  // Calculate CGPA based on semester credits
  const calculateSemesterCGPA = useCallback(() => {
    let totalCredits = 0;
    let totalGradePoints = 0;
    let allFilled = true;

    sortedSemesters.forEach((sem) => {
      const credits = parseFloat(semesterCredits[sem.euno]);
      if (isNaN(credits) || credits <= 0) {
        allFilled = false;
        return;
      }

      // Use provided semester credits and SGPA from result
      totalGradePoints += sem.sgpa * credits;
      totalCredits += credits;
    });

    if (!allFilled || totalCredits === 0) return null;
    return totalGradePoints / totalCredits;
  }, [sortedSemesters, semesterCredits]);

  // Calculate CGPA based on subject credits
  const calculateSubjectCGPA = useCallback(() => {
    let totalCredits = 0;
    let totalGradePoints = 0;
    let allFilled = true;

    sortedSemesters.forEach((sem) => {
      const uniqueSubjects = filterLatestAttempts(sem.subjects);

      uniqueSubjects.forEach((subject) => {
        const key = `${sem.euno}-${subject.papercode}`;
        const credits = parseFloat(subjectCredits[key]);

        if (isNaN(credits) || credits <= 0) {
          allFilled = false;
          return;
        }

        // Calculate grade points: eugpa is the grade point
        totalGradePoints += subject.eugpa * credits;
        totalCredits += credits;
      });
    });

    if (!allFilled || totalCredits === 0) return null;
    return totalGradePoints / totalCredits;
  }, [sortedSemesters, subjectCredits]);

  // Check if all fields are filled
  const canCalculate = useMemo(() => {
    if (activeTab === "semester") {
      return sortedSemesters.every((sem) => {
        const credits = parseFloat(semesterCredits[sem.euno]);
        return !isNaN(credits) && credits > 0;
      });
    } else {
      return sortedSemesters.every((sem) => {
        const uniqueSubjects = filterLatestAttempts(sem.subjects);
        return uniqueSubjects.every((subject) => {
          const key = `${sem.euno}-${subject.papercode}`;
          const credits = parseFloat(subjectCredits[key]);
          return !isNaN(credits) && credits > 0;
        });
      });
    }
  }, [activeTab, sortedSemesters, semesterCredits, subjectCredits]);

  const handleSemesterCreditChange = useCallback(
    (semEuno: number, value: string) => {
      setSemesterCredits((prev) => ({
        ...prev,
        [semEuno]: value,
      }));
      // Reset result when user changes input
      setShowResult(false);
    },
    []
  );

  const handleSubjectCreditChange = useCallback(
    (key: string, value: string) => {
      setSubjectCredits((prev) => ({
        ...prev,
        [key]: value,
      }));
      // Reset result when user changes input
      setShowResult(false);
    },
    []
  );

  const handleCalculate = useCallback(() => {
    const cgpa = activeTab === "semester" ? calculateSemesterCGPA() : calculateSubjectCGPA();
    setDisplayedCGPA(cgpa);
    setShowResult(true);

    // Notify parent with CGPA and credits data
    if (onCGPACalculated && cgpa !== null) {
      const creditsData: ManualCreditsData = {
        type: activeTab,
        ...(activeTab === "semester"
          ? {
            semesterCredits: Object.fromEntries(
              Object.entries(semesterCredits).map(([key, value]) => [
                parseInt(key),
                parseFloat(value) || 0,
              ])
            ),
          }
          : {
            subjectCredits: Object.fromEntries(
              Object.entries(subjectCredits).map(([key, value]) => [
                key,
                parseFloat(value) || 0,
              ])
            ),
          }),
      };
      onCGPACalculated(cgpa, creditsData);
    }
  }, [activeTab, calculateSemesterCGPA, calculateSubjectCGPA, onCGPACalculated, semesterCredits, subjectCredits]);

  // Reset result when tab changes
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as "semester" | "subject");
    setShowResult(false);
  }, []);

  // Load previously saved credits from sessionStorage when modal opens
  useEffect(() => {
    if (open) {
      try {
        const savedCredits = sessionStorage.getItem(STORAGE_KEYS.MANUAL_CREDITS);
        const savedCGPA = sessionStorage.getItem(STORAGE_KEYS.MANUAL_CGPA);

        if (savedCredits) {
          const creditsData: ManualCreditsData = JSON.parse(savedCredits);

          // Set the active tab based on saved type
          setActiveTab(creditsData.type);

          // Populate the appropriate state based on type
          if (creditsData.type === "semester" && creditsData.semesterCredits) {
            const semCredits: Record<number, string> = {};
            // Only load credits for semesters that exist in current data
            sortedSemesters.forEach((sem) => {
              if (creditsData.semesterCredits![sem.euno] !== undefined) {
                semCredits[sem.euno] = creditsData.semesterCredits![sem.euno].toString();
              }
            });
            setSemesterCredits((prev) => ({ ...prev, ...semCredits }));
          } else if (creditsData.type === "subject" && creditsData.subjectCredits) {
            const subjCredits: Record<string, string> = {};
            // Only load credits for subjects that exist in current data
            sortedSemesters.forEach((sem) => {
              const uniqueSubjects = filterLatestAttempts(sem.subjects);
              uniqueSubjects.forEach((subject) => {
                const key = `${sem.euno}-${subject.papercode}`;
                if (creditsData.subjectCredits![key] !== undefined) {
                  subjCredits[key] = creditsData.subjectCredits![key].toString();
                }
              });
            });
            setSubjectCredits((prev) => ({ ...prev, ...subjCredits }));
          }

          // If CGPA was calculated before, show it
          if (savedCGPA) {
            const cgpa = JSON.parse(savedCGPA);
            setDisplayedCGPA(cgpa);
            setShowResult(true);
          }
        }
      } catch (error) {
        console.error("Error loading saved credits:", error);
      }
    }
  }, [open, sortedSemesters]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            CGPA Calculator
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add credits manually to calculate your CGPA. You can either add
            total credits per semester or credits for each subject.
          </DialogDescription>
          <button
            type="button"
            onClick={() => setShowFormula(!showFormula)}
            className="text-xs text-zinc-500 hover:text-primary transition-colors text-left mt-1 underline underline-offset-2"
          >
            {showFormula ? "Hide formula" : "How is this calculated?"}
          </button>
          {showFormula && (
            <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <CGPAFormula />
              <p className="text-xs text-zinc-500 text-center mt-1">
                C<sub>ni</sub> = Credits, G<sub>ni</sub> = Grade Point
              </p>
            </div>
          )}
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
            <TabsTrigger
              value="semester"
              className="data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              By Semester
            </TabsTrigger>
            <TabsTrigger
              value="subject"
              className="data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              By Subject
            </TabsTrigger>
          </TabsList>

          {/* Semester-wise Credits Tab */}
          <TabsContent value="semester" className="mt-4 space-y-4">
            <p className="text-sm text-zinc-400">
              Enter total credits for each semester
            </p>
            <div className="space-y-3">
              {sortedSemesters.map((sem) => (
                <div
                  key={sem.euno}
                  className="flex items-center justify-between gap-4 p-3 bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="text-zinc-300">Semester {sem.euno}</span>
                    <span className="text-zinc-500 text-sm ml-2">
                      (SGPA: {sem.sgpa.toFixed(2)})
                    </span>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Credits"
                      value={semesterCredits[sem.euno]}
                      onChange={(e) =>
                        handleSemesterCreditChange(sem.euno, e.target.value)
                      }
                      className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
                      min="0"
                      step="1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Subject-wise Credits Tab */}
          <TabsContent value="subject" className="mt-4 space-y-4">
            <p className="text-sm text-zinc-400">
              Enter credits for each subject
            </p>
            <div className="space-y-6">
              {sortedSemesters.map((sem) => {
                const uniqueSubjects = filterLatestAttempts(sem.subjects);
                return (
                  <div key={sem.euno} className="space-y-2">
                    <h4 className="text-primary font-semibold">
                      Semester {sem.euno}
                    </h4>
                    <div className="space-y-2">
                      {uniqueSubjects.map((subject) => {
                        const key = `${sem.euno}-${subject.papercode}`;
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-4 p-2 bg-zinc-800/50 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-zinc-300 text-sm max-w-sm text-wrap">
                                {subject.papername}
                              </p>
                            </div>
                            <div className="w-20 flex-shrink-0">
                              <Input
                                type="number"
                                value={subjectCredits[key]}
                                onChange={(e) =>
                                  handleSubjectCreditChange(key, e.target.value)
                                }
                                className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500 text-sm"
                                min="0"
                                step="1"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          disabled={!canCalculate}
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-black font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {showResult ? "Recalculate CGPA" : "Calculate CGPA"}
        </Button>

        {/* CGPA Result Section - Only shown after calculation */}
        {showResult && displayedCGPA !== null && (
          <div className="mt-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-2">Your Calculated CGPA</p>
              <p className="text-4xl font-bold text-primary">
                {displayedCGPA.toFixed(2)}
              </p>
              <p className="text-xs text-zinc-500 mt-2">Out of 10.0</p>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
