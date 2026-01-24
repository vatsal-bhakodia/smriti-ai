"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ChevronLeft, ChevronRight, Calendar, ExternalLink, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import examNoticesData from "@/public/exam-notices.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

interface MonthGroup {
  monthKey: string; // Format: "YYYY-MM"
  monthLabel: string; // Format: "January 2026"
  notices: ExamNotice[];
}

const NOTICES_PER_PAGE = 10;

function parseDate(dateStr: string): Date | null {
  // Date format: "DD-MM-YY" or "DD-MM-YYYY"
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  let year = parseInt(parts[2], 10);

  // Handle 2-digit years (assume 2000-2099)
  if (year < 100) {
    year += 2000;
  }

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  return new Date(year, month, day);
}

function formatDateWithTime(date: Date): string {
  // Format: "DD MMM YYYY, HH:MM AM/PM"
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12; // Convert to 12-hour format
  const displayMinutes = String(minutes).padStart(2, "0");
  return `${day} ${month} ${year}, ${displayHours}:${displayMinutes} ${ampm}`;
}

function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function groupNoticesByMonth(notices: ExamNotice[]): MonthGroup[] {
  const monthMap = new Map<string, ExamNotice[]>();

  notices.forEach((notice) => {
    const date = parseDate(notice.uploadDate);
    if (!date) return;

    const monthKey = getMonthKey(date);
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }
    monthMap.get(monthKey)!.push(notice);
  });

  // Convert to array and sort by month (newest first)
  const monthGroups: MonthGroup[] = Array.from(monthMap.entries())
    .map(([monthKey, notices]) => {
      const date = new Date(monthKey + "-01");
      return {
        monthKey,
        monthLabel: getMonthLabel(date),
        notices: notices.sort((a, b) => {
          const dateA = parseDate(a.uploadDate);
          const dateB = parseDate(b.uploadDate);
          if (!dateA || !dateB) return 0;
          return dateB.getTime() - dateA.getTime(); // Newest first
        }),
      };
    })
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey)); // Newest month first

  return monthGroups;
}

export default function ExamNotices() {
  // Use imported JSON data directly - it's updated during build by GitHub Actions
  const noticesData = examNoticesData as ExamNoticesData;

  // Group notices by month
  const monthGroups = groupNoticesByMonth(noticesData.notices);

  // Get current month
  const currentDate = new Date();
  const currentMonthKey = getMonthKey(currentDate);

  // Find current month or use the most recent month
  const foundMonthIndex = monthGroups.findIndex(
    (group) => group.monthKey === currentMonthKey
  );
  const defaultMonthIndex = foundMonthIndex >= 0 ? foundMonthIndex : 0;

  const [currentMonthIndex, setCurrentMonthIndex] = useState(defaultMonthIndex);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Get notices for current month
  const currentMonthGroup = monthGroups[currentMonthIndex];

  // Filter notices by search query
  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) {
      return currentMonthGroup.notices;
    }

    const query = searchQuery.toLowerCase().trim();
    return currentMonthGroup.notices.filter((notice) =>
      notice.title.toLowerCase().includes(query)
    );
  }, [currentMonthGroup.notices, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredNotices.length / NOTICES_PER_PAGE);
  const startIndex = (currentPage - 1) * NOTICES_PER_PAGE;
  const endIndex = startIndex + NOTICES_PER_PAGE;
  const paginatedNotices = filteredNotices.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleMonthSelect = (index: number) => {
    setCurrentMonthIndex(index);
    setCurrentPage(1);
    setSearchQuery(""); // Clear search when changing month
    const element = document.getElementById("exam-notices-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("exam-notices-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (!noticesData || noticesData.notices.length === 0 || monthGroups.length === 0) {
    return null;
  }

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-4 md:p-8">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full" defaultValue="">
          <AccordionItem value="exam-notices" className="border-none">
            <AccordionTrigger className="hover:no-underline py-0">
              <div className="flex md:flex-row flex-col items-center justify-between w-full pr-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-6 w-6 text-primary" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">Examination Notices</h2>
                </div>
                {noticesData.lastUpdated && (
                  <span className="text-xs text-zinc-500">
                    Updated: {formatDateWithTime(new Date(noticesData.lastUpdated))}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-6">

              {/* Filters Section */}
              <div className="space-y-4 mb-6">
                {/* Month Selector */}
                <div className="flex items-center justify-between gap-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMonthSelect(currentMonthIndex - 1)}
                    disabled={currentMonthIndex === 0}
                    className="text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span className="hidden md:block">
                      Previous
                    </span>
                  </Button>

                  <div className="flex items-center gap-2 flex-1 justify-center max-w-md">
                    <select
                      value={currentMonthIndex}
                      onChange={(e) => handleMonthSelect(Number(e.target.value))}
                      className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 w-full cursor-pointer"
                    >
                      {monthGroups.map((group, index) => (
                        <option key={group.monthKey} value={index} className="bg-zinc-800">
                          {group.monthLabel} ({group.notices.length})
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMonthSelect(currentMonthIndex + 1)}
                    disabled={currentMonthIndex === monthGroups.length - 1}
                    className="text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden md:block">
                      Next
                    </span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder="Search notices by name..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg pl-10 pr-10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notices List */}
              <div id="exam-notices-list" className="space-y-3">
                {paginatedNotices.length > 0 ? (
                  paginatedNotices.map((notice, index) => (
                    <Link
                      key={`${currentMonthGroup.monthKey}-${startIndex + index}`}
                      href={notice.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 p-4 hover:border-lime-500/50 hover:bg-zinc-800/70 transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm group-hover:text-lime-400 transition-colors line-clamp-2">
                              {notice.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 text-zinc-500" />
                                <span className="text-xs text-zinc-500">
                                  {(() => {
                                    const date = parseDate(notice.uploadDate);
                                    if (date) {
                                      return formatDateWithTime(date);
                                    }
                                    return notice.uploadDate;
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-lime-500 transition-colors shrink-0 mt-1" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 text-sm">
                      {searchQuery
                        ? `No notices found matching "${searchQuery}"`
                        : "No notices for this month"}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                      if (page === "ellipsis-start" || page === "ellipsis-end") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-zinc-500"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className={
                            currentPage === page
                              ? "bg-lime-500 text-black hover:bg-lime-600"
                              : "text-zinc-400 hover:text-white"
                          }
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Results Summary */}
              <div className="mt-4 text-center">
                <p className="text-xs text-zinc-500">
                  {searchQuery ? (
                    <>
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredNotices.length)} of {filteredNotices.length} notice{filteredNotices.length !== 1 ? "s" : ""} matching "{searchQuery}"
                    </>
                  ) : (
                    <>
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredNotices.length)} of {filteredNotices.length} notice{filteredNotices.length !== 1 ? "s" : ""} for {currentMonthGroup.monthLabel}
                    </>
                  )}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
