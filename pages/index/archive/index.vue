<script setup lang="ts">
import { toMetaDataType } from '~/types/PostMetaData';
import TimeLine from '~/pages/index/archive/components/TimeLine.vue';

const { data: articles } = useAsyncData(async () => (await queryCollection('content').order('published_at', 'DESC').all()).map((article) => toMetaDataType(article)));

const currentChoice = ref('时间');

// onMounted(() => {
//   setTimeout(() => {
//     console.log(articles.value);
//   }, 2000);
// });

</script>
<template>
  <div>
    <div class="table w-full mt-6">
      <div class="sticky top-16 float-left bg-old-neutral-200 dark:bg-old-neutral-800 max-h-[calc(100vh-4rem)]">
        <div class="relative duration-500 transition-all xl:w-80 w-0 mr-2/3 overflow-hidden">
          <div class="w-80 top-0 left-0 text-gray-800 dark:text-white p-5">
            test123456
          </div>
        </div>
      </div>
      <div
          class="transition-all duration-500 float-right xl:w-[calc(100%-20rem-40px)] w-full bg-old-neutral-200 dark:bg-old-neutral-800 p-5">
        <URadioGroup
            v-model="currentChoice" orientation="horizontal" variant="table" :items="['时间', '类别']" size="sm"
            class="mb-5"/>
        <TimeLine v-if="articles" v-model:articles="articles!" :current-choice="currentChoice=== '时间'? 'time' : 'category'"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
