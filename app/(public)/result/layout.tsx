import { generateMetadataUtil } from "@/utils/generateMetadata";

export const metadata = generateMetadataUtil({
  title: "IPU Result 2025-2026 | Check GGSIPU Semester Results",
  description:
    "Check IPU result 2025-2026 instantly - BTech, BBA, BCA, MBA, MBBS, LLB semester results with CGPA, SGPA & marks. Fast GGSIPU result checker for all semesters. Enter roll number to view Guru Gobind Singh Indraprastha University exam results.",
  keywords: [
    "ipu result",
    "ggsipu result",
    "ipu result 2025",
    "ipu result 2026",
    "check ipu result",
    "how to check ipu result",
    "ipu semester result",
    "ipu result btech",
    "ipu result bba",
    "ipu result bca",
    "ipu result mba",
    "ipu result mbbs",
    "ipu result bcom",
    "ipu result llb",
    "ipu result sem 1",
    "ipu result sem 2",
    "ipu result sem 3",
    "ipu result sem 4",
    "ipu cet result 2025",
    "ggsipu result 2025",
    "ipu exam result",
    "ipu university result",
    "ipu ac in result",
    "ipu result portal",
    "ipu result calculator",
  ],
  url: "https://www.smriti.live/result",
});

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
