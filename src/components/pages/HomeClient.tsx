'use client';

import dynamic from 'next/dynamic';
import Preloader from '@/components/sections/Preloader';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import PortfolioClient, { type Project } from '@/components/sections/PortfolioClient';

// Below-the-fold component'leri lazy load
const Services = dynamic(() => import('@/components/sections/Services'), {
  loading: () => null,
});

const CTA = dynamic(() => import('@/components/sections/CTA'), {
  loading: () => null,
});

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => null,
});

interface HomeClientProps {
  projects: Project[];
}

export default function HomeClient({ projects }: HomeClientProps) {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Services />
        <PortfolioClient projects={projects} isHome={true} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
