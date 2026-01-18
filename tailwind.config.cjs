/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				display: ['var(--font-display)'],
				ui: ['var(--font-ui)'],
				mono: ['var(--font-mono)'],
			},
			colors: {
				ink: 'rgb(var(--color-ink) / <alpha-value>)',
				fog: 'rgb(var(--color-fog) / <alpha-value>)',
				glass: 'rgb(var(--color-glass) / <alpha-value>)',
				mist: 'rgb(var(--color-mist) / <alpha-value>)',
				glow: 'rgb(var(--color-glow) / <alpha-value>)',
				amber: 'rgb(var(--color-amber) / <alpha-value>)',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
