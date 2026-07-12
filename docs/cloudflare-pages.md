# Cloudflare Pages Deploy

Use this when deploying the realms site to Cloudflare Pages.

## Dashboard Settings

- Framework preset: `Astro`
- Build command: `pnpm build:cloudflare`
- Build output directory: `dist`
- Root directory: repository root
- Node version: `22`

## Why This Differs From GitHub Pages

GitHub Pages currently serves the site under `/ml-portfolio/`, so the default build keeps that base path.
Cloudflare Pages should serve the site at `/`, especially when attached to a custom domain.

The Astro config handles both:

- GitHub/local default: `/ml-portfolio/`
- Cloudflare Pages: `/`
- Manual override: `SITE_BASE=/some-path/ pnpm build`

## Direct Upload Alternative

After logging into Wrangler, this also works:

```bash
pnpm build:cloudflare
npx wrangler pages deploy ./dist --project-name=<cloudflare-pages-project-name>
```
