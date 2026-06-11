"use client";

import Preloader from "@/components/sections/Preloader";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
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
