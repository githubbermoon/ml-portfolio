const DEFAULT_DAILY_LIMIT = 100;
const DEFAULT_MAX_PROMPT_CHARS = 600;
const MODEL = "@cf/meta/llama-3.2-1b-instruct";

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function readPrompt(request) {
  if (request.method === "GET") {
    const url = new URL(request.url);
    return url.searchParams.get("prompt") || "Create one concise, mystical line for the Realms experience.";
  }

  if (request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    return body.prompt || "Create one concise, mystical line for the Realms experience.";
  }

  return null;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
      },
    });
  }

  if (!env.AI || !env.REALMS_KV) {
    return jsonResponse({ error: "AI or KV binding is not configured." }, 503);
  }

  const dailyLimit = Number.parseInt(env.DAILY_AI_LIMIT || "", 10) || DEFAULT_DAILY_LIMIT;
  const maxPromptChars = Number.parseInt(env.MAX_PROMPT_CHARS || "", 10) || DEFAULT_MAX_PROMPT_CHARS;
  const usageKey = `ai:lore:${todayKey()}`;
  const currentUsage = Number.parseInt((await env.REALMS_KV.get(usageKey)) || "0", 10) || 0;

  if (currentUsage >= dailyLimit) {
    return jsonResponse(
      {
        error: "Daily AI free-plan safety limit reached. Requests are denied until UTC midnight.",
        used: currentUsage,
        limit: dailyLimit,
      },
      429,
      { "retry-after": "3600" },
    );
  }

  const prompt = await readPrompt(request);
  if (prompt === null) {
    return jsonResponse({ error: "Method not allowed. Use GET or POST." }, 405, { allow: "GET, POST, OPTIONS" });
  }

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return jsonResponse({ error: "Prompt must be a non-empty string." }, 400);
  }

  if (prompt.length > maxPromptChars) {
    return jsonResponse(
      {
        error: "Prompt too long for free-plan guardrail.",
        maxPromptChars,
      },
      413,
    );
  }

  const result = await env.AI.run(MODEL, {
    messages: [
      {
        role: "system",
        content:
          "You write short, poetic, tasteful lines for an immersive ML portfolio/blog called Realms. Keep responses under 80 words. No markdown unless asked.",
      },
      { role: "user", content: prompt.trim() },
    ],
    max_tokens: 120,
  });

  await env.REALMS_KV.put(usageKey, String(currentUsage + 1), { expirationTtl: 60 * 60 * 48 });

  return jsonResponse({
    model: MODEL,
    usedToday: currentUsage + 1,
    dailyLimit,
    result,
  });
}
