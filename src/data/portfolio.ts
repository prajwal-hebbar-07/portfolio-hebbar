/* ============================================================
   Prajwal Hebbar — Portfolio content (single source of truth).
   Referenced by src/config/site.ts, which decides what renders where.
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
  /** One-line summary shown above the products / points. */
  summary?: string;
  /** Products worked on; each is one row with its points behind a disclosure. */
  products?: Product[];
  points: string[]; // may contain <b>…</b> for emphasis
  tech: string[];
}

export interface Product {
  name: string;
  role: string;
  when: string;
  summary: string;
  points: string[]; // may contain <b>…</b> for emphasis
}

export interface Capability {
  icon: string; // lucide name
  title: string;
  proof: string; // one line of evidence
}

/** The skim layer: what he can own, each with one line of proof. */
export const capabilities: Capability[] = [
  { icon: 'code-2', title: 'Frontend', proof: 'Started a schema-driven form platform and carried it through three generations in React and TypeScript.' },
  { icon: 'server', title: 'Backend & data', proof: 'Built the Node.js API, SQLite schema and audit tables behind a compliance dashboard used for monthly reporting.' },
  { icon: 'shield-check', title: 'Auth & security', proof: 'Built multi-organisation sign-in, permission gating and client-side encryption for an enterprise platform.' },
  { icon: 'cloud', title: 'DevOps & delivery', proof: 'Ships with Docker, Nginx and GitHub Actions to Azure; personal apps release as signed, self-updating builds.' },
  { icon: 'monitor-smartphone', title: 'Mobile & desktop', proof: 'Four shipped local-first apps across Android, macOS, Windows and Linux with Expo, Tauri and Rust.' },
];

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
    summary: 'Three generations of an enterprise form platform, plus a compliance dashboard owned across the full stack. Client-facing throughout: requirements gathered directly with customers.',
    products: [
      {
        name: 'Forms platform v3',
        role: 'Core contributor',
        when: 'Feb 2026 — Present',
        summary: 'Configurable, multi-tenant form platform: one login, many organisations, every form driven by configuration.',
        points: [
          'Restructured it into a <b>Turborepo/pnpm monorepo</b> of one web app and eight packages, and built <b>multi-organisation sign-in</b> where one login is exchanged for an organisation-scoped token with per-tenant branding.',
          'Built the <b>admin area</b> — tenant management, configuration settings and a <b>user-management tree</b> modelling the org as a hierarchy — on the persona/permission model behind it: <b>maker-checker</b> workflow, <code>GuardRail</code> permission gating, and template-driven bulk CSV uploads with a guard that rejects formula and script cells.',
          'Split the API client into <b>versioned v1/v2 surfaces</b> with wire-level tests pinning every endpoint, built a JSON-authored <b>video-KYC journey</b> (ID capture, liveness, recording timeline), and wrote a large share of the unit, integration and <b>Playwright</b> suites plus the architecture docs.',
        ],
      },
      {
        name: 'Regulatory compliance dashboard',
        role: 'Owner, full stack',
        when: 'Feb 2026 — Oct 2026',
        summary: 'Monthly regulatory reporting for a financial-services client, owned from the first client conversation to production.',
        points: [
          'Owned across the <b>full stack</b>: React front end, Node.js API on SQLite, and a Docker Compose deployment behind nginx, with requirements gathered directly from the client.',
          'Report data arrives as Excel, is <b>validated with Zod</b> and previewed before it replaces a month; email/password login with admin user management restricts uploads and deletions by role.',
          'Every upload and deletion is recorded, with database-level delete guards and <b>trigger-enforced append-only audit tables</b>; <b>mentored the intern</b> who built the provider-comparison and data-exclusion features on top.',
        ],
      },
      {
        name: 'Forms platform v2',
        role: 'Top contributor',
        when: 'Mar 2025 — Oct 2026',
        summary: 'TypeScript rewrite of the form-filling app, taken from project init to production.',
        points: [
          'Built the data layer on <b>Redux Toolkit and RTK Query</b> behind an axios client with interceptors and request encryption.',
          'Delivered DigiLocker sign-in, liveness/KYC, e-sign, trusted-API autofill, checker flows, SSO and JSON-driven theming, shipped to Azure via <b>GitHub Actions</b>.',
        ],
      },
      {
        name: 'Forms platform v1',
        role: 'Started it',
        when: 'Oct 2024 — Aug 2026',
        summary: 'The original schema-driven form app: whole onboarding forms rendered from server-sent JSON, with no per-form code.',
        points: [
          'Started the project and wrote most of it: a <b>rendering engine</b> for sections, cards, tables and field types, with default values and visibility rules resolved through JSONPath.',
          'Integrated DigiLocker, document verification, e-sign, payments and face-based liveness; added the maker-checker review flow; containerised with <b>Docker/Nginx</b> and deployed through GitHub Actions.',
        ],
      },
    ],
    points: [],
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
  /** Screenshots or clips, served from /public. Rendered only when present. */
  media?: { src: string; alt: string }[];
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

/* ── Forms platform, three generations ───────────────────────────────────── */

export interface Generation {
  version: string;
  when: string;
  role: string;
  scope: string;
  /** What is rendered from configuration rather than written per client. */
  configDrives: string[];
  architecture: string;
  access: string;
  delivery: string;
}

export const evolution: Generation[] = [
  {
    version: 'v1',
    when: 'Oct 2024',
    role: 'Started it, wrote most of it',
    scope: 'The original schema-driven form app: whole onboarding forms rendered from server-sent JSON, with no per-form code.',
    configDrives: ['Forms'],
    architecture: 'A rendering engine for sections, cards, tables and field types, with default values and visibility rules resolved through JSONPath.',
    access: 'Persona-based navigation, maker-checker review, token refresh and encrypted browser storage.',
    delivery: 'Docker and Nginx; GitHub Actions deploying dev, stage and production to Azure.',
  },
  {
    version: 'v2',
    when: 'Mar 2025',
    role: 'Top contributor, init to production',
    scope: 'The TypeScript rewrite of the form-filling app.',
    configDrives: ['Forms', 'Themes'],
    architecture: 'Redux Toolkit and RTK Query behind an axios client with interceptors and request encryption; Tailwind migrated to Material UI; theming from theme.json with a theme generator.',
    access: 'Login and protected routes, DigiLocker OAuth2, SSO, checker and submit flows.',
    delivery: 'GitHub Actions building Docker images into Azure Container Registry for dev, staging and production.',
  },
  {
    version: 'v3',
    when: 'Feb 2026',
    role: 'Core contributor',
    scope: 'Configurable, multi-tenant platform: one login, many organisations, every form driven by configuration.',
    configDrives: ['Forms', 'Themes', 'Dashboard widgets', 'Video-KYC journey', 'API version', 'Tenant branding'],
    architecture: 'Turborepo/pnpm monorepo of one web app and eight packages; shared form engines (actions, rules, derive, navigator); versioned v1/v2 API client with wire-level tests pinning every endpoint.',
    access: 'Organisation-scoped tokens, GuardRail permission gating, and a maker-checker workflow state machine.',
    delivery: 'PWA with runtime nginx config; unit, integration and Playwright end-to-end suites; architecture documentation.',
  },
];
