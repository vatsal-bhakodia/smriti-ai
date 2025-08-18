"use client";
import { useEffect, useMemo } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import confetti from "canvas-confetti";

export type QuizFinalResultProps = {
  score: number;
  total: number;
  userAnswers: (string | null)[];
  quizData: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
  resetQuiz: () => void;
  startReview: () => void;
};

const getColorForScore = (percentage: number): string => {
  if (percentage > 70) return "#84cc16"; // green
  if (percentage > 30) return "#eab308"; // yellow
  return "#dc2626"; // red
};

const QuizFinalResult = ({
  score,
  total,
  userAnswers,
  quizData,
  resetQuiz,
  startReview,
}: QuizFinalResultProps) => {
  const percentage = Math.round((score / total) * 100);
  const color = getColorForScore(percentage);

  useEffect(() => {
    if (percentage > 70) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [percentage]);

  const wrongAnswersCount = useMemo(() => {
    return userAnswers.filter(
      (answer, index) => answer !== quizData[index].answer
    ).length;
  }, [userAnswers, quizData]);

  return (
   <div className="flex flex-col items-center justify-center text-center space-y-6">
  <h2 className="text-3xl font-bold text-primary light:text-lime-600">
    Your Quiz Summary
  </h2>

  <div className="w-40 h-40">
    <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      strokeWidth={10}
      styles={buildStyles({
        textColor: "#fff", // dark mode
        pathColor: color,
        trailColor: "#1e1e2f",
        textSize: "16px",
      })}
    />
  </div>

  <p className="text-white text-lg light:text-gray-900">
    You answered <span className="font-bold text-primary light:text-lime-600">{score}</span> out
    of <span className="font-bold text-primary light:text-lime-600">{total}</span> questions
    correctly.
  </p>

  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
    <button
      onClick={resetQuiz}
      className="bg-primary text-black px-6 py-2 rounded hover:bg-lime-300 light:bg-lime-400 light:text-black light:hover:bg-lime-300 transition-colors"
    >
      Retry Quiz
    </button>

    {wrongAnswersCount > 0 && (
      <button
        onClick={startReview}
        className="bg-zinc-700 text-white px-6 py-2 rounded hover:bg-zinc-600 light:bg-white light:text-gray-900 light:hover:bg-gray-100 transition-colors"
      >
        Revisit Incorrect Questions ({wrongAnswersCount})
      </button>
    )}
  </div>
</div>

  );
};

export default QuizFinalResult;
