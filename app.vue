<template>
  <div>
    <NuxtRouteAnnouncer/>
    <NuxtPage/>
  </div>
</template>

<script setup lang="ts">
import useColorModeStore from '~/stores/colorModeStore';

if (typeof window !== 'undefined') {
  const htmlClass = document.documentElement.classList;
  if (htmlClass.contains('dark')) useColorModeStore().setColorMode('dark');
  else if (htmlClass.contains('light')) useColorModeStore().setColorMode('light');
  else {
    // fallback
    const systemThemeMode = localStorage.getItem('system-theme-mode');
    if (systemThemeMode) useColorModeStore().setColorMode(systemThemeMode as 'light' | 'dark');
  }
}

onMounted(() => {
  const systemThemeMode = localStorage.getItem('system-theme-mode');
  if (systemThemeMode && (systemThemeMode === 'light' || systemThemeMode === 'dark')) {
    useColorModeStore().setColorMode(systemThemeMode);
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches)
      useColorModeStore().setColorMode('dark');
    else
      useColorModeStore().setColorMode('light');
  });
});

</script>
