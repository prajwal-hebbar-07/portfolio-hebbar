# Prajwal Hebbar — Portfolio

A bold, dark-mode developer portfolio for **Prajwal Hebbar, Full Stack Developer**, built with
**Astro** on the **Oni Do design system**. Single-page scroll layout with a grounded, streaming
**AI assistant** powered by the Anthropic API.

This implements the design handed off from [claude.ai/design](https://claude.ai/design)
(`Prajwal Hebbar - Portfolio.html`) as a real Astro site — pixel-faithful to the prototype, with
the assistant rewired to a secure server-side route.

## Stack

- **[Astro](https://astro.build)** — static pages + one on-demand API route (Node adapter).
- **Oni Do design system** — OKLCH color tokens, Space Grotesk / Hanken Grotesk / JetBrains Mono
  type, soft radii, diffuse shadows + vermilion glow. Tokens live in `src/styles/tokens.css`.
- **[Lucide](https://lucide.dev)** icons (CDN).
- **[@anthropic-ai/sdk](https://www.npmjs.com/package/@anthropic-ai/sdk)** for the assistant.

## Getting started

```bash
npm install
cp .env.example .env      # then add your ANTHROPIC_API_KEY
npm run dev               # http://localhost:4321
```

The site runs **without a key** — the assistant falls back to a deterministic, still-grounded
answer so nothing breaks. Add a key to get live, streamed Claude responses.

### Build & run (production)

```bash
npm run build             # outputs ./dist (static pages + Node server for the API route)
npm run preview           # serves the built site via the Node adapter
```

## Environment variables

| Variable            | Required | Default            | Purpose                                                                 |
| ------------------- | -------- | ------------------ | ----------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | No\*     | —                  | Server-side key for the assistant. Without it, the canned fallback runs. |
| `CLAUDE_MODEL`      | No       | `claude-opus-4-8`  | Which Claude model the assistant uses.                                  |

\* Not required to run the site, but required for live AI answers. **The key is read only on the
server** (`src/pages/api/chat.ts`) and is never exposed to the browser.

For a faster / cheaper assistant (this is simple grounded Q&A), set `CLAUDE_MODEL=claude-haiku-4-5`.

## The AI assistant

A floating "Ask AI" button opens a docked chat panel (desktop) / near-full-screen sheet (mobile).
It answers visitor questions about Prajwal **only** from his portfolio content.

- **Grounding & prompt** live in one place: `src/data/portfolio.ts` (`PORTFOLIO_CONTENT`,
  `SYSTEM_PROMPT`, and the offline `fallbackAnswer`). This same module also drives the rendered
  Experience and Skills sections, so content stays in sync.
- **Server route:** `src/pages/api/chat.ts` streams the reply from the Anthropic Messages API
  token-by-token (`client.messages.stream`). The browser reads the response body as a stream.
- **Swap the grounding/model:** edit `src/data/portfolio.ts` for content, or set `CLAUDE_MODEL`.

## Résumé

The résumé button is a placeholder (shows a toast). Drop a PDF in `public/` (e.g.
`public/prajwal-hebbar-resume.pdf`) and point the `[data-resume]` links at it in
`src/components/Nav.astro` to wire it up.

## Project structure

```
src/
  data/portfolio.ts        # content + AI grounding/system-prompt/fallback (source of truth)
  styles/                  # tokens.css (Oni Do design system) + portfolio.css
  layouts/Layout.astro     # <head>, global styles, Lucide + client script
  components/               # Nav, Hero, About, Experience, Skills, Contact, Footer, Assistant
  scripts/app.ts           # theme, nav, scroll-reveal, mobile menu, toast, assistant client
  pages/
    index.astro            # the page
    api/chat.ts            # server-side streaming assistant endpoint (prerender = false)
public/favicon.svg
```
