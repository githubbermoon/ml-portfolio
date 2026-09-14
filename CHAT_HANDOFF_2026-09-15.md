# Kosh / Realms handoff — 15 September 2026

Use this document to continue the website work in a new Codex chat without reconstructing the project history.

## Repository and current state

- Repository: `https://github.com/githubbermoon/ml-portfolio`
- Local checkout: `/Users/pranjal/Projects/gitLocal/ml-portfolio`
- Active branch: `master`
- Framework: Astro 5 with separate Professional and Realms source trees
- Realms hosting target: Cloudflare Pages project `realms`
- Professional hosting target: GitHub Pages
- Local Realms command: `pnpm dev:realms`
- Realms production build: `pnpm build:cloudflare`
- Manual Realms deployment: `pnpm deploy:cloudflare`
- The generated `src/pages/` directory must not be edited. `scripts/prepare-pages.mjs` rebuilds it from `src/realms`, `src/professional`, and `src/shared-pages`.

The most recent full Realms build passed on 15 September 2026. It built 26 routes. Existing non-blocking warnings concern an unresolved `/noise.png` reference, Astro's font runtime export, stale Browserslist data, and large JavaScript chunks.

## Important rollback points

| Tag | Commit | Meaning |
| --- | --- | --- |
| `checkpoint-pre-sidecar-last-push` | `e4d0494` | Version before the Eleventy/Nunjucks sidecar architecture |
| `checkpoint-2026-09-14-editorial-remix` | `d7b5f18` | Editorial system and immersive essay sidecar |
| `checkpoint-2026-09-15-visitor-trial` | `8160af7` | Editorial refinements, Hindi essay, trial fonts, and initial visitor-measurement implementation |

All three tags are published on GitHub. Do not move or overwrite these tags.

## Visual direction

The user wants Kosh to draw from Henry Desroches' editorial sensibility without copying his identity:

- Large, overlapping editorial typography
- Mounted-paper and archival-image compositions
- Quiet prose alternating with theatrical visual chapters
- Hairline rules, marginalia, folio numbers, captions, and restrained motion
- Original image colours must be preserved; do not globally monochrome imagery
- Licensed trial fonts are currently self-hosted from `public/fonts/trial/`
- DaVinci is used for monumental display work, Louize for editorial serif text, and Neue Montreal for interface/meta text
- Font changes and reversal notes are recorded in `docs/TRIAL_FONT_CHANGELOG.md`

The full page inventory, local links, site flowchart, and page-by-page content roadmap live in `SITE_PAGES.md`. There are 25 visitor-facing pages plus utility routes.

## Sidecar architecture

The experimental full Henry-style architecture lives in `sidecars/a-measure-of-days/` and uses Eleventy, Nunjucks, Sass, Rollup, GSAP, ScrollTrigger, SplitText, CustomEase, and image processing.

- Source: `sidecars/a-measure-of-days/src/`
- Generated output: `public/experiments/a-measure-of-days/`
- Generated output is ignored by Git and must be rebuilt from source.
- Astro comparison page: `/essays/a-measure-of-days/`
- Full sidecar comparison: `/experiments/a-measure-of-days/`
- Kosh Garden experiment: `/experiments/kosh-garden/`

## Visitor-measurement trial

The user requested a one-month experiment to compare visits from their own devices using raw IP storage, Cloudflare IP geolocation, first-party analytics cookies, and browser fingerprinting.

### Current behaviour

- Trial ends automatically at `2026-10-15T18:29:59.000Z` (15 October 2026, 23:59:59 IST).
- KV events expire after 31 days.
- There is no opening consent banner.
- There is no persistent bottom-corner preferences control.
- New devices are not measured automatically.
- The control is named **Visitor measurement** and lives inside the top-right three-line Realms navigation menu.
- On each test device: open the three-line menu, choose **Visitor measurement**, enable **Allow visitor analytics**, then save.
- Previously accepted devices continue measuring automatically.
- Disabling measurement deletes that browser's visitor and session cookies.

This design deliberately keeps ordinary visits quiet while allowing explicit testing on selected devices. Do not silently turn on fingerprinting for every visitor without revisiting that decision with the user.

### Recorded after enabling

- Raw request IP from Cloudflare request headers
- Approximate country, region, city, postal code, coordinates, timezone, continent, and ASN when Cloudflare supplies them
- Random visitor ID cookie lasting 31 days
- Session ID cookie refreshed for 30 minutes
- SHA-256 browser fingerprint derived from browser, platform, language, hardware concurrency, device memory, touch points, screen, pixel ratio, timezone, canvas, and WebGL renderer
- Page view, title, referrer, device summary, duration, maximum scroll depth, and outbound-link hostname

### Main files

- `src/components/VisitorMeasurement.astro` — preferences dialog, cookies, fingerprinting, and browser events
- `src/islands/MobileNav.tsx` — menu entry that opens visitor preferences
- `src/islands/realms-menu.css` — menu-entry styling
- `functions/api/analytics.js` — Cloudflare Pages Function for writes and protected exports
- `wrangler.toml` — trial end, retention, and `REALMS_KV` binding
- `docs/VISITOR_MEASUREMENT_TRIAL.md` — operational and reversal notes

The component is mounted only in the Realms build through `src/layouts/BaseLayout.astro`. The browser never receives its raw IP or Cloudflare location record.

### Deployment prerequisite

Configure a strong Cloudflare Pages secret named `ANALYTICS_ADMIN_TOKEN` before trying to export records. Never commit its value. The protected export is:

```text
GET /api/analytics?limit=100
Authorization: Bearer <ANALYTICS_ADMIN_TOKEN>
```

The `POST /api/analytics` endpoint accepts events only when the same-origin request contains `kosh_consent=accepted` plus visitor and session cookies. The export currently returns JSON; there is no visual private dashboard yet. A sensible next feature is an authenticated visitor-lab dashboard that groups test devices by cookie ID, fingerprint, IP, country, and session.

Pushing `master` triggers the Professional GitHub Pages workflow only. It does not run the manual Cloudflare Realms deployment command.

## Latest UI change

The latest UI refinement removes the original Accept/Change-preferences prompt and the permanent corner link, then adds the preferences entry to the top-right three-line navigation menu. The Realms build passes with this refinement.

## User preferences and guardrails

- Preserve all unrelated user changes in this already-active repository.
- Keep photographs in their original colour unless a specific image treatment is requested.
- Use `apply_patch` for hand edits.
- Do not commit `.playwright-cli/`, `analysis_assets/`, `design_analysis/`, `output/`, generated `src/pages/`, or generated `public/experiments/a-measure-of-days/`.
- Do not commit secrets or analytics exports containing visitor IP addresses.
- The user prefers compact controls and dislikes permanent floating interface elements.
- For major states, create descriptive Git commits and rollback tags rather than overwriting older checkpoints.

## Suggested next-chat opening task

1. Read this file, `SITE_PAGES.md`, `docs/TRIAL_FONT_CHANGELOG.md`, and `docs/VISITOR_MEASUREMENT_TRIAL.md`.
2. Confirm the latest commit and working-tree status before editing.
3. If testing analytics, configure the Cloudflare admin secret and deploy the Realms build.
4. Enable visitor measurement manually on each test device.
5. After sample visits, build or query the private export and compare cookie ID, fingerprint stability, IP changes, location accuracy, sessions, and browser differences.
