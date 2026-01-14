import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { SemesterBranchSelector } from "./semester-branch-selector";
import { SubjectDetailView } from "./subject-detail-view";
import { SubjectSelectorWrapper } from "./subject-selector-wrapper";

interface University {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  createdAt: string;
}

interface Program {
  id: string;
  universityId: string;
  name: string;
  slug: string;
  hasBranch: boolean;
  semesterCount: number;
  createdAt: string;
}

interface Branch {
  id: string;
  programId: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface Subject {
  id: string;
  programId: string;
  code: string;
  name: string;
  slug: string;
  theoryCredits: number;
  practicalCredits: number | null;
  syllabus: any;
  practicalTopics: any;
  createdAt: string;
}

interface StudyResource {
  id: string;
  subjectId: string;
  name: string;
  type: "notes" | "pyq" | "books" | "practical";
  storageType: "google_drive" | "cloudinary" | "url";
  link: string;
  createdAt: string;
}

interface ProgramPageProps {
  params: Promise<{
    slug: string;
    "program-slug": string;
    params?: string[];
  }>;
}

async function getProgramData(universitySlug: string, programSlug: string) {
  try {
    const cmsUrl = process.env.CMS_URL;
    if (!cmsUrl) {
      throw new Error("CMS URL not configured");
    }

    const baseUrl = cmsUrl.replace(/\/$/, "");
    const response = await axios.get<{
      university: University;
      program: Program;
      branches: Branch[];
    }>(`${baseUrl}/api/public/programs/${universitySlug}/${programSlug}`);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching program data:", error);
    return null;
  }
}

async function getSubjectDetails(
  universitySlug: string,
  programSlug: string,
  semester: string,
  subjectSlug: string,
  branchSlug?: string
) {
  try {
    const cmsUrl = process.env.CMS_URL;
    if (!cmsUrl) {
      throw new Error("CMS URL not configured");
    }

    const baseUrl = cmsUrl.replace(/\/$/, "");
    let path: string;

    if (branchSlug) {
      path = `${baseUrl}/api/public/programs/${universitySlug}/${programSlug}/${semester}/${branchSlug}/${subjectSlug}`;
    } else {
      path = `${baseUrl}/api/public/programs/${universitySlug}/${programSlug}/${semester}/${subjectSlug}`;
    }

    const response = await axios.get<{
      subject: Subject;
      resources: {
        notes: StudyResource[];
        pyq: StudyResource[];
        books: StudyResource[];
        practical: StudyResource[];
      };
    }>(path);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching subject details:", error);
    return null;
  }
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const resolvedParams = await params;
  const universitySlug = resolvedParams.slug;
  const programSlug = resolvedParams["program-slug"];
  const pathParams = resolvedParams.params || [];

  const data = await getProgramData(universitySlug, programSlug);

  if (!data) {
    return notFound();
  }

  const { university, program, branches } = data;

  // Parse URL params based on the path structure
  let semester: string | undefined;
  let branchSlug: string | undefined;
  let subjectSlug: string | undefined;
  let subjectData: {
    subject: Subject;
    resources: {
      notes: StudyResource[];
      pyq: StudyResource[];
      books: StudyResource[];
      practical: StudyResource[];
    };
  } | null = null;

  // Determine what data to fetch based on URL params
  let shouldShowSheet = false;
  let shouldShowSubjectDetails = false;

  if (pathParams.length > 0) {
    semester = pathParams[0];

    if (program.hasBranch) {
      // URL structure: /semester/branch/subject
      if (pathParams.length === 2) {
        // /semester/branch -> show subjects sheet
        branchSlug = pathParams[1];
        shouldShowSheet = true;
      } else if (pathParams.length === 3) {
        // /semester/branch/subject -> show subject detail below
        branchSlug = pathParams[1];
        subjectSlug = pathParams[2];
        shouldShowSubjectDetails = true;
        subjectData = await getSubjectDetails(
          universitySlug,
          programSlug,
          semester,
          subjectSlug,
          branchSlug
        );
        if (!subjectData) {
          return notFound();
        }
      }
    } else {
      // URL structure: /semester/subject
      if (pathParams.length === 1) {
        // /semester -> show subjects sheet
        shouldShowSheet = true;
      } else if (pathParams.length === 2) {
        // /semester/subject -> show subject detail below
        subjectSlug = pathParams[1];
        shouldShowSubjectDetails = true;
        subjectData = await getSubjectDetails(
          universitySlug,
          programSlug,
          semester,
          subjectSlug
        );
        if (!subjectData) {
          return notFound();
        }
      }
    }
  }

  // Find branch object if slug is provided
  const selectedBranch = branchSlug
    ? branches.find((s) => s.slug === branchSlug)
    : undefined;

  const semesterLabel = semester
    ? `${semester}${getOrdinalSuffix(parseInt(semester))} Semester`
    : "";

  return (
    <section className="max-w-7xl mx-auto pb-32 px-6 pt-8 min-h-[68vh]">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/resources" className="hover:underline">
            Universities
          </Link>
          <ChevronRight size={16} />
          <Link
            href={`/resources/${universitySlug}`}
            className="hover:underline"
          >
            {university.name}
          </Link>
          <ChevronRight size={16} />
          <Link
            href={`/resources/${universitySlug}/${programSlug}`}
            className="hover:underline"
          >
            {program.name}
          </Link>
          {semester && (
            <>
              <ChevronRight size={16} />
              <span className={!subjectSlug ? "text-foreground" : ""}>
                {semesterLabel}
              </span>
            </>
          )}
          {selectedBranch && (
            <>
              <ChevronRight size={16} />
              <span className={!subjectSlug ? "text-foreground" : ""}>
                {selectedBranch.name}
              </span>
            </>
          )}
          {subjectData && (
            <>
              <ChevronRight size={16} />
              <span className="text-foreground">
                {subjectData.subject.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Selection Section - Always Visible */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Section: Selection Controls */}
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">{program.name}</h1>
          </CardHeader>
          <CardContent className="space-y-6">
            <SemesterBranchSelector
              program={program}
              branches={branches}
              universitySlug={universitySlug}
              programSlug={programSlug}
              currentSemester={semester}
              currentBranch={branchSlug}
            />
          </CardContent>
        </Card>

        {/* Right Section: Subject Selector */}
        <SubjectSelectorWrapper
          currentSubject={
            subjectData
              ? {
                  name: subjectData.subject.name,
                  url: branchSlug
                    ? `/resources/${universitySlug}/${programSlug}/${semester}/${branchSlug}/${subjectData.subject.slug}`
                    : `/resources/${universitySlug}/${programSlug}/${semester}/${subjectData.subject.slug}`,
                }
              : undefined
          }
          semester={semester}
          branchSlug={branchSlug}
          selectedBranch={selectedBranch}
          hasBranch={program.hasBranch}
          universitySlug={universitySlug}
          programSlug={programSlug}
          shouldShowSheetInitially={shouldShowSheet}
        />
      </div>

      {/* Subject Details Section - Shows Below When Subject is Selected */}
      {shouldShowSubjectDetails && subjectData && (
        <SubjectDetailView
          subject={subjectData.subject}
          resources={subjectData.resources}
        />
      )}
    </section>
  );
}
