"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, Clock } from "lucide-react";
import Link from "next/link";

interface SubjectHistory {
  name: string;
  url: string;
  timestamp: number;
}

interface SubjectSelectorProps {
  currentSubject?: {
    name: string;
    url: string;
  };
  semester?: string;
  branchSlug?: string;
  hasBranch: boolean;
  onOpenSheet: () => void;
  canOpenSheet: boolean; // true if semester (and branch if required) is selected
}

const STORAGE_KEY = "smriti_recent_subjects";
const MAX_RECENT_SUBJECTS = 5;

export function SubjectSelector({
  currentSubject,
  semester,
  branchSlug,
  hasBranch,
  onOpenSheet,
  canOpenSheet,
}: SubjectSelectorProps) {
  const [recentSubjects, setRecentSubjects] = useState<SubjectHistory[]>([]);

  // Load recent subjects from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SubjectHistory[];
        setRecentSubjects(parsed);
      }
    } catch (error) {
      console.error("Error loading recent subjects:", error);
    }
  }, []);

  // Save current subject to localStorage
  useEffect(() => {
    if (currentSubject) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let subjects: SubjectHistory[] = stored ? JSON.parse(stored) : [];

        // Remove if already exists
        subjects = subjects.filter((s) => s.url !== currentSubject.url);

        // Add to beginning
        subjects.unshift({
          name: currentSubject.name,
          url: currentSubject.url,
          timestamp: Date.now(),
        });

        // Keep only last MAX_RECENT_SUBJECTS
        subjects = subjects.slice(0, MAX_RECENT_SUBJECTS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
        setRecentSubjects(subjects);
      } catch (error) {
        console.error("Error saving recent subject:", error);
      }
    }
  }, [currentSubject]);

  // Filter out current subject from recent list
  const filteredRecentSubjects = recentSubjects.filter(
    (s) => s.url !== currentSubject?.url,
  );

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-3xl">Subjects</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your subject
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subject Selector Dropdown */}
        <Button
          variant="outline"
          className="w-full justify-between h-auto py-3 px-4"
          onClick={canOpenSheet ? onOpenSheet : undefined}
          disabled={!canOpenSheet}
        >
          <div className="flex items-center gap-3 text-left flex-1">
            <BookOpen className="size-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              {currentSubject ? (
                <p className="font-medium truncate">{currentSubject.name}</p>
              ) : !semester ? (
                <p className="text-muted-foreground">
                  Select a semester to view subjects
                </p>
              ) : hasBranch && !branchSlug ? (
                <p className="text-muted-foreground">
                  Select a branch to view subjects
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Click to select a subject
                </p>
              )}
            </div>
          </div>
          <ChevronDown className="size-5 flex-shrink-0 ml-2" />
        </Button>

        {/* Recent Subjects */}
        {filteredRecentSubjects.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span className="font-medium">Recent Subjects</span>
            </div>
            <div className="flex gap-4 overflow-y-auto">
              {filteredRecentSubjects.slice(0, 4).map((subject, index) => (
                <Link key={index} href={subject.url}>
                  <Button variant="secondary" className="py-2 px-3">
                    <span className="truncate text-sm">{subject.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentSubject && filteredRecentSubjects.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            {!semester
              ? "Start by selecting a semester above"
              : hasBranch && !branchSlug
                ? "Select a branch to continue"
                : "No subjects viewed yet"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
