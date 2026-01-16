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
  cgpa: number;
  allResults: ResultAPIResponse[];
}
