import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Bloom, 
  EffectComposer, 
  Vignette,
  ChromaticAberration,
  Noise 
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

type Props = {
  isActive: boolean;
  themeColor: string;
  onComplete: () => void;
};

// Helix Nebula Palette
// Core is empty/black, then Blue -> Amber -> Red
const PALETTE = {
  void: new THREE.Color('#000000'),
  coreBlue: new THREE.Color('#00ffff'), // Cyan/Electric Blue
  innerGold: new THREE.Color('#ffd700'), // Gold
  midOrange: new THREE.Color('#ff8c00'), // Dark Orange
  outerRed: new THREE.Color('#8b0000'),  // Deep Red
};

// ============================================
// HELIX TUNNEL PARTICLES
// ============================================
function HelixTunnel() {
  const pointsRef = useRef<THREE.Points>(null!);
  
  // Create 5000 tunnel particles
  const [positions, colors, sizes] = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // 1. Position: Cylinder along Z-axis
      // We want a "tunnel" so we avoid the very center (radius 0-5)
      const r = 8 + Math.pow(Math.random(), 2) * 40; // Bias towards inner rings (8-48 range)
      const theta = Math.random() * Math.PI * 2;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = -Math.random() * 500; // Long tunnel ahead
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      // 2. Color Mapping based on Radius `r`
      // Helix structure: Blue Core -> Gold/Orange -> Red Outer
      const color = new THREE.Color();
      
      if (r < 15) {
        // Inner Blue Core
        color.copy(PALETTE.coreBlue);
        // Add subtle variation
        color.lerp(new THREE.Color('#ffffff'), Math.random() * 0.3);
      } else if (r < 25) {
        // Transition Blue -> Gold
        const t = (r - 15) / 10;
        color.copy(PALETTE.coreBlue).lerp(PALETTE.innerGold, t);
      } else if (r < 35) {
        // Gold -> Orange
        const t = (r - 25) / 10;
        color.copy(PALETTE.innerGold).lerp(PALETTE.midOrange, t);
      } else {
        // Orange -> Red Outer Shell
        color.copy(PALETTE.midOrange).lerp(PALETTE.outerRed, Math.random());
      }
      
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
      
      // 3. Size: Inner particles are finer (gas), outer are clumpier
      siz[i] = (Math.random() * 1.5) + (r > 30 ? 2.0 : 0.5);
    }
    
    return [pos, col, siz];
  }, []);
  
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Fly through effect
    // Move particles TOWARDS camera (increasing Z)
    const speed = 120; // Units per second
    
    for (let i = 0; i < positions.length / 3; i++) {
      let z = positions[i * 3 + 2];
      z += delta * speed;
      
      // Loop particles
      if (z > 10) {
        z = -500;
        // Optionally rotate x/y slightly for "twisting" tunnel feel
      }
      positions[i * 3 + 2] = z;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotate entire tunnel slowly
    pointsRef.current.rotation.z += delta * 0.1;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={sizes.length / 3} array={sizes} itemSize={1} />
      </bufferGeometry>
      {/* 
        Using a soft, additive shader for gas-like look.
        PointMaterial with sizeAttenuation mimics volumetric gas particles.
      */}
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================
// DISTANT STARS
// ============================================
function Starfield() {
  const starsRef = useRef<THREE.Points>(null!);
  // ... standardized starfield impl ...
  const [positions] = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
      const r = 100 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
    }
    return [pos];
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={2000} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={1.2} color="white" transparent opacity={0.8} fog={false} />
    </points>
  )
}

// ============================================
// CAMERA RIG
// ============================================
function CameraRig({ onComplete }: { onComplete: () => void }) {
  const { camera } = useThree();
  const hasCompleted = useRef(false);

  useEffect(() => {
    // Start slightly clearer view
    camera.position.set(0, 0, 5);
    (camera as THREE.PerspectiveCamera).fov = 75;
    camera.rotation.set(0, 0, 0);
    camera.updateProjectionMatrix();

    const tl = gsap.timeline({
      onComplete: () => {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete();
        }
      }
    });

    // 1. Widen FOV to simulate hyperspace speed
    tl.to(camera, {
      fov: 130,
      duration: 3.0,
      ease: 'power3.in',
      onUpdate: () => camera.updateProjectionMatrix()
    });

    // 2. Camera Shake / Rumble
    const shake = { val: 0 };
    tl.to(shake, {
      val: 0.1,
      duration: 2.5,
      ease: 'power2.in',
      onUpdate: () => {
        camera.position.x = (Math.random() - 0.5) * shake.val;
        camera.position.y = (Math.random() - 0.5) * shake.val;
      }
    }, 0);

    return () => tl.kill();
  }, [camera, onComplete]);

  return null;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function WarpOverlay({ isActive, themeColor, onComplete }: Props) {
  const [phase, setPhase] = useState<'idle' | 'warp' | 'whiteout'>('idle');

  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('warp');
    }
  }, [isActive, phase]);

  const handleWarpComplete = () => {
    setPhase('whiteout');
    setTimeout(onComplete, 500); // 0.5s whiteout duration
  };

  if (phase === 'idle') return null;

  // Use Portal to break out of any parent stacking contexts (transforms, etc.)
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 w-screen h-screen z-[9999]"
      style={{ 
        backgroundColor: phase === 'whiteout' ? '#ffffff' : '#000000',
        transition: 'background-color 0.5s ease-in',
      }}
    >
      {phase === 'warp' && (
        <div className="w-full h-full">
          <Canvas
            gl={{ antialias: false, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={['#000000']} />
            
            {/* Fog to hide the start of the tunnel */}
            <fog attach="fog" args={['#000000', 10, 300]} />

            <Starfield />
            <HelixTunnel />
            <CameraRig onComplete={handleWarpComplete} />

            <EffectComposer multisampling={0}> 
              {/* High Bloom for that "Glowing Gas" look */}
              <Bloom 
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                intensity={2.5}
                radius={0.8} 
              />
              <ChromaticAberration 
                blendFunction={BlendFunction.NORMAL}
                offset={new THREE.Vector2(0.005, 0.005)}
              />
              <Noise opacity={0.05} />
              <Vignette darkness={0.6} offset={0.2} />
            </EffectComposer>
          </Canvas>
        </div>
      )}
    </div>,
    document.body
  );
}
