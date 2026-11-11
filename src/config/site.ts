export const introduction = {
  greeting: 'Hello, I’m Prajwal.',
  headline: 'Thoughtful software,',
  accent: 'from end to end.',
  description: 'I’m a senior full-stack engineer turning complex workflows into software that feels simple. From the first conversation to the final deploy, I care about the whole thing.',
};

export const sections = [
  { id: 'intro', type: 'hero', label: 'Introduction', number: '01', title: '' },
  { id: 'projects', type: 'projects', label: 'Projects', number: '02', title: 'Small ideas. Real, useful things.' },
  { id: 'experience', type: 'experience', label: 'Experience', number: '03', title: 'Good work is a team sport.' },
  { id: 'about', type: 'about', label: 'About', number: '04', title: 'The person behind the commits.' },
  { id: 'contact', type: 'contact', label: 'Contact', number: '05', title: 'Have something in mind?' },
] as const;

export type Section = (typeof sections)[number];
