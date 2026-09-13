// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isRealms = process.env.SITE_MODE === 'realms';

export default defineConfig({
  site: isRealms ? 'https://realms-58q.pages.dev' : 'https://githubbermoon.github.io',
  base: isRealms ? '/' : '/ml-portfolio/',
  integrations: [react(), mdx(), tailwind()],
  // We use the include/exclude pattern for directories
  build: {
    format: 'directory',
  },
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@tldraw/state': path.resolve(__dirname, 'node_modules/@tldraw/state'),
        '@tldraw/store': path.resolve(__dirname, 'node_modules/@tldraw/store'),
        '@tldraw/utils': path.resolve(__dirname, 'node_modules/@tldraw/utils'),
        '@tldraw/editor': path.resolve(__dirname, 'node_modules/@tldraw/editor'),
      },
    },
  },
});
