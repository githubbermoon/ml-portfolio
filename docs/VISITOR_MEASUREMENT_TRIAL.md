# Visitor measurement

The Realms build contains visitor measurement with no fixed end date.

## What is recorded after acceptance

- Raw request IP address
- Cloudflare's approximate country, region, city, postal code, latitude, longitude, timezone, continent and ASN when available
- Random first-party visitor and session identifiers
- A SHA-256 browser fingerprint derived from browser, screen, hardware, timezone, canvas and WebGL properties
- Page, title, referrer, device summary, reading duration, maximum scroll depth and outbound-link hostname

Events expire from Cloudflare KV after 150 days. Browser preference and identifier cookies retain their shorter lifetimes described below.

## Cookies

| Name | Purpose | Lifetime |
| --- | --- | --- |
| `kosh_consent` | Remembers accepted or declined measurement | 31 days |
| `kosh_visitor_id` | Recognizes a browser across visits | 31 days |
| `kosh_session_id` | Groups activity into a visit | 30 minutes |

## Private export access

Before deployment, configure a strong Cloudflare Pages secret named `ANALYTICS_ADMIN_TOKEN`. Analytics records are returned only by an authenticated `GET /api/analytics` request using that token as a Bearer authorization header.

The public client never receives the raw IP address or Cloudflare location fields.

## Removing measurement

To remove the feature completely:

1. Remove `<VisitorMeasurement />` and its import from `src/layouts/BaseLayout.astro`.
2. Delete `src/components/VisitorMeasurement.astro`.
3. Delete `functions/api/analytics.js`.
4. Remove `ANALYTICS_RETENTION_DAYS` from `wrangler.toml`.
