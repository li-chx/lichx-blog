<script setup lang="ts">

import { DataAnomaly, toArticleMetaDataType } from '~/types/ArticleMetaData';
import type { ArticleMetaData } from '~/types/ArticleMetaData';

const props = withDefaults(defineProps<{
  article?: ArticleMetaData;
}>(),
{
  article: () => toArticleMetaDataType({
    id: 'default ID',
    title: 'ApiFox / Postman 使用WebSocket连接SignalR进行测试需要注意的小问题',
    description: 'default Description',
    created_at: new Date('2025-01-01T00:00:00Z'), // 默认创建时间
    published_at: new Date('2025-01-01T00:01:00Z'), // 默认发布时间
    draft: true,
    updated_at: [new Date('2025-01-01T00:02:00Z'), new Date('2025-01-01T00:03:00Z')], // 默认更新时间
    tags: ['C#', 'TS', 'Windows Professional version with Webstorm 2025'],
    tech_stack: new Map([
      ['Vue', 5],
      ['Nuxt', 3],
      ['TypeScript', 4],
      ['JavaScript', 2],
      ['CSS', 1],
      ['HTML', 1],
      ['Node.js', 2],
      ['Python', 3],
      ['Java', 2],
      ['C#', 1],
    ]),
  }),
});

function dateFormat(date: Date | DataAnomaly) {
  if (date === DataAnomaly.DataNotFound || date === DataAnomaly.Invalid) {
    return date;
  }
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// const { colorMode } = storeToRefs(useColorModeStore());
// console.log(props.article.tech_stack)

function getCostTime(length: number | DataAnomaly) {
  if (length === DataAnomaly.DataNotFound || length === DataAnomaly.Invalid) {
    return length;
  }
  let time = length / 250;
  time = Math.ceil(time);
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else {
    return `${minutes}分钟`;
  }
}
</script>

<template>
  <div class="p-5 light:bg-old-neutral-200 dark:bg-old-neutral-800 min-h-64">
    <div class="text-4xl">
      {{ props.article.title }}
    </div>
    <div class="flex items-center mt-2">

      <div title="发布时间" class="flex items-center">
        <Icon name="lucide:clock-arrow-up"/>
        <div class="ml-1">
          {{ dateFormat(props.article.published_at) }}&nbsp;
        </div>
      </div>

      <div title="字数" class="flex items-center ml-2">
        <Icon name="fluent:text-word-count-20-filled"/>
        <div class="ml-1 inline">
          {{ props.article.word_count }}字
        </div>
      </div>

      <div title="预计阅读时间" class="flex items-center ml-2">
        <Icon name="octicon:stopwatch-16"/>
        <div class="ml-1 inline">
          {{ getCostTime(props.article.word_count) }}
        </div>
      </div>

    </div>
    <div class="flex mt-2 justify-between h-28">
      <div>
        <div class="">
          {{ props.article.description }}
        </div>
      </div>
      <TechStackCard
          :async-key="props.article.id"
          :tech-stack="props.article.tech_stack"
          :tech-stack-icon-names="props.article.tech_stack_icon_names"
          :tech-stack-theme-colors="props.article.tech_stack_theme_colors"
          :tech-stack-percent="props.article.tech_stack_percent"
          class="w-64"
      />
    </div>
    <hr/>
    <div class="flex mt-2">
      <div title="创建时间" class="flex items-center">
        <Icon name="lucide:file-clock"/>
        <div class="ml-1">{{ dateFormat(props.article.created_at) }}</div>
      </div>
      <div v-if="Array.isArray(props.article.updated_at)" class="flex items-center ml-2">
        <Icon name="lucide:clock-alert" title="上次更新时间"/>
        <HoverContent>
          <template #content>
            <div class="ml-1">
              {{ dateFormat(props.article.updated_at[props.article.updated_at.length - 1]) }}
            </div>
          </template>
          <template #hoverContent>
            <div class="p-1 pr-2">
              <div v-for="(date,index) of props.article.updated_at" :key="index">
                <div class="block whitespace-nowrap">
                  &nbsp;{{ '第' + index + '次更新' + dateFormat(date) }}
                </div>
              </div>
            </div>
          </template>
        </HoverContent>

      </div>
    </div>
    <div v-if="Array.isArray(props.article.tags)" class="flex items-center">
      <Icon name="clarity:tags-solid"/>
      <div v-for="(tag,index) of props.article.tags" :key="index">
        <div class="ml-1">{{ tag }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
