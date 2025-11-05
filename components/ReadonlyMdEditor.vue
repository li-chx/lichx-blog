<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import useColorModeStore from '~/stores/colorModeStore';

const props = withDefaults(defineProps<{
  editorId: string;
  markdown?: string;
}>(), {
  markdown: () => '## Hello World!',
});
const eraseHeaderMarkdown = computed(() => props.markdown.replace(/^---[\s\S]*?---\n?/, ''));

const { colorMode } = storeToRefs(useColorModeStore());

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

</script>

<template>
  <div class="pt-0 bg-old-neutral-200 dark:bg-old-neutral-800">
    <MdPreview
        v-if="mounted"
        :key="editorId + '-' + colorMode"
    :editor-id="editorId"
    :theme="colorMode"
    :model-value="eraseHeaderMarkdown"
    class="max-w-full"
    />
  </div>
</template>

<style scoped>
:deep(.md-editor) {
  --md-bk-color: #e5e5e5;
  --md-theme-heading-1-color: #fff;
  transition-property: all;
  transition-duration: 500ms;
  --tw-ease: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
}
:deep(.md-editor-preview blockquote) {
  transition-property: all;
  transition-duration: 500ms;
  --tw-ease: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
}

:deep(.md-editor-preview .md-editor-code .md-editor-code-head) {
  z-index: 5;
}

:deep(ul) {
  list-style-type: disc;
}

:deep(ol) {
  list-style-type: decimal;
}

:global(.dark .md-editor) {
  --md-bk-color: #262626;
  --md-theme-heading-1-color: #fff;
}
:global(.dark .md-editor-preview) {
  --md-color: var(--ui-text);
}

</style>
