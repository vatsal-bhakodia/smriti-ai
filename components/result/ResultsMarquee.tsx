"use client";

import { useMemo } from "react";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import examNoticesData from "@/public/exam-notices.json";
import { Marquee } from "@/components/magicui/marquee";

interface ExamNotice {
  title: string;
  link: string;
  uploadDate: string;
}

interface ExamNoticesData {
  notices: ExamNotice[];
  lastUpdated: string | null;
  total: number;
}

function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);

  if (year < 100) {
    year += 2000;
  }

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  return new Date(year, month, day);
}

/**
 * Checks if a notice is for a specific enrollment number (individual student)
 * rather than a general program result announcement
 */
function isSpecificEnrollmentNotice(title: string): boolean {
  // Combined patterns for all enrollment/individual student notices
  const patterns = [
    // Enrollment number variations
    /enrol(?:l?ment)?\s*\.?\s*no\.?\s*\d/i, // Matches: "Enrol No", "Enrol. No.", "Enrollment No", etc.
    /enrol(?:l?ment)?\s*\.?\s*number/i,

    // Individual student name patterns
    /result\s+(?:of|for)\s+(?:mr|mrs|ms|miss)\.?\s+[A-Z]/i,
    /result\s+(?:of|for)\s+[A-Z][a-z]+\s+[A-Z][a-z]+.*enrol/i,
  ];

  return patterns.some(pattern => pattern.test(title));
}

/**
 * Shortens notice title using regex to extract key information
 * Example: "Declaration of result of MCA (1st and 3rd Semester) programme, End Term held in November-December, 2025."
 * Becomes: "MCA (1st, 3rd Sem) - Nov-Dec 2025"
 */
function shortenNoticeTitle(title: string): string {
  // Extract program name - matches patterns like "MCA", "B.Tech", "LLM", "BBA (B&I)", etc.
  // Handles both formats: "result of MCA" and "result of B.Tech 7th Semester"
  const programMatch = title.match(/result of\s+([^(]+?)(?:\s*\(|programme|,|End Term)/i);
  let program = programMatch ? programMatch[1].trim() : "";

  // Extract semester information - matches patterns like:
  // - "(1st and 3rd Semester)" 
  // - "7th Semester" (before parentheses)
  // - "(1st, 3rd, 5th Semester)"
  let semester = "";

  // First try to find semester in parentheses (only if it contains semester keywords)
  const semesterInParens = title.match(/\(([^)]*?\d+(?:st|nd|rd|th)[^)]*?(?:Semester|semester)[^)]*?)\)/i);
  if (semesterInParens) {
    semester = semesterInParens[1].trim();
  } else {
    // Try to find semester before parentheses (e.g., "B.Tech 7th Semester Programme")
    const semesterBeforeParens = title.match(/(\d+(?:st|nd|rd|th)\s+Semester)/i);
    if (semesterBeforeParens) {
      semester = semesterBeforeParens[1].trim();
      // Remove semester from program name if found
      program = program.replace(/\d+(?:st|nd|rd|th)\s+Semester\s*/i, "").trim();
    } else {
      // Also check for semester patterns without "Semester" keyword (e.g., "1st, 3rd")
      const semesterPattern = title.match(/(\d+(?:st|nd|rd|th)(?:\s+and\s+\d+(?:st|nd|rd|th))*(?:\s+Semester)?)/i);
      if (semesterPattern) {
        semester = semesterPattern[1].trim();
        program = program.replace(/\d+(?:st|nd|rd|th)(?:\s+and\s+\d+(?:st|nd|rd|th))*(?:\s+Semester)?\s*/i, "").trim();
      }
    }
  }

  // Clean up program name - remove extra words
  program = program.replace(/\s+program(?:me)?\s*/gi, "").trim();

  // Shorten semester text
  if (semester) {
    semester = semester
      .replace(/\s+and\s+/gi, ", ")
      .replace(/\s+semester\s*/gi, " Sem")
      .replace(/\s*,\s*/g, ", ")
      .trim();
  }

  // Build short title
  const parts: string[] = [];

  if (program) {
    parts.push(program);
  }

  if (semester) {
    parts.push(`(${semester})`);
  }

  // If we couldn't extract anything meaningful, fall back to truncating the original
  if (parts.length === 0) {
    return title.length > 60 ? `${title.substring(0, 60)}...` : title;
  }

  return parts.join(" ");
}

export default function ResultsMarquee() {
  const noticesData = examNoticesData as ExamNoticesData;

  // Get recent results (last 10, sorted by date)
  const recentResults = useMemo(() => {
    if (!noticesData || !noticesData.notices || noticesData.notices.length === 0) {
      return [];
    }

    // Filter, map, and sort notices in one pipeline
    return noticesData.notices
      .filter((notice) => {
        const lowerTitle = notice.title.toLowerCase();
        const hasResult = lowerTitle.includes("result") || lowerTitle.includes("declaration");
        return hasResult && !isSpecificEnrollmentNotice(notice.title);
      })
      .map((notice) => ({
        ...notice,
        parsedDate: parseDate(notice.uploadDate),
      }))
      .filter((notice) => notice.parsedDate !== null)
      .sort((a, b) => b.parsedDate!.getTime() - a.parsedDate!.getTime())
      .slice(0, 10);
  }, [noticesData]);

  if (recentResults.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6 overflow-hidden bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800/50 rounded-xl md:rounded-full">
      <div className="flex md:flex-row flex-col items-center gap-4 py-2 px-4">
        <div className="flex items-center gap-2 shrink-0 z-10 bg-zinc-900/80">
          <Bell className="h-4 w-4 text-lime-500" />
          <span className="text-sm font-semibold text-lime-500 whitespace-nowrap">
            Recent Results:
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:60s]">
            {recentResults.map((notice, index) => (
              <Link
                key={`${notice.link}-${index}`}
                href={notice.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 shrink-0 group hover:text-lime-400 transition-colors mx-4"
              >
                <span className="text-sm text-zinc-300 group-hover:text-lime-400 whitespace-nowrap">
                  {shortenNoticeTitle(notice.title)}
                </span>
                <ExternalLink className="h-3 w-3 text-zinc-500 group-hover:text-lime-500 shrink-0" />
                <span className="text-xs text-zinc-500 whitespace-nowrap">
                  ({notice.uploadDate})
                </span>
              </Link>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
