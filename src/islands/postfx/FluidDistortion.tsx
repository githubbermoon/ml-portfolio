import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { BlendFunction, Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';

const fragmentShader = /* glsl */ `
uniform float time;
uniform float strength;
uniform vec2 pointer;
uniform vec2 resolution;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec2 centered = uv - pointer;
	float dist = length(centered);
	float ripple = sin((dist * 24.0) - (time * 2.4)) * 0.004;
	float swirl = cos((dist * 12.0) - (time * 1.2)) * 0.003;
	vec2 offset = centered * (ripple + swirl) * strength * 10.0;
	vec2 warped = uv + offset;
	vec4 color = texture(inputBuffer, warped);
	outputColor = color;
}
`;

class FluidDistortionEffect extends Effect {
	constructor({ strength = 0.035 }: { strength?: number } = {}) {
		super('FluidDistortionEffect', fragmentShader, {
			blendFunction: BlendFunction.NORMAL,
			uniforms: new Map([
				['time', new Uniform(0)],
				['strength', new Uniform(strength)],
				['pointer', new Uniform(new Vector2(0.5, 0.5))],
				['resolution', new Uniform(new Vector2(1, 1))],
			]),
		});
	}
}

type Props = {
	strength?: number;
};

export default function FluidDistortion({ strength = 0.035 }: Props) {
	const effect = useMemo(() => new FluidDistortionEffect({ strength }), [strength]);
	const { size, pointer } = useThree();

	useFrame((_, delta) => {
		effect.uniforms.get('time')!.value += delta;
		effect.uniforms.get('pointer')!.value.set((pointer.x + 1) / 2, (pointer.y + 1) / 2);
		effect.uniforms.get('resolution')!.value.set(size.width, size.height);
	});

	return <primitive object={effect} dispose={null} />;
}
