"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ProcessedData } from "../../app/(public)/result/types";

interface StudentHeaderProps {
  data: ProcessedData;
  selectedSemester: number | "OVERALL";
  onSemesterChange: (semester: number | "OVERALL") => void;
}

export default function StudentHeader({
  data,
  selectedSemester,
  onSemesterChange,
}: StudentHeaderProps) {
  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-6">
          <div className="flex-1 min-w-[300px]">
            <h1 className="text-3xl font-bold text-white mb-2">
              {data.studentInfo.name}
            </h1>
            <div className="space-y-1 text-zinc-400">
              <p>
                <span className="text-zinc-500">ENROLLMENT NO.</span>{" "}
                {data.studentInfo.enrollmentNumber}
              </p>
              <p>
                <span className="text-zinc-500">INSTITUTE</span>{" "}
                {data.studentInfo.institute} ({data.studentInfo.instituteCode})
              </p>
              <p>
                <span className="text-zinc-500">PROGRAM</span>{" "}
                {data.studentInfo.program} ({data.studentInfo.programCode})
              </p>
              <p>
                <span className="text-zinc-500">YEAR OF ADMISSION</span>{" "}
                {data.studentInfo.yearOfAdmission}
              </p>
            </div>
          </div>

          {/* CGPA Card */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6 min-w-[200px]">
            <p className="text-sm text-zinc-400 mb-1">CUMULATIVE GPA</p>
            <p className="text-5xl font-bold text-primary">
              {data.cgpa.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-500 mt-2">Out of 10.0</p>
          </div>
        </div>

        {/* Semester Tabs */}
        <div className="flex gap-2 flex-wrap mt-6">
          <button
            onClick={() => onSemesterChange("OVERALL")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedSemester === "OVERALL"
                ? "bg-primary text-black"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            OVERALL
          </button>
          {data.semesters.map((sem) => (
            <button
              key={sem.euno}
              onClick={() => onSemesterChange(sem.euno)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedSemester === sem.euno
                  ? "bg-primary text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              SEM {sem.euno}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
