'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Building2, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EarthquakeModuleShowcaseProps {
  locale: 'tr' | 'en';
}

interface FeatureItem {
  id: string;
  step: string;
  badge: string;
  title: string;
  desc: string;
  image: string;
  icon: React.ComponentType<any>;
}

export default function EarthquakeModuleShowcase({ locale }: EarthquakeModuleShowcaseProps) {
  const isTr = locale === 'tr';

  const steps: FeatureItem[] = [
    {
      id: 'location',
      step: '01',
      badge: isTr ? 'Adres & Konum' : 'Address & Location',
      title: isTr ? 'Coğrafi Konum Belirleme' : 'GIS Location Pinpointing',
      desc: isTr 
        ? 'Binanın deprem riskini ölçmek için ilk adımda interaktif harita üzerinden nokta atışı konum belirlenir. Sistem, seçilen koordinatların enlem ve boylam verilerini milimetrik olarak okur.'
        : 'To measure the seismic risk of the building, the exact coordinates are pinned on an interactive map. The system reads latitude and longitude parameters with millimetric accuracy.',
      image: '/projects/earthquake-check/form-step1-address.png',
      icon: MapPin,
    },
    {
      id: 'details',
      step: '02',
      badge: isTr ? 'Yapı Verileri' : 'Structural Data',
      title: isTr ? 'Yapısal Parametrelerin Girişi' : 'Structural Parameter Input',
      desc: isTr
        ? 'Binanın yapım yılı ve kat sayısı girilir. Bu veriler, Türkiye Bina Deprem Yönetmeliği (TBDY) standartlarına göre binanın yapısal rezonans katsayılarını hesaplamak için kullanılır.'
        : 'The construction year and number of stories are specified. These inputs are processed to calculate structural resonance coefficients in compliance with Turkish Building Earthquake Code standards.',
      image: '/projects/earthquake-check/form-step2-details.png',
      icon: Building2,
    },
    {
      id: 'simulation',
      step: '03',
      badge: isTr ? 'Simülasyon' : 'Simulation',
      title: isTr ? 'Sismik Simülasyon Motoru' : 'Seismic Simulation Engine',
      desc: isTr
        ? 'Koordinat verileri aktif fay hattı mesafeleriyle karşılaştırılır. Zemin spektrumu ve sismik PGA ivmeleri taranarak binanın deprem yükü kapasitesi simüle edilir.'
        : 'Geographic coordinates are cross-verified with active fault lines. Soil spectrum and peak ground acceleration (PGA) metrics are analyzed to simulate the building\'s load-bearing capacity.',
      image: '/projects/earthquake-check/form-step3-loading.png',
      icon: Activity,
    },
    {
      id: 'result',
      step: '04',
      badge: isTr ? 'Rapor & Skor' : 'Report & Score',
      title: isTr ? 'Ön Analiz Raporu ve Skorlama' : 'Preliminary Safety Report',
      desc: isTr
        ? 'Analiz sonunda yapısal güvenlik indeksi ve detaylı uzman tavsiyeleri içeren bir rapor üretilir. Binaya A\'dan F\'ye kadar bir güvenlik derecesi atanır.'
        : 'Upon completion, a comprehensive safety report with expert recommendations and a safety score ranging from A to F is generated, outlining the structure\'s vulnerability index.',
      image: '/projects/earthquake-check/form-step4-result.png',
      icon: ShieldCheck,
    },
  ];

  const [activeFeature, setActiveFeature] = useState<string>('location');
  const currentFeature = steps.find(f => f.id === activeFeature) || steps[0];

  return (
    <div className="space-y-6">
      {/* Desktop & Tablet Interactive Grid */}
      <div className="hidden md:grid grid-cols-[360px_1fr] gap-8 lg:gap-12 items-stretch min-h-[500px]">
        {/* Left Side: Step Selectors */}
        <div className="space-y-3 flex flex-col justify-center">
          {steps.map((feat) => {
            const isActive = activeFeature === feat.id;
            const Icon = feat.icon;
            
            return (
              <button
                key={feat.id}
                onClick={() => setActiveFeature(feat.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer select-none",
                  isActive
                    ? "bg-white/[0.03] border-white/15 shadow-xl shadow-black/40 translate-x-1"
                    : "bg-transparent border-transparent hover:bg-white/[0.01] hover:border-white/5"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg border transition-all duration-300",
                  isActive 
                    ? "bg-white text-dark border-white/20" 
                    : "bg-dark-lighter border-white/5 text-gray-light"
                )}>
                  <Icon size={18} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider text-gray uppercase font-semibold">
                      Step {feat.step}
                    </span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-mono",
                      isActive ? "bg-white/10 text-white" : "bg-white/5 text-gray-light"
                    )}>
                      {feat.badge}
                    </span>
                  </div>
                  <h4 className={cn(
                    "text-sm font-bold transition-colors",
                    isActive ? "text-white" : "text-gray-light"
                  )}>
                    {feat.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Showcase Viewport */}
        <div className="flex flex-col justify-between bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-md text-[11px] font-mono text-gray-light select-none">
              <Monitor size={10} className="text-gray" />
              <span>earthquakecheck.mehmeterenozden.com/{currentFeature.id === 'location' ? '' : currentFeature.id}</span>
            </div>
            <div className="w-12" /> {/* Spacer to align address bar in center */}
          </div>

          {/* Description Box (Above image for clean read) */}
          <div className="p-6 pb-2 border-b border-white/5">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded bg-white/5 border border-white/10 text-white">
                {currentFeature.badge}
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {currentFeature.title}
                <Sparkles size={14} className="text-white/40" />
              </h3>
              <p className="text-gray-text text-sm leading-relaxed max-w-3xl">
                {currentFeature.desc}
              </p>
            </div>
          </div>

          {/* Screenshot Render Container */}
          <div className="relative flex-1 min-h-[340px] w-full bg-black/20 p-4 flex items-center justify-center">
            <div className="relative w-full h-full aspect-[16/10] overflow-hidden rounded-lg border border-white/5 bg-black/10">
              <Image
                src={currentFeature.image}
                alt={currentFeature.title}
                fill
                className="object-contain p-2 hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 1024px) 80vw, 800px"
                quality={95}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Friendly Compact Viewport (Accordion style) */}
      <div className="md:hidden space-y-4">
        {steps.map((feat) => {
          const isActive = activeFeature === feat.id;
          const Icon = feat.icon;

          return (
            <div 
              key={feat.id}
              className={cn(
                "border rounded-xl transition-all duration-300 overflow-hidden bg-dark-card",
                isActive ? "border-white/15 shadow-lg" : "border-white/5"
              )}
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => setActiveFeature(isActive ? '' : feat.id)}
                className="w-full text-left p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg border",
                    isActive ? "bg-white text-dark border-white/20" : "bg-dark-lighter border-white/5 text-gray-light"
                  )}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-gray font-semibold">
                        Step {feat.step}
                      </span>
                      <span className="px-1 py-0.5 rounded bg-white/5 text-[9px] font-mono text-gray-light">
                        {feat.badge}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {feat.title}
                    </h4>
                  </div>
                </div>
                <span className={cn("text-xs transition-transform duration-300", isActive ? "rotate-90 text-white" : "text-gray")}>
                  →
                </span>
              </button>

              {/* Accordion Content */}
              {isActive && (
                <div className="p-4 pt-0 border-t border-white/5 space-y-4 bg-black/20">
                  <p className="text-gray-text text-xs leading-relaxed mt-4">
                    {feat.desc}
                  </p>
                  
                  {/* Mockup Frame */}
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/5 bg-black/40">
                    <Image
                      src={feat.image}
                      alt={feat.title}
                      fill
                      className="object-contain p-1"
                      sizes="100vw"
                      quality={90}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
