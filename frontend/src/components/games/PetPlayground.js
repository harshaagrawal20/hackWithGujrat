// import React, { useState } from "react";
// import "./PetPlayground.css";

// const petImages = {
//   dog: '/assets/dog.png',
//   cat: '/assets/cat.png',
//   parrot: '/assets/parrot.png',
// };

// const getRandomPosition = () => ({
//   x: Math.floor(Math.random() * 400) + 50,
//   y: Math.floor(Math.random() * 250) + 60,
// });

// const PetPlayground = () => {
//   const [pets, setPets] = useState([]);

//   const addPet = (type) => {
//     setPets((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         type,
//         ...getRandomPosition(),
//         mood: "happy",
//       },
//     ]);
//   };

//   const interactWithPet = (id, action) => {
//     setPets((prevPets) =>
//       prevPets.map((pet) =>
//         pet.id === id
//           ? {
//               ...pet,
//               mood:
//                 action === "pet"
//                   ? "loved"
//                   : action === "feed"
//                   ? "full"
//                   : action === "play"
//                   ? "excited"
//                   : "happy",
//             }
//           : pet
//       )
//     );

//     // Reset after 1.5s
//     setTimeout(() => {
//       setPets((prevPets) =>
//         prevPets.map((pet) =>
//           pet.id === id ? { ...pet, mood: "happy" } : pet
//         )
//       );
//     }, 1500);
//   };

//   return (
//     <div style={{ maxWidth: 800, margin: "auto", textAlign: "center" }}>
//       <h2>🌿 Peaceful Pet Playground</h2>

//       <div style={{ marginBottom: 20 }}>
//         {["dog", "cat", "parrot"].map((type) => (
//           <button
//             key={type}
//             onClick={() => addPet(type)}
//             style={{
//               margin: 5,
//               padding: "10px 15px",
//               borderRadius: 10,
//               backgroundColor: "#b2f2bb",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Add {type.charAt(0).toUpperCase() + type.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div
//         style={{
//           position: "relative",
//           width: "100%",
//           height: 500,
//           backgroundColor: "#e6ffe6",
//           borderRadius: 15,
//           border: "2px solid #a2d5a2",
//           overflow: "hidden",
//         }}
//       >
//         {pets.map((pet) => (
//           <div
//             key={pet.id}
//             className="pet bounce-in"
//             style={{
//               position: "absolute",
//               left: pet.x,
//               top: pet.y,
//               width: 120,
//               textAlign: "center",
//               transition: "top 0.3s, left 0.3s",
//             }}
//           >
//             <img
//               src={petImages[pet.type]}
//               alt={pet.type}
//               style={{ width: "100%", height: "auto" }}
//             />
//             <div className={`mood ${pet.mood}`}>{getMoodEmoji(pet.mood)}</div>

//             <div style={{ marginTop: 5 }}>
//               <button onClick={() => interactWithPet(pet.id, "pet")}>Pet 🤗</button>
//               <button onClick={() => interactWithPet(pet.id, "feed")}>Feed 🍗</button>
//               <button onClick={() => interactWithPet(pet.id, "play")}>Play 🎾</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const getMoodEmoji = (mood) => {
//   switch (mood) {
//     case "loved":
//       return "❤️";
//     case "full":
//       return "😋";
//     case "excited":
//       return "😄";
//     default:
//       return "😊";
//   }
// };

// export default PetPlayground;


import React, { useState } from 'react';
import './PetPlayground.css';

const petData = {
  dog: {
    image: '/assets/dog.png',
    sound: '/assets/dog.mp3',
  },
  cat: {
    image: '/assets/cat.png',
    sound: '/assets/cat.mp3',
  },
  parrot: {
    image: '/assets/parrot.png',
    sound: '/assets/parrot.mp3',
  },
};

function PetPlayground() {
  const [currentPet, setCurrentPet] = useState(null);
  const [ball, setBall] = useState(null);
  const [audio, setAudio] = useState(null);

  const playSound = (soundPath) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(soundPath);
    newAudio.volume = 0.8;
    newAudio.play();
    setAudio(newAudio);

    // Fade out
    setTimeout(() => {
      newAudio.volume = 0.3;
      setTimeout(() => newAudio.pause(), 1000);
    }, 1000);
  };

  const addPet = (type) => {
    playSound(petData[type].sound);
    setCurrentPet({
      type,
      id: Date.now(),
      style: {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'all 1s ease-in-out',
      },
    });
  };

  const handleThrowBall = () => {
    if (!currentPet) return;
    const left = Math.random() * 80 + 10 + '%';
    setBall({ id: Date.now(), left });
    playSound(petData[currentPet.type].sound);

    setCurrentPet((prevPet) => ({
      ...prevPet,
      style: {
        ...prevPet.style,
        left,
        transform: 'translateY(-50%)',
        transition: 'all 1s ease-in-out',
      },
    }));

    setTimeout(() => setBall(null), 2000);
  };

  const handlePlaygroundClick = (e) => {
    if (!currentPet) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    playSound(petData[currentPet.type].sound);

    setCurrentPet((prevPet) => ({
      ...prevPet,
      style: {
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'all 1s ease-in-out',
      },
    }));
  };

  return (
    <div className="playground-container">
      <div className="controls">
        <button onClick={() => addPet('dog')}>Play with Dog</button>
        <button onClick={() => addPet('cat')}>Play with Cat</button>
        <button onClick={() => addPet('parrot')}>Play with Parrot</button>
        <button onClick={handleThrowBall}>Throw Ball</button>
      </div>

      <div className="playground scenic-bg" onClick={handlePlaygroundClick}>
        {currentPet && (
          <img
            key={currentPet.id}
            src={petData[currentPet.type].image}
            alt={currentPet.type}
            className="pet fade-in"
            style={currentPet.style}
          />
        )}

        {ball && (
          <img
            src="/assets/tennis.png"
            alt="ball"
            className="ball"
            style={{ left: ball.left }}
          />
        )}
      </div>
    </div>
  );
}

export default PetPlayground;
