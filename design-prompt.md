# Claude Design Prompt — Prajwal Hebbar Portfolio Redesign

Paste the prompt below into Claude (with `portfolio-content.md` attached or pasted alongside).
Edit the bracketed `[...]` choices first to steer the look you want.

---

## Prompt

You are a senior product designer and front-end engineer. Design and build a **fresh, modern
personal portfolio website** for **Prajwal Hebbar, a Full Stack Developer**. All copy, sections,
experience, skills, and contact details must come from the attached `portfolio-content.md` — do
not invent facts, dates, or projects. You may rewrite phrasing for tone but keep every fact
accurate.

### Tech & deliverable
- Build with **Next.js (App Router) + TypeScript + TailwindCSS**.
- Single-page scroll layout with anchored nav (About, Experience, Skills, Contact) plus a Resume button.
- Include an **AI assistant chatbot** (see the dedicated section below) so visitors can get answers without reading the whole page.
- Production-quality, accessible (semantic HTML, keyboard nav, WCAG AA contrast, reduced-motion support), and **fully responsive (mobile-first) across every component, including the assistant**.
- Output the full file tree and the code for each file. Keep components small and reusable.

### Visual direction
- **Aesthetic:** [modern / minimal / bold dark-mode developer brand] — pick one cohesive direction and commit to it.
- **Theme:** dark mode primary with a light variant; respect `prefers-color-scheme`.
- **Color:** [an accent palette of your choosing — suggest something distinctive, not generic blue].
- **Typography:** strong type hierarchy; a characterful display face for headings and a clean sans for body.
- **Personality:** the subject works in **React, Next.js, Web3 & AI** — the design should feel technical, intelligent, and current without being gimmicky.

### Sections (in order)
1. **Hero** — name, title, the headline tagline, "Available for opportunities" badge, primary CTA (Contact) + secondary (Resume), location.
2. **About** — short bio, education, languages, the 30%+ efficiency highlight as a stat.
3. **Experience** — a clean timeline or card layout for the 3 roles; show role, company, dates, location, highlights, and tech tags.
4. **Skills** — grouped by category (Frontend, UI & Styling, Web3 & AI, Backend & DevOps, Tools) as tag clusters or a tidy grid.
5. **Contact** — email, phone, LinkedIn, GitHub with icons; a clear call to action.
6. **Footer** — built-with note and copyright.
7. **AI Assistant** — a persistent, always-reachable chatbot (see below). Not a scroll section but a floating, site-wide feature.

### AI Assistant (chatbot) — required feature
The site must include a conversational assistant so a visitor (e.g. a recruiter) can get what they need **without reading the entire page**.

- **Entry point:** a floating action button pinned to a screen corner (bottom-right on desktop, comfortably thumb-reachable on mobile), with a clear label/icon ("Ask AI" / chat glyph) and an inviting idle state.
- **Surface:** opens into a chat panel — a docked side/corner panel on desktop, and a **full-screen or near-full-screen sheet on mobile** so the conversation is usable on small screens. Smooth open/close transition; closeable and minimizable; remembers state during the session.
- **Purpose & capabilities:** it answers questions about Prajwal grounded **only** in `portfolio-content.md`. Core jobs:
  - **Summarize** the portfolio ("give me the 30-second version", "what does he do?").
  - Answer targeted questions ("what's his Web3 experience?", "how many years?", "what's his strongest stack?", "how do I contact him?").
  - Offer **suggested prompt chips** on first open (e.g. "Summarize his experience", "Top skills", "Tell me about LYIK", "How to contact") to guide visitors.
  - When relevant, point the user to the matching section / contact link.
- **Architecture:** wire it to an LLM via a Next.js **route handler** (server-side) so the API key is never exposed client-side. **Use the Anthropic API with a current Claude model** (do not hardcode an outdated model id — pick the latest available). Pass `portfolio-content.md` (or a structured digest of it) as grounding context in the system prompt; instruct the model to answer only from that content and to say so when something isn't covered. Stream responses token-by-token. Keep a typed client/server contract.
- **UX details:** typing/loading indicator, message timestamps optional, autoscroll, Enter-to-send (Shift+Enter for newline), graceful error + retry state, and an empty/welcome state. Persist conversation in memory for the session only.
- **Accessibility & responsiveness:** full keyboard operation (open, focus trap inside panel, Esc to close, focus return to the trigger), ARIA roles/labels for the dialog and message log, respects `prefers-reduced-motion`, and **looks and works correctly at every breakpoint** — the panel must never overflow the viewport or cover the page unusably on mobile.
- Make the LLM provider/model and the grounding content easy to swap (env vars + a single content/config module). Provide a graceful fallback message if the API key is missing.

### Motion & polish
- Subtle scroll-reveal and hover micro-interactions (Framer Motion is fine), gated behind `prefers-reduced-motion`.
- Smooth anchor scrolling and a sticky, condensing nav.
- Optional: a tasteful animated hero background that nods to AI/Web3 (mesh gradient, particles, or subtle grid) — keep it performant.

### Constraints
- No external content beyond `portfolio-content.md` — this includes the AI assistant, which must answer **only** from that content.
- Fast: lazy-load anything heavy (including the chat panel), optimize images, keep bundle lean.
- Never expose the LLM API key client-side; keep all model calls server-side via route handlers. Read keys from env vars and document them.
- Provide a short README with setup/run instructions, the required env vars (e.g. `ANTHROPIC_API_KEY`), and how to swap the model or grounding content.

Start by proposing the overall visual concept (1 short paragraph + the palette and font choices),
then build it.

---

## How to use
1. Fill in the `[...]` brackets above with your preferences (or leave them for Claude to decide).
2. Attach / paste `portfolio-content.md`.
3. Send. Iterate on the concept before asking for full code.
