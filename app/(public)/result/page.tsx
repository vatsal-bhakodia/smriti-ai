import ResultsContainer from "@/components/result/ResultsContainer";
import { Database, Calculator, Shield } from "lucide-react";
import { generateMetadataUtil } from "@/utils/generateMetadata";
import CGPAFormula from "@/components/result/CGPAFormula";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { supportedPrograms } from "@/content/supportedProgrammes";

export const metadata = generateMetadataUtil({
  title: "IPU Result 2025-2026 (GGSIPU) - B.Tech Results & CGPA Calculator",
  description:
    "Check IPU Result 2025-2026 for GGSIPU B.Tech & other courses instantly. View subject-wise marks, SGPA/CGPA calculator, and download result PDF. Trusted by IPU students in Delhi & India.",
  keywords: [
    "ipu result",
    "ipu result portal",
    "ggsipu result",
    "ipu result 2025",
    "ipu result 2026",
    "ipu result btech",
    "ggsipu btech result",
    "cgpa calculator",
    "ipu cgpa calculator",
    "ipu sgpa calculator",
    "ggsipu result delhi",
    "ipu university result",
    "ggsipu marksheet",
    "ipu result pdf",
    "ip university result india"
  ],
  url: "https://www.smriti.live/result",
});

export default function ResultsPage() {
  const faqItems = [
    {
      id: "data-safety",
      question: "Is my data safe? Do you store my credentials?",
      answer: (
        <>
          We do not store your enrollment number,
          password, or any login credentials. Your credentials are used only for the duration of your
          session to fetch results directly from the IPU portal. Once you close your browser,
          everything is cleared.
        </>
      ),
    },
    {
      id: "data-storage",
      question: "Do you save my results or personal information?",
      answer: (
        <>
          <strong className="text-white">No, we don't.</strong> Your results are stored temporarily
          in your browser's session storage for your convenience during your visit. We do not have
          any backend database that stores student data. Everything stays on your device.
        </>
      ),
    },
    {
      id: "verification",
      question: "How can I verify this is true?",
      answer: (
        <>
          <strong className="text-white">We're completely open source!</strong> You can check our
          entire codebase on{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            GitHub
          </a>
          . Every line of code is public and auditable. There's nothing hidden.
        </>
      ),
    },
  ];


  return (
    <>
      {/* Grid pattern overlay - fixed background covering entire viewport */}
      <div
        className="fixed inset-0 opacity-5 -z-10"
        style={{
          backgroundImage: `linear-gradient(#a3ff19 1px, transparent 1px), linear-gradient(90deg, #a3ff19 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          backgroundRepeat: "repeat",
        }}
      ></div>

      <div className="min-h-[70vh] p-4 relative z-0 pb-20">
        {/* Dynamic Results Container */}
        <ResultsContainer />

        {/* Information Sections */}
        <div className="w-full max-w-5xl mx-auto mt-12 space-y-12">
          {/* FAQ Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 px-6"
                >
                  <AccordionTrigger className="hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* How We Get Results Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Database className="h-8 w-8 text-primary" />
              How Do We Get Your Results?
            </h2>

            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <p className="text-zinc-300 leading-relaxed mb-4">
                We fetch your results <strong className="text-white">directly from the official IPU Result Portal</strong> in real-time.
                Here's how it works:
              </p>

              <ol className="space-y-3 text-zinc-300 ml-6 list-decimal">
                <li>You enter your enrollment number, password, and captcha</li>
                <li>We send your credentials to the official IPU server</li>
                <li>The IPU server responds with your results</li>
                <li>We parse and display them in a better format</li>
              </ol>

              <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700/30">
                <p className="text-sm text-zinc-400">
                  <strong className="text-primary">Important:</strong> We do not have access to any IPU database.
                  We cannot see or modify any data that isn't already available to you on the official portal.
                  We're simply a better interface for viewing your own results.
                </p>
              </div>
            </div>
          </section>

          {/* CGPA Calculator Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Calculator className="h-8 w-8 text-primary" />
              How to calculate CGPA for IPUniversity?
            </h2>

            <div className="space-y-6">
              <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
                <p className="text-zinc-300 mb-4">
                  CGPA (Cumulative Grade Point Average) is calculated using the weighted average formula:
                </p>

                <div className="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-4">
                  <CGPAFormula />
                  <p className="text-xs text-zinc-500 text-center mt-2">
                    Where C<sub>ni</sub> = Credits for subject/semester and G<sub>ni</sub> = Grade Point obtained
                  </p>
                </div>

                <p className="text-zinc-300 mt-4 text-sm">
                  This formula multiplies each subject's grade points by its credit hours, sums them up,
                  and divides by the total credit hours to give you an accurate CGPA.
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
                <h3 className="text-xl font-semibold text-primary mb-4">
                  Accurate Credits Data Available
                </h3>

                <p className="text-zinc-300 mb-4">
                  We maintain accurate credit data for the following programs:
                </p>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/30">
                  <h4 className="text-lg font-semibold text-white mb-2">BCA (Bachelor of Computer Applications)</h4>
                  <p className="text-sm text-zinc-400">
                    Complete credit data for all semesters and subjects
                  </p>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/30">
                  <h4 className="text-lg font-semibold text-white mb-2">BTech (Bachelor of Technology)</h4>
                  <p className="text-sm text-zinc-400 mb-2">
                    Available for these branches:
                  </p>
                  <ul className="text-xs text-zinc-500 space-y-1 ml-4 list-disc">
                    <li>Computer Science Engineering (CSE)</li>
                    <li>Information Technology (IT)</li>
                    <li>Electronics and Communication (ECE)</li>
                    <li>Mechanical Engineering (ME)</li>
                    <li>Civil Engineering (CE)</li>
                    <li>Electrical Engineering (EE)</li>
                  </ul>
                </div>

                <p className="text-xs text-zinc-500 mt-4">
                  For other programs, you can manually enter credit information to calculate your CGPA accurately.
                </p>
              </div>
            </div>
          </section>

          {/* GGSIPU Syllabus & Notes Banner */}
          <Link
            href="/resources/ggsipu"
            className="w-full group block"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800 border border-zinc-800 rounded-2xl hover:border-lime-500/50 hover:shadow-lg hover:shadow-lime-500/10 transition-all duration-300">

              {/* Content */}
              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Left Section */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-lime-500/20 rounded-xl border border-lime-500/30 group-hover:bg-lime-500/30 group-hover:border-lime-500/50 transition-all duration-300">
                        <BookOpen className="w-8 h-8 text-lime-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                          GGSIPU Syllabus & Notes
                        </h3>
                        <p className="text-zinc-400 text-sm md:text-base">
                          Comprehensive study materials for all semesters
                        </p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                      <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
                        <span>Complete syllabus for all programs</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
                        <span>Subject-wise notes and resources</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
                        <span>Previous year question papers</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
                        <span>Organized by semester and branch</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - CTA */}
                  <div className="p-4 bg-lime-500/10 rounded-xl border border-lime-500/20 group-hover:bg-lime-500/20 group-hover:border-lime-500/40 transition-all duration-300">
                    <ArrowRight className="w-6 h-6 text-lime-500 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-lime-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            </div>
          </Link>

          {/* Supported Programs Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Database className="h-8 w-8 text-primary" />
              Result Available For All GGSIPU Programmes
            </h2>
            <p className="text-zinc-400 mb-6 text-sm md:text-base">
              We support result checking for the following GGSIPU programs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {supportedPrograms.map((program, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 px-4 py-3 hover:border-lime-500/30 hover:bg-zinc-800/70 transition-all duration-200"
                >
                  <p className="text-zinc-300 text-sm font-medium">{program}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
