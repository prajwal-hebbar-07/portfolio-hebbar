/* JSON pretty-printer that emits highlighted HTML, one <span class="jl"> per
   line. Pure: used at build time for the section schema panes and in the
   browser for the panes that change (live config, form demo). */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const INLINE_MAX = 76;
const isFlat = (v: unknown) => typeof v !== 'object' || v === null;

function print(v: unknown, depth: number, live: readonly string[]): string {
  if (v === null) return '<i class="j-n">null</i>';
  if (typeof v === 'string') return `<i class="j-s">${esc(JSON.stringify(v))}</i>`;
  if (typeof v === 'number' || typeof v === 'boolean') return `<i class="j-n">${v}</i>`;

  const pad = '  '.repeat(depth);
  const short = JSON.stringify(v).length <= INLINE_MAX;

  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    if (short && v.every(isFlat)) return `[${v.map((x) => print(x, 0, [])).join(', ')}]`;
    return `[\n${v.map((x) => `${pad}  ${print(x, depth + 1, [])}`).join(',\n')}\n${pad}]`;
  }

  const entries = Object.entries(v as object).filter(([, x]) => x !== undefined);
  if (!entries.length) return '{}';
  const key = (k: string) => `<i class="j-k">"${esc(k)}"</i>`;
  if (depth > 0 && short && entries.every(([, x]) => isFlat(x))) {
    return `{ ${entries.map(([k, x]) => `${key(k)}: ${print(x, 0, [])}`).join(', ')} }`;
  }
  return `{\n${entries
    .map(([k, x]) => {
      const body = print(x, depth + 1, []);
      /* A live value is rewritten in place by the client, so only single-line
         primitives may be wrapped. */
      const wrapped = live.includes(k) && isFlat(x) ? `<b data-live="${esc(k)}">${body}</b>` : body;
      return `${pad}  ${key(k)}: ${wrapped}`;
    })
    .join(',\n')}\n${pad}}`;
}

/** `live` names top-level keys whose value the client may rewrite in place. */
export function highlightJson(value: unknown, live: readonly string[] = []): string {
  return print(value, 0, live)
    .split('\n')
    .map((line) => `<span class="jl">${line}</span>`)
    .join('');
}
