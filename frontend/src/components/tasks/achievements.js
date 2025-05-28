// Achievement definitions
export const achievements = {
    SEVEN_DAY_STREAK: {
        id: 'SEVEN_DAY_STREAK',
        name: '7-Day Streak',
        description: 'Complete at least one task every day for 7 days',
        icon: '🔥',
        requirement: (stats) => stats.currentStreak >= 7
    },
    KINDNESS_CHAMPION: {
        id: 'KINDNESS_CHAMPION',
        name: 'Kindness Champion',
        description: 'Complete the Random Act of Kindness task 3 times',
        icon: '💝',
        requirement: (stats) => stats.kindnessTasksCompleted >= 3
    },
    SCREEN_FREE_STAR: {
        id: 'SCREEN_FREE_STAR',
        name: 'Screen-Free Star',
        description: 'Complete the Screen-Free Hour task 5 times',
        icon: '⭐',
        requirement: (stats) => stats.screenFreeTasksCompleted >= 5
    }
};

// XP level thresholds
export const levelThresholds = [
    0,      // Level 1
    100,    // Level 2
    300,    // Level 3
    600,    // Level 4
    1000,   // Level 5
    1500,   // Level 6
    2100,   // Level 7
    2800,   // Level 8
    3600,   // Level 9
    4500    // Level 10
];

// Calculate level from XP
export const calculateLevel = (xp) => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (xp >= levelThresholds[i]) {
            return i + 1;
        }
    }
    return 1;
};

// Calculate XP needed for next level
export const xpForNextLevel = (currentXp) => {
    const currentLevel = calculateLevel(currentXp);
    return levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1];
};

// XP rewards for different actions
export const xpRewards = {
    TASK_COMPLETION: 50,
    STREAK_BONUS: 20,
    ACHIEVEMENT_UNLOCK: 100
};
