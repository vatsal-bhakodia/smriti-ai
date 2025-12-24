import Image from "next/image";
import { ArrowRightIcon, Brain, Video, BookOpen, Sparkles } from "lucide-react";

const LeftSidePanel = () => {
  return (
    <div className="hidden w-1/2 bg-[#111] lg:flex items-center justify-center flex-col relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#a3ff19 1px, transparent 1px), linear-gradient(90deg, #a3ff19 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#111]"></div>

      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/brain.png"
          width={500}
          height={500}
          alt="AI Learning Brain"
          className="object-contain w-100 h-100 mx-auto opacity-75"
        />

        <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in">
          <span className="text-white">Smriti</span>
          <span className="text-[#a3ff19]"> AI</span>
        </h1>

        <p className="text-xl text-center text-gray-400 animate-fade-in-delay">
          Your intelligent learning companion
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 z-20 max-w-2xl mx-auto mt-6 animate-fade-in-delay">
          {[
            { icon: Brain, text: "Smart Summaries" },
            { icon: BookOpen, text: "Interactive Quizzes" },
            { icon: Video, text: "Flashcards" },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-300">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out 0.4s both;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.5s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default LeftSidePanel;
