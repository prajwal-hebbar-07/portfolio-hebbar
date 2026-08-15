# Paper → code implementation plan

Design file: **Portfolio Website** · page: **Design - V1** (`3-0`) · read 2026-08-15
Paper URL: https://app.paper.design/file/01KYWJTEE9F0EF8ZPFBKN5XAY1/3-0
Artboards: `01 · Portfolio — Light` (JS-0, 1440×5900) · `02 · Portfolio — Dark` (1HK-0, 1440×5900) ·
`03 · Assistant — Light` (2HZ-0, 520×672) · `04 · Assistant — Dark` (2KL-0, 520×672)
Repo: `/Users/hebbar/chaotic-thoughts/hobby/portfolio-hebbar` (Astro 6, static + Vercel adapter)

**Plan status: awaiting approval.** Nothing in the repo has been changed by this plan.

---

## 0. Headline read

The design is a **complete design-system replacement**, not a restyle. Paper's file carries its own
token set ("Mineral": limestone / slate / basalt / verdigris / oxide, Archivo + IBM Plex) and every
node references it through `var(--token)`. The repo runs a different system ("Oni Do": OKLCH
ink/paper/vermilion/mint, Space Grotesk + Hanken Grotesk + JetBrains Mono) whose spacing and type
scales are **defined but unused** — `src/styles/portfolio.css` (681 lines) has 0 `--sp-*` references,
5 `--fs-*` references, and 433 raw `px` literals.

Consequence: steps 1–2 rewrite the token layer, and every later step rewrites that section's CSS
against the new tokens. The **HTML structure and data flow of most components survives** — the
design's DOM shape is close to what the components already emit.

Three geometry facts that make this tractable:

- `--container-content: 1180px` in Paper == `.wrap { width: min(1180px, 100% - 48px) }`
  (`portfolio.css:32`). Content width is unchanged.
- All eight page sections use `paddingInline: 130px` at a 1440 artboard → 1440 − 260 = 1180. Same
  container, expressed as padding.
- The dark artboard is **geometrically identical** to the light one — same node structure, same
  spacing, only `--color-*` → `--color-dark-*`. No separate layout work for dark mode.

---

## 1. Design tokens

Source: `get_basic_info` → `tokens.items` (107 tokens, contentHash `90b4f665`). Repo side:
`src/styles/tokens.css`.

### 1a. Color — raw palette (all `new token`)

| Token | Paper value | Repo equivalent | Action |
| --- | --- | --- | --- |
| `--color-limestone-50` | `#FAF9F6` | `--paper-0` (oklch) | new token |
| `--color-limestone-100` | `#F3F1EC` | `--paper-50` | new token |
| `--color-limestone-200` | `#E7E4DC` | `--paper-100` | new token |
| `--color-limestone-300` | `#D5D1C7` | `--paper-300` | new token |
| `--color-slate-400` | `#A8AEB2` | — | new token |
| `--color-slate-500` | `#868C91` | — | new token |
| `--color-slate-600` | `#616A6F` | — | new token |
| `--color-slate-700` | `#474F54` | — | new token |
| `--color-slate-800` | `#2A3034` | — | new token |
| `--color-basalt-900` | `#171A1C` | `--ink-800` | new token |
| `--color-basalt-950` | `#0E1113` | `--ink-900` | new token |
| `--color-verdigris-100` | `#DDEBE6` | — | new token |
| `--color-verdigris-300` | `#8FC4B5` | — | new token |
| `--color-verdigris-500` | `#2F7A6A` | `--vermilion-500` (role) | new token |
| `--color-verdigris-600` | `#266255` | `--vermilion-600` (role) | new token |
| `--color-verdigris-700` | `#1D4A40` | `--vermilion-700` (role) | new token |
| `--color-oxide-100` | `#F2E2DB` | — | new token |
| `--color-oxide-500` | `#9E4A2E` | `--red-500` (role) | new token |

Retire after cutover: `--ink-*`, `--paper-*`, `--vermilion-*`, `--mint-*`, `--green-500`,
`--amber-500`, `--red-500`. The accent hue moves from vermilion (orange-red) to **verdigris
(green-teal)**; there is no mint counter-accent in the design.

### 1b. Color — semantic, light (`:root` / `[data-theme="light"]`)

| Token | Paper value | Repo equivalent | Action |
| --- | --- | --- | --- |
| `--color-ground` | `var(--color-limestone-100)` | `--bg-canvas` | new token |
| `--color-surface` | `var(--color-limestone-50)` | `--bg-surface` | new token |
| `--color-sunken` | `var(--color-limestone-200)` | `--bg-inset` | new token |
| `--color-hairline` | `var(--color-limestone-300)` | `--border-1` | new token |
| `--color-hairline-strong` | `var(--color-slate-400)` | `--border-2` | new token |
| `--color-ink` | `var(--color-basalt-900)` | `--fg-1` | new token |
| `--color-body` | `var(--color-slate-700)` | `--fg-2` | new token |
| `--color-muted` | `var(--color-slate-500)` | `--fg-3` | new token |
| `--color-accent` | `var(--color-verdigris-500)` | `--accent` | new token |
| `--color-accent-hover` | `var(--color-verdigris-600)` | `--accent-hover` | new token |
| `--color-accent-press` | `var(--color-verdigris-700)` | `--accent-press` | new token |
| `--color-accent-wash` | `var(--color-verdigris-100)` | `--accent-tint` | new token |
| `--color-on-accent` | `var(--color-limestone-50)` | `--on-accent` | new token |
| `--color-on-ink` | `var(--color-limestone-50)` | — | new token |
| `--color-error` | `var(--color-oxide-500)` | `--danger` | new token |
| `--color-error-wash` | `var(--color-oxide-100)` | — | new token |

No `--success` / `--warning` equivalent exists in the design. Keep the repo's two if any code needs
them; nothing in the shipped page does.

### 1c. Color — semantic, dark

Paper expresses the second theme as **separate token names** (a single-file convention), not as a
scoped override:

| Paper dark token | Value |
| --- | --- |
| `--color-dark-ground` | `var(--color-basalt-950)` |
| `--color-dark-surface` | `#171B1D` |
| `--color-dark-sunken` | `#080B0C` |
| `--color-dark-hairline` | `#262C2F` |
| `--color-dark-hairline-strong` | `#3A4247` |
| `--color-dark-ink` | `#F1EFEA` |
| `--color-dark-body` | `#B6BDC0` |
| `--color-dark-muted` | `#7E868A` |
| `--color-dark-accent` | `#4FA894` |
| `--color-dark-accent-wash` | `#16302B` |
| `--color-dark-on-accent` | `#08110F` |
| `--color-dark-on-ink` | `var(--color-basalt-950)` |
| `--color-dark-error` | `#D9744F` |
| `--color-dark-error-wash` | `#33170F` |

**Deliberate deviation (decide at step 1):** implement these as a `[data-theme="dark"]` block that
re-points the *same* semantic names (`--color-ground: #0E1113` etc.), exactly as
`tokens.css:93-175` does today. Reason: `src/scripts/app.ts:19-48` switches themes by setting
`data-theme` on `<html>`; keeping one semantic vocabulary means **zero JS change and zero
per-component dark rules**. The `--color-dark-*` names stay in Paper only. Verified equivalence:
dark artboard nodes use `--color-dark-surface` wherever light nodes use `--color-surface`
(`2AF-0` vs `JT-0`, `1ZO-0` vs `NM-0`, `1HL-0` vs `1HE-0`).

### 1d. Typography

| Token | Paper value | Repo location | Action |
| --- | --- | --- | --- |
| `--font-display` | `Archivo` | `tokens.css:70` `'Space Grotesk', …` | update existing value |
| `--font-sans` | `IBM Plex Sans` | `tokens.css:71` `'Hanken Grotesk', …` | update existing value |
| `--font-mono` | `IBM Plex Mono` | `tokens.css:72` `'JetBrains Mono', …` | update existing value |
| `--text-xs` … `--text-5xl` | 12 / 13 / 15 / 17 / 20 / 26 / 34 / 46 / 64 / 88 px | `--fs-*` (11–64px, different steps) | new token (retire `--fs-*`) |
| `--leading-xs` … `--leading-5xl` | 16 / 20 / 24 / 28 / 32 / 32 / 38 / 48 / 64 / 84 px | `--lh-*` (unitless ratios) | new token (retire `--lh-*`) |
| `--tracking-tightest` | `-0.04em` | — | new token |
| `--tracking-tighter` | `-0.03em` | `--ls-display: -0.022em` | new token |
| `--tracking-tight` | `-0.015em` | `--ls-h3: -0.012em` | new token |
| `--tracking-normal` | `0em` | — | new token |
| `--tracking-label` | `0.12em` | `--ls-2xs: 0.04em` | new token |
| `--tracking-caps` | `0.16em` | — | new token |
| `--font-weight-regular/medium/semibold/bold/black` | 400 / 500 / 600 / 700 / **900** | `--fw-*` (400–700, no 900) | update: add 900 |

Font availability (`get_font_family_info`, all three resolve):

- **Archivo** — variable `wght 100–900`, `wdth 62–125`, roman + italic. Design uses 500 / 700 / 800 / **900**. ✅
- **IBM Plex Sans** — variable `wght 100–700`, `wdth 75–100`. Design uses 400 / 500 / 600 / 700. ✅
- **IBM Plex Mono** — static faces 100–700 + italics. Design uses 400 / 500 / 600. ✅

`tokens.css:12` currently `@import`s Space Grotesk + Hanken Grotesk + JetBrains Mono from Google
Fonts — replace that one line. Weights to request: Archivo 500,700,800,900 · IBM Plex Sans
400,500,600,700 · IBM Plex Mono 400,500,600.

Type roles observed (each cited to a node):

| Role | Family / size / weight / line-height / tracking | Color | Node |
| --- | --- | --- | --- |
| Hero H1 | display · `--text-4xl` (64) · 900 · **66px** · `--tracking-tighter` | `--color-ink` | `L1-0` |
| Hero intro line | display · `--text-lg` · 500 · 24px · `--tracking-tight` | `--color-body` | `L0-0` |
| Hero lede | sans · `--text-lg` · 400 · `--leading-lg` | `--color-body` | `L2-0` |
| Section H2 | display · `--text-3xl` (46) · 700 · `--leading-3xl` · `--tracking-tighter` | `--color-ink`, accent word `--color-accent` | `NI-0` / `NJ-0` |
| Card title | display · `--text-xl` (26) · 700 · `--leading-xl` · `--tracking-tight` | `--color-ink` | `O1-0`, `XR-0` |
| Skill group title | display · `--text-lg` · 700 · 24px · `--tracking-tight` | `--color-ink` | skills JSX |
| Eyebrow | mono · `--text-xs` · 500 · 16px · `--tracking-caps` · uppercase | `--color-accent` | `MD-0` |
| Meta label | mono · `--text-xs` · 500 · 16px · `--tracking-label` · uppercase | `--color-muted` | `1FN-0` |
| Body prose (About) | sans · `--text-md` (17) · 400 · **28px** | `--color-body` | `UH-0` |
| Bullet / list body | sans · `--text-base` · 400 · `--leading-base` | `--color-body` | `QW-0` |
| Emphasis value | sans · `--text-base` · 600 · 18px | `--color-ink` | `1FO-0` |
| Chip label | sans · `--text-sm` · 500 · 16px | `--color-body` | skills JSX |
| Tech tag | mono · `--text-xs` · 400 · 16px · `0.02em` | `--color-body` | `PE-0` |

### 1e. Spacing, radii, containers, breakpoints, shadows

| Group | Paper | Repo | Action |
| --- | --- | --- | --- |
| Spacing | `--spacing-1..10` = 4/8/12/16/24/32/48/64/96/128 | `--sp-1..12` = 2/4/8/12/16/20/24/32/40/48/64/80 | new scale (retire `--sp-*`, 0 current uses) |
| Radii | `--radius-xs` 2 · `sm` 4 · `md` 8 · `lg` 12 · `full` 999 | `--r-xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 20 · `2xl` 28 · `full` 999 | new scale — **every radius shrinks one step** (28 `--r-*` uses to rewrite) |
| Containers | `--container-prose` 680 · `--container-content` **1180** · `--container-wide` 1360 | `.wrap` literal `min(1180px, 100% - 48px)` | content width **matches existing**; add prose/wide as new tokens |
| Breakpoints | `--breakpoint-sm` 560 · `md` 768 · `lg` 1024 · `xl` 1280 | ad-hoc 920 / 860 / 820 / 720 / 620 / **560** | only 560 matches — see Risk R1 |
| Shadows | **none anywhere in the design** — depth is 1px hairlines only | `--shadow-1..3`, `--glow-accent`, `--glow-accent-2` | design is flat; decide keep-or-delete at step 1 |
| Motion | **not expressed in Paper** | `--ease-*`, `--t-*` (43–48 uses) | keep as-is, unchanged |

Section rhythm from the design: `paddingBlock: 112px` on About / Experience / Projects / Skills /
Contact; hero `112px` top / `128px` bottom; footer `34px` / `38px`; nav `18px`. Repo currently
`clamp(88px, 10vw, 128px)` (`portfolio.css:33`).

Every section except the footer carries `border-bottom: 1px solid var(--color-hairline)` — the page
is divided by hairlines, and the footer sits on `--color-ground` with no top border.

---

## 2. Frame → code map

Change class: `unchanged` | `restyle` | `restructure` | `new` | `delete`

| # | Paper frame (node) | Existing file(s) | Change class | Notes |
| --- | --- | --- | --- | --- |
| 0 | tokens (file-level) | `src/styles/tokens.css` (204 ln) | restructure | §1. Keep `[data-theme]` mechanism, replace vocabulary, swap Google Fonts `@import` (`tokens.css:12`). `.t-*` helper classes have 0 users — retire or re-point. |
| 0b | artboard root `JS-0` / `1HK-0` | `src/layouts/Layout.astro` (30 ln), `portfolio.css:1-40` | restyle | `background: --color-ground`, `font-family: --font-sans`, `.wrap` stays 1180, section padding-block → 112px, hairline bottom border per section. |
| 1 | Nav `JT-0` (1440×77) | `src/components/Nav.astro` (54 ln), `portfolio.css` nav block + `:141` media query | restructure | Bar: `--color-surface`, hairline bottom, `padding: 18px 130px`, `justify-content: space-between`, gap 16. Brand: 38px `--color-ink` tile radius-sm with `PH` (Archivo 800, 15px, `--color-on-ink`) + stacked name (display 700 `--text-md`) over `SENIOR ENGINEER` (mono 10px `--tracking-label` uppercase `--color-muted`) — **the mono subtitle is new**. Links: 5 items (About, Experience, Projects, Skills, Contact), sans 500 `--text-base` `--color-body`, `padding: 6px 14px 0`, each with a 2px underline slot below (active indicator) — repo's `.nav-links a` needs the indicator element. Actions: 40px icon buttons (theme, GitHub) + Résumé button 38px, `--color-surface`, 1px `--color-hairline-strong`, radius-sm, download icon + label (sans 600 `--text-sm`). Repo hardcodes the 5 links **twice** (desktop `Nav.astro:14-18`, mobile `:42-46`) — collapse to one array while here. |
| 2 | Hero `KV-0` (1440×875) | `src/components/Hero.astro` (58 ln), `portfolio.css:167-247` | restructure | Row, `align-items: flex-start`, `gap: 80`, `padding: 112px 130px 128px`. **No `100svh`, no `.hero-bg`/`.grid` overlay in the design** (see Q3). Left col 700px: status pill (`KX-0`, 34px, radius-full, surface + hairline, 8px dot, sans 500 `--text-sm`) → intro line (`margin-top: 36`) → H1 (`margin-top: 14`, 64/900/66px) → lede (`margin-top: 32`, width 520) → CTA row (`margin-top: 44`, gap 12; primary 46px accent radius-sm, secondary 46px surface + `--color-hairline-strong`) → 2 text socials (`margin-top: 26`, gap 20). Right col 400px (`margin-top: 96`): surface card radius-md, `padding: 6px 26px 20px`, mono `profile.ts` filename header (`--text-xs`, `0.04em`, accent), then 5 rows `padding-block: 14`, `gap: 16`, hairline top, 96px mono key + flexible sans 600 value. Repo's `.spec-card`/`.spec-row .k/.v` is the same shape — restyle + widths. |
| 3 | About `MA-0` (1440×815) | `src/components/About.astro` (49 ln), `portfolio.css:275-296` | restructure | **Highest-cost section.** 7 of About's class names have no CSS today (`.about-grid`, `.about-side`, `.stat-card`, `.glow`, `.stat-num`, `.stat-label`, `.acc`) while `portfolio.css:275-296` styles `.capability-grid`/`.about-meta` that no component emits. Design: eyebrow → H2 (`margin-top: 20`, width 880, wrap, `column-gap: 12`) → `margin-top: 56` two-column row (`gap: 64`): left 680px, two prose paragraphs (17px/28px, gap 20); right 436px column (gap 16) of three cards — stat card (`--color-accent-wash`, padding 28, radius-md: `30%+` in display 900 `--text-4xl` accent + `--text-sm` caption), education card (surface, `22px 24px`, mono uppercase label with 15px icon + sans 600 `--text-base` value), languages card (same shell, 3 chips). |
| 4 | Experience `NM-0` (1440×1110) | `src/components/Experience.astro` (58 ln), `portfolio.css:369-380` | restyle | Header block identical to About. List `margin-top: 56`, `gap: 24`. Each entry (`NV-0`): 40px index gutter (mono `--text-xs` `--tracking-label` muted, `padding-top: 34`) + card `padding: 32px 34px`, radius-md, surface, hairline, `gap: 52`. Card left 300px: title row (display 700 `--text-xl` + `Current` pill 24px `--color-accent-wash` radius-xs, mono 600 uppercase accent), company (`margin-top: 8`, sans 500 `--text-base` body), progression track (`margin-top: 20`; each row hairline-top, `padding-top: 8`, space-between, mono), when/location (`margin-top: 20`, mono `--text-xs`/20px muted). Card right (flex 1, gap 16): bullets — 6px accent square (`--radius-xs`, `margin-top: 9`) + 14px gap + text; then tech row (`padding-top: 20`, hairline top, gap 8) of 26px mono tags, radius-xs, `--color-sunken`. Repo already emits every one of these pieces. |
| 5 | Projects `XE-0` (1440×1461) | `src/components/Projects.astro` (45 ln), `portfolio.css:421-430` | restyle | **Card shell is byte-identical to Experience** (`XP-0` computed styles == `NY-0`). Left 300px: name (display 700 `--text-xl`) → tagline (`margin-top: 12`, sans `--text-base`/24) → status pill (`margin-top: 18`, accent-wash, radius-xs, mono 600 uppercase accent, `align-self: flex-start`) → stack line (`margin-top: 18`, hairline top, `padding-top: 14`, mono `--text-xs`/20 muted) → repo link (`margin-top: 14`, 18px icon + mono `--text-xs` body, gap 8). Right: same bullet + tech-tag treatment. Extract the shared shell (see §3). |
| 6 | Skills `1B6-0` (1440×899) | `src/components/Skills.astro` (35 ln), `portfolio.css:435-455` | restyle | Grid `margin-top: 56`, `flex-wrap`, `gap: 16`, four 582px cards + one full-width 1180px card. Card: surface, hairline, radius-md, `padding: 26px 28px`, `gap: 18`. Head: 40px `--color-accent-wash` radius-sm icon tile (20px icon) + display 700 `--text-lg` title. Chips: wrap, gap 8, 30px, radius-full, `--color-sunken`, 1px hairline, sans 500 `--text-sm` body. Repo's `.skill-card.alt` / `:last-child{grid-column:1/-1}` maps to the full-width card; drop the duplicated inline `style` at `Skills.astro:20`. Fix `&amp;` double-escaping in `portfolio.ts:128,130` while here. |
| 7 | Contact `1EJ-0` (1440×551) | `src/components/Contact.astro` (57 ln), `portfolio.css:497` | restyle | Row, `gap: 80`, `padding-block: 112`. Left 600px: eyebrow → H2 (`margin-top: 20`, width 560, `column-gap: 15`) → lede (`margin-top: 24`, sans `--text-lg`/`--leading-lg`) → primary button (`margin-top: 34`, 46px, accent, radius-sm, 17px icon + sans 600 `--text-base` on-accent). Right 500px, gap 10: four rows, surface, hairline, radius-md, `padding: 16px 18px`, `gap: 16` — 40px accent-wash radius-sm icon tile, stacked mono uppercase label (`--tracking-label`, muted) over sans 600 value (ink), 20px right-aligned arrow. Repo's `.contact-row` is this shape already. **No gradient panel** in the design. |
| 8 | Footer `1GS-0` (1440×112) | `src/components/Footer.astro` (22 ln) | restyle | `--color-ground`, no top border, `padding: 34px 130px 38px`, space-between. Left: 32px ink monogram radius-sm + mono `--text-xs` muted `Prajwal Hebbar — Senior Engineer`. Center: mono `--text-xs` `Designed in the` + `Mineral` (accent) + `system · © 2026 Prajwal Hebbar`. Right: three 40px radius-sm icon buttons. Remove the inline `style="…border-radius:10px"` at `Footer.astro:12` (off-token) and change the credit string from "Oni Do" to "Mineral". |
| 9 | Ask-AI FAB `1HE-0` | `src/components/Assistant.astro` / `AssistantLauncher.astro` (**not rendered today**) | restructure | `position: absolute; right: 32; bottom: 32`, 54px, radius-full, `--color-accent`, 1px `--color-accent-press`, `padding: 0 22px 0 18px`, gap 11, 20px sparkle icon + `Ask AI` (sans 600 `--text-base`, `--color-on-accent`). Dark: bg + border both `--color-dark-accent`. Blocked on Q1. |
| 10 | Assistant panel `2HZ-0` / `2KL-0` (520×672) | `Assistant.astro`, `portfolio.css` `.chat` block (~505-676), `app.ts:110-440` (dead) | restructure | Panel 440px, radius-lg, surface, hairline. Header `16px/14px` `padding-inline: 16`, gap 12, hairline bottom: 38px accent radius-sm avatar (20px icon), title (display 700 `--text-base` `--tracking-tight`) over status (7px dot + mono `--text-xs` muted `Online · grounded answers only`), 32px close button. Body `padding: 18px 16px`, gap 14: assistant bubble `--color-sunken` radius-md `12px/14px` `max-width: 340`, user bubble `--color-accent` + `--color-on-accent` text, `align-self: flex-end`, `max-width: 300`; starter chips 32px radius-sm on `--color-ground` + hairline (sans `--text-sm`); follow-up chips 30px radius-full, accent label. Composer: hairline top, `14px/16px`, field `--color-sunken` radius-md `10px 10px 10px 14px` + 34px accent radius-sm send button; meta row mono `--text-xs` muted `Grounded in portfolio content only` / `0 / 500`. Blocked on Q1. |

Sections in the design appear in this order: nav, hero, **About, Experience, Projects, Skills**,
contact, footer. `src/pages/index.astro:15-22` currently renders **Hero, Experience, Projects,
About, Skills, Contact** — About is 4th. Reordering `index.astro` to match the design (and the nav
link order) is a one-line move, listed in step 2.

---

## 3. Reusable components to extract

Extract only where the pattern repeats in ≥2 mapped frames.

| Component | Repeated in | Target path |
| --- | --- | --- |
| `SectionHeader` (28×1px accent rule + mono caps eyebrow, then wrapping H2 with accent word) | About `MB-0/NH-0`, Experience `NN-0/NQ-0`, Projects `XF-0/XI-0`, Skills `1B7-0/1BA-0`, Contact `1EL-0/1EO-0` | `src/components/ui/SectionHeader.astro` |
| `EntryCard` (40px index gutter + surface card, 300px meta column, flexible body, `gap: 52`) | Experience `NV-0`, Projects `XM-0` — computed styles identical | `src/components/ui/EntryCard.astro` |
| `BulletList` (6px accent `--radius-xs` square, `margin-top: 9`, `gap: 14`) | Experience `OE-0`, Projects `YE-0` | part of `EntryCard` or `src/components/ui/BulletList.astro` |
| `TechTagRow` (hairline top, `padding-top: 20`, gap 8, 26px mono tags on `--color-sunken`, radius-xs) | Experience `PC-0`, Projects `12Y-0` | `src/components/ui/TechTagRow.astro` |
| `Chip` (30px, radius-full, `--color-sunken`, hairline, sans 500 `--text-sm`) | Skills `1BL-0…`, About languages card | `src/components/ui/Chip.astro` |
| `StatusPill` (24px, radius-xs, `--color-accent-wash`, mono 600 uppercase accent) | Experience `O2-0` (`Current`), Projects `Y5-0` | `src/components/ui/StatusPill.astro` |
| `IconTile` (40px, radius-sm, `--color-accent-wash`) | Skills head `1BG-0`, Contact rows `1FI-0` | `src/components/ui/IconTile.astro` |
| `IconButton` (40px, radius-sm, transparent) | Nav actions `KH-0/KL-0`, Footer socials `1H2-0/1H5-0/1H9-0` | `src/components/ui/IconButton.astro` |
| `Button` (46px, radius-sm, gap 9 — primary accent / secondary surface + `--color-hairline-strong`) | Hero `LN-0`/`LS-0`, Contact `1FB-0`, Nav Résumé (38px variant) | `src/components/ui/Button.astro` |

Also collapse while touching these files (all pre-existing duplication, cited by the repo audit):
`const pad` defined 3× (`Experience.astro:3`, `Projects.astro:3`, `Skills.astro:3`); LinkedIn +
GitHub SVG paths byte-identical in `Contact.astro:3-6` and `Footer.astro:3-6`; résumé URL hardcoded
3× (`Nav.astro:27`, `Nav.astro:49`, `Hero.astro:30`).

---

## 4. Assets to export

**None.** Every icon in the design is an inline SVG path (Lucide-shaped: sun, github, download,
sparkles, code-xml, graduation-cap, languages, mail, phone, linkedin, arrow-up-right, send). There
are no image fills, no rasters, no logos to export — nothing for the `export` tool to do.

The repo already loads Lucide from CDN (`Layout.astro:25`, unpinned `@latest`) and inlines the
GitHub/LinkedIn paths where Lucide lacks brand marks. Implementation maps each design glyph to its
Lucide name; if a glyph has no Lucide equivalent, copy the path from `get_jsx` on that node rather
than exporting an asset.

| Node | Glyph | Plan |
| --- | --- | --- |
| `JV-0`… nav | sun / moon toggle | existing `#theme-ic` Lucide swap — unchanged |
| nav, footer | github | existing inline path |
| nav Résumé | download | Lucide `download` |
| `2BL-0`, `2E3-0`, `2I3-0` | sparkles | Lucide `sparkles` |
| `1BF-0`… skills heads | code-xml + 4 others | Lucide, per `skillGroups[].icon` (already data-driven) |
| `MN-0`, `MU-0` | graduation-cap, languages | Lucide |
| `1FH-0`… contact | mail, phone, linkedin, github + arrow-up-right | Lucide + existing inline paths |

---

## 5. Responsive deltas

| Section | Desktop (1440) | Tablet | Mobile |
| --- | --- | --- | --- |
| every section | read from `JS-0` / `1HK-0` | **UNREAD** | **UNREAD** |

**The design file contains no tablet or mobile artboards.** Only two 1440-wide portfolio artboards
(light/dark) and two 520-wide assistant panels exist (`get_basic_info`, `artboardCount: 4`). The
520px assistant artboards are the *docked panel*, not a mobile page.

The only responsive intent Paper carries is the breakpoint token set: `--breakpoint-sm: 560px`,
`--breakpoint-md: 768px`, `--breakpoint-lg: 1024px`, `--breakpoint-xl: 1280px`.

This is Risk R1 and it blocks step 12. See Q2 for the decision the user must make.

---

## 6. Content and functionality to preserve

Nothing here may be lost while restyling.

**Data (source of truth — do not retype design copy over it):** `src/data/portfolio.ts` — `profile`
(15 keys), `experiences[]` (2), `projects[]` (2), `skillGroups[]` (5), `PORTFOLIO_CONTENT`,
`SYSTEM_PROMPT`, `fallbackAnswer()`. `points[]` carry inline `<b>`/`<code>` and render through
`set:html` (`Experience.astro:46`, `Projects.astro:33`); `when` renders via `<Fragment set:html>`
(`Experience.astro:40`). `src/data/assistant.ts` — `identity`, `starters` (6), `validation`
(`maxLen: 500`), `guardrail`, `answers`, `route()`, `offlineAnswer()`.

**Behaviour in `src/scripts/app.ts` (449 ln) that must still work after the restyle:**

| Behaviour | Lines | Hooks that must survive the markup rewrite |
| --- | --- | --- |
| Theme toggle + persistence | 19–48 | `#theme-toggle`, `#theme-ic[data-lucide]`, `<html data-theme>`, `localStorage['ph_theme']` |
| Nav condense on scroll | 50–58 | `#nav`, `.condensed` |
| Scroll-spy | 60–73 | `section[id]`, `.nav-links a[href="#id"]`, `.active` |
| Mobile menu | 75–90 | `#mobile-menu`, `#nav-toggle`, `#nav-toggle-ic`, `.open`, `body.no-scroll`, `aria-expanded` |
| Scroll reveal | 92–108 | `.reveal`, `.in`, `data-delay="1..4"`, `prefers-reduced-motion` |
| Copyright year | 442–444 | `#year` |
| Lucide init | 447 | `refreshIcons()` after any icon-name swap |

**Routes / server:** `src/pages/api/chat.ts` and `src/pages/api/portfolio/ask.ts` are out of scope —
do not touch. Résumé link target `public/Prajwal Hebbar - Resume.pdf` must keep working from nav
(×2) and hero.

**Accessibility already present:** `aria-expanded`/`aria-controls` on the nav toggle, `role="dialog"`
on the chat panel, focus trap + Esc (`app.ts:173`). Keep all of it; the design specifies no focus
states, so reuse the repo's.

---

## 7. Risks and open questions

**R1 — No mobile/tablet frames (blocking for step 12).** §5. Every responsive decision below 1440
would be invented. The repo's current ladder is 920/860/820/720/620/560 (desktop-first, max-width);
the design's tokens say 1280/1024/768/560.

**R2 — This is a stylesheet rewrite, not a patch.** `portfolio.css` is 681 lines with 433 raw px
literals, 21 `clamp()`s, and 28 `--r-*` uses whose radius scale all shift one step. Editing in place
will leave Oni Do values stranded. Recommended: rewrite `portfolio.css` **section block by section
block** as each step lands, so the file is never half-migrated across a whole section.

**R3 — About is a rewrite, not a diff.** 7 of its classes have no CSS; `portfolio.css:275-296`
styles `.capability-grid`/`.about-meta`, which no component emits, plus two media queries
(`:291`, `:294`) targeting that dead markup. Today the section renders unstyled stacked blocks.

**R4 — The assistant is designed but not shipped.** Frames 9 and 10 exist in Paper, but
`Assistant.astro`, `AssistantLauncher.astro` and `StandaloneAssistantPage.astro` are imported by no
page, `scripts/assistant.ts` (344 ln) and `styles/assistant-ui.css` (268 ln) never load, and
`app.ts:110-440` is dead behind a guard that never passes (`app.ts:143`). Roughly 1080 of ~3300
non-lockfile lines in `src/` are unreachable. See Q1.

**R5 — No lint/typecheck.** `package.json` has only `dev`, `build`, `astro`; no devDependencies, no
`astro check`. The only verification available per step is `astro build`. See Q4.

**R6 — Copy divergence.** Design text is newer than parts of the repo in places (hero headline "I
build configurable software for complex enterprise workflows…", the About paragraphs mentioning the
promotion, spec-card values, "Designed in the **Mineral** system"). The repo is the content source
of truth per skill contract, but several of these strings are *hardcoded in markup*, not in
`portfolio.ts`. Default: adopt the design's copy where it replaces hardcoded markup prose, keep
`portfolio.ts` values wherever data drives the section, and move newly-hardcoded strings into
`portfolio.ts` as we go. Flagged per section at implementation time.

**R7 — No interactive states in the design.** Hover, focus, active, disabled, and loading are
`UNREAD` for every control; only `--color-accent-hover` / `--color-accent-press` tokens hint at
button states. Step 13 derives states from tokens and the repo's existing behaviour, not from Paper.

**R8 — Paper word-splitting is an artifact.** Wrapped paragraphs are stored as one `Text` node per
word inside a `flex-wrap` container with `column-gap: 4.5px` (`UG-0` 41 children, `QV-0` 27,
`2JR-0` 22). **Implement these as a single `<p>`.** Do not reproduce per-word spans, and do not read
`column-gap: 4.5px` as a design value — it is Paper's word spacing.

**R9 — Design is flat.** No `box-shadow` on any node read. The repo's `--shadow-1..3` and
`--glow-accent*` become unused after cutover.

**R10 — `astro build` output is prerendered**; the two API routes are Vercel Functions. Nothing in
this plan changes rendering mode.

**R11 — Legacy bridge (introduced by step 1, deleted by step 13).** A hard cutover would have left
`portfolio.css` (681 lines, 46 distinct Oni Do token names, 433 px literals) pointing at undefined
variables — the page would be unstyled between steps 1 and 10, and the user reviews section by
section. `tokens.css` therefore ends with a clearly-marked bridge block aliasing every legacy name
still referenced to its Mineral equivalent, so the existing CSS re-skins to the new palette
immediately and stays reviewable. It is temporary: each section step removes its own uses, step 13
deletes the block. Nothing new may reference a bridged name.

**R12 — Three bridge mappings have no design counterpart** (recorded so `paper-diff` does not
re-litigate them): `--accent-2` (15 uses, mint counter-accent) → `--color-verdigris-300`, because
Mineral has no second accent; `--success` → `--color-accent` and `--warning` → `--color-error`,
because Mineral defines only one functional hue (oxide/error); `--fg-4` (18 uses, "faint") →
`--color-hairline-strong`, because Mineral's text ramp stops at ink/body/muted. All four disappear
with the bridge.

**R13 — Interaction overlays kept as literals.** `--bg-hover` / `--bg-active` were theme-scoped
`oklch()` literals, not palette-derived, and Paper specifies no hover states (R7). They are
preserved verbatim as `--overlay-hover` / `--overlay-active` per theme rather than invented from
Mineral values. Step 13 revisits them.

**R14 — RESOLVED by user, 2026-08-15: design copy is the content source of truth.** R6's default is
reversed. A full text diff of every frame against the repo was run and applied as a standalone
content pass (see step 1b). The assistant is **out of scope** (Q1 answered: hidden → ignore), so
frames 9–10 and step 11 are dropped, not deferred.

**R15 — Text diff result.** Design and repo already agreed word-for-word on: hero (headline, intro,
lede, both CTA labels, both social labels, all five spec rows), both About paragraphs, the stat /
education / languages cards, all four LYIK bullets and its eight tech tags, both Content Enablers
bullets and its five tech tags, every project field (name, tagline, status, stack, repo label, all
ten bullets, all tech tags), all five skill groups and every chip, the whole contact block. The
divergences were confined to section headers, nav labels, three escaped ampersands, the footer
credit, and four bits of chrome the design does not draw — all listed in step 1b.

### Questions for the user (answer before the affected step)

- **Q1 — ANSWERED 2026-08-15: ignore the assistant.** The Ask-AI FAB (`1HE-0`) and the assistant
  panel (`2HZ-0` / `2KL-0`) are not implemented. Step 11 is dropped. The dead surfaces
  (`Assistant.astro`, `AssistantLauncher.astro`, `StandaloneAssistantPage.astro`,
  `scripts/assistant.ts`, `styles/assistant-ui.css`, `app.ts:110-440`) stay untouched for now;
  deleting them is a separate decision, not part of this design work.
- **Q2 (blocks step 12):** no mobile/tablet frames exist. Either (a) design them in Paper and re-run
  `paper-plan`, or (b) approve deriving responsive behaviour from the design's own breakpoint tokens
  (1280 / 1024 / 768 / 560) by reflowing each section's flex row to a column at `lg`/`md`.
- **Q3:** the design's hero is **not** full-viewport and has **no** gradient/grid background
  (`KV-0` is a plain `--color-ground` row, height 875). Drop `.hero-bg > .grid` and the `100svh`
  (`portfolio.css:167`), or keep them as an intentional code-only flourish?
- **Q4:** may `astro check` be added as a `typecheck` script (adds `@astrojs/check` +
  `typescript` as devDependencies)? Without it, per-step verification is `astro build` only.
- **Q5:** the design's default artboard is `01 · Portfolio — **Light**`; the repo boots
  `data-theme="dark"` (`Layout.astro:11`) with a `prefers-color-scheme` fallback. Flip the default
  to light, or keep dark-first?

---

## 8. Implementation order

One section per step. Do not batch. `paper-implement` ticks these boxes.

- [x] **1. Global tokens + fonts** — DONE 2026-08-15. `src/styles/tokens.css` rewritten to the
      Mineral vocabulary (§1a–1e), `[data-theme]` mechanism kept, Google Fonts `@import` swapped to
      Archivo + IBM Plex Sans + IBM Plex Mono, `--font-weight-black: 900` added, shadows/glows
      resolved to `none` (design is flat, R9). `--sp-*` / `--fs-*` / `--lh-*` / `--ls-*` / `--r-*`
      and the Oni Do palette are gone as *definitions*; the names that `portfolio.css` still uses
      survive only inside the legacy bridge (R11). No component touched. `astro build` ✅
- [x] **1b. Content pass (design copy → repo)** — DONE 2026-08-15, out of band at the user's
      request (R14). Applied: nav labels + order (`Nav.astro`, both copies) → About / Experience /
      Projects / Skills / Contact; Experience header → `Experience` + "Nearly five years of
      *shipped* enterprise systems." with the lede paragraph dropped; Projects header → `Projects` +
      "Local-first desktop software, *built to last.*", lede dropped; Skills header → "The stack
      behind *configurable* systems.", lede dropped; `&amp;` → `&` in three `skillGroups` titles
      (`portfolio.ts:128,130,131`); footer credit "Oni Do" → "Mineral"; `index.astro` section order
      → Hero, About, Experience, Projects, Skills, Contact (this also completes step 2's reorder
      item). Chrome the design does not draw, removed: the `@` prefix before the company name, the
      `zap` icon inside the `Current` pill, the location icon in `.xp-when`, the synthetic
      `Promoted` row in the progression track, and the `.sk-count` badge in skill card heads
      (`pad()` dropped from `Skills.astro`). `astro build` ✅
- [ ] **2. Page shell** — `Layout.astro` + the top ~40 lines of `portfolio.css`: body background
      `--color-ground`, base type, `.wrap` (1180 / 24px gutter, unchanged), section `padding-block:
      112px`, per-section hairline bottom border. (Section reorder already landed in step 1b.)
- [ ] **3. Nav** (frame `JT-0`) — mono `SENIOR ENGINEER` subtitle, the underline indicator slot, the
      GitHub icon button the design puts beside the theme toggle, and collapsing the duplicated link
      arrays into one. (Labels and order already landed in step 1b.)
- [ ] **4. Hero** (frame `KV-0`) — pending Q3 on `.hero-bg` / `100svh`.
- [ ] **5. About** (frame `MA-0`) — full rewrite; delete the orphaned `.capability-grid` /
      `.about-meta` rules and their two media queries.
- [ ] **6. Experience** (frame `NM-0`) — extract `SectionHeader`, `EntryCard`, `BulletList`,
      `TechTagRow`, `StatusPill` here; Projects reuses them next.
- [ ] **7. Projects** (frame `XE-0`) — consume the step-6 components; card shell is identical.
- [ ] **8. Skills** (frame `1B6-0`) — extract `Chip`, `IconTile`; drop the inline `grid-column`
      duplicate. (Ampersand escaping and the `.sk-count` badge already handled in step 1b.)
- [ ] **9. Contact** (frame `1EJ-0`) — extract `Button`; drop the gradient panel.
- [ ] **10. Footer** (frame `1GS-0`) — extract `IconButton`; remove the off-token inline style.
      ("Oni Do" → "Mineral" already landed in step 1b.)
- [~] **11. Ask-AI FAB + assistant panel** (frames `1HE-0`, `2HZ-0`/`2KL-0`) — **DROPPED** per Q1:
      the assistant is hidden and out of scope for this design work.
- [ ] **12. Responsive states**, all sections — **blocked on Q2.**
- [ ] **13. Visual cleanup** — hover / focus-visible / active / disabled derived from
      `--color-accent-hover` / `--color-accent-press` (R7), reduced-motion paths kept, print
      stylesheet re-pointed at the new tokens, dead CSS swept, **and the legacy bridge block in
      `tokens.css` deleted** (R11) — by then no `--fg-*` / `--bg-*` / `--r-*` / `--accent*` name
      should remain in `portfolio.css`.

After step 13, run `paper-diff` per section against its frame for pixel reconciliation.
