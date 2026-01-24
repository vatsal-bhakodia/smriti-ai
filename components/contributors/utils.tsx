import { JSX } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { ContributorLevel, LevelRequirement } from "@/types/contributors";

// Helper functions
export const getLevelBadge = (contributions: number): ContributorLevel => {
  if (contributions >= 30) {
    return {
      icon: <Trophy className="h-4 w-4" />,
      text: "Expert",
      color: "bg-linear-to-r from-yellow-400 to-orange-500",
      level: 3,
      requirement: "30+",
    };
  } else if (contributions >= 15) {
    return {
      icon: <Medal className="h-4 w-4" />,
      text: "Advanced",
      color: "bg-linear-to-r from-purple-400 to-purple-600",
      level: 2,
      requirement: "15-29",
    };
  } else {
    return {
      icon: <Award className="h-4 w-4" />,
      text: "Contributor",
      color: "bg-linear-to-r from-primary to-primary-dark",
      level: 1,
      requirement: "1-14",
    };
  }
};

export const getRankIcon = (index: number): JSX.Element => {
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

export const formatDate = (isoString: string): string => {
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
export const levelRequirements: LevelRequirement[] = [
  {
    level: "Level 1 - Contributor",
    icon: <Award className="h-6 w-6" />,
    requirement: "1-14 contributions",
    description:
      "Welcome to the community! Every journey starts with a single contribution.",
    color: "from-primary to-primary-dark",
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
