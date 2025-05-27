// import React, { useState, useRef } from "react";
// import "./ConnectDotsGame.css";

// const levels = [
//   // Level 1: simple 4 dots, 2 colors
//   [
//     { id: 1, color: "red", x: 100, y: 100 },
//     { id: 2, color: "red", x: 300, y: 100 },
//     { id: 3, color: "blue", x: 100, y: 300 },
//     { id: 4, color: "blue", x: 300, y: 300 },
//   ],
//   // Level 2: 6 dots, 3 colors, more spaced
//   [
//     { id: 1, color: "green", x: 150, y: 150 },
//     { id: 2, color: "green", x: 450, y: 150 },
//     { id: 3, color: "yellow", x: 150, y: 350 },
//     { id: 4, color: "yellow", x: 450, y: 350 },
//     { id: 5, color: "red", x: 300, y: 250 },
//     { id: 6, color: "red", x: 600, y: 250 },
//   ],
//   // Level 3: 8 dots, 4 colors, some crossing lines possible
//   [
//     { id: 1, color: "red", x: 100, y: 100 },
//     { id: 2, color: "red", x: 400, y: 100 },
//     { id: 3, color: "blue", x: 100, y: 300 },
//     { id: 4, color: "blue", x: 400, y: 300 },
//     { id: 5, color: "green", x: 250, y: 200 },
//     { id: 6, color: "green", x: 550, y: 200 },
//     { id: 7, color: "yellow", x: 250, y: 350 },
//     { id: 8, color: "yellow", x: 550, y: 350 },
//   ],
//   // Level 4: 10 dots, 5 colors, more overlapping potential
//   [
//     { id: 1, color: "red", x: 100, y: 100 },
//     { id: 2, color: "red", x: 500, y: 100 },
//     { id: 3, color: "blue", x: 100, y: 300 },
//     { id: 4, color: "blue", x: 500, y: 300 },
//     { id: 5, color: "green", x: 300, y: 200 },
//     { id: 6, color: "green", x: 700, y: 200 },
//     { id: 7, color: "yellow", x: 300, y: 350 },
//     { id: 8, color: "yellow", x: 700, y: 350 },
//     { id: 9, color: "purple", x: 400, y: 450 },
//     { id: 10, color: "purple", x: 600, y: 450 },
//   ],
// ];


// const ConnectDotsGame = () => {
//   const [levelIndex, setLevelIndex] = useState(0);
//   const [lines, setLines] = useState([]);
//   const [activeDot, setActiveDot] = useState(null);
//   const [completedColors, setCompletedColors] = useState([]);
//   const svgRef = useRef();

//   const currentDots = levels[levelIndex];

//   const handleMouseDown = (dot) => {
//     if (completedColors.includes(dot.color)) return;
//     setActiveDot(dot);
//   };

//   const handleMouseUp = (dot) => {
//     if (
//       activeDot &&
//       activeDot.color === dot.color &&
//       activeDot.id !== dot.id &&
//       !completedColors.includes(dot.color)
//     ) {
//       const newLine = { from: activeDot, to: dot, color: dot.color };

//       const doesCross = lines.some((line) =>
//         linesCross(newLine.from, newLine.to, line.from, line.to)
//       );
//       if (!doesCross) {
//         setLines([...lines, newLine]);
//         setCompletedColors([...completedColors, dot.color]);
//       }
//     }
//     setActiveDot(null);
//   };

//   const linesCross = (a1, a2, b1, b2) => {
//     const ccw = (p1, p2, p3) =>
//       (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
//     return (
//       ccw(a1, b1, b2) !== ccw(a2, b1, b2) &&
//       ccw(a1, a2, b1) !== ccw(a1, a2, b2)
//     );
//   };

//   const restartLevel = () => {
//     setLines([]);
//     setCompletedColors([]);
//     setActiveDot(null);
//   };

//   const goNextLevel = () => {
//     if (levelIndex < levels.length - 1) {
//       setLevelIndex(levelIndex + 1);
//       restartLevel();
//     }
//   };

//   const goPrevLevel = () => {
//     if (levelIndex > 0) {
//       setLevelIndex(levelIndex - 1);
//       restartLevel();
//     }
//   };

//   return (
//     <div className="connect-dots-container">
//       <h2>Level {levelIndex + 1}</h2>

//       <svg ref={svgRef} className="lines-layer">
//         {lines.map((line, i) => (
//           <line
//             key={i}
//             x1={line.from.x}
//             y1={line.from.y}
//             x2={line.to.x}
//             y2={line.to.y}
//             stroke={line.color}
//             strokeWidth="6"
//             strokeLinecap="round"
//           />
//         ))}
//       </svg>

//       {currentDots.map((dot) => (
//         <div
//           key={dot.id}
//           className="dot"
//           style={{ left: dot.x, top: dot.y, backgroundColor: dot.color }}
//           onMouseDown={() => handleMouseDown(dot)}
//           onMouseUp={() => handleMouseUp(dot)}
//           onTouchStart={() => handleMouseDown(dot)}
//           onTouchEnd={() => handleMouseUp(dot)}
//         />
//       ))}

//       <div className="controls">
//         <button onClick={goPrevLevel} disabled={levelIndex === 0}>
//           Previous Level
//         </button>
//         <button onClick={restartLevel}>Restart Level</button>
//         <button onClick={goNextLevel} disabled={levelIndex === levels.length - 1}>
//           Next Level
//         </button>

//         {completedColors.length === currentDots.length / 2 && (
//           <p>✅ Level Complete! Great job!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConnectDotsGame;


import React, { useState, useEffect } from "react";
import "./ConnectDotsGame.css"; // Importing CSS

function doLinesIntersect(p1, q1, p2, q2) {
  const orientation = (p, q, r) => {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0;
    return val > 0 ? 1 : 2;
  };

  const onSegment = (p, q, r) => {
    return (
      q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)
    );
  };

  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;

  return false;
}

const levels = [
  {
    dots: [
      { id: 1, x: 50, y: 50, color: "red" },
      { id: 2, x: 150, y: 50, color: "red" },
      { id: 3, x: 100, y: 150, color: "red" },
      { id: 4, x: 250, y: 100, color: "blue" },
      { id: 5, x: 350, y: 50, color: "blue" },
      { id: 6, x: 350, y: 150, color: "blue" },
    ],
    connections: [[1, 2], [2, 3], [3, 1], [4, 5], [5, 6], [6, 4]],
  },
  {
    dots: [
      { id: 1, x: 50, y: 50, color: "green" },
      { id: 2, x: 150, y: 40, color: "green" },
      { id: 3, x: 180, y: 90, color: "green" },
      { id: 4, x: 150, y: 160, color: "green" },
      { id: 5, x: 70, y: 150, color: "green" },
      { id: 6, x: 300, y: 70, color: "orange" },
      { id: 7, x: 350, y: 120, color: "orange" },
      { id: 8, x: 320, y: 180, color: "orange" },
    ],
    connections: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [6, 7], [7, 8], [8, 6]],
  },
  {
    dots: [
      { id: 1, x: 100, y: 50, color: "purple" },
      { id: 2, x: 200, y: 50, color: "purple" },
      { id: 3, x: 150, y: 120, color: "purple" },
      { id: 4, x: 250, y: 180, color: "yellow" },
      { id: 5, x: 300, y: 100, color: "yellow" },
      { id: 6, x: 350, y: 180, color: "yellow" },
    ],
    connections: [[1, 2], [2, 3], [3, 1], [4, 5], [5, 6], [6, 4]],
  },
  {
    dots: [
      { id: 1, x: 60, y: 50, color: "pink" },
      { id: 2, x: 140, y: 50, color: "pink" },
      { id: 3, x: 100, y: 100, color: "pink" },
      { id: 4, x: 100, y: 180, color: "cyan" },
      { id: 5, x: 180, y: 180, color: "cyan" },
      { id: 6, x: 140, y: 130, color: "cyan" },
    ],
    connections: [[1, 2], [2, 3], [3, 1], [4, 5], [5, 6], [6, 4]],
  },
];

const ConnectDotsGame = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [connectionsMade, setConnectionsMade] = useState([]);
  const [lastSelectedDot, setLastSelectedDot] = useState(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const currentLevel = levels[currentLevelIndex];
  const getDotById = (id) => currentLevel.dots.find((dot) => dot.id === id);

  const canConnect = (startId, endId) => {
    if (startId === endId) return false;
    const startDot = getDotById(startId);
    const endDot = getDotById(endId);
    if (!startDot || !endDot || startDot.color !== endDot.color) return false;

    const allowed = currentLevel.connections.some(
      ([a, b]) =>
        (a === startId && b === endId) || (a === endId && b === startId)
    );
    const exists = connectionsMade.some(
      ([a, b]) =>
        (a === startId && b === endId) || (a === endId && b === startId)
    );
    if (!allowed || exists) return false;

    const newLine = { p1: { x: startDot.x, y: startDot.y }, q1: { x: endDot.x, y: endDot.y } };
    for (const [a, b] of connectionsMade) {
      if ([a, b].includes(startId) || [a, b].includes(endId)) continue;
      const dotA = getDotById(a), dotB = getDotById(b);
      const existingLine = { p2: { x: dotA.x, y: dotA.y }, q2: { x: dotB.x, y: dotB.y } };
      if (doLinesIntersect(newLine.p1, newLine.q1, existingLine.p2, existingLine.q2)) return false;
    }
    return true;
  };

  const handleDotClick = (dotId) => {
    if (isLevelComplete) return;
    if (lastSelectedDot === null) {
      setLastSelectedDot(dotId);
    } else {
      if (canConnect(lastSelectedDot, dotId)) {
        setConnectionsMade((prev) => [...prev, [lastSelectedDot, dotId]]);
      }
      setLastSelectedDot(dotId);
    }
  };

  useEffect(() => {
    const sortedMade = connectionsMade.map((conn) => conn.slice().sort((a, b) => a - b));
    const sortedRequired = currentLevel.connections.map((conn) => conn.slice().sort((a, b) => a - b));
    const completed = sortedRequired.every((reqConn) =>
      sortedMade.some((madeConn) => madeConn[0] === reqConn[0] && madeConn[1] === reqConn[1])
    );
    setIsLevelComplete(completed);
  }, [connectionsMade, currentLevel]);

  return (
    <div className="connect-dots-container">
      <h2>Connect the Dots - Level {currentLevelIndex + 1}</h2>
      <svg className="game-board" width={400} height={300}>
        {connectionsMade.map(([startId, endId], idx) => {
          const startDot = getDotById(startId);
          const endDot = getDotById(endId);
          return (
            <line
              key={idx}
              x1={startDot.x}
              y1={startDot.y}
              x2={endDot.x}
              y2={endDot.y}
              stroke={startDot.color}
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
        {currentLevel.dots.map((dot) => (
          <circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r={15}
            fill={dot.id === lastSelectedDot ? dot.color : "#ddd"}
            stroke={dot.color}
            strokeWidth={3}
            className="dot"
            onClick={() => handleDotClick(dot.id)}
          />
        ))}
      </svg>
      {isLevelComplete && currentLevelIndex < levels.length - 1 && (
        <button className="next-button" onClick={() => {
          setCurrentLevelIndex((prev) => prev + 1);
          setConnectionsMade([]);
          setLastSelectedDot(null);
          setIsLevelComplete(false);
        }}>
          Next Level
        </button>
      )}
      {isLevelComplete && currentLevelIndex === levels.length - 1 && (
        <p className="congrats-text">🎉 Congratulations! You completed all levels.</p>
      )}
    </div>
  );
};

export default ConnectDotsGame;
