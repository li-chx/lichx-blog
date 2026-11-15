<script setup lang="ts">

import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';
import type { OverflowBehavior, ScrollbarsAutoHideBehavior, ScrollbarsVisibilityBehavior } from 'overlayscrollbars';

const props = withDefaults(defineProps<{
  x?: string;
  y?: string;
}>(), {
  x: 'hidden',
  y: 'scroll',
});
const scrollbarOptions = {
  scrollbars: {
    theme: 'os-theme-thin-dark',
    visibility: 'auto' as ScrollbarsVisibilityBehavior,
    autoHide: 'move' as ScrollbarsAutoHideBehavior,
    autoHideDelay: 1300,
    dragScroll: true,
    clickScroll: true,
  },
  overflow: {
    x: props.x as OverflowBehavior,
    y: props.y as OverflowBehavior,
  },
};
</script>

<template>
  <overlay-scrollbars-component class="easy-scrollbar" :options="scrollbarOptions">
    <slot/>
  </overlay-scrollbars-component>
</template>

<style scoped>
.easy-scrollbar :deep(.os-scrollbar) {
  --os-size: 4px;
  --os-padding-perpendicular: 0px;
  --os-padding-axis: 0px;
  --os-track-border-radius: 2px;
  --os-handle-border-radius: 2px;
  --os-handle-bg: rgba(156, 163, 175, 0.5);
  --os-handle-bg-hover: rgba(156, 163, 175, 0.8);
  --os-handle-bg-active: rgba(107, 114, 128, 1);
}

/* 暗色模式 */
.easy-scrollbar:is(.dark *) :deep(.os-scrollbar) {
  --os-handle-bg: rgba(75, 85, 99, 0.5);
  --os-handle-bg-hover: rgba(75, 85, 99, 0.8);
  --os-handle-bg-active: rgba(107, 114, 128, 1);
}
</style>
