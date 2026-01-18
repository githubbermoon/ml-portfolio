/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				display: ['var(--font-display)'],
				ui: ['var(--font-ui)'],
			},
			colors: {
				ink: '#0b0f14',
				fog: '#cfd8e3',
				glass: '#e6edf5',
				mist: '#94a3b8',
				glow: '#7dd3fc',
				amber: '#f59e0b',
			},
			boxShadow: {
				glass: '0 10px 40px rgba(15, 23, 42, 0.2)',
			},
			backgroundImage: {
				haze: 'radial-gradient(1200px 800px at 20% -20%, rgba(125, 211, 252, 0.18), transparent 60%), radial-gradient(800px 600px at 90% 20%, rgba(245, 158, 11, 0.12), transparent 60%)',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
