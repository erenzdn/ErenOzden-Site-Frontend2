type LenisControls = {
  stop: () => void;
  start: () => void;
};

let lenisInstance: LenisControls | null = null;

export function setLenisInstance(instance: LenisControls | null): void {
  lenisInstance = instance;
}

export function getLenisInstance(): LenisControls | null {
  return lenisInstance;
}

export function pauseLenis(): void {
  lenisInstance?.stop();
}

export function resumeLenis(): void {
  lenisInstance?.start();
}
