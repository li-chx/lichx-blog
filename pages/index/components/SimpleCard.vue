<script setup lang="ts">

import { DataAnomaly, defaultMetaData } from '~/types/PostMetaData';
import type { PostMetaData } from '~/types/PostMetaData';
import useColorModeStore from '~/stores/colorModeStore';

const props = withDefaults(defineProps<{
  metaData?: PostMetaData;
}>(),
{
  metaData: () => defaultMetaData,
});
const { data: rawbody } = useAsyncData('simpleCard:' + props.metaData.id, async () => (await queryCollection('content').where('id', '=', props.metaData.id).first())?.rawbody);
const collapsed = ref(true);
const typeChinese = new Map<string, string>([
  ['rambling', '絮语'],
  ['announcement', '公告'],
]);

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

const safeEditorId = computed(() => {
  const encoded = btoa(encodeURIComponent(props.metaData.id))
    .replace(/[+/=]/g, '_'); // 替换 Base64 中的特殊字符
  return `rambling_${encoded}`;
});

const showLightShadow = ref(false);
const showDarkShadow = ref(false);

function reverseCollapsed() {
  if (collapsed.value) {
    collapsed.value = false;
    return;
  }
  const showLight = showLightShadow.value;
  const showDark = showDarkShadow.value;
  showLightShadow.value = false;
  showDarkShadow.value = false;
  collapsed.value = true;
  setTimeout(() => {
    showLightShadow.value = showLight;
    showDarkShadow.value = showDark;
  }, 500);
}

const colorModeStore = useColorModeStore();
let colorModeCallBackKey = '';
onMounted(() => {
  if (colorModeStore.colorMode === 'light') {
    showLightShadow.value = true;
  } else {
    showDarkShadow.value = true;
  }
  colorModeCallBackKey = colorModeStore.registerCallBack(() => {
    if (colorModeStore.colorMode === 'light') {
      setTimeout(() => {
        showLightShadow.value = true;
      }, 500);
      showDarkShadow.value = false;
    } else {
      showLightShadow.value = false;
      setTimeout(() => {
        showDarkShadow.value = true;
      }, 500);
    }
  });
});
onUnmounted(() => {
  colorModeStore.unregisterCallBack(colorModeCallBackKey);
});
</script>

<template>
  <div
      class="p-5 light:bg-old-neutral-200 dark:bg-old-neutral-800 min-h-64 transition-all duration-500"
      @click="reverseCollapsed">
    <div class="text-4xl">
      {{ (typeChinese.get(metaData.type) || 'unknown Type') + '：' }}{{ props.metaData.title }}
    </div>
    <div class="flex items-center mt-2 max-w-[400px] overflow-hidden">

      <div title="发布时间" class="flex items-center">
        <Icon name="lucide:clock-arrow-up"/>
        <div class="ml-1 text-nowrap">
          {{ dateFormat(props.metaData.published_at) }}
        </div>
      </div>

      <div title="分类" class="flex items-center ml-2">
        <Icon name="material-symbols:category"/>
        <div class="ml-1 text-nowrap">
          {{ props.metaData.category }}
        </div>
      </div>

      <div title="字数" class="flex items-center ml-2">
        <Icon name="fluent:text-word-count-20-filled"/>
        <div class="ml-1 text-nowrap">
          {{ props.metaData.word_count }}字
        </div>
      </div>

      <div title="预计阅读时间" class="flex items-center ml-2">
        <Icon name="octicon:stopwatch-16"/>
        <div class="ml-1 text-nowrap">
          {{ getCostTime(props.metaData.word_count) }}
        </div>
      </div>

      <div v-if="metaData.isPinned" class="flex items-center ml-2">
        <Icon name="codicon:pinned"/>
        <div class="ml-1 text-nowrap">
          置顶
        </div>
      </div>

    </div>
    <div
        class="relative flex mt-2 justify-between overflow-hidden transition-all duration-300 ease-in-out min-h-[8.5rem]"
        :class="{'max-h-[8.5rem]' : collapsed, 'max-h-[100vh]':!collapsed}">
      <ReadonlyMdEditor
          v-if="rawbody" :editor-id="safeEditorId" :markdown="rawbody!"
          class="transition-all duration-500 w-full"/>
      <div
          class="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-old-neutral-200 to-transparent pointer-events-none transition-opacity duration-300"
          :class="collapsed&&showLightShadow?'opacity-100':'opacity-0'"
      />
      <div
          class="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-old-neutral-800  to-transparent pointer-events-none transition-opacity duration-300"
          :class="collapsed&&showDarkShadow?'opacity-100':'opacity-0'"
      />
    </div>
    <hr/>
    <div class="flex mt-2">
      <div title="创建时间" class="flex items-center">
        <Icon name="lucide:file-clock"/>
        <div class="ml-1">{{ dateFormat(props.metaData.created_at) }}</div>
      </div>
      <div v-if="Array.isArray(props.metaData.updated_at)" class="flex items-center ml-2">
        <Icon name="lucide:clock-alert" title="上次更新时间"/>
        <HoverContent>
          <template #content>
            <div class="ml-1">
              {{ dateFormat(props.metaData.updated_at[props.metaData.updated_at.length - 1]) }}
            </div>
          </template>
          <template #hoverContent>
            <div class="p-1 pr-2">
              <div v-for="(date,index) of props.metaData.updated_at" :key="index">
                <div class="block whitespace-nowrap">
                  &nbsp;{{ '第' + index + '次更新' + dateFormat(date) }}
                </div>
              </div>
            </div>
          </template>
        </HoverContent>
      </div>
    </div>
  </div>
</template>
