<script setup lang="ts">
// onMounted(() =>
//   useColorMode().preference = 'dark',
// );
// function clickHandler() {
//   console.log('Button clicked');
//   useColorMode().preference = useColorMode().preference === 'light'? 'dark' : 'light';
// }

import useColorModeStore from '~/stores/colorModeStore';

// const { colorMode } = storeToRefs(useColorModeStore());
</script>

<template>
  <NuxtLayout :name="'user-layout'">
    <template #navbarLeft="{ isScrollDown } : { isScrollDown: boolean }">
      <Transition
          enter-active-class="transition-opacity duration-500 ease-in-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-500 ease-in-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div v-if="isScrollDown" class="pl-5 text-xl h-12 leading-11 flex">
          随机存取
        </div>
      </Transition>
    </template>
    <template #navbarRight>
      <div class="flex items-center h-full">
        <div class="flex-1"/>
        <div class="flex-1 flex  items-center justify-end duration500 ease-in-out">
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
                v-if="useColorModeStore().colorMode === 'dark'"
                key="dark"
                name="material-symbols:dark-mode"
                class="text-2xl cursor-pointer mr-5"
                @click="() => useColorModeStore().toggleColorMode()"
            />
            <Icon
                v-else
                key="light"
                name="material-symbols:clear-day-rounded"
                class="text-2xl cursor-pointer mr-5"
                @click="() => useColorModeStore().toggleColorMode()"
            />
          </Transition>
        </div>
      </div>
    </template>
    <template #header>
      <div class="w-full flex-1 justify-center flex items-center">
        <p class="text-8xl">
          随机存取
        </p>
      </div>
    </template>
    <template #content>
      <div>
        <NuxtRouteAnnouncer/>
        <NuxtPage/>
        <button
            @click="() => {
                 useColorModeStore().toggleColorMode();
            }
        ">swap Theme
        </button>
        <div class="min-h-[100vh]"></div>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex-1 justify-center flex items-center"></div>
    </template>
  </NuxtLayout>
</template>

<style scoped>

</style>
