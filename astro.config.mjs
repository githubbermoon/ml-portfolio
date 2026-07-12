// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
const siteBase = process.env.SITE_BASE ?? (process.env.CF_PAGES ? '/' : '/ml-portfolio/');

// https://astro.build/config
export default defineConfig({

	integrations: [react(), mdx(), tailwind()],
	base: siteBase,
	vite: {
		resolve: {
			dedupe: ['react', 'react-dom'],
		},
	},
});
