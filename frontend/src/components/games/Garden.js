// import React from "react";
// import FlowerPot from "./FlowerPot";
// import "./Garden.css";

// const Garden = () => {
//   return (
//     <div className="garden-grid">
//       {Array(9).fill().map((_, i) => (
//         <FlowerPot key={i} />
//       ))}
//     </div>
//   );
// };

// export default Garden;


// src/components/Garden.js
import React from "react";
import FlowerPot from "./FlowerPot";
import "./Garden.css";

const Garden = () => {
  return (
    <div className="garden-container">
      <h1 className="garden-title">🌸 Relaxing Flower Garden</h1>
      {Array.from({ length: 12 }).map((_, index) => (
        <FlowerPot key={index} />
      ))}
    </div>
  );
};

export default Garden;
