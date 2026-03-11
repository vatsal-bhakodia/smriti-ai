import { ResultAPIResponse } from "@/types/result";

export const sampleUniversity = {
  id: "sample-uni",
  name: "Sample University",
  slug: "sample-university",
  location: "Sample City",
  createdAt: new Date().toISOString(),
};

export const sampleProgram = {
  id: "sample-prog",
  universityId: "sample-uni",
  name: "B.Tech",
  slug: "btech",
  hasBranch: true,
  semesterCount: 8,
  createdAt: new Date().toISOString(),
};

export const sampleBranches = [
  {
    id: "sample-branch-cse",
    programId: "sample-prog",
    name: "Computer Science Engineering",
    slug: "cse",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-branch-it",
    programId: "sample-prog",
    name: "Information Technology",
    slug: "it",
    createdAt: new Date().toISOString(),
  },
];

export const sampleSubjects = [
  {
    id: "sub-1",
    programId: "sample-prog",
    theoryCode: "027104",
    practicalCode: "027152",
    name: "Applied Mathematics-II",
    slug: "applied-mathematics-ii",
    theoryCredits: 4,
    practicalCredits: 1,
    syllabus: null,
    practicalTopics: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sub-2",
    programId: "sample-prog",
    theoryCode: "027202",
    practicalCode: "027252",
    name: "Data Structures",
    slug: "data-structures",
    theoryCredits: 4,
    practicalCredits: 1,
    syllabus: null,
    practicalTopics: null,
    createdAt: new Date().toISOString(),
  },
];

export const sampleSubjectDetails = {
  subject: sampleSubjects[0],
  resources: {
    notes: [
      {
        id: "res-1",
        subjectId: "sub-1",
        name: "Chapter 1 Notes",
        type: "notes" as const,
        storageType: "url" as const,
        link: "https://example.com/notes",
        createdAt: new Date().toISOString(),
      },
    ],
    pyq: [],
    books: [],
    practical: [],
  },
};

export const sampleResults: ResultAPIResponse[] = [
  {
    nrollno: "00000000000",
    stname: "Sample Student",
    byoa: 2021,
    yoa: 2021,
    father: "Sample Father",
    prgcode: "027",
    prgname: "B.Tech (CSE)",
    icode: "164",
    iname: "University School of Info.,Comm. & Tech.",
    euno: 2,
    papercode: "027104",
    papername: "Applied Mathematics-II",
    minorprint: "20",
    majorprint: "65",
    moderatedprint: "85",
    statuscode: "P",
    rmonth: 5,
    ryear: 2022,
    declareddate: "08-Aug-2022",
    eugpa: 9,
  },
  {
    nrollno: "00000000000",
    stname: "Sample Student",
    byoa: 2021,
    yoa: 2021,
    father: "Sample Father",
    prgcode: "027",
    prgname: "B.Tech (CSE)",
    icode: "164",
    iname: "University School of Info.,Comm. & Tech.",
    euno: 2,
    papercode: "027106",
    papername: "Applied Physics-II",
    minorprint: "22",
    majorprint: "60",
    moderatedprint: "82",
    statuscode: "P",
    rmonth: 5,
    ryear: 2022,
    declareddate: "08-Aug-2022",
    eugpa: 9,
  },
];

export const sampleCreditsData = {
  credits: {
    "027104": { total: 4, theory: 4, practical: 0 },
    "027106": { total: 4, theory: 4, practical: 0 },
    "027152": { total: 1, theory: 0, practical: 1 },
  },
};

// 1x1 transparent PNG data URL, formatted as base64
export const sampleCaptchaImageBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyCAIAAAAx7rVNAAADRklEQVR4Xu2YPXLcMAxGXaRIlTLXSZkqd/ABcoh4UuYO8TnS5WaMZjCG4Q8/hCRKJB2+QWEDH7jrfaO1dh9KU348f9sKu4srecBGC5bIO7lEIUEil8uruVAhs0Reyh0KiSXyIu5TSIz27vrh8/etsDsVdytkBhQ5qctuCokxL8q5XHZWyAwlskzlchSFxGgiywwux1JIjPbuSgzrckSFzIAiy3guh1ZIHLgof338i60LYJd9dV6r8PHrJy6vbwYYHcsnMZHAXNcnx3VgkVcOMKVCfUXqTHBmgLmrj42Lr0s9iuv1eexhSoXl7burDkD46cvPreBkE1jUzUzR1mZRj6rFD5pnVoVxwMxnROotaGbq8OKj8yLEDKRQ/wE6oGOyv12UfCPj5WOR3laMtwV9795HxnY9LtFfofxVZqCfOWrzZ767yjzhiYy3TIIVb6RFeskMcyuEJl+CJNJckZBI6bK6AsT5eCrJJzXvR6H+LGiumLDI/EpJhKsBJp/UjKVQxvZmYoX6c4hms2g+iolMeuFqgMgcFTCEQtnRGW8FmrHCkvuWx3wUk0xSZpKFRyR4Pwq5WZ0GIuWKd8tT/JMBGUsWHpHgf1RImBelXtEidcZDJquFy2lGUchNnYFfzYxsJqeMFOmtnL/fCQrXdjKcQuoE02ozOQUyn0Pk1AwAXhjOyRwVcFZh/Dy8qdmXnWBabcZTs3lg6v2blORPMwNJlsI3yOmBf5OAXgFkwMtUGUgh9+UPMIL+9kHC7BcnH/TNKd/yBFuByGCLyWRiWiqEJ5Ecef1gxM2TCpMjswmQyAP3rt6D5jmrsKgnYVaw4vWDEXXoszysmCXP2buiR9VikbLJB2pgHcc1plcII12vR7ygM7p2haHKy0UJzYB8UtNAYan9nZgOn3G1r0cwjZOETnpbelotc1ccaeCdkKGNQiL4Y4AgU+3rEQEP7cUk5sqf30+ydKZa5vneLQ/jHVKlpcJewIt+svD0NPrrOkDf7zShj0L9wp0pPL0r94tsrFC/vmbh2rvD/A5d0lBkY4UL4AaRS+EdVC/KMyyFt3KFyKWwA21FLoXdaPXuuhT256TIpXAUDotcCqdnKZyepXB6lsLpWQqn5x/GCpRmEVwnywAAAABJRU5ErkJggg==";
