import { lazy, Suspense, useEffect, useState } from 'react';
import { detectAutoTier, getStoredTier, type PerfTier } from '../lib/perfGate';

const FloraFooter = lazy(() => import('./FloraFooter'));

type ToggleTier = PerfTier | 'auto';

const resolveTier = async (tier: ToggleTier): Promise<PerfTier> => {
	if (tier === 'auto') return detectAutoTier();
	return tier;
};

export default function FloraGate() {
	const [tier, setTier] = useState<PerfTier>('off');

	useEffect(() => {
		let mounted = true;

		resolveTier(getStoredTier()).then((resolved) => {
			if (mounted) setTier(resolved);
		});

		const handleTierChange = (event: Event) => {
			const nextTier = (event as CustomEvent<{ tier?: ToggleTier }>).detail?.tier;
			if (!nextTier) return;
			resolveTier(nextTier).then((resolved) => {
				if (mounted) setTier(resolved);
			});
		};

		window.addEventListener('perf-tier-change', handleTierChange);
		return () => {
			mounted = false;
			window.removeEventListener('perf-tier-change', handleTierChange);
		};
	}, []);

	if (tier === 'off') return null;

	return (
		<div className="absolute inset-0 z-[1] pointer-events-none opacity-80">
			<Suspense fallback={null}>
				<FloraFooter height="100%" />
			</Suspense>
		</div>
	);
}
