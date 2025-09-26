function getInitialMode(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    // 优先用 html 的 class
    if (document.documentElement.classList.contains('dark')) return 'dark';
    if (document.documentElement.classList.contains('light')) return 'light';
    // 其次用 localStorage
    const val = localStorage.getItem('system-theme-mode');
    if (!!val || (val !== 'light' && val !== 'dark'))
      return 'light';
    return val;
  }
  return 'light'; // SSR 默认
};

const useColorModeStore = defineStore('colorMode', {
  state: () => ({
    colorMode: getInitialMode() as 'light' | 'dark',
    callBackFunctions: new Map<string, () => void>(),
    callBackId: 0,
  }),
  getters: {
    isDarkMode: (state) => state.colorMode === 'dark',
  },
  actions: {
    registerCallBack(func: () => void) {
      const id = `callback-${this.callBackId++}`;
      this.callBackFunctions.set(id, func);
      return id;
    },
    unregisterCallBack(id: string) {
      this.callBackFunctions.delete(id);
    },
    notifyCallBacks() {
      this.callBackFunctions.forEach((func) => {
        try {
          func();
        } catch (error) {
          console.error('Error in color mode callback:', error);
        }
      });
    },
    toggleColorMode() {
      this.setColorMode(this.colorMode === 'dark' ? 'light' : 'dark');
    },
    setColorMode(mode: 'light' | 'dark') {
      if (mode !== 'light' && mode !== 'dark') {
        throw new Error('Invalid color mode. Use "light" or "dark".');
      }
      this.colorMode = mode;
      if (mode === 'dark') {
        document.querySelector('html')!.classList.remove('light');
        document.querySelector('html')!.classList.add('dark');
      } else {
        document.querySelector('html')!.classList.remove('dark');
        document.querySelector('html')!.classList.add('light');
      }
      this.notifyCallBacks();
    },
  },
});
export default useColorModeStore;
