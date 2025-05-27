// import React, { useState, useRef } from "react";
// import { gsap } from "gsap";

// const FlowerPot = () => {
//   const [stage, setStage] = useState("empty"); // stages: empty -> planted -> bloomed
//   const flowerRef = useRef(null);

//   const playSound = (fileName) => {
//     const audio = new Audio(`${process.env.PUBLIC_URL}/assets/${fileName}`);
//     audio.play();
//   };

//   const handleClick = () => {
//     if (stage === "empty") {
//       setStage("planted");
//       playSound("plant.mp3");
//     } else if (stage === "planted") {
//       setStage("bloomed");
//       playSound("water.mp3");

//       // Animate blooming flower
//       gsap.fromTo(
//         flowerRef.current,
//         { scale: 0 },
//         { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-green-50">
//       <div className="w-40 h-40 bg-yellow-700 rounded-t-full"></div> {/* Pot */}
//       <div className="mt-2">
//         {stage === "bloomed" && (
//           <div
//             ref={flowerRef}
//             className="w-20 h-20 bg-pink-400 rounded-full mx-auto animate-pulse shadow-lg"
//           ></div>
//         )}
//         {stage === "planted" && (
//           <div className="w-1 h-20 bg-green-600 mx-auto mt-2 rounded-full"></div>
//         )}
//       </div>
//       <button
//         onClick={handleClick}
//         className="mt-6 px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-xl shadow-md transition"
//       >
//         {stage === "empty" ? "Plant Seed" : stage === "planted" ? "Water Plant" : "Bloomed!"}
//       </button>
//     </div>
//   );
// };

// export default FlowerPot;


import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./Garden.css";

const FlowerPot = () => {
  const [stage, setStage] = useState("empty");
  const flowerRef = useRef(null);
  const audioRef = useRef(null);

  const playSound = (fileName) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/${fileName}`);
    audioRef.current.play();
  };

  const handleClick = () => {
    if (stage === "empty") {
      setStage("planted");
      playSound("water.mp3");
    } else if (stage === "planted") {
      setStage("bloomed");
      playSound("plant.mp3");

      gsap.fromTo(
        flowerRef.current,
        { scale: 0 },
        { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
      );
    } else {
      // Stop sound if bloomed button clicked again
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="flowerpot">
      <div className="plant">
        {stage === "planted" && <div className="stem"></div>}

        {stage === "bloomed" && (
          <div className="two-flowers" ref={flowerRef}>
            {[...Array(1)].map((_, idx) => (
              <div key={idx} className="bloom">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`petal petal-${i + 1}`} />
                ))}
                <div className="flower-center"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pot"></div>

      <button className="action-btn" onClick={handleClick}>
        {stage === "empty"
          ? "Plant Seed"
          : stage === "planted"
          ? "Water Plant"
          : "Bloomed!"}
      </button>
    </div>
  );
};

export default FlowerPot;
