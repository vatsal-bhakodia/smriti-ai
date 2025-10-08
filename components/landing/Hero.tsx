import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/magicui/dot-pattern";

import AnimatedImage from "@/components/landing/AnimatedImage";
import { OpenSourceBtn } from "@/components/landing/openSourceBtn";
import { ArrowRightIcon, Brain, Video, BookOpen } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 space-y-5 pb-12">
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
      <h2 className="text-lg md:text-2xl text-gray-400 tracking-normal text-center max-w-2xl mx-auto z-20 font-light">
        AI-powered summaries, interactive quizzes, smart flashcards, and
        personalized learning roadmaps.
      </h2>

      <div className="z-20">
        <Link href="/dashboard" passHref>
          <Button className="bg-gradient-to-r from-[#adff2f] to-[#9dff07] hover:from-[#9dff07] hover:to-[#adff2f] text-black font-semibold rounded-full cursor-pointer px-8 py-3 h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#adff2f]/30 group relative overflow-hidden border-0">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRightIcon className="w-8 h-8 transform transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#9dff07] to-[#adff2f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </Link>
      </div>
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
