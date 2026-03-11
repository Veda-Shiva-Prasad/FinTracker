export const badges = {
  // Streak Badges
  STREAK_7: {
    id: "streak_7",
    name: "Week Warrior",
    icon: "🔥",
    description: "7 day streak",
  },
  STREAK_30: {
    id: "streak_30",
    name: "Monthly Master",
    icon: "⚡",
    description: "30 day streak",
  },
  STREAK_100: {
    id: "streak_100",
    name: "Century Club",
    icon: "💯",
    description: "100 day streak",
  },
  STREAK_365: {
    id: "streak_365",
    name: "Year-Long Legend",
    icon: "👑",
    description: "365 day streak",
  },

  // Savings Badges
  SAVINGS_1000: {
    id: "savings_1000",
    name: "First Milestone",
    icon: "🥉",
    description: "Saved ₹1,000",
  },
  SAVINGS_10000: {
    id: "savings_10000",
    name: "Silver Saver",
    icon: "🥈",
    description: "Saved ₹10,000",
  },
  SAVINGS_50000: {
    id: "savings_50000",
    name: "Golden Saver",
    icon: "🥇",
    description: "Saved ₹50,000",
  },
  SAVINGS_100000: {
    id: "savings_100000",
    name: "Platinum Pro",
    icon: "💎",
    description: "Saved ₹1,00,000",
  },

  // Budget Badges
  BUDGET_1: {
    id: "budget_1",
    name: "Budget Beginner",
    icon: "🌱",
    description: "First budget set",
  },
  BUDGET_3: {
    id: "budget_3",
    name: "Budget Builder",
    icon: "🏗️",
    description: "3 months on budget",
  },
  BUDGET_6: {
    id: "budget_6",
    name: "Budget Master",
    icon: "🏆",
    description: "6 months on budget",
  },
  BUDGET_12: {
    id: "budget_12",
    name: "Budget Legend",
    icon: "🌟",
    description: "1 year on budget",
  },

  // Goal Badges
  GOAL_1: {
    id: "goal_1",
    name: "Goal Getter",
    icon: "🎯",
    description: "First goal achieved",
  },
  GOAL_3: {
    id: "goal_3",
    name: "Goal Crusher",
    icon: "💪",
    description: "3 goals achieved",
  },
  GOAL_5: {
    id: "goal_5",
    name: "Goal Champion",
    icon: "🏅",
    description: "5 goals achieved",
  },
  GOAL_10: {
    id: "goal_10",
    name: "Goal Legend",
    icon: "🏆",
    description: "10 goals achieved",
  },

  // Perfect Month Badges
  PERFECT_1: {
    id: "perfect_1",
    name: "Perfect Month",
    icon: "✨",
    description: "Stayed under budget",
  },
  PERFECT_3: {
    id: "perfect_3",
    name: "Perfect Quarter",
    icon: "⭐",
    description: "3 perfect months",
  },
  PERFECT_6: {
    id: "perfect_6",
    name: "Perfect Half-Year",
    icon: "🌠",
    description: "6 perfect months",
  },
  PERFECT_12: {
    id: "perfect_12",
    name: "Perfect Year",
    icon: "💫",
    description: "12 perfect months",
  },

  // Special Badges
  EARLY_BIRD: {
    id: "early_bird",
    name: "Early Bird",
    icon: "🐦",
    description: "Track expenses before 9 AM",
  },
  NIGHT_OWL: {
    id: "night_owl",
    name: "Night Owl",
    icon: "🦉",
    description: "Track expenses after 11 PM",
  },
  WEEKEND_WARRIOR: {
    id: "weekend_warrior",
    name: "Weekend Warrior",
    icon: "🎮",
    description: "Active on weekends",
  },
  DATA_MASTER: {
    id: "data_master",
    name: "Data Master",
    icon: "📊",
    description: "Exported 10 reports",
  },
};

export const checkAndAwardBadges = (userStats) => {
  const earnedBadges = [];

  // Check streak badges
  if (userStats.streak >= 7) earnedBadges.push(badges.STREAK_7);
  if (userStats.streak >= 30) earnedBadges.push(badges.STREAK_30);
  if (userStats.streak >= 100) earnedBadges.push(badges.STREAK_100);
  if (userStats.streak >= 365) earnedBadges.push(badges.STREAK_365);

  // Check savings badges
  if (userStats.totalSavings >= 1000) earnedBadges.push(badges.SAVINGS_1000);
  if (userStats.totalSavings >= 10000) earnedBadges.push(badges.SAVINGS_10000);
  if (userStats.totalSavings >= 50000) earnedBadges.push(badges.SAVINGS_50000);
  if (userStats.totalSavings >= 100000)
    earnedBadges.push(badges.SAVINGS_100000);

  // Check budget badges
  if (userStats.budgetMonths >= 1) earnedBadges.push(badges.BUDGET_1);
  if (userStats.budgetMonths >= 3) earnedBadges.push(badges.BUDGET_3);
  if (userStats.budgetMonths >= 6) earnedBadges.push(badges.BUDGET_6);
  if (userStats.budgetMonths >= 12) earnedBadges.push(badges.BUDGET_12);

  return earnedBadges;
};
