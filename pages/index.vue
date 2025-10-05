<script setup lang="ts">
import useColorModeStore from '~/stores/colorModeStore';
import breakpointsHelper from '~/utils/BreakpointsHelper';

const hitokoto = ref('加载中...');

onMounted(async () => {
  const src = await $fetch<{ hitokoto: string; from_who?: string; from?: string }>('https://v1.hitokoto.cn?c=k');
  hitokoto.value = `${src.hitokoto} —— ${src.from_who ? src.from_who : '佚名'}${src.from ? `，${src.from}` : '未知来源'}`;
});
</script>

<template>
  <NuxtLayout :name="'user-layout'">
    <template #navbarLeft="{ isScrollDown } : { isScrollDown: boolean }">
      <Transition
          enter-active-class="transition-opacity duration-500 ease-in-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-500 ease-in-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div
            v-if="isScrollDown && breakpointsHelper.greaterOrEqual('xl').value"
            class="pl-5 text-xl h-12 leading-11 flex">
          随机存取
        </div>
      </Transition>
    </template>
    <template #navbarRight>
      <div class="flex items-center h-full">
        <div class="flex-1"/>
        <div class="flex-1 flex  items-center justify-end duration500 ease-in-out">
          <Transition
              mode="out-in"
              enter-active-class="transition-opacity duration-300 ease-in-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-300 ease-in-out"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
          >
            <Icon
                v-if="useColorModeStore().colorMode === 'dark'"
                key="dark"
                name="material-symbols:dark-mode"
                class="text-2xl cursor-pointer mr-5"
                @click="() => useColorModeStore().toggleColorMode()"
            />
            <Icon
                v-else
                key="light"
                name="material-symbols:clear-day-rounded"
                class="text-2xl cursor-pointer mr-5"
                @click="() => useColorModeStore().toggleColorMode()"
            />
          </Transition>
        </div>
      </div>
    </template>
    <template #header>
      <div class="w-full flex-1 justify-center flex items-center">
        <p class="text-8xl mt-12">
          随机存取
        </p>
      </div>
    </template>
    <template #content>
      <div class="max-w-full">
        <NuxtRouteAnnouncer/>
        <NuxtPage class="max-w-full"/>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex flex-col justify-center items-center p-10 text-old-neutral-500">
        <div>
          {{ hitokoto }}
        </div>
        <div>
          © 2025 随机存取. 由Lichx制作
        </div>
        <div>
          蒙ICP备2025022865号
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped>

</style>
