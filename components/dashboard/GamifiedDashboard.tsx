import React, { useState, useEffect } from 'react';

const badges = [
  { name: '7-Day Streak', condition: (streak: number) => streak >= 7 },
  { name: 'Quiz Master', condition: (quizzes: number) => quizzes >= 20 },
  { name: 'Flashcard Pro', condition: (flashcards: number) => flashcards >= 100 },
  { name: 'Study Champ', condition: (minutes: number) => minutes >= 300 },
];

export default function GamifiedDashboard({
  streak = 0,
  quizzes = 0,
  flashcards = 0,
  studyMinutes = 0,
}) {
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    const earned = badges.filter(b => {
      if (b.name === '7-Day Streak') return b.condition(streak);
      if (b.name === 'Quiz Master') return b.condition(quizzes);
      if (b.name === 'Flashcard Pro') return b.condition(flashcards);
      if (b.name === 'Study Champ') return b.condition(studyMinutes);
      return false;
    }).map(b => b.name);
    setEarnedBadges(earned);
  }, [streak, quizzes, flashcards, studyMinutes]);

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-100 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Gamified Learning Dashboard</h2>
      <div className="mb-6 flex gap-6 flex-wrap">
        <div className="flex-1">
          <div className="font-semibold">Streak</div>
          <div className="text-3xl">{streak} 🔥</div>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div className="bg-orange-400 h-2 rounded" style={{ width: `${Math.min(streak, 7) / 7 * 100}%` }} />
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold">Quizzes Completed</div>
          <div className="text-3xl">{quizzes}</div>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded" style={{ width: `${Math.min(quizzes, 20) / 20 * 100}%` }} />
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold">Flashcards Created</div>
          <div className="text-3xl">{flashcards}</div>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div className="bg-green-500 h-2 rounded" style={{ width: `${Math.min(flashcards, 100) / 100 * 100}%` }} />
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold">Study Minutes</div>
          <div className="text-3xl">{studyMinutes}</div>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div className="bg-purple-500 h-2 rounded" style={{ width: `${Math.min(studyMinutes, 300) / 300 * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Badges Earned</h3>
        {earnedBadges.length === 0 ? (
          <div className="text-gray-500">No badges yet. Keep learning!</div>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {earnedBadges.map(badge => (
              <span key={badge} className="px-3 py-1 bg-yellow-300 rounded-full font-semibold text-sm shadow">🏅 {badge}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
