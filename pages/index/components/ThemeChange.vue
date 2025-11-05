<script setup lang="ts">
import useColorModeStore from '~/stores/colorModeStore';

const colorModeStore = useColorModeStore();

function revealToggle(e?: MouseEvent) {
  if (typeof document === 'undefined' || !e || !('startViewTransition' in document)) {
    // SSR 或无事件时直接切换或不支持时直接切换
    colorModeStore.toggleColorMode();
    return;
  }

  const transition = document.startViewTransition(() => {
    colorModeStore.toggleColorMode();
  });
  transition.ready.then(() => {
    // 获取鼠标的坐标
    const { clientX, clientY } = e!;

    // 计算最大半径
    const radius = Math.hypot(
      Math.max(clientX, innerWidth - clientX),
      Math.max(clientY, innerHeight - clientY),
    );

    // 圆形动画扩散开始
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0% at ${clientX}px ${clientY}px)`,
          `circle(${radius}px at ${clientX}px ${clientY}px)`,
        ],
      },
      // 设置时间，已经目标伪元素
      {
        duration: 500,
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
}

</script>

<template>
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
          v-if="colorModeStore.colorMode === 'dark'"
          key="dark"
          name="material-symbols:dark-mode"
          class="text-2xl cursor-pointer mr-5"
          @click="revealToggle($event)"
      />
      <Icon
          v-else
          key="light"
          name="material-symbols:clear-day-rounded"
          class="text-2xl cursor-pointer mr-5"
          @click="revealToggle($event)"
      />
    </Transition>
</template>

<style>
::view-transition-new(root),
::view-transition-old(root) {
  animation: none;
}

</style>
