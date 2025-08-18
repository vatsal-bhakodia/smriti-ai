"use client";
import { Brain, Zap } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="flex flex-col justify-center items-center px-6 py-24 relative
                 text-gray-900 light:text-gray-900 dark:text-white
                 bg-gray-50 dark:bg-background transition-colors duration-300"
    >
      <div className="max-w-4xl text-center space-y-10 relative z-[1]">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight light:text-gray-900 dark:text-white">
          Forget Fast? <br />
          <span className="text-lime-600 dark:text-lime-400">
            Remember Faster with Smriti AI.
          </span>
        </h2>

        <p className="text-lg md:text-xl light:text-gray-700 dark:text-gray-300 leading-relaxed">
          Learning is easy, but retention is rare. Whether it's a lecture, PDF,
          or tutorial— we forget most of it within days. That’s why we built
          Smriti AI: a tool that turns passive learning into active remembering.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white/70 light:bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur p-6 rounded-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2 light:text-gray-900 dark:text-white">
              <Brain className="text-lime-600 dark:text-primary" /> Smarter Study Cycles
            </h3>
            <p className="text-gray-700 light:text-gray-700 dark:text-gray-400">
              Our system reminds you to revise before forgetting sets in—powered
              by spaced repetition.
            </p>
          </div>

          <div className="bg-white/70 light:bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur p-6 rounded-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2 light:text-gray-900 dark:text-white">
              <Zap className="text-lime-600 dark:text-primary" /> From Content to Clarity
            </h3>
            <p className="text-gray-700 light:text-gray-700 dark:text-gray-400">
              Upload notes or videos, and Smriti AI turns them into mindmaps and
              quiz cards.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 w-[180px] h-[180px] bg-lime-400 dark:bg-primary opacity-40 light:opacity-80 blur-[200px] transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"></div>
    </section>
  );
};

export default About;
