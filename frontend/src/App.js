import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement 
} from 'chart.js';

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

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showGamesMenu, setShowGamesMenu] = useState(false);
  const [moodStats, setMoodStats] = useState({});
  const chartIntervalRef = useRef(null);

  // User profile with Indian name
  const [userProfile, setUserProfile] = useState({
    name: "Chinmayee",
    currentMood: "Neutral",
    moodEmoji: "😐",
    dayStreak: 5,
    weeklyProgress: 79,
    XP: 50,
    level: "Level 3",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format"
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowGamesMenu(false);
  };

  const toggleGamesMenu = () => {
    setShowGamesMenu(!showGamesMenu);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: Clear user data, redirect to login, etc.
    // localStorage.clear();
    // window.location.href = '/login';
    alert('Logout functionality ');
  };

  const fetchMoodStats = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/mood_graph_data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const emotionCounts = {};
      const emotions = Object.keys(data).filter(key => key !== 'timestamps');
      emotions.forEach(emotion => {
        emotionCounts[emotion] = data[emotion].reduce((sum, count) => sum + count, 0);
      });
      
      setMoodStats(emotionCounts);
    } catch (err) {
      console.error("Error fetching mood stats:", err);
      setMoodStats({});
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
            {/* Compact Profile Section - Only Name, Mood, and Logout */}
            <section className="profile-section compact">
              <div className="profile-card compact">
                <div className="profile-header compact">
                  <div className="avatar-container compact">
                    <img 
                      src={userProfile.avatar} 
                      alt="Profile" 
                      className="avatar compact" 
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/60/6C63FF/FFFFFF?text=C";
                      }}
                    />
                    <div className="status-indicator online"></div>
                  </div>
                  <div className="profile-info compact">
                    <h2 className="user-name compact">{userProfile.name}</h2>
                    <p className="mood-status compact">
                      <span className="mood-emoji">{userProfile.moodEmoji}</span>
                      {userProfile.currentMood}
                    </p>
                  </div>
                  <div className="profile-actions compact">
                    <button className="btn-logout" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Progress Stats Section - NEW SEPARATE SECTION */}
              <section className="dashboard-card stats-section">
                <h3><i className="fas fa-chart-bar"></i> Your Progress</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                      <span className="stat-value">{userProfile.dayStreak}</span>
                      <span className="stat-label">Day Streak</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                      <span className="stat-value">{userProfile.weeklyProgress}%</span>
                      <span className="stat-label">Weekly Progress</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                      <span className="stat-value">{userProfile.totalSessions}</span>
                      <span className="stat-label">XP</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <span className="stat-value">{userProfile.level}</span>
                      <span className="stat-label">Achievement</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Mood Tracker Graph */}
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
                            borderWidth: 2,
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
                            ticks: { 
                              stepSize: 1,
                              callback: function(value) {
                                return Number.isInteger(value) ? value : '';
                              }
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Emotion',
                            },
                          }
                        },
                      }}
                    />
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '100%',
                      color: '#666'
                    }}>
                      <p>No mood data available for the last 24 hours.</p>
                    </div>
                  )}
                </div>
                <button className="btn-primary" onClick={() => setCurrentPage('mood')}>
                  View Full Tracker
                </button>
              </section>

              {/* Daily Tasks */}
              <section className="dashboard-card tasks-section">
                <h3><i className="fas fa-tasks"></i> Daily Tasks</h3>
                <DailyTasks />
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
