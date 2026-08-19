/* ============================================================
   Personalization — DOM half
   ------------------------------------------------------------
   One localStorage record drives three <html> attributes plus a
   flex `order` per section. Everything visual resolves through
   CSS custom properties, so applying state is attribute writes
   only — no restyle pass, no re-render, no layout thrash.

   The pre-paint half lives inline in Layout.astro; it must stay
   a plain non-module script to run before first paint. Keep the
   store key, the attribute names and the `#sections` order
   contract identical in both places.
   ============================================================ */

import {
  ACCENTS,
  DEFAULT_SEED,
  FONTS,
  GROUNDS,
  HEX,
  LEGACY_THEME_KEY,
  PRIMARIES,
  SECTION_IDS,
  STORE_KEY,
  defaults,
  normalize,
  resolveTheme,
  type AccentId,
  type FontId,
  type GroundId,
  type Personalization,
  type PrimaryId,
  type SectionId,
  type ThemePref,
} from '../data/personalize';

const root = document.documentElement;

/* ---------------- Store ---------------- */

export function read(): Personalization {
  /* 'system' is also the default, so a first visit tracks the OS without
     storing anything. The legacy key only ever held an explicit choice. */
  let fallback: ThemePref = 'system';
  try {
    const legacy = localStorage.getItem(LEGACY_THEME_KEY);
    if (legacy === 'light' || legacy === 'dark') fallback = legacy;
  } catch {
    /* storage blocked — 'system' stands */
  }
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return normalize(raw === null ? null : JSON.parse(raw), fallback);
  } catch {
    return normalize(null, fallback);
  }
}

export function write(state: Personalization): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    /* The old single-purpose theme key is superseded by the record above. */
    localStorage.removeItem(LEGACY_THEME_KEY);
  } catch {
    /* storage blocked — personalization stays session-only */
  }
}

/* ---------------- Apply ---------------- */

/* Held as the MediaQueryList itself, not a boolean: `theme: 'system'` also
   subscribes to it in initPersonalize so the page follows the OS live. */
export const SYSTEM_LIGHT = window.matchMedia('(prefers-color-scheme: light)');

export function applyTheme(pref: ThemePref): void {
  const mode = resolveTheme(pref, SYSTEM_LIGHT.matches);
  root.setAttribute('data-theme', mode);
  /* The nav toggle offers the opposite of what is on screen, so its icon
     tracks the resolved mode rather than the stored preference. */
  const ic = document.getElementById('theme-ic');
  if (ic) ic.setAttribute('data-lucide', mode === 'dark' ? 'sun' : 'moon');
}

export function applyAccent(accent: AccentId, seed: string): void {
  root.setAttribute('data-accent', accent);
  /* The custom ramp is derived in CSS from this one seed; every other accent
     ships its ramp as a static block, so the inline property must be cleared. */
  if (accent === 'custom') root.style.setProperty('--accent-seed', seed);
  else root.style.removeProperty('--accent-seed');
}

/* Ground and primary each re-point one token, and only under the light
   theme (tokens.css §2b). The attribute is still written in dark mode so the
   choice is waiting when the visitor switches back. */
export function applyGround(ground: GroundId): void {
  root.setAttribute('data-ground', ground);
}

export function applyPrimary(primary: PrimaryId): void {
  root.setAttribute('data-primary', primary);
}

/**
 * Order is expressed as the flex `order` property, never by moving nodes.
 * Anchor targets, the scroll spy and DOM focus order all stay intact, and the
 * pre-paint script can apply the same order via a stylesheet before the
 * sections exist.
 */
export function applyOrder(order: SectionId[]): void {
  const main = document.getElementById('sections');
  order.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.parentElement === main) el.style.order = String(i);
  });

  /* Nav mirrors page order; #hero is reached from the brand, not the list. */
  let n = 0;
  for (const id of order) {
    if (id === 'hero') continue;
    n += 1;
    const links = document.querySelectorAll<HTMLElement>(
      `.nav-links a[href="#${id}"], .mobile-menu a[href="#${id}"]`,
    );
    for (const a of links) {
      a.style.order = String(n);
      const idx = a.querySelector('.idx');
      if (idx) idx.textContent = String(n).padStart(2, '0');
    }
  }
}

export function applyAll(state: Personalization): void {
  applyTheme(state.theme);
  applyAccent(state.accent, state.seed);
  applyGround(state.ground);
  applyPrimary(state.primary);
  root.setAttribute('data-font', state.font);
  applyOrder(state.order);
}

/* ---------------- Panel ---------------- */

/** Nearest row whose midpoint is below `y`, i.e. the insert-before target. */
function rowAfter(list: HTMLElement, y: number): HTMLElement | null {
  let closest: HTMLElement | null = null;
  let closestGap = Number.NEGATIVE_INFINITY;
  for (const row of list.querySelectorAll<HTMLElement>('.pz-row:not(.dragging)')) {
    const box = row.getBoundingClientRect();
    const gap = y - box.top - box.height / 2;
    if (gap < 0 && gap > closestGap) {
      closestGap = gap;
      closest = row;
    }
  }
  return closest;
}

export function initPersonalize(): void {
  let state = read();
  applyAll(state);

  const panel = document.getElementById('personalize');
  const scrim = document.getElementById('personalize-scrim');
  const list = document.getElementById('pz-order');
  const custom = document.getElementById('pz-custom') as HTMLInputElement | null;
  const readouts: Record<string, HTMLElement | null> = {
    theme: document.getElementById('pz-theme-value'),
    font: document.getElementById('pz-font-value'),
    ground: document.getElementById('pz-ground-value'),
    primary: document.getElementById('pz-primary-value'),
    accent: document.getElementById('pz-accent-value'),
  };
  const save = document.getElementById('pz-save');
  let savedFor = 0;

  /* Reflect state back into the panel controls. No-ops when the panel is not
     on the page, so the nav theme toggle below still works everywhere. */
  const syncControls = () => {
    if (!panel || !list) return;
    for (const el of panel.querySelectorAll<HTMLElement>('[data-accent-id]')) {
      el.setAttribute('aria-pressed', String(el.dataset.accentId === state.accent));
    }
    for (const el of panel.querySelectorAll<HTMLElement>('[data-font-id]')) {
      el.setAttribute('aria-pressed', String(el.dataset.fontId === state.font));
    }
    for (const el of panel.querySelectorAll<HTMLElement>('[data-theme-id]')) {
      el.setAttribute('aria-pressed', String(el.dataset.themeId === state.theme));
    }
    for (const el of panel.querySelectorAll<HTMLElement>('[data-ground-id]')) {
      el.setAttribute('aria-pressed', String(el.dataset.groundId === state.ground));
    }
    for (const el of panel.querySelectorAll<HTMLElement>('[data-primary-id]')) {
      el.setAttribute('aria-pressed', String(el.dataset.primaryId === state.primary));
    }
    if (custom) custom.value = state.accent === 'custom' ? state.seed : DEFAULT_SEED;

    /* Each group's eyebrow carries a readout of the current value, so the
       chosen swatch is named rather than left to be inferred from a ring. */
    const ground = GROUNDS.find((g) => g.id === state.ground);
    const primary = PRIMARIES.find((p) => p.id === state.primary);
    const font = FONTS.find((f) => f.id === state.font);
    const accent = ACCENTS.find((a) => a.id === state.accent);
    if (readouts.accent) {
      readouts.accent.textContent =
        state.accent === 'custom'
          ? `Custom · ${state.seed.toUpperCase()}`
          : accent
            ? `${accent.label} · ${accent.light.toUpperCase()}`
            : '';
    }
    if (readouts.ground && ground) readouts.ground.textContent = `${ground.label} · ${ground.hex}`;
    if (readouts.primary && primary) {
      readouts.primary.textContent = `${primary.label} · ${primary.hex}`;
    }
    if (readouts.font && font) readouts.font.textContent = `${font.label} + Plex`;
    if (readouts.theme) {
      readouts.theme.textContent =
        state.theme === 'system'
          ? `System · ${SYSTEM_LIGHT.matches ? 'Light' : 'Dark'}`
          : state.theme === 'light'
            ? 'Light'
            : 'Dark';
    }

    const rows = Array.from(list.querySelectorAll<HTMLElement>('.pz-row'));
    rows.forEach((row, i) => {
      row.querySelector<HTMLButtonElement>('[data-move="up"]')?.toggleAttribute(
        'disabled',
        i === 0,
      );
      row.querySelector<HTMLButtonElement>('[data-move="down"]')?.toggleAttribute(
        'disabled',
        i === rows.length - 1,
      );
    });
  };

  const commit = (next: Partial<Personalization>) => {
    state = { ...state, ...next };
    write(state);
    applyAll(state);
    syncControls();
    window.lucide?.createIcons();
  };

  /* The nav theme toggle writes into the same record as the panel, so the two
     never disagree. Delegated because it predates the panel and must keep
     working on pages that do not mount one. */
  document.addEventListener('click', (e) => {
    if (!(e.target as Element | null)?.closest('#theme-toggle')) return;
    /* Flips what is on screen, so it resolves 'system' to an explicit choice
       rather than toggling the preference string. */
    const painted = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    commit({ theme: painted === 'dark' ? 'light' : 'dark' });
  });

  /* `theme: 'system'` is a standing subscription, not a one-off read: the OS
     can flip while the page is open. Registered before the panel guard below
     so it also works on pages that mount no panel. */
  SYSTEM_LIGHT.addEventListener('change', () => {
    if (state.theme !== 'system') return;
    applyTheme('system');
    syncControls();
    window.lucide?.createIcons();
  });

  /* In-page reorder rail (SectionRail.astro). Swaps the section with its
     neighbour in the saved order, then re-sorts the panel rows to match so the
     two controls never show different orders. Delegated, and registered before
     the panel guard, because the rails exist whether or not a panel is mounted. */
  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-section-move]');
    if (!btn) return;
    const id = btn.closest<HTMLElement>('#sections > section')?.id as SectionId | undefined;
    if (!id || !SECTION_IDS.includes(id)) return;
    const from = state.order.indexOf(id);
    const to = btn.dataset.sectionMove === 'up' ? from - 1 : from + 1;
    if (from < 0 || to < 0 || to >= state.order.length) return;
    const next = [...state.order];
    next[from] = next[to]!;
    next[to] = id;
    if (list) {
      for (const sid of next) {
        const row = list.querySelector<HTMLElement>(`.pz-row[data-section="${sid}"]`);
        if (row) list.appendChild(row);
      }
    }
    commit({ order: next });
    /* The section just moved out from under the pointer; keeping focus on the
       button lets a keyboard user press again without re-finding the rail. */
    btn.focus();
  });

  if (!panel || !scrim || !list) return;

  const triggers = document.querySelectorAll<HTMLElement>(
    '#personalize-toggle, #personalize-toggle-mobile',
  );
  let lastFocus: HTMLElement | null = null;

  /* The panel list's live DOM order. Drag, the arrow buttons and reset all
     read it, so it stays one definition rather than three inlined loops. */
  const domOrder = (): SectionId[] => {
    const out: SectionId[] = [];
    for (const row of list.querySelectorAll<HTMLElement>('.pz-row')) {
      const id = row.dataset.section;
      if (id && SECTION_IDS.includes(id as SectionId)) out.push(id as SectionId);
    }
    return out;
  };

  /* --- Open / close: mirrors the assistant panel in app.ts --- */
  function open() {
    lastFocus = document.activeElement as HTMLElement;
    panel!.classList.add('open');
    scrim!.classList.add('open');
    panel!.setAttribute('aria-hidden', 'false');
    for (const t of triggers) t.setAttribute('aria-expanded', 'true');
    if (window.matchMedia('(max-width: 560px)').matches) {
      document.body.classList.add('no-scroll');
    }
    setTimeout(() => document.getElementById('pz-close')?.focus(), 60);
  }

  function close() {
    panel!.classList.remove('open');
    scrim!.classList.remove('open');
    panel!.setAttribute('aria-hidden', 'true');
    for (const t of triggers) t.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    lastFocus?.focus?.();
  }

  for (const t of triggers) {
    t.addEventListener('click', () => {
      /* The mobile entry point sits inside the slide-over menu; drop it first
         so the two overlays never stack. Mirrors setMenu(false) in app.ts,
         including the hamburger glyph, which would otherwise stay an X. */
      if (t.id === 'personalize-toggle-mobile') {
        document.getElementById('mobile-menu')?.classList.remove('open');
        document.getElementById('nav-toggle')?.setAttribute('aria-expanded', 'false');
        document.getElementById('nav-toggle-ic')?.setAttribute('data-lucide', 'menu');
        window.lucide?.createIcons();
      }
      open();
    });
  }
  scrim.addEventListener('click', close);

  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const f = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !(el as HTMLButtonElement).disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0]!;
    const last = f[f.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* --- Controls --- */
  panel.addEventListener('click', (e) => {
    const el = e.target as Element | null;
    if (!el) return;

    if (el.closest('#pz-close')) {
      close();
      return;
    }
    const swatch = el.closest<HTMLElement>('[data-accent-id]');
    if (swatch?.dataset.accentId) {
      commit({ accent: swatch.dataset.accentId as AccentId });
      return;
    }
    const fontBtn = el.closest<HTMLElement>('[data-font-id]');
    if (fontBtn?.dataset.fontId) {
      commit({ font: fontBtn.dataset.fontId as FontId });
      return;
    }
    const themeBtn = el.closest<HTMLElement>('[data-theme-id]');
    if (themeBtn?.dataset.themeId) {
      commit({ theme: themeBtn.dataset.themeId as ThemePref });
      return;
    }
    const groundBtn = el.closest<HTMLElement>('[data-ground-id]');
    if (groundBtn?.dataset.groundId) {
      commit({ ground: groundBtn.dataset.groundId as GroundId });
      return;
    }
    const primaryBtn = el.closest<HTMLElement>('[data-primary-id]');
    if (primaryBtn?.dataset.primaryId) {
      commit({ primary: primaryBtn.dataset.primaryId as PrimaryId });
      return;
    }
    if (el.closest('#pz-reset')) {
      const fresh = defaults();
      for (const id of fresh.order) {
        const row = list.querySelector<HTMLElement>(`.pz-row[data-section="${id}"]`);
        if (row) list.appendChild(row);
      }
      commit(fresh);
      return;
    }
    if (el.closest('#pz-save')) {
      /* Every control already persists on change, so this re-writes the same
         record and exists to confirm that out loud — visitors reasonably
         assume an unsaved form until told otherwise. */
      write(state);
      save?.classList.add('is-saved');
      window.clearTimeout(savedFor);
      savedFor = window.setTimeout(() => save?.classList.remove('is-saved'), 1600);
      return;
    }

    /* Keyboard-equivalent reordering. Drag alone would strand keyboard and
       touch users, so the arrows are the primary control, not a fallback. */
    const move = el.closest<HTMLElement>('[data-move]');
    if (!move) return;
    const row = move.closest<HTMLElement>('.pz-row');
    if (!row) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>('.pz-row'));
    const i = rows.indexOf(row);
    const j = move.dataset.move === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= rows.length) return;
    if (j < i) list.insertBefore(row, rows[j]!);
    else list.insertBefore(rows[j]!, row);
    commit({ order: domOrder() });
    /* syncControls() may have just disabled this arrow at the list edge;
       hand focus to its sibling so keyboard reordering never dead-ends. */
    if (move.hasAttribute('disabled')) {
      row.querySelector<HTMLButtonElement>(
        move.dataset.move === 'up' ? '[data-move="down"]' : '[data-move="up"]',
      )?.focus();
    } else {
      move.focus();
    }
  });

  custom?.addEventListener('input', () => {
    if (!HEX.test(custom.value)) return;
    commit({ accent: 'custom', seed: custom.value });
  });

  /* --- Drag to reorder --- */
  let dragged: HTMLElement | null = null;

  list.addEventListener('dragstart', (e) => {
    const row = (e.target as Element | null)?.closest<HTMLElement>('.pz-row');
    if (!row) return;
    dragged = row;
    row.classList.add('dragging');
    if (!e.dataTransfer) return;
    e.dataTransfer.effectAllowed = 'move';
    /* Firefox refuses to begin a drag without a payload. */
    e.dataTransfer.setData('text/plain', row.dataset.section ?? '');
  });

  list.addEventListener('dragover', (e) => {
    if (!dragged) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    const after = rowAfter(list, e.clientY);
    if (after === null) list.appendChild(dragged);
    else if (after !== dragged) list.insertBefore(dragged, after);
  });

  list.addEventListener('drop', (e) => e.preventDefault());

  list.addEventListener('dragend', () => {
    dragged?.classList.remove('dragging');
    dragged = null;
    commit({ order: domOrder() });
  });

  /* The panel list ships in default order; align it with the saved record. */
  for (const id of state.order) {
    const row = list.querySelector<HTMLElement>(`.pz-row[data-section="${id}"]`);
    if (row) list.appendChild(row);
  }
  syncControls();
}
