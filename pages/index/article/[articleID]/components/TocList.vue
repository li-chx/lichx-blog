<script setup lang="ts">
import type { TocLink } from '@nuxt/content';

//  2     6
//  24    20
//  2     6
//  24    20
//  2     6

const props = defineProps<{ links: TocLink[]; activeIds: string[] }>();

// const flattenedLinks = computed(() => {
//   props.links.forEach(link => {
// })
function getClassNames(index: number) {
  if (index < 0 || index > props.links.length) {
    return '';
  }
  const link = props.links[index]!;
  let className = '';
  if (props.activeIds.includes(link.id)) {
    className += 'text-sky-400 dark:text-[#cccaff] font-medium border-l-sky-400 dark:border-l-[#cccaff]';
  } else {
    className += 'text-old-neutral-500 border-l-old-neutral-800';
  }
  return className;
}

let currentStart = 0;
let currentEnd = 0;
let targetStart = 0;
let targetEnd = 0;
const tocHeight = 26;
const maxedHeight = computed(() => props.links.length * tocHeight);
const targetPoints: Ref<number[]> = ref([]);

const points = ref('');
let animationFrameId = 0;

const startCx = ref(0), startCy = ref(0), endCx = ref(0), endCy = ref(0);

function updateSvgPoints() {
  if (props.activeIds.length == 0) {
    return [];
  }
  const points: number[] = [];

  const gapHeight = 6, tocHeight = 20;
  const yBias = -3;
  const xBias = 5;

  function isIntersect(ab: number, ae: number, bb: number, be: number): boolean {
    return Math.max(ab, bb) < Math.min(ae, be);
  }

  function getIntersects(ab: number, ae: number, bb: number, be: number): [number, number] {
    return [Math.max(ab, bb), Math.min(ae, be)];
  }

  for (let i = 0; i < props.links.length; i++) {
    const link = props.links[i]!;
    const linkStart = i * tocHeight + (i + 1) * gapHeight + yBias;
    const linkEnd = (i + 1) * tocHeight + (i + 1) * gapHeight + yBias;
    if (isIntersect(linkStart, linkEnd, currentStart, currentEnd)) {
      const [yStart, yEnd] = getIntersects(linkStart, linkEnd, currentStart, currentEnd);

      points.push((link.depth - 2) * 12 + xBias);
      points.push(yStart);
      points.push((link.depth - 2) * 12 + xBias);
      points.push(yEnd);
    }

    if (i < props.links.length - 1) {
      const nextLinkStart = (i + 1) * tocHeight + (i + 2) * gapHeight + yBias;
      if (isIntersect(currentStart, currentEnd, linkEnd, nextLinkStart)) {
        const [xFullStart, xFullEnd] = [(link.depth - 2) * 12 + xBias, (props.links[i + 1]!.depth - 2) * 12 + xBias];
        if (currentStart > linkEnd && currentStart < nextLinkStart) {
          const x = xFullStart + (xFullEnd - xFullStart) * (currentStart - linkEnd) / (nextLinkStart - linkEnd);
          points.push(x);
          points.push(currentStart);
        }
        if (currentEnd > linkEnd && currentEnd < nextLinkStart) {
          const x = xFullEnd - (xFullEnd - xFullStart) * (nextLinkStart - currentEnd) / (nextLinkStart - linkEnd);
          points.push(x);
          points.push(currentEnd);
        }
      }
    }
  }
  [startCx.value, startCy.value] = [points[0] ?? -100, points[1] ?? -100];
  [endCx.value, endCy.value] = [points[points.length - 2] ?? -100, points[points.length - 1] ?? -100];
  return points;
}

function getTarget(): [number, number] {
  if (props.activeIds.length == 0) {
    return [-1, -1];
  }
  const points: number[] = [];

  const gapHeight = 6, tocHeight = 20;
  const bias = -3;

  for (let i = 0; i < props.links.length; i++) {
    const link = props.links[i]!;
    if (props.activeIds.includes(link.id)) {
      points.push((link.depth - 2) * 12 + 1);
      points.push(i * tocHeight + (i + 1) * gapHeight);
      points.push((link.depth - 2) * 12 + 1);
      points.push((i + 1) * tocHeight + (i + 1) * gapHeight);
    }
  }

  const edgeBias = 2;
  if (points.length > 1 && props.activeIds.includes(props.links[0]!.id)) {
    points[1]! += edgeBias;
  }
  if (points.length > 1 && props.activeIds.includes(props.links[props.links.length - 1]!.id)) {
    points[points.length - 1]! -= edgeBias;
  }

  points.forEach((x, i, arr) => {
    arr[i] = i % 2 == 0 ? x : x + bias;
  });
  targetPoints.value = points;
  if (points.length >= 2) {
    return [points[1]!, points[points.length - 1]!];
  }
  return [-1, -1];
}

function doUpdate() {
  [targetStart, targetEnd] = getTarget();
  const factor = 0.1;

  function updateSvg() {
    points.value = updateSvgPoints().join(',');
    const startDelta = (targetStart - currentStart) * factor;
    const endDelta = (targetEnd - currentEnd) * factor;
    currentStart += startDelta;
    currentEnd += endDelta;
    if (Math.abs(currentStart - targetStart) < 0.2 && Math.abs(currentEnd - targetEnd) < 0.2) {
      currentStart = targetStart;
      currentEnd = targetEnd;
      points.value = updateSvgPoints().join(',');
      return;
    }
    animationFrameId = requestAnimationFrame(updateSvg);
  }

  animationFrameId = requestAnimationFrame(updateSvg);
}

// 外面在 onNuxtReady 更新数据 里面在onMounted时设置钩子
onMounted(() => {
  watchEffect(() => {
    doUpdate();
  });
});
onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});

</script>

<template>
  <div class="relative">
    <svg
        class="absolute pointer-events-none" :viewBox="`0 0 100 ${maxedHeight}`" width="100"
        :height="`${links.length * tocHeight}`">
      <circle
          v-if="startCx != -100 || startCy != -100"
          :cx="startCx" :cy="startCy"
          r="1" fill="none"
          stroke-width="3"
          class="stroke-old-neutral-400 dark:stroke-white"/>
      <circle
          v-if="endCx != -100 || endCy == -100"
          :cx="endCx" :cy="endCy"
          r="1" fill="none"
          stroke-width="3"
          class="stroke-old-neutral-400 dark:stroke-white"/>
      <polyline
          :points="points" fill="none" class="stroke-old-neutral-400 dark:stroke-white" stroke-width="2"
          stroke-linejoin="round"></polyline>
    </svg>
    <ul>
      <li
          v-for="(link,idx) in links" :key="link.id"
          class="not-last:mb-0.5 not-first:mt-0.5"
          :style="{ marginLeft: `${ (link.depth - 2) * 12}px` }"
      >
        <a
            :href="`#${link.id}`"
            class="transition-colors duration-300"
            :class="getClassNames(idx)">
          <div class="text-sm text-nowrap truncate max-w-full pl-4 h-6 pt-0.75">
            {{ link.text }}
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>
