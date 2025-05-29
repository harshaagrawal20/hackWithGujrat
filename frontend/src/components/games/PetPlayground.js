// import React, { useState } from 'react';
// import './PetPlayground.css';

// const petData = {
//   dog: {
//     image: '/assets/dog.png',
//     sound: '/assets/dog.mp3',
//   },
//   cat: {
//     image: '/assets/cat.png',
//     sound: '/assets/cat.mp3',
//   },
//   parrot: {
//     image: '/assets/parrot.png',
//     sound: '/assets/parrot.mp3',
//   },
// };

// function PetPlayground() {
//   const [currentPet, setCurrentPet] = useState(null);
//   const [ball, setBall] = useState(null);
//   const [audio, setAudio] = useState(null);

//   const playSound = (soundPath) => {
//     if (audio) {
//       audio.pause();
//       audio.currentTime = 0;
//     }
//     const newAudio = new Audio(soundPath);
//     newAudio.volume = 0.8;
//     newAudio.play();
//     setAudio(newAudio);

//     // Fade out
//     setTimeout(() => {
//       newAudio.volume = 0.3;
//       setTimeout(() => newAudio.pause(), 1000);
//     }, 1000);
//   };

//   const addPet = (type) => {
//     playSound(petData[type].sound);
//     setCurrentPet({
//       type,
//       id: Date.now(),
//       style: {
//         left: '50%',
//         top: '50%',
//         transform: 'translate(-50%, -50%)',
//         transition: 'all 1s ease-in-out',
//       },
//     });
//   };

//   const handleThrowBall = () => {
//     if (!currentPet) return;
//     const left = Math.random() * 80 + 10 + '%';
//     setBall({ id: Date.now(), left });
//     playSound(petData[currentPet.type].sound);

//     setCurrentPet((prevPet) => ({
//       ...prevPet,
//       style: {
//         ...prevPet.style,
//         left,
//         transform: 'translateY(-50%)',
//         transition: 'all 1s ease-in-out',
//       },
//     }));

//     setTimeout(() => setBall(null), 2000);
//   };

//   const handlePlaygroundClick = (e) => {
//     if (!currentPet) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     playSound(petData[currentPet.type].sound);

//     setCurrentPet((prevPet) => ({
//       ...prevPet,
//       style: {
//         left: `${x}px`,
//         top: `${y}px`,
//         transform: 'translate(-50%, -50%)',
//         transition: 'all 1s ease-in-out',
//       },
//     }));
//   };

//   return (
//     <div className="playground-container">
//       <div className="controls">
//         <button onClick={() => addPet('dog')}>Play with Dog</button>
//         <button onClick={() => addPet('cat')}>Play with Cat</button>
//         <button onClick={() => addPet('parrot')}>Play with Parrot</button>
//         <button onClick={handleThrowBall}>Throw Ball</button>
//       </div>

//       <div className="playground scenic-bg" onClick={handlePlaygroundClick}>
//         {currentPet && (
//           <img
//             key={currentPet.id}
//             src={petData[currentPet.type].image}
//             alt={currentPet.type}
//             className="pet fade-in"
//             style={currentPet.style}
//           />
//         )}

//         {ball && (
//           <img
//             src="/assets/tennis.png"
//             alt="ball"
//             className="ball"
//             style={{ left: ball.left }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default PetPlayground;


import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane, Sky } from '@react-three/drei';
import { PetModel } from './PetModel';
import * as THREE from 'three';
// import './PetGarden3D.css'; // Add CSS import
import './PetPlayground.css'
const petData = {
  dog: {
    model: '/assets/dog.glb',
    sound: '/assets/dog.mp3',
  },
  cat: {
    model: '/assets/cat.glb',
    sound: '/assets/cat.mp3',
  },
  parrot: {
    model: '/assets/parrot.glb',
    sound: '/assets/parrot.mp3',
  },
};

function PetPlayground() {
  const [currentPet, setCurrentPet] = useState(null);
  const [target, setTarget] = useState(null);
  const audioRef = useRef(null);

  const playSound = (src) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(src);
    audio.volume = 0.8;
    audio.play();
    audioRef.current = audio;
    setTimeout(() => audio.pause(), 2000);
  };

  const addPet = (type) => {
    playSound(petData[type].sound);
    setCurrentPet({
      type,
      model: petData[type].model,
      position: new THREE.Vector3(0, 0, 0),
    });
  };

  const throwBall = () => {
    if (!currentPet) return;
    const x = (Math.random() - 0.5) * 8;
    const z = (Math.random() - 0.5) * 8;
    const newTarget = new THREE.Vector3(x, 0.1, z);
    setTarget(newTarget);
    playSound(petData[currentPet.type].sound);
  };

  const handlePlaneClick = (e) => {
    if (!currentPet) return;
    const point = e.point;
    setTarget(point);
    playSound(petData[currentPet.type].sound);
  };

  return (
    <div className="garden-container">
      <div className="controls">
        <button onClick={() => addPet('dog')}>Play with Dog</button>
        <button onClick={() => addPet('cat')}>Play with Cat</button>
        <button onClick={() => addPet('parrot')}>Play with Parrot</button>
        <button onClick={throwBall}>Throw Ball</button>
      </div>

      <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />

        <Plane
          args={[50, 20]}
          rotation={[-Math.PI / 2.8, 0, 0]}
          position={[0, -5, 0]}
          onClick={handlePlaneClick}
          receiveShadow
        >
          <meshStandardMaterial color="lightgreen"/>
        </Plane>

        {currentPet && (
          <PetModel
            type={currentPet.type}
            modelPath={currentPet.model}
            position={currentPet.position}
            target={target}
          />
        )}
        {/* <OrbitControls/> */}
      </Canvas>
    </div>
  );
}

export default PetPlayground;
