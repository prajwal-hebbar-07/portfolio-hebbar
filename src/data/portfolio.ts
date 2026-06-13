/* ============================================================
   Prajwal Hebbar — Portfolio content (single source of truth).
   Drives the rendered sections AND the AI assistant's grounding.
   All facts come from portfolio-content.md — do not invent any.
   ============================================================ */

export const profile = {
  name: 'Prajwal Hebbar',
  role: 'Full Stack Developer',
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
    role: 'Enterprise Engineer',
    company: 'LYIK Technologies Pvt. Ltd.',
    when: 'Apr 2023 — Present',
    location: 'On-site · Bengaluru',
    locationIcon: 'map-pin',
    current: true,
    points: [
      'Completed <b>v2 of the form-filling application</b> using Redux for complete state management; now developing <b>v3</b> as a more configurable platform.',
      'Architected the platform around a <b>rule engine</b> (field editability &amp; visibility), a <b>derive engine</b> (data derivation &amp; auto-filling), and an <b>actions engine</b> (scenario-based actions).',
      'Built the shared form layout as a separately maintained <b>monorepo package</b>, with the main app repo handling product-specific components.',
      'Developing <b>JSON-driven configuration</b> for dashboard layouts, and a <b>Frappe-based ERP</b> system with configurable workflows.',
      'Set up <b>Docker/Nginx</b> containerization and a <b>GitHub Actions</b> CI/CD pipeline; built a ServiceNow integration POC.',
      "Contributed to the company's <b>first enterprise client acquisition</b>.",
    ],
    tech: ['React', 'Redux', 'TypeScript', 'Material UI', 'JSON', 'Monorepo', 'Frappe', 'Docker', 'Nginx', 'GitHub Actions', 'Azure'],
  },
  {
    role: 'Full Stack Consultant',
    company: 'Freelance — Web3 & AI dApps',
    when: 'Ongoing',
    location: 'Remote',
    locationIcon: 'globe',
    points: [
      'Built an <b>AI-powered DeFi analytics platform</b> with a conversational chat interface.',
      'Shipped a <b>Web3 portfolio intelligence platform</b> with WalletConnect integration.',
      'Engineered a <b>prompt-engineering pipeline</b> producing structured JSON responses.',
    ],
    tech: ['Next.js', 'Node.js', 'OpenAI API', 'WalletConnect', 'Web3', 'Docker', 'AWS', 'Vercel'],
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
  { icon: 'code-2', title: 'Frontend Core', skills: ['ReactJS', 'Next.js', 'TypeScript', 'JavaScript', 'Redux'] },
  { icon: 'palette', title: 'UI & Styling', skills: ['Material UI', 'TailwindCSS', 'Bootstrap 5', 'CSS / HTML', 'Responsive Design'] },
  { icon: 'cpu', title: 'Web3 & AI', alt: true, skills: ['OpenAI API', 'Prompt Engineering', 'LLM Integration', 'WalletConnect', 'dApp Development'] },
  { icon: 'server', title: 'Backend &amp; DevOps', skills: ['Node.js', 'Docker', 'Nginx', 'GitHub Actions', 'AWS', 'Vercel', 'Azure'] },
  { icon: 'wrench', title: 'Tools &amp; Other', full: true, skills: ['Git / GitHub', 'Frappe ERP', 'Figma', 'Adobe XD', 'ServiceNow', 'System Architecture'] },
];

/* ── AI assistant grounding ──────────────────────────────────────────────── */

export const PORTFOLIO_CONTENT = `
PROFILE
- Name: Prajwal Hebbar
- Role: Full Stack Developer
- Status: Available for opportunities
- Location: Bengaluru, India
- Experience: Nearly 5 years
- Languages: English, Kannada, Hindi
- Headline: Full Stack Developer building scalable, performant, and intelligent web experiences with React, Next.js, Web3 & AI.

ABOUT
Specializes in ReactJS, Next.js, TypeScript, and Web3/AI integrations. At LYIK Technologies he currently architects configurable enterprise form-filling infrastructure, dashboard layouts, and ERP workflows. Freelance experience includes AI-powered DeFi platforms and Web3 portfolio tools.
- Education: B.E. in Computer Science Engineering, VVCE Mysuru
- Notable achievement: 30%+ efficiency gains through client-facing platform development

EXPERIENCE
1) Enterprise Engineer — LYIK Technologies Private Limited (April 2023 – Present, On-site, Bengaluru)
   - Completed v2 of the form-filling application using Redux for complete state management
   - Currently developing v3 as a more configurable form-filling platform
   - Built the shared form layout and functionality as a separately maintained monorepo package, while the main application repository handles product-specific components
   - Structured the platform around a rule engine (field editability/visibility), a derive engine (data derivation and auto-filling), and an actions engine (scenario-based actions)
   - Developing JSON-driven configuration for dashboard layouts
   - Built a Frappe-based ERP system with configurable workflows
   - Docker/Nginx containerization and GitHub Actions CI/CD pipeline
   - ServiceNow integration POC
   - Contributed to first enterprise client acquisition
   - Tech: React, Redux, TypeScript, Material UI, JSON, Monorepo Architecture, Frappe, Docker, Nginx, GitHub Actions, Azure

2) Full Stack Consultant — Freelance, Web3 & AI dApps (Ongoing, Remote)
   - AI-powered DeFi analytics platform with a conversational chat interface
   - Web3 portfolio intelligence platform with WalletConnect integration
   - Prompt engineering pipeline for structured JSON responses
   - Tech: Next.js, Node.js, OpenAI API, WalletConnect, Web3, Docker, AWS, Vercel

3) Associate Web Developer — Content Enablers Inc. (March 2022 – March 2023, Remote, Bengaluru)
   - Website revamp using ReactJS and Bootstrap 5
   - Google Analytics and Google Tag Manager integration
   - Tech: React, Bootstrap 5, Strapi CMS, Google Analytics, GTM

SKILLS
- Frontend Core: ReactJS, Next.js, TypeScript, JavaScript, Redux
- UI & Styling: Material UI, TailwindCSS, Bootstrap 5, CSS/HTML, Responsive Design
- Web3 & AI: OpenAI API, Prompt Engineering, LLM Integration, WalletConnect, dApp Development
- Backend & DevOps: Node.js, Docker, Nginx, GitHub Actions, AWS, Vercel, Azure
- Tools & Other: Git/GitHub, Frappe ERP, Figma, Adobe XD, ServiceNow, System Architecture

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
    return 'Prajwal\'s core stack is **React, Next.js and TypeScript**. Highlights:\n- **Frontend:** ReactJS, Next.js, TypeScript, Redux\n- **Web3 & AI:** OpenAI API, prompt engineering, LLM integration, WalletConnect, dApps\n- **Backend & DevOps:** Node.js, Docker, Nginx, GitHub Actions, AWS, Vercel, Azure\n\nSee the Skills section for the full breakdown.';
  }
  if (/experience|summary|summar|30|background|do\b|who/.test(s)) {
    return 'The 30-second version: Prajwal is a **Full Stack Developer** with nearly 5 years\' experience, based in Bengaluru. He\'s an **Enterprise Engineer at LYIK Technologies**, where he architects a configurable enterprise form-filling platform (rule, derive and actions engines) plus ERP workflows. On the side he builds **Web3 & AI dApps** — AI-powered DeFi analytics and Web3 portfolio tools. He\'s driven **30%+ efficiency gains** through client-facing platforms.';
  }
  if (/lyik/.test(s)) {
    return 'At **LYIK Technologies** (Enterprise Engineer, since April 2023, Bengaluru) Prajwal:\n- Shipped v2 of the form-filling app with Redux, and is building a more configurable v3\n- Structured it around a **rule engine** (editability/visibility), a **derive engine** (auto-fill) and an **actions engine**\n- Packaged the shared form layout as a monorepo package\n- Set up Docker/Nginx and GitHub Actions CI/CD, and contributed to the first enterprise client win';
  }
  return 'I can summarize Prajwal\'s experience, his skills, specific roles (like LYIK), or how to contact him. What would you like to know? For anything not on the site, email him at prajwalhebbaras@gmail.com.';
}
