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
    title: "Topic Mastery Tracker",
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
    <section id="features" className="text-gray-900 px-6 py-24 relative bg-gray-50 dark:bg-background transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center relative z-[1]">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
          Features <span className="text-lime-600 dark:text-primary">That Stick</span>
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-14">
          Smriti AI makes remembering effortless, fun, and intelligent—built to serve modern learners.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur p-6 rounded-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-lime-100 text-lime-600 mb-4 mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 w-[180px] h-[180px] bg-lime-400 dark:bg-primary opacity-100 blur-[200px] transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"></div>
    </section>
  );
};

export default Features;
