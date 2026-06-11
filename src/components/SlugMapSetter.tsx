'use client';

import { useEffect } from 'react';
import { useSlugMap, type SlugMap } from '@/contexts/SlugMapContext';

interface SlugMapSetterProps {
  slugMap: SlugMap | null;
  basePath: string | null;
}

/**
 * SlugMapSetter
 * 
 * Server Component'tan gelen slug haritasını SlugMapContext'e aktarır.
 * Bu bileşen sayfanın en üstünde render edilmeli (Header'dan önce).
 * 
 * Kullanım:
 * ```tsx
 * // Server Component içinde
 * const slugMap = { tr: 'web-tasarim', en: 'web-design' };
 * return (
 *   <>
 *     <SlugMapSetter slugMap={slugMap} basePath="/services" />
 *     <Header />
 *     ...
 *   </>
 * );
 * ```
 */
export function SlugMapSetter({ slugMap, basePath }: SlugMapSetterProps) {
  const { setSlugMap, clearSlugMap } = useSlugMap();

  useEffect(() => {
    if (slugMap && basePath) {
      setSlugMap(slugMap, basePath);
    }

    return () => {
      clearSlugMap();
    };
  }, [slugMap, basePath, setSlugMap, clearSlugMap]);

  return null;
}
