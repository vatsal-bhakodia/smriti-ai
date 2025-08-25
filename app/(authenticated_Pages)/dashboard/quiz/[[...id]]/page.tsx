"use client";
import { useRef, use, useState, useEffect } from "react";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizFinalResult from "@/components/quiz/QuizResult";
import QuizReview from "@/components/quiz/QuizReview";
import { AccessibleProgressBar } from "@/components/accessibility/AccessibleProgressBar";
import { AriaLiveRegion } from "@/components/accessibility/AriaLiveRegion";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import axios from "axios";

export default function QuizPage({ params }: { params: any }) {
  const rawId = (use(params) as { id: string | string[] }).id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [isLoading, setIsLoading] = useState(true);
  const [resourceTopic, setResourceTopic] = useState("");
  const [quizData, setQuizData] = useState<
    {
      question: string;
      options: string[];
      answer: string;
      explanation: string;
    }[]
  >([]);

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  // Accessibility state
  const [ariaMessage, setAriaMessage] = useState("");

  // Display state
  const [quizState, setQuizState] = useState<"quiz" | "results" | "review">(
    "quiz"
  );
  const [quizId, setQuizId] = useState<string | null>(null);

  const resourceAPI = "/api/resource";

  type QuizQA = {
    id: string;
    quizId: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };

  type QuizResponse = {
    message: string;
    quiz: { id: string; resourceId: string };
    quizQAs: QuizQA[];
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function Datafetcher() {
      // Fetch resource title
      const res = await axios.get<{ resource?: { title: string } }>(
        resourceAPI,
        {
          params: { id },
        }
      );
      if (res.data.resource) {
        setResourceTopic(res.data.resource.title);
      } else {
        console.error("Resource not found");
      }

      // Call quiz API
      const payload = {
        resourceId: id,
        task: "quiz",
      };

      try {
        const resQuiz = await axios.post<QuizResponse>(
          "/api/resource-ai",
          payload
        );
        console.log("Quiz response:", resQuiz.data);

        const quizItems = resQuiz.data.quizQAs.map((qa) => ({
          question: qa.question,
          options: qa.options,
          answer: qa.correctAnswer,
          explanation: qa.explanation,
        }));

        setQuizData(quizItems);
        // Store the quiz ID for saving results later
        setQuizId(resQuiz.data.quiz.id);
        // Initialize userAnswers array with null values
        setUserAnswers(Array(quizItems.length).fill(null));
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setIsLoading(false);
      }
    }

    Datafetcher();
  }, [id]);

  const total = quizData.length;

  const handleSubmit = async () => {
    if (!selected && currentQ === total - 1) {
      // On last question, show warning if no answer selected
      setShowWarning(true);
      return;
    }

    setShowWarning(false);

    // Update user answers array
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQ] = selected;
    setUserAnswers(updatedAnswers);

    let finalScore = score;
    const isCorrect = selected === quizData[currentQ].answer;
    if (isCorrect) {
      finalScore = score + 1;
      setScore(finalScore);
      setAriaMessage("Correct answer!");
    } else {
      setAriaMessage("Incorrect answer.");
    }

    // Move to next or end
    if (currentQ < total - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setAriaMessage(`Moving to question ${currentQ + 2} of ${total}`);
    } else {
      // Quiz completed - save result to database
      setAriaMessage(`Quiz completed! Your final score is ${finalScore} out of ${total}`);
      if (quizId) {
        try {
          await axios.post("/api/quiz-result", {
            quizId,
            score: finalScore,
          });
          console.log("Quiz result saved successfully");
        } catch (error) {
          console.error("Error saving quiz result:", error);
          // Don't prevent showing results even if saving fails
        }
      }
      // Change to results view
      setQuizState("results");
    }
  };

  const handlePrevious = () => {
    setCurrentQ((prev) => prev - 1);
    setSelected(userAnswers[currentQ - 1]);
    setShowWarning(false);
    setAriaMessage(`Going back to question ${currentQ} of ${total}`);
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setUserAnswers(Array(quizData.length).fill(null));
    setQuizState("quiz");
  };

  const startReview = () => {
    setQuizState("review");
  };

  const returnToResults = () => {
    setQuizState("results");
  };

  return (
    <div className="mt-10 min-h-[90vh] h-full px-6 max-w-3xl mx-auto flex flex-col items-center justify-center">
      {/* ARIA Live Region for announcements */}
      <AriaLiveRegion message={ariaMessage} priority="polite" clearAfter={3000} />
      
      {quizState !== "results" && (
        <header className="py-8 space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-lime-400">
            Quiz On
          </h1>
          <h2 className="text-xl sm:text-xl font-medium text-white px-4">
            {resourceTopic}
          </h2>
        </header>
      )}

      {isLoading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-white text-lg gap-4" role="status" aria-live="polite">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span>Loading quiz questions...</span>
        </div>
      ) : (
        <main className="bg-zinc-900 rounded-xl p-6 shadow-xl" id="main-content">
          {quizState === "quiz" && (
            <>
              {/* Accessible Progress Bar */}
              <AccessibleProgressBar
                current={currentQ + 1}
                total={total}
                label="Quiz Progress"
                className="mb-6"
              />

              <QuizQuestion
                question={quizData[currentQ].question}
                options={quizData[currentQ].options}
                selected={selected}
                setSelected={(value) => {
                  setSelected(value);
                  setShowWarning(false);
                }}
                questionNumber={currentQ + 1}
                totalQuestions={total}
              />

              {showWarning && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
                  <AlertCircle size={18} />
                  <p className="text-sm">
                    Please select an answer before proceeding to results.
                  </p>
                </div>
              )}

              <nav className="flex items-center justify-between mt-6" aria-label="Quiz navigation">
                <div>
                  {currentQ > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="flex items-center gap-2 bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label={`Go to previous question (${currentQ} of ${total})`}
                    >
                      <ArrowLeft size={16} aria-hidden="true" />
                      Previous
                    </button>
                  )}
                </div>

                <div>
                  <button
                    onClick={handleSubmit}
                    className={`bg-primary text-black px-6 py-2 rounded hover:bg-lime-300 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      !selected && currentQ < total - 1 ? "opacity-70" : ""
                    }`}
                    aria-label={
                      currentQ === total - 1 
                        ? `Finish quiz and see results (${selected ? 'Answer selected' : 'No answer selected'})` 
                        : `Go to next question (${selected ? 'Answer selected' : 'No answer selected'})`
                    }
                    disabled={!selected && currentQ < total - 1}
                  >
                    {currentQ === total - 1 ? "Finish Quiz" : "Next"}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </nav>
            </>
          )}

          {quizState === "results" && (
            <QuizFinalResult
              score={score}
              total={total}
              userAnswers={userAnswers}
              quizData={quizData}
              resetQuiz={resetQuiz}
              startReview={startReview}
            />
          )}

          {quizState === "review" && (
            <QuizReview
              quizData={quizData}
              userAnswers={userAnswers}
              returnToResults={returnToResults}
            />
          )}
        </main>
      )}
    </div>
  );
}
