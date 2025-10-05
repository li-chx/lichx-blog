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

const typeGroup = computed(() => {
  const articleCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'article').length || 0);
  const announcementCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'announcement').length || 0);
  const ramblingCount = computed(() => props.postsMetaData?.filter((post) => !post.draft && post.type === 'rambling').length || 0);
  return [
    { name: '文章', count: articleCount, type: 'article' },
    { name: '絮语', count: ramblingCount, type: 'rambling' },
    { name: '公告', count: announcementCount, type: 'announcement' },
  ];
});
const typeEnableStatus: Ref<boolean[]> = ref(Array(typeGroup.value.length).fill(true));

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

const categoriesEnableStatus: Ref<boolean[]> = ref(new Array(categories.value.length).fill(true));
const tagsEnableStatus: Ref<boolean[]> = ref(new Array(tags.value.length).fill(true));

function updateTypeEnableStatus(index: number) {
  if (typeEnableStatus.value.reduce((last, cur) => last && cur, true)) {
    for (let i = 0; i < typeEnableStatus.value.length; i++) {
      if (i !== index) {
        typeEnableStatus.value[i] = false;
      }
    }
  } else if (!typeEnableStatus.value.reduce((last, cur, localIndex) => last || (localIndex === index ? false : cur), false)) {
    for (let i = 0; i < typeEnableStatus.value.length; i++) {
      typeEnableStatus.value[i] = true;
    }
  } else
    typeEnableStatus.value[index] = !typeEnableStatus.value[index];
  updateRule();
}

function updateCategoryEnableStatus(index: number) {
  if (categoriesEnableStatus.value.reduce((last, cur) => last && cur, true)) {
    for (let i = 0; i < categoriesEnableStatus.value.length; i++) {
      if (i !== index) {
        categoriesEnableStatus.value[i] = false;
      }
    }
  } else if (categoriesEnableStatus.value[index] && !categoriesEnableStatus.value.reduce((last, cur, localIndex) => last || (localIndex === index ? false : cur), false)) {
    for (let i = 0; i < categoriesEnableStatus.value.length; i++) {
      categoriesEnableStatus.value[i] = true;
    }
  } else
    categoriesEnableStatus.value[index] = !categoriesEnableStatus.value[index];
  updateRule();
}

function updateTagEnableStatus(index: number) {
  if (tagsEnableStatus.value.reduce((last, cur) => last && cur, true)) {
    for (let i = 0; i < tagsEnableStatus.value.length; i++) {
      if (i !== index) {
        tagsEnableStatus.value[i] = false;
      }
    }
  } else if (tagsEnableStatus.value[index] && !tagsEnableStatus.value.reduce((last, cur, localIndex) => last || (localIndex === index ? false : cur), false)) {
    for (let i = 0; i < tagsEnableStatus.value.length; i++) {
      tagsEnableStatus.value[i] = true;
    }
  } else
    tagsEnableStatus.value[index] = !tagsEnableStatus.value[index];
  updateRule();
}

function updateRule() {
  const enabledCategories = categoriesEnableStatus.value.reduce((last, cur, localIndex) => {
    if (cur) last.add(categories.value[localIndex]![0]);
    return last;
  }, new Set<string>());
  const enabledTags = tagsEnableStatus.value.reduce((last, cur, localIndex) => {
    if (cur) last.add(tags.value[localIndex]![0]);
    return last;
  }, new Set<string>());
  // const enable
  emits('filterRuleChange', (post) => {
    // type check
    let tempAns = false;
    for (let i = 0; i < typeEnableStatus.value.length; i++) {
      if (typeEnableStatus.value[i] && post.type === typeGroup.value[i]!.type) {
        tempAns = true;
      }
    }
    // category check
    if (tempAns)
      tempAns = false;
    else
      return false;
    if (post.category && enabledCategories.has(post.category))
      tempAns = true;
    else tempAns = !post.category && enabledCategories.size === categories.value.length;
    // tag check
    if (tempAns)
      tempAns = false;
    else
      return false;
    if (tagsEnableStatus.value.length === enabledTags.size)
      tempAns = true;
    else for (const tag of post.tags || []) {
      if (enabledTags.has(tag)) {
        tempAns = true;
        break;
      }
    }
    return tempAns;
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
            v-for="(data, index) of typeGroup"
            :key="data.name"
            class="flex items-center flex-col flex-1 text-xl cursor-pointer hover:text-sky-400 dark:hover:text-[#cccaff] transition-colors duration-300"
            :class="{'text-old-neutral-400': !typeEnableStatus[index]}"
            @click="updateTypeEnableStatus(index)"
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
          class="flex justify-between pl-4 pr-4 hover:text-sky-400 dark:hover:text-[#cccaff] transition-colors duration-300"
          :class="{'text-old-neutral-400': !categoriesEnableStatus[index]}"
          @click="updateCategoryEnableStatus(index)"
      >
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
            class="flex items-center justify-between text-[15px] pl-2 pr-2 m-1 rounded-2xl shadow-[0_0_0_1px_#888] hover:text-sky-400 dark:hover:text-[#cccaff] hover:shadow-[0_0_0_1px_#00bcff] dark:hover:shadow-[0_0_0_1px_#cccaff] transition-all duration-300"
            :class="{'text-old-neutral-400': !tagsEnableStatus[index]}"
            @click="updateTagEnableStatus(index)"
        >
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
