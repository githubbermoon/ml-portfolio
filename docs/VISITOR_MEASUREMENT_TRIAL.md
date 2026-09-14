# Visitor measurement trial

The Realms build contains a consent-gated visitor measurement trial ending at **2026-10-15 23:59:59 IST**.

## What is recorded after acceptance

- Raw request IP address
- Cloudflare's approximate country, region, city, postal code, latitude, longitude, timezone, continent and ASN when available
- Random first-party visitor and session identifiers
- A SHA-256 browser fingerprint derived from browser, screen, hardware, timezone, canvas and WebGL properties
- Page, title, referrer, device summary, reading duration, maximum scroll depth and outbound-link hostname

Events expire from Cloudflare KV after 31 days. Tracking does not begin before the `kosh_consent=accepted` cookie exists. Turning analytics off in **Change preferences** removes the visitor and session cookies.

## Cookies

| Name | Purpose | Lifetime |
| --- | --- | --- |
| `kosh_consent` | Remembers accepted or declined measurement | 31 days |
| `kosh_visitor_id` | Recognizes a browser across visits | 31 days |
| `kosh_session_id` | Groups activity into a visit | 30 minutes |

## Private export access

Before deployment, configure a strong Cloudflare Pages secret named `ANALYTICS_ADMIN_TOKEN`. Analytics records are returned only by an authenticated `GET /api/analytics` request using that token as a Bearer authorization header.

The public client never receives the raw IP address or Cloudflare location fields.

## Ending or reverting the trial

The backend automatically rejects new events after the configured `ANALYTICS_TEST_END`. To remove the feature completely:

1. Remove `<VisitorMeasurement />` and its import from `src/layouts/BaseLayout.astro`.
2. Delete `src/components/VisitorMeasurement.astro`.
3. Delete `functions/api/analytics.js`.
4. Remove `ANALYTICS_TEST_END` and `ANALYTICS_RETENTION_DAYS` from `wrangler.toml`.
