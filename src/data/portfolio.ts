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
  github: 'https://github.com/prajwalhebbar',
  githubLabel: 'github.com/prajwalhebbar',
  education: 'B.E. in Computer Science Engineering',
  educationSchool: 'VVCE, Mysuru',
  languages: ['English', 'Kannada', 'Hindi'],
} as const;

export interface Experience {
  role: string;
  company: string;
  when: string;
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
    when: 'Jun 2026 — Present',
    location: 'On-site · Bengaluru',
    locationIcon: 'map-pin',
    current: true,
    points: [
      '<b>Promoted to Senior Engineer</b> in June 2026 (previously Enterprise Engineer, Apr 2023 &ndash; Jun 2026), after shipping v2 and driving much of the <b>v3</b> configurable form platform.',
      'Built the v3 <b>admin dashboard</b>: a form-management console (MaterialReactTable over the forms API with create/delete + confirmation flows) and a <b>user-management tree-table</b> that models the org as a hierarchy/DAG, with full <b>user &amp; relationship CRUD</b> wired to REST APIs.',
      'Added <b>bulk user onboarding</b> via client-side <b>CSV/ZIP</b> upload (jszip), plus a permission <b>guardrail</b> system &mdash; permission-gated routes, form-list guards, and rule-driven dashboard widgets configured through <b>dashboard.json</b>.',
      'Built the <b>maker-checker approval workflow</b> (checker flow, verify state, submit confirmation) and <b>trusted API records</b> (tokenized nodes protected against user overwrite).',
      'Worked across the core form <b>engines</b> in the <code>@lyikadmin/lyik-form</code> monorepo &mdash; <b>actions</b>, <b>rules</b> (persona/permission-based hide &amp; disable), <b>derive</b> and <b>navigator</b> (array-boundary navigation) &mdash; and wrote their <b>unit/integration test suites</b>.',
      'Delivered <b>SSO login flow</b>, <b>client-side encryption</b>, <b>JSON-driven theming</b> (theme.json, custom themes, logo fallback), <b>funcex</b> expression support, <b>liveness/KYC</b> detection, ID obfuscation and multi-file upload.',
      'Set up <b>Docker/Nginx</b> containerization and <b>GitHub Actions</b> CI/CD; also built a <b>Frappe-based ERP</b> and a ServiceNow integration POC. Contributed to the company’s <b>first enterprise client acquisition</b>.',
    ],
    tech: ['React 19', 'TypeScript', 'Redux Toolkit', 'Material UI', 'TanStack Query', 'Material React Table', 'REST APIs', 'JSON-driven config', 'Monorepo', 'Vitest', 'Docker', 'Nginx', 'GitHub Actions', 'Frappe'],
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
  { icon: 'cpu', title: 'Architecture', alt: true, skills: ['Schema-driven UI', 'Rule / Derive / Actions Engines', 'Monorepo', 'JSON Logic / JSONPath', 'System Design'] },
  { icon: 'database', title: 'State, Data &amp; Testing', skills: ['TanStack Query', 'React Hook Form', 'Zod', 'Vitest', 'React Testing Library'] },
  { icon: 'server', title: 'Backend, DevOps &amp; Security', full: true, skills: ['Node.js', 'Docker', 'Nginx', 'GitHub Actions', 'Frappe ERP', 'Client-side Encryption', 'SSO', 'REST APIs', 'Azure'] },
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
1) Senior Engineer — LYIK Technologies Private Limited (June 2026 – Present; previously Enterprise Engineer, April 2023 – June 2026; On-site, Bengaluru)
   - Promoted to Senior Engineer in June 2026, after shipping v2 and driving much of the v3 configurable form platform
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

SKILLS
- Frontend Core: ReactJS, Next.js, TypeScript, JavaScript, Redux Toolkit
- UI & Design Systems: Material UI, TailwindCSS, Design Tokens, Responsive Design, Figma
- Architecture: Schema-driven UI, Rule/Derive/Actions engines, Monorepo, JSON Logic/JSONPath, System Design
- State, Data & Testing: TanStack Query, React Hook Form, Zod, Vitest, React Testing Library
- Backend, DevOps & Security: Node.js, Docker, Nginx, GitHub Actions, Frappe ERP, Client-side Encryption, SSO, REST APIs, Azure

CONTACT
- Email: prajwalhebbaras@gmail.com
- Phone: +91 9483924880
- LinkedIn: https://linkedin.com/in/hebbarprajwal72
- GitHub: https://github.com/prajwalhebbar
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
    return 'Easiest ways to reach Prajwal:\n- **Email** prajwalhebbaras@gmail.com\n- **Phone** +91 9483924880\n- **LinkedIn** https://linkedin.com/in/hebbarprajwal72\n- **GitHub** https://github.com/prajwalhebbar\n\nHe\'s currently open to opportunities.';
  }
  if (/skill|stack|tech|proficien/.test(s)) {
    return 'Prajwal\'s core stack is **React, Next.js and TypeScript**. Highlights:\n- **Frontend:** ReactJS, Next.js, TypeScript, Redux Toolkit\n- **Architecture:** schema-driven UI, rule/derive/actions engines, monorepo, JSON Logic/JSONPath\n- **State, data & testing:** TanStack Query, React Hook Form, Zod, Vitest\n- **Backend, DevOps & security:** Node.js, Docker, Nginx, GitHub Actions, AES encryption, SSO/OAuth, PWA, Azure\n\nSee the Skills section for the full breakdown.';
  }
  if (/experience|summary|summar|30|background|do\b|who/.test(s)) {
    return 'The 30-second version: Prajwal is a **Senior Engineer** with nearly 5 years\' experience, based in Bengaluru. At **LYIK Technologies** — where he was **promoted to Senior Engineer in June 2026** — he shipped v2 of the enterprise form platform and drove much of v3: the admin dashboard (form + user management), a permission guardrail system, the maker-checker approval flow, and the core form engines. He\'s driven **30%+ efficiency gains** through client-facing platforms.';
  }
  if (/lyik/.test(s)) {
    return 'At **LYIK Technologies** (Senior Engineer since June 2026; Enterprise Engineer from April 2023) Prajwal:\n- Shipped v2 of the form-filling app (React 19 + Redux Toolkit) and drove much of **v3** as a configurable, schema-driven platform\n- Built the v3 **admin dashboard** — form management (Material React Table) and a **user-management tree-table** (org hierarchy/DAG) with full user & relationship CRUD over REST\n- Added bulk CSV/ZIP user onboarding, a permission **guardrail** system, the **maker-checker** approval flow, and trusted API records\n- Worked across the form **engines** (rules, derive, actions, navigator) with their test suites, plus SSO, client-side encryption and JSON-driven theming; set up Docker/Nginx and GitHub Actions CI/CD';
  }
  return 'I can summarize Prajwal\'s experience, his skills, specific roles (like LYIK), or how to contact him. What would you like to know? For anything not on the site, email him at prajwalhebbaras@gmail.com.';
}
