import {
  Brain,
  Target,
  Users,
  Lightbulb,
  Zap,
  Shield,
  Rocket,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { TextAnimate } from "@/components/magicui/text-animate";
import { NumberTicker } from "@/components/magicui/number-ticker";
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
  url: "https://www.smriti.live/about",
});

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "Artificial Intelligence",
      description:
        "Advanced AI that understands context and provides personalized learning experiences.",
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
    { number: 1000, label: "Active Learners", suffix: "+" },
    { number: 95, label: "Success Rate", suffix: "%" },
    { number: 5000, label: "Study Sessions", suffix: "+" },
    { number: 24, label: "Countries", suffix: "+" },
  ];

  return (
    <>
      {/* Header Section */}
      <div className="pt-14 max-w-7xl mx-auto px-6 md:px-20 text-center mb-10 relative">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 rounded-3xl blur-3xl -z-10"></div>

        {/* Main heading with improved spacing */}
        <div className="space-y-8">
          <h1>
            <span className="block font-display text-6xl md:text-9xl lg:text-[10rem] font-black text-white mb-6 leading-[0.85] tracking-tight">
              Smriti <span className="text-primary">AI</span>
            </span>
            <TextAnimate
              animation="blurIn"
              as="span"
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 max-w-4xl mx-auto leading-tight"
            >
              Your Personalized AI Study Companion
            </TextAnimate>
          </h1>

          {/* Key benefits */}
          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-white/60 font-medium">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Adaptive Learning
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Smart Retention
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Progress Tracking
            </span>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-bounce delay-1000"></div>
      </div>
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 hover:bg-primary/10 transition-colors">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-3">
                  <NumberTicker
                    value={stat.number}
                    suffix={stat.suffix}
                    enableKFormat={stat.suffix === "+"}
                  />
                </div>
                <p className="text-white/60 text-sm md:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            What Makes Us <span className="text-primary">Different</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cutting-edge technology meets educational excellence to deliver
            unmatched learning experiences.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index}>
              <div className="rounded-xl px-6 py-8 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300 h-full group">
                <feature.icon className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-lg mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Vision Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
        <div className="bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-primary/15 rounded-3xl p-8 md:p-16 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.03),transparent_70%)]"></div>

          <div className="relative space-y-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
                <Rocket className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our <span className="text-primary">Vision</span>
              </h2>

              <p className="text-lg text-center text-white/70 leading-relaxed">
                "Smriti" means "memory" in Sanskrit our mission is to help you
                learn and remember.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                  In a world where information overload hampers learning, Smriti
                  AI emerges as your intelligent study companion. We believe
                  that with the right tools and AI assistance, every student can
                  unlock their true potential.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-white/80 text-lg">
                    AI-powered personalized learning
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-white/80 text-lg">
                    Scientifically-backed retention methods
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-white/80 text-lg">
                    Seamless study workflow integration
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-white/80 text-lg">
                    Accessible to students worldwide
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Our Core <span className="text-primary">Values</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The principles that guide everything we do and every decision we
            make.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index}>
              <div className="rounded-xl px-8 py-10 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300 h-full text-center">
                <div className="bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-10 h-10 text-primary" />
                </div>
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  {value.highlight}
                </span>
                <h3 className="font-extrabold text-xl mb-4 text-white">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CTA />
    </>
  );
}
