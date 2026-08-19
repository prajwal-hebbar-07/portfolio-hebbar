/* ============================================================
   Personalization — shared vocabulary
   ------------------------------------------------------------
   Pure data and pure functions only. This module is imported by
   PersonalizePanel.astro at build time, so it must never touch
   `document`, `window` or `localStorage`. All DOM work lives in
   src/scripts/personalize.ts.
   ============================================================ */

/** The resolved value written to `data-theme`. Never 'system'. */
export type ThemeMode = 'dark' | 'light';

/**
 * What the visitor picked. 'system' defers to the OS and keeps tracking it,
 * which is why the stored preference and the applied mode are separate types:
 * only `ThemeMode` is ever a valid `data-theme` value.
 */
export type ThemePref = ThemeMode | 'system';

export type AccentId =
  | 'verdigris'
  | 'cobalt'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'ember'
  | 'slate'
  | 'custom';

export type FontId = 'grotesk' | 'mineral' | 'editorial';

export type GroundId = 'limestone' | 'paper' | 'fog' | 'bone' | 'dust' | 'patina';

export type PrimaryId = 'basalt' | 'slate' | 'navy' | 'oxblood' | 'bistre' | 'graphite';

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
  theme: ThemePref;
  accent: AccentId;
  /** Seed hue for accent === 'custom'; ignored otherwise. */
  seed: string;
  font: FontId;
  /** Page background. Applied under the light theme only — see tokens.css §2b. */
  ground: GroundId;
  /** Display ink. Applied under the light theme only — see tokens.css §2b. */
  primary: PrimaryId;
  order: SectionId[];
}

export const STORE_KEY = 'ph_personalize';
export const LEGACY_THEME_KEY = 'ph_theme';
export const DEFAULT_SEED = '#4FA894';
export const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Collapse a stored preference into a mode that can be painted.
 * `prefersLight` is passed in rather than read here so this module stays
 * DOM-free; src/scripts/personalize.ts supplies it from matchMedia.
 */
export function resolveTheme(pref: ThemePref, prefersLight: boolean): ThemeMode {
  if (pref === 'system') return prefersLight ? 'light' : 'dark';
  return pref;
}

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

/**
 * `hex` paints the swatch directly: unlike the accent ramps, a ground or
 * primary value is a single flat colour, so no [data-*] block is needed to
 * show one the visitor has not selected. Keep in sync with tokens.css §2b.
 */
export const GROUNDS: ReadonlyArray<{ id: GroundId; label: string; hex: string }> = [
  { id: 'limestone', label: 'Limestone', hex: '#F3F1EC' },
  { id: 'paper', label: 'Paper', hex: '#FFFFFF' },
  { id: 'fog', label: 'Fog', hex: '#EDEFF1' },
  { id: 'bone', label: 'Bone', hex: '#F2EDE3' },
  { id: 'dust', label: 'Dust', hex: '#E7E4DC' },
  { id: 'patina', label: 'Patina', hex: '#E4E9E7' },
];

export const PRIMARIES: ReadonlyArray<{ id: PrimaryId; label: string; hex: string }> = [
  { id: 'basalt', label: 'Basalt', hex: '#171A1C' },
  { id: 'slate', label: 'Slate', hex: '#2A3034' },
  { id: 'navy', label: 'Navy', hex: '#16233A' },
  { id: 'oxblood', label: 'Oxblood', hex: '#3A1C1C' },
  { id: 'bistre', label: 'Bistre', hex: '#241C14' },
  { id: 'graphite', label: 'Graphite', hex: '#474F54' },
];

/** `specimen` is the two-letter sample the option card sets in its own face. */
export const FONTS: ReadonlyArray<{
  id: FontId;
  label: string;
  note: string;
  specimen: string;
}> = [
  { id: 'mineral', label: 'Archivo', note: '+ Plex Sans', specimen: 'Aa' },
  { id: 'grotesk', label: 'Grotesk', note: '+ Plex Sans', specimen: 'Aa' },
  { id: 'editorial', label: 'Serif', note: '+ Plex Sans', specimen: 'Aa' },
];

export const THEMES: ReadonlyArray<{ id: ThemePref; label: string; icon: string }> = [
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
  { id: 'system', label: 'System', icon: 'monitor' },
];

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: 'Hero',
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
};

const GROUND_IDS: Record<GroundId, true> = {
  limestone: true,
  paper: true,
  fog: true,
  bone: true,
  dust: true,
  patina: true,
};

const PRIMARY_IDS: Record<PrimaryId, true> = {
  basalt: true,
  slate: true,
  navy: true,
  oxblood: true,
  bistre: true,
  graphite: true,
};

export function defaults(): Personalization {
  return {
    v: 1,
    theme: 'system',
    accent: 'verdigris',
    seed: DEFAULT_SEED,
    font: 'mineral',
    ground: 'limestone',
    primary: 'basalt',
    order: [...SECTION_IDS],
  };
}

/**
 * Coerce arbitrary parsed JSON into a valid record. Never throws.
 * `fallbackTheme` supplies the theme when the record omits it — that is how
 * the legacy `ph_theme` key feeds the first read. A value this build no
 * longer offers (the retired `mono` typeface, say) falls back to the default
 * rather than being written back out.
 */
export function normalize(raw: unknown, fallbackTheme: ThemePref): Personalization {
  const base = defaults();
  base.theme = fallbackTheme;
  if (typeof raw !== 'object' || raw === null) return base;
  const o = raw as Record<string, unknown>;

  if (o.theme === 'dark' || o.theme === 'light' || o.theme === 'system') base.theme = o.theme;
  if (typeof o.accent === 'string' && Object.hasOwn(ACCENT_IDS, o.accent)) {
    base.accent = o.accent as AccentId;
  }
  if (typeof o.font === 'string' && Object.hasOwn(FONT_IDS, o.font)) {
    base.font = o.font as FontId;
  }
  if (typeof o.ground === 'string' && Object.hasOwn(GROUND_IDS, o.ground)) {
    base.ground = o.ground as GroundId;
  }
  if (typeof o.primary === 'string' && Object.hasOwn(PRIMARY_IDS, o.primary)) {
    base.primary = o.primary as PrimaryId;
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
