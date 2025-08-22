"use client";

import React, { JSX } from "react";
import { useState, useEffect } from "react";
import {
  GitBranch,
  Code,
  ExternalLink,
  Trophy,
  Medal,
  Award,
  Target,
  Zap,
  TrendingUp,
  Check,
  Clock,
  Star,
  Flame,
} from "lucide-react";
import { OpenSourceBtn } from "@/components/landing/openSourceBtn";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

interface ContributorLevel {
  icon: JSX.Element;
  text: string;
  color: string;
  level: number;
  requirement: string;
}

interface LevelRequirement {
  level: string;
  icon: JSX.Element;
  requirement: string;
  description: string;
  color: string;
  benefits: string[];
}

// Helper functions
const getLevelBadge = (contributions: number): ContributorLevel => {
  if (contributions >= 30) {
    return {
      icon: <Trophy className="h-4 w-4" />,
      text: "Expert",
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      level: 3,
      requirement: "30+",
    };
  } else if (contributions >= 15) {
    return {
      icon: <Medal className="h-4 w-4" />,
      text: "Advanced",
      color: "bg-gradient-to-r from-purple-400 to-purple-600",
      level: 2,
      requirement: "15-29",
    };
  } else {
    return {
      icon: <Award className="h-4 w-4" />,
      text: "Contributor",
      color: "bg-gradient-to-r from-primary to-[#9dff07]",
      level: 1,
      requirement: "1-14",
    };
  }
};

const getRankIcon = (index: number): JSX.Element => {
  switch (index) {
    case 0:
      return <Trophy className="h-6 w-6 text-yellow-400" />;
    case 1:
      return <Medal className="h-6 w-6 text-gray-300" />;
    case 2:
      return <Award className="h-6 w-6 text-amber-500" />;
    default:
      return (
        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
      );
  }
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};

// Constants
const levelRequirements: LevelRequirement[] = [
  {
    level: "Level 1 - Contributor",
    icon: <Award className="h-6 w-6" />,
    requirement: "1-14 contributions",
    description:
      "Welcome to the community! Every journey starts with a single contribution.",
    color: "from-primary to-[#9dff07]",
    benefits: [
      "Community recognition",
      "Contributor badge",
      "GitHub profile visibility",
    ],
  },
  {
    level: "Level 2 - Advanced",
    icon: <Medal className="h-6 w-6" />,
    requirement: "15-29 contributions",
    description:
      "You're getting serious! Your consistent contributions are making a real impact.",
    color: "from-purple-400 to-purple-600",
    benefits: [
      "Advanced badge",
      "Priority issue assignment",
      "Code review privileges",
    ],
  },
  {
    level: "Level 3 - Expert",
    icon: <Trophy className="h-6 w-6" />,
    requirement: "30+ contributions",
    description:
      "You're a true champion! Your expertise drives the project forward.",
    color: "from-yellow-400 to-orange-500",
    benefits: [
      "Expert status",
      "Mentorship opportunities",
      "Project decision input",
    ],
  },
];

// Components
const ContributorAvatar: React.FC<{
  contributor: Contributor;
  size?: "sm" | "md" | "lg";
}> = ({ contributor, size = "md" }) => {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full overflow-hidden bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center ring-2 ring-white/10`}
    >
      <img
        src={contributor.avatar_url}
        alt={`Avatar of ${contributor.login}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallbackDiv) {
            fallbackDiv.classList.remove("hidden");
            fallbackDiv.classList.add("flex");
          }
        }}
      />
      <div className="hidden w-full h-full items-center justify-center text-sm font-medium text-primary">
        {contributor.login.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6 text-center bg-white/10 border-primary/50">
          <Skeleton className="h-8 w-12 mx-auto mb-2 bg-white/20" />
          <Skeleton className="h-4 w-20 mx-auto bg-white/20" />
        </Card>
      ))}
    </div>
  </div>
);

const ErrorMessage: React.FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-6">
    <div className="text-6xl">😕</div>
    <p className="text-red-400 text-center text-lg">{error}</p>
    <Button onClick={onRetry} variant="outline">
      <Zap className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
);

const StatsCards: React.FC<{
  stats: {
    total: number;
    level1: number;
    level2: number;
    level3: number;
    totalContributions: number;
  };
}> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
    <div className="p-6 text-center bg-white/10 rounded-2xl border border-primary/50 hover:bg-white/15 transition-colors">
      <div className="text-3xl font-extrabold text-primary mb-2">
        {stats.total}
      </div>
      <div className="text-sm text-gray-300">Contributors</div>
    </div>
    <div className="p-6 text-center bg-white/10 rounded-2xl border border-primary/50 hover:bg-white/15 transition-colors">
      <div className="text-3xl font-extrabold text-purple-400 mb-2">
        {stats.totalContributions}
      </div>
      <div className="text-sm text-gray-300">Total Commits</div>
    </div>
    <div className="p-6 text-center bg-white/10 rounded-2xl border border-primary/50 hover:bg-white/15 transition-colors">
      <div className="text-3xl font-extrabold text-yellow-400 mb-2">
        {stats.level3}
      </div>
      <div className="text-sm text-gray-300">Experts</div>
    </div>
    <div className="p-6 text-center bg-white/10 rounded-2xl border border-primary/50 hover:bg-white/15 transition-colors">
      <div className="text-3xl font-extrabold text-blue-400 mb-2">
        {stats.level2}
      </div>
      <div className="text-sm text-gray-300">Advanced</div>
    </div>
  </div>
);

const TopContributors: React.FC<{ contributors: Contributor[] }> = ({
  contributors,
}) => (
  <div className="mb-16">
    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 flex items-center justify-center gap-2">
      <Trophy className="h-8 w-8 text-yellow-400" />
      Hall of Fame - Top Contributors
    </h2>
    <div className="grid md:grid-cols-3 gap-6">
      {contributors.slice(0, 3).map((contributor, index) => {
        const badge = getLevelBadge(contributor.contributions);
        return (
          <Card
            key={contributor.id}
            className="group relative overflow-hidden bg-white/10 border-primary/50 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute top-4 right-4 z-10">
              {getRankIcon(index)}
            </div>
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="relative mx-auto mb-4">
                <div className="h-24 w-24 mx-auto rounded-full ring-4 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300 overflow-hidden bg-gradient-to-r from-primary/20 to-purple-500/20 group-hover:scale-110">
                  <ContributorAvatar contributor={contributor} size="lg" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                {contributor.login}
              </CardTitle>
              <CardDescription className="text-sm">
                @{contributor.login}
              </CardDescription>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-black text-xs font-medium ${badge.color} shadow-lg`}
              >
                {badge.icon}
                {badge.text}
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-3 relative z-10">
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <GitBranch className="h-4 w-4 text-primary" />
                  <span className="font-bold text-2xl text-primary">
                    {contributor.contributions}
                  </span>
                  <span className="text-gray-300">contributions</span>
                </div>
              </div>
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <svg viewBox="0 0 438.549 438.549" className="w-4 h-4 mr-2">
                    <path
                      fill="currentColor"
                      d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                    />
                  </svg>
                  View Profile
                </Button>
              </a>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

const LeaderboardTable: React.FC<{
  contributors: Contributor[];
  loading: boolean;
}> = ({ contributors, loading }) => (
  <div className="mb-16">
    <Card className="backdrop-blur-md bg-white/10 border-primary/50">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Contributors Leaderboard
        </CardTitle>
        <CardDescription>
          Complete list of all contributors ranked by their contributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
                <Skeleton className="h-4 w-32 bg-white/20" />
                <Skeleton className="h-4 w-16 bg-white/20 ml-auto" />
                <Skeleton className="h-4 w-20 bg-white/20" />
                <Skeleton className="h-4 w-12 bg-white/20" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="w-16 text-center text-gray-300">
                  Rank
                </TableHead>
                <TableHead className="text-gray-300">Contributor</TableHead>
                <TableHead className="text-center text-gray-300">
                  Contributions
                </TableHead>
                <TableHead className="text-center text-gray-300">
                  Level
                </TableHead>
                <TableHead className="text-center text-gray-300">
                  Profile
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributors.map((contributor, index) => {
                const badge = getLevelBadge(contributor.contributions);
                return (
                  <TableRow
                    key={contributor.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-center text-white">
                      <div className="flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center gap-3">
                        <ContributorAvatar
                          contributor={contributor}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium text-white">
                            {contributor.login}
                          </div>
                          <div className="text-sm text-gray-400">
                            @{contributor.login}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-white">
                      <Badge variant="secondary" className="font-bold">
                        {contributor.contributions}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-white">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-black text-xs font-medium ${badge.color} shadow-sm`}
                      >
                        {badge.icon}
                        {badge.text}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-white">
                      <a
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  </div>
);

// Main Component
export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState(1);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load contributors data
      const contributorsResponse = await fetch("/contributors.json");
      if (!contributorsResponse.ok) {
        throw new Error("Failed to load contributors data");
      }
      const contributorsData = await contributorsResponse.json();
      setContributors(contributorsData);

      // Load last updated data (optional)
      try {
        const lastUpdatedResponse = await fetch("/lastUpdated.json");
        if (lastUpdatedResponse.ok) {
          const lastUpdatedData = await lastUpdatedResponse.json();
          setLastUpdated(lastUpdatedData.lastUpdated);
        } else {
          setLastUpdated(new Date().toISOString());
        }
      } catch {
        setLastUpdated(new Date().toISOString());
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load contributors data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = {
    total: contributors.length,
    level1: contributors.filter(
      (c) => c.contributions >= 1 && c.contributions < 15
    ).length,
    level2: contributors.filter(
      (c) => c.contributions >= 15 && c.contributions < 30
    ).length,
    level3: contributors.filter((c) => c.contributions >= 30).length,
    totalContributions: contributors.reduce(
      (sum, c) => sum + c.contributions,
      0
    ),
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-primary opacity-20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-20 right-1/4 w-[250px] h-[250px] bg-purple-500 opacity-15 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-20 py-24 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <OpenSourceBtn />
          <h1 className="text-4xl md:text-6xl font-extrabold my-6">
            Our Amazing <span className="text-primary">Contributors</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Meet the talented individuals who are helping build Smriti AI. Their
            dedication and contributions make this open-source project possible.
          </p>

          {/* Last Updated Banner */}
          {lastUpdated && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-gray-300 text-sm">
                  Last updated: {formatDate(lastUpdated)}
                </span>
              </div>
            </div>
          )}

          {/* Stats Section */}
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorMessage error={error} onRetry={loadData} />
          ) : (
            <StatsCards stats={stats} />
          )}
        </div>

        {/* Level Requirements Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              Contribution Levels & How to Level Up
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Climb the ranks and earn recognition for your contributions!
              Here's how our leveling system works:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {levelRequirements.map((level, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 bg-white/10 border-primary/50 hover:bg-white/15 hover:scale-[1.02] ${
                  activeLevel === index + 1
                    ? "ring-2 ring-primary shadow-2xl shadow-primary/20"
                    : ""
                }`}
                onClick={() => setActiveLevel(index + 1)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center mb-4 text-white`}
                  >
                    {level.icon}
                  </div>
                  <CardTitle className="text-xl">{level.level}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary">
                    {level.requirement}
                  </CardDescription>
                  <p className="text-sm text-gray-300 mt-2">
                    {level.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-200">
                      Benefits:
                    </h4>
                    <ul className="space-y-1">
                      {level.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <Check className="h-3 w-3 text-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conditional rendering for content that requires data */}
        {!loading && !error && (
          <>
            {/* Top Contributors Section */}
            {contributors.length > 0 && (
              <TopContributors contributors={contributors} />
            )}

            {/* Leaderboard Table */}
            <LeaderboardTable contributors={contributors} loading={false} />
          </>
        )}

        {/* Show leaderboard with loading state if still loading */}
        {loading && !error && (
          <LeaderboardTable contributors={[]} loading={true} />
        )}

        {/* Call to Action Section */}
        <section className="text-center space-y-10 bg-gradient-to-br from-primary/15 via-primary/8 to-transparent backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            {/* Hero Content */}
            <div className="space-y-6 mb-10">
              <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Ready to Join the Adventure?
              </h3>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Every expert was once a beginner. Start your contribution
                journey today and become part of our amazing community!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <a
                href="https://github.com/vatsal-bhakodia/smriti-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <svg viewBox="0 0 438.549 438.549" className="w-5 h-5 mr-2">
                    <path
                      fill="currentColor"
                      d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                    />
                  </svg>
                  View on GitHub
                </Button>
              </a>
              <a
                href="https://github.com/vatsal-bhakodia/smriti-ai/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-3 text-lg font-semibold border-2 border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
                >
                  <Code className="h-5 w-5 mr-2" />
                  Find Your First Issue
                </Button>
              </a>
            </div>

            {/* Contributor Levels */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-200 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors duration-200">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-3 text-white">
                  New Contributors
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Start with "good first issue" labels to get familiar with the
                  codebase.
                </p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-200 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors duration-200">
                    <Flame className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-3 text-white">
                  Regular Contributors
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Take on feature requests and bug fixes to level up your
                  impact.
                </p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-200 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors duration-200">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-3 text-white">
                  Expert Contributors
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Lead discussions, mentor others, and shape the project's
                  future.
                </p>
              </div>
            </div>

            {/* Subtle background effect */}
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
