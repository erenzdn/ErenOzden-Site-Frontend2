/* eslint-disable @typescript-eslint/no-explicit-any */

const THREE_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
const VANTA_CELLS_URL =
  "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.cells.min.js";

function loadExternalScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export type VantaCellsOptions = {
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  color1?: number;
  color2?: number;
};

/**
 * Vanta Cells — üçü sırayla yükler, paralel iki useEffect arasındaki yarışı önler.
 */
export async function createVantaCellsEffect(
  el: HTMLElement | null,
  options: VantaCellsOptions,
): Promise<any | null> {
  if (!el || typeof window === "undefined") return null;

  try {
    await loadExternalScript(THREE_URL);
    if (!(window as any).THREE) return null;

    await loadExternalScript(VANTA_CELLS_URL);
    const VANTA = (window as any).VANTA;
    if (!VANTA?.CELLS) return null;

    // Elementin hala DOM üzerinde yer aldığından emin oluyoruz (Yüklenme süresince unmount edilmiş olabilir)
    if (!document.body.contains(el)) return null;

    return VANTA.CELLS({
      el,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      color1: 0x0,
      color2: 0xffffff,
      ...options,
    });
  } catch {
    return null;
  }
}
