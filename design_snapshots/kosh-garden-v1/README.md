# Kosh Garden — version 1 snapshot

This directory preserves the first, cinematic interpretation of
`/experiments/kosh-garden/` before the design was revised toward the graphic
language of the `henry.codes` homepage.

To restore it, copy the two snapshot files back to their source locations:

```sh
cp design_snapshots/kosh-garden-v1/index.astro src/realms/experiments/kosh-garden/index.astro
cp design_snapshots/kosh-garden-v1/kosh-garden.scss src/styles/kosh-garden.scss
SITE_MODE=realms node scripts/prepare-pages.mjs
```

The snapshot contains only page-specific files. Shared imagery and site fonts
remain in their normal project locations.
