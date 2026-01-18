import { useEffect, useMemo, useState } from 'react';

type FilmMode = 'auto' | 'on' | 'off';

const STORAGE_KEY = 'clawd-film';

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const prefersContrast = () =>
	window.matchMedia('(prefers-contrast: more)').matches;

const isBrightMode = () =>
	document.documentElement.dataset.theme === 'bright';

const getAutoEnabled = () =>
	!(prefersReducedMotion() || prefersContrast() || isBrightMode());

const applyFilm = (mode: FilmMode) => {
	const restricted = prefersReducedMotion() || prefersContrast();
	const enabled = !restricted && (mode === 'on' || (mode === 'auto' && getAutoEnabled()));
	document.documentElement.dataset.film = enabled ? 'on' : 'off';
	window.dispatchEvent(new CustomEvent('film-change', { detail: { enabled } }));
};

const storeFilm = (mode: FilmMode) => {
	if (mode === 'auto') {
		localStorage.removeItem(STORAGE_KEY);
		return;
	}
	localStorage.setItem(STORAGE_KEY, mode);
};

export default function FilmToggle() {
	const [mode, setMode] = useState<FilmMode>('auto');
	const restricted = useMemo(
		() => (typeof window === 'undefined' ? false : prefersReducedMotion() || prefersContrast()),
		[]
	);

	useEffect(() => {
		const stored = (localStorage.getItem(STORAGE_KEY) as FilmMode | null) ?? 'auto';
		setMode(stored);
	}, []);

	useEffect(() => {
		if (restricted) {
			setMode('off');
			applyFilm('off');
			return;
		}
		applyFilm(mode);
	}, [mode, restricted]);

	useEffect(() => {
		if (restricted) return;
		const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const mediaContrast = window.matchMedia('(prefers-contrast: more)');
		const handle = () => mode === 'auto' && applyFilm('auto');
		mediaMotion.addEventListener('change', handle);
		mediaContrast.addEventListener('change', handle);
		window.addEventListener('theme-change', handle);
		return () => {
			mediaMotion.removeEventListener('change', handle);
			mediaContrast.removeEventListener('change', handle);
			window.removeEventListener('theme-change', handle);
		};
	}, [mode, restricted]);

	const handleSelect = (nextMode: FilmMode) => {
		setMode(nextMode);
		storeFilm(nextMode);
	};

	return (
		<div className="flex items-center gap-2 text-xs text-mist">
			<span className="uppercase tracking-[0.2em]">Film</span>
			<div className="flex items-center gap-1 rounded-full border border-mist/40 p-1">
				{(['auto', 'on', 'off'] as FilmMode[]).map((option) => (
					<button
						key={option}
						onClick={() => handleSelect(option)}
						disabled={restricted}
						className={`rounded-full px-2 py-1 text-[10px] transition ${
							mode === option
								? 'bg-glass/10 text-glass'
								: 'text-mist'
						} ${restricted ? 'opacity-50' : ''}`}
					>
						{option.toUpperCase()}
					</button>
				))}
			</div>
			{restricted && <span className="text-mist">Reduced motion</span>}
		</div>
	);
}
