# Prajwal Hebbar — Portfolio

A single-page portfolio for **Prajwal Hebbar, Senior Full-Stack Engineer**, built with **Astro**.

The page is rendered from a config, the way the products it describes are: every section is one
entry in `src/config/site.ts`, drawn by the component registered for its `type`. Visitors can
inspect each section's entry, switch its variant, reorder sections and change theme, accent and
density. The reasons behind the design are in `docs/design-direction.md`.

## How it works

- **`src/config/site.ts`** — the section list. Reordering the array reorders the page.
- **`src/pages/index.astro`** — the `type → component` registry and the render loop.
- **`src/components/Section.astro`** — the shell around every section: signature, variant switch,
  schema pane, move buttons. The schema pane prints that section's config entry.
- **`src/config/prefs.ts`** — the runtime config a visitor may change, and the schema the editor
  panel (`ConfigEditor.astro`) is rendered from. Stored in `localStorage` under `ph_config`.
- **`src/lib/form-engine.ts`** + **`src/config/demo-form.ts`** — the form-engine demo: visibility
  rules, derived fields and a maker-checker workflow evaluated from one JSON schema.
  `src/scripts/engine-demo.ts` renders it.
- **`src/data/portfolio.ts`** — the content (experience, projects, skills) the config refers to.
- **`src/styles/tokens.css`** — design tokens; **`src/styles/site.css`** — everything else.

To add project screenshots, put the files in `public/` and add
`media: [{ src: '/file.png', alt: '…' }]` to the project in `src/data/portfolio.ts`.

## Getting started

```bash
pnpm install
pnpm dev                  # http://localhost:4321
pnpm build                # outputs a Vercel Build Output API bundle
```

The Vercel adapter does not support `astro preview`. Use `pnpm dev` locally.

## Deploy to Vercel

The project uses Astro's `@astrojs/vercel` adapter and is fully prerendered: there are no server
routes and no environment variables. Import the repository in Vercel and keep the detected Astro
preset, or run `npx vercel` / `npx vercel --prod`.

## Résumé

`resume/resume.html` is the source; `resume/build.sh` builds `public/Prajwal Hebbar - Resume.pdf`,
which the nav and hero link to.
