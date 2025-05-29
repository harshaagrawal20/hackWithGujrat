import React, { useState, useEffect } from 'react';
import './DailyTasks.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { achievements, calculateLevel, xpForNextLevel, xpRewards } from './achievements';
import LevelUpModal from './LevelUpModal';

// Pool of potential daily tasks (10-Day Mental Health Task Challenge)
const potentialDailyTasks = [
    "Day 1: Gratitude Letter - Write a letter (or short note) to someone you're thankful for.",
    "Day 2: Nature Time - Spend 20 minutes outdoors. Focus on your senses.",
    "Day 3: Declutter One Spot - Tidy up a small area like your desk or bag.",
    "Day 4: Music Therapy - Make a playlist of relaxing or uplifting songs.",
    "Day 5: Random Act of Kindness - Do one kind thing for someone.",
    "Day 6: Vision Board or Mood Board - Create a collage of your goals or feelings.",
    "Day 7: Screen-Free Hour - Pick one hour to go totally screen-free.",
    "Day 8: Try Something New - Do one thing you've never done before.",
    "Day 9: Self-Compassion Letter - Write a kind and encouraging letter to yourself.",
    "Day 10: Create a Calm Corner - Set up a personal safe space with calming items.",
];

const DailyTasks = () => {
    const [dailyTasks, setDailyTasks] = useState([]);
    const [taskDate, setTaskDate] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [currentNote, setCurrentNote] = useState(''); // State for the note being edited
    const [stats, setStats] = useState({
        xp: 0,
        currentStreak: 0,
        lastCompletionDate: null,
        kindnessTasksCompleted: 0,
        screenFreeTasksCompleted: 0,
        unlockedAchievements: []
    });
    const [showAchievement, setShowAchievement] = useState(null);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [levelUpSound] = useState(new Audio('/assets/level-up.mp3'));
    const [achievementSound] = useState(new Audio('/assets/achievement.mp3'));

    // Calculate completion progress
    const completedTasksCount = dailyTasks.filter(task => task.completed).length;
    const totalTasksCount = dailyTasks.length;
    const completionPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

    // Determine if all tasks are completed
    const allTasksCompleted = totalTasksCount > 0 && completedTasksCount === totalTasksCount;

    // Determine motivational message based on progress
    let motivationalMessage = "Keep going!";
    if (allTasksCompleted) {
        motivationalMessage = "Challenge complete! Great job!";
    } else if (completedTasksCount > 0) {
        motivationalMessage = "You're making great progress!";
    } else {
        motivationalMessage = "Start your first task today!";
    }

    // Function to get today's date in a simple format (YYYY-MM-DD)
    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // Function to load tasks from local storage or generate new ones
    const loadDailyTasks = () => {
        const todayDate = getTodayDate();
        const savedTasks = localStorage.getItem('dailyTasks');
        const savedDate = localStorage.getItem('taskDate');

        // Reset tasks at midnight
        const shouldResetTasks = savedDate !== todayDate;

        if (savedTasks && !shouldResetTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks).map(task => ({ ...task, notes: task.notes || '' }));
                setDailyTasks(parsedTasks);
                setTaskDate(savedDate);
            } catch (e) {
                console.error('Error parsing saved tasks:', e);
                generateNewTasks(todayDate);
            }
        } else {
            generateNewTasks(todayDate);
        }
    };

    // Helper function to generate and save new tasks (all 10 for the day)
    const generateNewTasks = (todayDate) => {
        const newTasks = potentialDailyTasks.map((taskText, index) => ({
            id: `${todayDate}-${index}`, // Use date and index for unique ID
            text: taskText,
            completed: false,
            notes: '', // Add notes property
        }));
        setDailyTasks(newTasks);
        setTaskDate(todayDate);
        localStorage.setItem('dailyTasks', JSON.stringify(newTasks));
        localStorage.setItem('taskDate', todayDate);
    };

    // Effect to load/generate tasks on component mount
    useEffect(() => {
        loadDailyTasks();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Load stats from localStorage
    useEffect(() => {
        const savedStats = localStorage.getItem('taskStats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    // Add level up check
    useEffect(() => {
        const previousLevel = calculateLevel(stats.xp - xpRewards.TASK_COMPLETION);
        const currentLevel = calculateLevel(stats.xp);
        
        if (currentLevel > previousLevel) {
            setShowLevelUp(true);
            levelUpSound.play().catch(console.error);
        }
    }, [stats.xp, levelUpSound]);

    // Play achievement sound
    useEffect(() => {
        if (showAchievement) {
            achievementSound.play().catch(console.error);
        }
    }, [showAchievement, achievementSound]);

    // Function to toggle task completion status
    const toggleTaskComplete = (id) => {
        setDailyTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task => {
                if (task.id === id) {
                    const newCompletedStatus = !task.completed;
                    const updatedTask = { ...task, completed: newCompletedStatus };

                    if (newCompletedStatus) {
                        // Update stats when task is completed
                        updateTaskStats(task);
                        updateStreak();
                        setTimeout(checkAchievements, 500); // Check achievements after stats update
                        return { ...updatedTask, isAnimating: true };
                    }
                    return updatedTask;
                }
                return task;
            });

            // Save tasks
            localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks.map(task => {
                const { isAnimating, ...rest } = task;
                return rest;
            })));
            return updatedTasks;
        });
    };

    // Update task stats (XP, streak, etc.) when a task is completed
    const updateTaskStats = (task) => {
        // Calculate new XP
        const newXp = stats.xp + 10; // Assume each task gives 10 XP
        setStats(prevStats => ({ ...prevStats, xp: newXp }));

        // Update completed kindness or screen-free tasks
        if (task.text.includes('kindness')) {
            setStats(prevStats => ({ ...prevStats, kindnessTasksCompleted: prevStats.kindnessTasksCompleted + 1 }));
        } else if (task.text.includes('screen-free')) {
            setStats(prevStats => ({ ...prevStats, screenFreeTasksCompleted: prevStats.screenFreeTasksCompleted + 1 }));
        }

        // Save updated stats to localStorage
        localStorage.setItem('taskStats', JSON.stringify({
            ...stats,
            xp: newXp,
            lastCompletionDate: new Date().toISOString(),
        }));
    };

    // Update streak based on task completion
    const updateStreak = () => {
        const today = new Date();
        const lastCompletionDate = new Date(stats.lastCompletionDate);
        const isConsecutiveDay = (today - lastCompletionDate) / (1000 * 3600 * 24) === 1;

        if (isConsecutiveDay) {
            setStats(prevStats => ({ ...prevStats, currentStreak: prevStats.currentStreak + 1 }));
        } else {
            setStats(prevStats => ({ ...prevStats, currentStreak: 1 }));
        }

        // Save updated stats to localStorage
        localStorage.setItem('taskStats', JSON.stringify({
            ...stats,
            currentStreak: isConsecutiveDay ? stats.currentStreak + 1 : 1,
            lastCompletionDate: new Date().toISOString(),
        }));
    };

    // Check and unlock achievements based on current stats
    const checkAchievements = () => {
        const newAchievements = [];

        // Example achievement: Complete 5 tasks
        if (completedTasksCount >= 5 && !stats.unlockedAchievements.includes('fiveTasks')) {
            newAchievements.push('fiveTasks');
        }

        // Example achievement: Complete a task for 7 consecutive days
        if (stats.currentStreak >= 7 && !stats.unlockedAchievements.includes('sevenDayStreak')) {
            newAchievements.push('sevenDayStreak');
        }

        // Update unlocked achievements in stats
        if (newAchievements.length > 0) {
            setStats(prevStats => ({
                ...prevStats,
                unlockedAchievements: [...prevStats.unlockedAchievements, ...newAchievements],
                xp: prevStats.xp + newAchievements.length * xpRewards.ACHIEVEMENT_UNLOCK, // Reward XP for each new achievement
            }));

            // Show achievement popup for the first new achievement
            setShowAchievement(achievements[newAchievements[0]]);
        }

        // Save updated stats to localStorage
        localStorage.setItem('taskStats', JSON.stringify({
            ...stats,
            unlockedAchievements: [...stats.unlockedAchievements, ...newAchievements],
            xp: stats.xp + newAchievements.length * xpRewards.ACHIEVEMENT_UNLOCK,
        }));
    };

    // Calculate current level based on XP
    const currentLevel = calculateLevel(stats.xp);
    const nextLevelXp = xpForNextLevel(currentLevel);

    return (
        <>
            {/* Stats Display */}
            <div className="user-stats">
                <div className="level-info">
                    <h3>Level {currentLevel}</h3>
                    <div className="xp-bar">
                        <div 
                            className="xp-fill" 
                            style={{ width: `${(stats.xp / nextLevelXp) * 100}%` }}
                        ></div>
                    </div>
                    <p>{stats.xp} / {nextLevelXp} XP</p>
                </div>
                <div className="streak-counter">
                    <span className="streak-icon">🔥</span>
                    <span className="streak-count">{stats.currentStreak} day streak</span>
                </div>
                <div className="achievements-showcase">
                    {stats.unlockedAchievements.map(achievementId => {
                        const achievement = achievements[achievementId];
                        return (
                            <div 
                                key={achievementId} 
                                className="achievement-badge"
                                title={`${achievement.name}: ${achievement.description}`}
                            >
                                {achievement.icon}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Achievement Popup */}
            {showAchievement && (
                <div className="achievement-popup">
                    <div className="achievement-content">
                        <h3>🎉 Achievement Unlocked!</h3>
                        <p>{showAchievement.icon} {showAchievement.name}</p>
                        <p>{showAchievement.description}</p>
                        <p>+{xpRewards.ACHIEVEMENT_UNLOCK} XP</p>
                    </div>
                </div>
            )}

            {/* Level Up Modal */}
            {showLevelUp && (
                <LevelUpModal 
                    level={currentLevel}
                    onClose={() => setShowLevelUp(false)}
                />
            )}

            {/* Existing progress indicator */}
            <div className="progress-indicator">
                <CircularProgressbar
                    value={completionPercentage}
                    text={`${completedTasksCount} / ${totalTasksCount}`}
                    styles={buildStyles({
                        textColor: "#fff",
                        pathColor: "#4caf50",
                        trailColor: "#ddd",
                    })}
                />
            </div>

            {/* Task List */}
            <div className="task-list">
                {dailyTasks.map(task => (
                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <div className="task-content" onClick={() => toggleTaskComplete(task.id)}>
                            {task.text}
                        </div>
                        <div className="task-actions">
                            <button 
                                className="edit-note-btn" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTask(task);
                                    setCurrentNote(task.notes);
                                }}
                            >
                                📝
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Note Editor (for adding/editing notes) */}
            {selectedTask && (
                <div className="note-editor">
                    <h3>Edit Note for Task</h3>
                    <textarea
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                        placeholder="Write your note here..."
                    />
                    <div className="editor-actions">
                        <button 
                            className="save-note-btn" 
                            onClick={() => {
                                const updatedTasks = dailyTasks.map(task => {
                                    if (task.id === selectedTask.id) {
                                        return { ...task, notes: currentNote };
                                    }
                                    return task;
                                });
                                setDailyTasks(updatedTasks);
                                localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
                                setSelectedTask(null);
                                setCurrentNote('');
                            }}
                        >
                            Save Note
                        </button>
                        <button 
                            className="cancel-note-btn" 
                            onClick={() => {
                                setSelectedTask(null);
                                setCurrentNote('');
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Motivational Message */}
            <div className="motivational-message">
                {motivationalMessage}
            </div>
        </>
    );
};

export default DailyTasks;