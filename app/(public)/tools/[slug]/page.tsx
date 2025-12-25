import ToolHeroForm from "@/components/landing/ToolHeroForm";
import CTA from "@/components/landing/CTA";
import { generateMetadataUtil } from "@/utils/generateMetadata";
import { toolsData } from "@/content/tools";
import { CheckCircle, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const toolData = toolsData[slug];

  if (!toolData) {
    return generateMetadataUtil({
      title: "Tool Not Found | Smriti AI",
      description: "The requested tool page could not be found.",
      keywords: ["smriti ai"],
      url: "https://www.smriti.live/tools",
    });
  }

  return generateMetadataUtil(toolData.metadata);
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const toolData = toolsData[slug];

  if (!toolData) {
    notFound();
  }

  const {
    hero,
    steps,
    howItWorksDescription,
    features,
    benefits,
    extraSection,
  } = toolData;

  return (
    <>
      {/* Hero Section */}
      <div className="pt-14 relative z-10 flex flex-col items-center justify-start px-4 space-y-5 pb-12">
        <h1 className="font-display text-center text-3xl md:text-7xl font-bold w-full lg:w-auto max-w-5xl mx-auto z-20">
          {hero.title}{" "}
          <span className="text-primary">{hero.titleHighlight}</span>
        </h1>

        {/* Subheadline */}
        <h2 className="text-lg md:text-xl text-gray-400 tracking-normal text-center max-w-2xl mx-auto z-20 font-light mb-8">
          {hero.subtitle}
        </h2>

        <ToolHeroForm
          toolType={hero.toolType}
          defaultInputType={hero.defaultInputType}
        />

        {/* Key Benefits */}
        <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-white/60 font-medium z-20 mt-4">
          {hero.keyBenefits.map((benefit, index) => (
            <span key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {howItWorksDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="rounded-xl px-8 py-10 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300 h-full">
                <div className="text-6xl font-black text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="font-bold text-xl mb-4 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
                <ArrowRight className="w-6 h-6 text-primary mt-6 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Why Choose Our{" "}
            <span className="text-primary">
              {hero.toolType === "flashcard"
                ? "Flashcards"
                : hero.toolType === "mindmap"
                ? "Mindmaps"
                : "Quizzes"}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {hero.toolType === "flashcard"
              ? "Experience the power of AI-driven learning with features designed to maximize your study efficiency."
              : hero.toolType === "mindmap"
              ? "Experience the power of AI-driven visual learning with features designed to maximize your understanding and retention."
              : "Experience the power of AI-driven learning with features designed to maximize your study efficiency and track your progress."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index}>
                <div className="rounded-xl px-6 py-8 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300 h-full group">
                  <IconComponent className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-bold text-lg mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-20">
        <div className="bg-linear-to-br from-primary/8 via-primary/4 to-transparent border border-primary/15 rounded-3xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.03),transparent_70%)]"></div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {benefits.title}
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                {benefits.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-4">
                {benefits.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="shrink-0 w-6 h-6 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-white/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {benefits.items.slice(2, 4).map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="shrink-0 w-6 h-6 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-white/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Section (for mindmaps and quizzes) */}
      {extraSection && (
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              {extraSection.title}{" "}
              <span className="text-primary">
                {extraSection.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {extraSection.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {extraSection.items.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl px-8 py-10 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 text-center"
                >
                  <IconComponent className="w-12 h-12 mb-4 text-primary mx-auto" />
                  <h3 className="font-bold text-xl mb-3 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <CTA />
    </>
  );
}
