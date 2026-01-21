import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Environment, Float, Sparkles } from '@react-three/drei';

// --- Realistic Grass Shader ---
const grassVertexShader = `
  varying vec2 vUv;
  varying float vCloud;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Instance attributes (passed via instanceMatrix or attribute if using raw instancing, 
    // but here we use R3F InstancedMesh so we rely on simple matrix transforms + explicit logic if needed.
    // To keep it simple without custom attributes, we will sway based on world position from modelMatrix).
    
    vec4 worldPos = instanceMatrix * vec4(pos, 1.0);
    
    // Wind noise
    float wind = sin(uTime * 0.5 + worldPos.x * 0.5 + worldPos.z * 0.5);
    float sway = sin(uTime * 1.5 + worldPos.x) * 0.5;
    
    // Bend the top of the grass blade (uv.y > 0.0 is tip usually for a plane anchored at bottom)
    // Assuming plane geometry is centered, we map UV.y (0 to 1) to stiffness.
    // If we use a PlaneBufferGeometry anchored at center, we need to adjust.
    // Let's assume standard plane is centered. We'll shift y in geometry.
    
    float stiffness = smoothstep(0.0, 1.0, uv.y);
    pos.x += sway * stiffness * 0.3;
    pos.z += wind * stiffness * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;

// Simpler grass approach: use multiple meshes or a single merged geometry for "clumps"
// But for "realistic", particles or instanced mesh is best.
// Let's use a simplified "Stylized Realism" approach using thin curved planes.

const GrassField = () => {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => {
     const pos = [];
     for(let i=0; i<count; i++) {
        pos.push({
           x: (Math.random() - 0.5) * 15,
           y: -1.5,
           z: (Math.random() - 0.5) * 5,
           scale: 0.5 + Math.random() * 0.5,
           rot: Math.random() * Math.PI
        });
     }
     return pos;
  }, []);

  useFrame((state) => {
    if(!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    positions.forEach((p, i) => {
      // Wind effect
      const sway = Math.sin(t * 1.5 + p.x) * 0.1;
      
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(sway * 0.5, p.rot, sway * 0.2);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.1, 3]} /> {/* Tall thin blades */}
      <meshStandardMaterial color="#1a2f1c" side={THREE.DoubleSide} transparent opacity={0.9} />
    </instancedMesh>
  );
};

// --- Procedural Flower ---
// A glowing, multi-layered lotus-like flower
const RealisticFlower = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={[0, -0.5, 0]}>
        {/* Core Glow */}
        <mesh>
           <sphereGeometry args={[0.2, 32, 32]} />
           <meshBasicMaterial color="#ffddaa" />
        </mesh>
        <pointLight color="#ffaa55" intensity={1.5} distance={3} />

        {/* Petals - Layer 1 */}
        {Array.from({ length: 6 }).map((_, i) => (
           <group key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
              <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -0.5]}>
                 <sphereGeometry args={[0.4, 32, 16]} /> 
                 {/* Elongated sphere as petal */}
                 <meshPhysicalMaterial 
                    color="#ffb7b2" 
                    roughness={0.2} 
                    transmission={0.6} // Glass/Subsurface feel
                    thickness={0.5}
                 />
              </mesh>
           </group>
        ))}
        
        {/* Petals - Layer 2 (Larger, Outer) */}
        {Array.from({ length: 8 }).map((_, i) => (
           <group key={i} rotation={[0, (i / 8) * Math.PI * 2 + 0.4, 0]}>
              <mesh position={[0.7, 0.1, 0]} rotation={[0, 0, -0.3]}>
                 <sphereGeometry args={[0.6, 32, 16]} />
                 <meshPhysicalMaterial 
                    color="#e0e0e0" 
                    roughness={0.4} 
                    transmission={0.4}
                 />
              </mesh>
           </group>
        ))}
      </group>
    </Float>
  );
};

export default function FloraFooter() {
	return (
		<div className="relative h-64 w-full overflow-hidden rounded-[2rem] border border-white/5 bg-black">
			<Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
                {/* Cinematic Lighting */}
                <ambientLight intensity={0.2} />
                <spotLight position={[5, 5, 5]} angle={0.5} penumbra={1} intensity={10} color="#aaddff" />
                <pointLight position={[-2, 1, 2]} intensity={2} color="#ff99cc" />
                
                {/* Atmosphere */}
                <fog attach="fog" args={['#05070a', 2, 10]} />
                <Sparkles count={50} scale={6} size={2} speed={0.4} opacity={0.5} color="#fff" />

                {/* The Content */}
				<GrassField />
                <RealisticFlower />
                
                <Environment preset="night" />
			</Canvas>
            
            {/* Vignette Overlay */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
		</div>
	);
}
