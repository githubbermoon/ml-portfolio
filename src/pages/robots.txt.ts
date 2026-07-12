const SITE = import.meta.env.PUBLIC_SITE_URL ?? import.meta.env.SITE_URL ?? 'https://realms-58q.pages.dev';
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
