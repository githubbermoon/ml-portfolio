import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { detectAutoTier, getStoredTier, type PerfTier } from '../lib/perfGate';

const defaultTier: PerfTier = 'standard';

const usePerfTier = () => {
	const [tier, setTier] = useState<PerfTier>(defaultTier);

	useEffect(() => {
		const stored = getStoredTier();
		if (stored === 'auto') {
			detectAutoTier().then(setTier);
		} else {
			setTier(stored);
		}

		const handle = (event: Event) => {
			const detail = (event as CustomEvent<{ tier: PerfTier }>).detail;
			setTier(detail?.tier ?? defaultTier);
		};
		window.addEventListener('perf-tier-change', handle);
		return () => window.removeEventListener('perf-tier-change', handle);
	}, []);

	return tier;
};

function GlassCluster() {
	return (
		<group>
			<Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
				<mesh position={[-1.2, 0.2, 0]}>
					<icosahedronGeometry args={[0.8, 1]} />
					<meshPhysicalMaterial
						color="#e6edf5"
						roughness={0.1}
						transmission={0.9}
						thickness={0.5}
						opacity={0.8}
						transparent
					/>
				</mesh>
			</Float>
			<Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
				<mesh position={[0.9, -0.3, 0.4]}>
					<torusKnotGeometry args={[0.45, 0.16, 120, 16]} />
					<meshPhysicalMaterial
						color="#7dd3fc"
						roughness={0.2}
						transmission={0.65}
						thickness={0.6}
						opacity={0.85}
						transparent
					/>
				</mesh>
			</Float>
		</group>
	);
}

export default function HeroScene() {
	const tier = usePerfTier();
	if (tier === 'off') return null;

	return (
		<div className="absolute inset-0 -z-10">
			<Canvas
				dpr={tier === 'high' ? [1, 2] : [1, 1.5]}
				camera={{ position: [0, 0, 4], fov: 48 }}
			>
				<color attach="background" args={[0, 0, 0]} />
				<ambientLight intensity={0.7} />
				<pointLight position={[4, 3, 2]} intensity={1.5} />
				<Suspense fallback={null}>
					<Environment preset="city" />
					<GlassCluster />
				</Suspense>
			</Canvas>
		</div>
	);
}
