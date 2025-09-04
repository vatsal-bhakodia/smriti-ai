import { Brain, Sparkles, BookOpen, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20 py-24">
      <div
        className="rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-md smriti-gradient-bg"
      >
        <div className="text-center mb-12">
          <Brain className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
            How Smriti AI <span className="text-primary">Works</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Three simple steps to transform your learning experience forever.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload & Learn */}
          <div className="text-center smriti-step-card transform transition-all duration-300 hover:scale-105">
            <div
              className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 smriti-icon-container shadow-lg"
            >
              <BookOpen className="w-8 h-8 text-black hover:animate-pulse" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">Upload & Learn</h3>
            <p className="text-gray-300 leading-relaxed">
              Upload your PDFs, YouTube videos, or study materials. Our AI instantly understands your content.
            </p>
          </div>

          {/* AI Magic */}
          <div className="text-center smriti-step-card transform transition-all duration-300 hover:scale-105">
            <div
              className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 smriti-icon-container shadow-lg"
            >
              <Sparkles className="w-8 h-8 text-black hover:animate-pulse" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">AI Magic</h3>
            <p className="text-gray-300 leading-relaxed">
              Get instant summaries, interactive mind maps, and personalized MCQ tests tailored to your learning style.
            </p>
          </div>

          {/* Retain & Excel */}
          <div className="text-center smriti-step-card transform transition-all duration-300 hover:scale-105">
            <div
              className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 smriti-icon-container shadow-lg"
            >
              <TrendingUp className="w-8 h-8 text-black hover:animate-pulse" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">Retain & Excel</h3>
            <p className="text-gray-300 leading-relaxed">
              Track your progress, strengthen weak areas, and achieve 100% better retention with spaced repetition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
