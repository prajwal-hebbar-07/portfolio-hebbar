/* ============================================================
   Projects — rail + detail switcher

   The rail and the detail column are one ARIA tablist: exactly one
   panel is visible at a time. Selection is expressed through
   `aria-selected` and the `hidden` property only — no node moves and
   no inline styles, so the CSS owns the whole appearance. Nothing is
   persisted; the first project is selected on every load.
   ============================================================ */

export function initProjects(): void {
  const root = document.querySelector<HTMLElement>('.pj-switch');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
  if (!tabs.length) return;

  const select = (i: number) => {
    tabs.forEach((tab, k) => {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach((panel, k) => {
      panel.hidden = k !== i;
    });
  };

  tabs.forEach((tab, k) => tab.addEventListener('click', () => select(k)));

  /* Standard vertical tablist keys; both axes are accepted because the rail
     reads as a list on narrow viewports. */
  root.querySelector<HTMLElement>('[role="tablist"]')?.addEventListener('keydown', (e) => {
    const current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    const last = tabs.length - 1;
    let next: number;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = current === last ? 0 : current + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = current <= 0 ? last : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    e.preventDefault();
    select(next);
    tabs[next]?.focus();
  });
}
