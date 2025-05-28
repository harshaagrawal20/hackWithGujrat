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
      console.error('Error fetching mood stats:', err);
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
                      }}
                    />
                  ) : (
                    <p>Loading mood data...</p>
                  )}
                </div>
              </section>
            </div>
          </>
        );
    }
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="app-title">Mental Health Companion</h1>
        <ul className="nav-links">
          <li onClick={() => navigateTo('dashboard')}>Dashboard</li>
          <li onClick={() => navigateTo('mood')}>Mood Tracker</li>
          <li onClick={() => navigateTo('tasks')}>Tasks</li>
          <li onClick={toggleGamesMenu}>Games</li>
          {showGamesMenu && (
            <ul className="dropdown-menu">
              <li onClick={() => navigateTo('garden')}>Garden</li>
              <li onClick={() => navigateTo('dotgame')}>Connect Dots</li>
              <li onClick={() => navigateTo('pets')}>Pet Playground</li>
            </ul>
          )}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
