import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const API_URL = "https://api.buttondown.com/v1/emails";
const apiKey = process.env.BUTTONDOWN_API_KEY;
const before = process.env.BEFORE_SHA;
const after = process.env.AFTER_SHA || "HEAD";
const siteOrigin = (process.env.SITE_ORIGIN || "https://realms-58q.pages.dev").replace(/\/$/, "");

if (!apiKey) throw new Error("BUTTONDOWN_API_KEY is not configured.");

const isZeroSha = !before || /^0+$/.test(before);
const args = isZeroSha
  ? ["ls-tree", "-r", "--name-only", after, "--", "src/content/dispatches"]
  : ["diff", "--name-only", "--diff-filter=AM", before, after, "--", "src/content/dispatches"];
const files = execFileSync("git", args, { encoding: "utf8" })
  .split("\n")
  .map((file) => file.trim())
  .filter((file) => /\.ya?ml$/i.test(file));

const headers = {
  Authorization: `Token ${apiKey}`,
  "Content-Type": "application/json",
};

const absoluteUrl = (value) => new URL(String(value).replace(/^\//, ""), `${siteOrigin}/`).toString();
const slugFor = (file) => `kosh-${path.basename(file).replace(/\.ya?ml$/i, "").replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}`;

for (const file of files) {
  const data = YAML.parse(await readFile(file, "utf8"));
  if (data.announce !== true) {
    console.log(`Skipping ${file}: announcement is disabled.`);
    continue;
  }

  const slug = slugFor(file);
  const existingResponse = await fetch(`${API_URL}?slug=${encodeURIComponent(slug)}`, { headers });
  if (!existingResponse.ok) throw new Error(`Could not check Buttondown drafts (${existingResponse.status}).`);
  const existing = await existingResponse.json();
  if (existing.results?.some((email) => email.slug === slug)) {
    console.log(`Skipping ${file}: Buttondown already has ${slug}.`);
    continue;
  }

  const pageUrl = absoluteUrl(data.canonicalPath);
  const body = [
    data.cover ? `![${data.title}](${absoluteUrl(data.cover)})` : "",
    data.summary,
    `[Read on Kosh](${pageUrl})`,
  ].filter(Boolean).join("\n\n");
  const response = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      subject: data.title,
      body,
      status: "draft",
      email_type: "public",
      slug,
      description: data.summary,
      canonical_url: pageUrl,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Buttondown rejected ${file} (${response.status}): ${detail}`);
  }
  console.log(`Created an unsent Buttondown draft for ${file}.`);
}

if (files.length === 0) console.log("No changed Kosh Dispatches publication records.");
