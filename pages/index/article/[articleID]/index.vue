<script setup lang="ts">
import { toMetaDataType } from '~/types/PostMetaData';
import { MdCatalog } from 'md-editor-v3';
import ArticleHeader from '~/pages/index/article/[articleID]/components/ArticleHeader.vue';

const articleId = useRoute().params.articleID as string;
const { data: article } = useAsyncData(async () => await queryCollection('content').where('id', '=', articleId).first());

const editorId = 'article-previewer';
</script>

<template>
  <div>
    <div class="table w-full mt-6 mb-6 table-fixed">
      <div class="sticky top-16 float-left bg-old-neutral-200 dark:bg-old-neutral-800 max-h-[calc(100vh-4rem)] transition-colors duration-500">
        <div class="relative duration-500 transition-all xl:w-80 w-0 mr-2/3 overflow-hidden">
          <div class="w-80 top-0 left-0 text-gray-800 dark:text-white p-5 transition-colors duration-500">
            <div class="text-3xl mb-2">目录</div>
            <MdCatalog :editor-id="editorId" :scroll-element="'html'" class=""/>
          </div>
        </div>
      </div>
      <div class="transition-all duration-500 float-right xl:w-[calc(100%-20rem-40px)] w-full max-w-full">
        <ArticleHeader v-if="article" class="w-full" :meta-data="toMetaDataType(article)"/>
<!--        <ArticleCard v-if="article" class=" w-full" :article="toArticleMetaDataType(article)"/>-->
        <ReadonlyMdEditor :editor-id="editorId" :markdown="article?.rawbody" class="p-5 max-w-full"/>
      </div>
    </div>
  </div>

</template>

<style scoped lang="less">

</style>
