import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, useVideoTexture } from '@react-three/drei';
import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing';
import { SheetProvider, editable as e } from '@theatre/r3f';
import { Color, DoubleSide, MathUtils, Group, ShaderMaterial } from 'three';
import { detectAutoTier, getStoredTier, type PerfTier } from '../lib/perfGate';
import { getSceneSheet } from '../lib/theatre';
import { useResolvedTheme } from '../lib/theme';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Variant = 'pipeline' | 'carousel' | 'calm' | 'terrain' | 'video';

const defaultTier: PerfTier = 'standard';
const fallbackInk: [number, number, number] = [5, 7, 13];
const fallbackMist: [number, number, number] = [23, 32, 53];
const fallbackGlow: [number, number, number] = [125, 211, 252];

const readCssRgb = (name: string, fallback: [number, number, number]) => {
	if (typeof document === 'undefined') return fallback;
	const value = getComputedStyle(document.documentElement).getPropertyValue(name);
	const parts = value
		.trim()
		.split(/\s+/)
		.map((part) => Number(part));
	if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) return fallback;
	return [parts[0], parts[1], parts[2]] as [number, number, number];
};

const applyRgbToColor = (color: Color, rgb: [number, number, number]) => {
	color.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
};

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
	<e.group theatreKey="pipeline-group">
		<Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
			<e.mesh theatreKey="pipeline-sphere" position={[-1.4, 0, 0]}>
				<sphereGeometry args={[0.35, 32, 32]} />
				<meshStandardMaterial color="#7dd3fc" metalness={0.4} roughness={0.25} />
			</e.mesh>
		</Float>
		<Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.4}>
			<e.mesh theatreKey="pipeline-box" position={[0, 0.4, 0]}>
				<boxGeometry args={[0.6, 0.6, 0.6]} />
				<meshStandardMaterial color="#e6edf5" metalness={0.2} roughness={0.2} />
			</e.mesh>
		</Float>
		<Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
			<e.mesh theatreKey="pipeline-icosa" position={[1.4, -0.2, 0]}>
				<icosahedronGeometry args={[0.4, 1]} />
				<meshStandardMaterial color="#f59e0b" metalness={0.2} roughness={0.4} />
			</e.mesh>
		</Float>
	</e.group>
);

const Carousel = () => (
	<e.group theatreKey="carousel-group">
		{[-1.4, 0, 1.4].map((x) => (
			<Float key={x} speed={0.6} rotationIntensity={0.4} floatIntensity={0.5}>
				<e.mesh theatreKey={`carousel-ring-${x}`} position={[x, 0, 0]}>
					<torusGeometry args={[0.35, 0.12, 24, 72]} />
					<meshStandardMaterial color="#e6edf5" metalness={0.3} roughness={0.3} />
				</e.mesh>
			</Float>
		))}
	</e.group>
);

const terrainVertexShader = `
uniform float uTime;
uniform float uElevation;
uniform float uFrequency;
varying float vHeight;
varying vec3 vPosition;
varying vec2 vUv;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
	float value = 0.0;
	float amplitude = 0.5;
	for (int i = 0; i < 4; i++) {
		value += amplitude * noise(p);
		p *= 2.0;
		amplitude *= 0.5;
	}
	return value;
}

void main() {
	vec3 pos = position;
	float flow = uTime * 0.08;
	float n1 = fbm(pos.xy * uFrequency + vec2(flow, -flow));
	float n2 = fbm(pos.xy * uFrequency * 1.8 + vec2(-flow * 1.4, flow * 0.9));
	float ridge = abs(sin((pos.x + pos.y) * uFrequency * 0.6 + uTime * 0.15));
	float height = (n1 * 0.65 + n2 * 0.35 - 0.5) * uElevation * 2.0;
	height += ridge * uElevation * 0.2;
	pos.z += height;
	pos.xy += vec2(n2 - 0.5, n1 - 0.5) * 0.08;
	vHeight = pos.z;
	vPosition = pos;
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const terrainFragmentShader = `
uniform vec3 uColorDeep;
uniform vec3 uColorHigh;
uniform vec3 uColorGlow;
uniform vec3 uColorVoid;
uniform float uContourSteps;
uniform float uElevation;
varying float vHeight;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
	float heightFactor = clamp((vHeight / (uElevation * 1.2)) * 0.5 + 0.5, 0.0, 1.0);
	vec3 base = mix(uColorDeep, uColorHigh, heightFactor);
	float bands = abs(fract(vHeight * uContourSteps) - 0.5);
	float contour = smoothstep(0.25, 0.0, bands);
	vec3 color = mix(base, uColorGlow, contour * 0.55);
	vec3 dx = dFdx(vPosition);
	vec3 dy = dFdy(vPosition);
	vec3 normal = normalize(cross(dx, dy));
	float light = dot(normal, normalize(vec3(0.35, 0.75, 0.55)));
	light = clamp(light * 0.6 + 0.4, 0.0, 1.0);
	color *= light;
	float sink = smoothstep(0.0, 0.35, vUv.y);
	vec3 finalColor = mix(uColorVoid, color, sink);
	gl_FragColor = vec4(finalColor, 1.0);
}
`;

const Terrain = ({ tier }: { tier: PerfTier }) => {
	const groupRef = useRef<Group | null>(null);
	const materialRef = useRef<ShaderMaterial | null>(null);
	const theme = useResolvedTheme();
	const isHigh = tier === 'high';
	const segments = isHigh ? 200 : 120;
	const elevation = isHigh ? 0.55 : 0.42;
	const frequency = isHigh ? 1.5 : 1.2;
	const contourSteps = isHigh ? 12 : 9;
	const rotationIntensity = isHigh ? 0.28 : 0.18;
	const lerpSpeed = isHigh ? 0.08 : 0.05;
	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uElevation: { value: elevation },
			uFrequency: { value: frequency },
			uContourSteps: { value: contourSteps },
			uColorDeep: { value: new Color('#05070d') },
			uColorHigh: { value: new Color('#172035') },
			uColorGlow: { value: new Color('#7dd3fc') },
			uColorVoid: { value: new Color('#05070d') },
		}),
		[elevation, frequency, contourSteps]
	);

	useEffect(() => {
		const ink = readCssRgb('--color-ink', fallbackInk);
		const mist = readCssRgb('--color-mist', fallbackMist);
		const glow = readCssRgb('--color-glow', fallbackGlow);
		applyRgbToColor(uniforms.uColorDeep.value, ink);
		applyRgbToColor(uniforms.uColorHigh.value, mist);
		applyRgbToColor(uniforms.uColorGlow.value, glow);
		applyRgbToColor(uniforms.uColorVoid.value, ink);
	}, [theme, uniforms]);

	useFrame((state) => {
		if (materialRef.current) {
			materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
		}
		if (groupRef.current) {
			const targetX = -0.55 + state.pointer.y * rotationIntensity;
			const targetY = state.pointer.x * rotationIntensity * 1.2;
			groupRef.current.rotation.x = MathUtils.lerp(
				groupRef.current.rotation.x,
				targetX,
				lerpSpeed
			);
			groupRef.current.rotation.y = MathUtils.lerp(
				groupRef.current.rotation.y,
				targetY,
				lerpSpeed
			);
		}
	});

	return (
		<e.group theatreKey="terrain-group" ref={groupRef}>
			<e.mesh theatreKey="terrain-plane" rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
				<planeGeometry args={[6.6, 4.4, segments, segments]} />
				<shaderMaterial
					ref={materialRef}
					vertexShader={terrainVertexShader}
					fragmentShader={terrainFragmentShader}
					uniforms={uniforms}
					side={DoubleSide}
					extensions={{ derivatives: true }}
				/>
			</e.mesh>
		</e.group>
	);
};

const VideoScene = () => {
	const texture = useVideoTexture('/videos/alcrego_graphic.mp4', {
		muted: true,
		loop: true,
		autoplay: true,
	});

	return (
		<e.group theatreKey="video-group">
			<e.mesh theatreKey="video-plane" position={[0, 0, -2]} scale={[16, 9, 1]}>
				<planeGeometry />
				<meshBasicMaterial map={texture} transparent opacity={0.4} />
			</e.mesh>
		</e.group>
	);
};

const Calm = () => (
	<e.group theatreKey="calm-group">
		<Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
			<e.mesh theatreKey="calm-plane" position={[0, 0, 0]}>
				<planeGeometry args={[3.2, 2.2]} />
				<meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.1} />
			</e.mesh>
		</Float>
	</e.group>
);

const variantMap: Record<Variant, (tier: PerfTier) => JSX.Element> = {
	pipeline: () => <Pipeline />,
	carousel: () => <Carousel />,
	calm: () => <Calm />,
	terrain: (tier) => <Terrain tier={tier} />,
	video: () => <VideoScene />,
};

export default function SectionScene({
	variant = 'pipeline',
	sectionId,
}: {
	variant?: Variant;
	sectionId?: string;
}) {
	const tier = usePerfTier();
	const sheet = useMemo(() => getSceneSheet(`Section-${variant}`), [variant]);
	const theme = useResolvedTheme();
	const isTerrain = variant === 'terrain';
	const isHigh = tier === 'high';
	const [terrainBackground, setTerrainBackground] = useState<[number, number, number]>([
		fallbackInk[0] / 255,
		fallbackInk[1] / 255,
		fallbackInk[2] / 255,
	]);
	const [fogRgb, setFogRgb] = useState<[number, number, number]>(fallbackInk);
	const fogColor = useMemo(
		() => new Color(fogRgb[0] / 255, fogRgb[1] / 255, fogRgb[2] / 255),
		[fogRgb]
	);
	const bloomIntensity = isHigh ? 0.45 : 0.22;
	const noiseOpacity = isHigh ? 0.08 : 0;

	useEffect(() => {
		const ink = readCssRgb('--color-ink', fallbackInk);
		setTerrainBackground([ink[0] / 255, ink[1] / 255, ink[2] / 255]);
		setFogRgb(ink);
	}, [theme]);

	const background = isTerrain
		? terrainBackground
		: theme === 'bright'
			? [244 / 255, 247 / 255, 251 / 255]
			: [0, 0, 0];
	const fogNear = isTerrain ? 3.4 : 2.6;
	const fogFar = isTerrain ? 8.4 : 6.6;
	if (tier === 'off') return null;

	return (
		<div className="absolute inset-0 -z-10">
			<Canvas
				dpr={tier === 'high' ? [1, 2] : [1, 1.5]}
				camera={isTerrain ? { position: [0, 1.2, 3.6], fov: 48 } : { position: [0, 0, 4], fov: 52 }}
			>
				<color attach="background" args={background} />
				<ambientLight intensity={isTerrain ? 0.3 : 0.6} />
				<pointLight position={[3, 2, 2]} intensity={isTerrain ? 0.6 : 1.2} />
				<fog attach="fog" args={[fogColor, fogNear, fogFar]} />
				<SectionCameraRig sectionId={sectionId ?? variant} isTerrain={isTerrain} />
				<SheetProvider sheet={sheet}>
					<Suspense fallback={null}>
						<Environment preset={isTerrain ? 'night' : 'warehouse'} />
						{variantMap[variant](tier)}
					</Suspense>
					<EffectComposer multisampling={isHigh ? 4 : 0}>
						<Bloom
							intensity={bloomIntensity}
							luminanceThreshold={0.2}
							luminanceSmoothing={0.9}
						/>
						{noiseOpacity > 0 && <Noise opacity={noiseOpacity} />}
					</EffectComposer>
				</SheetProvider>
			</Canvas>
		</div>
	);
}

function SectionCameraRig({ sectionId, isTerrain }: { sectionId: string; isTerrain: boolean }) {
	const { camera } = useThree();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const section = document.getElementById(sectionId);
		if (!section) return;

		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			gsap.fromTo(
				camera.position,
				{
					x: isTerrain ? -0.2 : -0.3,
					y: isTerrain ? 0.35 : -0.55,
					z: isTerrain ? 4.3 : 4.6,
				},
				{
					x: isTerrain ? 0.45 : 0.28,
					y: isTerrain ? 1.0 : 0.2,
					z: isTerrain ? 3.1 : 3.3,
					ease: 'none',
					scrollTrigger: {
						trigger: section,
						start: 'top 90%',
						end: 'bottom 10%',
						scrub: true,
					},
				}
			);
		}, section);

		return () => ctx.revert();
	}, [camera, sectionId, isTerrain]);

	return null;
}
