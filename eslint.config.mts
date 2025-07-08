import withNuxt from './.nuxt/eslint.config.mjs';

import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import stylistic from '@stylistic/eslint-plugin';
import stylisticJsx from '@stylistic/eslint-plugin-jsx';
import vueEslintParser from 'vue-eslint-parser';

// 支持 .vue 里的 ts/tsx
configureVueProject({ scriptLangs: ['ts', 'tsx'] });

export default withNuxt(
  ...(defineConfigWithVueTs(
    {
      name: 'app/files-to-lint',
      files: [
        '**/*.{ts,mts,tsx,js,mjs,cjs,cts,vue}',
        'server/**/*.{ts,js}',
        'composables/**/*.{ts,js}',
        'plugins/**/*.{ts,js}',
        'app.config.{ts,js}',
        'nuxt.config.{ts,js,mjs}',
      ],
    },

    globalIgnores([
      '**/dist/**',
      '**/.output/**', // Nuxt 3 build output
      '**/dist-ssr/**',
      '**/coverage/**',
    ]),

    // 扩展 Nuxt + 浏览器全局
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
          $fetch: 'readonly',
          defineNuxtConfig: 'readonly',
          useState: 'readonly',
          useFetch: 'readonly',
          useAsyncData: 'readonly',
          useRuntimeConfig: 'readonly',
          // 其他 Nuxt helpers 可按需添加
        },
      },
    },

    pluginVue.configs['flat/essential'],
    {
      files: ['**/*.vue'],
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: { parser: tseslint.parser },
      },
      rules: {
        'vue/multi-word-component-names': ['error', { ignores: ['index'] }],
      },
    },
    vueTsConfigs.recommended,
    skipFormatting,
    tseslint.configs.recommended,
    // 针对 .vue 文件用 ts parser
    {
      files: ['**/*.vue'], languageOptions: {
        parser: vueEslintParser,
        parserOptions: { parser: tseslint.parser },
      },
    },
    stylisticJsx.configs.all,
    stylistic.configs.customize({
      indent: 2,
      quotes: 'single',
      semi: true,
      jsx: true,
      braceStyle: '1tbs',
      arrowParens: true,
    },
    ),
  ) as unknown as ResolvableFlatConfig[]),
);
