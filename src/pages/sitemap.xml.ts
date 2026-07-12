import { getCollection } from 'astro:content';

const SITE = import.meta.env.PUBLIC_SITE_URL ?? import.meta.env.SITE_URL ?? 'https://realms-58q.pages.dev';
const BASE = import.meta.env.BASE_URL ?? '/';

function absoluteUrl(path: string) {
  const normalizedBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return new URL(`${normalizedBase}${normalizedPath}`, SITE).toString();
}

function urlEntry(path: string, priority = '0.7', changefreq = 'monthly') {
  return `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET() {
  const posts = await getCollection('blog');
  const projects = await getCollection('projects');

  const staticPaths = [
    ['', '1.0', 'weekly'],
    ['blog/', '0.9', 'weekly'],
    ['blog/technical/', '0.8', 'monthly'],
    ['blog/ananta-nihara/', '0.8', 'monthly'],
    ['blog/astrology/', '0.6', 'monthly'],
    ['blog/cooking/', '0.6', 'monthly'],
    ['blog/essays/', '0.7', 'monthly'],
    ['blog/notes/', '0.6', 'monthly'],
    ['projects/', '0.9', 'weekly'],
    ['living-manifesto/', '0.5', 'monthly'],
    ['dharma-kshetra/', '0.5', 'monthly'],
  ] as const;

  const entries = [
    ...staticPaths.map(([path, priority, changefreq]) => urlEntry(path, priority, changefreq)),
    ...posts.map((post) => urlEntry(`blog/${post.slug}/`, '0.8', 'monthly')),
    ...projects.map((project) => urlEntry(`projects/${project.slug}/`, '0.8', 'monthly')),
  ];

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
