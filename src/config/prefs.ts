/* Runtime config: the part of the site config a visitor may change.
   Pure data and functions; imported at build time (ConfigEditor.astro) and
   by the browser (src/scripts/app.ts). The inline boot scripts in
   Layout.astro mirror STORE_KEY and the attribute names. */

export type ThemePref = 'light' | 'dark' | 'system';

export interface Prefs {
  theme: ThemePref;
  accent: string;
  density: string;
  /** Section ids, top to bottom. */
  order: string[];
  /** Section id → chosen variant. */
  variants: Record<string, string>;
}

export const STORE_KEY = 'ph_config';

export interface Option {
  value: string;
  label: string;
  /** Swatch colours for `swatch` fields: [dark theme, light theme]. Keep in sync with tokens.css. */
  swatch?: [string, string];
}

/** The editor panel is rendered from this, one control per field. */
export type PrefField =
  | { key: 'theme' | 'density'; label: string; control: 'segmented'; options: Option[] }
  | { key: 'accent'; label: string; control: 'swatch'; options: Option[] }
  | { key: 'order'; label: string; control: 'order' };

export const prefsSchema: PrefField[] = [
  {
    key: 'theme',
    label: 'theme',
    control: 'segmented',
    options: [
      { value: 'light', label: 'light' },
      { value: 'dark', label: 'dark' },
      { value: 'system', label: 'system' },
    ],
  },
  {
    key: 'accent',
    label: 'accent',
    control: 'swatch',
    options: [
      { value: 'blueprint', label: 'blueprint', swatch: ['#6EA8FF', '#1F5FD6'] },
      { value: 'signal', label: 'signal', swatch: ['#FF8A4C', '#C8491A'] },
      { value: 'phosphor', label: 'phosphor', swatch: ['#5FD38D', '#1B7F45'] },
      { value: 'violet', label: 'violet', swatch: ['#A78BFA', '#6540C9'] },
    ],
  },
  {
    key: 'density',
    label: 'density',
    control: 'segmented',
    options: [
      { value: 'comfortable', label: 'comfortable' },
      { value: 'compact', label: 'compact' },
    ],
  },
  { key: 'order', label: 'sections', control: 'order' },
];

const allowed = (key: string): string[] => {
  const field = prefsSchema.find((f) => f.key === key);
  return field && 'options' in field ? field.options.map((o) => o.value) : [];
};

/**
 * Coerce stored JSON into a valid record. Never throws. `defaults` comes from
 * the rendered page (section order and each section's default variant), so a
 * stale record can never hide a section or select a variant that is gone.
 */
export function normalize(
  raw: unknown,
  defaults: { order: string[]; variants: Record<string, string[]> },
): Prefs {
  const o = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const pick = (key: string, fallback: string) =>
    typeof o[key] === 'string' && allowed(key).includes(o[key] as string) ? (o[key] as string) : fallback;

  const stored = Array.isArray(o.order) ? o.order : [];
  const order = defaults.order.filter((id) => stored.includes(id));
  order.sort((a, b) => stored.indexOf(a) - stored.indexOf(b));
  for (const id of defaults.order) if (!order.includes(id)) order.push(id);

  const chosen = (typeof o.variants === 'object' && o.variants !== null ? o.variants : {}) as Record<string, unknown>;
  const variants: Record<string, string> = {};
  for (const [id, options] of Object.entries(defaults.variants)) {
    const v = chosen[id];
    variants[id] = typeof v === 'string' && options.includes(v) ? v : options[0];
  }

  return {
    theme: pick('theme', 'system') as ThemePref,
    accent: pick('accent', 'blueprint'),
    density: pick('density', 'comfortable'),
    order,
    variants,
  };
}
