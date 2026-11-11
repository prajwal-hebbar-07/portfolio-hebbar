/* ============================================================
   Prajwal Hebbar — Portfolio content (single source of truth).
   Drives the rendered sections AND the AI assistant's grounding.
   All facts come from portfolio-content.md — do not invent any.
   ============================================================ */

export const profile = {
  name: 'Prajwal Hebbar',
  role: 'Senior Engineer',
  title: 'Senior Full-Stack Engineer',
  status: 'Available for opportunities',
  location: 'Bengaluru, India',
  experience: 'Nearly 5 years',
  email: 'prajwalhebbaras@gmail.com',
  phone: '+91 94839 24880',
  phoneHref: '+919483924880',
  linkedin: 'https://www.linkedin.com/in/prajwal-hebbar-a-s-a213b121a/',
  linkedinLabel: 'in/prajwal-hebbar-a-s-a213b121a',
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
      'Owned a <b>regulatory compliance dashboard</b> for a financial-services client across the <b>full stack</b> — requirements with the client, React front end, Node.js API on SQLite with validated Excel ingestion, auth, and a Docker/nginx production deployment — and <b>mentored the intern</b> who shipped its provider-comparison and data-exclusion features.',
      'Top contributor on the <b>v2 form-filling platform</b>, from project init to production: Redux Toolkit → RTK Query data layer, MUI theming, records and checker flows, DigiLocker, liveness/KYC, e-sign and trusted APIs, shipped to Azure via GitHub Actions.',
      'Restructured <b>v3</b> into a Turborepo/pnpm monorepo — types, auth, API client, form core, transformer and shared UI split into workspace packages — and built its <b>admin dashboard</b>: a config-driven widget renderer, form management, and a <b>user-management tree-table</b> modelling the org as a hierarchy/DAG with full CRUD.',
      'Built the persona/permission model behind both apps — <b>maker-checker</b> workflow state machine, <code>GuardRail</code> permission gating, bulk <b>CSV/ZIP onboarding</b>, trusted API records — and worked across the shared form <b>engines</b> (actions, rules, derive, navigator) with their unit, integration and e2e suites.',
      'Ran <b>customer requirement discussions</b> and drove alignment across backend, QA and product teams, turning the outcomes into the JSON configuration models the platform ships with.',
      'Delivered SSO, client-side encryption, JSON-driven theming and PWA/runtime config; shipped with <b>Docker/Nginx</b> and <b>GitHub Actions</b>, and contributed to the company\'s first enterprise client acquisition.',
    ],
    tech: ['React 19', 'TypeScript', 'Redux Toolkit', 'TanStack Query', 'Material UI', 'Turborepo', 'Node.js', 'SQLite', 'Vitest', 'Docker', 'GitHub Actions'],
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
  repo?: string; // omitted for private repositories
  repoLabel?: string;
  status: string;
  year?: string; // shown in the project panel footer; em dash when absent
  shipped?: boolean; // solid accent pill vs tinted "in progress" pill
  points: string[]; // may contain <b>…</b> for emphasis
  tech: string[];
}

export const projects: Project[] = [
  {
    name: 'Logbook',
    tagline: 'Personal attendance and leave log — Android app, Mac desktop widget and command-line tool over one shared core.',
    kind: 'npm workspaces monorepo · Expo · Tauri 2 · Ink CLI · SwiftUI widget',
    repo: 'https://github.com/prajwal-hebbar-07/tracker-mobile',
    repoLabel: 'prajwal-hebbar-07/tracker-mobile',
    status: 'Shipped',
    shipped: true,
    points: [
      'Three clients over <b>one platform-free core</b>: <code>@logbook/core</code> holds dates, summaries, leave spans, reports and CSV/Excel export with no React, storage or native code, so the Expo app, the Tauri widget and the CLI share it unchanged.',
      'The Mac widget and the <code>logbook</code> CLI read and write <b>one log file</b> kept outside the app bundle, so reinstalling or updating never touches the data; a JSON backup moves the log between phone and Mac.',
      'Reporting built in: a month heatmap, year totals, leave by type, <b>plan leave in advance</b> across a date range, and an Excel workbook with one row per calendar day.',
      'A native <b>WidgetKit</b> widget in SwiftUI sits beside the Tauri app, built with the Command Line Tools alone, and redraws when the app or the CLI changes the log.',
      'Released through <b>GitHub Actions</b>; the widget checks the release feed, <b>verifies the download&rsquo;s signature</b> against a key built into the app, then replaces itself and restarts.',
    ],
    tech: ['Expo', 'React Native', 'Tauri 2', 'React', 'TypeScript', 'Rust', 'Ink', 'SwiftUI', 'npm workspaces', 'GitHub Actions'],
  },
  {
    name: 'Prompt Burn',
    tagline: 'Local dashboard for OMP and Cursor token usage, shown as estimated public pay-as-you-go cost; nothing leaves the machine.',
    kind: 'Tauri 2 desktop app, same UI in a VS Code editor tab, shared local SQLite',
    repo: 'https://github.com/prajwal-hebbar-07/prompt-burn',
    repoLabel: 'prajwal-hebbar-07/prompt-burn',
    status: 'Shipped',
    shipped: true,
    points: [
      'Calculates what OMP session logs and Cursor usage would cost if billed at <b>public pay-as-you-go rates</b>, strictly for comparison and not an invoice.',
      'Desktop app and VS Code editor tab share <b>one local database</b> at <code>~/.prompt-burn/db.sqlite</code>, with no web app, account, or cloud.',
      'Usage is read on this machine from OMP session logs and Cursor, then priced from a <b>bundled versioned public rate table</b>; unknown models show an em dash (&mdash;), never <code>$0</code>.',
      '<b>Provider usage clocks</b> (Claude 5-hour/7-day, Ollama Cloud, Cursor included pools) are quoted on their own panel and never mixed into estimated cost.',
      '<b>Non-blocking local fetch</b> runs on launch and when asked; previous numbers stay on screen while a fetch runs.',
    ],
    tech: ['Tauri 2', 'VS Code Extension', 'React', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Node.js', 'pnpm workspace'],
  },
  {
    name: 'LedgerFlow',
    tagline: 'Local-first desktop expense tracker — no account, no server, no sync.',
    kind: 'Tauri 2 · React 19 · Rust · SQLite',
    repo: 'https://github.com/prajwal-hebbar-07/ledger-flow',
    repoLabel: 'prajwal-hebbar-07/ledger-flow',
    status: 'Shipped',
    shipped: true,
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
    name: 'GrowthOS',
    tagline: 'Local-first study-plan tracker for macOS, Android and iOS — no account, no server.',
    kind: 'Tauri 2 · React 19 · Expo 57 · Rust · SQLite',
    status: 'Shipped',
    shipped: true,
    points: [
      'Two clients over one model: <code>@growth-os/learning</code> is consumed as TypeScript source with no build step, so the Tauri 2 desktop app and the Expo React Native app share the same types, validators and eight bundled courses.',
      'Desktop progress is <b>dated completions in SQLite</b> — one row per finished task, so streaks and totals are derived from the ordered history and re-ticking never rewrites the original date.',
      'Task chat and day summaries call <b>Ollama from Rust</b>, never the webview, so the API key never reaches the frontend; the prompt is rebuilt from the current path on every send.',
      '<b>Day summaries</b> are written from that day&rsquo;s own ticks and task conversations, never stored, and appended into a markdown notes folder under a dated heading so no earlier note is overwritten.',
      'Versioned <b>backup and restore</b> merges into the device and keeps the dates tasks were finished; a file from a newer format version is rejected whole rather than silently losing ticks.',
    ],
    tech: ['Tauri 2', 'React 19', 'TypeScript', 'Rust', 'SQLite', 'Expo 57', 'React Native', 'Ollama', 'pnpm workspace', 'Turborepo'],
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
  { icon: 'code-2', title: 'Frontend', skills: ['React', 'Next.js', 'Astro', 'TypeScript', 'JavaScript', 'Redux Toolkit', 'TanStack Query', 'React Hook Form'] },
  { icon: 'server', title: 'Backend & APIs', skills: ['Node.js', 'Hono', 'REST APIs', 'Zod-validated contracts', 'Rust (Tauri commands)', 'Frappe ERP', 'LLM integration (Ollama)'] },
  { icon: 'database', title: 'Databases & Data', skills: ['PostgreSQL', 'SQLite', 'SQL migrations', 'Schema design', 'Offline sync (outbox)', 'Excel / CSV ingestion'] },
  { icon: 'shield-check', title: 'Auth & Security', alt: true, skills: ['OIDC / OAuth2', 'SSO', 'ZITADEL', 'MFA (TOTP, passkeys)', 'Role & permission models', 'Audit logging', 'Client-side Encryption'] },
  { icon: 'cloud', title: 'DevOps & Cloud', skills: ['Docker', 'Docker Compose', 'Nginx', 'GitHub Actions', 'Azure', 'Vercel', 'Signed release pipelines'] },
  { icon: 'monitor-smartphone', title: 'Mobile, Desktop & CLI', skills: ['React Native', 'Expo', 'Tauri 2', 'Rust', 'VS Code Extension', 'Terminal UI (Ink)', 'Local-first apps'] },
  { icon: 'cpu', title: 'Architecture & Testing', alt: true, skills: ['System Design', 'Schema-driven UI', 'Rule / Derive / Actions Engines', 'Monorepo (Turborepo, pnpm)', 'Architecture Decision Records', 'Vitest', 'Playwright'] },
  { icon: 'palette', title: 'UI & Design Systems', skills: ['Material UI', 'Tailwind CSS', 'Design Tokens', 'Responsive Design', 'Figma', 'Paper'] },
  { icon: 'users', title: 'Delivery & Ownership', alt: true, full: true, skills: ['Requirement Gathering', 'Client Communication', 'Cross-team Coordination', 'Mentoring', 'Production Deployment', 'Technical Documentation'] },
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
- Positioning: Senior Full-Stack Engineer — works across frontend, backend APIs, databases, authentication, DevOps, and mobile/desktop apps
- Headline: Senior Full-Stack Engineer building configurable, enterprise-grade software end to end — React and TypeScript interfaces, Node.js APIs, SQL databases, and the Docker and CI/CD pipelines that ship them.

ABOUT
A full-stack engineer working mainly in TypeScript: React and Next.js interfaces, Node.js APIs, PostgreSQL and SQLite behind them, and Docker, Nginx and GitHub Actions to ship. Deepest experience is schema-driven, configurable frontend architecture, and he is comfortable owning the whole stack. At LYIK Technologies he works across three products — the v2 form-filling platform, the v3 configurable platform and admin dashboard, and a regulatory compliance dashboard for a financial-services client that he owned end to end — and is client-facing: he gathers requirements directly from customers, leads discussions across backend, QA and product teams, and mentors juniors. The thread: turning complex requirements into systems that feel effortless to use.
- Education: B.E. in Computer Science Engineering, VVCE Mysuru
- Notable achievement: 30%+ efficiency gains through client-facing platform development

EXPERIENCE
1) Senior Engineer — LYIK Technologies Private Limited (April 2026 – Present; previously Enterprise Engineer, April 2023 – March 2026; On-site, Bengaluru)
   - Promoted to Senior Engineer in April 2026, after shipping v2 and driving much of the v3 configurable form platform
   - Client-facing throughout: gathers requirements directly from customers, runs the discussions that align backend, QA and product teams, and turns the outcomes into the JSON configuration models the platforms ship with
   - Regulatory compliance dashboard for a financial-services client (monthly reporting) — owned the product end to end, from requirement gathering with the client through architecture, build, production deployment and the handover documentation. React 19 + Vite 7 + Tailwind 4 front end, a small Node API on node:sqlite with Zod-validated Excel (xlsx) ingestion, email/password auth with in-memory bearer tokens, admin user management, and a two-container Docker Compose stack served under a configurable base path behind nginx. He explained the domain and the codebase to an intern and had him build the provider-comparison view, per-provider analysis section and the data-exclusion toggles on top of it
   - v2 form-filling platform — top contributor with ~330 commits, from project initialization to production: axios client and interceptors, Tailwind→Material UI migration, Redux Toolkit store and theme slice, login and protected routes, forms/records APIs migrated to RTK Query, DigiLocker OAuth2, MediaPipe liveness, e-sign v1/v2, trusted APIs and LOV dropdowns, checker and submit flows, theme.json theming with a theme generator, SSO login/logout, request encryption, and GitHub Actions workflows building Docker images into Azure Container Registry for dev, staging and production
   - v3 configurable platform — ~440 commits: restructured the repo into a Turborepo/pnpm monorepo, extracting types, auth, the API client, form core, the form transformer and the shared UI component library into workspace packages, and moving the live end-to-end suite into its own package
   - Built the v3 admin dashboard: a config-driven widget rendering engine fed by dashboard.json (recursive group layout, records/activity widgets, status pie, skeletons), a form-management console (Material React Table over the forms API with create/delete and confirmation flows), and a user-management tree-table that models the org as a hierarchy/DAG (buildUserTree, multi-parent edges) with full user and relationship CRUD, search that keeps the tree structure, and relationship CSV download
   - Added bulk user onboarding via client-side CSV/ZIP upload (jszip), and a permission guardrail system: permission-gated routes, a reusable GuardRail component, form-list guards, and persona-based permissions
   - Built the maker-checker approval workflow and its state machine (BOA persona, role × section-type permission resolution, COMPLETED terminal state, checker messages, verify state, submit confirmation modal) and trusted API records (tokenized nodes protected against user overwrite)
   - Worked across the core form engines in the shared form package — actions, rules (persona/permission-based hide and disable), derive (array handling) and navigator (array-boundary navigation) — and wrote their unit/integration test suites
   - Delivered an SSO login flow, client-side encryption, JSON-driven theming (theme.json, custom themes, logo fallback), funcex expression support, liveness/KYC detection with pose challenges, ID obfuscation, multi-file/ZIP upload, PWA and runtime nginx config, plus the architecture and plain-English documentation set
   - Set up Docker/Nginx containerization and GitHub Actions CI/CD; built a Frappe-based ERP and a ServiceNow integration POC
   - Contributed to the company's first enterprise client acquisition
   - Tech: React 19, TypeScript, Redux Toolkit, RTK Query, TanStack Query, Material UI, Material React Table, Tailwind CSS 4, Vite, Node.js, SQLite, Zod, Turborepo/pnpm monorepo, JSON-driven config, Vitest, Playwright, Docker, Nginx, GitHub Actions, Azure, Frappe

2) Associate Web Developer — Content Enablers Inc. (March 2022 – March 2023, Remote, Bengaluru)
   - Website revamp using ReactJS and Bootstrap 5
   - Google Analytics and Google Tag Manager integration
   - Tech: React, Bootstrap 5, Strapi CMS, Google Analytics, GTM

PROJECTS (personal; open-source repositories at github.com/prajwal-hebbar-07)
1) Logbook — personal attendance and leave log (https://github.com/prajwal-hebbar-07/tracker-mobile), shipped with releases
   - Android app (Expo), Mac desktop widget (Tauri 2 + React, plus a native SwiftUI WidgetKit widget) and a command-line tool (Ink terminal UI) in one npm workspaces monorepo
   - One platform-free core package (@logbook/core) holds dates, summaries, leave spans, reports and CSV/Excel export, shared unchanged by all three clients
   - Widget and CLI share one log file kept outside the app bundle so updates never touch the data; a JSON backup moves the log between phone and Mac
   - Month heatmap, year totals, leave by type, planning leave in advance over a date range, Excel workbook export
   - Released through GitHub Actions; the widget self-updates after verifying the download's signature
   - Tech: Expo, React Native, Tauri 2, React, TypeScript, Rust, Ink, SwiftUI, npm workspaces, GitHub Actions

2) Prompt Burn — local dashboard for AI coding token usage (https://github.com/prajwal-hebbar-07/prompt-burn)
   - Shipped, with versioned GitHub releases; Tauri 2 desktop app, same UI in a VS Code editor tab, shared local SQLite (~/.prompt-burn/db.sqlite); no web app, account, or cloud
   - Dollar figure is an estimate of what OMP session logs and Cursor usage would cost if billed at public pay-as-you-go rates, strictly for comparison and not an invoice
   - Usage is read on this machine from OMP session logs and Cursor, then priced from a bundled versioned public rate table; unknown models show an em dash, never $0, and price retroactively when added
   - Provider usage clocks (Claude 5-hour and 7-day windows, Ollama Cloud, Cursor included pools) are quoted on their own panel and never mixed into estimated cost
   - Fetch runs on open and when asked, and previous numbers stay on screen while a fetch runs
   - Tech: Tauri 2, VS Code Extension, React, TypeScript, Tailwind CSS, SQLite, Node.js, pnpm workspace

3) LedgerFlow — local-first desktop expense tracker (https://github.com/prajwal-hebbar-07/ledger-flow)
   - Tauri 2 + React 19 + Rust desktop app for macOS, Linux and Windows; single-user, offline, one SQLite file on the machine, no account/server/sync/telemetry
   - One row per money movement in a single expense table: spend, income, transfer between own accounts and credit-card charge differ only by direction and which of account/card/to-account is set; amounts are positive integers in minor units
   - Balances are derived in SQL (opening balance plus every transaction that touched the account) — no stored running total that can drift
   - Five screens (Overview, Transactions, Analytics, Report, Settings): period-over-period deltas, charts built from CSS boxes rather than a charting library, fixed-charge holdout on the daily series, and a rules-based report generator that needs no model
   - Optional Ollama integration (cloud or local daemon) categorises transactions in batches against a closed 14-category vocabulary and rewrites the report prose; the model writes sentences, never figures, and results are stamped with the model that wrote them
   - Release engineering: GitHub Actions cuts macOS/Linux/Windows builds sequentially, minisign-signed manifest drives in-app auto-update; disk and network access live in Rust #[tauri::command]s, the webview never fetches
   - Tech: Tauri 2, React 19, TypeScript, Rust, SQLite, Tailwind CSS 4, Ollama, pnpm workspace, Turborepo, GitHub Actions, node:test

4) GrowthOS — local-first study-plan tracker (private repository, no public link)
   - Ships as a macOS desktop app (Tauri 2 + React 19) and an Android/iOS app (Expo 57 / React Native), preloaded with an eight-week AI-backend curriculum; no account, no server, nothing uploaded
   - pnpm + Turborepo monorepo whose shared package (@growth-os/learning) is consumed as TypeScript source with no build step, so both clients share one model, one set of validators and the eight bundled courses
   - Desktop persistence is SQLite through rusqlite (bundled): one dated row per finished task, so totals and the consecutive-day streak are derived from the ordered completion history and re-ticking never rewrites the original date
   - Task chat and day summaries call Ollama from Rust rather than the webview, so the API key never reaches the frontend; the system prompt is rebuilt from the current path on every send
   - Day summaries are written from that day's own ticks and task conversations, never stored, and saved as markdown into a folder you pick — appended under a dated heading so an earlier note or hand edit is never overwritten
   - Versioned JSON backup/restore merges into the device and preserves the dates tasks were finished; a newer format version is rejected whole rather than partially losing ticks
   - Tech: Tauri 2, React 19, TypeScript, Rust, SQLite, Expo 57, React Native, Ollama, pnpm workspace, Turborepo, GitHub Actions

SKILLS
- Frontend: React, Next.js, Astro, TypeScript, JavaScript, Redux Toolkit, TanStack Query, RTK Query, React Hook Form
- Backend & APIs: Node.js, Hono, REST APIs, Zod-validated contracts, Rust (Tauri commands), Frappe ERP, LLM integration (Ollama)
- Databases & Data: PostgreSQL, SQLite, SQL migrations, schema design, offline sync (outbox, last-write-wins), Excel/CSV ingestion
- Auth & Security: OIDC/OAuth2, SSO, ZITADEL, MFA (TOTP, passkeys), role and permission models, audit logging, client-side encryption
- DevOps & Cloud: Docker, Docker Compose, Nginx, GitHub Actions, Azure, Vercel, signed release pipelines
- Mobile, Desktop & CLI: React Native, Expo, Tauri 2, Rust, VS Code extension, terminal UI (Ink), local-first apps
- Architecture & Testing: System design, schema-driven UI, rule/derive/actions engines, monorepo (Turborepo, pnpm), architecture decision records, Vitest, Playwright, React Testing Library
- UI & Design Systems: Material UI, Tailwind CSS, Design Tokens, Responsive Design, Figma, Paper
- Delivery & Ownership: Requirement gathering with customers, client communication, cross-team coordination (backend, QA, product), mentoring juniors and interns, production deployment and handover documentation

FULL-STACK WORK BEYOND THE LISTED PROJECTS (personal, private repositories)
- Central authentication service: a Hono (Node.js, TypeScript) backend and React login frontend in front of self-hosted ZITADEL, with OIDC for registered apps, a client-credentials account API, password/TOTP/passkey/email-code sign-in, lockout, an app registry with a separate admin console, a hash-chained audit log in PostgreSQL, Docker Compose deployment, Vitest and Playwright suites, and architecture decision records
- Auth Quest: a gamified learning app — Hono API, pure rules engine (XP, streaks, SM-2 spaced repetition), node:sqlite with versioned migrations, React + Vite UI, answers checked on the server

CONTACT
- Email: prajwalhebbaras@gmail.com
- Phone: +91 9483924880
- LinkedIn: https://www.linkedin.com/in/prajwal-hebbar-a-s-a213b121a/
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
    return 'Easiest ways to reach Prajwal:\n- **Email** prajwalhebbaras@gmail.com\n- **Phone** +91 9483924880\n- **LinkedIn** https://www.linkedin.com/in/prajwal-hebbar-a-s-a213b121a/\n- **GitHub** https://github.com/prajwal-hebbar-07\n\nHe\'s currently open to opportunities.';
  }
  if (/skill|stack|tech|proficien/.test(s)) {
    return 'Prajwal is a **full-stack engineer** working mainly in TypeScript. Highlights:\n- **Frontend:** React, Next.js, TypeScript, Redux Toolkit, TanStack Query\n- **Backend & data:** Node.js, Hono, REST APIs, PostgreSQL, SQLite, Rust (Tauri)\n- **Auth & security:** OIDC/OAuth2, SSO, MFA, permission models, client-side encryption\n- **DevOps:** Docker, Nginx, GitHub Actions, Azure\n- **Mobile & desktop:** React Native/Expo, Tauri 2\n- **Architecture & testing:** schema-driven UI, rule/derive/actions engines, monorepo, Vitest, Playwright\n\nSee the Skills section for the full breakdown.';
  }
  if (/experience|summary|summar|30|background|do\b|who/.test(s)) {
    return 'The 30-second version: Prajwal is a **Senior Full-Stack Engineer** with nearly 5 years\' experience, based in Bengaluru — frontend, APIs, databases, auth and deployment. At **LYIK Technologies** — where he was **promoted to Senior Engineer in April 2026** — he shipped v2 of the enterprise form platform and drove much of v3: the admin dashboard (form + user management), a permission guardrail system, the maker-checker approval flow, and the core form engines. He\'s driven **30%+ efficiency gains** through client-facing platforms.';
  }
  if (/lyik/.test(s)) {
    return 'At **LYIK Technologies** (Senior Engineer since April 2026; Enterprise Engineer, April 2023 – March 2026) Prajwal:\n- Shipped v2 of the form-filling app (React 19 + Redux Toolkit) and drove much of **v3** as a configurable, schema-driven platform\n- Built the v3 **admin dashboard** — form management (Material React Table) and a **user-management tree-table** (org hierarchy/DAG) with full user & relationship CRUD over REST\n- Added bulk CSV/ZIP user onboarding, a permission **guardrail** system, the **maker-checker** approval flow, and trusted API records\n- Worked across the form **engines** (rules, derive, actions, navigator) with their test suites, plus SSO, client-side encryption and JSON-driven theming; set up Docker/Nginx and GitHub Actions CI/CD';
  }
  return 'I can summarize Prajwal\'s experience, his skills, specific roles (like LYIK), or how to contact him. What would you like to know? For anything not on the site, email him at prajwalhebbaras@gmail.com.';
}
