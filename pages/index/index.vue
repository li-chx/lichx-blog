<script setup lang="ts">

import type { NavigationMenuItem } from '@nuxt/ui';

const items = ref<NavigationMenuItem[]>([
  {
    label: '首页',
    icon: 'i-lucide-home',
    to: '/',
  },
  {
    label: '归档',
    icon: 'i-lucide-paperclip',
    to: '/archive',
  },
  {
    label: '关于',
    icon: 'i-lucide-info',
    to: '/about',
  },
  {
    label: 'Contact',
    to: '/contact',
  },
]);
useColorMode().preference = 'light';
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <UApp>
      <div class="w-full flex justify-center">
        <div class="xl:w-[1220px] lg:w-[964px] md:w-[708px]">
        <UNavigationMenu :items="items" class="w-full"/>
        <NuxtPage />
        </div>
      </div>
    </UApp>
  </div>
</template>

<style scoped>

</style>
