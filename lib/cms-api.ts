import axios from "axios";

const getCmsUrl = () => {
  const cmsUrl = process.env.BACKEND_URL;
  if (!cmsUrl) {
    throw new Error("BACKEND_URL environment variable is not set");
  }
  return cmsUrl.replace(/\/$/, "");
};

export interface University {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  createdAt: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  slug: string;
  hasBranch: boolean;
  semesterCount: number;
  createdAt: string;
}

export interface Branch {
  id: string;
  programId: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  programId: string;
  theoryCode: string;
  practicalCode: string | null;
  name: string;
  slug: string;
  theoryCredits: number;
  syllabus: any;
  practicalCredits: number | null;
  practicalTopics: any;
  createdAt: string;
}

export async function getUniversities(): Promise<University[]> {
  try {
    const baseUrl = getCmsUrl();
    const response = await axios.get<University[]>(
      `${baseUrl}/api/public/universities`,
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  try {
    const universities = await getUniversities();
    return universities.find((u) => u.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching university by slug:", error);
    return null;
  }
}

export async function getProgramsByUniversityId(
  universityId: string
): Promise<Program[]> {
  try {
    const baseUrl = getCmsUrl();
    const response = await axios.get<Program[]>(
      `${baseUrl}/api/public/programs?universityId=${universityId}`,
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export async function getProgramBySlug(
  universityId: string,
  programSlug: string
): Promise<Program | null> {
  try {
    const programs = await getProgramsByUniversityId(universityId);
    return programs.find((p) => p.slug === programSlug) || null;
  } catch (error) {
    console.error("Error fetching program by slug:", error);
    return null;
  }
}

export async function getbranchesByProgramId(
  programId: string
): Promise<Branch[]> {
  try {
    const baseUrl = getCmsUrl();
    const response = await axios.get<Branch[]>(
      `${baseUrl}/api/public/branches?programId=${programId}`,
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
}

// Note: The public subjects API seems to use termId which doesn't match the schema
// For now, we'll fetch all subjects and filter client-side
// This might need to be updated when a proper public subjects API is available
export async function getAllSubjects(): Promise<Subject[]> {
  try {
    const baseUrl = getCmsUrl();
    const response = await axios.get<Subject[]>(
      `${baseUrl}/api/public/subjects`,
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}
