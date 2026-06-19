/* ============================================================
   Portfolio Assistant — chat surface client.
   Renders the thread, drives the composer, and asks the Go backend
   via the same-origin proxy /api/portfolio/ask. Falls back to the
   grounded offline answer if the network round-trip itself fails.
   ============================================================ */
import { starters, validation, route, offlineAnswer, type Starter, type RouteId } from '../data/assistant';

type LucideGlobal = { createIcons: () => void };
declare global {
  interface Window {
    lucide?: LucideGlobal;
  }
}

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
const refreshIcons = () => window.lucide?.createIcons();

/* ---------------- Theme (data-theme + pa.theme) ---------------- */
const root = document.documentElement;
const THEME_KEY = 'pa.theme';
const themeBtns = {
  dark: $('#theme-dark'),
  light: $('#theme-light'),
};
function applyTheme(t: 'dark' | 'light') {
  root.setAttribute('data-theme', t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* ignore */
  }
  themeBtns.dark?.classList.toggle('on', t === 'dark');
  themeBtns.light?.classList.toggle('on', t === 'light');
}
(() => {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch {
    /* ignore */
  }
  applyTheme(saved === 'light' ? 'light' : 'dark');
})();
themeBtns.dark?.addEventListener('click', () => applyTheme('dark'));
themeBtns.light?.addEventListener('click', () => applyTheme('light'));

/* ---------------- Markdown-lite (bold, links, headings, bullets) ---------------- */
const LINK_RE = /(https?:\/\/[^\s)]+|(?:[\w-]+\.)+(?:com|in|io|dev|app|net|org)(?:\/[^\s)]*)?|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

function esc(s: string) {
  return s.replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m] as string);
}
function linkify(text: string) {
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text))) {
    if (m.index > last) out += text.slice(last, m.index);
    let token = m[0];
    let trail = '';
    while (/[.,)]$/.test(token)) {
      trail = token.slice(-1) + trail;
      token = token.slice(0, -1);
    }
    const isEmail = token.includes('@') && !token.includes('/');
    const href = isEmail ? 'mailto:' + token : /^https?:/.test(token) ? token : 'https://' + token;
    out += `<a href="${href}" target="_blank" rel="noopener noreferrer">${token}</a>` + trail;
    last = m.index + m[0].length;
  }
  out += text.slice(last);
  return out;
}
function inline(text: string) {
  return text
    .split('**')
    .map((seg, i) => (i % 2 === 1 ? `<strong>${linkify(seg)}</strong>` : linkify(seg)))
    .join('');
}
interface Block {
  t: 'h' | 'p' | 'ul';
  text?: string;
  items?: { text: string; sub: string }[];
}
function markdown(src: string) {
  const lines = src.split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { text: string; sub: string }[] | null = null;
  const flushPara = () => {
    if (para.length) {
      blocks.push({ t: 'p', text: para.join(' ') });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ t: 'ul', items: list });
      list = null;
    }
  };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    const head = line.match(/^\*\*(.+)\*\*:?$/);
    if (head) {
      flushPara();
      flushList();
      blocks.push({ t: 'h', text: head[1] });
      continue;
    }
    if (/^-\s+/.test(line)) {
      flushPara();
      if (!list) list = [];
      list.push({ text: line.replace(/^-\s+/, ''), sub: '' });
      continue;
    }
    if (/^\s{2,}\S/.test(raw) && list && list.length) {
      const it = list[list.length - 1];
      it.sub += (it.sub ? ' ' : '') + line.trim();
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();

  let html = '<div class="md">';
  for (const b of blocks) {
    if (b.t === 'h') html += `<span class="h">${inline(esc(b.text!))}</span>`;
    else if (b.t === 'p') html += `<p>${inline(esc(b.text!))}</p>`;
    else {
      html += '<ul>';
      for (const it of b.items!) {
        html += `<li>${inline(esc(it.text))}${it.sub ? `<span class="sub">${inline(esc(it.sub))}</span>` : ''}</li>`;
      }
      html += '</ul>';
    }
  }
  html += '</div>';
  return html;
}

/* ---------------- Chat ---------------- */
const thread = $('#thread');
const ta = $<HTMLTextAreaElement>('#composer-input');
const sendBtn = $<HTMLButtonElement>('#composer-send');
const field = $('#composer-field');
const metaEl = $('#composer-meta');
const newChatBtn = $('#new-chat');

let busy = false;
let messageCount = 0;

function lucideIcon(name: string, cls = '') {
  return `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ''}></i>`;
}
function scrollDown() {
  if (thread) thread.scrollTop = thread.scrollHeight;
}

if (thread && ta && sendBtn && field && metaEl) {
  /* welcome / starters */
  function renderWelcome() {
    thread!.innerHTML = `
      <div class="welcome" id="welcome">
        <div class="w-glyph">${lucideIcon('sparkles')}</div>
        <h1>Hi — ask me about Prajwal</h1>
        <p>Ask about my experience, skills, projects, or how to reach me.</p>
        <div class="starters">
          ${starters
            .map(
              (s) =>
                `<button class="starter" data-id="${s.id}">${lucideIcon(s.icon, 'lead')}<span>${esc(
                  s.label,
                )}</span><span class="arr">${lucideIcon('arrow-up-right')}</span></button>`,
            )
            .join('')}
        </div>
      </div>`;
    refreshIcons();
    thread!.querySelectorAll<HTMLButtonElement>('.starter').forEach((b) => {
      b.addEventListener('click', () => {
        const s = starters.find((x) => x.id === b.dataset.id) as Starter;
        respond(s.prompt, s.id);
      });
    });
  }
  function clearWelcome() {
    $('#welcome')?.remove();
  }

  function appendUser(text: string) {
    const el = document.createElement('div');
    el.className = 'msg user';
    el.innerHTML = `<div class="bubble">${esc(text)}</div>`;
    thread!.appendChild(el);
    messageCount++;
    scrollDown();
  }

  type Followup = { id: string; label: string; prompt: string };
  function appendBot(answerMd: string, guard: boolean, followups: Followup[]) {
    const el = document.createElement('div');
    el.className = 'msg bot' + (guard ? ' guard' : '');
    let html = `<div class="m-glyph">${lucideIcon(guard ? 'shield' : 'sparkles')}</div><div class="bubble">${answerMd}`;
    if (followups.length) {
      html += `<div class="followups">${followups
        .map((f) => `<button class="followup" data-prompt="${esc(f.prompt)}" data-id="${f.id}">${esc(f.label)}</button>`)
        .join('')}</div>`;
    }
    html += '</div>';
    el.innerHTML = html;
    thread!.appendChild(el);
    el.querySelectorAll<HTMLButtonElement>('.followup').forEach((b) => {
      b.addEventListener('click', () => respond(b.dataset.prompt!, b.dataset.id));
    });
    refreshIcons();
    messageCount++;
    scrollDown();
  }

  let typingEl: HTMLElement | null = null;
  function showTyping() {
    typingEl = document.createElement('div');
    typingEl.className = 'msg bot';
    typingEl.innerHTML = `<div class="m-glyph">${lucideIcon('sparkles')}</div><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>`;
    thread!.appendChild(typingEl);
    refreshIcons();
    scrollDown();
  }
  function hideTyping() {
    typingEl?.remove();
    typingEl = null;
  }

  function followupsFor(excludeId: string | undefined): Followup[] {
    return starters
      .filter((s) => s.id !== excludeId)
      .slice(0, 3)
      .map((s) => ({ id: s.id, label: s.label, prompt: s.prompt }));
  }

  async function respond(prompt: string, forcedId?: string) {
    if (busy) return;
    clearWelcome();
    appendUser(prompt);
    const id: RouteId = (forcedId as RouteId) || route(prompt);
    setBusy(true);
    showTyping();
    try {
      const res = await fetch('/api/portfolio/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json().catch(() => ({}))) as { answer?: string; error?: string };
      hideTyping();
      if (!res.ok) {
        appendBot(markdown(data.error || 'Something went wrong reaching the assistant.'), true, []);
        return;
      }
      const guard = id === 'guardrail';
      appendBot(markdown(data.answer || ''), guard, guard ? [] : followupsFor(id));
    } catch {
      // Same-origin proxy itself unreachable — last-resort grounded fallback.
      hideTyping();
      const guard = id === 'guardrail';
      appendBot(markdown(offlineAnswer(prompt)), guard, guard ? [] : followupsFor(id));
    } finally {
      setBusy(false);
      ta!.focus();
    }
  }

  /* composer */
  function syncComposer() {
    const len = ta!.value.length;
    const over = len > validation.maxLen;
    const blank = len > 0 && ta!.value.trim() === '';
    field!.classList.toggle('error', over || blank);
    sendBtn!.disabled = busy || over || ta!.value.trim().length === 0;
    let metaLeft: string;
    if (over) {
      metaLeft = `<span class="err">${lucideIcon('alert-circle')}${esc(validation.tooLong.message)}</span>`;
    } else if (blank) {
      metaLeft = `<span class="err">${lucideIcon('alert-circle')}${esc(validation.blank.message)}</span>`;
    } else {
      metaLeft = `<span class="hint">${lucideIcon('corner-down-left')}Enter to send · only answers about Prajwal</span>`;
    }
    metaEl!.innerHTML = `${metaLeft}<span class="count${over ? ' over' : ''}">${len}/${validation.maxLen}</span>`;
    refreshIcons();
  }
  function setBusy(b: boolean) {
    busy = b;
    syncComposer();
  }
  function autosize() {
    ta!.style.height = 'auto';
    ta!.style.height = Math.min(ta!.scrollHeight, 120) + 'px';
  }
  function submit() {
    const v = ta!.value;
    if (busy || v.length > validation.maxLen || v.trim() === '') return;
    respond(v.trim());
    ta!.value = '';
    autosize();
    syncComposer();
  }

  ta.addEventListener('input', () => {
    autosize();
    syncComposer();
  });
  ta.addEventListener('focus', () => field!.classList.add('focus'));
  ta.addEventListener('blur', () => field!.classList.remove('focus'));
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });
  sendBtn.addEventListener('click', submit);
  newChatBtn?.addEventListener('click', () => {
    ta!.value = '';
    autosize();
    renderWelcome();
    syncComposer();
    ta!.focus();
  });

  // boot
  renderWelcome();
  syncComposer();
  refreshIcons();
}

export {};
