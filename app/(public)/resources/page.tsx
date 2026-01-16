import { generateMetadataUtil } from "@/utils/generateMetadata";
import { getUniversities } from "@/lib/cms-api";
import ResourcesPageContent from "@/components/unversity-resources/resources-page-content";
import { GraduationCap } from "lucide-react";

export const metadata = generateMetadataUtil({
  title: "Universities Resources",
  description:
    "Browse all universities and access study resources, programs, and subjects. Find your university and explore available learning materials.",
  keywords: [
    "universities",
    "study resources",
    "educational institutions",
    "university programs",
    "academic resources",
    "learning materials",
  ],
  url: "https://www.smriti.live/resources",
});

export default async function ResourcesPage() {
  const universities = await getUniversities();

  return (
    <section className="max-w-7xl mx-auto pb-32 px-4 sm:px-6 pt-8 md:pt-12 min-h-[65vh]">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Universities Resources
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Browse all universities and explore their programs and study
          resources.
        </p>
      </div>

      <ResourcesPageContent universities={universities} />
    </section>
  );
}
