<script setup lang="ts">

const containerRef = ref<HTMLDivElement>();
const hoverContentRef = ref<HTMLDivElement>();
const position = ref({
  top: true, // true: 下方, false: 上方
  left: true, // true: 右对齐, false: 左对齐
});

const updatePosition = () => {
  if (!containerRef.value || !hoverContentRef.value) return;

  const container = containerRef.value.getBoundingClientRect();
  const hoverContent = hoverContentRef.value.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // 计算垂直位置：优先下方，空间不足则上方
  const spaceBelow = viewport.height - container.bottom;
  const spaceAbove = container.top;
  position.value.top = spaceBelow >= hoverContent.height || spaceBelow >= spaceAbove;

  // 计算水平位置：优先左对齐，空间不足则右对齐
  const spaceRight = viewport.width - container.left;
  position.value.left = spaceRight >= hoverContent.width;
};

const handleMouseEnter = () => {
  // 延迟一帧确保元素已渲染
  requestAnimationFrame(updatePosition);
};

onMounted(() => {
  window.addEventListener('resize', updatePosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition);
});
</script>

<template>
  <div
      ref="containerRef"
      class="relative group"
      @mouseenter="handleMouseEnter"
  >
    <slot name="content" />
    <div
        ref="hoverContentRef"
        :class="[
        'absolute hidden rounded bg-old-neutral-700 text-white text-sm group-hover:block z-10',
        position.top ? 'top-full' : 'bottom-full',
        position.left ? 'left-0' : 'right-0'
      ]"
    >
      <slot name="hoverContent"/>
    </div>
  </div>
</template>
