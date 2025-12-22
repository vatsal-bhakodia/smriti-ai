import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";

import AnimatedImage from "@/components/landing/AnimatedImage";
import { OpenSourceBtn } from "@/components/landing/openSourceBtn";
import HeroForm from "@/components/landing/HeroForm";

const Hero = () => {
  return (
    <div className="pt-14 relative z-10 flex flex-col items-center justify-start min-h-screen px-4 space-y-5 pb-12">
      <DotPattern
        className={cn(
          "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)] dark:[mask-image:radial-gradient(50vw_circle_at_center,black,transparent)]"
        )}
      />

      <OpenSourceBtn />

      <h1 className="font-display text-center text-3xl md:text-7xl font-bold w-full lg:w-auto max-w-5xl mx-auto">
        Turn YouTube Lessons Into Interactive Learning.
      </h1>
      {/* Subheadline */}
      <h2 className="text-lg md:text-xl text-gray-400 tracking-normal text-center max-w-2xl mx-auto z-20 font-light mb-8">
        AI-powered summaries, interactive quizzes, smart flashcards, and
        personalized learning roadmaps.
      </h2>

      <HeroForm />
      <div>
        <AnimatedImage
          src="/dashboard.png"
          alt="Image"
          width={1200}
          height={900}
          className="w-full h-auto max-w-6xl mx-auto rounded-2xl shadow-lg px-0 sm:px-4"
        />
      </div>
    </div>
  );
};

export default Hero;
