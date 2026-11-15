const KEY: InjectionKey<Ref<number>> = Symbol('navbarHeight');

export function provideNavbarHeight(h: Ref<number>) {
  provide(KEY, h);
}

export function injectNavbarHeight(): Ref<number> {
  return inject(KEY, ref(48));
}
