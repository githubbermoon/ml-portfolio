# ML Portfolio / Realms Content Split

## Source of truth
Use this folder for all future work:

```text
/Users/pranjal/Projects/gitLocal/ml-portfolio
```

Avoid editing old Codex copies unless you intentionally plan to cherry-pick/sync changes back.

## Deployment targets

| Target | URL | Purpose | Build command | Base path |
|---|---|---|---|---|
| GitHub Pages | `https://githubbermoon.github.io/ml-portfolio/` | Professional ML portfolio | `pnpm build:github` | `/ml-portfolio/` |
| Cloudflare Pages | `https://realms-58q.pages.dev/` | Realms/library/experimental site | `pnpm build:cloudflare` | `/` |

## Current content map

| Content/page | GitHub Pages professional site | Cloudflare Realms site |
|---|---|---|
| Home page | Professional homepage from `src/components/ProfessionalHome.astro` | Immersive Realms homepage from `src/components/RealmsHome.astro` |
| CV / resume PDF | Yes | No — Cloudflare redirects `/pranjal-cv.pdf` away via `public/_redirects` |
| Projects | Yes | No — Cloudflare redirects `/projects` and `/projects/*` away |
| Professional technical blog | Yes | No — Cloudflare redirects selected technical/professional routes away |
| UHI Bengaluru article | Yes/professional research article | Redirected away on Cloudflare |
| Glass Fidelity post | Yes/professional technical post | Redirected away on Cloudflare |
| Astrology | No / should not be linked from professional site | Yes |
| Cooking | No / should not be linked from professional site | Yes |
| Essays / field notes | No / should not be linked from professional site | Yes |
| Reading notes | No / should not be linked from professional site | Yes |
| Dharma / manifesto / experimental pages | No / should not be linked from professional site | Yes |
| Password gate | Disabled on GitHub Pages | Enabled only when `SITE_MODE=realms` |
| Workers AI / Lore API | No | Yes, Cloudflare only |

## How the split works

`src/pages/index.astro` chooses the correct homepage at build time:

```astro
const mode = import.meta.env.SITE_MODE;
{mode === "realms" ? <RealmsHome /> : <ProfessionalHome />}
```

Build scripts in `package.json` set the mode:

```json
"build:cloudflare": "SITE_BASE=/ SITE_MODE=realms astro build",
"build:github": "SITE_BASE=/ml-portfolio/ astro build"
```

Cloudflare-only redirects live in:

```text
public/_redirects
```

Cloudflare honors this file; GitHub Pages ignores it.

## Maintenance rules

1. Put professional content in the GitHub Pages surface only.
2. Put library/experimental/spiritual/cooking/astrology/field-note content in Realms only.
3. If a route should not appear on Realms, add it to `public/_redirects`.
4. If a route should not appear on GitHub Pages, do not link it from the professional homepage/nav; if stricter blocking is needed, add a build-time/client redirect in that page.
5. Always test both builds before deploying:

```bash
pnpm build:github
pnpm build:cloudflare
```

6. Deploy Cloudflare manually if needed:

```bash
pnpm deploy:cloudflare
```

7. GitHub Pages deploys automatically on push to `master` via `.github/workflows/deploy.yml`.

## Last known working split

- GitHub homepage renders professional title/CV link.
- Cloudflare homepage renders Realms homepage and no CV link.
- Password gate activates only in Realms mode.
- Cloudflare redirects professional-only routes away from Realms.
