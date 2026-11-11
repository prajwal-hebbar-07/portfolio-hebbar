/* ============================================================
   Portfolio assistant — identity, starter prompts, validation rules,
   and a keyword router + canned answers used as an OFFLINE FALLBACK.

   The live answers come from the Go backend (POST /api/v1/portfolio/ask,
   proxied through /api/portfolio/ask). The canned `answers`/`guardrail`
   below mirror that backend's responses verbatim, so the assistant still
   works (and stays on-topic) when the backend is unreachable.

   Shared by both the browser client (src/scripts/assistant.ts) and the
   proxy endpoint (src/pages/api/portfolio/ask.ts).
   ============================================================ */

export type AnswerId = 'summary' | 'work' | 'skills' | 'current' | 'contact' | 'education';
export type RouteId = AnswerId | 'guardrail';

export interface Starter {
  id: AnswerId;
  icon: string; // lucide name
  label: string;
  prompt: string;
}

export const identity = {
  name: 'Prajwal Hebbar',
  role: 'Senior Full-Stack Engineer · Bengaluru',
  tagline: 'Ask about my experience, skills, projects, or how to reach me.',
  status: 'Powered by the portfolio assistant',
} as const;

export const starters: Starter[] = [
  { id: 'summary', icon: 'sparkles', label: 'Give me a summary', prompt: "Give me a summary of Prajwal's portfolio" },
  { id: 'work', icon: 'briefcase', label: 'Work experience', prompt: 'Summarise his work experience' },
  { id: 'skills', icon: 'code-xml', label: 'Technical skills', prompt: 'What are his technical skills?' },
  { id: 'current', icon: 'building-2', label: 'Where he works now', prompt: 'Where does Prajwal currently work?' },
  { id: 'contact', icon: 'at-sign', label: 'How to get in touch', prompt: 'How can I contact him?' },
  { id: 'education', icon: 'graduation-cap', label: 'Education', prompt: 'What is his educational background?' },
];

export const validation = {
  maxLen: 500,
  blank: { code: 'Bad Request', message: 'prompt cannot be blank' },
  tooLong: { code: 'Bad Request', message: 'prompt too long (max 500 characters)' },
} as const;

export const guardrail =
  "I can only answer questions about Prajwal's professional background. Feel free to ask about his experience, skills, or how to get in touch.";

export const answers: Record<AnswerId, string> = {
  summary: `Here's a quick summary of Prajwal's portfolio:

**Who he is**
A Senior Full-Stack Engineer with nearly 5 years of experience, based in Bengaluru. He's open to new opportunities and works across the stack in TypeScript — React and Next.js interfaces, Node.js APIs, PostgreSQL and SQLite, auth, and Docker/CI/CD — with deep experience in configurable, schema-driven frontend architecture.

**Current role**
Senior Engineer at **LYIK Technologies** (promoted in April 2026; Enterprise Engineer, Apr 2023 – Mar 2026). He has worked across four products: v1 of the enterprise form platform, which he started and wrote most of; the v2 TypeScript rewrite (top contributor, from project init to production); the v3 configurable, multi-tenant platform — multi-organisation sign-in, versioned API client, Turborepo monorepo, config-driven admin dashboard, user-management tree-table, permission guardrails, maker-checker workflow, and the form engines (rules, derive, actions, navigator) with their test suites — and a regulatory compliance dashboard for a financial-services client, which he owned end to end from requirement gathering through deployment, mentoring an intern on it along the way. He's client-facing: he runs requirement discussions with customers and aligns backend, QA and product teams. He contributed to the company's first enterprise client win.

**Prior experience**
- **Associate Web Developer at Content Enablers Inc.** (Mar 2022 – Mar 2023) — led a React + Bootstrap 5 site revamp with GA/GTM integration.

**Strengths**
Frontend (React, Next.js, Redux Toolkit, TypeScript), backend and data (Node.js, Hono, REST APIs, PostgreSQL, SQLite, Rust), auth and security (OIDC/OAuth2, SSO, MFA, permission models, client-side encryption), DevOps (Docker, Nginx, GitHub Actions, Azure), mobile and desktop (React Native/Expo, Tauri 2), and architecture (schema-driven UI, rule/derive/actions engines, monorepo).

**Education**
B.E. in Computer Science, VVCE Mysuru (VTU).

**Contact**
- Email: prajwalhebbaras@gmail.com
- LinkedIn: linkedin.com/in/prajwal-hebbar-a-s-a213b121a
- GitHub: github.com/prajwal-hebbar-07
- Website: https://portfolio.hebbars.in

Want me to go deeper into any specific role, project, or skill set?`,

  work: `Here's a quick summary of Prajwal's work experience:

**Nearly 5 years** across enterprise and agency roles:

- **Senior Engineer — LYIK Technologies** (Apr 2026 – Present; Enterprise Engineer, Apr 2023 – Mar 2026)
  Builds configurable, enterprise-grade form and ERP platforms, and owns delivery end to end. Started the original v1 schema-driven form app and wrote most of it. Top contributor on the v2 platform (project init → production: RTK Query data layer, MUI theming, DigiLocker, liveness/KYC, e-sign, trusted APIs, checker flows, Azure CI/CD). On v3: restructured it into a Turborepo monorepo, built the admin dashboard (config-driven widgets, form management, user-management tree-table with full REST CRUD), the permission guardrail system and the maker-checker workflow, plus the form engines and their tests. Separately owned a regulatory compliance dashboard for a financial-services client, from requirement gathering to production deployment, and mentored the intern who built features on it.

- **Associate Web Developer — Content Enablers Inc.** (Mar 2022 – Mar 2023)
  Led a website revamp with React and Bootstrap 5, plus GA/GTM integration for product analytics.

A clear pattern: complex, configurable systems owned across the stack, at real production scale. Want to dig into any of these?`,

  skills: `Here's a quick rundown of Prajwal's technical skills:

**Frontend**
- React, Next.js, Astro, TypeScript, JavaScript, Redux Toolkit, TanStack Query, React Hook Form

**Backend & APIs**
- Node.js, Hono, REST APIs, Zod-validated contracts, Rust (Tauri commands), Frappe ERP, LLM integration (Ollama)

**Databases & Data**
- PostgreSQL, SQLite, SQL migrations, schema design, offline sync, Excel/CSV ingestion

**Auth & Security**
- OIDC/OAuth2, SSO, ZITADEL, MFA (TOTP, passkeys), role and permission models, audit logging, client-side encryption

**DevOps & Cloud**
- Docker, Docker Compose, Nginx, GitHub Actions, Azure, Vercel

**Mobile, Desktop & CLI**
- React Native, Expo, Tauri 2, Rust, VS Code extension, terminal UI (Ink)

**Architecture & Testing**
- System design, schema-driven UI, rule/derive/actions engines, monorepo, Vitest, Playwright, React Testing Library

**UI & Design Systems**
- Material UI, Tailwind CSS, Design Tokens, Responsive Design, Figma

**Delivery & Ownership**
- Requirement gathering with customers, cross-team coordination (backend, QA, product), mentoring, production deployment, handover documentation

His strongest areas are the React/TypeScript stack, owning a product across frontend, API, database and deployment, and taking it from the first client conversation to production. Want me to dig into how he's applied these in specific projects? Reach him at **prajwalhebbaras@gmail.com** for the full picture.`,

  current: `Prajwal currently works as a **Senior Engineer at LYIK Technologies Pvt. Ltd.** in Bengaluru (on-site). He joined as an Enterprise Engineer in April 2023 and was **promoted to Senior Engineer in April 2026**.

There, he:
- Owns a **regulatory compliance dashboard** for a financial-services client end to end — requirements gathered directly from the client, then architecture, build, deployment and handover docs (React 19 + Vite + Tailwind, a small Node/SQLite API with Excel ingestion, Docker Compose behind nginx) — and mentored the intern who added the provider-comparison view and data-exclusion toggles
- Started **v1**, the original schema-driven form app, and wrote most of it
- Was the top contributor on the **v2** form-filling platform, from project initialization to production (RTK Query, Material UI theming, DigiLocker, liveness/KYC, e-sign, trusted APIs, checker flows, GitHub Actions → Azure)
- On **v3**, built multi-organisation sign-in, the versioned v1/v2 API client, tenant and configuration management, guarded template-driven CSV uploads and a video-KYC journey
- Restructured **v3** into a Turborepo/pnpm monorepo and built its admin dashboard: config-driven widgets from dashboard.json, form management, and a user-management tree-table (org hierarchy/DAG) with full user & relationship CRUD
- Built the permission guardrail system, bulk CSV/ZIP onboarding and the maker-checker workflow state machine; worked across the form engines (rules, derive, actions, navigator) with their unit, integration and Playwright suites
- Runs customer requirement discussions and aligns backend, QA and product teams; delivered SSO, client-side encryption and JSON-driven theming, with Docker/Nginx and GitHub Actions CI/CD`,

  contact: `You can reach Prajwal through any of these channels:

- **Email:** prajwalhebbaras@gmail.com
- **Phone:** +91 9483924880
- **LinkedIn:** https://www.linkedin.com/in/prajwal-hebbar-a-s-a213b121a/
- **GitHub:** https://github.com/prajwal-hebbar-07

Email is usually the best way to start a conversation about opportunities.`,

  education: `Prajwal holds a **B.E. in Computer Science Engineering** from **VVCE, Mysuru** (Visvesvaraya Technological University).`,
};

/** Keyword routing for free-typed prompts → answer id (else guardrail). */
export function route(text: string): RouteId {
  const t = (text || '').toLowerCase();
  if (/(ignore|previous instruction|joke|poem|cat|weather|recipe|story|song)/.test(t)) return 'guardrail';
  if (/(summary|summarise|summarize|overview|portfolio|about|who is|tell me about)/.test(t)) return 'summary';
  if (/(experience|work history|career|background|roles?|jobs?)/.test(t)) return 'work';
  if (/(skill|tech|stack|tools?|technolog|languages?)/.test(t)) return 'skills';
  if (/(current|now|where.*work|employ|company)/.test(t)) return 'current';
  if (/(contact|reach|email|phone|hire|connect|linkedin|github)/.test(t)) return 'contact';
  if (/(education|study|studied|degree|college|university|school)/.test(t)) return 'education';
  return 'guardrail';
}

/** Offline answer for a prompt, mirroring the backend's behaviour. */
export function offlineAnswer(prompt: string): string {
  const id = route(prompt);
  return id === 'guardrail' ? guardrail : answers[id];
}
