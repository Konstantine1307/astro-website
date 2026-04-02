import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import react from '@astrojs/react';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const packagesDir = fileURLToPath(new URL('../packages', import.meta.url));

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@ui': path.join(packagesDir, 'ui'),
      },
    },
    server: {
      fs: {
        allow: [projectRoot, packagesDir],
      },
    },
  },
});
