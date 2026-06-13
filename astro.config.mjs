// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Static pages by default; the AI assistant endpoint (src/pages/api/chat.ts)
// opts into server rendering via `export const prerender = false`, so it runs
// on-demand through the Node adapter while everything else is prerendered.
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
});
