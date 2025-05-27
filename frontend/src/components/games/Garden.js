import React from "react";
import FlowerPot from "./FlowerPot";
import "./Garden.css";

const Garden = () => {
  return (
    <div className="garden-grid">
      {Array(9).fill().map((_, i) => (
        <FlowerPot key={i} />
      ))}
    </div>
  );
};

export default Garden;
