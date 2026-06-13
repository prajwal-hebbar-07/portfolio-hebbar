// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Static pages by default; the AI assistant endpoint (src/pages/api/chat.ts)
// opts into server rendering via `export const prerender = false`, so it runs
// as a Vercel Function while everything else is prerendered.
export default defineConfig({
  output: 'static',
  adapter: vercel(),
});
