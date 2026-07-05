export type LenisScrollInstance = {
  stop: () => void;
  start: () => void;
  scrollTo: (
    target: number | string | Element,
    options?: { offset?: number; immediate?: boolean; lock?: boolean; duration?: number }
  ) => void;
  on?: (event: string, callback: () => void) => void;
  off?: (event: string, callback: () => void) => void;
};

let lenisInstance: LenisScrollInstance | null = null;
const scrollListeners = new Set<() => void>();

export function setLenisInstance(instance: LenisScrollInstance | null): void {
  lenisInstance = instance;
}

export function getLenisInstance(): LenisScrollInstance | null {
  return lenisInstance;
}

export function subscribeToScroll(listener: () => void): () => void {
  scrollListeners.add(listener);
  return () => {
    scrollListeners.delete(listener);
  };
}

export function notifyScroll(): void {
  scrollListeners.forEach((listener) => listener());
}

export function pauseLenis(): void {
  lenisInstance?.stop();
}

export function resumeLenis(): void {
  lenisInstance?.start();
}

export function scrollToElement(
  element: HTMLElement,
  options?: { offset?: number; immediate?: boolean }
): void {
  const offset = options?.offset ?? -120;
  if (lenisInstance) {
    lenisInstance.scrollTo(element, { offset, immediate: options?.immediate });
    return;
  }
  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' });
}
