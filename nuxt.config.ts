// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
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
    '@vueuse/nuxt',
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
  icon: {
    provider: 'server',
    serverBundle: 'local',

    fallbackToApi: true,

    clientBundle: {
      scan: true,
      icons: [],
    },
  },
  // sourcemap: {
  //   server: true,
  //   client: true,
  // },
});
