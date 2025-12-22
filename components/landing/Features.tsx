"use client";

import {
  BrainCircuit,
  FileQuestion,
  AlarmClock,
  Bookmark,
  LineChart,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Mindmap Generator",
    desc: "Turn complex topics into clean, interactive visual mindmaps using AI.",
  },
  {
    icon: FileQuestion,
    title: "Auto Quiz Creation",
    desc: "Smriti AI generates personalized MCQs and revision questions from your notes.",
  },
  {
    icon: AlarmClock,
    title: "Timed Reminders",
    desc: "We notify you right before your brain starts to forget—based on proven memory curves.",
  },
  {
    icon: Bookmark,
    title: "Save Resources",
    desc: "Bookmark important PDFs and videos to revise later with context.",
  },
  {
    icon: LineChart,
    title: "Folder Mastery Tracker",
    desc: "Track what you’ve retained, what’s fading, and what needs review.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Assistant",
    desc: "Receive reminders, quizzes, and flashcards directly on your WhatsApp.",
  },
];

const Features = () => {
  return (
    <section id="features" className="text-white px-6 py-24 relative">
      <div className="max-w-6xl mx-auto text-center relative z-[1]">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Features <span className="text-primary">That Stick</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-14">
          Smriti AI makes remembering effortless, fun, and intelligent—built to
          serve modern learners.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl transition-transform hover:scale-[1.02] hover:border-white/20 shadow-md"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 w-[180px] h-[180px] bg-primary opacity-80 blur-[200px] transform -translate-x-1/2 -translate-y-1/2"></div>
    </section>
  );
};

export default Features;
