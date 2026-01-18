import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { SheetProvider, editable as e } from '@theatre/r3f';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { detectAutoTier, getStoredTier, type PerfTier } from '../lib/perfGate';
import { getSceneSheet } from '../lib/theatre';
import { useResolvedTheme } from '../lib/theme';
import FluidDistortion from './postfx/FluidDistortion';

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

type GlassProps = {
	samples: number;
	resolution: number;
	distortionScale: number;
};

function GlassCluster({ samples, resolution, distortionScale }: GlassProps) {
	return (
		<e.group theatreKey="hero-cluster">
			<Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
				<e.mesh theatreKey="hero-icosa" position={[-1.2, 0.2, 0]}>
					<icosahedronGeometry args={[0.8, 1]} />
					<MeshTransmissionMaterial
						color="#e6edf5"
						roughness={0.08}
						transmission={1}
						thickness={0.7}
						chromaticAberration={0.03}
						anisotropicBlur={0.15}
						distortion={0.12}
						distortionScale={distortionScale}
						temporalDistortion={0.1}
						samples={samples}
						resolution={resolution}
					/>
				</e.mesh>
			</Float>
			<Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
				<e.mesh theatreKey="hero-knot" position={[0.9, -0.3, 0.4]}>
					<torusKnotGeometry args={[0.45, 0.16, 120, 16]} />
					<MeshTransmissionMaterial
						color="#7dd3fc"
						roughness={0.12}
						transmission={1}
						thickness={0.6}
						chromaticAberration={0.04}
						anisotropicBlur={0.12}
						distortion={0.15}
						distortionScale={distortionScale * 1.2}
						temporalDistortion={0.12}
						samples={samples}
						resolution={resolution}
					/>
				</e.mesh>
			</Float>
		</e.group>
	);
}

export default function HeroScene() {
	const tier = usePerfTier();
	const sheet = useMemo(() => getSceneSheet('Hero'), []);
	const theme = useResolvedTheme();
	const isHigh = tier === 'high';
	const samples = isHigh ? 12 : 6;
	const resolution = isHigh ? 1024 : 512;
	const distortionScale = isHigh ? 0.4 : 0.2;
	const bloomIntensity = isHigh ? 0.7 : 0.35;
	const chromaOffset = useMemo(() => new Vector2(0.0014, 0.0011), []);
	const background =
		theme === 'bright' ? [244 / 255, 247 / 255, 251 / 255] : [0, 0, 0];
	if (tier === 'off') return null;

	return (
		<div className="absolute inset-0 -z-10">
			<Canvas
				dpr={tier === 'high' ? [1, 2] : [1, 1.5]}
				camera={{ position: [0, 0, 4], fov: 48 }}
			>
				<color attach="background" args={background} />
				<ambientLight intensity={0.7} />
				<pointLight position={[4, 3, 2]} intensity={1.5} />
				<SheetProvider sheet={sheet}>
					<Suspense fallback={null}>
						<Environment preset="city" />
						<GlassCluster
							samples={samples}
							resolution={resolution}
							distortionScale={distortionScale}
						/>
					</Suspense>
					<EffectComposer multisampling={isHigh ? 4 : 0}>
						<FluidDistortion strength={isHigh ? 0.04 : 0.02} />
						<Bloom
							intensity={bloomIntensity}
							luminanceThreshold={0.2}
							luminanceSmoothing={0.9}
						/>
						<ChromaticAberration
							blendFunction={BlendFunction.NORMAL}
							offset={chromaOffset}
						/>
						<Vignette eskil offset={0.25} darkness={0.7} />
						<Noise opacity={isHigh ? 0.12 : 0.06} />
					</EffectComposer>
				</SheetProvider>
			</Canvas>
		</div>
	);
}
