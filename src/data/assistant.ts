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
  role: 'Senior Engineer · Bengaluru',
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
A Senior Engineer with nearly 5 years of experience, based in Bengaluru. He's open to new opportunities and specializes in React, Next.js, TypeScript, and configurable, schema-driven frontend architecture.

**Current role**
Senior Engineer at **LYIK Technologies** (promoted in June 2026; Enterprise Engineer from Apr 2023). He shipped v2 of the enterprise form platform and drove much of v3: the admin dashboard (form management plus a user-management tree-table with full REST CRUD), a permission guardrail system, the maker-checker approval flow, and the core form engines (rules, derive, actions, navigator) with their test suites — plus SSO, client-side encryption, and JSON-driven theming, with DevOps via Docker, Nginx, and GitHub Actions. He contributed to the company's first enterprise client win.

**Prior experience**
- **Associate Web Developer at Content Enablers Inc.** (Mar 2022 – Mar 2023) — led a React + Bootstrap 5 site revamp with GA/GTM integration.

**Strengths**
Frontend (React, Next.js, Redux Toolkit, TypeScript), UI & design systems (Material UI, Tailwind), architecture (schema-driven UI, rule/derive/actions engines, monorepo, JSON Logic), and backend/DevOps/security (Node.js, Docker, CI/CD, AES encryption, SSO, PWA).

**Education**
B.E. in Computer Science, VVCE Mysuru (VTU).

**Contact**
- Email: prajwalhebbaras@gmail.com
- LinkedIn: linkedin.com/in/hebbarprajwal72
- GitHub: github.com/prajwalhebbar
- Website: https://portfolio.hebbars.in

Want me to go deeper into any specific role, project, or skill set?`,

  work: `Here's a quick summary of Prajwal's work experience:

**Nearly 5 years** across enterprise and agency roles:

- **Senior Engineer — LYIK Technologies** (Jun 2026 – Present; Enterprise Engineer, Apr 2023 – Jun 2026)
  Builds configurable, enterprise-grade form and ERP platforms. Shipped v2, then drove much of v3: built the admin dashboard (form management + a user-management tree-table with full REST CRUD), a permission guardrail system, and the maker-checker approval flow; worked across the form engines (rules, derive, actions, navigator) with their test suites; delivered SSO, client-side encryption, and JSON-driven theming; set up Docker/Nginx and CI/CD; contributed to the company's first enterprise client win.

- **Associate Web Developer — Content Enablers Inc.** (Mar 2022 – Mar 2023)
  Led a website revamp with React and Bootstrap 5, plus GA/GTM integration for product analytics.

A clear pattern: complex, configurable frontend systems with real production scale. Want to dig into any of these?`,

  skills: `Here's a quick rundown of Prajwal's technical skills:

**Frontend**
- ReactJS, Next.js, TypeScript, JavaScript, Redux Toolkit

**UI & Design Systems**
- Material UI, TailwindCSS, Design Tokens, Responsive Design, Figma

**Architecture**
- Schema-driven UI, Rule/Derive/Actions engines, Monorepo, JSON Logic/JSONPath, System Design

**State, Data & Testing**
- TanStack Query, React Hook Form, Zod, Vitest, React Testing Library

**Backend, DevOps & Security**
- Node.js, Docker, Nginx, GitHub Actions, Frappe ERP, Client-side Encryption, SSO, REST APIs, Azure

His strongest areas are the React/TypeScript stack and configurable, schema-driven architecture. Want me to dig into how he's applied these in specific projects? Reach him at **prajwalhebbaras@gmail.com** for the full picture.`,

  current: `Prajwal currently works as a **Senior Engineer at LYIK Technologies Pvt. Ltd.** in Bengaluru (on-site). He joined as an Enterprise Engineer in April 2023 and was **promoted to Senior Engineer in June 2026**.

There, he:
- Shipped v2 of the form-filling app (React 19 + Redux Toolkit) and drove much of v3 as a configurable, schema-driven platform
- Built the v3 admin dashboard: form management (Material React Table) and a user-management tree-table (org hierarchy/DAG) with full user & relationship CRUD over REST
- Added bulk CSV/ZIP user onboarding, a permission guardrail system, the maker-checker approval flow, and trusted API records
- Worked across the form engines (rules, derive, actions, navigator) with their test suites; delivered SSO, client-side encryption and JSON-driven theming; set up Docker/Nginx and GitHub Actions CI/CD`,

  contact: `You can reach Prajwal through any of these channels:

- **Email:** prajwalhebbaras@gmail.com
- **Phone:** +91 9483924880
- **LinkedIn:** https://linkedin.com/in/hebbarprajwal72
- **GitHub:** https://github.com/prajwalhebbar

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
