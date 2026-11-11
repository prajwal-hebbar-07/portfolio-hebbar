export const profile = {
  name: 'Prajwal Hebbar',
  title: 'Senior Full-Stack Engineer',
  status: 'Available for opportunities',
  location: 'Bengaluru, India',
  email: 'prajwalhebbaras@gmail.com',
  phone: '+91 94839 24880',
  phoneHref: '+919483924880',
  github: 'https://github.com/prajwal-hebbar-07',
  linkedin: 'https://www.linkedin.com/in/prajwal-hebbar-a-s-a213b121a/',
  resume: '/Prajwal%20Hebbar%20-%20Resume.pdf',
};

export const projects = [
  {
    id: 'logbook', name: 'Logbook', category: 'MOBILE · DESKTOP · CLI',
    description: 'A little more clarity in your working day. Attendance, leave and reports, wherever you work.',
    repo: 'https://github.com/prajwal-hebbar-07/tracker-mobile',
    tech: ['Expo', 'Tauri', 'TypeScript', 'SwiftUI'],
    details: [
      'An Android app, Mac desktop widget and command-line tool share one platform-independent core for dates, leave, summaries and exports.',
      'The desktop app and CLI use one log file outside the app bundle. JSON backups move records between phone and desktop; CSV and Excel exports make reporting straightforward.',
      'A native WidgetKit widget reflects log changes, and signed releases ship through GitHub Actions.',
    ],
  },
  {
    id: 'prompt-burn', name: 'Prompt Burn', category: 'DESKTOP · VS CODE',
    description: 'Understand your AI usage. A private, local view of tokens and their estimated cost.',
    repo: 'https://github.com/prajwal-hebbar-07/prompt-burn',
    tech: ['Tauri', 'React', 'SQLite', 'TypeScript'],
    details: [
      'A desktop app and VS Code editor tab read OMP and Cursor usage into a shared local SQLite database. No account or cloud is involved.',
      'A bundled, versioned public rate table estimates comparable pay-as-you-go cost; these are estimates, not invoices. Unknown models show no estimate rather than a misleading zero.',
      'Provider usage allowances stay separate from cost estimates. Local refreshes keep previous results visible while new data loads.',
    ],
  },
  {
    id: 'ledgerflow', name: 'LedgerFlow', category: 'DESKTOP · LOCAL-FIRST',
    description: 'Your money, with a clearer picture. A personal expense tracker that keeps your data yours.',
    repo: 'https://github.com/prajwal-hebbar-07/ledger-flow',
    tech: ['Tauri', 'React', 'Rust', 'SQLite'],
    details: [
      'A local-first expense tracker for macOS, Windows and Linux with no account, server or sync.',
      'Transactions store positive integer amounts in minor units. Account balances and report figures are derived from the ledger, so stored running totals cannot drift.',
      'Optional Ollama integration categorises transactions and rewrites report prose; numbers always come from the ledger. Releases use signed automatic updates.',
    ],
  },
  {
    id: 'growthos', name: 'GrowthOS', category: 'DESKTOP · MOBILE',
    description: 'Make room for steady progress. Study plans, small daily steps and a record of what you’ve learned.',
    tech: ['Tauri', 'Expo', 'Rust', 'SQLite'],
    details: [
      'A local-first study-plan tracker for macOS, Android and iOS. Desktop and mobile clients share their learning model, validators and bundled courses.',
      'Dated task completions preserve the original day you finished. Streaks and totals are derived from that history.',
      'Optional Ollama chat and day summaries support reflection. Versioned backups merge completed work while retaining its dates, and reject unsupported newer formats.',
    ],
  },
];

export const experiences = [
  {
    company: 'LYIK Technologies', role: 'Senior Engineer', period: 'Apr 2023 — Present',
    note: 'Previously Enterprise Engineer · Promoted Apr 2026', current: true,
    description: 'Building enterprise software across the full stack, from customer requirements to production. Working with product, backend and QA teams, and mentoring junior engineers along the way.',
    tags: ['Enterprise software', 'Full-stack delivery', 'Client collaboration'],
  },
  {
    company: 'Content Enablers', role: 'Associate Web Developer', period: 'Mar 2022 — Mar 2023',
    note: 'Remote · Bengaluru', current: false,
    description: 'Helped revamp the company website with React and Bootstrap, and integrated analytics to give the team a clearer view of how people used it.',
    tags: ['React', 'Web development', 'Analytics'],
  },
];
