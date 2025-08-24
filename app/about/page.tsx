import About from "./aboutpage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    description: "Learn more about Smriti AI and how it transforms learning.",
    keywords: ["about", "smriti", "ai", "learning", "education", "productivity"],
  };
}

export default function AboutPage() {
  return <About />;
}
