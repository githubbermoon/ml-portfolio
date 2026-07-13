const isRealms = import.meta.env.SITE_MODE === 'realms';
const SITE = isRealms ? 'https://realms-58q.pages.dev' : 'https://githubbermoon.github.io';
const BASE = isRealms ? '/' : '/ml-portfolio/';

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
        ['blog/ananta-nihara/', '0.8', 'monthly'],
        ['blog/astrology/', '0.6', 'monthly'],
        ['blog/cooking/', '0.6', 'monthly'],
        ['blog/essays/', '0.7', 'monthly'],
        ['blog/notes/', '0.6', 'monthly'],
        ['blog/reading-notes/fear/', '0.5', 'monthly'],
        ['living-manifesto/', '0.5', 'monthly'],
        ['dharma-kshetra/', '0.5', 'monthly'],
      ] as const
    : [
        ['', '1.0', 'weekly'],
        ['projects/', '0.9', 'weekly'],
        ['projects/terrain-safety/', '0.8', 'monthly'],
        ['projects/python-api/', '0.8', 'monthly'],
        ['blog/', '0.9', 'weekly'],
        ['blog/technical/', '0.8', 'monthly'],
        ['blog/uhi-bengaluru/', '0.8', 'monthly'],
        ['blog/glass-fidelity/', '0.7', 'monthly'],
      ] as const;

  const entries = staticPaths.map(([path, priority, changefreq]) => urlEntry(path, priority, changefreq));

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
