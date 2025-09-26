// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
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
    fonts: false,
  },
  app: {
    head: {
      title: '随机存取',
      htmlAttrs: {
        lang: 'zh-CN',
      },
      meta: [
        { name: 'description', content: 'Lichx 个人博客' },
      ],
      script: [{ src: '/darkVerify.js' }],
    },
  },
  // sourcemap: {
  //   server: true,
  //   client: true,
  // },
});
