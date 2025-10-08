import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import { generateMetadataUtil } from "@/utils/generateMetadata";

export const metadata = generateMetadataUtil({
  title: "Smriti AI",
  description:
    "Your AI-powered study companion that helps you learn faster and remember better. Generate summaries, flashcards, mind maps, and personalized learning roadmaps.",
  keywords: [
    "Smriti AI",
    "AI study companion",
    "personalized learning",
    "AI flashcards",
    "study assistant",
    "mind maps AI",
    "learning roadmap",
    "AI memory retention",
    "smart studying",
    "educational AI",
  ],
  url: "https://www.smriti.live/",
});
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <About />
      <Testimonials />
      <CTA />
    </>
  );
}
