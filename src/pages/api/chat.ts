import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, fallbackAnswer } from '../../data/portfolio';

// Server-rendered on demand (the rest of the site is prerendered static).
export const prerender = false;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const TEXT_HEADERS = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'no-store',
};

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response('Invalid JSON body.', { status: 400 });
  }

  const raw = (payload as { messages?: unknown })?.messages;
  const history: ChatMessage[] = Array.isArray(raw)
    ? raw
        .filter(
          (m): m is ChatMessage =>
            !!m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string' &&
            m.content.trim().length > 0,
        )
        .slice(-20) // bound the context window the visitor can push
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : [];

  if (!history.length || history[history.length - 1].role !== 'user') {
    return new Response('A user message is required.', { status: 400 });
  }

  const lastUser = history[history.length - 1].content;
  const encoder = new TextEncoder();

  // Keys/model are read from the server environment only — never shipped to the client.
  const apiKey = import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY;
  const model =
    import.meta.env.CLAUDE_MODEL ?? process.env.CLAUDE_MODEL ?? 'claude-opus-4-8';

  // Graceful fallback when the model bridge is unavailable.
  if (!apiKey) {
    return new Response(fallbackAnswer(lastUser), { headers: TEXT_HEADERS });
  }

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let emitted = false;
      try {
        const completion = client.messages.stream({
          model,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: history,
        });
        completion.on('text', (delta: string) => {
          emitted = true;
          controller.enqueue(encoder.encode(delta));
        });
        await completion.finalMessage();
      } catch (err) {
        // If we hadn't streamed anything yet, degrade to the grounded fallback
        // rather than failing the visitor's request outright.
        if (!emitted) {
          controller.enqueue(encoder.encode(fallbackAnswer(lastUser)));
        }
        console.error('[api/chat] streaming error:', err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: TEXT_HEADERS });
};
