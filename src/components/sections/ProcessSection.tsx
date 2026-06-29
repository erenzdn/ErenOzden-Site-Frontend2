"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Check,
  ChevronRight,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

/* ─── Step animations ──────────────────────────────────────────────────── */

function RadarVisual() {
  return (
    <div className="relative w-full h-36 sm:h-44 flex items-center justify-center overflow-hidden select-none">
      <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-dashed border-white/10 animate-[spin_30s_linear_infinite]" />
      <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/12" />
      <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/18" />
      <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full animate-[spin_4s_linear_infinite]">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.18) 55deg, transparent 55deg)' }}
        />
      </div>
      <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_8px_2px_rgba(255,255,255,0.4)]" />
      <div className="absolute top-5 right-12 sm:top-7 sm:right-16 w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" style={{ animationDuration: '2.4s', animationDelay: '0.3s' }} />
      <div className="absolute bottom-7 left-10 sm:bottom-10 sm:left-14 w-1.5 h-1.5 rounded-full bg-white/50 animate-ping" style={{ animationDuration: '3.1s', animationDelay: '1.6s' }} />
      <div className="absolute top-10 left-8 sm:top-14 sm:left-10 w-1 h-1 rounded-full bg-white/60 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.9s' }} />
      <div className="absolute bottom-6 right-8 sm:bottom-8 sm:right-10 w-1 h-1 rounded-full bg-white/40 animate-ping" style={{ animationDuration: '2.8s', animationDelay: '2.2s' }} />
    </div>
  );
}

function TimelineVisual() {
  const nodes = ['Hedef', 'Analiz', 'Strateji', 'Plan'];
  return (
    <div className="relative w-full h-36 sm:h-44 flex items-center justify-center overflow-hidden px-4 sm:px-6 select-none">
      <div className="absolute h-0.5 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] bg-white/8 rounded-full" />
      <div
        className="absolute h-0.5 rounded-full bg-linear-to-r from-white/50 to-white/10"
        style={{ width: 'calc(100% - 2rem)', animation: 'expandWidth 2.5s ease-out forwards' }}
      />
      <div className="relative z-10 flex items-center justify-between w-full">
        {nodes.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white/70 backdrop-blur-sm"
              style={{ animation: `fadeUp 0.5s ease-out ${i * 220}ms both` }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <span
              className="text-[9px] sm:text-[10px] text-white/40 font-medium hidden xs:block"
              style={{ animation: `fadeUp 0.5s ease-out ${i * 220 + 150}ms both` }}
            >
              {label}
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full bg-white/50"
              style={{ animation: `scalePop 0.4s ease-out ${i * 220 + 80}ms both` }}
            />
          </div>
        ))}
      </div>
      <div
        className="absolute top-3 right-4 sm:top-4 sm:right-6 px-2 py-0.5 rounded-full bg-white/8 border border-white/12 text-[8px] sm:text-[9px] text-white/50 font-medium"
        style={{ animation: 'fadeUp 0.6s ease-out 1s both' }}
      >
        Sprint hazır
      </div>
    </div>
  );
}

function WireframeVisual() {
  return (
    <div className="relative w-full h-36 sm:h-44 flex items-center justify-center overflow-hidden select-none px-4">
      <div className="w-full max-w-[240px] sm:max-w-[260px] rounded-xl border border-white/18 bg-white/4 overflow-hidden backdrop-blur-sm" style={{ animation: 'fadeUp 0.5s ease-out both' }}>
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-white/5">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/20 animate-pulse" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '400ms' }} />
          <div className="flex-1 mx-2 h-1.5 sm:h-2 rounded-full bg-white/8" />
        </div>
        <div className="p-2.5 sm:p-3 flex flex-col gap-1.5 sm:gap-2">
          <div className="h-4 sm:h-6 w-3/4 rounded-lg bg-white/12" style={{ animation: 'slideIn 0.4s ease-out 0.3s both' }} />
          <div className="h-2 sm:h-3 w-full rounded-md bg-white/7" style={{ animation: 'slideIn 0.4s ease-out 0.5s both' }} />
          <div className="h-2 sm:h-3 w-5/6 rounded-md bg-white/7" style={{ animation: 'slideIn 0.4s ease-out 0.65s both' }} />
          <div className="mt-0.5 grid grid-cols-3 gap-1.5 sm:gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-8 sm:h-10 rounded-lg bg-white/8" style={{ animation: `slideIn 0.4s ease-out ${0.8 + i * 0.12}s both` }} />
            ))}
          </div>
          <div className="h-4 sm:h-6 w-1/3 rounded-lg bg-white/15 mt-0.5" style={{ animation: 'slideIn 0.4s ease-out 1.2s both' }} />
        </div>
      </div>
      <div
        className="absolute bottom-5 right-10 sm:bottom-7 sm:right-12 w-2.5 h-3 sm:w-3 sm:h-4 rounded-sm bg-white/60 animate-[bounce_1.2s_ease-in-out_infinite]"
        style={{ clipPath: 'polygon(0 0, 40% 0, 100% 50%, 40% 100%, 0 100%, 30% 50%)' }}
      />
    </div>
  );
}

const CODE_LINES = [
  { text: 'const project = await build({', indent: 0 },
  { text: "  stack: ['Next.js', 'Node'],", indent: 1 },
  { text: "  db: 'PostgreSQL',", indent: 1 },
  { text: '  deploy: vercel,', indent: 1 },
  { text: '});', indent: 0 },
];

function TerminalVisual() {
  return (
    <div className="relative w-full h-36 sm:h-44 flex items-center justify-center overflow-hidden select-none px-3 sm:px-6">
      <div className="w-full rounded-xl border border-white/15 bg-black/40 overflow-hidden backdrop-blur-sm" style={{ animation: 'fadeUp 0.5s ease-out both' }}>
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/8 bg-white/5">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/20" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/15" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/10" />
          <span className="ml-2 text-[8px] sm:text-[9px] text-white/30 font-mono">~/project</span>
        </div>
        <div className="p-2.5 sm:p-3 font-mono text-[10px] sm:text-[11px] leading-4 sm:leading-5 space-y-0.5">
          {CODE_LINES.map((line, i) => (
            <div
              key={i}
              className="text-white/60 truncate"
              style={{ animation: `fadeIn 0.3s ease-out ${i * 280 + 200}ms both`, paddingLeft: `${line.indent * 10}px` }}
            >
              {line.text}
            </div>
          ))}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-white/30">$</span>
            <span className="w-1.5 h-3 sm:h-3.5 bg-white/60 animate-[pulse_0.9s_ease-in-out_infinite] rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

const METRICS = [
  { label: 'Performans', value: 96 },
  { label: 'SEO', value: 100 },
  { label: 'Hız', value: 88 },
  { label: 'Güvenlik', value: 94 },
];

function MetricsVisual() {
  return (
    <div className="relative w-full h-36 sm:h-44 flex items-center justify-center overflow-hidden select-none px-4 sm:px-6">
      <div className="w-full space-y-2.5 sm:space-y-3">
        {METRICS.map((m, i) => (
          <div key={m.label} className="flex items-center gap-2 sm:gap-3" style={{ animation: `fadeUp 0.4s ease-out ${i * 150}ms both` }}>
            <span className="text-[10px] sm:text-[10px] text-white/50 font-medium w-16 sm:w-20 shrink-0">{m.label}</span>
            <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-white/60 to-white/30"
                style={{
                  width: `${m.value}%`,
                  animation: `barFill 1.1s ease-out ${i * 150 + 300}ms both`,
                  transformOrigin: 'left',
                } as React.CSSProperties}
              />
            </div>
            <span className="text-[10px] sm:text-[11px] text-white/60 font-semibold w-7 sm:w-8 text-right">{m.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RocketVisual() {
  return (
    <div className="relative w-full h-36 sm:h-44 flex items-center justify-center overflow-hidden select-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-white/50"
          style={{
            top: `${10 + (i * 13) % 70}%`,
            left: `${8 + (i * 17) % 84}%`,
            animation: `twinkle ${1.5 + (i % 3) * 0.7}s ease-in-out ${i * 0.3}s infinite alternate`,
          }}
        />
      ))}
      <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-white/8 animate-[spin_12s_linear_infinite]" />
      <div className="relative z-10 flex flex-col items-center" style={{ animation: 'rocketFly 2s ease-in-out infinite alternate' }}>
        <div className="w-0 h-0" style={{ borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '14px solid rgba(255,255,255,0.85)' }} />
        <div className="w-9 h-12 sm:w-10 sm:h-14 rounded-b-xl bg-white/15 border border-white/30 flex flex-col items-center justify-center gap-1.5">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/25 border border-white/40" />
          <div className="w-2.5 h-1 sm:w-3 sm:h-1.5 rounded-full bg-white/15" />
        </div>
        <div className="flex gap-0 -mt-2">
          <div className="w-0 h-0" style={{ borderTop: '9px solid transparent', borderRight: '9px solid rgba(255,255,255,0.25)', borderBottom: '0' }} />
          <div className="w-9 sm:w-10 h-2 bg-white/10 border-t border-white/10" />
          <div className="w-0 h-0" style={{ borderTop: '9px solid transparent', borderLeft: '9px solid rgba(255,255,255,0.25)', borderBottom: '0' }} />
        </div>
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 rounded-b-full bg-linear-to-b from-white/50 to-transparent"
              style={{ height: `${10 + i * 4}px`, animation: `flame ${0.4 + i * 0.1}s ease-in-out ${i * 0.1}s infinite alternate` }}
            />
          ))}
        </div>
      </div>
      <div className="absolute top-3 right-6 sm:top-4 sm:right-8 flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white/8 border border-white/12" style={{ animation: 'fadeIn 0.6s ease-out 0.8s both' }}>
        <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
        <span className="text-[8px] sm:text-[9px] text-white/60 font-semibold tracking-wide">CANLI</span>
      </div>
    </div>
  );
}

/* ─── Keyframes ────────────────────────────────────────────────────────── */
const KEYFRAMES = `
@keyframes expandWidth { from { width: 0 } to { width: calc(100% - 2rem) } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes scalePop { from { opacity: 0; transform: scale(0) } to { opacity: 1; transform: scale(1) } }
@keyframes slideIn { from { opacity: 0; transform: scaleX(0); transform-origin: left } to { opacity: 1; transform: scaleX(1) } }
@keyframes barFill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes rocketFly { from { transform: translateY(4px) } to { transform: translateY(-6px) } }
@keyframes flame { from { opacity: 0.5; transform: scaleY(0.7) } to { opacity: 1; transform: scaleY(1.2) } }
@keyframes twinkle { from { opacity: 0.1 } to { opacity: 0.8 } }
`;

/* ─── Types & metadata ─────────────────────────────────────────────────── */
interface ProcessStep {
  number: string;
  title: string;
  description: string;
  details: string;
}

interface ProcessSectionProps {
  title: string;
  description: string;
  steps: ProcessStep[];
}

interface StepMeta {
  duration: string;
  activities: string[];
  Visual: () => React.JSX.Element;
}

const stepMetas: StepMeta[] = [
  {
    duration: '1–2 Gün',
    activities: ['İhtiyaç & hedef analizi', 'Rakip & pazar araştırması', 'Kullanıcı persona tanımı', 'Teknik fizibilite değerlendirmesi'],
    Visual: RadarVisual,
  },
  {
    duration: '2–3 Gün',
    activities: ['Detaylı yol haritası', 'Teknik mimari tasarımı', 'Sprint & milestone planı', 'Kaynak & süre tahmini'],
    Visual: TimelineVisual,
  },
  {
    duration: '3–7 Gün',
    activities: ['Wireframe & kullanıcı akışı', 'UI/UX tasarım sistemi', 'İnteraktif prototip', 'Kullanıcı testi & iterasyon'],
    Visual: WireframeVisual,
  },
  {
    duration: '1–8 Hafta',
    activities: ['Frontend & backend geliştirme', 'API entegrasyonları', 'Agile sprint döngüleri', 'Code review & kalite kontrolü'],
    Visual: TerminalVisual,
  },
  {
    duration: '3–5 Gün',
    activities: ['Unit & entegrasyon testleri', 'Performans optimizasyonu', 'SEO & erişilebilirlik denetimi', 'Güvenlik taraması'],
    Visual: MetricsVisual,
  },
  {
    duration: '1–2 Gün',
    activities: ['Canlı deploy & yayınlama', 'Gerçek zamanlı izleme', 'Dökümantasyon teslimi', '30 gün ücretsiz destek'],
    Visual: RocketVisual,
  },
];

/* ─── Main component ───────────────────────────────────────────────────── */
export default function ProcessSection({ title, description, steps }: ProcessSectionProps) {
  const [activeStep, setActiveStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

  /* Mobilde adım değiştiğinde info kartına scroll et */
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeStep]);

  const current = steps[activeStep];
  const meta = stepMetas[activeStep] ?? stepMetas[0];
  const { Visual } = meta;

  return (
    <div className="mb-24">
      <style>{KEYFRAMES}</style>

      {/* Başlık */}
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-heading font-bold text-white mb-3 sm:mb-4">{title}</h2>
        <p className="text-gray-text text-base sm:text-lg max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start">

        {/* ── Sağ panel — mobilde ÜSTTE, masaüstünde sağda ── */}
        <div ref={cardRef} className="order-1 lg:order-2 lg:sticky lg:top-24 scroll-mt-24">
          <div
            key={activeStep}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 bg-white/5 animate-in fade-in zoom-in-95 duration-500"
          >
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.7) 1px, transparent 0)', backgroundSize: '28px 28px' }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-white/6 via-transparent to-white/2 pointer-events-none" />
            <div className="absolute top-0 left-0 w-10 h-10 sm:w-14 sm:h-14 border-l-2 border-t-2 border-white/20 rounded-tl-2xl sm:rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-14 sm:h-14 border-r-2 border-b-2 border-white/20 rounded-br-2xl sm:rounded-br-3xl pointer-events-none" />

            {/* Animasyon alanı */}
            <div className="relative z-10 border-b border-white/8">
              <Visual />
            </div>

            {/* Bilgi alanı */}
            <div className="relative z-10 p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">

              {/* Badge + süre */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/15 border border-white/30 flex items-center justify-center">
                    <span className="text-xs font-heading font-bold text-white">{current.number}</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-white/45 uppercase tracking-wider sm:tracking-widest">
                    Adım {parseInt(current.number, 10)} / {steps.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/15">
                  <Clock size={10} className="text-white/55 sm:hidden" />
                  <Clock size={11} className="text-white/55 hidden sm:block" />
                  <span className="text-[10px] sm:text-[11px] text-white/65 font-medium">{meta.duration}</span>
                </div>
              </div>

              {/* Başlık + açıklama */}
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-1 sm:mb-1.5 leading-tight">{current.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{current.description}</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-linear-to-r from-transparent via-white/12 to-transparent" />

              {/* Aktiviteler */}
              <div>
                <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-2.5 sm:mb-3">
                  Bu Aşamada Yapılanlar
                </p>
                {/* Mobilde tek sütun, sm'de iki sütun */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {meta.activities.map((activity) => (
                    <div
                      key={activity}
                      className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/6 border border-white/8 hover:bg-white/10 hover:border-white/18 transition-all duration-300"
                    >
                      <div className="shrink-0 w-4 h-4 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
                        <CheckCircle2 size={9} className="text-white/75" />
                      </div>
                      <span className="text-[11px] sm:text-[11px] text-white/80 leading-snug">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-linear-to-r from-transparent via-white/12 to-transparent" />

              {/* Nav + sonraki */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`rounded-full transition-all duration-500 ${
                        i === activeStep
                          ? 'w-6 sm:w-7 h-2 bg-white shadow-sm shadow-white/30'
                          : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                      }`}
                      aria-label={`Adım ${i + 1}`}
                    />
                  ))}
                </div>
                {activeStep < steps.length - 1 && (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-white/55 hover:text-white transition-colors duration-200 group"
                  >
                    Sonraki adım
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="flex gap-1 sm:gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === activeStep ? 'bg-white flex-1' : i < activeStep ? 'bg-white/40 w-4 sm:w-5' : 'bg-white/12 w-4 sm:w-5'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── Sol liste — mobilde ALTTA, masaüstünde solda ── */}
        <div className="order-2 lg:order-1 space-y-3 sm:space-y-4">
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;
            return (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left group relative transition-all duration-500 ${isActive ? 'scale-[1.01] sm:scale-[1.02]' : ''}`}
              >
                {isActive && <div className="absolute -inset-1 bg-white/10 rounded-3xl blur-xl animate-pulse" />}

                <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 ${
                  isActive
                    ? 'bg-white/15 border-white/40 shadow-2xl shadow-white/10'
                    : 'bg-white/6 border-white/10 hover:border-white/25 hover:bg-white/10 hover:shadow-lg'
                }`}>
                  <div className={`absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-1000 ${isActive ? 'group-hover:translate-x-full' : ''}`} />

                  <div className="relative z-10 p-4 sm:p-5 flex items-center gap-3 sm:gap-5">
                    {/* Numara */}
                    <div className={`shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center font-heading font-bold transition-all duration-500 ${
                      isActive
                        ? 'bg-white text-dark scale-110 shadow-lg shadow-white/30'
                        : isCompleted
                          ? 'bg-white/25 text-white shadow-md'
                          : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:scale-105'
                    }`}>
                      {isCompleted
                        ? <Check size={20} className="animate-in zoom-in duration-300" />
                        : <span className="text-base sm:text-lg">{step.number}</span>
                      }
                    </div>

                    {/* Metin */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm sm:text-base md:text-lg font-heading font-bold mb-1 transition-all duration-300 ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed transition-all duration-300 line-clamp-2 ${isActive ? 'text-white/85' : 'text-gray-text group-hover:text-gray-200'}`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Ok */}
                    <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? 'bg-white/20 text-white rotate-0'
                        : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70 -rotate-45 group-hover:rotate-0'
                    }`}>
                      <ChevronRight size={16} className="sm:hidden" />
                      <ChevronRight size={20} className="hidden sm:block" />
                    </div>
                  </div>

                  {isActive && (
                    <>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 rounded-l-full" />
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 rounded-full bg-white animate-pulse" />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
