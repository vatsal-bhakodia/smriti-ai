import Dashboard from "./dashboardpage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard",
    description: "View your learning progress and access your personalized AI dashboard.",
    keywords: ["dashboard", "smriti", "ai", "learning progress", "user", "analytics"],
  };
}

export default function Page() {
  return <Dashboard />;
}
