/* The site config. index.astro walks `sections` and renders each one with the
   component registered for its `type`; the "schema" switch on every section
   prints that section's entry from this file, unedited. Reordering this array
   reorders the page. */
import { capabilities, evolution, experiences, profile, projects, skillGroups } from '../data/portfolio';

export type SectionType =
  | 'hero'
  | 'form-demo'
  | 'evolution'
  | 'timeline'
  | 'projects'
  | 'skills'
  | 'about'
  | 'contact';

export interface SectionConfig {
  id: string;
  type: SectionType;
  /** Nav label. */
  label: string;
  /** Section heading; may contain <em> for the accent phrase. Absent on the hero. */
  title?: string;
  lede?: string;
  /** Layouts this section's component supports; the first is the default. */
  variants?: string[];
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  props: Record<string, any>;
}

export const RESUME_URL = '/Prajwal%20Hebbar%20-%20Resume.pdf';

export const site: { $schema: string; sections: SectionConfig[] } = {
  $schema: 'portfolio.config/v1',
  sections: [
    {
      id: 'hero',
      type: 'hero',
      label: 'Top',
      props: {
        status: profile.status,
        headline: 'I build software that renders from <em>configuration</em>.',
        lede: 'Senior Full-Stack Engineer with nearly five years of experience. I take products from the first client conversation to production: React and TypeScript interfaces, Node.js APIs, SQL databases, authentication, and the Docker and CI/CD pipelines that ship them.',
        claim: 'This page works the same way. Every section is one entry in a config file: inspect it, switch its variant, or move it.',
        actions: [
          { label: 'Run the form engine', href: '#engine', primary: true },
          { label: 'Résumé (PDF)', href: RESUME_URL, external: true },
        ],
        links: [
          { label: 'GitHub', href: profile.github },
          { label: 'LinkedIn', href: profile.linkedin },
        ],
      },
    },
    {
      id: 'engine',
      type: 'form-demo',
      label: 'Proof',
      title: 'A form engine, <em>running here</em>.',
      lede: 'What I build at work, at small scale: one JSON schema drives the fields, the visibility rules, the derived values and the maker-checker workflow. Change the input, the persona or the schema and watch the engine respond.',
      props: {
        schema: 'src/config/demo-form.ts',
        engine: 'src/lib/form-engine.ts',
        disclaimer: 'Written for this site. It shows the architecture, not LYIK code.',
      },
    },
    {
      id: 'evolution',
      type: 'evolution',
      label: 'Evolution',
      title: 'One platform, <em>three generations</em>.',
      lede: 'The LYIK forms platform, from the first schema-driven app to a configurable multi-tenant product. Each generation moved more of the product out of code and into configuration.',
      props: { generations: evolution },
    },
    {
      id: 'experience',
      type: 'timeline',
      label: 'Experience',
      title: 'Nearly five years of <em>shipped</em> enterprise systems.',
      variants: ['detailed', 'compact'],
      props: { entries: experiences.map(({ locationIcon: _icon, ...entry }) => entry) },
    },
    {
      id: 'projects',
      type: 'projects',
      label: 'Projects',
      title: 'Local-first apps, <em>shipped and installable</em>.',
      variants: ['tabs', 'list'],
      props: { items: projects },
    },
    {
      id: 'skills',
      type: 'skills',
      label: 'Skills',
      title: 'One engineer, the <em>whole stack</em>.',
      variants: ['grid', 'list'],
      props: { groups: skillGroups.map(({ title, skills }) => ({ title, skills })) },
    },
    {
      id: 'about',
      type: 'about',
      label: 'About',
      title: 'I own products <em>end to end</em>.',
      props: {
        bio: [
          'I work mainly in TypeScript: <b>React and Next.js</b> interfaces, <b>Node.js APIs</b> with <b>PostgreSQL and SQLite</b> behind them, and Docker, Nginx and GitHub Actions to ship. At <b>LYIK Technologies</b>, where I was recently promoted to Senior Engineer, I started v1 of the forms platform, led the v2 rewrite, and now build v3.',
          'The part I care about most is ownership: <b>gathering requirements directly from customers</b>, aligning backend, QA and product, and <b>mentoring</b> the people who build on top of my work. Outside work I ship local-first desktop and mobile apps, and I am building a central authentication service on ZITADEL and PostgreSQL.',
        ],
        capabilities: capabilities.map(({ title, proof }) => ({ title, proof })),
        facts: [
          { key: 'impact', value: '30%+ efficiency gains delivered through client-facing platform development' },
          { key: 'education', value: `${profile.education}, ${profile.educationSchool}` },
          { key: 'languages', value: profile.languages.join(', ') },
          { key: 'location', value: profile.location },
        ],
      },
    },
    {
      id: 'contact',
      type: 'contact',
      label: 'Contact',
      title: 'Let’s build something <em>effortless</em>.',
      lede: 'Open to senior full-stack and frontend roles across React, Node.js and TypeScript. I usually reply within a day.',
      props: {
        channels: [
          { key: 'email', value: profile.email, href: `mailto:${profile.email}` },
          { key: 'phone', value: profile.phone, href: `tel:${profile.phoneHref}` },
          { key: 'linkedin', value: profile.linkedinLabel, href: profile.linkedin },
          { key: 'github', value: profile.githubLabel, href: profile.github },
        ],
      },
    },
  ],
};
