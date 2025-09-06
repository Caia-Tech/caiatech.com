// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { datasetFetcher } from './src/integrations/dataset-fetcher.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://caiatech.com',
  output: 'static',
  integrations: [
    datasetFetcher(),
    sitemap({
      filter: (page) => page !== 'https://caiatech.com/api/',
      customPages: [
        'https://caiatech.com/',
        'https://caiatech.com/about/',
        'https://caiatech.com/contact/',
        'https://caiatech.com/privacy/',
        'https://caiatech.com/terms/',
        'https://caiatech.com/constitution',
      ],
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
        },
      },
    })
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
