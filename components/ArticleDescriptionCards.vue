<script setup lang="ts">
import type { PostMetaData } from '~/types/PostMetaData';

const props = withDefaults(defineProps<{
  postsMetaData?: PostMetaData[];
}>(), {
  postsMetaData: () => [],
});
const emits = defineEmits<{
  (event: 'filterRuleChange', rule: (data: PostMetaData) => boolean): void;
}>();
const articleCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'article').length || 0);
const announcementCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'announcement').length || 0);
const ramblingCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'rambling').length || 0);
const countGroup = [
  { name: '文章', count: articleCount, type: 'article' },
  { name: '絮语', count: ramblingCount, type: 'rambling' },
  { name: '公告', count: announcementCount, type: 'announcement' },
];
const categoryEnableStatus: Ref<boolean[]> = ref(Array(countGroup.length).fill(true));

const categories = computed(() => {
  const categoryMap = new Map<string, number>();
  props.postsMetaData?.forEach((post) => {
    if (post.category) {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
    }
  });
  let categoryArray = Array.from(categoryMap.entries());
  categoryArray = categoryArray.sort((a, b) => b[1] - a[1]);
  return categoryArray;
});

const tags = computed(() => {
  const tagMap = new Map<string, number>();
  props.postsMetaData?.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  let tagArray = Array.from(tagMap.entries());
  tagArray = tagArray.sort((a, b) => b[1] - a[1]);
  return tagArray;
});

function updateCategoryEnableStatus(index: number) {
  if (categoryEnableStatus.value.reduce((last, cur) => last && cur, true)) {
    for (let i = 0; i < categoryEnableStatus.value.length; i++) {
      if (i !== index) {
        categoryEnableStatus.value[i] = false;
      }
    }
  } else if (!categoryEnableStatus.value.reduce((last, cur, localIndex) => last || (localIndex === index ? false : cur), false)) {
    for (let i = 0; i < categoryEnableStatus.value.length; i++) {
      categoryEnableStatus.value[i] = true;
    }
  } else
    categoryEnableStatus.value[index] = !categoryEnableStatus.value[index];
  updateRule();
}

function updateRule() {
  emits('filterRuleChange', (post) => {
    for (let i = 0; i < categoryEnableStatus.value.length; i++) {
      if (categoryEnableStatus.value[i] && post.type === countGroup[i]!.type) {
        console.log('filter', post.title, 'true');
        return true;
      }
    }
    console.log('filter', post.title, 'false');
    return false;
  });
}
</script>

<template>
  <div>
    <div class="bg-old-neutral-200 dark:bg-old-neutral-800 transition-colors duration-500 p-5">
      <div class="text-2xl ml-1 flex items-center">
        <Icon class="mr-2" name="material-symbols:category"/>
        类型
      </div>
      <hr class="border-0 h-[1px] bg-old-neutral-600 mt-3 mb-1"/>
      <div class="flex mt-4">
        <div
            v-for="(data, index) of countGroup"
            :key="data.name"
            class="flex items-center flex-col flex-1 text-xl cursor-pointer hover:text-sky-400 dark:hover:text-[#cccaff] transition-colors duration-300"
            :class="{'text-old-neutral-400': !categoryEnableStatus[index]}"
            @click="updateCategoryEnableStatus(index)"
        >
          <div>{{ data.name }}</div>
          <div>{{ data.count }}</div>
        </div>
      </div>
    </div>
    <div class="bg-old-neutral-200 dark:bg-old-neutral-800 transition-colors duration-500 p-5 mt-4">
      <div class="text-2xl ml-1 flex items-center">
        <Icon class="mr-2" name="material-symbols:book"/>
        分类
      </div>
      <hr class="border-0 h-[1px] bg-old-neutral-600 mt-3 mb-1"/>
      <div
          v-for="([name,count],index) of categories" :key="index"
          class="flex justify-between pl-4 pr-4 hover:text-sky-400 dark:hover:text-[#cccaff] transition-colors duration-300">
        <div class="flex items-center">
          <Icon
              name="material-symbols:book-outline"
              size="17"
              class="mt-0.5 mr-1"
          />
          <div>{{ name }}</div>
        </div>
        <div>{{ count }}</div>
      </div>
    </div>
    <div class="bg-old-neutral-200 dark:bg-old-neutral-800 transition-colors duration-500 p-5 mt-4">
      <div class="text-2xl ml-1 flex items-center">
        <Icon class="mr-2" name="material-symbols:bookmarks"/>
        标签
      </div>
      <hr class="border-0 h-[1px] bg-old-neutral-600 mt-3 mb-1"/>
      <div class="flex flex-wrap">
        <div
            v-for="([name,count],index) of tags" :key="index"
            class="flex items-center justify-between text-[15px] pl-2 pr-2 m-1 rounded-2xl shadow-[0_0_0_1px_#888] hover:text-sky-400 dark:hover:text-[#cccaff] hover:shadow-[0_0_0_1px_#00bcff] dark:hover:shadow-[0_0_0_1px_#cccaff] transition-colors transition-shadow duration-300">
          <Icon
              name="clarity:hashtag-solid"
              size="17"
              class="mr-1 "
          />
          <div class="mr-1">{{ name }}</div>
          <div class="">{{ count }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
