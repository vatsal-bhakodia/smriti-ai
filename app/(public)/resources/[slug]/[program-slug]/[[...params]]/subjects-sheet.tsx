"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface Subject {
  id: string;
  programId: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface Branch {
  id: string;
  programId: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface SubjectsSheetProps {
  semester: string;
  branch?: Branch;
  universitySlug: string;
  programSlug: string;
  currentSubjectUrl?: string;
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export function SubjectsSheet({
  semester,
  branch,
  universitySlug,
  programSlug,
  currentSubjectUrl,
}: SubjectsSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects when sheet opens or params change
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          universitySlug,
          programSlug,
          semester,
        });
        if (branch?.slug) {
          params.set("branch", branch.slug);
        }

        const response = await axios.get<Subject[]>(
          `/api/resources/subjects?${params.toString()}`
        );
        setSubjects(response.data);
      } catch (err: any) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchSubjects();
    }
  }, [open, universitySlug, programSlug, semester, branch?.slug]);

  // Auto-open when semester changes
  useEffect(() => {
    setOpen(true);
  }, [semester, branch]);

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    setOpen(false);
    // If a subject is already selected, navigate to that subject's URL
    // Otherwise, navigate back to base program page
    if (currentSubjectUrl) {
      router.push(currentSubjectUrl);
    } else {
      router.push(`/resources/${universitySlug}/${programSlug}`);
    }
  };

  const semesterNum = parseInt(semester);
  const semesterLabel = `${semesterNum}${getOrdinalSuffix(
    semesterNum
  )} Semester`;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto gap-0"
      >
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Subjects</SheetTitle>
          </div>
          <SheetDescription>
            {semesterLabel}
            {branch && ` • ${branch.name}`}
          </SheetDescription>
        </SheetHeader>

        <div className="p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="py-3 rounded-md">
                  <CardContent className="px-4">
                    <div className="flex justify-between items-center gap-3">
                      <Skeleton className="h-5 flex-1" />
                      <Skeleton className="h-5 w-5 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No subjects found for the selected criteria.
              </p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No subjects match your search.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubjects.map((subject) => {
                const subjectUrl = branch
                  ? `/resources/${universitySlug}/${programSlug}/${semester}/${branch.slug}/${subject.slug}`
                  : `/resources/${universitySlug}/${programSlug}/${semester}/${subject.slug}`;

                return (
                  <Link key={subject.id} href={subjectUrl} className="block">
                    <Card className="py-2 rounded-md hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="px-4">
                        <div className="flex justify-between items-center gap-3">
                          <h3 className="font-medium text-md">
                            {subject.name}
                          </h3>
                          <ChevronRight className="size-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
