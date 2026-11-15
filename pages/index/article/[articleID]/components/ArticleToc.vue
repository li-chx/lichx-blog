<script setup lang="ts">
import type { TocLink } from '@nuxt/content';
import TocList from '~/pages/index/article/[articleID]/components/TocList.vue';

const props = defineProps<{ links: TocLink[] }>();
const activeIds = ref<string[]>([]);
const { height } = useWindowSize();
const navBarHeight = injectNavbarHeight();
const flattenedLinks = ref<TocLink[]>(flatten(props.links));

function flatten(links: TocLink[]): TocLink[] {
  return links.flatMap((l) => [l, ...(l.children ? flatten(l.children as TocLink[]) : [])]);
}

function onScroll() {
  const localActiveIds: string[] = [];
  flattenedLinks.value = flatten(props.links);
  const links = flattenedLinks.value;
  const topBias = 66;
  const navBarHeightVal = navBarHeight.value + topBias;
  for (let i = 0; i < links.length; i++) {
    const element = document.getElementById(links[i]!.id);
    if (!element) {
      continue;
    }
    const elTop = element.getBoundingClientRect().top;
    if (i == links.length - 1) {
      if ((elTop > navBarHeightVal && elTop < height.value)
        || (elTop < navBarHeightVal)) {
        localActiveIds.push(links[i]!.id);
      }
      continue;
    }
    const nextElement = document.getElementById(links[i + 1]!.id);
    if (!element || !nextElement) {
      continue;
    }
    const nextElTop = nextElement.getBoundingClientRect().top;
    if ((elTop > navBarHeightVal && elTop < height.value)
      || (elTop < navBarHeightVal && nextElTop > navBarHeightVal)
      || (nextElTop > navBarHeightVal && nextElTop < height.value)) {
      localActiveIds.push(links[i]!.id);
    }
  }
  activeIds.value = localActiveIds;
}

onNuxtReady(() => {
  window.addEventListener('scroll', onScroll);
  onScroll();
});
onUnmounted(() => window.removeEventListener('scroll', onScroll));

</script>

<template>
  <!-- 把整棵树和算好的 activeId 交给递归渲染组件 -->
  <TocList :links="flattenedLinks" :active-ids="activeIds"/>
</template>
