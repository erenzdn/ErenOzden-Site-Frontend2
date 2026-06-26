'use client';

/**
 * Client-side Layout Wrapper
 * SmoothScroll gibi client-only component'leri wrap eder
 */

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// SmoothScroll'u dynamic import yap (client component içinde)
const SmoothScroll = dynamic(
  () => import('@/components/providers/SmoothScroll'),
  {
    ssr: false,
    loading: () => null,
  }
);

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
