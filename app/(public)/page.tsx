import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import { generateMetadataUtil } from "@/utils/generateMetadata";

export const metadata = generateMetadataUtil({
  title: "Smriti AI - Study Tool & Online Learning Platform",
  description:
    "Join millions of students using Smriti AI to learn faster and remember better. Turn any PDF, YouTube video, or website into AI-powered flashcards, summaries, and mind maps instantly. Free to start.",
  keywords: [
    "ai tutor",
    "pdf to flashcards",
    "study tools",
    "exam prep",
    "ai flashcards",
    "smriti ai",
    "quizlet alternative",
    "anki alternative",
    "study app",
    "learning platform",
    "college study tools",
    "test preparation",
    "gpa booster",
    "academic success",
    "instant flashcards",
    "youtube to flashcards",
    "study smarter",
    "ai study buddy",
    "homework help",
    "grade improvement",
    "ai study companion",
    "personalized learning",
    "study assistant",
    "mind maps ai",
    "learning roadmap",
    "ai memory retention",
    "smart studying",
    "educational ai",
  ],
  url: "https://www.smriti.live/",
  image: "/seo_banner.png",
  ogTitle: "Smriti AI - Study Tool & Online Learning Platform",
  ogDescription:
    "Turn any PDF into AI-powered flashcards. Join millions of students learning smarter with personalized summaries, mind maps, and instant feedback.",
  twitterTitle: "Smriti AI - Study Tool & Online Learning Platform",
  twitterDescription:
    "Smriti AI gives you an unfair advantage by using AI to ace every exam. Upload notes or PDFs and instantly get flashcards, summaries, mind maps and deep research.",
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
