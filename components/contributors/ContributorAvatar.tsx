"use client";

import React, { useCallback } from "react";
import { Contributor } from "@/types/contributors";

interface ContributorAvatarProps {
  contributor: Contributor;
  size?: "sm" | "md" | "lg";
}

export const ContributorAvatar: React.FC<ContributorAvatarProps> = ({
  contributor,
  size = "md",
}) => {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  const sizePixels = {
    sm: 40,
    md: 64,
    lg: 96,
  };

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
    const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallbackDiv) {
      fallbackDiv.classList.remove("hidden");
      fallbackDiv.classList.add("flex");
    }
  }, []);

  return (
    <div
      className={`${sizes[size]} rounded-full overflow-hidden bg-linear-to-r from-primary/20 to-purple-500/20 flex items-center justify-center ring-2 ring-white/10 relative`}
    >
      <img
        src={contributor.avatar_url}
        alt={`Avatar of ${contributor.login}`}
        width={sizePixels[size]}
        height={sizePixels[size]}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
      <div className="hidden w-full h-full items-center justify-center text-sm font-medium text-primary">
        {contributor.login.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};
