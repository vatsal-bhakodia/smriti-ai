import BlogCard from "@/components/blog/BlogCard";

import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";

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
