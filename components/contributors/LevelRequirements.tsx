import React from "react";
import { Target, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { levelRequirements } from "./utils";

export const LevelRequirements = ({
}) => (
  <section className="mb-16">
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center gap-2">
        <Target className="h-8 w-8 text-primary" />
        Contribution Levels & How to Level Up
      </h2>
      <p className="text-gray-300 max-w-2xl mx-auto">
        Climb the ranks and earn recognition for your contributions! Here's how
        our leveling system works:
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {levelRequirements.map((level, index) => (
        <Card
          key={index}
          className="cursor-pointer transition-all duration-300 bg-white/10 border-primary/50 hover:bg-white/15 hover:scale-[1.02]"
        >
          <CardHeader className="text-center">
            <div
              className={`w-16 h-16 mx-auto rounded-full bg-linear-to-r ${level.color} flex items-center justify-center mb-4 text-white`}
            >
              {level.icon}
            </div>
            <CardTitle className="text-xl">{level.level}</CardTitle>
            <CardDescription className="text-lg font-semibold text-primary">
              {level.requirement}
            </CardDescription>
            <p className="text-sm text-gray-300 mt-2">{level.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-200">Benefits:</h4>
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
  </section>
);
