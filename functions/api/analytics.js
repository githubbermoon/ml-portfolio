const DEFAULT_TRIAL_END = "2026-10-15T18:29:59.000Z";
const DEFAULT_RETENTION_DAYS = 31;
const MAX_BODY_BYTES = 12_000;
const ALLOWED_EVENTS = new Set([
  "page_view",
  "engagement",
  "section_engagement",
  "reading_progress",
  "internal_click",
  "outbound_click",
  "contact_click",
  "media_interaction",
  "search",
  "performance",
  "client_error",
]);

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...headers,
    },
  });
}

function parseCookies(header) {
  return Object.fromEntries(
    (header || "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf("=");
        if (index < 0) return [item, ""];
        return [decodeURIComponent(item.slice(0, index)), decodeURIComponent(item.slice(index + 1))];
      }),
  );
}

function limitedString(value, length) {
  return typeof value === "string" ? value.slice(0, length) : "";
}

function clientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function requestLocation(request) {
  const cf = request.cf || {};
  return {
    country: cf.country || request.headers.get("cf-ipcountry") || null,
    region: cf.region || request.headers.get("cf-region") || null,
    regionCode: cf.regionCode || request.headers.get("cf-region-code") || null,
    city: cf.city || request.headers.get("cf-ipcity") || null,
    postalCode: cf.postalCode || request.headers.get("cf-postal-code") || null,
    timezone: cf.timezone || request.headers.get("cf-timezone") || null,
    latitude: cf.latitude || request.headers.get("cf-iplatitude") || null,
    longitude: cf.longitude || request.headers.get("cf-iplongitude") || null,
    continent: cf.continent || request.headers.get("cf-ipcontinent") || null,
    asn: cf.asn || null,
  };
}

function trialIsActive(env) {
  const end = Date.parse(env.ANALYTICS_TEST_END || DEFAULT_TRIAL_END);
  return Number.isFinite(end) && Date.now() < end;
}

async function recordEvent(request, env) {
  if (!env.REALMS_KV) return json({ error: "Analytics storage is unavailable." }, 503);
  if (!trialIsActive(env)) return json({ accepted: false, reason: "trial-ended" }, 410);

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) return json({ error: "Cross-origin request denied." }, 403);

  const contentLength = Number.parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_BYTES) return json({ error: "Payload too large." }, 413);

  const cookies = parseCookies(request.headers.get("cookie"));

  if (!cookies.kosh_visitor_id || !cookies.kosh_session_id) return json({ error: "Analytics identifiers are missing." }, 400);

  const body = await request.json().catch(() => null);
  if (!body || !ALLOWED_EVENTS.has(body.event)) return json({ error: "Invalid analytics event." }, 400);

  const now = new Date();
  const recordedAt = now.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata", hour12: false }).replace(" ", "T") + "+05:30";
  const retentionDays = Math.min(90, Math.max(1, Number.parseInt(env.ANALYTICS_RETENTION_DAYS || "", 10) || DEFAULT_RETENTION_DAYS));
  const reverseTimestamp = String(9_999_999_999_999 - now.getTime()).padStart(13, "0");
  const key = `analytics:event:${reverseTimestamp}:${crypto.randomUUID()}`;
  const record = {
    schema: 2,
    recordedAt,
    event: body.event,
    rawIp: clientIp(request),
    location: requestLocation(request),
    visitorId: limitedString(cookies.kosh_visitor_id, 100),
    sessionId: limitedString(cookies.kosh_session_id, 100),
    fingerprint: limitedString(body.fingerprint, 128),
    path: limitedString(body.path, 500),
    title: limitedString(body.title, 200),
    destinationHost: limitedString(body.destinationHost, 200),
    platform: limitedString(body.platform, 100),
    screen: limitedString(body.screen, 60),
    viewport: limitedString(body.viewport, 60),
    orientation: limitedString(body.orientation, 30),
    connection: limitedString(body.connection, 30),
    saveData: typeof body.saveData === "boolean" ? body.saveData : null,
    downlink: Number.isFinite(body.downlink) ? Math.max(0, Math.min(1000, body.downlink)) : null,
    rtt: Number.isFinite(body.rtt) ? Math.max(0, Math.min(10_000, Math.round(body.rtt))) : null,
    touchPoints: Number.isFinite(body.touchPoints) ? Math.max(0, Math.min(20, Math.round(body.touchPoints))) : null,
    language: limitedString(body.language, 20),
    languages: limitedString(body.languages, 200),
    hardwareConcurrency: Number.isFinite(body.hardwareConcurrency) ? Math.max(0, Math.min(256, Math.round(body.hardwareConcurrency))) : null,
    deviceMemory: Number.isFinite(body.deviceMemory) ? Math.max(0, Math.min(512, body.deviceMemory)) : null,
    colorDepth: Number.isFinite(body.colorDepth) ? Math.max(0, Math.min(48, Math.round(body.colorDepth))) : null,
    cookieEnabled: typeof body.cookieEnabled === "boolean" ? body.cookieEnabled : null,
    pdfViewerEnabled: typeof body.pdfViewerEnabled === "boolean" ? body.pdfViewerEnabled : null,
    doNotTrack: limitedString(body.doNotTrack, 10),
    fonts: limitedString(body.fonts, 2000),
    battery: body.battery && typeof body.battery === "object" ? { charging: !!body.battery.charging, level: Number.isFinite(body.battery.level) ? Math.max(0, Math.min(100, Math.round(body.battery.level))) : null } : null,
    colorGamut: limitedString(body.colorGamut, 20),
    hdr: typeof body.hdr === "boolean" ? body.hdr : null,
    prefersContrast: limitedString(body.prefersContrast, 20),
    reducedMotion: typeof body.reducedMotion === "boolean" ? body.reducedMotion : null,
    darkMode: typeof body.darkMode === "boolean" ? body.darkMode : null,
    forcedColors: typeof body.forcedColors === "boolean" ? body.forcedColors : null,
    timezone: limitedString(body.timezone, 60),
    timezoneOffset: Number.isFinite(body.timezoneOffset) ? Math.max(-840, Math.min(840, Math.round(body.timezoneOffset))) : null,
    canvasHash: limitedString(body.canvasHash, 500),
    webglRenderer: limitedString(body.webglRenderer, 300),
    previousPath: limitedString(body.previousPath, 500),
    targetPath: limitedString(body.targetPath, 500),
    targetKind: limitedString(body.targetKind, 80),
    sectionId: limitedString(body.sectionId, 120),
    sectionLabel: limitedString(body.sectionLabel, 200),
    action: limitedString(body.action, 80),
    mediaType: limitedString(body.mediaType, 30),
    mediaSrc: limitedString(body.mediaSrc, 500),
    query: limitedString(body.query, 300),
    errorType: limitedString(body.errorType, 80),
    errorMessage: limitedString(body.errorMessage, 500),
    errorSource: limitedString(body.errorSource, 500),
    metricName: limitedString(body.metricName, 80),
    firstVisitAt: limitedString(body.firstVisitAt, 40),
    visitNumber: Number.isFinite(body.visitNumber) ? Math.max(1, Math.min(100_000, Math.round(body.visitNumber))) : null,
    daysSinceLastVisit: Number.isFinite(body.daysSinceLastVisit) ? Math.max(0, Math.min(10_000, Math.round(body.daysSinceLastVisit))) : null,
    durationSeconds: Number.isFinite(body.durationSeconds) ? Math.max(0, Math.min(86_400, Math.round(body.durationSeconds))) : null,
    activeSeconds: Number.isFinite(body.activeSeconds) ? Math.max(0, Math.min(86_400, Math.round(body.activeSeconds))) : null,
    visibleSeconds: Number.isFinite(body.visibleSeconds) ? Math.max(0, Math.min(86_400, Math.round(body.visibleSeconds))) : null,
    scrollDepth: Number.isFinite(body.scrollDepth) ? Math.max(0, Math.min(100, Math.round(body.scrollDepth))) : null,
    progress: Number.isFinite(body.progress) ? Math.max(0, Math.min(100, Math.round(body.progress))) : null,
    mediaPosition: Number.isFinite(body.mediaPosition) ? Math.max(0, Math.min(86_400, Math.round(body.mediaPosition))) : null,
    mediaDuration: Number.isFinite(body.mediaDuration) ? Math.max(0, Math.min(86_400, Math.round(body.mediaDuration))) : null,
    resultCount: Number.isFinite(body.resultCount) ? Math.max(0, Math.min(1_000_000, Math.round(body.resultCount))) : null,
    metricValue: Number.isFinite(body.metricValue) ? Math.max(-1_000_000, Math.min(1_000_000, body.metricValue)) : null,
    userAgent: limitedString(request.headers.get("user-agent"), 500),
  };

  await env.REALMS_KV.put(key, JSON.stringify(record), { expirationTtl: retentionDays * 24 * 60 * 60 });
  return json({ accepted: true }, 202);
}

async function exportEvents(request, env) {
  if (!env.REALMS_KV) return json({ error: "Analytics storage is unavailable." }, 503);
  if (!env.ANALYTICS_ADMIN_TOKEN) return json({ error: "Analytics admin token is not configured." }, 503);

  const authorization = request.headers.get("authorization") || "";
  if (authorization !== `Bearer ${env.ANALYTICS_ADMIN_TOKEN}`) {
    return json({ error: "Unauthorized." }, 401, { "www-authenticate": "Bearer" });
  }

  const url = new URL(request.url);
  const requestedLimit = Number.parseInt(url.searchParams.get("limit") || "", 10) || 100;
  const limit = Math.min(500, Math.max(1, requestedLimit));
  const cursor = url.searchParams.get("cursor") || undefined;
  const listing = await env.REALMS_KV.list({ prefix: "analytics:event:", limit, cursor });
  const events = (
    await Promise.all(listing.keys.map((entry) => env.REALMS_KV.get(entry.name, "json")))
  ).filter(Boolean);

  return json({
    events,
    count: events.length,
    cursor: listing.list_complete ? null : listing.cursor,
    trialEndsAt: env.ANALYTICS_TEST_END || DEFAULT_TRIAL_END,
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "POST") return recordEvent(request, env);
  if (request.method === "GET") return exportEvents(request, env);
  return json({ error: "Method not allowed." }, 405, { allow: "GET, POST" });
}
