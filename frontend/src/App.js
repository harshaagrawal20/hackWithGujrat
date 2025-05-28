import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Garden from "./components/games/Garden";
import "./App.css";
import ConnectDotsGame from "./components/games/ConnectDotsGame";
import PetPlayground from "./components/games/PetPlayground";
import MoodTracker from "./components/MoodTracker/MoodTracker";

// Landing/Home Page Component
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="games">
        <button onClick={() => navigate("/garden")}>
          Relaxing Garden
        </button>
        <button onClick={() => navigate("/dotgame")}>
          Connect the dots
        </button>
        <button onClick={() => navigate("/pets")}>
          Pet Playground
        </button>
        <button onClick={() => navigate("/mood")}>
          Mood Tracker
        </button>
      </div>
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/dotgame" element={<ConnectDotsGame />} />
        <Route path="/pets" element={<PetPlayground />} />
        <Route path="/mood" element={<MoodTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
