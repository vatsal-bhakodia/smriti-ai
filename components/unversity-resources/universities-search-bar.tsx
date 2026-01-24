"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UniversitiesSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount?: number;
}

export default function UniversitiesSearchBar({
  searchQuery,
  onSearchChange,
  resultCount,
}: UniversitiesSearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative flex-1 max-w-2xl w-full lg:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Search universities by name or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base bg-background/50 backdrop-blur-sm border-2 focus-visible:border-primary/50 transition-all w-full"
        />
      </div>
      {searchQuery && resultCount !== undefined && (
        <p className="mt-3 text-sm text-muted-foreground">
          {resultCount === 0
            ? "No universities found"
            : `Found ${resultCount} ${
                resultCount === 1 ? "university" : "universities"
              }`}
        </p>
      )}
    </div>
  );
}
