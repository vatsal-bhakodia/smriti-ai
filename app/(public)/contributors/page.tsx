import React from "react";
import { OpenSourceBtn } from "@/components/landing/openSourceBtn";
import contributorData from "@/public/contributors.json";
import { Contributor } from "@/types/contributors";
import { StatsCards } from "@/components/contributors/StatsCards";
import { TopContributors } from "@/components/contributors/TopContributors";
import { LeaderboardTable } from "@/components/contributors/LeaderboardTable";
import { LevelRequirements } from "@/components/contributors/LevelRequirements";
import { CallToAction } from "@/components/contributors/CallToAction";
import { LastUpdatedBanner } from "@/components/contributors/LastUpdatedBanner";

export default function Contributors() {
  // Filter out bots from contributors
  const contributors = (contributorData as any).contributors.filter(
    (c: Contributor) => !["actions-user", "dependabot[bot]"].includes(c.login)
  );

  const lastUpdated = (contributorData as any).lastUpdated;

  const stats = {
    total: contributors.length,
    level1: contributors.filter(
      (c: Contributor) => c.contributions >= 1 && c.contributions < 15
    ).length,
    level2: contributors.filter(
      (c: Contributor) => c.contributions >= 15 && c.contributions < 30
    ).length,
    level3: contributors.filter((c: Contributor) => c.contributions >= 30).length,
    totalContributions: contributors.reduce(
      (sum: number, c: Contributor) => sum + c.contributions,
      0
    ),
  };

  return (
    <div className="max-w-7xl mx-auto pt-14 px-6 md:px-20 pb-24 relative z-10">
      {/* Header Section */}
      <section className="text-center mb-16 relative">
        {/* background effect */}
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-primary opacity-20 blur-[150px] rounded-full"></div>

        <OpenSourceBtn />
        <h1 className="text-4xl md:text-6xl font-extrabold my-6">
          Our Amazing <span className="text-primary">Contributors</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Meet the talented individuals who are helping build Smriti AI. Their
          dedication and contributions make this open-source project possible.
        </p>

        <LastUpdatedBanner lastUpdated={lastUpdated} />

        {/* Stats Section */}
        <StatsCards stats={stats} />
      </section>

      <LevelRequirements />

      {contributors.length > 0 && (
        <TopContributors contributors={contributors} />
      )}

      <LeaderboardTable contributors={contributors} />

      <CallToAction />
    </div>
  );
}
