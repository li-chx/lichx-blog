<script setup lang="ts">
import gsap from 'gsap';

const fiendsLinkData = [{
  link: 'https://owo.cab',
  name: '拾星絮语',
  description: '银汉凝睫上，璇玑坠瞳渊~',
  avatar: 'https://static.owo.cab/avatar.webp',
  owner: 'zhxycn',
  color: 'bg-orange-300',
}];

const stripeCounts = ref(fiendsLinkData.map(() => 6));

async function playStripes(event: MouseEvent, index: number) {
  const card = event.currentTarget as HTMLElement;

  gsap.killTweensOf(card.querySelectorAll('.stripe')); // 快速重复进入时，停止上一轮

  stripeCounts.value[index] = gsap.utils.random(3, 8, 1);
  await nextTick();
  const stripes = card.querySelectorAll<HTMLElement>('.stripe');

  await gsap.fromTo(stripes, {
    x: -160,
    rotation: 25,
    width: () => gsap.utils.random(4, 20),
    opacity: () => gsap.utils.random(0.46, 0.66),
  }, {
    x: card.clientWidth + 50,
    duration: 1.5,
    stagger: { each: 0.1, from: 'random' },
    ease: 'power2.out',
    onComplete: () => {
      gsap.set(stripes, { opacity: 0 });
    },
  });
}
</script>

<template>
  <div class="mt-10 w-full">
    <div class="w-full grid grid-cols-[repeat(auto-fit,min(100%,20rem))] justify-center gap-4">
      <div
          v-for="(item, index) in fiendsLinkData" :key="index"
          class="border-old-neutral-200 dark:border-old-neutral-600 border rounded-lg overflow-hidden"
      >
        <a
            :href="item.link" target="_blank" rel="noopener noreferrer"
            class="relative w-full h-30 p-4 flex flex-col justify-start"
            @mouseenter="playStripes($event,index)"
        >
          <div class="pointer-events-none absolute inset-0" aria-hidden="true">
            <span
                v-for="n in stripeCounts[index]"
                :key="n"
                class="stripe absolute left-0 -top-1/2 h-[200%] opacity-0"
                :class="item.color ?? 'bg-sky-500 dark:bg-violet-300'"
            />
          </div>
          <div class="flex items-center gap-2">
            <img :src="item.avatar" alt="" class="w-10 h-10 rounded-full"/>
            <div class="flex flex-col">
              <div class="text-lg font-semibold">{{ item.name }}</div>
              <div class="text-sm text-old-neutral-500 dark:text-old-neutral-400">{{ item.owner }}</div>
            </div>
          </div>
          <div class="pt-2 text-sm text-old-neutral-600 dark:text-old-neutral-400">{{ item.description }}</div>
        </a>
      </div>
    </div>
  </div>
</template>
