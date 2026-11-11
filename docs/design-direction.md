# Design direction

## Current direction

The visitor should understand Prajwal and his work without learning how the site is built.
This supersedes the earlier configuration-demo design.

- Warm cream canvas, muted green accent, soft pastel cards and rounded controls.
- Geist body text with a Georgia italic phrase in the introduction.
- Five sections: introduction, personal projects, experience, about and contact.
- All four personal projects are visible; technical details use native, optional disclosures.
- Company experience describes public, high-level responsibilities only. No company form
  renderer, product evolution, internal architecture or interactive reproduction is included.
- Light is the default. A single theme button persists a visitor's choice under
  the local-storage key `ph_theme`. Old configuration preferences are ignored.
- No schema panes, section reordering, layout controls or configuration editor.

## Implementation

Content lives in `src/data/portfolio.ts`; section order and copy live in
`src/config/site.ts`. The component registry in `src/pages/index.astro` renders that
data. Configuration stays an implementation detail.

See [the project index](../AGENTS.md) for file routing and commands.
