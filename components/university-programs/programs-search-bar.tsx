"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProgramsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount?: number;
  totalCount: number;
}

export default function ProgramsSearchBar({
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}: ProgramsSearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Search programs by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base bg-background/50 backdrop-blur-sm border-2 focus-visible:border-primary/50 transition-all"
        />
      </div>
      {searchQuery && resultCount !== undefined && (
        <p className="mt-3 text-sm text-muted-foreground">
          {resultCount === 0
            ? "No programs found"
            : `Found ${resultCount} of ${totalCount} ${
                resultCount === 1 ? "program" : "programs"
              }`}
        </p>
      )}
    </div>
  );
}
