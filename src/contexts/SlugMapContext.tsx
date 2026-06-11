'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { type Locale } from '@/i18n/routing';

/**
 * Slug haritası tipi
 * Her locale için o dildeki slug değerini tutar
 * Örn: { tr: 'web-tasarim', en: 'web-design' }
 */
export type SlugMap = Partial<Record<Locale, string>>;

interface SlugMapContextType {
  slugMap: SlugMap | null;
  basePath: string | null;
  setSlugMap: (map: SlugMap | null, basePath: string | null) => void;
  clearSlugMap: () => void;
}

const SlugMapContext = createContext<SlugMapContextType>({
  slugMap: null,
  basePath: null,
  setSlugMap: () => {},
  clearSlugMap: () => {},
});

/**
 * SlugMapProvider
 * 
 * Dinamik sayfalarda (services/[slug], portfolio/[id]) lokalize edilmiş
 * slug'ların diğer dillerdeki karşılıklarını tutar.
 * 
 * Bu sayede LanguageSwitcher, dil değiştirirken doğru slug'a yönlendirebilir.
 */
export function SlugMapProvider({ children }: { children: ReactNode }) {
  const [slugMap, setSlugMapState] = useState<SlugMap | null>(null);
  const [basePath, setBasePath] = useState<string | null>(null);

  const setSlugMap = useCallback((map: SlugMap | null, path: string | null) => {
    setSlugMapState(map);
    setBasePath(path);
  }, []);

  const clearSlugMap = useCallback(() => {
    setSlugMapState(null);
    setBasePath(null);
  }, []);

  return (
    <SlugMapContext.Provider value={{ slugMap, basePath, setSlugMap, clearSlugMap }}>
      {children}
    </SlugMapContext.Provider>
  );
}

/**
 * useSlugMap hook
 * 
 * LanguageSwitcher ve diğer bileşenlerde slug haritasına erişim için kullanılır.
 */
export function useSlugMap() {
  const context = useContext(SlugMapContext);
  if (!context) {
    throw new Error('useSlugMap must be used within a SlugMapProvider');
  }
  return context;
}
