# ML Portfolio: Deployment & Maintenance Report (Realms)

## 1. Project Overview
- **Project Name:** Realms (ML Portfolio)
- **Repository:** `githubbermoon/ml-portfolio` (Maintained at `/Users/pranjal/Projects/gitLocal/ml-portfolio`)
- **Hosting:** Cloudflare Pages
- **Framework:** Astro (Static Site)
- **Primary Domain:** `https://realms-58q.pages.dev`

## 2. Infrastructure & Deployment Setup
- **GitHub Sync:** The repo is connected to Cloudflare Pages for auto-deployments from the `master` branch.
- **Build Commands:**
  - **Cloudflare (Root):** `pnpm build:cloudflare` (Sets `SITE_BASE=/`)
  - **GitHub Pages:** `pnpm build:github` (Sets `SITE_BASE=/ml-portfolio/`)
- **CLI Deployment:** You can manually trigger a deployment from the terminal using:
  ```bash
  pnpm deploy:cloudflare
  ```
- **Security Headers:** Defined in `public/_headers` (Enforces `X-Frame-Options: DENY`, `Permissions-Policy`, etc.).

## 3. AI & Serverless Features
- **Workers AI:** Enabled for real-time inference (Lore API).
- **Endpoint:** `https://realms-58q.pages.dev/api/lore`
- **Safety Guardrail:** Implemented in `functions/api/lore.js` with a hard limit of **100 AI requests/day** using a KV counter.
- **KV Namespace:** `REALMS_KV` (`41c4a281c6c54337a1726398260b50b2`) is bound to the project to persist usage counts across serverless invocations.

## 4. SEO & Visibility
- **Sitemap:** Auto-generated at `/sitemap.xml`.
- **Robots:** Configured at `/robots.txt`.
- **Metadata:** `BaseLayout.astro` now automatically generates:
  - Canonical URLs
  - Open Graph (OG) tags for social sharing
  - Twitter Cards
  - JSON-LD Schema (Article/Website)
  - Article-specific tags and dates for blog posts

## 5. Maintenance Guidelines
### Adding New Content
- Add new blog posts/projects to `src/content/blog/` or `src/content/projects/` as `.mdx` files.
- The `BaseLayout` will automatically apply SEO metadata based on the file frontmatter.

### Managing Cloudflare Pages
- **Dashboard:** Access via [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → `realms`.
- **Analytics:** Enable **Web Analytics** in the dashboard to track site traffic privately.
- **Custom Domain:** When you purchase one (e.g., `realms.com`), navigate to **Custom Domains** tab in your Pages project and follow the prompts. No code changes are required as the site is rooted to `/`.
- **Monitoring AI Usage:** Check the Workers KV tab in the Cloudflare dashboard to verify your `ai_usage` counters if needed.

### Handling "Sync" Issues
- **Source of Truth:** Always use `/Users/pranjal/Projects/gitLocal/ml-portfolio`. If you work in another directory (like `Codex`), remember to commit/push to GitHub or manually sync changes to the main folder to ensure they are included in the next deployment.

---
*Created: 2026-07-12*
*Reference: Last Git Commit `4459b10`*
