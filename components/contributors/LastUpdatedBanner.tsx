import React from "react";
import { Clock } from "lucide-react";
import { formatDate } from "./utils";

interface LastUpdatedBannerProps {
  lastUpdated: string;
}

export const LastUpdatedBanner: React.FC<LastUpdatedBannerProps> = ({
  lastUpdated,
}) => {
  if (!lastUpdated) return null;

  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <Clock className="h-4 w-4 text-primary" />
        <span className="text-gray-300 text-sm">
          Last updated: {formatDate(lastUpdated)}
        </span>
      </div>
    </div>
  );
};
