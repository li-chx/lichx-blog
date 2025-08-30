<script setup lang="ts">
import { sortMetaData, toMetaDataType } from '~/types/PostMetaData';
import type { PostMetaData } from '~/types/PostMetaData';
import TimeLine from '~/pages/index/archive/components/TimeLine.vue';
import type { RadioGroupItem } from '@nuxt/ui';

const { data: srcPostsMetaData } = useAsyncData(async () => sortMetaData((await queryCollection('content').all()).map((x) => toMetaDataType(x)), 'published_at', true));
const postsMetaData = ref<PostMetaData[]>([]);

const currentChoice = ref<'time' | 'category'>('time');

watch(srcPostsMetaData, () => {
  postsMetaData.value = srcPostsMetaData.value?.filter((x) => !x.draft) || [];
});

const choiceItems = ref<RadioGroupItem>([
  { label: '时间', value: 'time' },
  { label: '类别', value: 'category' },
]);

</script>
<template>
  <div>
    <div class="table w-full mt-6">
      <div class="sticky top-16 float-left bg-old-neutral-200 dark:bg-old-neutral-800 max-h-[calc(100vh-4rem)]">
        <div class="relative duration-500 transition-all xl:w-80 w-0 mr-2/3 overflow-hidden">
          <div class="w-80 top-0 left-0 text-gray-800 dark:text-white p-5">
            这里还没想好放什么
          </div>
        </div>
      </div>
      <div
          class="transition-all duration-500 float-right xl:w-[calc(100%-20rem-40px)] w-full bg-old-neutral-200 dark:bg-old-neutral-800 p-5">
        <URadioGroup
            v-model="currentChoice" orientation="horizontal" variant="table" :items="choiceItems as any[]" size="sm"
            class="mb-5"/>
        <TimeLine v-if="postsMetaData" v-model:metadata="postsMetaData" :current-choice="currentChoice"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
