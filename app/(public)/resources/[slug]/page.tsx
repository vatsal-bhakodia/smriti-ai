import { notFound } from "next/navigation";
import { generateMetadataUtil } from "@/utils/generateMetadata";
import { getUniversityBySlug, getProgramsByUniversityId } from "@/lib/cms-api";
import UniversityHeader from "@/components/university-programs/university-header";
import ProgramsGrid from "@/components/university-programs/programs-grid";
import Banner from "@/components/ads/Banner";

interface UniversityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: UniversityPageProps) {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) {
    return generateMetadataUtil({
      title: "University Not Found",
      description: "The requested university could not be found.",
      url: `https://www.smriti.live/resources/${slug}`,
    });
  }

  return generateMetadataUtil({
    title: `${university.name} - Programs`,
    description: `Browse programs and study resources for ${university.name}.`,
    keywords: [
      university.name,
      "university programs",
      "study resources",
      "academic programs",
    ],
    url: `https://www.smriti.live/resources/${slug}`,
  });
}

export default async function UniversityPage({ params }: UniversityPageProps) {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) {
    return notFound();
  }

  const programs = await getProgramsByUniversityId(university.id);

  return (
    <section className="max-w-7xl mx-auto pb-32 px-6 pt-8 md:pt-12 min-h-[65vh]">
      <UniversityHeader university={university} />
      <Banner className="mb-6" />
      <ProgramsGrid programs={programs} universitySlug={university.slug} />
    </section>
  );
}
