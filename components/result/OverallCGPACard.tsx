"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ProcessedData } from "@/types/result";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OverallCGPACardProps {
  data: ProcessedData;
}

const getDivision = (cgpa: number): string => {
  if (cgpa === 10) return "Exemplary Performance";
  if (cgpa >= 6.5) return "First Division";
  if (cgpa >= 5.0) return "Second Division";
  if (cgpa >= 4.0) return "Third Division";
  return "Below Pass Grade";
};

const getDivisionColor = (cgpa: number): string => {
  if (cgpa >= 6.5) return "text-primary";
  if (cgpa >= 5.0) return "text-blue-400";
  if (cgpa >= 4.0) return "text-yellow-400";
  return "text-red-400";
};

export default function OverallCGPACard({ data }: OverallCGPACardProps) {
  if (data.cgpa === null) {
    return (
      <Card className="bg-zinc-900/95 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-white">
              OVERALL CGPA CALCULATION
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-zinc-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    CGPA is calculated using the IP University formula: Σ(SGPA × Credits) / Σ(Credits)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg text-center">
            <p className="text-zinc-400">
              CGPA cannot be calculated as some subjects are missing credit information.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalCredits = data.semesters.reduce((sum, sem) => sum + sem.credits, 0);
  const equivalentPercentage = data.cgpa * 10;
  const division = getDivision(data.cgpa);
  const divisionColor = getDivisionColor(data.cgpa);

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-semibold text-white">
            OVERALL CGPA CALCULATION
          </h3>
          <TooltipProvider>
            <Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-zinc-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs mb-2">
                    <strong>IP University CGPA Formula:</strong>
                  </p>
                  <p className="text-xs">
                    CGPA = Σ(SGPA × Credits) / Σ(Credits)
                  </p>
                </TooltipContent>
              </Tooltip>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Formula Explanation */}
        <div className="mb-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-3">
            How CGPA is Calculated:
          </h4>
          <div className="space-y-2 text-sm text-zinc-300">
            <p>
              <strong className="text-primary">Formula:</strong> CGPA = Σ(Cn<sub>i</sub> × Gn<sub>i</sub>) / Σ(Cn<sub>i</sub>)
            </p>
            <div className="mt-3 space-y-1 text-xs">
              <p>Where:</p>
              <p className="ml-4">• Cn = Total credits of the n<sup>th</sup> semester (sum of all course credits)</p>
              <p className="ml-4">• Gn = Grade points (SGPA) of the n<sup>th</sup> semester (from API)</p>
              <p className="ml-4 text-zinc-400 mt-2">Note: Credits are fetched from the API for each course, and SGPA comes directly from the API response.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-700">
              <p className="text-xs">
                <strong>In simpler terms:</strong>
              </p>
              <p className="text-xs mt-1">
                1. Multiply each semester's SGPA by its credits<br />
                2. Add all those products together<br />
                3. Divide by the total number of credits<br />
                4. Round to 2 decimal places
              </p>
            </div>
          </div>
        </div>

        {/* Calculation Breakdown */}
        <div className="mb-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-3">
            Your Calculation:
          </h4>
          <div className="space-y-2">
            {data.semesters.map((sem) => (
              <div
                key={sem.euno}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-zinc-400">Semester {sem.euno}:</span>
                <span className="text-zinc-300 font-mono">
                  ({sem.sgpa.toFixed(2)} × {sem.credits}) = {(sem.sgpa * sem.credits).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-zinc-700">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-zinc-300">Total Credits:</span>
                <span className="text-primary">{totalCredits}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold mt-2">
                <span className="text-zinc-300">Sum of (SGPA × Credits):</span>
                <span className="text-primary">
                  {data.semesters
                    .reduce((sum, sem) => sum + sem.sgpa * sem.credits, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CGPA Result */}
        <div className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-zinc-300 mb-2">Your Overall CGPA</p>
            <p className="text-7xl font-bold text-primary mb-3">
              {data.cgpa.toFixed(2)}
            </p>
            <p className={`text-xl font-semibold mb-3 ${divisionColor}`}>
              {division}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-3 bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-400 mb-1">Equivalent Percentage</p>
                <p className="text-2xl font-bold text-primary">
                  {equivalentPercentage.toFixed(2)}%
                </p>
                <p className="text-xs text-zinc-500 mt-1">CGPA × 10</p>
              </div>
              <div className="p-3 bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-400 mb-1">Total Credits Earned</p>
                <p className="text-2xl font-bold text-primary">{totalCredits}</p>
                <p className="text-xs text-zinc-500 mt-1">Across all semesters</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
