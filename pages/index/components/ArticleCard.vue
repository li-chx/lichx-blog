<script setup lang="ts">

import { DataAnomaly, defaultMetaData } from '~/types/PostMetaData';
import type { PostMetaData } from '~/types/PostMetaData';
import breakpointsHelper from '~/utils/BreakpointsHelper';

withDefaults(defineProps<{
  metaData?: PostMetaData;
}>(),
{
  metaData: () => defaultMetaData,
});

function dateFormat(date: Date | DataAnomaly | undefined) {
  if (!date) {
    return 'date undefined';
  }
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

function getCostTime(length: number | DataAnomaly | undefined) {
  if (!length) {
    return 'length undefined';
  }
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
      {{ metaData?.title }}
    </div>
    <div class="flex items-center mt-2 max-w-96 overflow-hidden">

      <div title="发布时间" class="flex items-center">
        <Icon name="lucide:clock-arrow-up"/>
        <div class="ml-1 text-nowrap">
          {{ dateFormat(metaData?.published_at) }}
        </div>
      </div>

      <div title="分类" class="flex items-center ml-2">
        <Icon name="material-symbols:category"/>
        <div class="ml-1 text-nowrap">
          {{ metaData?.category }}
        </div>
      </div>

      <div title="字数" class="flex items-center ml-2">
        <Icon name="fluent:text-word-count-20-filled"/>
        <div class="ml-1 text-nowrap">
          {{ metaData?.word_count }}字
        </div>
      </div>

      <div title="预计阅读时间" class="flex items-center ml-2">
        <Icon name="octicon:stopwatch-16"/>
        <div class="ml-1 text-nowrap">
          {{ getCostTime(metaData?.word_count) }}
        </div>
      </div>

      <div v-if="metaData?.isPinned" class="flex items-center ml-2">
        <Icon name="codicon:pinned"/>
        <div class="ml-1 text-nowrap">
          置顶
        </div>
      </div>

    </div>
    <div class="flex mt-2 justify-between h-28">
        <div class="overflow-y-auto">
          {{ metaData?.description }}
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
            :async-key="'stack:' + metaData?.id"
            :tech-stack="metaData?.tech_stack"
            :tech-stack-icon-names="metaData?.tech_stack_icon_names"
            :tech-stack-theme-colors="metaData?.tech_stack_theme_colors"
            :tech-stack-percent="metaData?.tech_stack_percent"
            class="min-w-64"
        />
      </Transition>

    </div>
    <hr/>
    <div class="flex mt-2">
      <div title="创建时间" class="flex items-center">
        <Icon name="lucide:file-clock"/>
        <div class="ml-1">{{ dateFormat(metaData?.created_at) }}</div>
      </div>
      <div v-if="Array.isArray(metaData?.updated_at)" class="flex items-center ml-2">
        <Icon name="lucide:clock-alert" title="上次更新时间"/>
        <HoverContent>
          <template #content>
            <div class="ml-1">
              {{ dateFormat(metaData?.updated_at[metaData?.updated_at.length - 1]) }}
            </div>
          </template>
          <template #hoverContent>
            <div class="p-1 pr-2">
              <div v-for="(date,index) of metaData?.updated_at" :key="index">
                <div class="block whitespace-nowrap">
                  &nbsp;{{ '第' + index + '次更新' + dateFormat(date) }}
                </div>
              </div>
            </div>
          </template>
        </HoverContent>

      </div>
    </div>
    <div v-if="Array.isArray(metaData?.tags)" class="flex items-top">
      <Icon name="clarity:tags-solid" class="mt-1"/>
      <div>
        <div v-for="(tag,index) of metaData?.tags" :key="index" class="inline-block">
          <div class="ml-1 inline">{{ tag }}</div>
          <div v-if="index !== metaData?.tags.length - 1" class="inline">,</div>
        </div>
      </div>
    </div>
  </div>
</template>
