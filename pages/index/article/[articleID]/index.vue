<script setup lang="ts">
import { toMetaDataType } from '~/types/PostMetaData';
import ArticleHeader from '~/pages/index/article/[articleID]/components/ArticleHeader.vue';
import ArticleToc from './components/ArticleToc.vue';
import ArticleContent from '~/pages/index/article/[articleID]/components/ArticleContent.vue';

const articleId = useRoute().params.articleID as string;
const { data: article } = useAsyncData(async () => await queryCollection('content').where('id', '=', articleId).first());

</script>

<template>
  <div>
    <div class="table w-full mt-6 mb-6 table-fixed">
      <div class="sticky top-16 float-left bg-old-neutral-200 dark:bg-old-neutral-800 max-h-[calc(100vh-4rem)]">
        <div class="relative duration-500 transition-[width] xl:w-80 w-0 mr-2/3 overflow-hidden">
          <div class="w-80 top-0 left-0 text-gray-800 dark:text-white p-5">
            <div class="text-3xl mb-2">目录</div>
            <ArticleToc :links="article?.body?.toc?.links ?? []" />
          </div>
        </div>
      </div>
      <div class="transition-[width] duration-500 float-right xl:w-[calc(100%-20rem-40px)] w-full max-w-full">
        <ArticleHeader v-if="article" class="w-full" :meta-data="toMetaDataType(article)"/>
        <ArticleContent :article="article"/>
      </div>
    </div>
  </div>

</template>

<style scoped lang="less">

</style>
