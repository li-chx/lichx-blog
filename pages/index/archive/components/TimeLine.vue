<script setup lang="ts">
import { DataAnomaly, sortMetaData } from '~/types/PostMetaData';
import type { PostMetaData } from '~/types/PostMetaData';

const articles = defineModel<PostMetaData[]>('metadata', {
  default: () => [],
});

const props = withDefaults(defineProps<{
  currentChoice?: 'time' | 'category';
}>(),
{
  currentChoice: 'time' as ('time' | 'category'),
});

watch(() => props.currentChoice, (newChoice) => {
  if (newChoice === 'time') {
    sortMetaData(articles.value, 'published_at');
  } else {
    sortMetaData(articles.value, 'category');
  }
}, { immediate: true });

function toArticlePage(article: PostMetaData) {
  navigateTo(`/article/${encodeURIComponent(article.id)}`);
}

function getYear(article: PostMetaData) {
  return new Date(article?.published_at || 0).getFullYear();
}

function dateFormatToTime(date: Date | DataAnomaly) {
  if (date === DataAnomaly.DataNotFound || date === DataAnomaly.Invalid) {
    return date;
  }
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function dateFormatToDate(date: Date | DataAnomaly) {
  if (date === DataAnomaly.DataNotFound || date === DataAnomaly.Invalid) {
    return date;
  }
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-');
}
</script>

<template>
  <div>
    <div
        v-for="(article,index) of articles" :key="article.id"
        class="border-l-2 border-l-old-neutral-400 dark:border-l-old-neutral-500 pl-4">
<!--      <Transition-->
<!--          enter-active-class="transition-opacity duration-500 ease-in-out"-->
<!--          enter-from-class="opacity-0"-->
<!--          enter-to-class="opacity-100"-->
<!--          leave-active-class="transition-opacity duration-500 ease-in-out"-->
<!--          leave-from-class="opacity-100"-->
<!--          leave-to-class="opacity-0"-->
<!--      >-->
        <div
            v-if="currentChoice==='time' && (index == 0 || getYear(article) != getYear(articles[index-1]))"
            class="year-marker relative text-indigo-300 text-2xl pt-3 pb-3">
          {{ getYear(article) }}
        </div>
        <div
            v-else-if="currentChoice==='category' && (index == 0 || article.category != articles[index-1].category)"
            class="year-marker relative text-indigo-300 text-2xl pt-3 pb-3">
          {{ article.category }}
        </div>
<!--      </Transition>-->
      <div class="flex items-center" @click="toArticlePage(article)">
        <div :title="dateFormatToTime(article.published_at)" class="text-sm w-12">
          {{ dateFormatToDate(article.published_at) }}
        </div>
        <div :title="dateFormatToTime(article.published_at)" class="text-md pl-5">
          {{ article.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.year-marker::before {
  content: '';
  position: absolute;
  width: 12px; // w-3
  height: 12px; // h-3
  background-color: #000;
  border-radius: 9999px; // rounded-full
  border: 2px solid black; // border-2 border-black
  left: -17px; // pl-3 12px + 1px border
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  transition: background-color 0.5s, border-color 0.5s;
}

.dark .year-marker::before {
  background-color: #fff;
  border: 2px solid white; // border-2 border-white
}
</style>
