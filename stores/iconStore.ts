import { loadIcon } from '@iconify/vue';
import { iconToHTML, iconToSVG, replaceIDs } from '@iconify/utils';

// call await set first, then call getIcon or getColoredIcon
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
      if (!iconData) {
        try {
          const data = await loadIcon(iconName);
          const { body, attributes } = iconToSVG(data, {
            width: '100%',
            height: '100%',
          });

          iconData = iconToHTML(replaceIDs(body), attributes);
        } catch (e) {
          console.error(e);
          iconData = '';
        }
      }
      if (iconData) {
        this.iconCache.set(iconName, iconData);
      }
      this.addingSet.delete(iconName);
      this.waitingCallbackFunctions.get(iconName)?.forEach((callback) => callback());
      this.waitingCallbackFunctions.delete(iconName);
    },
  },
});

export default useIconStore;
