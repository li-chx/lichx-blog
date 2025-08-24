<script setup lang="ts">

import { DataAnomaly, defaultMetaData } from '~/types/PostMetaData';
import type { PostMetaData } from '~/types/PostMetaData';
import breakpointsHelper from '~/utils/BreakpointsHelper';

const props = withDefaults(defineProps<{
  article?: PostMetaData;
}>(),
{
  article: () => defaultMetaData,
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
  <div class="p-5 light:bg-old-neutral-200 dark:bg-old-neutral-800 min-h-64 transition-all duration-500">
    <div class="text-4xl">
      {{ props.article.title }}
    </div>
    <div class="flex items-center mt-2 max-w-96 overflow-hidden">

      <div title="发布时间" class="flex items-center">
        <Icon name="lucide:clock-arrow-up"/>
        <div class="ml-1 text-nowrap">
          {{ dateFormat(props.article.published_at) }}
        </div>
      </div>

      <div title="分类" class="flex items-center ml-2">
        <Icon name="material-symbols:category"/>
        <div class="ml-1 text-nowrap">
          {{ props.article.category }}
        </div>
      </div>

      <div title="字数" class="flex items-center ml-2">
        <Icon name="fluent:text-word-count-20-filled"/>
        <div class="ml-1 text-nowrap">
          {{ props.article.word_count }}字
        </div>
      </div>

      <div title="预计阅读时间" class="flex items-center ml-2">
        <Icon name="octicon:stopwatch-16"/>
        <div class="ml-1 text-nowrap">
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
      <Transition
          enter-active-class="transition-opacity duration-500 ease-in-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-500 ease-in-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <TechStackCard
            v-if="breakpointsHelper.greater('lg').value"
            :async-key="'stack:' + props.article.id"
            :tech-stack="props.article.tech_stack"
            :tech-stack-icon-names="props.article.tech_stack_icon_names"
            :tech-stack-theme-colors="props.article.tech_stack_theme_colors"
            :tech-stack-percent="props.article.tech_stack_percent"
            class="w-64"
        />
      </Transition>

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
    <div v-if="Array.isArray(props.article.tags)" class="flex items-top">
      <Icon name="clarity:tags-solid" class="mt-1"/>
      <div>
        <div v-for="(tag,index) of props.article.tags" :key="index" class="inline-block">
          <div class="ml-1 inline">{{ tag }}</div>
          <div v-if="index !== props.article.tags.length - 1" class="inline">,</div>
        </div>
      </div>
    </div>
  </div>
</template>
