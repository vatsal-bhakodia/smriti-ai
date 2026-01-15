import Script from "next/script";
import { generateMetadataUtil } from "@/utils/generateMetadata";

export const metadata = generateMetadataUtil({
  title: "GGSIPU Result 2025-2026 | Check IPU Semester Results Online Fast",
  description:
    "Check GGSIPU (IPU) results 2025-2026 instantly: semester-wise marks, CGPA, SGPA, subject grades, and rank. Fast, mobile-friendly portal for Guru Gobind Singh Indraprastha University students. Enter roll number to view latest exam results.",
  keywords: [
    "GGSIPU result",
    "IPU result",
    "GGSIPU result 2025",
    "GGSIPU result 2026",
    "check GGSIPU result",
    "IPU semester result",
    "Guru Gobind Singh Indraprastha University result",
    "GGSIPU marksheet",
    "IPU CGPA calculator",
    "IPU SGPA",
    "GGSIPU odd semester result",
    "GGSIPU even semester result",
    "IPU result roll number",
    "GGSIPU exam result",
    "university result checker",
    "online result GGSIPU",
    "IPU BTech result",
    "GGSIPU latest result",
  ],
  url: "https://www.smriti.live/result",
});

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Ads Script */}
      <Script
        src="https://pl28487228.effectivegatecpm.com/ba/4e/1c/ba4e1c01b787487794a1e048f03e4de5.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
