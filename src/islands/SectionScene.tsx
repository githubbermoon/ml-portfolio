import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { detectAutoTier, getStoredTier, type PerfTier } from '../lib/perfGate';

type Variant = 'pipeline' | 'carousel' | 'calm';

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

const Pipeline = () => (
	<group>
		<Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
			<mesh position={[-1.4, 0, 0]}>
				<sphereGeometry args={[0.35, 32, 32]} />
				<meshStandardMaterial color="#7dd3fc" metalness={0.4} roughness={0.25} />
			</mesh>
		</Float>
		<Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.4}>
			<mesh position={[0, 0.4, 0]}>
				<boxGeometry args={[0.6, 0.6, 0.6]} />
				<meshStandardMaterial color="#e6edf5" metalness={0.2} roughness={0.2} />
			</mesh>
		</Float>
		<Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
			<mesh position={[1.4, -0.2, 0]}>
				<icosahedronGeometry args={[0.4, 1]} />
				<meshStandardMaterial color="#f59e0b" metalness={0.2} roughness={0.4} />
			</mesh>
		</Float>
	</group>
);

const Carousel = () => (
	<group>
		{[-1.4, 0, 1.4].map((x) => (
			<Float key={x} speed={0.6} rotationIntensity={0.4} floatIntensity={0.5}>
				<mesh position={[x, 0, 0]}>
					<torusGeometry args={[0.35, 0.12, 24, 72]} />
					<meshStandardMaterial color="#e6edf5" metalness={0.3} roughness={0.3} />
				</mesh>
			</Float>
		))}
	</group>
);

const Calm = () => (
	<group>
		<Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
			<mesh position={[0, 0, 0]}>
				<planeGeometry args={[3.2, 2.2]} />
				<meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.1} />
			</mesh>
		</Float>
	</group>
);

const variantMap: Record<Variant, JSX.Element> = {
	pipeline: <Pipeline />,
	carousel: <Carousel />,
	calm: <Calm />,
};

export default function SectionScene({ variant = 'pipeline' }: { variant?: Variant }) {
	const tier = usePerfTier();
	if (tier === 'off') return null;

	return (
		<div className="absolute inset-0 -z-10">
			<Canvas
				dpr={tier === 'high' ? [1, 2] : [1, 1.5]}
				camera={{ position: [0, 0, 4], fov: 52 }}
			>
				<ambientLight intensity={0.6} />
				<pointLight position={[3, 2, 2]} intensity={1.2} />
				<Suspense fallback={null}>
					<Environment preset="warehouse" />
					{variantMap[variant]}
				</Suspense>
				{tier === 'high' && <OrbitControls enableZoom={false} enablePan={false} />}
			</Canvas>
		</div>
	);
}
