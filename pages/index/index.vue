<script setup lang="ts">

import { sortMetaData, toMetaDataType } from '~/types/PostMetaData';
import type { PostMetaData } from '~/types/PostMetaData';
import SimpleCard from '~/pages/index/components/SimpleCard.vue';
import ArticleCard from '~/pages/index/components/ArticleCard.vue';

const srcPostsMetaData = ref<PostMetaData[]>([]);
const postsMetaData = ref<PostMetaData[]>([]);

async function loadPostsMetaData() {
  srcPostsMetaData.value = sortMetaData((await queryCollection('content').all()).map((x) => toMetaDataType(x)), 'published_at', true) || [];
  postsMetaData.value = srcPostsMetaData.value;
}

await loadPostsMetaData();

function toArticlePage(article: PostMetaData) {
  navigateTo(`/article/${encodeURIComponent(article.id)}`);
}

watch(srcPostsMetaData, () => {
  postsMetaData.value = srcPostsMetaData.value || [];
});

function filterRuleChange(rule: (data: PostMetaData) => boolean) {
  postsMetaData.value = (srcPostsMetaData.value || []).filter(rule);
}
</script>

<template>
  <div>
    <div class="table w-full mt-6 table-fixed">
      <div class="sticky top-16 float-left max-h-[calc(100vh-4rem)]">
        <div class="relative duration-500 transition-all xl:w-80 w-0 overflow-hidden">
          <div class="w-80 top-0 left-0 text-gray-800 dark:text-white">
<!--            <PersonalCard/>-->
            <ArticleDescriptionCards
                v-if="postsMetaData"
                class="mb-5" :posts-meta-data="srcPostsMetaData!"
                @filter-rule-change="filterRuleChange"/>
          </div>
        </div>
      </div>
      <div class="transition-all duration-500 float-right xl:w-[calc(100%-20rem-40px)] w-full">
        <!--        <ArticleCard class="mb-6 w-full transition-shadow duration-300 shadow-lg hover:shadow-old-neutral-600"/>-->
        <div
            v-for="post in postsMetaData" :key="post.id"
            class="mb-6 w-full transition-shadow duration-300 shadow-lg hover:shadow-old-neutral-600 hover:cursor-pointer">
          <ArticleCard
              v-if="!post.draft && post.type === 'article'"
              class="w-full"
              :meta-data="post"
              @click="toArticlePage(post)"/>
          <SimpleCard
              v-else-if="!post.draft && (post.type === 'rambling' || post.type === 'announcement')"
              :meta-data="post"/>
        </div>
      </div>
    </div>
  </div>
</template>
