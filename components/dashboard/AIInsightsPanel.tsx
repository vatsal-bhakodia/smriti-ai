import React from 'react';

const tips = [
  "Consistency is key! Try to study a little every day.",
  "Review your flashcards before bed for better retention.",
  "Take short breaks during study sessions to stay fresh.",
  "Challenge yourself with new quizzes each week.",
  "Share your progress with friends for extra motivation!"
];

export default function AIInsightsPanel({
  weeklyStats = { quizzes: [2, 3, 1, 4, 2, 5, 3], flashcards: [10, 20, 15, 30, 25, 40, 35], studyMinutes: [30, 45, 20, 60, 50, 70, 55] },
  userName = "Learner"
}) {
  const today = new Date().toLocaleDateString();
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-200 via-blue-100 to-purple-200 shadow-2xl mb-10 transition-all duration-300">
      <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500">AI Insights for {userName}</h2>
      <div className="mb-4 text-lg text-gray-700 font-medium">{today}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <span className="text-5xl mb-2">📊</span>
          <div className="font-semibold mt-2 text-blue-700">Quizzes This Week</div>
          <div className="text-3xl text-blue-600 font-bold mt-1">{weeklyStats.quizzes.reduce((a,b) => a+b, 0)}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <span className="text-5xl mb-2">🗂️</span>
          <div className="font-semibold mt-2 text-green-700">Flashcards Created</div>
          <div className="text-3xl text-green-600 font-bold mt-1">{weeklyStats.flashcards.reduce((a,b) => a+b, 0)}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <span className="text-5xl mb-2">⏰</span>
          <div className="font-semibold mt-2 text-purple-700">Study Minutes</div>
          <div className="text-3xl text-purple-600 font-bold mt-1">{weeklyStats.studyMinutes.reduce((a,b) => a+b, 0)}</div>
        </div>
      </div>
      <div className="mt-4 p-6 bg-gradient-to-r from-blue-300 via-pink-200 to-purple-300 rounded-xl shadow text-center text-xl font-semibold text-gray-800 transition-all duration-300">
        💡 {tip}
      </div>
    </div>
  );
}
