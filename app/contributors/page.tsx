import Contributors from "./contributorspage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contributors",
    description: "Meet the contributors behind Smriti AI and their valuable efforts.",
    keywords: ["contributors", "smriti", "ai", "team", "developers", "open source"],
  };
}

export default function ContributorsPage() {
  return <Contributors />;
}
