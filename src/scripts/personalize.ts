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
  DEFAULT_SEED,
  HEX,
  LEGACY_THEME_KEY,
  SECTION_IDS,
  STORE_KEY,
  defaults,
  normalize,
  type AccentId,
  type FontId,
  type Personalization,
  type SectionId,
  type ThemeMode,
} from '../data/personalize';

const root = document.documentElement;

/* ---------------- Store ---------------- */

export function read(): Personalization {
  let fallback: ThemeMode = 'dark';
  try {
    const legacy = localStorage.getItem(LEGACY_THEME_KEY);
    if (legacy === 'light' || legacy === 'dark') fallback = legacy;
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) fallback = 'light';
  } catch {
    /* storage blocked — the dark default stands */
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

export function applyTheme(theme: ThemeMode): void {
  root.setAttribute('data-theme', theme);
  const ic = document.getElementById('theme-ic');
  if (ic) ic.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
}

export function applyAccent(accent: AccentId, seed: string): void {
  root.setAttribute('data-accent', accent);
  /* The custom ramp is derived in CSS from this one seed; every other accent
     ships its ramp as a static block, so the inline property must be cleared. */
  if (accent === 'custom') root.style.setProperty('--accent-seed', seed);
  else root.style.removeProperty('--accent-seed');
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
    if (custom) custom.value = state.accent === 'custom' ? state.seed : DEFAULT_SEED;

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
    commit({ theme: state.theme === 'dark' ? 'light' : 'dark' });
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
      commit({ theme: themeBtn.dataset.themeId as ThemeMode });
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
