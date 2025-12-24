import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getLevelAndTtile } from "@/lib/levelUtils";
import { useEffect, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Stats {
  level: number;
  title: string;
  progress: number;
  experience: number;
}

export default function LevelCard() {
  const [stats, setStats] = useState<Stats>({
    level: 1,
    title: "Beginner",
    progress: 0,
    experience: 0,
  });

  const [displayXP, setDisplayXP] = useState(0);

  // Animated XP counter
  useEffect(() => {
    let start = 0;
    const end = stats.experience;
    const duration = 1000; // 1 second
    const increment = end / (duration / 16); // approx frames

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setDisplayXP(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [stats.experience]);

  // Map level to medal emoji
  function getMedalIcon(level: number) {
    switch (level) {
      case 1:
        return "🥉";
      case 2:
        return "🥈";
      case 3:
        return "🥇";
      case 4:
        return "💎";
      default:
        return "🎖️";
    }
  }

  // Fetch user XP and calculate level & progress
  useEffect(() => {
    async function fetchUserStats() {
      const res = await fetch("/api/user/experience"); // create an endpoint that returns { experience }
      const data = await res.json();
      const { level, title } = getLevelAndTtile(data.experience);

      // progress towards next level
      const nextLevelXP = level === 4 ? 400 : level * 100;
      const progress = Math.min(100, (data.experience / nextLevelXP) * 100);

      setStats({
        level,
        title,
        progress,
        experience: data.experience,
      });
    }

    fetchUserStats();
  }, []);

  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-all group">
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <Award className="text-primary h-5 w-5" />
          </div>
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Mastery Level</p>
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                {displayXP} XP
              </span>
            </div>

            {/* Medal with tooltip */}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <p className="text-xl font-bold cursor-pointer flex items-center gap-2">
                    {stats.title} {getMedalIcon(stats.level)}
                  </p>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-black text-white px-2 py-1 rounded-md text-xs shadow-md">
                  {stats.level < 4
                    ? `Need ${
                        stats.level * 100 - stats.experience
                      } XP for next level`
                    : "Max level reached"}
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden group">
            <div
              className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125"
              style={{
                width: `${stats.progress}%`,
                background: "linear-gradient(90deg, #ffd700, #ff8c00)",
              }}
            />
          </div>
          <p className="text-right text-xs text-muted-foreground mt-1">
            {Math.floor(stats.progress)}% towards next level
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
