<script setup lang="ts">
import type { PostMetaData } from '~/types/PostMetaData';

const props = withDefaults(defineProps<{
  postsMetaData?: PostMetaData[];
}>(), {
  postsMetaData: () => [],
});
const emits = defineEmits<{
  (event: 'filterRuleChange', rule: string): void;
}>();
const articleCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'article').length || 0);
const announcementCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'announcement').length || 0);
const ramblingCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'rambling').length || 0);
const countGroup = [
  { name: '文章', count: articleCount, type: 'article' },
  { name: '絮语', count: ramblingCount, type: 'rambling' },
  { name: '公告', count: announcementCount, type: 'announcement' },
];
const categories = computed(() => {
  const categoryMap = new Map<string, number>();
  props.postsMetaData?.forEach((post) => {
    if (post.category) {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
    }
  });
  return categoryMap;
});
let showType = '';

function ruleChange(name: string) {
  if (showType === name || name === '') {
    showType = '';
  } else {
    showType = name;
  }
  emits('filterRuleChange', showType);
}
</script>

<template>
  <div class="transition-colors duration-500">
    <div>
      <div v-if="showType === ''" class="flex">
        <div
            v-for="data of countGroup"
            :key="data.name"
            class="flex items-center flex-col flex-1 text-xl cursor-pointer hover:text-sky-300 dark:hover:text-[#cccaff] transition-colors duration-300"
            @click="ruleChange(data.type)"
        >
          <div>{{ data.name }}</div>
          <div>{{ data.count }}</div>
        </div>
      </div>
      <div v-else class="flex items-center hover:text-sky-300 dark:hover:text-[#cccaff] transition-colors duration-300" @click="ruleChange('')">
        <div class="flex-1 text-2xl flex items-center justify-center">
          <div>{{ countGroup.filter((x) => x.type === showType)[0].name }}</div>
        </div>
        <div class="flex-1 text-2xl flex items-center justify-center">
          <div class="pr-8">{{ countGroup.filter((x) => x.type === showType)[0].count }}</div>
        </div>
<!--        <Icon-->
<!--            name="mingcute:back-line" class="flex-1 text-5xl cursor-pointer dark:hover:text-[#cccaff] hover:text-sky-300 transition-colors duration-300"-->
<!--            @click="ruleChange('')"/>-->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
