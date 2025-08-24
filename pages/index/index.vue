<script setup lang="ts">

import { toMetaDataType } from '~/types/PostMetaData';
import RamblingCard from '~/pages/index/components/RamblingCard.vue';
import ArticleCard from '~/pages/index/components/ArticleCard.vue';

const { data: posts } = useAsyncData(async () => await queryCollection('content').order('published_at', 'DESC').all());

// onMounted(() => {
//   setTimeout(() => {
//     console.log(articles.value);
//   }, 2000);
// });
type PostItem = NonNullable<typeof posts.value>[number];

function toArticlePage(article: PostItem) {
  navigateTo(`/article/${encodeURIComponent(article.id)}`);
}

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
      <div class="transition-all duration-500 float-right xl:w-[calc(100%-20rem-40px)] w-full">
        <ArticleCard class="mb-6 w-full transition-shadow duration-300 shadow-lg hover:shadow-old-neutral-600"/>
        <div v-for="article in posts" :key="article.id" class="mb-6 w-full transition-shadow duration-300 shadow-lg hover:shadow-old-neutral-600 hover:cursor-pointer">
          <ArticleCard
              v-if="!article.draft && article.type === 'article'"
              :article="toMetaDataType(article)"
              @click="toArticlePage(article)"/>
          <RamblingCard
              v-else-if="!article.draft && article.type === 'rambling'"
              :rambling="toMetaDataType(article)"/>
        </div>
      </div>
    </div>
  </div>
</template>
