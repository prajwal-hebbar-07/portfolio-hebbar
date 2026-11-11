# Design direction — decisions

Answered by user 2026-11-11. Final; do not re-ask. Supersedes the Mineral
ideology in `docs/paper-design-plan.md`, which is kept only as history.

| Question | Answer |
| --- | --- |
| Problem with current design | Shows, doesn't prove |
| Core concept | Site is a config: page visibly renders from a JSON schema, like the LYIK forms platform |
| Reader to win | Engineering hiring manager |
| Story lead | Work leads (LYIK forms platform v1 → v3 as spine); side projects are proof |
| Config depth | Inspect + toggle: normal skimmable page; per-section "view schema" switch; a few safe live toggles (order, variant, density). No always-on split view, no free JSON editing |
| Live proof pieces | (1) mini form engine demo: JSON-rendered form with a rule, a derived field, a maker-checker step; (2) v1 → v2 → v3 evolution; (3) project demos / screenshots |
| Visual tone | Precise technical tool: mono labels, type annotations, grids, tight and sharp. New token set; Mineral retired |
| Personalize panel | Rebuilt as the config editor |
| AI assistant | Dropped; dead assistant code to be deleted |
| Design medium | Code directly; no Paper step |

## As built (2026-11-11)

- Token set "Spec" in `src/styles/tokens.css`: Geist + Geist Mono, square corners, hairlines, one
  accent (blueprint, signal, phosphor or violet), light and dark.
- Sections, in default order: hero, engine (form demo), evolution, experience, projects, skills,
  about, contact. Variants: experience `detailed | compact`, projects `tabs | list`, skills
  `grid | list`.
- Assistant removed entirely, including the two API routes and the Anthropic SDK.
- Open: project screenshots. None existed; the `media` field on a project renders them once added.
