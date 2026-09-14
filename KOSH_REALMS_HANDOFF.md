# Kosh / Realms Website Handoff

This file is meant to be given to another coding/deployment agent. It contains the repo, hosting setup, build/deployment rules, known local state, design intent, and the important safety checks for the Kosh / Realms website hosted on Cloudflare Pages.

---

## 1. Source repo and important paths

- **GitHub repo:** <https://github.com/githubbermoon/ml-portfolio>
- **Local repo path on Pranjal's Mac:** `/Users/pranjal/Projects/gitLocal/ml-portfolio`
- **Main branch:** `master`
- **Primary Git remote:** `origin`
- **Remote URL:** `https://github.com/githubbermoon/ml-portfolio.git`
- **Cloudflare Pages project name:** `realms`
- **Current Realms / Kosh live origin in config:** `https://realms-58q.pages.dev`
- **GitHub Pages / professional site origin:** `https://githubbermoon.github.io/ml-portfolio/`

This repo is a **dual-surface Astro site**:

1. **Professional portfolio surface**
   - Built with `SITE_MODE=professional`
   - Hosted on GitHub Pages
   - Base path: `/ml-portfolio/`

2. **Realms / Kosh surface**
   - Built with `SITE_MODE=realms`
   - Hosted on Cloudflare Pages
   - Base path: `/`
   - Cloudflare Pages project: `realms`

**Critical rule:** do not accidentally leak professional-only content into the Cloudflare Realms/Kosh build, and do not convert the GitHub Pages workflow into a Realms deploy unless explicitly requested.

---

## 2. Current local git state

At the time this handoff was written, the local repo had these recent commits:

```text
3b21376 Extend Hindi toggle across Realms pages
05db6f6 Add English Hindi language toggle
136c048 Add Ishputra page with reels
0fa3811 Add design trial page for manuscript ornaments
a1a2876 Fix menu click target by removing pointer-events-none
```

The repo was on branch `master`, tracking `origin/master`.

Current local status showed uncommitted/untracked work:

```text
## master...origin/master
 M astro.config.mjs
 M package.json
?? analysis_assets/
?? design_analysis/
?? src/islands/RealmsTldrawCanvas.tsx
?? src/islands/realms-tldraw.css
?? src/realms/canvas.astro
```

The tracked diff at handoff time was mainly tldraw/infinite-canvas related:

- `package.json` added:
  - `tldraw`
  - `@tldraw/editor`
  - `@tldraw/state`
  - `@tldraw/store`
  - `@tldraw/utils`
- `astro.config.mjs` added Vite aliases for tldraw packages:
  - `@tldraw/state`
  - `@tldraw/store`
  - `@tldraw/utils`
  - `@tldraw/editor`

Before editing or deploying, another agent should run:

```bash
cd /Users/pranjal/Projects/gitLocal/ml-portfolio
git status --short --branch
git remote -v
git diff -- astro.config.mjs package.json
```

Do **not** overwrite or discard local changes without confirming intent.

---

## 3. Stack

The site uses:

- Astro
- React islands
- Tailwind CSS
- MDX
- Three.js / React Three Fiber
- GSAP
- Theatre.js
- Mermaid
- Observable Plot
- tldraw-related packages in current local work

Install dependencies:

```bash
pnpm install
```

Run local dev server:

```bash
pnpm dev
```

---

## 4. Build scripts

From `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "prepare:professional": "SITE_MODE=professional node scripts/prepare-pages.mjs",
    "prepare:realms": "SITE_MODE=realms node scripts/prepare-pages.mjs",
    "build": "pnpm build:github",
    "build:cloudflare": "pnpm prepare:realms && SITE_MODE=realms astro build && rm -rf dist/blog/uhi-bengaluru dist/blog/glass-fidelity dist/projects/terrain-safety dist/projects/python-api",
    "build:github": "pnpm prepare:professional && SITE_MODE=professional astro build",
    "deploy:cloudflare": "pnpm build:cloudflare && npx wrangler pages deploy ./dist --project-name=realms --branch=master",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

### Build Realms / Kosh locally

```bash
pnpm build:cloudflare
```

This command was verified successfully during handoff. It built **17 pages** into `dist/`.

Warnings observed during build:

```text
/noise.png referenced in /noise.png didn't resolve at build time
Some chunks are larger than 500 kB after minification
```

These were warnings, not blockers.

### Build professional GitHub Pages site

```bash
pnpm build:github
```

---

## 5. Dual-surface routing architecture

The repo uses this script:

```text
scripts/prepare-pages.mjs
```

The script prepares `src/pages` for Astro by copying either the Realms source tree or the professional source tree.

Behavior:

1. Deletes `src/pages`
2. Copies `src/shared-pages` into `src/pages`
3. Copies one source surface into `src/pages`:
   - `src/realms` when `SITE_MODE=realms`
   - `src/professional` when `SITE_MODE=professional`
4. Writes `src/pages/index.astro` to render:
   - `RealmsHome` for Realms/Kosh
   - `ProfessionalHome` for professional site

Important directories:

```text
src/realms/          Cloudflare / Kosh / Realms pages
src/professional/    GitHub Pages professional portfolio pages
src/shared-pages/    404, robots.txt, sitemap.xml
src/components/      Shared Astro components
src/islands/         React islands
src/layouts/         Base layout
```

This architecture exists because the user wanted a clear separation between the public professional portfolio and the more personal Realms/Kosh archive.

---

## 6. Astro config rules

File:

```text
astro.config.mjs
```

Important configuration:

```js
const isRealms = process.env.SITE_MODE === 'realms';

export default defineConfig({
  site: isRealms ? 'https://realms-58q.pages.dev' : 'https://githubbermoon.github.io',
  base: isRealms ? '/' : '/ml-portfolio/',
  integrations: [react(), mdx(), tailwind()],
  build: {
    format: 'directory',
  },
});
```

Rules:

- Cloudflare / Realms build must use `SITE_MODE=realms`.
- GitHub Pages / professional build must use `SITE_MODE=professional`.
- Realms/Kosh pages should not hardcode `/ml-portfolio/`.
- Professional pages must remain base-safe for `/ml-portfolio/`.
- Use `import.meta.env.BASE_URL` for internal links wherever possible.

---

## 7. Cloudflare Pages deployment

Cloudflare config file:

```text
wrangler.toml
```

Current contents:

```toml
name = "realms"
compatibility_date = "2026-07-12"
pages_build_output_dir = "dist"

[vars]
DAILY_AI_LIMIT = "100"
MAX_PROMPT_CHARS = "600"

[[kv_namespaces]]
binding = "REALMS_KV"
id = "41c4a281c6c54337a1726398260b50b2"

[ai]
binding = "AI"
```

### Recommended Cloudflare Pages dashboard settings

```text
Project name: realms
Production branch: master
Framework preset: Astro or None/custom
Root directory: /
Install command: pnpm install
Build command: pnpm build:cloudflare
Build output directory: dist
Node version: 22 recommended
```

Environment variables are not strictly required for the static Realms build because `SITE_MODE=realms` is already inside the build script, but setting this is safe:

```text
SITE_MODE=realms
NODE_VERSION=22
```

If Cloudflare needs explicit pnpm versioning:

```text
PNPM_VERSION=10
```

### Direct Wrangler deploy

Existing direct deploy command:

```bash
pnpm deploy:cloudflare
```

Equivalent explicit commands:

```bash
pnpm build:cloudflare
npx wrangler pages deploy ./dist --project-name=realms --branch=master
```

Important caution: in earlier work, direct Wrangler deploy failed because Cloudflare auth was missing. Git-based Cloudflare Pages deployment via Git push had worked/preferred when production changes were approved.

For non-interactive deployment, use `CLOUDFLARE_API_TOKEN` instead of browser login:

```bash
export CLOUDFLARE_API_TOKEN=...
pnpm deploy:cloudflare
```

Never commit Cloudflare API tokens or secrets.

---

## 8. GitHub Pages deployment

GitHub Actions workflow:

```text
.github/workflows/deploy.yml
```

This deploys the **professional portfolio surface**, not the Cloudflare Kosh/Realms surface.

Workflow behavior:

- Triggered by:
  - push to `master`
  - manual `workflow_dispatch`
- Uses Node `22`
- Uses pnpm `10`
- Runs:

```bash
pnpm build:github
```

- Uploads `dist` to GitHub Pages.

It passes optional GoatCounter analytics variable:

```yaml
PUBLIC_GOATCOUNTER_CODE: ${{ vars.PUBLIC_GOATCOUNTER_CODE }}
```

Do not accidentally change this workflow to deploy the Realms/Kosh build unless explicitly instructed.

---

## 9. Current Realms / Kosh pages

Current important files under `src/realms`:

```text
src/realms/ishputra.astro
src/realms/dharma-kshetra.astro
src/realms/living-manifesto.astro
src/realms/technical-work.astro
src/realms/projects/index.astro
src/realms/blog/index.astro
src/realms/blog/ananta-nihara.astro
src/realms/blog/astrology.astro
src/realms/blog/cooking.astro
src/realms/blog/design-trial.astro
src/realms/blog/essays.astro
src/realms/blog/notes.astro
src/realms/blog/reading-notes/fear.astro
```

Current routes from the latest verified Realms build:

```text
/
/404.html
/blog-concept/
/blog/ananta-nihara/
/blog/astrology/
/blog/cooking/
/blog/design-trial/
/blog/essays/
/blog/
/blog/notes/
/blog/reading-notes/fear/
/canvas/
/dharma-kshetra/
/ishputra/
/living-manifesto/
/projects/
/robots.txt
/sitemap.xml
/technical-work/
```

Note: `/canvas/` came from untracked local files at handoff time. It may not exist in GitHub until committed and pushed.

---

## 10. Ishputra archive page

File:

```text
src/realms/ishputra.astro
```

Route:

```text
https://realms-58q.pages.dev/ishputra/
```

Purpose: a small linked archive page collecting Ishputra Instagram reels.

Current reel links:

```text
https://www.instagram.com/reel/C6ii8K0r4xF/
https://www.instagram.com/reel/C_PfOcTyxUH/
https://www.instagram.com/reel/C_QeuTRSuyO/
https://www.instagram.com/reel/DCoeKGINDdd/
```

The page uses an ivory manuscript-like style with quiet borders and a simple linked-card grid.

---

## 11. What changed, and why: design + implementation thought process

### Original problem

The site started as an ML portfolio repo, but the user also wanted a separate personal archive called **Realms / Kosh**. This archive is for Vedic sciences, symbolic systems, essays, references, experiments, and linked cultural/research material. The key concern was avoiding a confused site where professional portfolio content and personal Kosh content were mixed together.

### Main architectural decision

We split the repo into two build surfaces instead of making everything one generic portfolio:

- `src/professional` for GitHub Pages / professional portfolio
- `src/realms` for Cloudflare Pages / Kosh archive
- `src/shared-pages` for shared generated pages like `robots.txt`, `sitemap.xml`, and `404`

The `scripts/prepare-pages.mjs` script generates `src/pages` depending on `SITE_MODE`. This keeps each deployment clean while still allowing one GitHub repo to contain both surfaces.

### Design direction

The user's preference for Kosh/Realms was **not** a normal SaaS/portfolio design. The desired feel was:

- scholarly
- manuscript-like
- archival
- symbolic
- quiet and serious
- ivory/black/brown instead of bright startup gradients
- thin borders and careful spacing
- a “living Kosh” / digital archive rather than a product landing page

So the design direction moved toward:

- ivory backgrounds
- serif display text
- restrained mono labels
- dark ink-like text
- low-contrast borders
- card layouts that feel like archive slips or manuscript panels
- symbolic language around realms, yantra, dharma-kshetra, living manifesto, technical work, and Kosh

### Content changes made

The Realms/Kosh side gained dedicated pages and structure, including:

- Realms homepage through `RealmsHome.astro`
- Kosh/blog/archive routes under `src/realms/blog/`
- Ishputra linked archive at `/ishputra/`
- manuscript ornament/design trial page
- dharma-kshetra and living-manifesto style pages
- technical-work page for ancient sciences / systems work
- local/prototype work for tldraw/infinite canvas under `/canvas/`

### Language / localization changes

The user asked for an `EN / हिंदी` toggle, with Hindi-script nav labels rather than only English transliteration. The implementation added/extended:

- `LanguageToggle.tsx`
- `MobileNav.tsx`
- `data-i18n` attributes across Realms components/pages
- `localStorage` persistence using `realms-lang`
- custom event propagation using `realms-language-change`
- Hindi translations for Realms homepage, nav, Ishputra, and other visible text

The goal was to make Realms feel native to both English and Hindi contexts, especially because the archive is about Sanskritic/Vedic/symbolic systems.

### Deployment changes

The deployment logic was made mode-aware:

- `pnpm build:github` builds the professional site with `/ml-portfolio/` base.
- `pnpm build:cloudflare` builds the Realms/Kosh site with `/` base.
- Cloudflare removes selected professional routes from `dist` after build as a safety measure.
- Sitemap and robots generation are mode-aware so they point to the correct host.

### Prototype and experimental changes

There are local prototypes for Kosh/Realms ideas:

```text
/Users/pranjal/realms_kosh_seal_threejs.html
/Users/pranjal/realms_kosh_seal_threejs_backup.html
/Users/pranjal/kosh_prototype.html
```

There is also local untracked tldraw/infinite canvas work:

```text
src/realms/canvas.astro
src/islands/RealmsTldrawCanvas.tsx
src/islands/realms-tldraw.css
```

The thought process behind these prototypes was to explore Kosh as more than static pages: a symbolic archive with yantra-like spatial organization, archive cards, living maps, and interactive visual research tools. These should be treated as prototypes unless the user explicitly approves production integration.

---

## 12. Language toggle implementation notes

Relevant files:

```text
src/islands/LanguageToggle.tsx
src/islands/MobileNav.tsx
src/components/Nav.astro
src/components/RealmsHome.astro
src/layouts/BaseLayout.astro
```

Search terms:

```bash
grep -R "realms-lang\|realms-language-change\|data-i18n\|EN / हिंदी" src
```

Realms nav labels originate in:

```text
src/components/Nav.astro
```

Current Realms nav structure:

```js
[
  { href: `${base}#hero`, label: "Home", key: "nav.home" },
  { href: `${base}#capabilities`, label: "Realms", key: "nav.realms" },
  { href: `${base}projects/`, label: "Projects", key: "nav.projects" },
  { href: `${base}blog/`, label: "Kosh", key: "nav.kosh" },
  { href: `${base}#contact`, label: "Contact", key: "nav.contact" },
]
```

Preserve Hindi mappings for these keys.

---

## 13. SEO, sitemap, robots, and analytics

Important files:

```text
src/shared-pages/sitemap.xml.ts
src/shared-pages/robots.txt.ts
src/layouts/BaseLayout.astro
src/islands/AnalyticsHotkey.tsx
```

Realms sitemap currently uses:

```text
https://realms-58q.pages.dev/
```

Professional sitemap uses:

```text
https://githubbermoon.github.io/ml-portfolio/
```

If adding important Realms pages, update `src/shared-pages/sitemap.xml.ts`. Candidates to ensure in the Realms sitemap:

```text
/ishputra/
/dharma-kshetra/
/living-manifesto/
/canvas/   only if production-approved
```

Analytics notes:

- User prefers hidden, low-clutter analytics.
- There is/was a hidden analytics panel accessible with `Opt+H` or `Ctrl+H`.
- Do not promise raw IP visitor counts on static hosting.
- Prefer privacy-friendly tools such as GoatCounter or Plausible if analytics are requested.
- Do not leak professional-site analytics into the Cloudflare/Realms surface unless explicitly requested.

---

## 14. Deployment safety checklist

Before editing:

```bash
cd /Users/pranjal/Projects/gitLocal/ml-portfolio
git status --short --branch
```

Before Realms deploy:

```bash
pnpm build:cloudflare
```

Verify excluded professional content is not present in the Realms build:

```bash
grep -R "uhi-bengaluru\|glass-fidelity\|terrain-safety\|python-api" dist || true
```

Preview locally:

```bash
pnpm preview
```

Check key routes after deploy:

```bash
curl -I https://realms-58q.pages.dev/
curl -I https://realms-58q.pages.dev/blog/
curl -I https://realms-58q.pages.dev/ishputra/
curl -I https://realms-58q.pages.dev/sitemap.xml
curl -I https://realms-58q.pages.dev/robots.txt
```

If using direct Wrangler deploy:

```bash
pnpm deploy:cloudflare
```

If direct Wrangler auth fails, use Git-based Cloudflare Pages deployment or configure `CLOUDFLARE_API_TOKEN` securely.

---

## 15. Quick mental model for the next agent

```text
GitHub repo: githubbermoon/ml-portfolio
  ├── professional site
  │   ├── source: src/professional
  │   ├── build: pnpm build:github
  │   └── host: GitHub Pages at /ml-portfolio/
  │
  └── Realms / Kosh site
      ├── source: src/realms
      ├── build: pnpm build:cloudflare
      └── host: Cloudflare Pages project "realms" at /
```

For the user's Kosh website, work primarily in:

```text
src/realms/
src/components/RealmsHome.astro
src/islands/LanguageToggle.tsx
src/islands/MobileNav.tsx
src/shared-pages/sitemap.xml.ts
src/shared-pages/robots.txt.ts
```

Always build and verify with:

```bash
pnpm build:cloudflare
```
