<script setup lang="tsx">
const techStack = ['Vue', 'Nuxt', 'TypeScript', 'Python', 'Java', 'C#', 'Rust'];
const techStackPercent = [86, 80, 92, 75, 60, 90, 50];
const techStackIconNames = ['mdi:vuejs', 'lineicons:nuxt', 'mdi:language-typescript', 'mdi:language-python', 'mdi:language-java', 'mdi:language-csharp', 'mdi:language-rust'];
const techStackThemeColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#98D8C8', '#F7DC6F', '#BB8FCE'];
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div>
    <div class="light:bg-old-neutral-200 dark:bg-old-neutral-800 p-5 mt-3 transition-colors duration-300">
      <div class="text-2xl pb-2">关于作者</div>
      lichx，目前就读于武汉理工大学，技术涉猎广泛但不精，仍在持续学习中 <br/>
    </div>
    <div class="light:bg-old-neutral-200 dark:bg-old-neutral-800 p-5 mt-3 transition-colors duration-300">
      <div class="text-2xl pb-2">技术栈（相对熟练度）</div>
      <TechStackCard
          v-if="mounted" async-key="about page" :tech-stack="techStack"
          :tech-stack-percent="techStackPercent" :tech-stack-icon-names="techStackIconNames"
          :tech-stack-theme-colors="techStackThemeColors"/>
    </div>
    <div class="light:bg-old-neutral-200 dark:bg-old-neutral-800 p-5 mt-3 transition-colors duration-300">
      <div class="text-2xl pb-2">在其他渠道关注 / 联系我</div>
      <a href="https://github.com/li-chx" title="github，不常用">
        <icon name="mdi:github" class="inline-block w-10 h-10 mr-4"/>
      </a>
      <a href="https://git.lichx.top/li_chx" title="gitea，主要代码托管平台">
        <icon name="pajamas:gitea" class="inline-block w-10 h-10 mr-4"/>
      </a>
      <a href="https://leetcode.cn/u/gallant-paynekan/" title="leetcode，刷点水题骗骗自己">
        <icon name="tabler:brand-leetcode" class="inline-block w-10 h-10 mr-4"/>
      </a>
      <a href="mailto:751176501@qq.com" title="能不能看见全看运气">
        <icon name="material-symbols:mail-rounded" class="inline-block w-10 h-10"/>
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>
