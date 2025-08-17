<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Highcharts from 'highcharts';
import { DataAnomaly } from '~/types/ArticleMetaData';
import 'overlayscrollbars/overlayscrollbars.css';
import useColorModeStore from '~/stores/colorModeStore';
import useIconStore from '~/stores/iconStore';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';
import type { OverflowBehavior, ScrollbarsAutoHideBehavior, ScrollbarsVisibilityBehavior } from 'overlayscrollbars';

const props = withDefaults(defineProps<{
  techStack?: string[] | DataAnomaly;
  techStackPercent?: number[] | DataAnomaly;
  techStackIconNames?: string[] | DataAnomaly;
  techStackThemeColors?: string[] | DataAnomaly;
  asyncKey: string;
}>(), {
  techStack: () => ['Vue', 'Nuxt', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Python', 'Java', 'C#'],
  techStackPercent: () => [5, 3, 4, 2, 1, 1, 2, 3, 2, 1],
  techStackIconNames: () => ['mdi:vuejs', 'lineicons:nuxt', 'mdi:language-typescript', 'mdi:language-javascript', 'material-symbols:css', 'mdi:language-html5', 'mdi:nodejs', 'mdi:language-python', 'mdi:language-java', 'mdi:language-csharp'],
  techStackThemeColors: () => ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#98D8C8', '#F7DC6F', '#BB8FCE'],
});

const chartRef = ref<HTMLDivElement | null>(null);
const techStackLightIconSVG = ref<string[]>([]);
const techStackDarkIconSVG = ref<string[]>([]);
const { colorMode } = storeToRefs(useColorModeStore());

const { pending } = useAsyncData(props.asyncKey, async () => {
  if (props.techStackIconNames === DataAnomaly.DataNotFound || props.techStackIconNames === DataAnomaly.Invalid)
    return [];
  const iconStore = useIconStore();
  for (const iconName of props.techStackIconNames) {
    await iconStore.setIconInfo(iconName);
  }
  for (const iconName of props.techStackIconNames) {
    techStackLightIconSVG.value.push(iconStore.getColoredIcon(iconName, '#666'));
    techStackDarkIconSVG.value.push(iconStore.getColoredIcon(iconName, '#aaa'));
  }
  return [];
});

function toPercent(num: number | undefined): string {
  if (num === undefined || isNaN(num)) return '0%';
  num *= 100;
  const rounded = Math.round(num * 100) / 100;
  return (rounded === 0 ? '0' : rounded.toFixed(2).replace(/\.?0+$/, '')) + '%';
}

const noDataAvailable = ref(false);
const renderChart = () => {
  const techStack = props.techStack as string[];
  const techStackPercent = props.techStackPercent as number[];
  if (!chartRef.value) return;
  const sum = techStackPercent.reduce((acc, val) => acc + val, 0);
  const fullArr: [string, number, string, string, string][] = techStack.map((name, index) => [name, techStackPercent[index] / sum, techStackLightIconSVG.value[index] || '', techStackDarkIconSVG.value[index] || '', props.techStackThemeColors[index]] as [string, number, string, string, string]).sort((a, b) => b[1] - a[1]);
  const dataArr: [string, number][] = fullArr.map((x) => [x[0], x[1]]);
  const barHeight = 20;
  const gap = 10;
  const axisColor = '#aaa';
  chartRef.value.style.height = `${dataArr.length * (barHeight + gap) + 25}px`;
  Highcharts.chart(chartRef.value, {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    legend: {
      enabled: false,
    },

    xAxis: {
      categories: dataArr.map(([name]) => name),
      title: {
        text: undefined,
      },
      labels: {
        useHTML: true,
        formatter: function () {
          return `<div style="width: 25px; height: 25px;" title="${fullArr[this.pos][0]}">
                    ${colorMode.value === 'light' ? fullArr[this.pos][2] : fullArr[this.pos][3]}
                  </div>`;
        },
      },
      lineColor: axisColor, // 设置 x 轴线颜色
      tickColor: axisColor, // 设置 x 轴刻度颜色
    },
    yAxis: {
      min: 0,
      title: {
        text: undefined, // 修复 null 类型错误
      },
      labels: {
        enabled: false, // 关闭 y 轴标签显示
      },
      gridLineWidth: 0, // 关闭网格线
      lineWidth: 0, // 关闭 y 轴线
      tickWidth: 0, // 关闭刻度线
    },
    series: [
      {
        name: 'Tech Stack',
        data: dataArr.map(([, value]) => value),
        type: 'bar',
        colorByPoint: true,
        colors: fullArr.map((x) => x[4]),
      },
    ],
    tooltip: {
      formatter: function () {
        return `${fullArr[this.x][0]} ${toPercent(this.y)}`;
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        pointWidth: 20,
        groupPadding: 0.1,
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: {
            color: '#fff',
          },
          formatter: function () {
            return toPercent(this.y); // 自定义条形图值的显示格式
          },
        },
      },
    },
  }, () => {
  });
};

let colorModeCallBackKey = '';
onMounted(() => {
  if (props.techStack === DataAnomaly.DataNotFound || props.techStack === DataAnomaly.Invalid
    || props.techStackPercent === DataAnomaly.DataNotFound || props.techStackPercent === DataAnomaly.Invalid
    || props.techStackThemeColors === DataAnomaly.DataNotFound || props.techStackThemeColors === DataAnomaly.Invalid
    || props.techStack.length === 0 || props.techStackPercent.length === 0 || props.techStackThemeColors.length === 0) {
    noDataAvailable.value = true;
    return;
  }
  window.addEventListener('resize', renderChart);
  colorModeCallBackKey = useColorModeStore().registerCallBack(renderChart);
  watch(pending, (isPending) => {
    if (!isPending) {
      // 数据加载完成后的回调逻辑
      renderChart();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', renderChart);
  useColorModeStore().unregisterCallBack(colorModeCallBackKey);
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
    x: 'hidden' as OverflowBehavior,
    y: 'scroll' as OverflowBehavior,
  },
};

</script>

<template>
  <div class="h-full">
    <div v-if="noDataAvailable" class="flex items-center justify-center h-full p-8">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 112.01">
        <g id="_图层_1" data-name="图层 1">
          <polyline class="fill-none stroke-old-neutral-400 dark:stroke-old-neutral-500 [stroke-miterlimit:10]" points="1.5 28.63 1.5 1.5 63.5 1.59"/>
          <polyline class="fill-none stroke-old-neutral-400 dark:stroke-old-neutral-500 [stroke-miterlimit:10]" points="254.5 83.38 254.5 110.5 192.5 110.41"/>
          <polyline class="fill-none stroke-old-neutral-400 dark:stroke-old-neutral-500 [stroke-miterlimit:10] stroke-3" points="254.5 28.63 254.5 1.5 192.5 1.59"/>
          <polyline class="fill-none stroke-old-neutral-400 dark:stroke-old-neutral-500 [stroke-miterlimit:10] stroke-3" points="1.5 83.38 1.5 110.5 63.5 110.41"/>
        </g>
        <g id="_图层_2" data-name="图层 2">
          <text class="[font-family:ArialMT,Arial] text-xl stroke-old-neutral-600 dark:stroke-old-neutral-400 fill-old-neutral-600 dark:fill-old-neutral-400" transform="translate(89.48 61.61)"><tspan x="0" y="0">No Data</tspan></text>
        </g>
        <g id="_图层_3" data-name="图层 3">
          <line class="fill-none stroke-old-neutral-400 dark:stroke-old-neutral-500 [stroke-miterlimit:10]" x1="16" y1="11" x2="90" y2="39.8"/>
          <line class="fill-none stroke-old-neutral-400 dark:stroke-old-neutral-500 [stroke-miterlimit:10]" x1="166" y1="72.21" x2="240" y2="101"/>
        </g>
      </svg>
    </div>
    <overlay-scrollbars-component v-else class="max-h-full" :options="scrollbarOptions">
      <div ref="chartRef" class="w-full"/>
    </overlay-scrollbars-component>
  </div>
</template>

<style scoped>

:deep(.os-scrollbar) {
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
.dark :deep(.os-scrollbar) {
  --os-handle-bg: rgba(75, 85, 99, 0.5);
  --os-handle-bg-hover: rgba(75, 85, 99, 0.8);
  --os-handle-bg-active: rgba(107, 114, 128, 1);
}
</style>
