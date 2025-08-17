<script setup lang="ts">

import { toArticleMetaDataType } from '~/types/ArticleMetaData';

const { data: articles } = useAsyncData(async () => await queryCollection('content').all());

onMounted(() => {
  console.log(articles.value);
});

// // 监听断点变化并设置延迟策略
// watch(showLeftDetailInfo, (newValue, oldValue) => {
//   if (newValue && !oldValue) {
//     // xl -> 2xl (显示) - 需要延迟
//     shouldDelay.value = true;
//     isTransitioning.value = true;
//   } else if (!newValue && oldValue) {
//     // 2xl -> xl (隐藏) - 不延迟
//     shouldDelay.value = false;
//     isTransitioning.value = true;
//   }
//
//   // 动画完成后重置状态
//   setTimeout(() => {
//     isTransitioning.value = false;
//   }, 400); // 根据你的动画时长调整
// });

</script>

<template>
  <div>
    <div class="mt-4">
      <div class="table w-full">
        <div class="sticky top-16 float-left bg-old-neutral-500 h-[100vh]">
          <div class="relative duration-500 transition-all xl:w-80 w-0 mr-2/3 h-full overflow-hidden">
            <div class="absolute top-0 left-0 w-80 text-white z-50">
              <div class="">
                test123456
              </div>
            </div>
          </div>
        </div>
        <div class="transition-all duration-500 float-right xl:w-[calc(100%-20rem-40px)] w-full">
          <ArticleCard
              v-for="article in articles" :key="article.id"
              class="mb-4 w-full"
              :article="toArticleMetaDataType(article)"/>
          <ArticleCard/>
        </div>

      </div>
      test
    </div>

  </div>
</template>
