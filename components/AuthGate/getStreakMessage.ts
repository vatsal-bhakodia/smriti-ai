export function getStreakMessage(
  currentStreak: number,
  streakBroken: boolean,
  previousStreak: number
): { emoji: string; message: string } {
  // Streak was broken
  if (streakBroken && previousStreak > 1) {
    return {
      emoji: "😢",
      message: `Streak reset! But don't worry, you're back at day 1.`,
    };
  }

  // First day / New start
  if (currentStreak === 1 && !streakBroken) {
    return {
      emoji: "🌟",
      message: "Welcome back! Day 1 of your new streak.",
    };
  }

  // Milestone achievements
  if (currentStreak === 100) {
    return {
      emoji: "💯",
      message: "100 days! You're a legend!",
    };
  }
  if (currentStreak === 50) {
    return {
      emoji: "👑",
      message: "50 day streak! You're unstoppable!",
    };
  }
  if (currentStreak === 30) {
    return {
      emoji: "🎖️",
      message: "30 days strong! You've built an amazing habit!",
    };
  }
  if (currentStreak === 21) {
    return {
      emoji: "💪",
      message:
        "21 days! They say it takes 21 days to build a habit. You did it!",
    };
  }
  if (currentStreak === 14) {
    return {
      emoji: "🌈",
      message: "Two weeks straight! You're building something special here!",
    };
  }
  if (currentStreak === 7) {
    return {
      emoji: "🎉",
      message:
        "One week streak! Consistency is the key to success. Keep going!",
    };
  }
  if (currentStreak === 3) {
    return {
      emoji: "🔥",
      message: "3 days in a row! You're on fire! Keep the momentum going!",
    };
  }

  // Regular streak messages based on ranges
  if (currentStreak >= 75) {
    return {
      emoji: "🚀",
      message: `${currentStreak} days! You're absolutely crushing it! Nothing can stop you!`,
    };
  }
  if (currentStreak >= 40) {
    return {
      emoji: "⭐",
      message: `${currentStreak} day streak! Your dedication is truly inspiring!`,
    };
  }
  if (currentStreak >= 15) {
    return {
      emoji: "✨",
      message: `${currentStreak} days! You're doing amazing! Keep up the great work!`,
    };
  }
  if (currentStreak >= 5) {
    return {
      emoji: "💪",
      message: `${currentStreak} day streak! You're building a strong habit. Well done!`,
    };
  }
  if (currentStreak >= 2) {
    return {
      emoji: "🌱",
      message: `${currentStreak} days! Great start! Every journey begins with small steps!`,
    };
  }

  // Default
  return {
    emoji: "👋",
    message: "Welcome back! Ready to learn something new today?",
  };
}
