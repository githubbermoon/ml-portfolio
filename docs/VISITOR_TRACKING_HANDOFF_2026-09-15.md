# Visitor tracking handoff — 15 September 2026

Supplement to `CHAT_HANDOFF_2026-09-15.md`. Read this first when continuing the IP, cookies, fingerprinting, and analytics work in a new chat. This records implemented behaviour and the configuration/deployment completed after the earlier handoff.

## Project

- Checkout: `/Users/pranjal/Projects/gitLocal/ml-portfolio`
- Repository: `https://github.com/githubbermoon/ml-portfolio`
- Branch: `master`
- Production: `https://realms-58q.pages.dev/`
- Cloudflare Pages project: `realms`
- Tracking is mounted in the Realms build, not the Professional GitHub Pages build.
- Use `pnpm dev:realms`, `pnpm build:cloudflare`, and `pnpm deploy:cloudflare`.
- Edit sources under `src/realms`, shared components/layouts, and `functions`; never hand-edit generated `src/pages/`.

## User intent and final implemented decision

The user requested a one-month test on their own multiple devices, including raw IP storage, analytics cookies, approximate geolocation, and browser fingerprinting. They dislike an opening banner and persistent floating preferences icon.

The implemented compromise is **explicit opt-in from the navigation menu**:

- No opening Accept/Change-preferences prompt.
- No permanent floating preferences icon.
- Top-right three-line menu contains **Visitor measurement**.
- The dialog describes the collected information and provides **Allow visitor analytics** and **Save changes**.
- New browsers do not track automatically. A saved `kosh_consent=accepted` cookie is required.
- Previously accepted browsers start tracking on subsequent page loads.
- Turning the checkbox off saves `declined` and removes visitor/session cookies.
- Do not interpret the request to remove a banner as permission to silently enable collection for every visitor.

### Testing on each device

1. Open the production website.
2. Open the top-right three-line menu.
3. Choose **Visitor measurement**.
4. Enable **Allow visitor analytics**, then **Save changes**.
5. Browse/reload pages, scroll, follow an external link, and leave the page.
6. Inspect new records in KV or the private export.

Localhost cookies and production cookies are separate. Browser profiles, incognito windows, deployment aliases, and the canonical production hostname also have separate cookie scopes.

## Cookies

| Cookie | Purpose | Lifetime |
| --- | --- | --- |
| `kosh_consent` | Remembers `accepted` or `declined` | 31 days from saving preferences |
| `kosh_visitor_id` | Random identifier for a browser profile | 31 days from creation |
| `kosh_session_id` | Random visit/session identifier | 30 minutes, refreshed when measurement starts on a page |

Cookies use `Path=/`, `SameSite=Lax`, and `Secure` on HTTPS. They are first-party, JavaScript-readable cookies, **not HttpOnly**. The implementation does not continuously refresh the session cookie merely because the user stays on one page.

Declining removes identifiers but does not delete previously stored server events. Existing event listeners may still attempt requests until reload; the backend rejects writes without accepted consent and identifiers. A stronger listener cleanup and per-visitor deletion workflow are future work.

## Data and events

Allowed event types: `page_view`, `engagement`, `outbound_click`.

Each stored record can include:

- `recordedAt`, `schema`, `event`
- `rawIp`: Cloudflare request IP, with fallback request headers
- `location`: country, region, region code, city, postal code, timezone, latitude, longitude, continent, ASN when supplied
- `visitorId`, `sessionId`, `fingerprint`
- `path`, `title`, `referrer`, `destinationHost`
- `language`, `platform`, `screen`, `userAgent`
- `durationSeconds`, `scrollDepth`

Fields vary by event; missing text fields are generally empty strings and unavailable location values are null. The backend reads visitor/session identifiers from cookies, not the body identifiers. IP and geolocation are added on the server and are not returned to the ordinary public tracking client.

Geolocation is **IP-based and approximate**, not GPS/browser geolocation. VPNs, proxies, mobile networks, and ISP routing can affect accuracy. IP addresses, cookies, and fingerprints do not reliably identify a person or physical device by themselves.

### Fingerprint implementation

Client combines user agent, platform, language/languages, hardware concurrency, device memory, touch points, screen dimensions/colour depth, pixel ratio, timezone, a canvas rendering signature, and exposed WebGL vendor/renderer.

The combined value is hashed with SHA-256 when `crypto.subtle` is available; otherwise a non-cryptographic fallback hash is used. Raw canvas/WebGL components are not stored in the server event record. A fingerprint is still a tracking identifier: hashing does not make it anonymous, and browsers/settings/updates can change or mask it.

### Engagement limitations

- Engagement is sent once on the first hidden-page transition or page exit.
- Duration is elapsed time since measurement started, not verified active reading time.
- Maximum scroll depth is recorded; it is not proof of reading.
- Outbound events contain the destination hostname, not the complete outbound URL.
- Request failures are currently swallowed in the client; no visual diagnostics are shown.

## Backend and storage

- Endpoint: `functions/api/analytics.js` → `/api/analytics`
- Storage binding: `REALMS_KV`
- Namespace title: `REALMS_KV`
- Namespace ID: `41c4a281c6c54337a1726398260b50b2`
- Event key prefix: `analytics:event:`
- Reverse timestamps in keys produce newest-first lexical ordering.
- Events expire after 31 days under the current configuration.
- Trial end: `2026-10-15T18:29:59.000Z` = **15 October 2026, 23:59:59 IST**.
- Backend rejects new events after the trial end. Existing events remain until their TTL expires.

`POST /api/analytics` checks storage, trial end, the Origin header when present, payload/event validity, accepted consent, and visitor/session cookies. The cookies are a collection gate, not authentication or cryptographic proof of consent. No abuse rate limiter has been implemented for this endpoint.

## Secret: configured and verified

The user added **`ANALYTICS_ADMIN_TOKEN` as an encrypted Production secret** in Cloudflare. Its value is deliberately absent from this document, Git, and public client code.

Cloudflare's dashboard notice is expected: plain environment variables are managed by `wrangler.toml`; encrypted secrets can still be managed in the dashboard.

Current non-secret `[vars]` settings in `wrangler.toml`:

```toml
DAILY_AI_LIMIT = "100"
MAX_PROMPT_CHARS = "600"
ANALYTICS_TEST_END = "2026-10-15T18:29:59.000Z"
ANALYTICS_RETENTION_DAYS = "31"
```

Never put the admin token under `[vars]`. Dashboard path: **Workers & Pages → realms → Settings → Variables and Secrets → Production → Add → Secret/Encrypt → Save**. Redeploy afterward.

Wrangler alternatives:

```bash
npx wrangler pages secret put ANALYTICS_ADMIN_TOKEN --project-name=realms
npx wrangler pages secret list --project-name=realms
```

The list command shows names/encryption status, not secret values. Preview secrets are separate and were not verified in this work.

## Accessing analytics

**No visual private analytics dashboard has been built yet.** The current options are KV records and a protected JSON export. The Professional site's GoatCounter-related `AnalyticsHotkey` is a separate feature, not this raw-IP viewer.

### Cloudflare dashboard

Open **Storage & Databases → KV → REALMS_KV → KV Pairs** and look for/filter `analytics:event:` keys. Opening a key displays its event JSON. KV/dashboard visibility may not be immediate.

### Private export

```text
GET https://realms-58q.pages.dev/api/analytics?limit=500
Authorization: Bearer <private token>
```

Default page size is 100, maximum is 500. Response contains `events`, `count`, `cursor`, and `trialEndsAt`. A non-null cursor means more pages: request again with the same header and a URL-encoded `cursor` query parameter. A 500-record page is not necessarily the complete export.

For zsh on the user's Mac, prompt for the token without putting its value in command history:

```bash
read -s "TOKEN?Analytics token: "; echo
curl -sS -H "Authorization: Bearer $TOKEN" \
  "https://realms-58q.pages.dev/api/analytics?limit=500" | jq
unset TOKEN
```

Do not put the token in a URL, browser bundle, screenshot, handoff document, or Git commit. Analytics exports contain sensitive visitor data; keep them private and out of Git.

### Expected responses

- GET without a valid token: `401 Unauthorized` (healthy protection).
- GET with a valid token: JSON records, possibly an empty `events` array.
- GET without configured admin secret: `503 Analytics admin token is not configured`.
- Missing KV binding: `503 Analytics storage is unavailable`.
- POST without accepted consent: `403`.
- POST after trial end: `410`.
- Accepted valid POST: `202`.

## Changes and verified deployment after the earlier handoff

Cloudflare's Git builds had failed for commits `8160af7` and `f03de4a`, leaving the earlier `e4d0494` website live. A fresh-clone reproduction showed `rollup: command not found`: root installation did not install the sidecar dependencies.

The long-term fix was committed and pushed as **`f88988f` — Make Astro and editorial sidecar a pnpm workspace**:

- Added `pnpm-workspace.yaml` for root and `sidecars/*`.
- Consolidated dependencies under the root `pnpm-lock.yaml`.
- Changed production/sidecar build scripts from Bun to pnpm.
- Removed the sidecar Bun lockfile.
- Updated deployment and sidecar documentation.
- Verified frozen-lockfile installation and Cloudflare build from a fresh clone; GitHub build also passed.
- Git-connected Cloudflare deployment `5ccfba32-44e6-4978-97a6-d3c19a2edf2a` completed successfully.

After the secret was saved, the user explicitly requested a redeployment. `pnpm deploy:cloudflare` rebuilt 26 Astro routes plus the editorial sidecar and uploaded Functions to Production.

- Latest verified direct deployment: `https://97992190.realms-58q.pages.dev/`
- Canonical production: `https://realms-58q.pages.dev/`
- Both analytics endpoints returned **401 Unauthorized** without credentials, confirming the runtime secret is present.
- Secret listing showed `ANALYTICS_ADMIN_TOKEN: Value Encrypted` in Production.
- The authorized GET export was **not tested**, because the secret value was not provided to the agent.
- The last KV prefix check returned `[]`: **zero event keys at that check**, not a permanent assertion about current data.
- No real-device end-to-end collection or fingerprint accuracy test has been completed yet.
- The redeployment itself made no source changes or new Git commit.

Pushing `master` triggers the Git-connected Cloudflare build and the separate Professional GitHub Pages workflow. Direct upload is an alternative, not a replacement for the fixed Git workflow.

## Files to read/edit

- `src/components/VisitorMeasurement.astro`: cookies, opt-in dialog, fingerprint, events
- `src/layouts/BaseLayout.astro`: Realms-only mounting
- `src/islands/MobileNav.tsx`: navigation preference entry
- `src/islands/realms-menu.css`: entry styling
- `functions/api/analytics.js`: write checks, storage, export authentication
- `wrangler.toml`: non-secret settings and bindings
- `docs/VISITOR_MEASUREMENT_TRIAL.md`: original operational notes
- `CHAT_HANDOFF_2026-09-15.md`: broader website handoff
- `pnpm-workspace.yaml`, root/sidecar `package.json`, `pnpm-lock.yaml`: clean-build fix

Wrangler may recreate an untracked `.wrangler/` temporary-artifacts directory during diagnostics/deployment. It is not website source and must not be committed. Inspect and preserve unrelated local changes before cleanup.

## Reversal and remaining work

Rollback tags remain unchanged: `checkpoint-pre-sidecar-last-push` → `e4d0494`; `checkpoint-2026-09-14-editorial-remix` → `d7b5f18`; `checkpoint-2026-09-15-visitor-trial` → `8160af7`. Prefer a scoped revert for removing analytics rather than resetting the whole website and losing unrelated design/build work.

To remove tracking: remove the component mount/import, client component, analytics Function, and menu entry; remove trial variables; redeploy; expire existing tracking cookies and decide separately whether to delete retained events. Removing code does not erase existing KV data. Deleting events or the namespace needs explicit approval; `REALMS_KV` may also contain unrelated application data.

Potential next work, not implemented or automatically authorized:

1. Enable measurement on the user's test devices and verify valid POSTs produce KV events.
2. Test authenticated paginated exports privately.
3. Build an authenticated, non-indexed private dashboard with filters, sessions, countries, maps, and CSV/JSON export. Never ship the admin token in public assets or store it persistently in browser localStorage.
4. Clearly separate event count, page views, sessions, browser-cookie IDs, and fingerprints; none equals unique people automatically.
5. Add diagnostics, abuse controls, robust opt-out cleanup, and targeted event deletion.
6. Review applicable privacy/disclosure/consent requirements before expanding beyond selected-device testing. No claim of legal compliance was verified here.

## Suggested new-chat opening

“Read `docs/VISITOR_TRACKING_HANDOFF_2026-09-15.md` and `CHAT_HANDOFF_2026-09-15.md`. Inspect the current Git status and tracking source. The Production admin secret is already configured and deployed; do not ask me to paste it in chat. Start by checking whether opted-in test-device events are reaching REALMS_KV, then discuss or build the private dashboard only within my requested scope.”
