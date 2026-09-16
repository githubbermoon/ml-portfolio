import { useEffect, useMemo, useState } from 'react';
import { Moon as MoonIcon, Sun as SunIcon } from 'lucide-react';

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
	localStorage.setItem(STORAGE_KEY, mode);
};

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>('bright');
	const resolved = useMemo(() => resolveTheme(mode), [mode]);

	useEffect(() => {
		const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'bright';
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
		<div className="theme-toggle relative z-[101] flex items-center text-xs pointer-events-auto">
			<span className="sr-only">Theme</span>
			<div className="theme-toggle-shell flex items-center gap-0.5 rounded-full p-1 backdrop-blur-xl">
				<button
					type="button"
					onClick={() => handleSelect('auto')}
					className="theme-toggle-option rounded-full px-2 py-1 text-[10px] transition"
					data-active={mode === 'auto'}
					aria-pressed={mode === 'auto'}
					title="Auto theme"
				>
					A
				</button>
				<button
					type="button"
					onClick={() => handleSelect('dark')}
					className="theme-toggle-option rounded-full p-2 transition"
					data-active={mode === 'dark'}
					aria-pressed={mode === 'dark'}
					title="Dark"
				>
					<MoonIcon className="h-4 w-4" />
					<span className="sr-only">Dark</span>
				</button>
				<button
					type="button"
					onClick={() => handleSelect('bright')}
					className="theme-toggle-option rounded-full p-2 transition"
					data-active={mode === 'bright'}
					aria-pressed={mode === 'bright'}
					title="Bright"
				>
					<SunIcon className="h-4 w-4" />
					<span className="sr-only">Bright</span>
				</button>
			</div>
		</div>
	);
}
