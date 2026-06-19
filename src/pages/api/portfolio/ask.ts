import type { APIRoute } from 'astro';
import { offlineAnswer, validation } from '../../../data/assistant';

// Server-rendered on demand (the rest of the site is prerendered static).
export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

// Base URL of the Go portfolio API. Override with PORTFOLIO_API_URL in the env.
// Default uses 127.0.0.1 (not "localhost") so Node's fetch doesn't try ::1 first
// and miss an IPv4-only backend.
const API_BASE = (
  import.meta.env.PORTFOLIO_API_URL ??
  process.env.PORTFOLIO_API_URL ??
  'http://127.0.0.1:8000'
).replace(/\/+$/, '');

const ASK_PATH = '/api/v1/portfolio/ask';
const TIMEOUT_MS = 45_000;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

/**
 * Pull the answer text out of the backend response.
 * The oni-assistant API wraps payloads in `{ success, data: { response } }`,
 * so look inside `data` first, then fall back to top-level / other field names.
 */
function extractAnswer(data: unknown): string | null {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    const inner =
      o.data && typeof o.data === 'object' ? (o.data as Record<string, unknown>) : o;
    for (const k of ['response', 'answer', 'reply', 'result', 'text', 'content', 'message']) {
      if (typeof inner[k] === 'string' && inner[k]) return inner[k] as string;
    }
  }
  return null;
}

/** Read the `{ success:false, error:{ code, message } }` error envelope. */
function extractError(data: unknown, raw: string): { code: string; message: string } {
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    const err = (o.error && typeof o.error === 'object' ? o.error : o) as Record<string, unknown>;
    const message = (err.message ?? err.error ?? raw ?? 'Request failed.') as string;
    const code = (err.code ?? 'Error') as string;
    return { code: String(code), message: String(message) };
  }
  return { code: 'Error', message: raw || 'Request failed.' };
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ code: 'Bad Request', error: 'Invalid JSON body.' }, 400);
  }

  const prompt = (payload as { prompt?: unknown })?.prompt;

  // Mirror the backend's validation contract so we never make a wasted call.
  if (typeof prompt !== 'string') {
    return json({ code: 'Unprocessable Entity', error: 'prompt is required' }, 422);
  }
  if (prompt.trim() === '') {
    return json({ code: validation.blank.code, error: validation.blank.message }, 400);
  }
  if (prompt.length > validation.maxLen) {
    return json({ code: validation.tooLong.code, error: validation.tooLong.message }, 400);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(`${API_BASE}${ASK_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    const raw = await upstream.text();
    let data: unknown = raw;
    try {
      data = JSON.parse(raw);
    } catch {
      /* keep raw text */
    }

    // The API signals failure via HTTP status AND/OR `success:false` in the body.
    const failed =
      !upstream.ok ||
      (!!data && typeof data === 'object' && (data as Record<string, unknown>).success === false);
    if (failed) {
      const { code, message } = extractError(data, raw);
      const status = upstream.status >= 400 ? upstream.status : 400;
      return json({ code, error: message }, status);
    }

    const answer = extractAnswer(data);
    if (!answer) {
      // Backend responded 2xx but in a shape we can't read — degrade gracefully.
      return json({ answer: offlineAnswer(prompt), source: 'offline' });
    }
    return json({ answer, source: 'backend' });
  } catch (err) {
    // Backend unreachable / timed out — serve the grounded offline answer so the
    // assistant keeps working (and stays on-topic) without the Go server running.
    console.error('[api/portfolio/ask] upstream error:', err);
    return json({ answer: offlineAnswer(prompt), source: 'offline' });
  } finally {
    clearTimeout(timer);
  }
};
