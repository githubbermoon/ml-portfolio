const MAX_BODY_BYTES = 8_000;
const MAX_MESSAGE_LENGTH = 2_000;
const MIN_MESSAGE_LENGTH = 10;
const KEY_PREFIX = "inbox:anonymous:";

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

function limitedString(value, length) {
  return typeof value === "string" ? value.slice(0, length) : "";
}

async function receiveNote(request, env) {
  if (!env.REALMS_KV) return json({ error: "Message storage is unavailable." }, 503);

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) return json({ error: "Cross-origin request denied." }, 403);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "JSON is required." }, 415);
  }

  const contentLength = Number.parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_BYTES) return json({ error: "Message is too large." }, 413);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "Invalid message." }, 400);

  // Silently accept honeypot submissions so automated senders receive no useful signal.
  if (typeof body.website === "string" && body.website.trim()) return json({ accepted: true }, 202);

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length < MIN_MESSAGE_LENGTH) {
    return json({ error: `Please write at least ${MIN_MESSAGE_LENGTH} characters.` }, 400);
  }
  if (message.length > MAX_MESSAGE_LENGTH) return json({ error: "Message is too long." }, 413);

  const receivedAt = new Date();
  const receivedAtStr = receivedAt.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata", hour12: false }).replace(" ", "T") + "+05:30";
  const reverseTimestamp = String(9_999_999_999_999 - receivedAt.getTime()).padStart(13, "0");
  const key = `${KEY_PREFIX}${reverseTimestamp}:${crypto.randomUUID()}`;
  const note = {
    schema: 1,
    receivedAt: receivedAtStr,
    path: limitedString(body.path, 300) || "/about/pranjal/",
    message,
  };

  await env.REALMS_KV.put(key, JSON.stringify(note));
  return json({ accepted: true }, 202);
}

async function listNotes(request, env) {
  if (!env.REALMS_KV) return json({ error: "Message storage is unavailable." }, 503);
  if (!env.ANALYTICS_ADMIN_TOKEN) return json({ error: "Private access is not configured." }, 503);

  const authorization = request.headers.get("authorization") || "";
  if (authorization !== `Bearer ${env.ANALYTICS_ADMIN_TOKEN}`) {
    return json({ error: "Unauthorized." }, 401, { "www-authenticate": "Bearer" });
  }

  const url = new URL(request.url);
  const requestedLimit = Number.parseInt(url.searchParams.get("limit") || "", 10) || 100;
  const limit = Math.min(500, Math.max(1, requestedLimit));
  const cursor = url.searchParams.get("cursor") || undefined;
  const listing = await env.REALMS_KV.list({ prefix: KEY_PREFIX, limit, cursor });
  const notes = (await Promise.all(listing.keys.map((entry) => env.REALMS_KV.get(entry.name, "json")))).filter(Boolean);

  return json({ notes, count: notes.length, cursor: listing.list_complete ? null : listing.cursor });
}

export async function onRequest({ request, env }) {
  if (request.method === "POST") return receiveNote(request, env);
  if (request.method === "GET") return listNotes(request, env);
  return json({ error: "Method not allowed." }, 405, { allow: "GET, POST" });
}
