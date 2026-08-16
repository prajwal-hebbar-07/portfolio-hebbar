/* ============================================================
   Personalization — shared vocabulary
   ------------------------------------------------------------
   Pure data and pure functions only. This module is imported by
   PersonalizePanel.astro at build time, so it must never touch
   `document`, `window` or `localStorage`. All DOM work lives in
   src/scripts/personalize.ts.
   ============================================================ */

export type ThemeMode = 'dark' | 'light';

export type AccentId =
  | 'verdigris'
  | 'cobalt'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'ember'
  | 'slate'
  | 'custom';

export type FontId = 'grotesk' | 'mineral' | 'editorial' | 'mono';

export const SECTION_IDS = [
  'hero',
  'about',
  'experience',
  'projects',
  'skills',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface Personalization {
  v: 1;
  theme: ThemeMode;
  accent: AccentId;
  /** Seed hue for accent === 'custom'; ignored otherwise. */
  seed: string;
  font: FontId;
  order: SectionId[];
}

export const STORE_KEY = 'ph_personalize';
export const LEGACY_THEME_KEY = 'ph_theme';
export const DEFAULT_SEED = '#4FA894';
export const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Swatch order is the picker's visual order. `custom` is absent: it is driven
 * by the colour input and has no fixed swatch.
 *
 * `dark` / `light` duplicate --accent-400 / --accent-500 from tokens.css so a
 * swatch can paint a hue that is not the active one. A swatch cannot read
 * another accent's ramp, because each ramp only exists under its own
 * [data-accent] block. Keep these in sync with section 1b of tokens.css.
 */
export const ACCENTS: ReadonlyArray<{
  id: AccentId;
  label: string;
  dark: string;
  light: string;
}> = [
  { id: 'verdigris', label: 'Verdigris', dark: '#4FA894', light: '#2F7A6A' },
  { id: 'cobalt', label: 'Cobalt', dark: '#5B8FDB', light: '#2F62B4' },
  { id: 'violet', label: 'Violet', dark: '#9678D6', light: '#6B47B0' },
  { id: 'rose', label: 'Rose', dark: '#DB7691', light: '#B43F5E' },
  { id: 'amber', label: 'Amber', dark: '#D9A441', light: '#B07C1E' },
  { id: 'ember', label: 'Ember', dark: '#DB8460', light: '#B4522A' },
  { id: 'slate', label: 'Slate', dark: '#8A979E', light: '#5A686F' },
];

export const FONTS: ReadonlyArray<{ id: FontId; label: string; note: string }> = [
  { id: 'grotesk', label: 'Grotesk', note: 'Space Grotesk · Plex Sans' },
  { id: 'mineral', label: 'Mineral', note: 'Archivo · Plex Sans' },
  { id: 'editorial', label: 'Editorial', note: 'Instrument Serif · Plex Sans' },
  { id: 'mono', label: 'Monospace', note: 'IBM Plex Mono' },
];

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: 'Intro',
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  contact: 'Contact',
};

const ACCENT_IDS: Record<AccentId, true> = {
  verdigris: true,
  cobalt: true,
  violet: true,
  rose: true,
  amber: true,
  ember: true,
  slate: true,
  custom: true,
};

const FONT_IDS: Record<FontId, true> = {
  grotesk: true,
  mineral: true,
  editorial: true,
  mono: true,
};

export function defaults(): Personalization {
  return {
    v: 1,
    theme: 'dark',
    accent: 'verdigris',
    seed: DEFAULT_SEED,
    font: 'grotesk',
    order: [...SECTION_IDS],
  };
}

/**
 * Coerce arbitrary parsed JSON into a valid record. Never throws.
 * `fallbackTheme` supplies the theme when the record omits it — that is how
 * the legacy `ph_theme` key and the OS preference feed the first read.
 */
export function normalize(raw: unknown, fallbackTheme: ThemeMode): Personalization {
  const base = defaults();
  base.theme = fallbackTheme;
  if (typeof raw !== 'object' || raw === null) return base;
  const o = raw as Record<string, unknown>;

  if (o.theme === 'dark' || o.theme === 'light') base.theme = o.theme;
  if (typeof o.accent === 'string' && Object.hasOwn(ACCENT_IDS, o.accent)) {
    base.accent = o.accent as AccentId;
  }
  if (typeof o.font === 'string' && Object.hasOwn(FONT_IDS, o.font)) {
    base.font = o.font as FontId;
  }
  if (typeof o.seed === 'string' && HEX.test(o.seed)) base.seed = o.seed;

  if (Array.isArray(o.order)) {
    const seen = new Set<SectionId>();
    const next: SectionId[] = [];
    for (const entry of o.order) {
      if (typeof entry !== 'string') continue;
      const id = entry as SectionId;
      if (!SECTION_IDS.includes(id) || seen.has(id)) continue;
      seen.add(id);
      next.push(id);
    }
    /* A section missing from a stale record keeps a tail position, so adding
       a section to the page never strands it off-screen. */
    for (const id of SECTION_IDS) if (!seen.has(id)) next.push(id);
    base.order = next;
  }
  return base;
}
