import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Noise, Vignette, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';

// A custom shader material for the "Living Paper" effect
// We use a custom shader to get that specific "vertex noise" movement efficiently on the GPU
const LivingMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#e0e0e0') },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    // Classic Perlin noise or similar simple noise function
    // (Simplified for brevity)
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // The "Living" Motion:
      // We displace the Z axis based on time and position
      float elevation = noise(pos.xy * 2.0 + uTime * 0.5) * 0.5;
      elevation += sin(pos.y * 5.0 + uTime) * 0.1;
      
      pos.z += elevation;
      vElevation = elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vElevation;

    void main() {
      // Fake lighting based on elevation
      // Higher peaks = brighter, valleys = darker (shadows)
      float shadow = smoothstep(-0.2, 0.5, vElevation); 
      vec3 finalColor = mix(uColor * 0.1, uColor, shadow);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

const LivingPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ffffff') },
  }), []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={LivingMaterial.vertexShader}
        fragmentShader={LivingMaterial.fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// "Nodes" effect - floating particles
const FloatingNodes = () => {
    const count = 100;
    const mesh = useRef<THREE.InstancedMesh>(null);
    
    // Generate random positions
    const particles = useMemo(() => {
        const temp = [];
        for(let i=0; i<count; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 2 + 1; // Hover above plane
            temp.push({x,y,z, speed: Math.random() * 0.2});
        }
        return temp;
    }, []);

    const dummy = new THREE.Object3D();

    useFrame((state) => {
        if(!mesh.current) return;
        particles.forEach((particle, i) => {
            const t = state.clock.getElapsedTime();
            // Bobbing motion
            dummy.position.set(
                particle.x, 
                particle.y + Math.sin(t * particle.speed + particle.x) * 0.2, // Y is Z in this rotated world? No, we didn't rotate nodes
                particle.z
            );
            dummy.scale.setScalar(0.05);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={[0,0,0]} rotation={[-Math.PI/2, 0, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="black" />
        </instancedMesh>
    );
};


export default function LivingGridScene() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#111' }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 8]} fov={50} />
        <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={10} color="#fff" />

        {/* The Content */}
        <group>
           <LivingPlane />
           <FloatingNodes />
        </group>

        {/* Post Processing for the "Manifesto" Film Look */}
        <EffectComposer disableNormalPass>
           {/* Grain makes it look like film */}
           <Noise opacity={0.3} blendFunction={BlendFunction.OVERLAY} />
           {/* Bloom gives it that ethereal glow on white parts */}
           <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
           <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
        
        {/* Environment reflection */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
