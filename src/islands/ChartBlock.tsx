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
		const plot = Plot.plot({
			marginLeft: 60,
			height: 220,
			y: { label: null, grid: true },
			x: { label: null },
			color: { range: ['#7dd3fc'] },
			marks: [Plot.barX(data, { x: 'value', y: 'label', fill: 'label' })],
		});
		containerRef.current.append(plot);
		return () => plot.remove();
	}, []);

	return <div className="glass-panel p-6" ref={containerRef} />;
}
