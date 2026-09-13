const isRealms = import.meta.env.SITE_MODE === 'realms';
const SITE = isRealms ? 'https://realms-58q.pages.dev' : 'https://githubbermoon.github.io';
const BASE = import.meta.env.BASE_URL ?? '/';

export function GET() {
  const sitemapUrl = new URL(`${BASE.endsWith('/') ? BASE : `${BASE}/`}sitemap.xml`, SITE).toString();

  const policy = isRealms
    ? `# Human-readable rights: ${new URL(`${BASE.endsWith('/') ? BASE : `${BASE}/`}rights/`, SITE)}
# Content signals express usage preferences; crawler compliance may vary.
Content-Signal: search=yes, ai-train=no, ai-input=no

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`
    : `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(policy, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
