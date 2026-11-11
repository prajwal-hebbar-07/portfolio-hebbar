/* A small schema-driven form engine: visibility rules, derived fields and a
   maker-checker workflow, all read from one JSON schema. Pure functions, no
   DOM. Written for this site's demo; it is not LYIK code. */

export type Persona = 'maker' | 'checker';

/** A rule condition: on another field's value, or on the workflow state. */
export type Cond = { field: string; eq: string } | { state: string[] };

/** Expressions for derived fields. "$id" reads another field. */
export type Expr =
  | number
  | string
  | { mul: [Expr, Expr] }
  | { gt: [Expr, Expr] }
  | { if: [Expr, Expr, Expr] };

export interface Field {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  default?: string;
  required?: boolean;
  /** Regular expression the value must match. */
  pattern?: string;
  hint?: string;
  visibleWhen?: Cond;
}

export interface FormSection {
  id: string;
  title: string;
  /** Role × state permission: who may edit this section, and in which states. */
  editableBy: Persona;
  editableIn: string[];
  visibleWhen?: Cond;
  fields: Field[];
}

export interface Transition {
  action: string;
  label: string;
  by: Persona;
  from: string[];
  to: string;
  /** Field ids that must be filled before this transition may fire. */
  requires?: string[];
}

export interface FormSchema {
  id: string;
  title: string;
  sections: FormSection[];
  derive: { target: string; expr: Expr }[];
  workflow: { initial: string; terminal: string; transitions: Transition[] };
}

export type Values = Record<string, string>;

export interface FieldView {
  field: Field;
  visible: boolean;
  editable: boolean;
  derived: boolean;
  value: string;
  error: string;
}

export interface View {
  values: Values;
  sections: { section: FormSection; visible: boolean; fields: FieldView[] }[];
  /** Transitions the persona may attempt now; `blockedBy` lists fields still in the way. */
  actions: { transition: Transition; blockedBy: string[] }[];
}

type Result = number | string | boolean | null;

function calc(expr: Expr, values: Values): Result {
  if (typeof expr === 'number') return expr;
  if (typeof expr === 'string') {
    if (!expr.startsWith('$')) return expr;
    const raw = values[expr.slice(1)] ?? '';
    if (raw === '') return null;
    return Number.isNaN(Number(raw)) ? raw : Number(raw);
  }
  if ('mul' in expr) {
    const [a, b] = expr.mul.map((e) => calc(e, values));
    return typeof a === 'number' && typeof b === 'number' ? a * b : null;
  }
  if ('gt' in expr) {
    const [a, b] = expr.gt.map((e) => calc(e, values));
    return typeof a === 'number' && typeof b === 'number' ? a > b : null;
  }
  const test = calc(expr.if[0], values);
  if (test === null) return null;
  return calc(test ? expr.if[1] : expr.if[2], values);
}

const holds = (cond: Cond | undefined, values: Values, state: string) =>
  !cond || ('state' in cond ? cond.state.includes(state) : values[cond.field] === cond.eq);

/** Initial values: every field's default, or empty. */
export function initialValues(schema: FormSchema): Values {
  const values: Values = {};
  for (const s of schema.sections) for (const f of s.fields) values[f.id] = f.default ?? '';
  return values;
}

/** Resolve the whole form for one persona in one workflow state. */
export function evaluate(schema: FormSchema, input: Values, state: string, persona: Persona): View {
  const values = { ...input };
  /* Derivations run in declared order, so a later one may read an earlier one. */
  for (const d of schema.derive) {
    const out = calc(d.expr, values);
    values[d.target] = out === null ? '' : String(out);
  }
  const derivedIds = new Set(schema.derive.map((d) => d.target));

  const sections = schema.sections.map((section) => {
    const sectionVisible = holds(section.visibleWhen, values, state);
    const sectionEditable = section.editableBy === persona && section.editableIn.includes(state);
    const fields = section.fields.map((field): FieldView => {
      const visible = sectionVisible && holds(field.visibleWhen, values, state);
      const derived = derivedIds.has(field.id);
      const value = values[field.id] ?? '';
      let error = '';
      if (visible && !derived) {
        if (field.required && value.trim() === '') error = 'Required';
        else if (value && field.pattern && !new RegExp(field.pattern).test(value)) {
          error = field.hint ? `Expected ${field.hint}` : 'Invalid format';
        }
      }
      return { field, visible, editable: sectionEditable && !derived, derived, value, error };
    });
    return { section, visible: sectionVisible, fields };
  });

  const actions = schema.workflow.transitions
    .filter((t) => t.by === persona && t.from.includes(state))
    .map((transition) => {
      const blockedBy = sections
        .filter((s) => s.section.editableBy === persona)
        .flatMap((s) => s.fields.filter((f) => f.error).map((f) => f.field.id));
      for (const id of transition.requires ?? []) {
        if ((values[id] ?? '').trim() === '' && !blockedBy.includes(id)) blockedBy.push(id);
      }
      return { transition, blockedBy };
    });

  return { values, sections, actions };
}

/** One JSON-patch-like edit to a schema: dotted path, array indices included. */
export interface Patch {
  op: 'add' | 'replace';
  path: string;
  value: unknown;
}

/** Returns a patched copy; `add` appends to the array at `path`. */
export function applyPatches<T>(schema: T, patches: Patch[]): T {
  const copy = structuredClone(schema);
  for (const p of patches) {
    const keys = p.path.split('.');
    const last = keys.pop() as string;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const parent = keys.reduce((node: any, key) => node[key], copy);
    if (p.op === 'add') parent[last].push(p.value);
    else parent[last] = p.value;
  }
  return copy;
}
