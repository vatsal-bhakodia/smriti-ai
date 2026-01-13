"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Program } from "@/lib/cms-api";

interface ProgramCardProps {
  program: Program;
  universitySlug: string;
}

export default function ProgramCard({ program, universitySlug }: ProgramCardProps) {
  return (
    <Link
      href={`/resources/${universitySlug}/${program.slug}`}
      className="block group"
    >
      <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="size-5 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {program.name}
              </CardTitle>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{program.semesterCount}</span>
              <span>{program.semesterCount === 1 ? "Semester" : "Semesters"}</span>
            </div>
            {program.hasBranch && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>Has branches</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
