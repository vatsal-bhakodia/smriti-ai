"use client";

import React, { useState } from "react";
import { TrendingUp, ExternalLink, ChevronDown } from "lucide-react";
import { Contributor } from "@/types/contributors";
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
import { ContributorAvatar } from "./ContributorAvatar";
import { getLevelBadge, getRankIcon } from "./utils";

interface LeaderboardTableProps {
  contributors: Contributor[];
}

const INITIAL_DISPLAY_COUNT = 15;

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  contributors,
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayedContributors = showAll
    ? contributors
    : contributors.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMore = contributors.length > INITIAL_DISPLAY_COUNT;

  return (
    <div className="mb-16">
      <Card className="backdrop-blur-md bg-white/10 border-primary/50">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Contributors Leaderboard
          </CardTitle>
          <CardDescription>
            {showAll
              ? `Showing all ${contributors.length} contributors`
              : `Showing top ${displayedContributors.length} of ${contributors.length} contributors`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableHead className="text-center text-gray-300">Level</TableHead>
                <TableHead className="text-center text-gray-300">Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedContributors.map((contributor, index) => {
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
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="bg-white/5 hover:bg-white/10 border-primary/50"
              >
                {showAll ? (
                  <>
                    Show Less
                    <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
                  </>
                ) : (
                  <>
                    View More ({contributors.length - INITIAL_DISPLAY_COUNT} more)
                    <ChevronDown className="ml-2 h-4 w-4 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
