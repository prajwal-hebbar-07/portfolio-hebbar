/* ============================================================
   Prajwal Hebbar — Portfolio · client interactions
   Site behaviour + AI assistant (calls /api/portfolio/ask).
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

const MAX_LEN = 500;

const fab = $('#fab');
const chat = $('#chat');
const scrim = $('#chat-scrim');
const log = $('#chat-log');
const form = $<HTMLFormElement>('#chat-form');
const input = $<HTMLTextAreaElement>('#chat-input');
const sendBtn = $<HTMLButtonElement>('#send-btn');
const errBox = $('#chat-err');
const errMsg = $('#chat-err-msg');
const errIc = $('#chat-err-ic');
const errRetry = $('#chat-retry');
const ccBox = $('#char-count');
const ccNum = $('#cc-num');

let lastFocus: HTMLElement | null = null;
let busy = false;
let opened = false;
const history: Turn[] = [];

function icon(name: string, cls?: string) {
  return `<svg class="ic ${cls || ''}" data-lucide="${name}"></svg>`;
}

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
      const f = $$<HTMLElement>(
        'button, textarea, a[href], [tabindex]:not([tabindex="-1"])',
        chat,
      ).filter((el) => !(el as HTMLButtonElement).disabled && el.offsetParent !== null);
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
    {
      ic: 'sparkles',
      label: 'Summarize his experience',
      q: "Give me the 30-second version of Prajwal's experience.",
    },
    { ic: 'layers', label: 'Top skills', q: "What are Prajwal's strongest skills and stack?" },
    {
      ic: 'cpu',
      label: 'Technical proficiency',
      q: 'Break down his technical proficiency across frontend, architecture, and backend/DevOps.',
    },
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
    t = t.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1">$1</a>',
    );
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

  /* --- Reveal text progressively (streaming feel) --- */
  function streamInto(bubble: HTMLElement, fullText: string): Promise<void> {
    return new Promise((resolve) => {
      if (reduceMotion) {
        bubble.innerHTML = mdToHtml(fullText);
        scrollDown();
        resolve();
        return;
      }
      const tokens = fullText.split(/(\s+)/);
      let i = 0,
        acc = '';
      const step = () => {
        const chunk = Math.random() < 0.3 ? 2 : 1;
        for (let k = 0; k < chunk && i < tokens.length; k++) acc += tokens[i++];
        bubble.innerHTML =
          mdToHtml(acc) + (i < tokens.length ? '<span class="caret"></span>' : '');
        scrollDown();
        if (i < tokens.length) setTimeout(step, 16 + Math.random() * 24);
        else {
          bubble.innerHTML = mdToHtml(fullText);
          refreshIcons();
          resolve();
        }
      };
      step();
    });
  }

  function setBusy(b: boolean) {
    busy = b;
    const n = input!.value.trim().length;
    sendBtn!.disabled = b || !n || n > MAX_LEN;
    input!.setAttribute('aria-busy', String(b));
  }

  function updateCount() {
    const n = input!.value.trim().length;
    if (ccNum) ccNum.textContent = String(n);
    ccBox?.classList.toggle('near', n > MAX_LEN - 60 && n <= MAX_LEN);
    ccBox?.classList.toggle('over', n > MAX_LEN);
  }

  /* --- Send --- */
  async function send(text: string) {
    text = (text || '').trim();
    if (!text || busy) return;
    if (text.length > MAX_LEN) {
      showErr('limit');
      input!.focus();
      return;
    }
    hideErr();
    if ($('.welcome', log!)) log!.innerHTML = '';
    addUser(text);
    history.push({ role: 'user', content: text });
    input!.value = '';
    autosize();
    updateCount();
    setBusy(true);
    const bubble = addBotShell();

    try {
      const res = await fetch('/api/portfolio/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      if (res.status === 400 || res.status === 422) {
        throw Object.assign(new Error('validation'), { kind: 'validation' });
      }
      if (!res.ok) throw Object.assign(new Error('server'), { kind: 'server' });
      const data = (await res.json()) as Record<string, unknown>;
      const answer = ((data.answer ?? data.response ?? data.message ?? '') as string).trim();
      if (!answer) throw Object.assign(new Error('empty'), { kind: 'server' });
      bubble.innerHTML = '';
      await streamInto(bubble, answer);
      history.push({ role: 'assistant', content: answer });
    } catch (err) {
      bubble.closest('.msg')?.remove();
      showErr((err as { kind?: string })?.kind ?? 'server');
    } finally {
      setBusy(false);
      input!.focus();
    }
  }

  const ERR_MSGS: Record<string, { ic: string; msg: string; retry: boolean }> = {
    limit: {
      ic: 'ruler',
      msg: "That's over the 500-character limit — trim it down and send again.",
      retry: false,
    },
    validation: {
      ic: 'alert-triangle',
      msg: "That didn't go through. Keep it to a clear question under 500 characters.",
      retry: true,
    },
    server: {
      ic: 'server-crash',
      msg: 'The assistant is unavailable right now. Try again in a moment.',
      retry: true,
    },
  };
  function showErr(kind: string) {
    const e = ERR_MSGS[kind] ?? ERR_MSGS.server;
    if (errMsg) errMsg.textContent = e.msg;
    if (errIc) errIc.setAttribute('data-lucide', e.ic);
    if (errRetry) (errRetry as HTMLElement).style.display = e.retry ? '' : 'none';
    errBox?.classList.add('show');
    refreshIcons();
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
    updateCount();
    const n = input!.value.trim().length;
    sendBtn!.disabled = busy || !n || n > MAX_LEN;
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

  // Open via any [data-open-chat] trigger (hero "Ask the AI about me")
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

// init icons last
refreshIcons();

export {};
