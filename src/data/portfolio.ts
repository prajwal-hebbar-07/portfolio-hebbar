/* ============================================================
   Prajwal Hebbar — Portfolio content (single source of truth).
   Drives the rendered sections AND the AI assistant's grounding.
   All facts come from portfolio-content.md — do not invent any.
   ============================================================ */

export const profile = {
  name: 'Prajwal Hebbar',
  role: 'Senior Engineer',
  status: 'Available for opportunities',
  location: 'Bengaluru, India',
  experience: 'Nearly 5 years',
  email: 'prajwalhebbaras@gmail.com',
  phone: '+91 94839 24880',
  phoneHref: '+919483924880',
  linkedin: 'https://linkedin.com/in/hebbarprajwal72',
  linkedinLabel: 'in/hebbarprajwal72',
  github: 'https://github.com/prajwal-hebbar-07',
  githubLabel: 'github.com/prajwal-hebbar-07',
  education: 'B.E. in Computer Science Engineering',
  educationSchool: 'VVCE, Mysuru',
  languages: ['English', 'Kannada', 'Hindi'],
} as const;

export interface Experience {
  role: string;
  company: string;
  when: string;
  /** Earlier titles at the same company, oldest first — rendered as a promotion track. */
  progression?: { role: string; when: string }[];
  location: string;
  locationIcon: 'map-pin' | 'globe';
  current?: boolean;
  points: string[]; // may contain <b>…</b> for emphasis
  tech: string[];
}

export const experiences: Experience[] = [
  {
    role: 'Senior Engineer',
    company: 'LYIK Technologies Pvt. Ltd.',
    when: 'Apr 2023 — Present',
    progression: [
      { role: 'Enterprise Engineer', when: 'Apr 2023 — Mar 2026' },
      { role: 'Senior Engineer', when: 'Apr 2026 — Present' },
    ],
    location: 'On-site · Bengaluru',
    locationIcon: 'map-pin',
    current: true,
    points: [
      'Built the v3 <b>admin dashboard</b>: form management over the forms API and a <b>user-management tree-table</b> modeling the organization as a hierarchy/DAG, with complete user and relationship CRUD.',
      'Added bulk <b>CSV/ZIP onboarding</b>, permission-gated routes and dashboards, the <b>maker-checker</b> approval workflow, and trusted API records protected against user overwrite.',
      'Worked across the shared form <b>engines</b>—actions, rules, derive, and navigator—and wrote their unit and integration tests in the monorepo package.',
      'Delivered SSO, client-side encryption, JSON-driven theming, liveness/KYC and file workflows; shipped with <b>Docker/Nginx</b> and <b>GitHub Actions</b>, and contributed to the company\'s first enterprise client acquisition.',
    ],
    tech: ['React 19', 'TypeScript', 'Redux Toolkit', 'TanStack Query', 'Material UI', 'Vitest', 'Docker', 'GitHub Actions'],
  },
  {
    role: 'Associate Web Developer',
    company: 'Content Enablers Inc.',
    when: 'Mar 2022 — Mar 2023',
    location: 'Remote · Bengaluru',
    locationIcon: 'globe',
    points: [
      'Led a <b>website revamp</b> using ReactJS and Bootstrap 5.',
      'Integrated <b>Google Analytics</b> and Google Tag Manager for product insight.',
    ],
    tech: ['React', 'Bootstrap 5', 'Strapi CMS', 'Google Analytics', 'GTM'],
  },
];

export interface Project {
  name: string;
  tagline: string;
  kind: string;
  repo: string;
  repoLabel: string;
  status: string;
  points: string[]; // may contain <b>…</b> for emphasis
  tech: string[];
}

export const projects: Project[] = [
  {
    name: 'LedgerFlow',
    tagline: 'Local-first desktop expense tracker — no account, no server, no sync.',
    kind: 'Tauri 2 · React 19 · Rust · SQLite',
    repo: 'https://github.com/prajwal-hebbar-07/ledger-flow',
    repoLabel: 'prajwal-hebbar-07/ledger-flow',
    status: 'Shipping signed releases',
    points: [
      'Models every money movement as <b>one row</b> in a single table — spend, income, self-transfer and card charge differ only by <code>direction</code> and which source column is set; amounts are positive integers in minor units.',
      '<b>Balances are derived in SQL</b> from an opening balance plus every transaction that touched the account, so no running total can drift out of sync with the ledger.',
      'Five screens over the same period picker: analytics with <b>period-over-period deltas</b> and CSS-box charts (no charting library), plus a <b>rules-based report generator</b> that works with no model configured.',
      'Optional <b>Ollama</b> integration categorises transactions in batches against a closed 14-category list and rewrites the report prose; the model writes sentences, never figures — every number is recomputed from the ledger.',
      'Ships via <b>GitHub Actions</b> for macOS/Linux/Windows with <b>minisign-signed auto-update</b>; disk and network access live in Rust commands, the webview never fetches.',
    ],
    tech: ['Tauri 2', 'React 19', 'TypeScript', 'Rust', 'SQLite', 'Tailwind CSS 4', 'Ollama', 'Turborepo', 'GitHub Actions'],
  },
  {
    name: 'Flex State',
    tagline: 'Offline gamified home-workout desktop app, plus the reactive store it is built on.',
    kind: 'pnpm + Turborepo monorepo · Tauri 2 · React 19',
    repo: 'https://github.com/prajwal-hebbar-07/flex-state',
    repoLabel: 'prajwal-hebbar-07/flex-state',
    status: 'Active build',
    points: [
      '<b>Deterministic plan generation</b>: the same profile, catalog and locations always produce an identical weekly plan, and the generator version stamped on each snapshot forces an explicit regeneration instead of a silent replay.',
      'Personalization keyed to a <b>training ground</b> — each place carries its own equipment set and exclusions, so eligibility is computed per location rather than from global checkboxes.',
      'XP, level, rank, streak and weekly count are <b>derived from the ordered completion history</b>; an <code>INSERT OR IGNORE</code> on the date primary key makes a repeat claim idempotent, with no mutable summary row to drift.',
      'Every persisted value passes a <b>runtime shape guard</b> that fails closed — a single corrupt row is skipped instead of blocking boot.',
      'Published <code>flex-state</code> as a framework-agnostic store (<code>Object.is</code> dedupe, detachable methods) with a React 19 binding over <code>useSyncExternalStore</code>; tested with Vitest and Node&rsquo;s native test runner.',
    ],
    tech: ['Tauri 2', 'React 19', 'TypeScript', 'Rust', 'SQLite', 'pnpm workspace', 'Turborepo', 'Vitest', 'Biome'],
  },
];

export interface SkillGroup {
  icon: string; // lucide name
  title: string;
  alt?: boolean; // mint accent variant
  full?: boolean; // span full width
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  { icon: 'code-2', title: 'Frontend Core', skills: ['ReactJS', 'Next.js', 'TypeScript', 'JavaScript', 'Redux Toolkit'] },
  { icon: 'palette', title: 'UI &amp; Design Systems', skills: ['Material UI', 'TailwindCSS', 'Design Tokens', 'Responsive Design', 'Figma'] },
  { icon: 'cpu', title: 'Architecture', alt: true, skills: ['Schema-driven UI', 'Rule / Derive / Actions Engines', 'Monorepo', 'JSON Logic / JSONPath', 'Local-first Desktop', 'System Design'] },
  { icon: 'database', title: 'State, Data &amp; Testing', skills: ['TanStack Query', 'React Hook Form', 'Zod', 'SQLite', 'Vitest', 'React Testing Library'] },
  { icon: 'server', title: 'Backend, DevOps &amp; Security', full: true, skills: ['Node.js', 'Rust / Tauri 2', 'Docker', 'Nginx', 'GitHub Actions', 'Frappe ERP', 'Client-side Encryption', 'SSO', 'REST APIs', 'Azure'] },
];

/* ── AI assistant grounding ──────────────────────────────────────────────── */

export const PORTFOLIO_CONTENT = `
PROFILE
- Name: Prajwal Hebbar
- Role: Senior Engineer (at LYIK Technologies)
- Status: Available for opportunities
- Location: Bengaluru, India
- Experience: Nearly 5 years
- Languages: English, Kannada, Hindi
- Headline: Senior Engineer building configurable, enterprise-grade web platforms with React, TypeScript, and thoughtful design systems.

ABOUT
Specializes in ReactJS, Next.js, and TypeScript, with deep experience in schema-driven, configurable frontend architecture. At LYIK Technologies he architects a configurable enterprise form-filling platform, its admin dashboard, and ERP workflows — turning complex requirements into systems that feel effortless to use.
- Education: B.E. in Computer Science Engineering, VVCE Mysuru
- Notable achievement: 30%+ efficiency gains through client-facing platform development

EXPERIENCE
1) Senior Engineer — LYIK Technologies Private Limited (April 2026 – Present; previously Enterprise Engineer, April 2023 – March 2026; On-site, Bengaluru)
   - Promoted to Senior Engineer in April 2026, after shipping v2 and driving much of the v3 configurable form platform
   - Shipped v2 of the enterprise form-filling application (React 19, Redux Toolkit, TypeScript, Material UI), then contributed heavily to v3 as a configurable, schema-driven platform
   - Built the v3 admin dashboard: a form-management console (Material React Table over the forms management API, with create/delete and confirmation flows) and a user-management tree-table that models the org as a hierarchy/DAG (buildUserTree, multi-parent edges), with full user and relationship CRUD wired to REST APIs (create/edit/delete users, add/remove relationship edges)
   - Added bulk user onboarding via client-side CSV/ZIP upload (jszip), and a permission guardrail system: permission-gated routes, a reusable GuardRail component, form-list guards, and rule-driven dashboard widgets configured through dashboard.json
   - Built the maker-checker approval workflow (checker flow, checker messages, verify state, submit confirmation modal) and trusted API records (tokenized nodes protected against user overwrite)
   - Worked across the core form engines in the @lyikadmin/lyik-form monorepo package — actions, rules (persona/permission-based hide and disable), derive (array handling) and navigator (array-boundary navigation) — and wrote their unit/integration test suites
   - Delivered an SSO login flow, client-side encryption, JSON-driven theming (theme.json, custom themes, logo fallback), funcex expression support, liveness/KYC detection, ID obfuscation, and multi-file upload
   - Set up Docker/Nginx containerization and a GitHub Actions CI/CD pipeline; built a Frappe-based ERP and a ServiceNow integration POC
   - Contributed to the company's first enterprise client acquisition
   - Tech: React 19, TypeScript, Redux Toolkit, Material UI, TanStack Query, Material React Table, REST APIs, JSON-driven config, Monorepo, Vitest, Docker, Nginx, GitHub Actions, Frappe

2) Associate Web Developer — Content Enablers Inc. (March 2022 – March 2023, Remote, Bengaluru)
   - Website revamp using ReactJS and Bootstrap 5
   - Google Analytics and Google Tag Manager integration
   - Tech: React, Bootstrap 5, Strapi CMS, Google Analytics, GTM

PROJECTS (personal, open source at github.com/prajwal-hebbar-07)
1) LedgerFlow — local-first desktop expense tracker (https://github.com/prajwal-hebbar-07/ledger-flow)
   - Tauri 2 + React 19 + Rust desktop app for macOS, Linux and Windows; single-user, offline, one SQLite file on the machine, no account/server/sync/telemetry
   - One row per money movement in a single expense table: spend, income, transfer between own accounts and credit-card charge differ only by direction and which of account/card/to-account is set; amounts are positive integers in minor units
   - Balances are derived in SQL (opening balance plus every transaction that touched the account) — no stored running total that can drift
   - Five screens (Overview, Transactions, Analytics, Report, Settings): period-over-period deltas, charts built from CSS boxes rather than a charting library, fixed-charge holdout on the daily series, and a rules-based report generator that needs no model
   - Optional Ollama integration (cloud or local daemon) categorises transactions in batches against a closed 14-category vocabulary and rewrites the report prose; the model writes sentences, never figures, and results are stamped with the model that wrote them
   - Release engineering: GitHub Actions cuts macOS/Linux/Windows builds sequentially, minisign-signed manifest drives in-app auto-update; disk and network access live in Rust #[tauri::command]s, the webview never fetches
   - Tech: Tauri 2, React 19, TypeScript, Rust, SQLite, Tailwind CSS 4, Ollama, pnpm workspace, Turborepo, GitHub Actions, node:test

2) Flex State — offline gamified home-workout desktop app (https://github.com/prajwal-hebbar-07/flex-state)
   - pnpm + Turborepo monorepo: a Tauri 2 + React 19 desktop app, a published framework-agnostic store package (flex-state), a React UI package, and a shared TypeScript config
   - Deterministic offline plan generation: identical profile + catalog + locations produce an identical weekly plan; the generator version is stamped on every saved plan and a mismatch forces a regeneration flow
   - Personalization by training ground — each location carries its own equipment set and per-place exercise exclusions, so exercise eligibility is computed per location, not from global flags
   - Gamified progression derived from the ordered completion history (total XP, level, rank E→S, streak, weekly count); one row per local completion date with INSERT OR IGNORE, so re-claiming a day grants XP once
   - Strict runtime shape guards on every persisted value, failing closed so one corrupt row never blocks boot; idempotent SQLite schema and catalog seed on each launch
   - flex-state itself: createStore<T> with Object.is dedupe and detachable methods, bound to React 19 through useSyncExternalStore
   - Tech: Tauri 2, React 19, TypeScript, Rust, SQLite, pnpm workspace, Turborepo, Vitest, node --experimental-strip-types --test, Biome 2

SKILLS
- Frontend Core: ReactJS, Next.js, TypeScript, JavaScript, Redux Toolkit
- UI & Design Systems: Material UI, TailwindCSS, Design Tokens, Responsive Design, Figma
- Architecture: Schema-driven UI, Rule/Derive/Actions engines, Monorepo, JSON Logic/JSONPath, Local-first desktop (Tauri), System Design
- State, Data & Testing: TanStack Query, React Hook Form, Zod, SQLite, Vitest, React Testing Library
- Backend, DevOps & Security: Node.js, Rust/Tauri 2, Docker, Nginx, GitHub Actions, Frappe ERP, Client-side Encryption, SSO, REST APIs, Azure

CONTACT
- Email: prajwalhebbaras@gmail.com
- Phone: +91 9483924880
- LinkedIn: https://linkedin.com/in/hebbarprajwal72
- GitHub: https://github.com/prajwal-hebbar-07
`.trim();

export const SYSTEM_PROMPT = `You are Prajwal's AI assistant, embedded on his portfolio site. You help visitors (often recruiters) quickly learn about Prajwal Hebbar.

VOICE: sharp, warm, and concise — like a helpful friend who handles the boring part. Confident and calm, never hyper or corporate, no exclamation-point hype, no emoji. Sentence case. Get to the point in 2–5 short sentences; use a tight bullet list only when it genuinely helps.

GROUNDING: Answer ONLY from the PORTFOLIO CONTENT below. Do not invent facts, dates, numbers, employers, or projects. If something isn't covered, say so plainly (e.g. "That's not on the site — but you can ask Prajwal directly at prajwalhebbaras@gmail.com.") and point to the best section or contact method.

STYLE: Refer to him as "Prajwal" or "he". When useful, point to the relevant section (About, Experience, Skills, Contact). For contact questions, give the actual email / links from the content. Keep it skimmable. Use simple markdown: **bold** for emphasis, "- " bullets, and plain URLs.

PORTFOLIO CONTENT
${PORTFOLIO_CONTENT}`;

/**
 * Deterministic, still-grounded reply used when no ANTHROPIC_API_KEY is set
 * (or the model call fails). Mirrors the prototype's offline behaviour so the
 * assistant never invents facts and the site stays usable without a key.
 */
export function fallbackAnswer(q: string): string {
  const s = (q || '').toLowerCase();
  if (/contact|email|reach|hire|touch|phone|linkedin|github/.test(s)) {
    return 'Easiest ways to reach Prajwal:\n- **Email** prajwalhebbaras@gmail.com\n- **Phone** +91 9483924880\n- **LinkedIn** https://linkedin.com/in/hebbarprajwal72\n- **GitHub** https://github.com/prajwal-hebbar-07\n\nHe\'s currently open to opportunities.';
  }
  if (/skill|stack|tech|proficien/.test(s)) {
    return 'Prajwal\'s core stack is **React, Next.js and TypeScript**. Highlights:\n- **Frontend:** ReactJS, Next.js, TypeScript, Redux Toolkit\n- **Architecture:** schema-driven UI, rule/derive/actions engines, monorepo, JSON Logic/JSONPath\n- **State, data & testing:** TanStack Query, React Hook Form, Zod, Vitest\n- **Backend, DevOps & security:** Node.js, Docker, Nginx, GitHub Actions, AES encryption, SSO/OAuth, PWA, Azure\n\nSee the Skills section for the full breakdown.';
  }
  if (/experience|summary|summar|30|background|do\b|who/.test(s)) {
    return 'The 30-second version: Prajwal is a **Senior Engineer** with nearly 5 years\' experience, based in Bengaluru. At **LYIK Technologies** — where he was **promoted to Senior Engineer in April 2026** — he shipped v2 of the enterprise form platform and drove much of v3: the admin dashboard (form + user management), a permission guardrail system, the maker-checker approval flow, and the core form engines. He\'s driven **30%+ efficiency gains** through client-facing platforms.';
  }
  if (/lyik/.test(s)) {
    return 'At **LYIK Technologies** (Senior Engineer since April 2026; Enterprise Engineer, April 2023 – March 2026) Prajwal:\n- Shipped v2 of the form-filling app (React 19 + Redux Toolkit) and drove much of **v3** as a configurable, schema-driven platform\n- Built the v3 **admin dashboard** — form management (Material React Table) and a **user-management tree-table** (org hierarchy/DAG) with full user & relationship CRUD over REST\n- Added bulk CSV/ZIP user onboarding, a permission **guardrail** system, the **maker-checker** approval flow, and trusted API records\n- Worked across the form **engines** (rules, derive, actions, navigator) with their test suites, plus SSO, client-side encryption and JSON-driven theming; set up Docker/Nginx and GitHub Actions CI/CD';
  }
  return 'I can summarize Prajwal\'s experience, his skills, specific roles (like LYIK), or how to contact him. What would you like to know? For anything not on the site, email him at prajwalhebbaras@gmail.com.';
}
