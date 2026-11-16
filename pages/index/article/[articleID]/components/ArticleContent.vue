<script setup lang="ts">
import type { Collections } from '@nuxt/content';
import ProsePre from '~/components/theme/classic/markdown/ProsePre.vue';
import ProseCode from '~/components/theme/classic/markdown/ProseCode.vue';

type Article = Collections['content'] & {};
defineProps<{
  article: Article | null | undefined;
  noPadding?: boolean;
}>();
const themeComponents = {
  classic: {
    pre: ProsePre,
    code: ProseCode,
  },
};
</script>

<template>
  <ContentRenderer
      v-if="article" class="px-6 pb-6 pt-0.5 bg-old-neutral-200 dark:bg-old-neutral-800" :value="article!"
      :class="{ 'p-0! [&_p]:m-0! [&_p]:leading-6': noPadding }"
      :components="themeComponents['classic']"/>
</template>

<style scoped>

</style>
