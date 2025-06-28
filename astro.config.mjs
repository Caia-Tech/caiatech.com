// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://caiatech.com',
  output: 'static',
  integrations: [
    sitemap()
  ],
  vite: {
    optimizeDeps: {
      include: ['schema-dts']
    },
    build: {
      cssMinify: true,
      minify: 'esbuild'
    }
  },
  compressHTML: true
});
