import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';

type Datum = {
	label: string;
	value: number;
};

const data: Datum[] = [
	{ label: 'Latency', value: 28 },
	{ label: 'Accuracy', value: 92 },
	{ label: 'Throughput', value: 76 },
	{ label: 'Cost', value: 41 },
];

export default function ChartBlock() {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		let plot: HTMLElement | SVGSVGElement | null = null;
		const render = () => {
			if (!containerRef.current) return;
			if (plot) plot.remove();
			plot = Plot.plot({
				marginLeft: 60,
				height: 220,
				y: { label: null, grid: true },
				x: { label: null },
				style: {
					background: 'transparent',
					color: 'currentColor',
					fontFamily: 'var(--font-ui)',
				},
				color: { range: ['#7dd3fc'] },
				marks: [Plot.barX(data, { x: 'value', y: 'label', fill: 'label' })],
			});
			containerRef.current.append(plot);
		};

		render();
		const handle = () => render();
		window.addEventListener('theme-change', handle);
		return () => {
			window.removeEventListener('theme-change', handle);
			if (plot) plot.remove();
		};
	}, []);

	return <div className="glass-panel p-6 text-glass" ref={containerRef} />;
}
