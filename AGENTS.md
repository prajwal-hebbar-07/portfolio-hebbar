# portfolio-hebbar

Astro 6 static single-page portfolio (Vercel adapter). Source of truth for the UI: the claude.ai
"hebbars.in redesign" canvas (minimal, Geist, light/dark via `prefers-color-scheme`).

## Layout

| Path | What |
| --- | --- |
| `src/pages/index.astro` | page: Nav, Hero, Experience, Projects, Stack, Background, Contact, Footer |
| `src/layouts/Layout.astro` | `<head>`, Geist fonts, global CSS |
| `src/components/` | one component per section; `Icon.astro` = inline SVG icons |
| `src/data/portfolio.ts` | all content (`profile`, `experiences`, `selectedWork`, `projects`, `skillGroups`) + assistant grounding strings |
| `src/styles/tokens.css` | colour/font vars, dark mode |
| `src/styles/portfolio.css` | all component styles |
| `src/config/`, `src/lib/` | standalone form-engine demo; not rendered |
| `public/` | favicon, résumé PDF |

## Where a change goes

| Change | Edit |
| --- | --- |
| Copy, jobs, projects, skills | `src/data/portfolio.ts` |
| Hero copy / stats | `src/components/Hero.astro` |
| Colours, fonts | `src/styles/tokens.css` |
| Layout, spacing | `src/styles/portfolio.css` |

## Commands

- `npm run dev` — local server
- `npm run build` — only check available (no lint/typecheck configured)

<!-- paper-target:start -->
## Paper design target

Design work in this repo reads from one Paper file and page. Before any Paper
MCP read, call `open_file` with these, then confirm with `get_basic_info`.

- File: `portfolio` — fileId `01KYWJTEE9F0EF8ZPFBKN5XAY1`
- Page: `v2-design` — pageId `4-0`
- Confirmed: `2026-08-17` via `get_basic_info`

Pass `fileId` on every Paper tool call. If `get_basic_info` reports a different
file or page, re-open the target — do not read the focused one. An explicit
`file=` / `page=` in the user's message overrides this block; a stale block is
fixed by re-running `paper-target`, never by silently using another file.
<!-- paper-target:end -->
