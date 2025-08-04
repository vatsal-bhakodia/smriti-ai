"use client";

import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />

      <Features />

      <Pricing />

      <About />

      <Footer />
    </>
  );
}
