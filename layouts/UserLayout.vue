<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import useColorModeStore from '~/stores/colorModeStore';
import { useWindowScroll } from '@vueuse/core';

const { colorMode } = storeToRefs(useColorModeStore());
watch(colorMode, () => {
  console.log('colorMode changed:', colorMode.value);
});
const isHome = computed(() => useRoute().path === '/');
const items = ref<NavigationMenuItem[]>([
  {
    label: '首页',
    icon: 'i-lucide-home',
    to: '/',
    // 如果使用isHome.value 将失去响应性 但是active只接受boolean 或 undefined
    // 所以需要使用as unknown as boolean 来强制转换定义 (安抚类型检查quq)
    // 但是 ComputedRef 竟然也能用
    // ts, 很神奇吧
    active: isHome as unknown as boolean,
  },
  {
    label: '归档',
    icon: 'i-lucide-paperclip',
    to: '/archive',
  },
  {
    label: '友链',
    icon: 'i-lucide-link',
    to: '/friends',
  },
  {
    label: '关于',
    icon: 'i-lucide-info',
    to: '/about',
  },
]);
const collapsed = ref(false);

onMounted(() => {
  setTimeout(() => {
    collapsed.value = true;
  }, 2000);
});
const scrollY = useWindowScroll().y;
const isScrollDown = ref(false);

watch(scrollY, (newY) => {
  if (newY > 0 && !collapsed.value) {
    collapsed.value = true;
  }
  isScrollDown.value = newY > 215;
});

const isLoading = ref(false);

useRouter().beforeEach(() => {
  isLoading.value = true;
});

useRouter().afterEach(() => {
  isLoading.value = false;
});

const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div class="bg-old-neutral-50 dark:bg-[#0b0d0d] w-full min-h-[100vh] h-full">
    <UApp>
      <div
          :class=" (collapsed ? 'h-[20vh]': 'h-[40vh]')"
          class="flex flex-col relative transition-[height] duration-500 max-h-80">
        <!-- header -->
        <div
             v-if="mounted"
             @mouseenter="() => {
          if(scrollY === 0) {
            collapsed = false;
          }
        }" @mouseleave="collapsed = true">
          <div
              v-if="colorMode === 'light'"
              class="flex w-full h-full absolute bg-[url('/79d52228c770808810a310115567e6790380823a.webp')] bg-cover bg-top ">
            <slot name="header"/>
          </div>
          <div
              v-else
              class="flex w-full h-full max-h-80 absolute bg-[url('/anime-8788959.webp')] bg-cover bg-center">
            <slot name="header"/>
          </div>
          <!-- header picture -->
          <div v-if="isScrollDown">
            <div
                v-if="colorMode === 'light'"
                class="opacity-80 max-h-[48px] flex w-full h-full fixed bg-[url('/79d52228c770808810a310115567e6790380823a.webp')] bg-cover bg-top"/>
            <div
                v-else
                class="opacity-20 max-h-[48px] flex w-full h-full fixed bg-[url('/anime-8788959.webp')] bg-cover bg-center"/>
          </div>
        </div>
        <!-- navbar -->
        <div
            class="fixed z-10 w-full transition-all duration-500 dark:bg-gray-800/60 bg-old-neutral-50/40 backdrop-blur-sm dark:backdrop-blur-md">
          <div class="flex justify-center items-center h-full">
            <div class="flex-1 overflow-hidden">
              <slot name="navbarLeft" :is-scroll-down="isScrollDown"/>
            </div>
            <div
                class="transition-[width] duration-500 flex 2xl:w-[1240px] xl:w-[1020px] lg:w-[964px] md:w-[708px] sm:w-[580px] w-10/12">
              <UNavigationMenu v-if="mounted" :items="items" :class="colorMode" class="w-full"/>
              <div v-else class="w-full h-12 animate-pulse"></div>
            </div>
            <div class="flex-1 overflow-hidden">
              <slot name="navbarRight" :is-scroll-down="isScrollDown"/>
            </div>
          </div>
          <Transition
              enter-active-class="transition-opacity duration-500 ease-in-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-500 ease-in-out"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0">
            <UProgress v-if="isLoading" :size="'sm'" class="fixed z-20"/>
          </Transition>
        </div>

      </div>
      <!-- content -->
      <div class="flex justify-center items-center bg-white dark:bg-[#16191b] h-full">
        <div
            :class="collapsed ? 'min-h-[80vh]' : 'min-h-[60vh]'"
            class="transition-[width] duration-500 ease-in-out 2xl:w-[1240px] xl:w-[1020px] lg:w-[964px] md:w-[708px] sm:w-[580px] w-11/12">
          <slot name="content"/>
        </div>
      </div>
      <slot name="footer"/>
    </UApp>
  </div>
</template>

<style scoped lang="less">
:deep(.light .text-muted:not(:hover)), :deep(.light .text-dimmed:not(:hover)) {
  --ui-text-muted: var(--light-text-secondary-color);
  --ui-text-dimmed: var(--light-text-secondary-color);
}

:deep(.dark .text-muted) {
  --ui-text-muted: var(--dark-text-color);
  --ui-text-dimmed: var(--dark-text-color);
}

:deep(a::before) {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}
</style>
