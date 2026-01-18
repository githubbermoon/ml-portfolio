import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'bright';

export const getResolvedTheme = (): Theme => {
	if (typeof document === 'undefined') return 'dark';
	return document.documentElement.dataset.theme === 'bright' ? 'bright' : 'dark';
};

export const useResolvedTheme = (): Theme => {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		const update = () => setTheme(getResolvedTheme());
		update();

		const handle = (event: Event) => {
			const detail = (event as CustomEvent<{ theme?: Theme }>).detail;
			if (detail?.theme) {
				setTheme(detail.theme);
				return;
			}
			update();
		};

		window.addEventListener('theme-change', handle);
		return () => window.removeEventListener('theme-change', handle);
	}, []);

	return theme;
};
