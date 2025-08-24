// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/content',
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      script: [{ src: '/darkVerify.js' }],
    },
  },
  sourcemap: {
    server: true,
    client: true,
  },
});
