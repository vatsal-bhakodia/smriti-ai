"use client";

import { useState, useEffect, useMemo, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizFinalResult from "@/components/quiz/QuizResult";
import QuizReview from "@/components/quiz/QuizReview";
import { AccessibleProgressBar } from "@/components/accessibility/AccessibleProgressBar";
import { AriaLiveRegion } from "@/components/accessibility/AriaLiveRegion";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

// Define the shape of the resolved params object
type QuizPageParams = {
  id: string | string[];
};

// Define the props for the Page component
type QuizPageProps = {
  params: Promise<QuizPageParams>;
};

type QuizQA = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
};

type ResourceResponse = {
  resource?: { id: string; title: string };
};

type QuizResponse = {
  message: string;
  quiz: { id: string; resourceId: string };
  quizQAs: QuizQA[];
};

type FinalAnswer = {
  quizQAId: string;
  selectedOption: string;
  isCorrect: boolean;
};

export default function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = use(params);
  const id = Array.isArray(resolvedParams.id)
    ? resolvedParams.id[0]
    : resolvedParams.id;
  const router = useRouter();
  const hasFetched = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [resourceTopic, setResourceTopic] = useState("");
  const [quizData, setQuizData] = useState<QuizQA[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);

  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userSelections, setUserSelections] = useState<(string | null)[]>([]);

  const [quizState, setQuizState] = useState<"quiz" | "results" | "review">(
    "quiz"
  );
  const [ariaMessage, setAriaMessage] = useState("");
  const totalQuestionsToAsk = 5;

  const currentQuestion = useMemo(() => {
    if (askedQuestions.length === 0 || currentQIndex >= askedQuestions.length)
      return null;
    return quizData.find((q) => q.id === askedQuestions[currentQIndex]);
  }, [currentQIndex, askedQuestions, quizData]);

  const initializeQuiz = (questions: QuizQA[]) => {
    if (questions.length > 0) {
      const mediumQuestions = questions.filter(
        (q) => q.difficulty === "Medium"
      );
      const firstQuestion =
        mediumQuestions.length > 0
          ? mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)]
          : questions[Math.floor(Math.random() * questions.length)];

      setAskedQuestions([firstQuestion.id]);
      setUserSelections(Array(totalQuestionsToAsk).fill(null));
      setCurrentQIndex(0);
      setSelectedOption(null);
      setQuizState("quiz");
    }
  };

  useEffect(() => {
    if (hasFetched.current || !id) return;
    hasFetched.current = true;

    async function Datafetcher() {
      setIsLoading(true);
      try {
        const res = await axios.get<ResourceResponse>(`/api/resource`, {
          params: { id },
        });
        if (res.data.resource) setResourceTopic(res.data.resource.title);

        const payload = { resourceId: id, task: "quiz" };
        const resQuiz = await axios.post<QuizResponse>(
          `/api/resource/ai`,
          payload
        );

        setQuizData(resQuiz.data.quizQAs);
        setQuizId(resQuiz.data.quiz.id);
        initializeQuiz(resQuiz.data.quizQAs);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    Datafetcher();
  }, [id]);

  const getNextQuestion = (isCorrect: boolean) => {
    if (!currentQuestion) return undefined;

    const difficultyHierarchy = ["Easy", "Medium", "Hard"];
    const currentDifficultyIndex = difficultyHierarchy.indexOf(
      currentQuestion.difficulty
    );

    let nextDifficultyIndex = currentDifficultyIndex;
    if (isCorrect && currentDifficultyIndex < difficultyHierarchy.length - 1) {
      nextDifficultyIndex++;
    } else if (!isCorrect && currentDifficultyIndex > 0) {
      nextDifficultyIndex--;
    }

    const availableQuestions = quizData.filter(
      (q) => !askedQuestions.includes(q.id)
    );

    for (let i = 0; i < difficultyHierarchy.length; i++) {
      const searchIndex = isCorrect
        ? nextDifficultyIndex - i
        : nextDifficultyIndex + i;
      if (searchIndex >= 0 && searchIndex < difficultyHierarchy.length) {
        const targetDifficulty = difficultyHierarchy[searchIndex];
        const pool = availableQuestions.filter(
          (q) => q.difficulty === targetDifficulty
        );
        if (pool.length > 0) {
          return pool[Math.floor(Math.random() * pool.length)].id;
        }
      }
    }

    if (availableQuestions.length > 0) {
      return availableQuestions[
        Math.floor(Math.random() * availableQuestions.length)
      ].id;
    }

    console.warn("No more questions available for adaptive selection.");
    return undefined;
  };

  const handleNext = async () => {
    if (!selectedOption || !currentQuestion) return;

    const newSelections = [...userSelections];
    newSelections[currentQIndex] = selectedOption;
    setUserSelections(newSelections);

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setAriaMessage(isCorrect ? "Correct answer!" : "Incorrect answer.");

    if (currentQIndex === totalQuestionsToAsk - 1) {
      setQuizState("results");
      setAriaMessage(`Quiz completed!`);

      const finalAnswersPayload = askedQuestions.map((qaId, index) => ({
        quizQAId: qaId,
        selectedOption: newSelections[index],
      }));

      // CHANGE 1: More robust check to prevent saving incomplete results
      const allQuestionsAnswered = finalAnswersPayload.every(
        (a) => a.selectedOption
      );

      if (quizId && allQuestionsAnswered) {
        // CHANGE 2: Cleaner way to handle toast.promise
        const saveResults = async () => {
          const response = await axios.post("/api/resource/quiz-result", {
            quizId,
            answers: finalAnswersPayload,
          });
          const data = response.data as {
            unlockedAchievement?: { name: string; icon: string };
          };
          if (data.unlockedAchievement) {
            const { name, icon } = data.unlockedAchievement;
            toast.success(`Achievement Unlocked: ${icon} ${name}`);
          }
        };

        toast.promise(saveResults(), {
          loading: "Saving your results...",
          success: "Results saved successfully!",
          error: (err) => `Error: ${err.message || "Could not save results."}`,
        });
      } else if (!allQuestionsAnswered) {
        toast.error("Could not save results: Not all questions were answered.");
        console.error(
          "Attempted to save quiz with incomplete answers.",
          finalAnswersPayload
        );
      }
    } else {
      if (currentQIndex === askedQuestions.length - 1) {
        const nextQuestionId = getNextQuestion(isCorrect);
        if (nextQuestionId) {
          setAskedQuestions([...askedQuestions, nextQuestionId]);
        }
      }
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(newSelections[currentQIndex + 1] || null);
      setAriaMessage(`Moving to question ${currentQIndex + 2}`);
    }
  };

  const handlePrevious = () => {
    setCurrentQIndex(currentQIndex - 1);
    setSelectedOption(userSelections[currentQIndex - 1]);
    setAriaMessage(`Going back to question ${currentQIndex}`);
  };

  const resetQuiz = () => {
    initializeQuiz(quizData);
  };

  const startReview = () => setQuizState("review");
  const returnToResults = () => setQuizState("results");

  if (isLoading || askedQuestions.length === 0) {
    return (
      <div className="mt-10 px-6 max-w-3xl mx-auto flex flex-col w-full">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-24 bg-zinc-800 rounded" />
        </div>

        {/* Header Skeleton */}
        <header className="py-8 space-y-4 text-center mb-6 w-full">
          <Skeleton className="h-10 w-48 mx-auto bg-zinc-800" />
          <Skeleton className="h-6 w-full max-w-md mx-auto bg-zinc-800" />
        </header>

        {/* Main Content Skeleton */}
        <main className="bg-zinc-900 rounded-xl p-6 shadow-xl w-full">
          {/* Progress Bar Skeleton */}
          <div className="mb-6 space-y-2 w-full">
            <div className="flex justify-between w-full">
              <Skeleton className="h-4 w-32 bg-zinc-800" />
              <Skeleton className="h-4 w-32 bg-zinc-800" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-zinc-800" />
          </div>

          {/* Question Card Skeleton */}
          <div className="space-y-6 w-full">
            <Skeleton className="h-6 w-full bg-zinc-800" />
            <Skeleton className="h-6 w-full bg-zinc-800" />

            {/* Options Skeleton */}
            <div className="space-y-3 mt-8 w-full">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-zinc-800 rounded" />
              ))}
            </div>
          </div>

          {/* Navigation Skeleton */}
          <div className="flex items-center justify-between mt-6 w-full">
            <Skeleton className="h-10 w-32 bg-zinc-800 rounded" />
            <Skeleton className="h-10 w-32 bg-zinc-800 rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-xl font-semibold mt-4">
          Could not load the current question.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 px-6 max-w-3xl mx-auto flex flex-col w-full">
      <AriaLiveRegion
        message={ariaMessage}
        priority="polite"
        clearAfter={3000}
      />
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => router.push(`/resource/${id}`)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Go back to resource page"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Resource</span>
        </button>
      </div>
      <div className="flex flex-col items-center flex-1">
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
        <main
          className="bg-zinc-900 rounded-xl p-6 shadow-xl w-full"
          id="main-content"
        >
          {quizState === "quiz" && (
            <>
              <AccessibleProgressBar
                current={currentQIndex + 1}
                total={totalQuestionsToAsk}
                label="Quiz Progress"
                className="mb-6"
              />
              <QuizQuestion
                question={currentQuestion.question}
                options={currentQuestion.options}
                selected={selectedOption}
                setSelected={setSelectedOption}
                questionNumber={currentQIndex + 1}
                totalQuestions={totalQuestionsToAsk}
              />
              <nav
                className="flex items-center justify-between mt-6"
                aria-label="Quiz navigation"
              >
                <div>
                  {currentQIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="flex items-center gap-2 bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600 transition-colors"
                    >
                      <ArrowLeft size={16} aria-hidden="true" /> Previous
                    </button>
                  )}
                </div>
                <button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="bg-primary text-black px-6 py-2 rounded hover:bg-lime-300 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {currentQIndex === totalQuestionsToAsk - 1
                    ? "Finish Quiz"
                    : "Next"}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </nav>
            </>
          )}

          {quizState === "results" && (
            <QuizFinalResult
              userAnswers={askedQuestions.map((qaId, index) => {
                const question = quizData.find((q) => q.id === qaId)!;
                return {
                  quizQAId: qaId,
                  selectedOption: userSelections[index]!,
                  isCorrect: userSelections[index] === question.correctAnswer,
                };
              })}
              quizData={quizData}
              resetQuiz={resetQuiz}
              startReview={startReview}
            />
          )}

          {quizState === "review" && (
            <QuizReview
              userAnswers={askedQuestions.map((qaId, index) => {
                const question = quizData.find((q) => q.id === qaId)!;
                return {
                  quizQAId: qaId,
                  selectedOption: userSelections[index]!,
                  isCorrect: userSelections[index] === question.correctAnswer,
                };
              })}
              quizData={quizData}
              returnToResults={returnToResults}
            />
          )}
        </main>
      </div>
    </div>
  );
}
