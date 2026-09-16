import { getCollection } from "astro:content";

export const prerender = true;

const escapeXml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const absoluteUrl = (origin, path) => new URL(path.replace(/^\//, ""), `${origin}/`).toString();

export async function GET({ site }) {
  const origin = (site ?? new URL("https://realms-58q.pages.dev")).toString().replace(/\/$/, "");
  const entries = (await getCollection("dispatches", ({ data }) => data.announce))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  const items = entries.map(({ id, data }) => {
    const link = absoluteUrl(origin, data.canonicalPath);
    const cover = data.cover ? absoluteUrl(origin, data.cover) : undefined;
    const body = [
      cover ? `<p><img src="${escapeXml(cover)}" alt="" /></p>` : "",
      `<p>${escapeXml(data.summary)}</p>`,
      `<p><a href="${escapeXml(link)}">Read on Kosh</a></p>`,
    ].filter(Boolean).join("");

    return `<item>
      <title>${escapeXml(data.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">kosh:${escapeXml(id)}</guid>
      <pubDate>${data.publishedAt.toUTCString()}</pubDate>
      <description>${escapeXml(data.summary)}</description>
      <content:encoded><![CDATA[${body.replaceAll("]]>", "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Kosh Dispatches</title>
    <link>${escapeXml(origin)}</link>
    <description>New writings and pages from Kosh.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Kosh</generator>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
