// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// import Garden from "./components/games/Garden";
// import ConnectDotsGame from "./components/games/ConnectDotsGame";
// import PetPlayground from "./components/games/PetPlayground";
// import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";
// import Journal from "./components/journal/Journal";
// import MoodTracker from "./components/MoodTracker/MoodTracker";
// import BackgroundScene from "./components/background/BackgroundScene";

// import "./App.css";

// // Home Page Component
// function HomePage({ token, userEmail, onLogout }) {
//   const navigate = useNavigate();

//   return (
//     <div className="App">
//       <nav className="navbar">
//         <h1>Therapy AI</h1>
//         <div>
//           {token ? (
//             <>
//               <span style={{ marginRight: "10px" }}>{userEmail}</span>
//               <button onClick={onLogout}>Logout</button>
//             </>
//           ) : (
//             <>
//               <button onClick={() => navigate("/login")}>Login</button>
//               <button onClick={() => navigate("/signup")}>Signup</button>
//             </>
//           )}
//         </div>
//       </nav>

//       {token ? (
//         <div className="games">
//           <button onClick={() => navigate("/garden")}>Relaxing Garden</button>
//           <button onClick={() => navigate("/dotgame")}>Connect the Dots</button>
//           <button onClick={() => navigate("/pets")}>Pet Playground</button>
//           <button onClick={() => navigate("/journal")}>Daily Journal</button>
//           <button onClick={() => navigate("/moodtracker")}>Mood Tracker</button>
//         </div>
//       ) : (
//         <p style={{ textAlign: "center", marginTop: "2rem" }}>
//           Please login to access the games and journal.
//         </p>
//       )}
//     </div>
//   );
// }

// // Redirect logic after login/signup
// function RedirectAfterLogin({ onLogin }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       onLogin(token);
//       navigate("/", { replace: true });
//     }
//   }, []);

//   return null;
// }

// // Main App Component
// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [userEmail, setUserEmail] = useState("");

//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUserEmail(decoded.email);
//       } catch {
//         setUserEmail("");
//         setToken(null);
//       }
//     } else {
//       setUserEmail("");
//     }
//   }, [token]);

//   const handleLogin = (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUserEmail("");
//   };

//   const requireAuth = (element) =>
//     token ? element : <Navigate to="/login" replace />;

//   return (
//     <Router>
//       <BackgroundScene />
//       <Routes>
//         <Route path="/" element={<HomePage token={token} userEmail={userEmail} onLogout={handleLogout} />} />
//         <Route path="/login" element={<Login onLogin={handleLogin} />} />
//         <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
//         <Route path="/redirect" element={<RedirectAfterLogin onLogin={handleLogin} />} />

//         {/* Protected Routes */}
//         <Route path="/journal" element={requireAuth(<Journal />)} />
//         <Route path="/moodtracker" element={requireAuth(<MoodTracker />)} />
//         <Route path="/garden" element={requireAuth(<Garden />)} />
//         <Route path="/dotgame" element={requireAuth(<ConnectDotsGame />)} />
//         <Route path="/pets" element={requireAuth(<PetPlayground />)} />

//         {/* Catch-all to redirect */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Journal from "./components/journal/Journal";
import MoodTracker from "./components/MoodTracker/MoodTracker";
import Garden from "./components/games/Garden";
import ConnectDotsGame from "./components/games/ConnectDotsGame";
import PetPlayground from "./components/games/PetPlayground";
import DailyTasks from "./components/tasks/DailyTasks";
import BackgroundScene from "./components/background/BackgroundScene";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

import "./App.css";

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

// Dashboard Home Page
function Dashboard({ onLogout, userEmail, token }) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showGamesMenu, setShowGamesMenu] = useState(false);
  const [moodStats, setMoodStats] = useState({});
  const chartIntervalRef = useRef(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowGamesMenu(false);
  };

  const fetchMoodStats = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/mood_stats");
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
    if (currentPage === "dashboard") {
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
      case "mood":
        return <MoodTracker />;
      case "garden":
        return <Garden />;
      case "dotgame":
        return <ConnectDotsGame />;
      case "pets":
        return <PetPlayground />;
      case "tasks":
        return <DailyTasks />;
      case "journal":
        return <Journal token={token} />;
      default:
        return (
          <>
            <section className="profile-section">
              <div className="profile-card">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Profile"
                  className="avatar"
                />
                <div className="profile-info">
                  <h2>{userEmail}</h2>
                  <p className="mood">
                    Current Mood: <span className="mood-emoji">😊</span> Happy
                  </p>
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

            <div className="dashboard-grid">

              <section className="dashboard-card mood-tracker">
                <h3>
                  <i className="fas fa-chart-line"></i> Mood Trend (Last 24 hrs)
                </h3>
                <div style={{ width: "100%", height: "250px" }}>
                  {Object.keys(moodStats).length > 0 ? (
                    <Line
                      data={{
                        labels: Object.keys(moodStats),
                        datasets: [
                          {
                            label: "Emotion Count",
                            data: Object.values(moodStats),
                            backgroundColor: "rgba(108, 99, 255, 0.6)",
                            borderColor: "rgba(108, 99, 255, 1)",
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
                          legend: { position: "top" },
                          title: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: "Number of Entries" },
                            ticks: { allowDecimals: false },
                          },
                          x: {
                            title: { display: true, text: "Emotion" },
                          },
                        },
                      }}
                    />
                  ) : (
                    <p>No mood data available for the last 24 hours.</p>
                  )}
                </div>
                <button className="btn-primary" onClick={() => setCurrentPage("mood")}>
                  View Full Tracker
                </button>
              </section>


              <section className="dashboard-card games-section">
                <h3>
                  <i className="fas fa-gamepad"></i> Mental Health Games
                </h3>
                <div className="games-grid">
                  <div className="game-card" onClick={() => setCurrentPage("garden")}>
                    <i className="fas fa-seedling"></i>
                    <span>Relaxing Garden</span>
                  </div>
                  <div className="game-card" onClick={() => setCurrentPage("dotgame")}>
                    <i className="fas fa-puzzle-piece"></i>
                    <span>Connect the Dots</span>
                  </div>
                  <div className="game-card" onClick={() => setCurrentPage("pets")}>
                    <i className="fas fa-paw"></i>
                    <span>Pet Playground</span>
                  </div>
                </div>
              </section>

              <section className="dashboard-card tasks-section">
                <h3>
                  <i className="fas fa-tasks"></i> Daily Tasks
                </h3>
                <DailyTasks />
              </section>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard">
      <BackgroundScene />
      <nav className="sidebar">
        <div className="logo">
          <i className="fas fa-brain"></i>
          <span>MindSpace</span>
        </div>
        <ul className="nav-links">
          <li
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => navigateTo("dashboard")}
          >
            <i className="fas fa-home"></i> Dashboard
          </li>
          <li
            className={currentPage === "mood" ? "active" : ""}
            onClick={() => navigateTo("mood")}
          >
            <i className="fas fa-chart-line"></i> Mood Tracker
          </li>
          <li
            className={currentPage === "journal" ? "active" : ""}
            onClick={() => navigateTo("journal")}
          >
            <i className="fas fa-book"></i> Journal
          </li>
          <li
            className="games-menu"
            onClick={() => setShowGamesMenu(!showGamesMenu)}
          >
            <i className="fas fa-gamepad"></i> Games{" "}
            <i className={`fas fa-chevron-${showGamesMenu ? "down" : "right"}`}></i>
          </li>
          {showGamesMenu && (
            <>
              <li
                className={currentPage === "garden" ? "active" : ""}
                onClick={() => navigateTo("garden")}
              >
                <i className="fas fa-seedling"></i> Relaxing Garden
              </li>
              <li
                className={currentPage === "dotgame" ? "active" : ""}
                onClick={() => navigateTo("dotgame")}
              >
                <i className="fas fa-puzzle-piece"></i> Connect the Dots
              </li>
              <li
                className={currentPage === "pets" ? "active" : ""}
                onClick={() => navigateTo("pets")}
              >
                <i className="fas fa-paw"></i> Pet Playground
              </li>
            </>
          )}
          <li
            className={currentPage === "tasks" ? "active" : ""}
            onClick={() => navigateTo("tasks")}
          >
            <i className="fas fa-tasks"></i> Daily Tasks
          </li>
          <li onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </li>
        </ul>
      </nav>
      <main className="content">{renderContent()}</main>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      setUserEmail(decoded.email);
    }
  }, []);

  const handleLogin = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    const decoded = jwtDecode(jwtToken);
    setUserEmail(decoded.email);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserEmail("");
  };

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return <Dashboard onLogout={handleLogout} userEmail={userEmail} token={token} />;
}

export default App;
