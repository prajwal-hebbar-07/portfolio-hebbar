/* ============================================================
   Prajwal Hebbar — Portfolio · client interactions
   Site behaviour + AI assistant client (streams from /api/chat).
   ============================================================ */
type LucideGlobal = { createIcons: () => void };
declare global {
  interface Window {
    lucide?: LucideGlobal;
  }
}

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) =>
  r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) =>
  Array.from(r.querySelectorAll<T>(s));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const refreshIcons = () => window.lucide?.createIcons();

/* ---------------- Theme ---------------- */
const root = document.documentElement;
const THEME_KEY = 'ph_theme';
function applyTheme(t: string) {
  root.setAttribute('data-theme', t);
  const ic = $('#theme-ic');
  if (ic) ic.setAttribute('data-lucide', t === 'dark' ? 'sun' : 'moon');
  refreshIcons();
}
(function initTheme() {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch {
    /* ignore */
  }
  const sys = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || sys);
})();
document.addEventListener('click', (e) => {
  const t = (e.target as Element)?.closest('#theme-toggle');
  if (!t) return;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* ignore */
  }
});

/* ---------------- Nav: condense + active section ---------------- */
const nav = $('#nav');
const onScroll = () => {
  if (!nav) return;
  if (window.scrollY > 24) nav.classList.add('condensed');
  else nav.classList.remove('condensed');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const sections = $$('section[id]');
const navLinks = $$<HTMLAnchorElement>('.nav-links a');
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = en.target.id;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
);
sections.forEach((s) => spy.observe(s));

/* ---------------- Mobile menu ---------------- */
const mobileMenu = $('#mobile-menu');
const navToggle = $('#nav-toggle');
function setMenu(open: boolean) {
  if (!mobileMenu || !navToggle) return;
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('no-scroll', open);
  navToggle.setAttribute('aria-expanded', String(open));
  const ic = $('#nav-toggle-ic');
  if (ic) ic.setAttribute('data-lucide', open ? 'x' : 'menu');
  refreshIcons();
}
navToggle?.addEventListener('click', () => setMenu(!mobileMenu?.classList.contains('open')));
mobileMenu?.addEventListener('click', (e) => {
  if ((e.target as Element)?.closest('a')) setMenu(false);
});

/* ---------------- Scroll reveal ---------------- */
if (reduceMotion) {
  $$('.reveal').forEach((el) => el.classList.add('in'));
} else {
  const rev = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          rev.unobserve(en.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  $$('.reveal').forEach((el) => rev.observe(el));
}

/* ============================================================
   AI ASSISTANT
   ============================================================ */
interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

const fab = $('#fab');
const chat = $('#chat');
const scrim = $('#chat-scrim');
const log = $('#chat-log');
const form = $<HTMLFormElement>('#chat-form');
const input = $<HTMLTextAreaElement>('#chat-input');
const sendBtn = $<HTMLButtonElement>('#send-btn');
const errBox = $('#chat-err');
const errRetry = $('#chat-retry');

let lastFocus: HTMLElement | null = null;
let busy = false;
let opened = false;
const history: Turn[] = [];

function icon(name: string, cls?: string) {
  return `<svg class="ic ${cls || ''}" data-lucide="${name}"></svg>`;
}

// Only wire up the assistant if its markup is present.
if (fab && chat && scrim && log && form && input && sendBtn) {
  /* --- Open / close --- */
  function openChat() {
    lastFocus = document.activeElement as HTMLElement;
    chat!.classList.add('open');
    scrim!.classList.add('open');
    fab!.classList.add('hidden');
    fab!.setAttribute('aria-expanded', 'true');
    chat!.setAttribute('aria-hidden', 'false');
    if (window.matchMedia('(max-width: 560px)').matches) document.body.classList.add('no-scroll');
    if (!opened) {
      renderWelcome();
      opened = true;
    }
    setTimeout(() => input!.focus(), 60);
  }
  function closeChat() {
    chat!.classList.remove('open');
    scrim!.classList.remove('open');
    fab!.classList.remove('hidden');
    fab!.setAttribute('aria-expanded', 'false');
    chat!.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    lastFocus?.focus?.();
  }
  fab.addEventListener('click', openChat);
  scrim.addEventListener('click', closeChat);
  $('#chat-close')?.addEventListener('click', closeChat);

  // Esc + focus trap
  chat.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeChat();
      return;
    }
    if (e.key === 'Tab') {
      const f = $$<HTMLElement>('button, textarea, a[href], [tabindex]:not([tabindex="-1"])', chat).filter(
        (el) => !(el as HTMLButtonElement).disabled && el.offsetParent !== null,
      );
      if (!f.length) return;
      const first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* --- Welcome / chips --- */
  const CHIPS = [
    { ic: 'sparkles', label: 'Summarize his experience', q: "Give me the 30-second version of Prajwal's experience." },
    { ic: 'layers', label: 'Top skills', q: "What are Prajwal's strongest skills and stack?" },
    { ic: 'cpu', label: 'Technical proficiency', q: 'Break down his technical proficiency across frontend, Web3 & AI, and backend/DevOps.' },
    { ic: 'mail', label: 'How to contact him', q: 'How do I get in touch with Prajwal?' },
  ];
  function renderWelcome() {
    log!.innerHTML = `
      <div class="welcome" role="status">
        <div class="chat-ava" style="width:44px;height:44px;border-radius:14px;margin-bottom:14px;">${icon('bot')}</div>
        <div class="w-h">Ask about Prajwal</div>
        <div class="w-p">I answer from his portfolio — experience, skills, and how to reach him. Skip the scrolling and just ask.</div>
        <div class="chips">
          <div class="clabel">Try one of these</div>
          ${CHIPS.map((c, i) => `<button class="prompt-chip" data-q="${i}">${icon(c.ic)}<span>${c.label}</span><span class="arr">${icon('arrow-up-right')}</span></button>`).join('')}
        </div>
      </div>`;
    refreshIcons();
    $$<HTMLButtonElement>('.prompt-chip', log!).forEach((b) => {
      b.addEventListener('click', () => send(CHIPS[+b.dataset.q!].q));
    });
  }

  /* --- Markdown-lite -> safe HTML --- */
  function esc(s: string) {
    return s.replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m] as string);
  }
  function mdToHtml(src: string) {
    let t = esc(src.trim());
    t = t.replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    t = t.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    const lines = t.split('\n');
    let html = '',
      inUl = false;
    for (const ln of lines) {
      const m = ln.match(/^\s*[-•]\s+(.*)$/);
      if (m) {
        if (!inUl) {
          html += '<ul>';
          inUl = true;
        }
        html += `<li>${m[1]}</li>`;
      } else {
        if (inUl) {
          html += '</ul>';
          inUl = false;
        }
        if (ln.trim()) html += `<p>${ln}</p>`;
      }
    }
    if (inUl) html += '</ul>';
    return html;
  }

  /* --- Message rendering --- */
  function addUser(text: string) {
    const el = document.createElement('div');
    el.className = 'msg user';
    el.innerHTML = `<div class="bubble">${esc(text)}</div>`;
    log!.appendChild(el);
    scrollDown();
  }
  function addBotShell() {
    const el = document.createElement('div');
    el.className = 'msg bot';
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = `<div class="m-ava">${icon('bot')}</div><div class="bubble"><div class="typing"><i></i><i></i><i></i></div></div>`;
    log!.appendChild(el);
    refreshIcons();
    scrollDown();
    return el.querySelector('.bubble') as HTMLElement;
  }
  function scrollDown() {
    log!.scrollTop = log!.scrollHeight;
  }

  function setBusy(b: boolean) {
    busy = b;
    sendBtn!.disabled = b || !input!.value.trim();
    input!.setAttribute('aria-busy', String(b));
  }

  /* --- Send: streams the reply from the server endpoint --- */
  async function send(text: string) {
    text = (text || '').trim();
    if (!text || busy) return;
    hideErr();
    if ($('.welcome', log!)) log!.innerHTML = '';
    addUser(text);
    history.push({ role: 'user', content: text });
    input!.value = '';
    autosize();
    setBusy(true);
    const bubble = addBotShell();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error('Bad response');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      bubble.innerHTML = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        bubble.innerHTML = mdToHtml(acc) + '<span class="caret"></span>';
        scrollDown();
      }
      acc += decoder.decode();
      const reply = acc.trim();
      if (!reply) throw new Error('Empty response');
      bubble.innerHTML = mdToHtml(reply);
      refreshIcons();
      scrollDown();
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      bubble.closest('.msg')?.remove();
      showErr();
    } finally {
      setBusy(false);
      input!.focus();
    }
  }

  function showErr() {
    errBox?.classList.add('show');
  }
  function hideErr() {
    errBox?.classList.remove('show');
  }
  errRetry?.addEventListener('click', () => {
    hideErr();
    const lastUser = [...history].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      history.pop();
      send(lastUser.content);
    }
  });

  /* --- Input behaviour --- */
  function autosize() {
    input!.style.height = 'auto';
    input!.style.height = Math.min(input!.scrollHeight, 120) + 'px';
  }
  input.addEventListener('input', () => {
    autosize();
    sendBtn!.disabled = busy || !input!.value.trim();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input!.value);
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(input!.value);
  });
  sendBtn.disabled = true;

  // Open via any [data-open-chat] trigger (e.g. hero "Ask AI")
  $$('[data-open-chat]').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.preventDefault();
      openChat();
    }),
  );
}

/* ---------------- Year ---------------- */
const yr = $('#year');
if (yr) yr.textContent = String(new Date().getFullYear());

/* ---------------- Résumé placeholder toast ---------------- */
const toast = $('#toast');
let toastT: ReturnType<typeof setTimeout> | undefined;
function showToast(msg: string) {
  if (!toast) return;
  toast.innerHTML = `<svg class="ic" data-lucide="file-text"></svg><span>${msg}</span>`;
  refreshIcons();
  toast.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => toast.classList.remove('show'), 4200);
}
$$('[data-resume]').forEach((el) =>
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showToast("Résumé PDF coming soon — email me and I'll send it straight over.");
  }),
);

// init icons last
refreshIcons();

export {};
