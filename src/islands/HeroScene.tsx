import { Suspense, useEffect, useMemo, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { SheetProvider, editable as e } from '@theatre/r3f';
import { BlendFunction } from 'postprocessing';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Vector2 } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
	clusterRef: React.MutableRefObject<THREE.Group | null>;
};

const flowNoise = (x: number, y: number, z: number) =>
	Math.sin(x * 0.6 + z * 0.4 + Math.cos(y * 0.7)) * Math.cos(y * 0.5 + x * 0.3);

function GlassCluster({ samples, resolution, distortionScale, clusterRef }: GlassProps) {
	return (
		<e.group theatreKey="hero-cluster" ref={clusterRef}>
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

function FlowField({
	count,
	color,
	opacity,
	size,
}: {
	count: number;
	color: string;
	opacity: number;
	size: number;
}) {
	const { geometry, basePositions, offsets } = useMemo(() => {
		const positions = new Float32Array(count * 3);
		const basePositions = new Float32Array(count * 3);
		const offsets = new Float32Array(count);
		const spread = { x: 4.6, y: 3.2, z: 1.8 };

		for (let i = 0; i < count; i += 1) {
			const i3 = i * 3;
			const x = (Math.random() - 0.5) * spread.x;
			const y = (Math.random() - 0.5) * spread.y;
			const z = (Math.random() - 0.5) * spread.z - 1.1;
			positions[i3] = x;
			positions[i3 + 1] = y;
			positions[i3 + 2] = z;
			basePositions[i3] = x;
			basePositions[i3 + 1] = y;
			basePositions[i3 + 2] = z;
			offsets[i] = Math.random() * 10;
		}

		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new BufferAttribute(positions, 3));
		return { geometry, basePositions, offsets };
	}, [count]);

	useEffect(() => {
		return () => geometry.dispose();
	}, [geometry]);

	useFrame((state) => {
		const positions = geometry.attributes.position.array as Float32Array;
		const time = state.clock.getElapsedTime() * 0.12;
		const drift = 0.22;

		for (let i = 0; i < count; i += 1) {
			const i3 = i * 3;
			const baseX = basePositions[i3];
			const baseY = basePositions[i3 + 1];
			const baseZ = basePositions[i3 + 2];
			const offset = offsets[i];
			const nx = flowNoise(baseX * 0.7 + time + offset, baseY * 0.5, baseZ * 0.6);
			const ny = flowNoise(baseY * 0.6 - time * 0.8 + offset, baseZ * 0.7, baseX * 0.4);
			const nz = flowNoise(baseZ * 0.5 + time * 0.6 + offset, baseX * 0.6, baseY * 0.6);

			positions[i3] = baseX + nx * drift;
			positions[i3 + 1] = baseY + ny * drift * 0.8;
			positions[i3 + 2] = baseZ + nz * drift * 0.9;
		}

		geometry.attributes.position.needsUpdate = true;
	});

	return (
		<points geometry={geometry} frustumCulled={false}>
			<pointsMaterial
				color={color}
				size={size}
				transparent
				opacity={opacity}
				depthWrite={false}
				blending={AdditiveBlending}
				sizeAttenuation
			/>
		</points>
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
	const clusterRef = useRef<THREE.Group | null>(null);
	const flowColor = theme === 'bright' ? '#0ea5e9' : '#7dd3fc';
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
					<HeroCameraRig clusterRef={clusterRef} />
					<FlowField
						count={isHigh ? 360 : 220}
						color={flowColor}
						opacity={isHigh ? 0.3 : 0.22}
						size={isHigh ? 0.03 : 0.025}
					/>
					<Suspense fallback={null}>
						<Environment preset="city" />
						<GlassCluster
							samples={samples}
							resolution={resolution}
							distortionScale={distortionScale}
							clusterRef={clusterRef}
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

function HeroCameraRig({ clusterRef }: { clusterRef: React.MutableRefObject<THREE.Group | null> }) {
	const { camera } = useThree();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const heroSection = document.querySelector('#hero');
		if (!heroSection || !clusterRef.current) return;

		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			gsap.to(camera.position, {
				x: 0.25,
				y: -0.15,
				z: 3.2,
				ease: 'none',
				scrollTrigger: {
					trigger: heroSection,
					start: 'top top',
					end: 'bottom top',
					scrub: true,
				},
			});

			gsap.to(clusterRef.current!.rotation, {
				y: 0.6,
				x: -0.15,
				ease: 'none',
				scrollTrigger: {
					trigger: heroSection,
					start: 'top top',
					end: 'bottom top',
					scrub: true,
				},
			});
		}, heroSection);

		return () => ctx.revert();
	}, [camera, clusterRef]);

	return null;
}
