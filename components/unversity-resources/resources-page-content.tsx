"use client";

import { useState, useMemo } from "react";
import { type University } from "@/lib/cms-api";
import UniversitiesSearchBar from "./universities-search-bar";
import UniversitiesGrid from "./universities-grid";

interface ResourcesPageContentProps {
  universities: University[];
}

export default function ResourcesPageContent({
  universities,
}: ResourcesPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) {
      return universities;
    }

    const query = searchQuery.toLowerCase().trim();
    return universities.filter(
      (university) =>
        university.name.toLowerCase().includes(query) ||
        university.location?.toLowerCase().includes(query) ||
        university.slug.toLowerCase().includes(query)
    );
  }, [universities, searchQuery]);

  return (
    <>
      {/* Search Bar */}
      <UniversitiesSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredUniversities.length}
      />

      {/* Universities Grid */}
      <UniversitiesGrid
        universities={filteredUniversities}
        searchQuery={searchQuery}
      />
    </>
  );
}
