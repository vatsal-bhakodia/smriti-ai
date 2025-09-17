"use client";

import React,{ useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { DotPattern } from "@/components/magicui/dot-pattern";

import AnimatedImage from "@/components/landing/AnimatedImage";

import { useUser } from "@clerk/nextjs";
import { OpenSourceBtn } from "@/components/landing/openSourceBtn";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Hero = () => {
  const { isSignedIn } = useUser();
  const headlines = [
    "Phadlo Chahe Kahi se, Yaad Hoga Yahi se.", // Hindi
    "Study Anywhere, Remember Everything Here.", // English
  ];

  const [currentHeadline, setCurrentHeadline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 4000); // switch every 4s

    return () => clearInterval(interval);
  }, []);

  const linkHref = isSignedIn ? "/dashboard" : "/sign-up";
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-4 px-4 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DotPattern
        className={cn(
          "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)] dark:[mask-image:radial-gradient(50vw_circle_at_center,black,transparent)]"
        )}
      />

      <OpenSourceBtn />

      <motion.div variants={itemVariants}>
         <TextAnimate
          animation="blurIn"
          as="h1"
          duration={1}
          className="font-display text-center text-3xl md:text-7xl font-bold w-full lg:w-auto max-w-4xl mx-auto"
        >
          {headlines[currentHeadline]}
        </TextAnimate>
      </motion.div>
      <motion.h2
        className="mt-2 text-base md:text-xl text-gray-400 tracking-normal text-center max-w-2xl mx-auto z-10"
        variants={itemVariants}
      >
        Upload your YouTube videos & PDF notes to get instant summaries, mind
        maps, take MCQ tests, and retain 100% more effectively.
      </motion.h2>
      <motion.div variants={itemVariants} className="z-20">
        <Link href={linkHref} passHref>
          <Button className="bg-gradient-to-r from-[#adff2f] to-[#9dff07] hover:from-[#9dff07] hover:to-[#adff2f] text-black font-semibold rounded-full cursor-pointer px-8 py-3 h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#adff2f]/30 group relative overflow-hidden border-0">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRightIcon className="w-8 h-8 transform transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#9dff07] to-[#adff2f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </Link>
      </motion.div>
      <motion.div variants={itemVariants}>
        <AnimatedImage
          src="/dashboard.png"
          alt="Image"
          width={1200}
          height={900}
          className="w-full h-auto max-w-6xl mx-auto rounded-2xl shadow-lg px-0 sm:px-4"
        />
      </motion.div>
    </motion.div>
  );
};

export default Hero;