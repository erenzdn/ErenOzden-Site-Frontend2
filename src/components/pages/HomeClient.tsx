'use client';

import dynamic from 'next/dynamic';
import Preloader from '@/components/sections/Preloader';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';

// Below-the-fold component'leri lazy load
const Services = dynamic(() => import('@/components/sections/Services'), {
  loading: () => null,
});

const Portfolio = dynamic(() => import('@/components/sections/Portfolio'), {
  loading: () => null,
});

const CTA = dynamic(() => import('@/components/sections/CTA'), {
  loading: () => null,
});

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => null,
});

export default function HomeClient() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio isHome={true} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
