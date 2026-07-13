const isRealms = import.meta.env.SITE_MODE === 'realms';
const SITE = isRealms ? 'https://realms-58q.pages.dev' : 'https://githubbermoon.github.io';
const BASE = import.meta.env.BASE_URL ?? '/';

export function GET() {
  const sitemapUrl = new URL(`${BASE.endsWith('/') ? BASE : `${BASE}/`}sitemap.xml`, SITE).toString();

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
