import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useResolvedTheme } from '../lib/theme';

type SilkPlaneProps = {
	color: string;
	roughness: number;
	metalness: number;
	clearcoat: number;
	clearcoatRoughness: number;
	amplitude?: number;
	sheen?: number;
	sheenColor?: string;
	sheenRoughness?: number;
};

function SilkPlane({
	color,
	roughness,
	metalness,
	clearcoat,
	clearcoatRoughness,
	amplitude = 1,
	sheen = 0,
	sheenColor = '#ffffff',
	sheenRoughness = 1,
}: SilkPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(10, 10, 128, 128), []);
  const originalPositions = useMemo(() => geometry.attributes.position.array.slice(), [geometry]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position;
      const count = positions.count;

      for (let i = 0; i < count; i++) {
        const x = originalPositions[i * 3];
        const y = originalPositions[i * 3 + 1];

        let z =
          Math.sin(x * 1.5 + time * 0.5) *
          Math.cos(y * 1.2 + time * 0.3) *
          0.5 *
          amplitude;
        z +=
          Math.sin(x * 3.0 - time * 0.4) *
          Math.cos(y * 2.5 + time * 0.6) *
          0.2 *
          amplitude;
        z += Math.sin(x * 5.0 + time * 1.0) * 0.05 * amplitude;

        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 3, 0, 0]}>
      <meshPhysicalMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        clearcoat={clearcoat}
        clearcoatRoughness={clearcoatRoughness}
        sheen={sheen}
        sheenColor={new THREE.Color(sheenColor)}
        sheenRoughness={sheenRoughness}
        transmission={0.0}
        side={THREE.DoubleSide}
        flatShading={false}
      />
    </mesh>
  );
}

export default function GhostSilk() {
	const theme = useResolvedTheme();
	const isBright = theme === 'bright';
	const background = isBright ? '#fdfcfb' : '#050506';
	const wrapperClass = isBright
		? 'absolute inset-0 w-full h-full z-0 bg-white pointer-events-none'
		: 'absolute inset-0 w-full h-full z-0 bg-black pointer-events-none';

	const material = isBright
		? {
				color: '#e7edf4',
				roughness: 0.45,
				metalness: 0.12,
				clearcoat: 0.7,
				clearcoatRoughness: 0.18,
				sheen: 0.5,
				sheenColor: '#ffffff',
				sheenRoughness: 0.6,
				amplitude: 0.95,
			}
		: {
				color: '#202225',
				roughness: 0.28,
				metalness: 0.55,
				clearcoat: 0.55,
				clearcoatRoughness: 0.14,
				sheen: 0.25,
				sheenColor: '#c7d2fe',
				sheenRoughness: 0.75,
				amplitude: 1.1,
			};

  return (
    <div className={wrapperClass}>
      <Canvas
        camera={{ position: [0, 5, 5], fov: 45 }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <color attach="background" args={[background]} />
        <ambientLight intensity={isBright ? 0.45 : 0.18} />
        <hemisphereLight
          args={[isBright ? '#ffffff' : '#0f172a', isBright ? '#dbeafe' : '#020617', isBright ? 0.65 : 0.35]}
        />
        <directionalLight
          position={[6, 8, 4]}
          intensity={isBright ? 0.9 : 1.2}
          color={isBright ? '#f6e6d5' : '#a3e635'}
        />
        <directionalLight
          position={[-7, 4, -6]}
          intensity={isBright ? 0.65 : 0.9}
          color={isBright ? '#b9e6ff' : '#60a5fa'}
        />
        <pointLight position={[0, -2, 1]} intensity={isBright ? 0.25 : 0.45} color="#ffffff" />
        <Environment preset={isBright ? 'city' : 'night'} />
        <SilkPlane {...material} />
      </Canvas>
    </div>
  );
}
