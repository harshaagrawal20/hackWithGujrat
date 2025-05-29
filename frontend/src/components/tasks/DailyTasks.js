import React, { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import { FaSun, FaMoon, FaBook, FaPlus, FaTrash, FaRedo } from 'react-icons/fa';

// Motivational Quotes
const QUOTES = [
  "Every day is a fresh start. 🌱",
  "Small steps every day lead to big changes.",
  "You are stronger than you think.",
  "Be gentle with yourself. You’re doing your best.",
  "Progress, not perfection.",
  "You can’t pour from an empty cup. Take care of yourself first.",
  "Celebrate every tiny victory!",
  "Your mind is a garden. Nurture it.",
  "You matter. Your feelings matter.",
  "Kindness to yourself is never wasted.",
];

// Default Tasks
const DEFAULT_TASKS = [
  "Gratitude Letter – Write a heartfelt note to someone you appreciate.",
  "Nature Mindfulness – Take a mindful walk outdoors. Notice 5 things you can see, hear, and smell.",
  "Declutter One Spot – Organize a drawer, your desktop, or your phone’s home screen.",
  "Music Therapy – Listen to a song that lifts your mood, or create a feel-good playlist.",
  "Random Kindness – Compliment a colleague, friend, or stranger today.",
  "Mindful Breathing – Practice 5 minutes of slow, deep breathing.",
  "Digital Detox – Take a 2-hour break from all screens.",
  "Creative Burst – Doodle, write a poem, or craft something for 20 minutes.",
  "Connect & Share – Call or text a friend and share something positive.",
  "Reflect & Journal – Write about what made you smile today.",
];

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const LOCAL_KEYS = {
  tasks: 'mh_tasks',
  completed: 'mh_completed',
  journal: 'mh_journal',
  xp: 'mh_xp',
  level: 'mh_level',
  streak: 'mh_streak',
  dark: 'mh_dark',
  today: 'mh_today'
};

const getStored = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const DailyTasks = () => {
  // --- State ---
  const [tasks, setTasks] = useState(() => getStored(LOCAL_KEYS.tasks, DEFAULT_TASKS));
  const [completedTasks, setCompletedTasks] = useState(() => getStored(LOCAL_KEYS.completed, []));
  const [xp, setXP] = useState(() => getStored(LOCAL_KEYS.xp, 0));
  const [level, setLevel] = useState(() => getStored(LOCAL_KEYS.level, 1));
  const [streak, setStreak] = useState(() => getStored(LOCAL_KEYS.streak, 0));
  const [darkMode, setDarkMode] = useState(() => getStored(LOCAL_KEYS.dark, false));
  const [showJournal, setShowJournal] = useState(false);
  const [journalEntries, setJournalEntries] = useState(() => getStored(LOCAL_KEYS.journal, []));
  const [journalInput, setJournalInput] = useState('');
  const [newTask, setNewTask] = useState('');
  const [quote, setQuote] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const journalRef = useRef(null);

  const [play] = useSound('/sounds/celebration.mp3', { volume: 0.5 });

  // --- Load quote on mount ---
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // --- Persist state ---
  useEffect(() => setStored(LOCAL_KEYS.tasks, tasks), [tasks]);
  useEffect(() => setStored(LOCAL_KEYS.completed, completedTasks), [completedTasks]);
  useEffect(() => setStored(LOCAL_KEYS.xp, xp), [xp]);
  useEffect(() => setStored(LOCAL_KEYS.level, level), [level]);
  useEffect(() => setStored(LOCAL_KEYS.streak, streak), [streak]);
  useEffect(() => setStored(LOCAL_KEYS.dark, darkMode), [darkMode]);
  useEffect(() => setStored(LOCAL_KEYS.journal, journalEntries), [journalEntries]);

  // --- Level up logic ---
  useEffect(() => {
    const newLevel = Math.floor(xp / 50) + 1;
    if (newLevel !== level) setLevel(newLevel);
  }, [xp, level]);

  // --- Dark mode body class toggle ---
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkMode]);

  // --- Scroll to bottom of journal when new entry added ---
  useEffect(() => {
    if (journalRef.current) {
      journalRef.current.scrollTop = journalRef.current.scrollHeight;
    }
  }, [journalEntries]);

  // --- Daily reset at midnight ---
  useEffect(() => {
    const todayKey = getTodayKey();
    const lastDay = getStored(LOCAL_KEYS.today, todayKey);
    if (lastDay !== todayKey) {
      setCompletedTasks([]);
      setStored(LOCAL_KEYS.completed, []);
      setStreak(0);
      setStored(LOCAL_KEYS.streak, 0);
      setStored(LOCAL_KEYS.today, todayKey);
    }
    // Set up timer to reset at next midnight
    const now = new Date();
    const msToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1) - now;
    const timer = setTimeout(() => {
      setCompletedTasks([]);
      setStreak(0);
      setStored(LOCAL_KEYS.completed, []);
      setStored(LOCAL_KEYS.streak, 0);
      setStored(LOCAL_KEYS.today, getTodayKey());
    }, msToMidnight);
    return () => clearTimeout(timer);
  }, []);

  // --- Confetti when all tasks complete ---
  useEffect(() => {
    if (tasks.length > 0 && completedTasks.length === tasks.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2200);
    }
  }, [completedTasks, tasks.length]);

  // --- Handlers ---
  const toggleComplete = (index) => {
    const alreadyCompleted = completedTasks.includes(index);
    let updatedCompleted;
    if (alreadyCompleted) {
      updatedCompleted = completedTasks.filter((i) => i !== index);
      setXP((xp) => Math.max(0, xp - 10));
      setStreak((streak) => Math.max(0, streak - 1));
    } else {
      updatedCompleted = [...completedTasks, index];
      setXP((xp) => xp + 10);
      setStreak((streak) => streak + 1);
      play();
    }
    setCompletedTasks(updatedCompleted);
  };

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (journalInput.trim() !== '') {
      setJournalEntries([...journalEntries, journalInput.trim()]);
      setJournalInput('');
    }
  };

  const handleTaskAdd = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleTaskRemove = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    setCompletedTasks(completedTasks.filter((i) => i !== index && i < tasks.length - 1 ? i : i - 1));
  };

  const handleReset = () => {
    setCompletedTasks([]);
    setStreak(0);
    setStored(LOCAL_KEYS.completed, []);
    setStored(LOCAL_KEYS.streak, 0);
  };

  // --- Progress ---
  const progress = tasks.length === 0 ? 0 : (completedTasks.length / tasks.length) * 100;

  // --- CSS Styles ---
  // You can place this in a CSS/SCSS file, or use styled-components, but for demo, it's in a <style> tag below.

  return (
    <>
      {/* --- Custom Styles --- */}
      <style>{`
:root {
  --primary-color: #ff6f91;
  --secondary-color: #00b894;
  --bg-gradient-start: #fac8f6;
  --bg-gradient-end: #fff0fc;
  --circle-incomplete: #ff6f91;
  --circle-complete: #00b894;
  --text-light: #999;
  --card-bg: #fff;
  --hover-color: #ffd1dc;
  --text-color: #333;
  --scrollbar-bg: #fac8f6;
  --scrollbar-thumb: #ff6f91;
}
html, body {
  min-height: 100vh;
  height: auto;
  overflow-y: auto !important;
}
body {
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to top, var(--bg-gradient-start), var(--bg-gradient-end));
  margin: 0;
  padding: 0;
  color: var(--text-color);
}
.confetti {
  pointer-events: none;
  position: fixed;
  left: 0; top: 0; width: 100vw; height: 100vh;
  z-index: 9999;
  animation: confetti-fade 2s;
}
@keyframes confetti-fade {
  0% { opacity: 1;}
  80% { opacity: 1;}
  100% { opacity: 0;}
}
.confetti span {
  position: absolute;
  font-size: 2.3rem;
  animation: confetti-fall 1.8s cubic-bezier(.5,.5,.2,1.1) forwards;
}
@keyframes confetti-fall {
  0% { transform: translateY(-60px) scale(1) rotate(0); opacity: 1;}
  80% { opacity: 1;}
  100% { transform: translateY(95vh) scale(1.2) rotate(360deg); opacity: 0.6;}
}
.progress-bar-bg {
  background: #ffe3ef;
  border-radius: 12px;
  height: 18px;
  width: 100%;
  margin-bottom: 1.2rem;
  overflow: hidden;
  box-shadow: 0 2px 8px #ff6f9122;
}
.progress-bar {
  background: linear-gradient(90deg, #ff6f91, #00b894);
  height: 100%;
  border-radius: 12px;
  transition: width 0.6s cubic-bezier(.7,.2,.2,1.1);
}
.quote {
  font-size: 1.1rem;
  font-weight: 600;
  color: #00b894;
  margin-bottom: 1.2rem;
  text-align: center;
  letter-spacing: 0.02em;
  background: #fff6f8;
  border-radius: 10px;
  padding: 0.7em 1.2em;
  box-shadow: 0 2px 8px #ff6f9122;
}
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 420px;
  overflow-y: auto;
  border-radius: 24px;
  background: var(--card-bg);
  box-shadow: 0 10px 32px rgba(255, 111, 145, 0.22);
  padding: 16px 0;
  margin-bottom: 1.5rem;
  border: 1.5px solid #ffe3ef;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-bg);
  position: relative;
}
.task-list::-webkit-scrollbar {
  width: 12px;
}
.task-list::-webkit-scrollbar-track {
  background: var(--scrollbar-bg);
  border-radius: 12px;
}
.task-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ff6f91 30%, #ffd1dc 100%);
  border-radius: 12px;
  border: 2px solid #fff0fc;
}
.task-list::-webkit-scrollbar-thumb:hover {
  background: #e55e7f;
}
.task-list::after {
  content: "";
  display: block;
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 24px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, #fff0fc 80%);
  border-radius: 0 0 24px 24px;
  z-index: 1;
}
.task-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 28px;
  margin: 10px 24px;
  border-radius: 28px;
  background: var(--card-bg);
  box-shadow: 0 5px 15px rgba(255, 111, 145, 0.12);
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1), box-shadow 0.18s;
  font-size: 1.1rem;
  user-select: none;
  position: relative;
}
.task-item:hover {
  transform: translateY(-6px) scale(1.025);
  box-shadow: 0 16px 36px rgba(255, 111, 145, 0.25);
  background: var(--hover-color);
  color: var(--text-color);
}
.task-item.completed {
  opacity: 0.7;
  text-decoration: line-through;
  color: var(--text-light);
  background: #d6f7f1;
  box-shadow: 0 5px 20px rgba(0, 184, 148, 0.18);
  transform: none;
}
.task-item.completed:hover {
  background: #cdf0e9;
  box-shadow: 0 10px 25px rgba(0, 184, 148, 0.35);
}
.circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  transition: background-color 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  flex-shrink: 0;
}
.circle.incomplete {
  background-color: var(--circle-incomplete);
  box-shadow: 0 0 20px var(--circle-incomplete);
  animation: pulseIn 3s ease-in-out infinite;
}
.circle.complete {
  background-color: var(--circle-complete);
  box-shadow: 0 0 26px var(--circle-complete);
  animation: pulseOut 3s ease-in-out infinite;
}
@keyframes pulseIn {
  0%, 100% {
    box-shadow: 0 0 20px var(--circle-incomplete);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px var(--circle-incomplete);
    transform: scale(1.15);
  }
}
@keyframes pulseOut {
  0%, 100% {
    box-shadow: 0 0 26px var(--circle-complete);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 38px var(--circle-complete);
    transform: scale(1.2);
  }
}
.task-text {
  flex-grow: 1;
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.checkmark {
  color: var(--secondary-color);
  font-weight: 700;
  font-size: 1.5rem;
  user-select: none;
  transition: transform 0.4s ease;
  margin-left: 0.2em;
  position: relative;
}
.task-item.completed .checkmark {
  transform: scale(1.3);
}
.task-item.completed .checkmark::after {
  content: " 🎉";
  font-size: 1.2em;
  margin-left: 0.2em;
  animation: confetti 0.5s;
}
@keyframes confetti {
  0% { opacity: 0; transform: scale(0.5) rotate(-20deg);}
  80% { opacity: 1; transform: scale(1.2) rotate(12deg);}
  100% { opacity: 1; transform: scale(1) rotate(0);}
}
.remove-btn {
  background: transparent;
  border: none;
  color: #ff6f91;
  font-size: 1.1em;
  margin-left: 0.6em;
  cursor: pointer;
  opacity: 0.7;
  transition: color 0.2s, opacity 0.2s;
}
.remove-btn:hover {
  color: #e55e7f;
  opacity: 1;
}
.add-task-form {
  display: flex;
  gap: 0.5rem;
  margin: 0 0 1.3rem 0;
  width: 100%;
  max-width: 520px;
}
.add-task-input {
  flex: 1;
  border-radius: 8px;
  border: 1.5px solid #ffd1dc;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  background: #fff0fc;
  color: #333;
  outline: none;
  transition: border 0.2s;
}
.add-task-input:focus {
  border: 1.5px solid var(--primary-color);
}
.add-task-btn {
  background: var(--primary-color);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4em;
}
.add-task-btn:hover {
  background: #e55e7f;
}
.mt-6 {
  margin-top: 1.5rem;
}
.max-h-48 {
  max-height: 14rem;
  overflow-y: auto;
  padding-right: 10px;
  border-radius: 14px;
  background: #fff6f8;
  box-shadow: 0 12px 25px rgba(255, 111, 145, 0.15);
  padding: 18px;
  font-size: 1rem;
  font-weight: 500;
  color: #555;
  line-height: 1.6;
  position: relative;
}
.max-h-48::after {
  content: "";
  display: block;
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 18px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, #fff6f8 90%);
  border-radius: 0 0 14px 14px;
}
.journal-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.journal-input {
  flex: 1;
  border-radius: 8px;
  border: 1.5px solid #ffd1dc;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  background: #fff0fc;
  color: #333;
  outline: none;
  transition: border 0.2s;
}
.journal-input:focus {
  border: 1.5px solid var(--primary-color);
}
.journal-btn {
  background: var(--primary-color);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  transition: background 0.2s;
}
.journal-btn:hover {
  background: #e55e7f;
}
.reset-btn {
  background: #fff0fc;
  color: #ff6f91;
  border: none;
  border-radius: 7px;
  margin-left: 1em;
  font-size: 1.1em;
  padding: 0.3em 0.8em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
}
.reset-btn:hover {
  background: #ffd1dc;
  color: #e55e7f;
}
@media (max-width: 600px) {
  .task-list, .max-h-48 {
    margin: 0;
    border-radius: 12px;
    padding: 10px 0;
    font-size: 1rem;
  }
  .task-item {
    margin: 8px 8px;
    padding: 13px 16px;
    border-radius: 14px;
    font-size: 1rem;
  }
  .add-task-form {
    max-width: 100vw;
  }
}
.dark .task-list {
  background: #2c3440;
  box-shadow: 0 10px 25px rgba(0, 184, 148, 0.4);
  border-color: #2c3440;
}
.dark .task-item {
  background: #394452;
  box-shadow: 0 5px 15px rgba(0, 184, 148, 0.25);
  color: #cbd5e0;
}
.dark .task-item:hover {
  background: #2c3e50;
  box-shadow: 0 10px 25px rgba(0, 184, 148, 0.6);
}
.dark .task-item.completed {
  background: #1f4d3a;
  color: #94d2bd;
  box-shadow: 0 6px 18px rgba(0, 184, 148, 0.5);
}
.dark .circle.incomplete {
  background-color: #f29ea6;
  box-shadow: 0 0 22px #f29ea6;
}
.dark .circle.complete {
  background-color: #4fd1c5;
  box-shadow: 0 0 28px #4fd1c5;
}
.dark .max-h-48 {
  background: #234e52;
  color: #b2f7ef;
  box-shadow: 0 12px 25px rgba(79, 209, 197, 0.4);
}
.dark .journal-input, .dark .add-task-input {
  background: #2c3440;
  color: #b2f7ef;
  border-color: #4fd1c5;
}
.dark .journal-btn, .dark .add-task-btn {
  background: #4fd1c5;
  color: #234e52;
}
.dark .reset-btn {
  background: #2c3440;
  color: #4fd1c5;
}
.dark .reset-btn:hover {
  background: #234e52;
  color: #ffd6e8;
}
      `}</style>

      {/* --- Confetti Animation --- */}
      {showConfetti && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.7}s`,
              }}
            >
              {['🎉','✨','💖','🌈','🎊','🥳'][Math.floor(Math.random()*6)]}
            </span>
          ))}
        </div>
      )}

      {/* --- Main Layout --- */}
      <div
        style={{
          minHeight: '100vh',
          background: darkMode
            ? 'linear-gradient(to top, #234e52, #2c3440)'
            : 'linear-gradient(to top, #fac8f6, #fff0fc)',
          padding: '3rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: "'Poppins', sans-serif",
          color: darkMode ? '#cbd5e0' : '#333',
          transition: 'background 0.5s',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <h1 style={{ fontWeight: '700', fontSize: '2rem', margin: 0 }}>
            Daily Mental Health Tasks
          </h1>
          <button
            aria-label="Toggle Dark Mode"
            onClick={() => setDarkMode((d) => !d)}
            style={{
              background: 'transparent',
              color: darkMode ? '#ffd6e8' : '#ff6f91',
              fontSize: '1.8rem',
            }}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button
            aria-label="Toggle Journal"
            onClick={() => setShowJournal((show) => !show)}
            style={{
              background: 'transparent',
              color: darkMode ? '#94d2bd' : '#00b894',
              fontSize: '1.6rem',
            }}
          >
            <FaBook />
          </button>
        </header>

        {/* --- Motivational Quote --- */}
        <div className="quote" aria-live="polite">{quote}</div>

        {/* --- Progress Bar --- */}
        <div className="progress-bar-bg" style={{ width: '100%', maxWidth: 520 }}>
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              minWidth: progress > 0 && progress < 10 ? '10%' : undefined,
            }}
            aria-valuenow={progress}
            aria-valuemax={100}
            aria-valuemin={0}
            role="progressbar"
          ></div>
        </div>

        {/* --- Add Task Form --- */}
        <form className="add-task-form" onSubmit={handleTaskAdd} aria-label="Add custom task">
          <input
            className="add-task-input"
            type="text"
            placeholder="Add your own daily task…"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            aria-label="Custom task input"
          />
          <button className="add-task-btn" type="submit" aria-label="Add task">
            <FaPlus /> Add
          </button>
        </form>

        {/* --- Task List --- */}
        <ul className="task-list" aria-label="Daily Tasks List">
          {tasks.map((task, i) => {
            const completed = completedTasks.includes(i);
            const isCustom = i >= DEFAULT_TASKS.length;
            return (
              <li
                key={i}
                className={`task-item ${completed ? 'completed' : ''}`}
                onClick={() => toggleComplete(i)}
                role="checkbox"
                aria-checked={completed}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleComplete(i);
                }}
              >
                <span
                  className={`circle ${completed ? 'complete' : 'incomplete'}`}
                  aria-hidden="true"
                ></span>
                <span className="task-text">{task}</span>
                {completed && <span className="checkmark">✔</span>}
                {isCustom && (
                  <button
                    className="remove-btn"
                    aria-label="Remove custom task"
                    onClick={e => {
                      e.stopPropagation();
                      handleTaskRemove(i);
                    }}
                    tabIndex={0}
                  >
                    <FaTrash />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {/* --- XP, Level, Streak, Reset --- */}
        <div
          style={{
            marginTop: '2rem',
            fontWeight: '600',
            fontSize: '1.25rem',
            letterSpacing: '0.05em',
            color: darkMode ? '#ffd6e8' : '#ff6f91',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          XP: {xp} &nbsp;|&nbsp; Level: {level} &nbsp;|&nbsp; Streak: {streak}
          <button className="reset-btn" onClick={handleReset} title="Reset today's tasks">
            <FaRedo /> Reset
          </button>
        </div>

        {/* --- Journal Section --- */}
        {showJournal && (
          <section
            className="max-h-48 mt-6"
            aria-label="Journal Entries"
            tabIndex={-1}
            ref={journalRef}
            style={{ width: '100%', maxWidth: 520 }}
          >
            {journalEntries.length === 0 ? (
              <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
                No journal entries yet. Write reflections after completing tasks!
              </p>
            ) : (
              journalEntries.map((entry, idx) => (
                <p key={idx} style={{ marginBottom: '0.8rem' }}>
                  {entry}
                </p>
              ))
            )}
            {/* --- Journal Input Form --- */}
            <form className="journal-form" onSubmit={handleJournalSubmit}>
              <input
                className="journal-input"
                type="text"
                placeholder="Write a reflection and press Enter..."
                value={journalInput}
                onChange={(e) => setJournalInput(e.target.value)}
                aria-label="Add journal entry"
              />
              <button className="journal-btn" type="submit">
                Add
              </button>
            </form>
          </section>
        )}
      </div>
    </>
  );
};

export default DailyTasks;
