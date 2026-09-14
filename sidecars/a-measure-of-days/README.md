# A Measure of Days — editorial sidecar

This is the independent Eleventy edition mounted by the main Astro site at
`/experiments/a-measure-of-days/`.

## Architecture

- Eleventy 3 for static generation
- Nunjucks for page composition
- WebC for repeated editorial components
- Markdown for the colophon
- Sass for the visual system
- Rollup for route-aware ES modules
- GSAP, ScrollTrigger, SplitText, and CustomEase for motion
- Taxi for navigation transitions
- Eleventy Image for responsive WebP/JPEG output

The source is self-contained in this directory. Its build writes the finished
edition into `../../public/experiments/a-measure-of-days/`; two thin Astro
routes read those documents so Astro's local server preserves the clean URLs.

From the repository root:

```sh
pnpm dev:realms
```

To rebuild only this edition:

```sh
pnpm editorial:build
```

The repository is a pnpm workspace. Install dependencies once from the repository root with `pnpm install`; this sidecar is included in the shared lockfile and does not maintain a separate package-manager lock.

## Typography

The included edition uses the open-source Italiana, Source Serif 4, and DM Mono
families. See `src/fonts/README.md` before replacing these with licensed
commercial webfonts.
