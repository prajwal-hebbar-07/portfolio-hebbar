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
  role: 'Full Stack Developer · Bengaluru',
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
A Full Stack Developer with nearly 5 years of experience, based in Bengaluru. He's open to new opportunities and specializes in React, Next.js, TypeScript, Web3, and AI integrations.

**Current role**
Enterprise Engineer at **LYIK Technologies** (Apr 2023 – Present), where he architects a configurable form-filling platform built on a rule engine, derive engine, and actions engine. He's also working on JSON-driven dashboard layouts and a Frappe-based ERP, with DevOps via Docker, Nginx, and GitHub Actions. He contributed to the company's first enterprise client win.

**Prior experience**
- **Freelance Consultant (Web3 & AI dApps)** — built an AI-powered DeFi analytics platform and a Web3 portfolio tool with WalletConnect.
- **Associate Web Developer at Content Enablers Inc.** — led a React + Bootstrap 5 site revamp with GA/GTM integration.

**Strengths**
Frontend (React, Next.js, Redux, TypeScript), UI (Material UI, Tailwind, Bootstrap), Web3/AI (OpenAI, WalletConnect, prompt engineering), and Backend/DevOps (Node.js, Docker, AWS, Azure, CI/CD).

**Education**
B.E. in Computer Science, VVCE Mysuru (VTU).

**Contact**
- Email: prajwalhebbaras@gmail.com
- LinkedIn: linkedin.com/in/hebbarprajwal72
- GitHub: github.com/prajwalhebbar
- Website: https://portfolio.hebbars.in

Want me to go deeper into any specific role, project, or skill set?`,

  work: `Here's a quick summary of Prajwal's work experience:

**Nearly 5 years** across enterprise, freelance, and agency roles:

- **Enterprise Engineer — LYIK Technologies** (Apr 2023 – Present)
  Builds configurable, enterprise-grade form-filling and ERP platforms. Architected the system's rule, derive, and actions engines; ships a monorepo-shared form layout; sets up Docker/Nginx and CI/CD; contributed to the company's first enterprise client win.

- **Full Stack Consultant — Freelance** (Ongoing)
  Builds AI and Web3 dApps, including an AI-powered DeFi analytics platform and a Web3 portfolio tool with WalletConnect. Owns the full stack — Next.js, Node.js, OpenAI, AWS/Vercel.

- **Associate Web Developer — Content Enablers Inc.** (Mar 2022 – Mar 2023)
  Led a website revamp with React and Bootstrap 5, plus GA/GTM integration for product analytics.

A clear pattern: complex, configurable frontend systems with real production scale. Want to dig into any of these?`,

  skills: `Here's a quick rundown of Prajwal's technical skills:

**Frontend**
- ReactJS, Next.js, TypeScript, JavaScript, Redux

**UI & Styling**
- Material UI, TailwindCSS, Bootstrap 5, CSS/HTML, Responsive Design

**Web3 & AI**
- OpenAI API, Prompt Engineering, LLM Integration, WalletConnect, dApp Development

**Backend & DevOps**
- Node.js, Docker, Nginx, GitHub Actions, AWS, Vercel, Azure

**Tools & Other**
- Git/GitHub, Frappe ERP, Figma, Adobe XD, ServiceNow, System Architecture

His strongest areas are the React/Next.js stack and Web3/AI integrations. Want me to dig into how he's applied these in specific projects? Reach him at **prajwalhebbaras@gmail.com** for the full picture.`,

  current: `Prajwal currently works as an **Enterprise Engineer at LYIK Technologies Pvt. Ltd.** in Bengaluru (on-site), a role he's held since April 2023.

There, he:
- Built v2 of the form-filling app with Redux and is now developing v3 as a configurable platform
- Architected rule, derive, and actions engines for the platform
- Works on JSON-driven dashboard layouts and a Frappe-based ERP system
- Set up Docker/Nginx containerization and GitHub Actions CI/CD

He also runs a parallel freelance practice building Web3 and AI dApps.`,

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
