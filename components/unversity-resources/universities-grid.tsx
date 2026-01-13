"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, GraduationCap } from "lucide-react";
import { type University } from "@/lib/cms-api";

interface UniversitiesGridProps {
  universities: University[];
  searchQuery: string;
}

export default function UniversitiesGrid({
  universities,
  searchQuery,
}: UniversitiesGridProps) {
  if (universities.length === 0) {
    return (
      <div className="text-center py-16 md:py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <GraduationCap className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-lg">
          {searchQuery
            ? "No universities match your search. Try a different query."
            : "No universities available at the moment. Please check back later."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {universities.map((university) => (
        <Link
          key={university.id}
          href={`/resources/${university.slug}`}
          className="block group"
        >
          <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-0 mb-4">
              {university.location && (
                <div className="flex items-center text-muted-foreground gap-2 mb-3 text-sm">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span className="truncate">{university.location}</span>
                </div>
              )}
              <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {university.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                <span>Explore programs</span>
                <svg
                  className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
