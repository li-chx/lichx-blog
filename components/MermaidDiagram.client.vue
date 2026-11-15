<script setup lang="ts">

import Panzoom, { type PanzoomObject } from '@panzoom/panzoom';

const props = defineProps<{ mermaidCode: string }>();

const diagramId = `mermaid-${useId()}`;
const svg = ref('');
const svgUrl = computed(() =>
  svg.value
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.value)}`
    : '',
);
const errorMessage = ref('');
const scale = ref(1);
const svgWidth = ref(0);

const hover = ref(false);

onMounted(async () => {
  try {
    const { default: mermaid } = await import('mermaid');

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: colorModeStore().isDarkMode ? 'dark' : 'default',
      darkMode: colorModeStore().isDarkMode,
    });

    const result = await mermaid.render(diagramId, props.mermaidCode);

    const doc = new DOMParser().parseFromString(
      result.svg,
      'image/svg+xml',
    );

    svgWidth.value = doc.querySelector('svg')?.viewBox.baseVal.width ?? 0;
    svg.value = result.svg;
  } catch (error) {
    errorMessage.value
      = error instanceof Error ? error.message : String(error);
  }
});

const isFullscreen = ref(false);
const modalReady = ref(false);
let viewer: ReturnType<typeof Panzoom> | null = null;
const mermaidImage = ref<HTMLImageElement | null>(null);

function initializeViewer() {
  if (
    !modalReady.value
    || viewer
    || !mermaidImage.value?.complete
    || !mermaidImage.value.naturalWidth
  ) {
    return;
  }

  viewer = Panzoom(mermaidImage.value, {
    canvas: true,
    minScale: 0.25,
    maxScale: 6,
    step: 0.2,
  });
}

let startX = 0;
let startY = 0;
let moved = false;

function onPointerDown(event: PointerEvent) {
  startX = event.clientX;
  startY = event.clientY;
  moved = false;
}

function onPointerMove(event: PointerEvent) {
  if (Math.hypot(event.clientX - startX, event.clientY - startY) > 5) {
    moved = true;
  }
}

function onPreviewClick() {
  if (!moved) {
    isFullscreen.value = false;
  }
}

const { copy, copied, isSupported: copySupported } = useClipboard();

</script>

<template>
  <div class="my-5 overflow-x-auto">
    <pre v-if="errorMessage" class="text-red-500 whitespace-pre-wrap">{{ errorMessage }}</pre>
    <div v-else-if="svgUrl" class="relative" @mouseenter="hover=true" @mouseleave="hover=false">
      <EasyScrollBar class="max-h-[60dvh] overflow-auto">
        <img
            :src="svgUrl"
            :style="{ width: `${svgWidth * scale}px`}"
            alt="Mermaid 图表"
            class="block max-w-none mx-auto"
            @click="isFullscreen = true"
        />
      </EasyScrollBar>
      <Transition
          enter-active-class="transition-opacity duration-500"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div
            v-show="copySupported && hover"
            class="absolute inset-y-0 right-10"
        >
          <div v-if="copied">
            copied!
          </div>
          <Icon
              v-else
              name="lucide:copy" class="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer"
              mode="svg"
              @click="copy(mermaidCode)"/>
        </div>
      </Transition>
      <UModal
          v-model:open="isFullscreen"
          fullscreen
          :ui="{
            overlay: 'bg-black/70',
            title: 'Mermaid 图表预览',
            description: '使用鼠标滚轮缩放，拖动平移，点击空白处退出预览',
            content: 'bg-transparent shadow-none ring-0',
          }"
          @after:enter="() => { modalReady = true; initializeViewer(); }"
          @after:leave="() => { modalReady = false; (viewer! as PanzoomObject).destroy(); viewer = null; }"
      >
        <template #content>
          <div
              class="flex size-full items-center justify-center overflow-hidden p-6"
              @pointerdown.capture="onPointerDown"
              @pointermove.capture="onPointerMove"
              @click="onPreviewClick"
              @wheel.prevent="(e)=>{
                console.log(e);
                (viewer! as PanzoomObject).zoomWithWheel(e)
              }"
          >
            <img
                ref="mermaidImage"
                :src="svgUrl"
                :style="{ width: `${svgWidth}px` }"
                class="block m-auto max-h-full max-w-full shrink-0 select-none object-contain"
                alt="Mermaid 图表"
                draggable="false"
                @load="initializeViewer"
            />
          </div>
        </template>
      </UModal>
    </div>
    <div v-else class="text-gray-500 dark:text-gray-400">正在渲染 Mermaid 图表...</div>
  </div>
</template>

<style scoped>
</style>
