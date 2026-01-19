export interface ResultAPIResponse {
  nrollno: string;
  stname: string;
  byoa: number;
  yoa: number;
  father: string;
  prgcode: string;
  prgname: string;
  icode: string;
  iname: string;
  euno: number;
  papercode: string;
  papername: string;
  minorprint: string;
  majorprint: string;
  moderatedprint: string;
  statuscode: string;
  rmonth: number;
  ryear: number;
  declareddate: string;
  eugpa: number;
}

export interface SubjectCreditsResponse {
  credits: Record<
    string,
    {
      theoryCredits: number;
      practicalCredits: number | null;
      totalCredits: number;
    }
  >;
  found: number;
  requested: number;
}

export interface SubjectCredits {
  theoryCredits: number;
  practicalCredits: number | null;
  totalCredits: number;
}

export type CreditsMap = Record<string, SubjectCredits>;

export interface DetailedCredits {
  total: number;
  theory: number;
  practical: number | null;
  isFallback: boolean;
}

export interface ProcessedSemester {
  euno: number;
  subjects: ResultAPIResponse[];
  filteredSubjects: ResultAPIResponse[];
  totalMarks: number;
  sgpa: number;
  credits: number;
}

export interface ProcessedData {
  studentInfo: {
    name: string;
    enrollmentNumber: string;
    institute: string;
    instituteCode: string;
    program: string;
    programCode: string;
    yearOfAdmission: number;
  };
  semesters: ProcessedSemester[];
  gradeDistribution: { grade: string; count: number }[];
  gpaTrend: { semester: string; sgpa: number }[];
  cgpa: number | null; // null if any subject is missing credits
  hasCompleteCredits: boolean; // true only if all subjects have credits from CMS
  allResults: ResultAPIResponse[];
}
