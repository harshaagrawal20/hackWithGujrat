// import React, { useState, useRef } from "react";
// import gsap from "gsap";
// import plantSound from "../assets/plant.mp3";
// import waterSound from "../assets/water.mp3";
// import "./FlowerPot.css";


// const FlowerPot = () => {
//   const [stage, setStage] = useState("empty"); // "empty" | "planted" | "bloomed"
//   const flowerRef = useRef(null);

//   const playSound = (src) => {
//     const audio = new Audio(src);
//     audio.play();
//   };

//   const handleClick = () => {
//     if (stage === "empty") {
//       setStage("planted");
//       playSound(plantSound);
//     } else if (stage === "planted") {
//       setStage("bloomed");
//       playSound(waterSound);
//       gsap.fromTo(flowerRef.current, { scale: 0 }, { scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" });
//     }
//   };

//   return (
//     <div className="flower-pot" onClick={handleClick}>
//       {stage === "empty" && <span>🪴</span>}
//       {stage === "planted" && <span>🌱</span>}
//       {stage === "bloomed" && <span ref={flowerRef}>🌸</span>}
//     </div>
//   );
// };

// export default FlowerPot;

import React, { useState, useRef } from "react";
import { gsap } from "gsap";

const FlowerPot = () => {
  const [stage, setStage] = useState("empty"); // stages: empty -> planted -> bloomed
  const flowerRef = useRef(null);

  const playSound = (fileName) => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/assets/${fileName}`);
    audio.play();
  };

  const handleClick = () => {
    if (stage === "empty") {
      setStage("planted");
      playSound("plant.mp3");
    } else if (stage === "planted") {
      setStage("bloomed");
      playSound("water.mp3");

      // Animate blooming flower
      gsap.fromTo(
        flowerRef.current,
        { scale: 0 },
        { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <div className="w-40 h-40 bg-yellow-700 rounded-t-full"></div> {/* Pot */}
      <div className="mt-2">
        {stage === "bloomed" && (
          <div
            ref={flowerRef}
            className="w-20 h-20 bg-pink-400 rounded-full mx-auto animate-pulse shadow-lg"
          ></div>
        )}
        {stage === "planted" && (
          <div className="w-1 h-20 bg-green-600 mx-auto mt-2 rounded-full"></div>
        )}
      </div>
      <button
        onClick={handleClick}
        className="mt-6 px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-xl shadow-md transition"
      >
        {stage === "empty" ? "Plant Seed" : stage === "planted" ? "Water Plant" : "Bloomed!"}
      </button>
    </div>
  );
};

export default FlowerPot;
