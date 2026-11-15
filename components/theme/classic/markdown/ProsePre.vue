<script setup lang="ts">
import DefaultProsePre from '@nuxt/ui/components/prose/Pre.vue';

const props = defineProps<{
  code?: string; // 原始代码文本（以后做"复制按钮"会用到）
  language?: string; // 语言，如 'ts'
  filename?: string; // 代码块文件名（如果 md 里写了）
  highlights?: number[];
  meta?: string;
}>();
</script>

<template>
  <MermaidDiagram v-if="props.language === 'mermaid'" :mermaid-code="props.code ?? ''" />
  <DefaultProsePre v-else v-bind="props" :ui="{base: 'bg-white dark:bg-old-neutral-700 border-gray-300 dark:border-old-neutral-700'}">
    <slot />
  </DefaultProsePre>
</template>
