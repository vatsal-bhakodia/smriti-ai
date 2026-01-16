"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Banner from "@/components/ads/Banner";

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
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-6">
        <div className="relative flex-1 max-w-2xl w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search programs by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base bg-background/50 backdrop-blur-sm border-2 focus-visible:border-primary/50 transition-all w-full"
          />
        </div>
        <div className="flex-shrink-0 flex justify-center lg:justify-start">
          <Banner size="468x60" className="lg:min-w-[468px]" />
        </div>
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
