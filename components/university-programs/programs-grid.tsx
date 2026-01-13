"use client";

import { useState, useMemo } from "react";
import { Program } from "@/lib/cms-api";
import ProgramCard from "./program-card";
import ProgramsSearchBar from "./programs-search-bar";

interface ProgramsGridProps {
  programs: Program[];
  universitySlug: string;
}

export default function ProgramsGrid({ programs, universitySlug }: ProgramsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrograms = useMemo(() => {
    if (!searchQuery.trim()) {
      return programs;
    }

    const query = searchQuery.toLowerCase().trim();
    return programs.filter((program) =>
      program.name.toLowerCase().includes(query)
    );
  }, [programs, searchQuery]);

  if (programs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-muted-foreground text-lg">
            No programs available for this university at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProgramsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredPrograms.length}
        totalCount={programs.length}
      />

      {filteredPrograms.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-lg">
              No programs found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              universitySlug={universitySlug}
            />
          ))}
        </div>
      )}
    </>
  );
}
