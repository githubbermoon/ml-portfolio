# Trial font integration changelog

Date: 2026-09-14

Scope: local evaluation of the Henry-inspired editorial pages. These files are trial or personal-use fonts supplied by the site owner. Do not treat their presence in the repository as permission for unrestricted public or commercial deployment.

## Role mapping

| Editorial role | New family | Replaces | Used for |
| --- | --- | --- | --- |
| Monumental display | `DaVinci Trial` | Barlow Condensed; Italiana | oversized uppercase titles, chapter numerals, index headings and poster-scale display text |
| Literary reading | `Louize Trial` | Cormorant Garamond; Source Serif 4 | essay headings, introductions, quotations, prose and editor's-letter text |
| Interface | `Neue Montreal Trial` | Archivo; JetBrains Mono; DM Mono | navigation, metadata, labels, captions, folios, buttons and indexes |

Deliberate exceptions:

- The Fear hero quotation remains `EB Garamond`, as requested.
- The Hindi essay retains `Jaini Purva` headings and `Annapurna SIL` body text because the three trial families are not Devanagari faces.
- Existing general-site typography outside the Henry-inspired pages is unchanged.

## Files changed

- `src/styles/fonts.css`
  - Added local `@font-face` registrations for the three trial families.
- `src/styles/editorial-remix.scss`
  - Barlow Condensed → DaVinci Trial.
  - Cormorant Garamond → Louize Trial.
  - Archivo and JetBrains Mono → Neue Montreal Trial.
  - Removed the now-unused Archivo and Barlow Condensed Google Fonts request.
- `src/styles/kosh-garden.scss`
  - Uses the same display, reading and interface substitutions.
  - Removed the now-unused Archivo and Barlow Condensed Google Fonts request.
  - Narrowed the horizontal scale of the `KOSH GARDEN` line because DaVinci is wider than Barlow Condensed; restore the previous `1.02`, `.86`, and `.84` scale values when reverting that family.
- `src/styles/a-measure-of-days.scss`
  - `$display`: Italiana → DaVinci Trial.
  - `$serif`: Source Serif 4 → Louize Trial.
  - `$mono`: DM Mono → Neue Montreal Trial.
- `sidecars/a-measure-of-days/src/scss/_fonts.scss`
  - Added sidecar `@font-face` registrations and changed all three role variables.
- `sidecars/a-measure-of-days/src/_includes/layouts/base.njk`
  - Removed the Italiana, Source Serif 4 and DM Mono Google Fonts request.
- `sidecars/a-measure-of-days/src/colophon/index.md`
  - Updated the typography/licensing note.
- `public/fonts/trial/`
  - Contains only the styles needed by the current layouts.

## Manual rollback map

To keep every unrelated design change while reverting only typography:

1. Replace `DaVinci Trial` with the previous display family for each surface:
   - Editorial remix and Kosh Garden: `Barlow Condensed`.
   - A Measure of Days and its sidecar: `Italiana`.
2. Replace `Louize Trial` with:
   - Editorial remix and Kosh Garden: `Cormorant Garamond`.
   - A Measure of Days and its sidecar: `Source Serif 4`.
3. Replace `Neue Montreal Trial` with:
   - Body/caption text previously using Archivo: `Archivo`.
   - Compact metadata previously using JetBrains Mono: `JetBrains Mono`.
   - A Measure of Days and its sidecar: `DM Mono`.
4. Restore the corresponding Google Fonts imports noted above.
5. Remove the trial `@font-face` blocks and `public/fonts/trial/` only after no stylesheet references them.

Because Archivo and JetBrains Mono now share one replacement family, use the file-level mapping above rather than a blind global replacement when rolling back.
