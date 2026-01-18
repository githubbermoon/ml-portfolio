import { useEffect, useMemo, useState } from 'react';

type ThemeMode = 'dark' | 'bright' | 'auto';
type ResolvedTheme = 'dark' | 'bright';

const STORAGE_KEY = 'clawd-theme';

const getPreferredTheme = (): ResolvedTheme => {
	if (typeof window === 'undefined') return 'dark';
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'bright' : 'dark';
};

const resolveTheme = (mode: ThemeMode): ResolvedTheme =>
	mode === 'auto' ? getPreferredTheme() : mode;

const setDocumentTheme = (theme: ResolvedTheme) => {
	document.documentElement.dataset.theme = theme;
	window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
};

const storeTheme = (mode: ThemeMode) => {
	if (mode === 'auto') {
		localStorage.removeItem(STORAGE_KEY);
		return;
	}
	localStorage.setItem(STORAGE_KEY, mode);
};

const SunIcon = () => (
	<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
		<circle cx="12" cy="12" r="4" fill="currentColor" />
		<g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
			<path d="M12 3v2" />
			<path d="M12 19v2" />
			<path d="M4.5 4.5l1.4 1.4" />
			<path d="M18.1 18.1l1.4 1.4" />
			<path d="M3 12h2" />
			<path d="M19 12h2" />
			<path d="M4.5 19.5l1.4-1.4" />
			<path d="M18.1 5.9l1.4-1.4" />
		</g>
	</svg>
);

const MoonIcon = () => (
	<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
		<path
			d="M20.5 14.5a8.5 8.5 0 0 1-11-11 7 7 0 1 0 11 11Z"
			fill="currentColor"
		/>
	</svg>
);

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>('auto');
	const resolved = useMemo(() => resolveTheme(mode), [mode]);

	useEffect(() => {
		const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'auto';
		setMode(stored);
	}, []);

	useEffect(() => {
		setDocumentTheme(resolved);
	}, [resolved]);

	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: light)');
		const handle = () => {
			if (mode === 'auto') {
				setDocumentTheme(resolveTheme('auto'));
			}
		};
		media.addEventListener('change', handle);
		return () => media.removeEventListener('change', handle);
	}, [mode]);

	const handleSelect = (nextMode: ThemeMode) => {
		setMode(nextMode);
		storeTheme(nextMode);
	};

	return (
		<div className="flex items-center gap-2 text-xs text-mist">
			<span className="uppercase tracking-[0.2em]">Theme</span>
			<div className="flex items-center gap-1 rounded-full border border-mist/40 p-1">
				<button
					type="button"
					onClick={() => handleSelect('auto')}
					className={`rounded-full px-2 py-1 text-[10px] transition ${
						mode === 'auto' ? 'bg-glass/10 text-glass' : 'text-mist'
					}`}
					aria-pressed={mode === 'auto'}
				>
					Auto
				</button>
				<button
					type="button"
					onClick={() => handleSelect('dark')}
					className={`rounded-full p-2 transition ${
						mode === 'dark' ? 'bg-glass/10 text-glass' : 'text-mist'
					}`}
					aria-pressed={mode === 'dark'}
					title="Dark"
				>
					<MoonIcon />
					<span className="sr-only">Dark</span>
				</button>
				<button
					type="button"
					onClick={() => handleSelect('bright')}
					className={`rounded-full p-2 transition ${
						mode === 'bright' ? 'bg-glass/10 text-glass' : 'text-mist'
					}`}
					aria-pressed={mode === 'bright'}
					title="Bright"
				>
					<SunIcon />
					<span className="sr-only">Bright</span>
				</button>
			</div>
			{mode === 'auto' && <span className="text-mist">Auto: {resolved}</span>}
		</div>
	);
}
