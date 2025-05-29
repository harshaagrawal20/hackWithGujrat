import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PetModel({ modelPath, position, target, type }) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    let scale = 1;

    if (type === 'cat') {
      scale = 0.04;
    } else if (type === 'parrot') {
      scale = 0.01;
    } else if (type === 'dog') {
      scale = 0.018;
    }

    scene.scale.set(scale, scale, scale);

    // Center model so its base sits exactly on y=0
    const box = new THREE.Box3().setFromObject(scene);
    const minY = box.min.y;

    // Shift model up so its bottom is at y=0
    scene.position.y = -minY;

    if (group.current) {
      group.current.position.set(position.x, position.y, position.z);
    }
  }, [scene, type, position]);

  useFrame(() => {
    if (target && group.current) {
      const nextPosition = new THREE.Vector3(target.x, 0, target.z);
      group.current.lookAt(nextPosition);
      group.current.position.lerp(nextPosition, 0.02);
    }
  });

  return <primitive ref={group} object={scene} />;
}
