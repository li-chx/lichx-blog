const useIconStore = defineStore('icon', {
  state: () => ({
    iconCache: new Map<string, string>(),
    addingSet: new Set<string>(),
    waitingCallbackFunctions: new Map<string, (() => void)[]>(),
  }),
  actions: {
    getIcon(iconName: string): string {
      if (this.iconCache.has(iconName)) {
        return this.iconCache.get(iconName) as string;
      }
      return '';
    },
    getColoredIcon(iconName: string, color: string): string {
      const icon = this.getIcon(iconName);
      if (icon === '')
        return '';
      return icon.replace('<svg', `<svg style="color:${color};"`);
    },
    async setIconInfo(iconName: string, iconData?: string) {
      if (this.iconCache.has(iconName)) {
        return;
      }
      if (this.addingSet.has(iconName)) {
        return new Promise<void>((resolve) => {
          if (!this.waitingCallbackFunctions.has(iconName)) {
            this.waitingCallbackFunctions.set(iconName, [resolve]);
          } else
            this.waitingCallbackFunctions.get(iconName)!.push(resolve);
        });
      }
      this.addingSet.add(iconName);
      if (iconData === undefined || iconData === null || iconData === '') {
        this.iconCache.set(iconName, await fetchSvg(iconName));
      } else
        this.iconCache.set(iconName, iconData as string);
      this.addingSet.delete(iconName);
      this.waitingCallbackFunctions.get(iconName)?.forEach((callback) => callback());
      this.waitingCallbackFunctions.delete(iconName);
    },

  },
});
export default useIconStore;

export async function fetchSvg(svgName: string, maxRetries = 3) {
  const iconifyUrl = 'https://api.iconify.design/';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await (await $fetch<Blob>(iconifyUrl + svgName + '.svg', {
        method: 'GET',
        params: {
          width: '100%',
        },
      })).text();
    } catch (error) {
      console.warn(`Attempt ${attempt} failed for ${svgName}:`, error);

      if (attempt === maxRetries) {
        console.error(`All ${maxRetries} attempts failed for ${svgName}`);
      }

      // 等待一段时间后重试（可选）
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return '<svg></svg>';
}
