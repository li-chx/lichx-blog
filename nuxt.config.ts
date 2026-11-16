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
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
        toc: {
          depth: 4,
          searchDepth: 4,
        },
      },
    },
  },
  icon: {
    provider: 'server',
    serverBundle: {
      remote: false,
      externalizeIconsJson: true,
    },

    fallbackToApi: true,

    clientBundle: {
      scan: true,
      icons: [],
    },
  },
});
