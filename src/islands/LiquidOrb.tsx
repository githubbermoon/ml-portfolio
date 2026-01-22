import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, OrthographicCamera } from '@react-three/drei';
import type { Mesh } from 'three';

function Orb() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (

    <mesh ref={meshRef} scale={1.8}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={16}
        resolution={512}
        transmission={0.95}
        roughness={0.05}
        ior={1.4}
        thickness={2.5}
        chromaticAberration={0.06}
        anisotropy={0.3}
        distortion={0.6}
        distortionScale={0.4}
        temporalDistortion={0.2}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor="#ffffff"
        color="#c0ebff" // Subtle icy blue tint
        background={undefined} 
      />
    </mesh>
  );
}

export default function LiquidOrb() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas eventSource={typeof document !== 'undefined' ? document.body : undefined}>
        <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={180} />
        
        {/* Environment for reflections - essential for the water look */}
        <Environment preset="city" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Orb />
        </Float>

        {/* Lighting to enhance the surface definition */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
      </Canvas>
    </div>
  );
}
