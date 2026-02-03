"use client";

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
import { ManualCreditsData } from "./CGPACalculatorModal";

interface ResultActionButtonsProps {
  data: ProcessedData;
  creditsMap: CreditsMap;
  manualCGPA: number | null;
  manualCredits?: ManualCreditsData | null;
  currentUrl: string;
  onReset: () => void;
  className?: string;
}

export default function ResultActionButtons({
  data,
  creditsMap,
  manualCGPA,
  manualCredits,
  currentUrl,
  onReset,
  className = "",
}: ResultActionButtonsProps) {
  const { isSignedIn } = useUser();

  return (
    <div className={`flex gap-2 ${className}`}>
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
                  manualCGPA,
                  manualCredits,
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
                    manualCGPA,
                    manualCredits,
                  });
                  toast.success(
                    `Semester ${sem.euno} PDF exported successfully!`,
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
  );
}
