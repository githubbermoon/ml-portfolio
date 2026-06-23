import { lazy, Suspense, useEffect, useState } from 'react';
import { detectAutoTier, getStoredTier, type PerfTier } from '../lib/perfGate';

const HeroScene = lazy(() => import('./HeroScene'));
const SectionScene = lazy(() => import('./SectionScene'));

type SceneKind = 'hero' | 'section';
type SectionVariant = 'pipeline' | 'carousel' | 'calm' | 'terrain' | 'video';

type Props = {
	kind: SceneKind;
	sectionId?: string;
	variant?: SectionVariant;
};

const resolveStoredTier = async (): Promise<PerfTier> => {
	const stored = getStoredTier();
	if (stored === 'auto') return detectAutoTier();
	return stored;
};

export default function SceneGate({ kind, sectionId, variant = 'pipeline' }: Props) {
	const [tier, setTier] = useState<PerfTier>('off');
	const [isVisible, setIsVisible] = useState(kind === 'hero');

	useEffect(() => {
		let isMounted = true;
		resolveStoredTier().then((resolved) => {
			if (isMounted) setTier(resolved);
		});

		const handle = (event: Event) => {
			const detail = (event as CustomEvent<{ tier: PerfTier | 'auto' }>).detail;
			const nextTier = detail?.tier;
			if (!nextTier) return;
			if (nextTier === 'auto') {
				detectAutoTier().then((resolved) => {
					if (isMounted) setTier(resolved);
				});
				return;
			}
			setTier(nextTier);
		};

		window.addEventListener('perf-tier-change', handle);
		return () => {
			isMounted = false;
			window.removeEventListener('perf-tier-change', handle);
		};
	}, []);

	useEffect(() => {
		if (kind === 'hero' || isVisible) return;
		if (!sectionId) return;
		const target = document.getElementById(sectionId);
		if (!target) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ rootMargin: '500px 0px' }
		);

		observer.observe(target);
		return () => observer.disconnect();
	}, [isVisible, kind, sectionId]);

	if (tier === 'off' || !isVisible) return null;

	return (
		<Suspense fallback={null}>
			{kind === 'hero' ? (
				<HeroScene />
			) : (
				<SectionScene variant={variant} sectionId={sectionId} />
			)}
		</Suspense>
	);
}
