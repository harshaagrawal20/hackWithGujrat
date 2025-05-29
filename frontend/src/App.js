import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';

import './App.css';
import MoodTracker from './components/MoodTracker/MoodTracker';
import Garden from './components/games/Garden';
import ConnectDotsGame from './components/games/ConnectDotsGame';
import PetPlayground from './components/games/PetPlayground';
import DailyTasks from './components/tasks/DailyTasks';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

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

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showGamesMenu, setShowGamesMenu] = useState(false);
  const [moodStats, setMoodStats] = useState({});
  const chartIntervalRef = useRef(null);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [taskDate, setTaskDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowGamesMenu(false);
  };

  const toggleGamesMenu = () => {
    setShowGamesMenu(!showGamesMenu);
  };

  const fetchMoodStats = async () => {
      try {
          const response = await fetch('http://127.0.0.1:5000/mood_stats');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setMoodStats(data);
      } catch (err) {
          console.error("Error fetching mood stats:", err);
      }
  };

  useEffect(() => {
      if (currentPage === 'dashboard') {
          fetchMoodStats();
          chartIntervalRef.current = setInterval(fetchMoodStats, 10000);
      }

      return () => {
          if (chartIntervalRef.current) {
              clearInterval(chartIntervalRef.current);
          }
      };
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'mood':
        return <MoodTracker />;
      case 'garden':
        return <Garden />;
      case 'dotgame':
        return <ConnectDotsGame />;
      case 'pets':
        return <PetPlayground />;
      case 'tasks':
        return (
          <section className="dashboard-card tasks-section">
            <h3><i className="fas fa-tasks"></i> Daily Tasks</h3>
            <DailyTasks />
          </section>
        );
      default:
        return (
          <>
            {/* Profile Section */}
            <section className="profile-section">
              <div className="profile-card">
                <img src="https://via.placeholder.com/80" alt="Profile" className="avatar" />
                <div className="profile-info">
                  <h2>Sarah Johnson</h2>
                  <p className="mood">Current Mood: <span className="mood-emoji">😊</span> Happy</p>
                  <div className="quick-stats">
                    <div className="stat">
                      <span className="stat-value">7</span>
                      <span className="stat-label">Day Streak</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">85%</span>
                      <span className="stat-label">Weekly Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Journal Section */}
              <section className="dashboard-card journal-section">
                <h3><i className="fas fa-book"></i> Daily Journal</h3>
                <div className="journal-input">
                  <input type="date" className="date-picker" />
                  <textarea placeholder="How are you feeling today?"></textarea>
                  <button className="btn-primary">Save Entry</button>
                </div>
              </section>

              {/* Mood Tracker Graph (Real-time) */}
              <section className="dashboard-card mood-tracker">
                <h3><i className="fas fa-chart-line"></i> Mood Trend (Last 24 hrs)</h3>
                 <div style={{ width: '100%', height: '250px' }}>
                    {Object.keys(moodStats).length > 0 ? (
                        <Line
                            data={{
                                labels: Object.keys(moodStats),
                                datasets: [
                                    {
                                        label: 'Emotion Count',
                                        data: Object.values(moodStats),
                                        backgroundColor: 'rgba(108, 99, 255, 0.6)',
                                        borderColor: 'rgba(108, 99, 255, 1)',
                                        borderWidth: 1,
                                        fill: false,
                                        tension: 0.1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Number of Entries',
                                        },
                                        ticks: { allowDecimals: false }
                                    },
                                    x:{
                                        title: {
                                            display: true,
                                            text: 'Emotion',
                                        },
                                    }
                                },
                            }}
                        />
                    ) : (
                        <p>No mood data available for the last 24 hours.</p>
                    )}
                </div>
                 <button className="btn-primary" onClick={() => setCurrentPage('mood')}>View Full Tracker</button>
              </section>

              {/* Chatbot Interface */}
              <section className="dashboard-card chatbot-section">
                <h3><i className="fas fa-robot"></i> Chat with Mindy</h3>
                <div className="chat-container">
                  <div className="chat-messages">
                    <div className="message bot">
                      Hello! How can I help you today?
                    </div>
                  </div>
                  <div className="chat-input">
                    <input type="text" placeholder="Type your message" />
                    <button className="btn-send"><i className="fas fa-paper-plane"></i></button>
                  </div>
                </div>
              </section>

              {/* Games Section */}
              <section className="dashboard-card games-section">
                <h3><i className="fas fa-gamepad"></i> Mental Health Games</h3>
                <div className="games-grid">
                  <div className="game-card" onClick={() => setCurrentPage('garden')}>
                    <i className="fas fa-seedling"></i>
                    <span>Relaxing Garden</span>
                  </div>
                  <div className="game-card" onClick={() => setCurrentPage('dotgame')}>
                    <i className="fas fa-puzzle-piece"></i>
                    <span>Connect the Dots</span>
                  </div>
                  <div className="game-card" onClick={() => setCurrentPage('pets')}>
                    <i className="fas fa-paw"></i>
                    <span>Pet Playground</span>
                  </div>
                </div>
              </section>

              {/* Daily Tasks (Rendered only on dashboard here) */}
              <section className="dashboard-card tasks-section">
                <h3><i className="fas fa-tasks"></i> Daily Tasks</h3>
                <DailyTasks />
              </section>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="logo">
          <i className="fas fa-brain"></i>
          <span>MindSpace</span>
        </div>
        <ul className="nav-links">
          <li 
            className={currentPage === 'dashboard' ? 'active' : ''} 
            onClick={() => navigateTo('dashboard')}
          >
            <i className="fas fa-home"></i> Dashboard
          </li>
          <li><i className="fas fa-book"></i> Journal</li>
          <li 
            className={currentPage === 'mood' ? 'active' : ''} 
            onClick={() => navigateTo('mood')}
          >
            <i className="fas fa-chart-line"></i> Mood Tracker
          </li>
          <li 
            className={currentPage === 'garden' || currentPage === 'dotgame' || currentPage === 'pets' ? 'active' : ''} 
            onClick={toggleGamesMenu}
          >
            <i className="fas fa-gamepad"></i> Games
            {showGamesMenu && (
              <ul className="games-submenu">
                <li onClick={() => navigateTo('garden')}>Relaxing Garden</li>
                <li onClick={() => navigateTo('dotgame')}>Connect the Dots</li>
                <li onClick={() => navigateTo('pets')}>Pet Playground</li>
              </ul>
            )}
          </li>
          <li 
            className={currentPage === 'tasks' ? 'active' : ''}
            onClick={() => navigateTo('tasks')}
          >
            <i className="fas fa-tasks"></i> Tasks
          </li>
          <li><i className="fas fa-robot"></i> Chat</li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
