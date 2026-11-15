// Playful motion layer. Pure enhancement: skipped for reduced-motion users.
// The selectors in REVEAL must match the `.motion` rule in portfolio.css that pre-hides them.
import { animate, inView, scroll, stagger } from 'motion';

const REVEAL = '.hero > :not(h1), .split > *, .contact > *, .card, .shipped li, .tags li, .stats div';
const POP = { type: 'spring', stiffness: 260, damping: 18 } as const;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

function words(h1: HTMLElement) {
  const spans = (h1.textContent ?? '').trim().split(/\s+/).map((w) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w;
    return s;
  });
  h1.replaceChildren(...spans.flatMap((s, i) => (i ? [' ', s] : [s])));
  h1.style.opacity = '1';
  animate(spans, { opacity: [0, 1], y: [28, 0], rotate: [4, 0] }, { ...POP, delay: stagger(0.07) });
}

function reveal() {
  inView(REVEAL, (el) => {
    // Siblings in a row (tags, stats) pop in one after another.
    const delay = el.matches('.tags li, .stats div') ? [...el.parentElement!.children].indexOf(el) * 0.06 : 0;
    animate(el, { opacity: [0, 1], y: [24, 0], scale: [0.97, 1] }, { ...POP, delay });
  }, { amount: 0.15 });
}

function progressBar() {
  const bar = document.createElement('div');
  bar.className = 'progress';
  document.body.append(bar);
  scroll(animate(bar, { scaleX: [0, 1] }, { ease: 'linear' }));
}

function cursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'glow';
  document.body.append(glow);
  addEventListener('pointermove', (e) => animate(glow, { x: e.clientX, y: e.clientY }, { type: 'spring', stiffness: 90, damping: 20 }));
}

function tilt(card: HTMLElement) {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    animate(card, { rotateY: x * 8, rotateX: -y * 8, y: -4 }, { duration: 0.15 });
  });
  card.addEventListener('pointerleave', () => animate(card, { rotateY: 0, rotateX: 0, y: 0 }, POP));
}

function magnetic(el: HTMLElement) {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    animate(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35 }, { duration: 0.15 });
  });
  el.addEventListener('pointerleave', () => animate(el, { x: 0, y: 0 }, POP));
}

function wiggle(el: HTMLElement) {
  el.addEventListener('pointerenter', () => animate(el, { rotate: [0, -12, 10, -6, 0], scale: [1, 1.12, 1] }, { duration: 0.5 }));
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) try {
  words(document.querySelector<HTMLElement>('.hero h1')!);
  reveal();
  progressBar();
  document.querySelectorAll<HTMLElement>('.mark').forEach(wiggle);
  if (fine) {
    cursorGlow();
    document.querySelectorAll<HTMLElement>('.card').forEach(tilt);
    document.querySelectorAll<HTMLElement>('.btn, .pill-link').forEach(magnetic);
  }
} catch (err) {
  // Never leave content hidden if the motion layer fails.
  console.error('motion layer failed, showing static page', err);
  document.documentElement.classList.remove('motion');
}
