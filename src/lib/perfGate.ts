export type PerfTier = 'off' | 'standard' | 'high';

const STORAGE_KEY = 'clawd-perf-tier';

export const getStoredTier = (): PerfTier | 'auto' => {
	if (typeof window === 'undefined') return 'auto';
	return (localStorage.getItem(STORAGE_KEY) as PerfTier | null) ?? 'auto';
};

export const setStoredTier = (tier: PerfTier | 'auto') => {
	if (typeof window === 'undefined') return;
	if (tier === 'auto') {
		localStorage.removeItem(STORAGE_KEY);
		return;
	}
	localStorage.setItem(STORAGE_KEY, tier);
};

const supportsWebGL = () => {
	if (typeof document === 'undefined') return false;
	const canvas = document.createElement('canvas');
	return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
};

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const isLikelyMobile = () => {
	if (typeof window === 'undefined') return false;
	const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
	const uaMobile = navigator.userAgentData?.mobile === true;
	return coarsePointer || uaMobile || window.innerWidth < 768;
};

const isLowPower = () => {
	const memory = navigator.deviceMemory ?? 8;
	const cores = navigator.hardwareConcurrency ?? 8;
	return memory <= 4 || cores <= 4;
};

const measureFps = (durationMs = 350): Promise<number> =>
	new Promise((resolve) => {
		let frames = 0;
		const start = performance.now();
		const tick = (now: number) => {
			frames += 1;
			if (now - start >= durationMs) {
				const fps = (frames / (now - start)) * 1000;
				resolve(fps);
				return;
			}
			requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	});

export const detectAutoTier = async (): Promise<PerfTier> => {
	if (!supportsWebGL() || prefersReducedMotion()) return 'off';
	if (isLowPower()) return 'standard';
	if (isLikelyMobile()) return 'standard';
	const fps = await measureFps();
	return fps < 50 ? 'standard' : 'high';
};
