/* The form-engine demo: renders demoForm into the page with the engine in
   src/lib/form-engine.ts and logs what the engine decided after each change.
   The DOM is built once per schema and then only synced, so typing never
   loses focus. */
import { demoForm, demoPatches } from '../config/demo-form';
import {
  applyPatches,
  evaluate,
  initialValues,
  type Cond,
  type FormSchema,
  type Persona,
  type Values,
  type View,
} from '../lib/form-engine';
import { highlightJson } from '../lib/json';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const reason = (cond: Cond) =>
  'state' in cond ? `state in [${cond.state.join(', ')}]` : `${cond.field} = "${cond.eq}"`;

export function initEngineDemo(): void {
  const rootEl = document.getElementById('engine-demo');
  const form = document.getElementById('eng-form') as HTMLFormElement | null;
  const jsonEl = document.getElementById('eng-json');
  const stateEl = document.getElementById('eng-state');
  const logEl = document.getElementById('eng-log');
  if (!rootEl || !form || !jsonEl || !stateEl || !logEl) return;

  const active = new Set<string>();
  /* Field ids named by the last blocked transition; their errors are shown
     even while empty. */
  const flagged = new Set<string>();
  let schema: FormSchema = demoForm;
  let values: Values = {};
  let state = '';
  let persona: Persona = 'maker';
  let prev: View | null = null;
  const actionsEl = el('div', 'eng-actions');

  const log = (kind: string, text: string) => {
    const li = el('li');
    li.append(el('span', 'k', kind), text);
    logEl.append(li);
    while (logEl.children.length > 60) logEl.firstElementChild?.remove();
    logEl.scrollTop = logEl.scrollHeight;
  };

  function sync() {
    const view = evaluate(schema, values, state, persona);

    view.sections.forEach((sv, si) => {
      const fieldset = form!.querySelector<HTMLElement>(`[data-section="${sv.section.id}"]`) as HTMLElement;
      fieldset.hidden = !sv.visible;
      const editable = sv.section.editableBy === persona && sv.section.editableIn.includes(state);
      (fieldset.querySelector('.k') as HTMLElement).textContent = editable ? `${persona}: editable` : `${persona}: read-only`;
      const before = prev?.sections[si];
      if (before && before.visible !== sv.visible && sv.section.visibleWhen) {
        log('rule', `section ${sv.section.id} ${sv.visible ? 'shown' : 'hidden'} (${reason(sv.section.visibleWhen)})`);
      }

      sv.fields.forEach((fv, fi) => {
        const wrap = fieldset.querySelector<HTMLElement>(`[data-field="${fv.field.id}"]`) as HTMLElement;
        const input = wrap.querySelector<HTMLInputElement | HTMLSelectElement>('input,select') as HTMLInputElement;
        wrap.hidden = !fv.visible;
        input.disabled = !fv.editable;
        if (fv.derived || input.value !== fv.value) input.value = fv.value;
        const isFlagged = flagged.has(fv.field.id);
        const error = fv.error && (isFlagged || fv.value) ? fv.error : isFlagged && !fv.value ? 'Required' : '';
        (wrap.querySelector('.fld-err') as HTMLElement).textContent = fv.visible ? error : '';
        input.setAttribute('aria-invalid', String(Boolean(error)));

        const was = before?.fields[fi];
        if (!was || was.field.id !== fv.field.id) return;
        if (fv.field.visibleWhen && was.visible !== fv.visible && before.visible === sv.visible) {
          log('rule', `${fv.field.id} ${fv.visible ? 'shown' : 'hidden'} (${reason(fv.field.visibleWhen)} is ${fv.visible})`);
        }
        if (fv.derived && was.value !== fv.value) log('derive', `${fv.field.id} = ${fv.value || '(empty)'}`);
      });
    });

    actionsEl.replaceChildren(
      ...view.actions.map(({ transition }, i) => {
        const button = el('button', i === 0 ? 'btn btn-primary' : 'btn', transition.label);
        button.type = 'button';
        button.dataset.action = transition.action;
        return button;
      }),
    );
    if (!view.actions.length) {
      const other = persona === 'maker' ? 'checker' : 'maker';
      actionsEl.append(
        el(
          'span',
          'k',
          state === schema.workflow.terminal
            ? `${state} is terminal: no transitions left. Reset to start over.`
            : `No transition for ${persona} in ${state}. Switch persona to ${other}.`,
        ),
      );
    }

    stateEl!.textContent = state;
    prev = view;
  }

  /** Rebuild the DOM from the (possibly patched) schema. */
  function build(resetData: boolean) {
    schema = applyPatches(
      demoForm,
      demoPatches.filter((p) => active.has(p.id)).map((p) => p.patch),
    );
    if (resetData) {
      values = initialValues(schema);
      state = schema.workflow.initial;
      flagged.clear();
    } else {
      values = { ...initialValues(schema), ...values };
    }
    prev = null;
    jsonEl!.innerHTML = highlightJson(schema);

    const derived = new Set(schema.derive.map((d) => d.target));
    form!.replaceChildren(
      ...schema.sections.map((section) => {
        const fieldset = el('fieldset');
        fieldset.dataset.section = section.id;
        const legend = el('legend', '', section.title);
        legend.append(el('span', 'k'));
        const grid = el('div', 'eng-fields');
        for (const field of section.fields) {
          const wrap = el('label', 'fld');
          wrap.dataset.field = field.id;
          const label = el('span', 'fld-label', field.label);
          if (derived.has(field.id)) label.append(el('span', 'k', 'derived'));
          else if (field.required) label.append(el('span', 'k', 'required'));
          let input: HTMLInputElement | HTMLSelectElement;
          if (field.type === 'select') {
            input = el('select');
            for (const option of field.options ?? []) input.append(new Option(option));
          } else {
            input = el('input');
            input.type = 'text';
            if (field.type === 'number') input.inputMode = 'numeric';
            if (field.hint) input.placeholder = field.hint;
            input.autocomplete = 'off';
          }
          input.name = field.id;
          wrap.append(label, input, el('span', 'fld-err'));
          grid.append(wrap);
        }
        fieldset.append(legend, grid);
        return fieldset;
      }),
      actionsEl,
    );
    sync();
  }

  form.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    if (!input.name) return;
    values[input.name] = input.value;
    sync();
  });
  form.addEventListener('submit', (e) => e.preventDefault());

  rootEl.addEventListener('click', (e) => {
    const target = (e.target as Element).closest<HTMLElement>('[data-action],[data-persona],[data-patch],#eng-reset');
    if (!target) return;

    if (target.dataset.action) {
      const hit = prev?.actions.find((a) => a.transition.action === target.dataset.action);
      if (!hit) return;
      flagged.clear();
      if (hit.blockedBy.length) {
        hit.blockedBy.forEach((id) => flagged.add(id));
        log('validate', `${hit.transition.action} blocked by ${hit.blockedBy.join(', ')}`);
      } else {
        log('workflow', `${state} → ${hit.transition.to} (${hit.transition.action} by ${persona})`);
        state = hit.transition.to;
      }
      sync();
    } else if (target.dataset.persona) {
      persona = target.dataset.persona as Persona;
      rootEl.querySelectorAll<HTMLElement>('[data-persona]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b === target));
      });
      flagged.clear();
      log('persona', `now ${persona}; permissions re-resolved for ${state}`);
      sync();
    } else if (target.dataset.patch) {
      const id = target.dataset.patch;
      const on = !active.has(id);
      if (on) active.add(id);
      else active.delete(id);
      target.setAttribute('aria-pressed', String(on));
      log('patch', `${on ? 'applied' : 'reverted'}: ${target.textContent?.trim()}`);
      build(false);
    } else {
      active.clear();
      persona = 'maker';
      rootEl.querySelectorAll<HTMLElement>('[data-patch]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      rootEl.querySelectorAll<HTMLElement>('[data-persona]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.persona === 'maker'));
      });
      logEl.replaceChildren();
      build(true);
      log('engine', 'reset');
    }
  });

  build(true);
  const fields = schema.sections.flatMap((s) => s.fields);
  log(
    'engine',
    `${schema.id}: ${fields.length} fields, ${fields.filter((f) => f.visibleWhen).length} visibility rules, ${schema.derive.length} derivations, ${schema.workflow.transitions.length} transitions`,
  );
}
