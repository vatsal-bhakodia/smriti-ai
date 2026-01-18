import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Metadata } from "next";
import { generateMetadataUtil } from "@/utils/generateMetadata";
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
  theoryCode: string;
  practicalCode: string | null;
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
    const cmsUrl = process.env.BACKEND_URL;
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
    const cmsUrl = process.env.BACKEND_URL;
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

function capitalizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
}

export async function generateMetadata({
  params,
}: ProgramPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const universitySlug = resolvedParams.slug;
  const programSlug = resolvedParams["program-slug"];
  const pathParams = resolvedParams.params || [];

  // Fetch program data
  const data = await getProgramData(universitySlug, programSlug);

  if (!data) {
    return generateMetadataUtil({
      title: "Program Not Found",
      description: "The requested program could not be found.",
      url: `https://www.smriti.live/resources/${universitySlug}/${programSlug}`,
    });
  }

  const { university, program, branches } = data;

  // Convert university slug to capitalized form
  const universitySlugCaps = capitalizeSlug(universitySlug);

  // Parse URL params to determine the current page level
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

  // Parse params similar to the page component
  if (pathParams.length > 0) {
    semester = pathParams[0];

    if (program.hasBranch) {
      if (pathParams.length === 2) {
        branchSlug = pathParams[1];
      } else if (pathParams.length === 3) {
        branchSlug = pathParams[1];
        subjectSlug = pathParams[2];
        subjectData = await getSubjectDetails(
          universitySlug,
          programSlug,
          semester,
          subjectSlug,
          branchSlug
        );
      }
    } else {
      if (pathParams.length === 2) {
        subjectSlug = pathParams[1];
        subjectData = await getSubjectDetails(
          universitySlug,
          programSlug,
          semester,
          subjectSlug
        );
      }
    }
  }

  // Find branch object if slug is provided
  const selectedBranch = branchSlug
    ? branches.find((b) => b.slug === branchSlug)
    : undefined;

  // Build URL
  let url = `https://www.smriti.live/resources/${universitySlug}/${programSlug}`;
  if (semester) {
    url += `/${semester}`;
    if (branchSlug) {
      url += `/${branchSlug}`;
    }
    if (subjectSlug) {
      url += `/${subjectSlug}`;
    }
  }

  // Generate metadata based on the current page level
  if (subjectData && subjectSlug && semester) {
    // Subject detail page
    const semesterLabel = `${semester}${getOrdinalSuffix(
      parseInt(semester)
    )} Sem`;
    const branchName = selectedBranch ? ` - ${selectedBranch.name}` : "";
    const resourceCount =
      subjectData.resources.notes.length +
      subjectData.resources.pyq.length +
      subjectData.resources.books.length +
      subjectData.resources.practical.length;

    return generateMetadataUtil({
      title: `${subjectData.subject.name} | ${program.name}${branchName} ${semesterLabel} Syllabus & Notes`,
      description: `Download ${subjectData.subject.name} (${
        subjectData.subject.theoryCode
      }) syllabus, notes, PYQs, books & practicals for ${
        program.name
      }${branchName} ${semesterLabel} at ${universitySlugCaps}. ${
        resourceCount > 0
          ? `${resourceCount}+ study resources available.`
          : "Complete study materials & previous year questions."
      }`,
      keywords: [
        subjectData.subject.name,
        subjectData.subject.theoryCode,
        `${program.name} ${semesterLabel}`,
        `${selectedBranch?.name || ""} syllabus`,
        universitySlugCaps,
        university.name,
        universitySlugCaps,
        "notes",
        "PYQ",
        "previous year questions",
        "books",
        "practicals",
        "study materials",
        "semester syllabus",
      ],
      url,
    });
  } else if (semester && branchSlug && selectedBranch) {
    // Branch subjects list page (e.g., IT 4th Sem subjects/resources)
    const semesterLabel = `${semester}${getOrdinalSuffix(
      parseInt(semester)
    )} Semester`;

    return generateMetadataUtil({
      title: `${universitySlugCaps} ${program.name} ${selectedBranch.name} ${semesterLabel} Syllabus | Notes PYQ & Resources`,
      description: `Explore complete syllabus, subjects list, notes, previous year questions (PYQ), books & study materials for ${universitySlugCaps} ${program.name} - ${selectedBranch.name} ${semesterLabel}. Download PDFs & detailed resources.`,
      keywords: [
        `${program.name} syllabus`,
        `${selectedBranch.name} syllabus ${universitySlugCaps}`,
        `${semesterLabel} syllabus`,
        university.name,
        universitySlugCaps,
        "subjects list",
        "study resources",
        "notes",
        "PYQ",
        "books",
        "academic syllabus",
      ],
      url,
    });
  } else if (semester) {
    // Semester subjects list page (program-wide, no branch)
    const semesterLabel = `${semester}${getOrdinalSuffix(
      parseInt(semester)
    )} Semester`;

    return generateMetadataUtil({
      title: `${universitySlugCaps} ${program.name} ${semesterLabel} Syllabus & Study Resources`,
      description: `Browse all subjects, syllabus PDF, notes, PYQs, books & practical materials for ${program.name} ${semesterLabel} at ${universitySlugCaps}. One-stop academic resources for students.`,
      keywords: [
        `${program.name} syllabus`,
        `${semesterLabel} ${universitySlugCaps}`,
        university.name,
        universitySlugCaps,
        "syllabus PDF",
        "study resources",
        "notes PYQ",
        "semester subjects",
      ],
      url,
    });
  } else {
    // Base program page
    return generateMetadataUtil({
      title: `${universitySlugCaps} ${program.name} Syllabus | Notes PYQ Books & Resources`,
      description: `Access full ${program.name} syllabus, semester-wise subjects, notes, previous year questions, books & practicals at ${universitySlugCaps}. Complete study materials for all semesters.`,
      keywords: [
        `${program.name} syllabus ${universitySlugCaps}`,
        university.name,
        universitySlugCaps,
        "B.Tech syllabus",
        "study resources",
        "notes",
        "PYQ",
        "books",
        "practicals",
        "semester wise syllabus",
      ],
      url,
    });
  }
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const resolvedParams = await params;
  const universitySlug = resolvedParams.slug;
  const universitySlugCaps = capitalizeSlug(universitySlug);
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

  // Construct H1 based on URL structure (similar to metadata title)
  let h1Title: string;
  if (subjectData && subjectSlug && semester) {
    // Subject detail page: Target searches like "{Subject} syllabus PDF {University} {Program} {Semester}"
    const semesterLabelShort = `${semester}${getOrdinalSuffix(
      parseInt(semester)
    )} Sem`;
    const branchName = selectedBranch ? ` ${selectedBranch.name}` : "";
    h1Title = `Download ${subjectData.subject.name} Syllabus, Notes & PYQ for ${universitySlugCaps} ${program.name}${branchName} ${semesterLabelShort}`;
  } else if (semester && branchSlug && selectedBranch) {
    // Branch subjects list page: Target "{University} {Program} {Branch} {Semester} syllabus notes"
    h1Title = `${universitySlugCaps} ${program.name} ${selectedBranch.name} ${semesterLabel} Syllabus - Free Notes, PYQ & Study Resources`;
  } else if (semester) {
    // Semester subjects list page: Target "{University} {Program} {Semester} syllabus download"
    h1Title = `${universitySlugCaps} ${program.name} ${semesterLabel} Syllabus PDF - Notes, Books & Exam Resources`;
  } else {
    // Base program page: Target broad searches like "{University} {Program} syllabus all semesters"
    h1Title = `${universitySlugCaps} ${program.name} Syllabus All Semesters - Free Notes, PYQ, Books & Resources`;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pt-8 min-h-[65vh] pb-20">
      {/* H1 for SEO */}
      <h1 className="sr-only">{h1Title}</h1>

      {/* Breadcrumbs */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/resources" className="hover:underline">
            Universities
          </Link>
          <ChevronRight size={16} />
          <Link
            href={`/resources/${universitySlug}`}
            className="hover:underline"
          >
            {universitySlugCaps}
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
            <CardTitle className="text-3xl font-bold">{program.name}</CardTitle>
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
