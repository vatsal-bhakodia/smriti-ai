import { MapPin } from "lucide-react";
import { University } from "@/lib/cms-api";

interface UniversityHeaderProps {
  university: University;
}

export default function UniversityHeader({
  university,
}: UniversityHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      {university.location && (
        <div className="flex items-center gap-2 text-primary">
          <MapPin size={18} className="flex-shrink-0" />
          <span className="text-base font-medium">{university.location}</span>
        </div>
      )}
      <div>
        <h1 className="pb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {university.name}
        </h1>
        <p className="text-muted-foreground text-lg">
          Select a program to explore subjects and study resources.
        </p>
      </div>
    </div>
  );
}
