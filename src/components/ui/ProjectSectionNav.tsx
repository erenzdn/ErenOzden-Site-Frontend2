'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { scrollToElement, subscribeToScroll } from '@/lib/lenisControls';

export interface ProjectNavSection {
  id: string;
  number: string;
  title: string;
}

interface ProjectSectionNavProps {
  sections: ProjectNavSection[];
  locale?: 'tr' | 'en';
  className?: string;
}

const SCROLL_OFFSET = -128;
/** Viewport üstünden anchor çizgisi — header altı */
const ANCHOR_RATIO = 0.28;

function resolveActiveSection(sectionIds: string[]): string {
  const anchorLine = window.innerHeight * ANCHOR_RATIO;

  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const el = document.getElementById(sectionIds[i]);
    if (!el) continue;

    const { top } = el.getBoundingClientRect();
    if (top <= anchorLine) {
      return sectionIds[i];
    }
  }

  return sectionIds[0];
}

function isNearPageBottom(sectionIds: string[]): boolean {
  const lastEl = document.getElementById(sectionIds[sectionIds.length - 1]);
  if (!lastEl) return false;
  return lastEl.getBoundingClientRect().bottom <= window.innerHeight + 96;
}

export default function ProjectSectionNav({
  sections,
  locale = 'tr',
  className,
}: ProjectSectionNavProps) {
  const isTr = locale === 'tr';
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number | null>(null);
  const sectionIdsRef = useRef(sections.map((s) => s.id));

  useEffect(() => {
    sectionIdsRef.current = sections.map((s) => s.id);
  }, [sections]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
      setVisible(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || sections.length === 0) return;

    const update = () => {
      const ids = sectionIdsRef.current;
      setActiveId(resolveActiveSection(ids));
      setVisible(!isNearPageBottom(ids));
    };

    const scheduleUpdate = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    const unsubscribeLenis = subscribeToScroll(scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      unsubscribeLenis();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mounted, sections.length]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    scrollToElement(el, { offset: SCROLL_OFFSET });
  }, []);

  if (!mounted || sections.length <= 1) return null;

  const activeIndex = sections.findIndex((s) => s.id === activeId);

  return (
    <>
      <motion.nav
        aria-label={isTr ? 'Sayfa bölümleri' : 'Page sections'}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={cn(
          'fixed right-4 sm:right-6 md:right-8 lg:right-10 xl:right-12 top-1/2 -translate-y-1/2 z-40',
          'hidden lg:flex flex-col max-w-[240px]',
          visible ? 'pointer-events-auto' : 'pointer-events-none',
          className
        )}
      >
        <div className="absolute -inset-3 bg-dark/30 backdrop-blur-xl rounded-2xl border border-white/5" />

        <div className="relative z-10 p-2 space-y-0.5">
          <div className="px-3 py-2 mb-1 border-b border-white/5">
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/30">
              {isTr ? 'Sayfa Bölümleri' : 'Page Sections'}
            </span>
          </div>

          {sections.map((section) => {
            const isActive = activeId === section.id;

            return (
              <motion.button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group flex items-center gap-2.5 text-left py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer w-full',
                  isActive
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-white/5 border border-transparent'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-mono tabular-nums shrink-0 min-w-8 text-center px-1.5 py-1 rounded-md transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/10 font-bold'
                      : section.number === '—'
                        ? 'text-white/25 bg-transparent'
                        : 'text-white/40 bg-white/5 group-hover:text-white/60'
                  )}
                >
                  {section.number}
                </span>

                <span
                  className={cn(
                    'text-xs truncate transition-colors duration-200',
                    isActive ? 'text-white font-semibold' : 'text-white/50 group-hover:text-white/80'
                  )}
                >
                  {section.title}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="projectSectionIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-primary ml-auto shrink-0"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
        transition={{ duration: 0.35 }}
        className={cn(
          'fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 lg:hidden',
          'flex items-center gap-2.5 px-4 py-2.5 max-w-[min(100vw-2rem,360px)]',
          'bg-dark/70 backdrop-blur-md rounded-full border border-white/10',
          visible ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <span className="text-primary text-xs font-mono font-bold tabular-nums shrink-0">
          {sections[activeIndex]?.number !== '—'
            ? sections[activeIndex]?.number
            : String(Math.max(activeIndex + 1, 1)).padStart(2, '0')}
        </span>

        <div className="w-px h-4 bg-white/10 shrink-0" />

        <span className="text-[11px] text-white/70 truncate font-medium min-w-0 flex-1">
          {sections[activeIndex]?.title}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={`mobile-${section.id}`}
                type="button"
                onClick={() => scrollToSection(section.id)}
                aria-label={section.title}
                className={cn(
                  'rounded-full transition-all duration-200',
                  isActive ? 'w-5 h-2 bg-primary' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                )}
              />
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
