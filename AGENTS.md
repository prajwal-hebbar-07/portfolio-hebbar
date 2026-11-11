# Project index

## Purpose

Prajwal Hebbar’s static Astro portfolio. Follow [the design direction](docs/design-direction.md).
Personal project facts come from `src/data/portfolio.ts` and the existing content reference.
Keep company experience public and high level.

## Layout

| Directory | Contents and change routing |
| --- | --- |
| `./` | Astro/package configuration, `portfolio.test.mjs` and [content reference](portfolio-content.md). |
| `docs/` | [Design direction](docs/design-direction.md). |
| `public/` | Favicon, local font and downloadable résumé. |
| `src/components/` | Navigation, footer and shared project preview. |
| `src/components/sections/` | Introduction, projects, experience, about and contact. |
| `src/config/` | Section order, headings and introductory copy. |
| `src/data/` | Profile, project and public experience content. |
| `src/layouts/` | HTML metadata and initial theme. |
| `src/pages/` | Page composition and section registry. |
| `src/scripts/` | Theme button and storage handling. |
| `src/styles/` | Color/type tokens and responsive styling. |

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install locked dependencies. |
| `npm run dev -- --host 127.0.0.1` | Local preview. |
| `npm run build` | Validate compilation and generate `dist/`. |
| `npm test` | Build, then check rendered content, navigation, assets and theme behavior. |

No formatter, linter or standalone type checker is configured. Use Astro’s strict TypeScript config.

## Conventions

- Five sections render through `src/pages/index.astro` using `src/config/site.ts`.
- Light is the default; only `ph_theme` stores the chosen light/dark theme.
- Use native disclosures for optional project details. No configuration editor or company demos.
- Keep links and content usable without JavaScript; respect reduced motion.
