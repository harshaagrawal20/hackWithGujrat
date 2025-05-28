import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles, OrbitControls } from '@react-three/drei';

export default function TherapyBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#c21496']} />

        {/* Sparkles for a calming effect */}
        <Sparkles
          count={250}             // increased sparkle count
          scale={20}              // wider coverage
          size={3}                // slightly larger sparkles
          speed={0.5}             // slow, gentle twinkle
          color="#f7e2f2"         // soft bluish tone
          opacity={1.5}
        />

        {/* Optional camera control (for subtle movement if needed) */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
      </Canvas>
    </div>
  );
}
