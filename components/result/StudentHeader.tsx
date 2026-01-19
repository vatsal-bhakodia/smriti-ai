"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProcessedData, CreditsMap } from "@/types/result";
import { ArrowLeft, Download, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportResultToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";
import { useUser, SignInButton } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";

interface StudentHeaderProps {
  data: ProcessedData;
  selectedSemester: number | "OVERALL";
  onSemesterChange: (semester: number | "OVERALL") => void;
  onReset: () => void;
  creditsMap: CreditsMap;
}

export default function StudentHeader({
  data,
  selectedSemester,
  onSemesterChange,
  onReset,
  creditsMap,
}: StudentHeaderProps) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build current URL to redirect back after sign-in
  const currentUrl = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  return (
    <Card className="bg-zinc-900/95 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start flex-wrap gap-6">
          <div className="flex-1 min-w-[300px]">
            <h1 className="text-3xl font-bold text-white mb-2">
              {data.studentInfo.name}
            </h1>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="group relative overflow-hidden rounded-lg bg-linear-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 p-3 transition-all hover:border-zinc-600/50 hover:shadow-lg hover:shadow-zinc-900/50">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase block mb-1">
                  Enrollment No.
                </span>
                <span className="text-sm font-mono font-medium text-zinc-200 tracking-wide">
                  {data.studentInfo.enrollmentNumber}
                </span>
              </div>
              <div className="group relative overflow-hidden rounded-lg bg-linear-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 p-3 transition-all hover:border-zinc-600/50 hover:shadow-lg hover:shadow-zinc-900/50">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase block mb-1">
                  Year of Admission
                </span>
                <span className="text-sm font-medium text-zinc-200">
                  {data.studentInfo.yearOfAdmission}
                </span>
              </div>
              <div className="group relative overflow-hidden rounded-lg bg-linear-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 p-3 transition-all hover:border-zinc-600/50 hover:shadow-lg hover:shadow-zinc-900/50">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase block mb-1">
                  Institute
                </span>
                <span className="text-sm text-zinc-200 leading-snug block">
                  {data.studentInfo.institute}
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-700/50 text-zinc-400 border border-zinc-600/30">
                    {data.studentInfo.instituteCode}
                  </span>
                </span>
              </div>
              <div className="group relative overflow-hidden rounded-lg bg-linear-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 p-3 transition-all hover:border-zinc-600/50 hover:shadow-lg hover:shadow-zinc-900/50">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase block mb-1">
                  Program
                </span>
                <span className="text-sm text-zinc-200 leading-snug block">
                  {data.studentInfo.program}
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary/80 border border-primary/20">
                    {data.studentInfo.programCode}
                  </span>
                </span>
              </div>
            </div>
            {/* Semester Tabs */}
            <div className="mt-6">
              <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase block mb-3">
                Select Semester
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => onSemesterChange("OVERALL")}
                  className={`group relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    selectedSemester === "OVERALL"
                      ? "bg-primary text-black shadow-lg shadow-primary/25"
                      : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200 border border-zinc-700/50 hover:border-zinc-600"
                  }`}
                >
                  {selectedSemester === "OVERALL" && (
                    <span className="absolute inset-0 rounded-lg bg-primary/20 blur-md -z-10" />
                  )}
                  <span className="flex items-center gap-2">
                    Overall
                  </span>
                </button>
                {data.semesters.map((sem) => (
                  <button
                    key={sem.euno}
                    onClick={() => onSemesterChange(sem.euno)}
                    className={`group relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      selectedSemester === sem.euno
                        ? "bg-primary text-black shadow-lg shadow-primary/25"
                        : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200 border border-zinc-700/50 hover:border-zinc-600"
                    }`}
                  >
                    {selectedSemester === sem.euno && (
                      <span className="absolute inset-0 rounded-lg bg-primary/20 blur-md -z-10" />
                    )}
                    <span className="flex items-center gap-2">
                      Sem {sem.euno}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CGPA Card with Buttons */}
          <div className="flex flex-col gap-3 md:w-fit w-full">
            <div className="flex gap-2">
              <Button
                onClick={onReset}
                variant="outline"
                className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              {isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export PDF
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-zinc-900 border-zinc-700 min-w-[180px]"
                  >
                    <DropdownMenuLabel className="text-zinc-400 text-xs">
                      Select Export Option
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuItem
                      className="text-white hover:bg-zinc-800 cursor-pointer gap-2"
                      onClick={async () => {
                        await exportResultToPDF({
                          processedData: data,
                          semester: "OVERALL",
                          creditsMap,
                        });
                        toast.success("PDF exported successfully!");
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      All Semesters
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    {data.semesters.map((sem) => (
                      <DropdownMenuItem
                        key={sem.euno}
                        className="text-white hover:bg-zinc-800 cursor-pointer gap-2"
                        onClick={async () => {
                          await exportResultToPDF({
                            processedData: data,
                            semester: sem.euno,
                            creditsMap,
                          });
                          toast.success(
                            `Semester ${sem.euno} PDF exported successfully!`
                          );
                        }}
                      >
                        <span className="w-2 h-2 rounded-full bg-zinc-500" />
                        Semester {sem.euno}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl={currentUrl}>
                  <Button
                    variant="outline"
                    className="border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                </SignInButton>
              )}
            </div>
            {data.cgpa !== null && (
              <div className="bg-linear-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6 min-w-[200px]">
                <p className="text-sm text-neutral-100 mb-1">CUMULATIVE GPA</p>
                <p className="text-5xl font-bold text-primary">
                  {data.cgpa.toFixed(2)}
                </p>
                <p className="text-xs text-neutral-100 mt-2">Out of 10.0</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
