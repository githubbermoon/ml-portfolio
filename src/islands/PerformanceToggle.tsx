import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
			<motion.div layout className="flex gap-2 rounded-full border border-mist/20 bg-glass/5 p-1">
				{options.map((option) => {
					const isActive = tier === option.value;
					return (
						<button
							key={option.value}
							onClick={() => handleSelect(option.value)}
							className={`relative rounded-full px-3 py-1 transition-colors ${
								isActive ? 'text-ink' : 'text-mist hover:text-glass'
							}`}
						>
							{isActive && (
								<motion.div
									layoutId="activeTier"
									className="absolute inset-0 rounded-full bg-glass"
									transition={{ type: 'spring', stiffness: 300, damping: 30 }}
								/>
							)}
							<span className="relative z-10">{option.label}</span>
						</button>
					);
				})}
			</motion.div>
			{tier === 'auto' && (
				<motion.span 
					initial={{ opacity: 0, x: -10 }} 
					animate={{ opacity: 1, x: 0 }}
					className="text-mist"
				>
					Auto: {autoTier}
				</motion.span>
			)}
		</div>
	);
}
