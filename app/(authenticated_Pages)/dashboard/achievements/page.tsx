"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  useEffect(() => {
    axios
      .get<Achievement[]>("/api/user/achievements")
      .then((res) => setAchievements(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Achievements</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <Card
            key={ach.id}
            className={ach.unlocked ? "border-green-500" : "opacity-50"}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <span className="text-4xl">{ach.icon}</span>
                <span className="flex-1">{ach.name}</span>
                {ach.unlocked && <Badge>Unlocked</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{ach.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default AchievementsPage;
