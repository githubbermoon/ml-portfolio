import { useEffect, useState } from 'react';
import { detectAutoTier, getStoredTier, setStoredTier, type PerfTier } from '../lib/perfGate';

type ToggleTier = PerfTier | 'auto';

const options: { label: string; value: ToggleTier }[] = [
	{ label: 'Auto', value: 'auto' },
	{ label: 'High', value: 'high' },
	{ label: 'Standard', value: 'standard' },
	{ label: 'Off', value: 'off' },
];

const emitTier = (tier: ToggleTier) => {
	window.dispatchEvent(new CustomEvent('perf-tier-change', { detail: { tier } }));
};

export default function PerformanceToggle() {
	const [tier, setTier] = useState<ToggleTier>('auto');
	const [autoTier, setAutoTier] = useState<PerfTier>('standard');

	useEffect(() => {
		const stored = getStoredTier();
		setTier(stored);
		if (stored === 'auto') {
			detectAutoTier().then((detected) => {
				setAutoTier(detected);
				emitTier(detected);
			});
		} else {
			emitTier(stored);
		}
	}, []);

	const handleSelect = (value: ToggleTier) => {
		setTier(value);
		setStoredTier(value);
		if (value === 'auto') {
			detectAutoTier().then((detected) => {
				setAutoTier(detected);
				emitTier(detected);
			});
			return;
		}
		emitTier(value);
	};

	return (
		<div className="flex flex-wrap items-center gap-2 text-xs text-mist">
			<span className="uppercase tracking-[0.2em]">Performance</span>
			<div className="flex gap-2">
				{options.map((option) => (
					<button
						key={option.value}
						onClick={() => handleSelect(option.value)}
						className={`rounded-full border px-3 py-1 transition ${
							tier === option.value
								? 'border-glass/60 text-glass'
								: 'border-mist/40 hover:border-glass/50'
						}`}
					>
						{option.label}
					</button>
				))}
			</div>
			{tier === 'auto' && (
				<span className="text-mist">Auto: {autoTier}</span>
			)}
		</div>
	);
}
