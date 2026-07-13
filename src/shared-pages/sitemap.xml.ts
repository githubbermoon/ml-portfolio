const isRealms = import.meta.env.SITE_MODE === 'realms';
const GITHUB_SITE = 'https://githubbermoon.github.io/ml-portfolio/';
const CLOUDFLARE_SITE = 'https://realms-58q.pages.dev/';
const SITE = isRealms ? CLOUDFLARE_SITE : GITHUB_SITE;
const BASE = import.meta.env.BASE_URL;

function absoluteUrl(path: string) {
  const normalizedBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return new URL(`${normalizedBase}${normalizedPath}`, SITE).toString();
}

function urlEntry(path: string, priority = '0.7', changefreq = 'monthly') {
  return `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET() {
  const staticPaths = isRealms
    ? [
        ['', '1.0', 'weekly'],
        ['technical-work/', '0.8', 'monthly'],
        ['projects/', '0.8', 'monthly'],
        ['blog/', '0.9', 'weekly'],
      ] as const
    : [
        ['', '1.0', 'weekly'],
        ['projects/', '0.9', 'weekly'],
        ['blog/', '0.9', 'weekly'],
        ['blog/technical/', '0.8', 'monthly'],
        ['blog/uhi-bengaluru/', '0.8', 'monthly'],
      ] as const;

  const entries = staticPaths.map(([path, priority, changefreq]) => urlEntry(path, priority, changefreq));

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
