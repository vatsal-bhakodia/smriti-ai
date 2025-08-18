"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Target,
  Users,
  Lightbulb,
  Github,
  Mail,
  Globe,
  Zap,
  Heart,
  Shield,
  Rocket,
  ArrowRightIcon,
  CheckCircle,
  Sparkles,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { TextAnimate } from "@/components/magicui/text-animate";
import { NumberTicker } from "@/components/magicui/number-ticker";
import Footer from "@/components/Footer";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Advanced AI that understands context and provides personalized learning experiences tailored to your pace.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Instant summaries, mind maps, and MCQ generation. Learn faster, retain longer, succeed sooner.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your learning data is encrypted and secure. We prioritize your privacy above everything else.",
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description:
        "Students report 100% better retention rates using our scientifically-backed learning methods.",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Mission",
      description:
        "Making quality education accessible to every learner, regardless of their background or resources.",
      highlight: "Democratize Learning",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Pushing boundaries with cutting-edge AI to transform how students learn and retain information.",
      highlight: "Future-Ready Tech",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building a global community of learners, educators, and innovators working together for better education.",
      highlight: "Global Impact",
    },
  ];

  const stats = [
    { number: 10000, label: "Active Learners" },
    { number: 95, label: "Success Rate", suffix: "%" },
    { number: 50000, label: "Study Sessions" },
    { number: 24, label: "Countries", suffix: "+" },
  ];

  return (
  <>
    <motion.div
      className="relative min-h-screen bg-white dark:bg-background overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Pattern */}
      <DotPattern
        className={cn(
          "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)] dark:[mask-image:radial-gradient(50vw_circle_at_center,black,transparent)]"
        )}
      />

      <div className="relative z-10 w-full px-6 md:px-20 py-24 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div className="text-center mb-20" variants={itemVariants}>
            <span className="bg-gray-100 dark:bg-muted px-4 py-2 rounded-full text-sm border-2 border-primary/20 mb-6 inline-block text-gray-800 dark:text-white">
              🚀 | About Smriti AI
            </span>
            <TextAnimate
              animation="blurIn"
              as="h1"
              className="font-display text-center text-3xl md:text-7xl font-bold w-full lg:w-auto max-w-4xl mx-auto text-gray-900 dark:text-white"
            >
              Phadlo Chahe Kahi se, Yaad Hoga Yahi se.
            </TextAnimate>
            <motion.p
              className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUpVariants}
            >
              Transform your learning experience with AI-powered tools that help you study smarter, retain better, and achieve academic excellence.
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div className="mb-20" variants={itemVariants}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={fadeInUpVariants}
                  custom={index}
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
                    <NumberTicker value={stat.number} />
                    {stat.suffix}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Vision Section */}
          <motion.div className="mb-20" variants={itemVariants}>
            <div className="rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-md bg-white/70 dark:bg-gradient-to-br dark:from-primary/5 dark:to-primary/10 border border-gray-200 dark:border-primary/10">
              <div className="text-center mb-8">
                <Rocket className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
                  Our <span className="text-primary">Vision</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                    In a world where information overload hampers learning, Smriti AI emerges as your intelligent study companion. We believe that with the right tools and AI assistance, every student can unlock their true potential.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    "Smriti" means "memory" in Sanskrit – reflecting our mission to enhance how you learn, remember, and succeed in your academic journey.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    "AI-powered personalized learning",
                    "Scientifically-backed retention methods",
                    "Seamless study workflow integration",
                    "Accessible to students worldwide",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div className="mb-20" variants={itemVariants}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
                What Makes Us <span className="text-primary">Different</span>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Cutting-edge technology meets educational excellence to deliver unmatched learning experiences.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUpVariants} custom={index}>
                  <div className="rounded-xl px-6 py-8 shadow-lg backdrop-blur-md bg-white/70 dark:bg-zinc-900/30 border border-gray-200 dark:border-white/10 hover:scale-[1.02] transition-all duration-300 h-full group">
                    <feature.icon className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div className="mb-20" variants={itemVariants}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
                Our Core <span className="text-primary">Values</span>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                The principles that guide everything we do and every decision we make.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div key={index} variants={fadeInUpVariants} custom={index}>
                  <div className="rounded-xl px-8 py-10 shadow-lg backdrop-blur-md bg-white/70 dark:bg-zinc-900/30 border border-gray-200 dark:border-white/10 hover:scale-[1.02] transition-all duration-300 h-full text-center">
                    <div className="bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-10 h-10 text-primary" />
                    </div>
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
                      {value.highlight}
                    </span>
                    <h3 className="font-extrabold text-xl mb-4 text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div className="mb-20" variants={itemVariants}>
            <div className="rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-900/30 border border-gray-200 dark:border-white/10">
              <div className="text-center mb-12">
                <Brain className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
                  How Smriti AI <span className="text-primary">Works</span>
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                  Three simple steps to transform your learning experience forever.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: BookOpen, title: "Upload & Learn", desc: "Upload your PDFs, YouTube videos, or study materials. Our AI instantly processes and understands your content." },
                  { icon: Sparkles, title: "AI Magic", desc: "Get instant summaries, interactive mind maps, and personalized MCQ tests tailored to your learning style." },
                  { icon: TrendingUp, title: "Retain & Excel", desc: "Track your progress, strengthen weak areas, and achieve 100% better retention with spaced repetition." }
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-8 h-8 text-black dark:text-white" />
                    </div>
                    <h3 className="font-extrabold text-xl mb-3 text-primary dark:text-primary">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div className="mb-20" variants={itemVariants}>
            <div className="rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-md bg-white/70 dark:bg-gradient-to-br dark:from-primary/5 dark:to-primary/10 border border-gray-200 dark:border-primary/10 text-center">
              <Users className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
                Built by <span className="text-primary">Innovators</span>, For Everyone
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
                Our passionate team of educators, AI researchers, and developers work tirelessly to create technology that enhances human learning potential. We're committed to making quality education accessible to students worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-primary to-primary/80 text-black dark:text-white font-semibold rounded-full px-8 py-3 h-auto transform transition-all duration-300 hover:scale-105 group" asChild>
                  <Link href="https://github.com" className="flex items-center gap-2">
                    <Github className="w-4 h-4" /> View on GitHub
                    <ArrowRightIcon className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-full border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 px-8 py-3 h-auto" asChild>
                  <Link href="/contact" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Get in Touch
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div className="text-center" variants={itemVariants}>
            <div className="rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-900/30 border border-gray-200 dark:border-white/20">
              <Globe className="w-20 h-20 mx-auto mb-8 text-primary" />
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white">
                Ready to <span className="text-primary">Transform</span> Your Learning?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who've already revolutionized their study habits. Start your journey to academic excellence today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button className="bg-gradient-to-r from-primary to-primary/80 text-black dark:text-white font-semibold rounded-full px-10 py-4 h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 group relative overflow-hidden" asChild>
                  <Link href="/">
                    <span className="relative z-10 flex items-center gap-2">
                      <Rocket className="w-5 h-5" /> Start Learning Free
                      <ArrowRightIcon className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-full border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 px-10 py-4 h-auto" asChild>
                  <Link href="/contact">
                    <Mail className="w-5 h-5 mr-2" /> Talk to Our Team
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Blur Effect */}
      <div className="absolute bottom-0 left-1/2 w-[200px] h-[200px] bg-primary opacity-60 blur-[150px] transform -translate-x-1/2 -translate-y-1/2"></div>
    </motion.div>
    <Footer />
  </>
);

}
