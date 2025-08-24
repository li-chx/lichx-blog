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
    <div class="table w-full mt-6">
      <div class="sticky top-16 float-left bg-old-neutral-200 dark:bg-old-neutral-800 max-h-[calc(100vh-4rem)]">
        <div class="relative duration-500 transition-all xl:w-80 w-0 mr-2/3 overflow-hidden">
          <div class="w-80 top-0 left-0 text-gray-800 dark:text-white p-5">
            <MdCatalog :editor-id="editorId" :scroll-element="'html'"/>
          </div>
        </div>
      </div>
      <div class="transition-all duration-500 float-right xl:w-[calc(100%-20rem-40px)] w-full">
        <ArticleHeader v-if="article" class="w-full" :article="toMetaDataType(article)"/>
<!--        <ArticleCard v-if="article" class=" w-full" :article="toArticleMetaDataType(article)"/>-->
        <ReadonlyMdEditor :editor-id="editorId" :markdown="article?.rawbody"/>
      </div>
    </div>
  </div>

</template>

<style scoped lang="less">

</style>
