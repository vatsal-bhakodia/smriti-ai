import { Brain, Sparkles, BookOpen, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20 py-24">
      <div className="rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-md bg-gradient-to-br from-gray-900 to-black border border-white/10">
        <div className="text-center mb-12">
          <Brain className="w-16 h-16 mx-auto mb-6 text-primary hover:animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
            How Smriti AI <span className="text-primary">Works</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Three simple steps to transform your learning experience forever.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center step-card-shadow">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 hover:glow transition-transform duration-300 ease-in hover:-translate-y-1">
              <BookOpen className="w-8 h-8 text-black" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">
              Upload & Learn
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Upload your PDFs, YouTube videos, or study materials. Our AI
              instantly understands your content.
            </p>
          </div>
          <div className="text-center step-card-shadow">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 hover:glow transition-transform duration-300 ease-in hover:-translate-y-1">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">
              AI Magic
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Get instant summaries, interactive mind maps, and personalized MCQ
              tests tailored to your learning style.
            </p>
          </div>
          <div className="text-center step-card-shadow">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 hover:glow transition-transform duration-300 ease-in hover:-translate-y-1">
              <TrendingUp className="w-8 h-8 text-black" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">
              Retain & Excel
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Track your progress, strengthen weak areas, and achieve 100%
              better retention with spaced repetition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
