import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import Garden from "./components/games/Garden";
import ConnectDotsGame from "./components/games/ConnectDotsGame";
import PetPlayground from "./components/games/PetPlayground";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Journal from "./components/journal/Journal";
// import JournalList from "./components/journal/JournalList";
// import JournalEntryView from "./components/journal/JournalView";
import MoodTracker from "./components/MoodTracker/MoodTracker";

import "./App.css";

// Home Page
function HomePage({ token, userEmail, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Therapy AI</h1>
        <div>
          {token ? (
            <>
              <span style={{ marginRight: "10px" }}>{userEmail}</span>
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/signup")}>Signup</button>
            </>
          )}
        </div>
      </nav>

      {token ? (
        <div className="games">
          <button onClick={() => navigate("/garden")}>Relaxing Garden</button>
          <button onClick={() => navigate("/dotgame")}>Connect the Dots</button>
          <button onClick={() => navigate("/pets")}>Pet Playground</button>
          <button onClick={() => navigate("/journal")}>Daily Journal</button>
          <button onClick={() => navigate("/moodtracker")}>Mood Tracker</button>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Please login to access the games and journal.
        </p>
      )}
    </div>
  );
}

// Redirect wrapper to push after login/signup
function RedirectAfterLogin({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      onLogin(token);
      navigate("/", { replace: true });
    }
  }, []);

  return null;
}

// Main App
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
      } catch {
        setUserEmail("");
      }
    } else {
      setUserEmail("");
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserEmail("");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage token={token} userEmail={userEmail} onLogout={handleLogout} />
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Login onLogin={handleLogin} />
              <RedirectAfterLogin onLogin={handleLogin} />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Signup />
              <RedirectAfterLogin onLogin={handleLogin} />
            </>
          }
        />
        <Route
          path="/garden"
          element={token ? <Garden /> : <Navigate to="/login" />}
        />
        <Route
          path="/dotgame"
          element={token ? <ConnectDotsGame /> : <Navigate to="/login" />}
        />
        <Route
          path="/pets"
          element={token ? <PetPlayground /> : <Navigate to="/login" />}
        />
        <Route
          path="/moodtracker"
          element={token ? <MoodTracker /> : <Navigate to="/login" />}
        />
        <Route
          path="/journal"
          element={
            token ? (
              <Journal token={token} userEmail={userEmail} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
