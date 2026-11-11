/* Client behaviour: the runtime config (theme, accent, density, section
   order, variants), the schema panes, the nav spy and the projects tabs.
   Every change goes through commit(), which stores the record and re-applies
   it, so the page, the editor and the two JSON panes cannot disagree. */
import { normalize, STORE_KEY, type Prefs } from '../config/prefs';
import { highlightJson } from '../lib/json';
import { initEngineDemo } from './engine-demo';

const root = document.documentElement;
const main = document.getElementById('sections') as HTMLElement;
const sectionEls = () => Array.from(main.querySelectorAll<HTMLElement>(':scope > section'));
const systemLight = window.matchMedia('(prefers-color-scheme: light)');

/* Defaults come from the rendered page, i.e. from src/config/site.ts. */
const defaults = {
  order: (main.dataset.defaultOrder ?? '').split(' '),
  variants: Object.fromEntries(
    sectionEls()
      .filter((s) => s.dataset.variants)
      .map((s) => [s.id, (s.dataset.variants as string).split(' ')]),
  ),
};

function load(): Prefs {
  let raw: unknown = null;
  try {
    raw = JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null');
  } catch {
    /* unreadable or blocked storage: defaults */
  }
  return normalize(raw, defaults);
}

let prefs = load();

/** Put the children carrying data-order-item (or section ids) into `order`. */
function reorder(order: string[]) {
  if (sectionEls().map((s) => s.id).join() !== order.join()) {
    for (const id of order) main.append(document.getElementById(id) as HTMLElement);
  }
  for (const id of order) {
    document.querySelectorAll(`[data-order-item="${id}"]`).forEach((el) => el.parentElement?.append(el));
  }
}

function apply() {
  root.dataset.theme = prefs.theme === 'system' ? (systemLight.matches ? 'light' : 'dark') : prefs.theme;
  root.dataset.accent = prefs.accent;
  root.dataset.density = prefs.density;
  reorder(prefs.order);

  for (const section of sectionEls()) {
    const variant = prefs.variants[section.id];
    if (!variant) continue;
    section.dataset.variant = variant;
    section.querySelectorAll<HTMLElement>('[data-variant-set]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.variantSet === variant));
    });
    const live = section.querySelector('.schema [data-live="variant"]');
    if (live) live.innerHTML = highlightJson(variant).replace(/^<span class="jl">|<\/span>$/g, '');
  }

  document.querySelectorAll<HTMLElement>('[data-pref]').forEach((b) => {
    const key = b.dataset.pref as 'theme' | 'accent' | 'density';
    b.setAttribute('aria-pressed', String(prefs[key] === b.dataset.value));
  });

  const runtime = {
    theme: prefs.theme,
    accent: prefs.accent,
    density: prefs.density,
    sections: prefs.order.map((id) => ({ id, variant: prefs.variants[id] })),
  };
  const html = highlightJson(runtime);
  for (const id of ['live-config', 'editor-json']) {
    const pane = document.getElementById(id);
    if (pane) pane.innerHTML = html;
  }
}

function commit() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(prefs));
  } catch {
    /* storage blocked: the change still applies for this visit */
  }
  apply();
}

function move(id: string, dir: string) {
  const from = prefs.order.indexOf(id);
  const to = dir === 'up' ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= prefs.order.length) return false;
  prefs.order.splice(to, 0, prefs.order.splice(from, 1)[0]);
  commit();
  return true;
}

const editor = document.getElementById('editor') as HTMLDialogElement | null;

document.addEventListener('click', (e) => {
  const target = (e.target as Element).closest<HTMLElement>(
    '[data-pref],[data-variant-set],[data-move],[data-order-move],[data-schema-toggle],[data-open-editor],#schema-all,#theme-toggle,#editor-close,#editor-reset,#editor',
  );
  if (!target) return;

  if (target.dataset.pref) {
    (prefs as unknown as Record<string, string>)[target.dataset.pref] = target.dataset.value as string;
    commit();
  } else if (target.dataset.variantSet) {
    const section = target.closest('section') as HTMLElement;
    prefs.variants[section.id] = target.dataset.variantSet;
    commit();
  } else if (target.dataset.move) {
    /* Moving the node drops focus and leaves the viewport behind; restore both. */
    const section = target.closest('section') as HTMLElement;
    if (move(section.id, target.dataset.move)) {
      section.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    }
  } else if (target.dataset.orderMove) {
    const row = target.closest<HTMLElement>('[data-order-item]');
    if (row && move(row.dataset.orderItem as string, target.dataset.orderMove)) target.focus();
  } else if (target.hasAttribute('data-schema-toggle')) {
    const open = target.getAttribute('aria-expanded') !== 'true';
    target.setAttribute('aria-expanded', String(open));
    (document.getElementById(target.getAttribute('aria-controls') as string) as HTMLElement).hidden = !open;
  } else if (target.id === 'schema-all') {
    const open = target.getAttribute('aria-pressed') !== 'true';
    target.setAttribute('aria-pressed', String(open));
    document.querySelectorAll<HTMLElement>('[data-schema-toggle]').forEach((b) => {
      b.setAttribute('aria-expanded', String(open));
      (document.getElementById(b.getAttribute('aria-controls') as string) as HTMLElement).hidden = !open;
    });
  } else if (target.hasAttribute('data-open-editor')) {
    editor?.showModal();
  } else if (target.id === 'theme-toggle') {
    prefs.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    commit();
  } else if (target.id === 'editor-reset') {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* nothing stored */
    }
    prefs = normalize(null, defaults);
    apply();
  } else if (target.id === 'editor-close' || e.target === editor) {
    /* e.target is the dialog itself only for a click on its backdrop. */
    editor?.close();
  }
});

systemLight.addEventListener('change', () => {
  if (prefs.theme === 'system') apply();
});

/* ---------------- Nav: current section ---------------- */
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-links a'));
const spy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const a of navLinks) {
        if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      }
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
sectionEls().forEach((s) => spy.observe(s));

/* ---------------- Projects: one ARIA tablist ---------------- */
const tablist = document.querySelector<HTMLElement>('.pj-tabs');
if (tablist) {
  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const select = (i: number, focus = false) => {
    tabs.forEach((tab, k) => {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
      (document.getElementById(tab.getAttribute('aria-controls') as string) as HTMLElement).hidden = k !== i;
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((tab, k) => tab.addEventListener('click', () => select(k)));
  tablist.addEventListener('keydown', (e) => {
    const current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    const last = tabs.length - 1;
    const next: Record<string, number> = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowRight: current === last ? 0 : current + 1,
      ArrowUp: current <= 0 ? last : current - 1,
      ArrowLeft: current <= 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    select(next[e.key], true);
  });
}

apply();
initEngineDemo();
