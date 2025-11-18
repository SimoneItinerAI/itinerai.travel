import { useEffect, useRef, useState } from 'react';

export default function WhatIsItinerAI() {
  const itinerary = [
    {
      title: 'Giorno 1 — Colosseo e Centro Storico',
      lines: ['Arrivo e check-in', 'Passeggiata serale nel centro'],
    },
    {
      title: 'Giorno 2 — Musei Vaticani e San Pietro',
      lines: ['Tour culturale', 'Pranzo tipico'],
    },
    {
      title: 'Giorno 3 — Trastevere e Tramonto al Gianicolo',
      lines: ['Passeggiata nei vicoli', 'Cena tradizionale'],
    },
  ];

  const [visibleDays, setVisibleDays] = useState(0);
  const [shownLines, setShownLines] = useState<number[]>(Array(itinerary.length).fill(0));
  const itineraryRef = useRef(itinerary);
  const [currentDay, setCurrentDay] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [pulseTick, setPulseTick] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [enableTilt, setEnableTilt] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setEnableTilt(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const timers: number[] = [];
    const intervals: number[] = [];
    if (!inView) {
      setVisibleDays(0);
      setShownLines(Array(itineraryRef.current.length).fill(0));
      setTypedCount(0);
      setCurrentDay(0);
      return () => {};
    }

    const revealDay = (d: number) => {
      if (!mounted) return;
      setCurrentDay(d);
      setVisibleDays(v => Math.max(v, d + 1));
      const total = itineraryRef.current[d].lines.length;
      let lineIndex = 0;
      const typeLine = () => {
        if (!mounted) return;
        const line = itineraryRef.current[d].lines[lineIndex] ?? '';
        setTypedCount(0);
        const iv = window.setInterval(() => {
          if (!mounted) { window.clearInterval(iv); return; }
          setTypedCount(c => {
            const next = c + 1;
            if (next >= line.length) {
              window.clearInterval(iv);
              const cursorHold = window.setTimeout(() => {
                setShownLines(prev => {
                  const copy = [...prev];
                  copy[d] = lineIndex + 1;
                  return copy;
                });
                setPulseTick(t => t + 1);
                lineIndex += 1;
                if (lineIndex < total) {
                  const to = window.setTimeout(typeLine, 140);
                  timers.push(to);
                } else if (d + 1 < itineraryRef.current.length) {
                  const to = window.setTimeout(() => revealDay(d + 1), 320);
                  timers.push(to);
                }
              }, 200);
              timers.push(cursorHold);
            }
            return next;
          });
        }, 14);
        intervals.push(iv);
      };
      typeLine();
    };

    const start = window.setTimeout(() => revealDay(0), 200);
    timers.push(start);

    return () => {
      mounted = false;
      timers.forEach(t => window.clearTimeout(t));
      intervals.forEach(i => window.clearInterval(i));
    };
  }, [inView]);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative" style={{ perspective: '1200px' }}>
            <style>{`
              @keyframes fadeUpDay { 0%{opacity:0; transform:translateY(6px)} 100%{opacity:1; transform:translateY(0)} }
              @keyframes fadeLine { 0%{opacity:0; transform:translateY(4px)} 100%{opacity:1; transform:translateY(0)} }
              @keyframes blink { 0%,40%{opacity:1} 50%,100%{opacity:0} }
              .title-glow { text-shadow: 0 0 10px rgba(255,138,61,0.25); }
              @keyframes neonPulse { 0%{opacity:.35; box-shadow:0 0 0 rgba(59,130,246,0)} 50%{opacity:.75; box-shadow:0 0 12px rgba(59,130,246,0.35)} 100%{opacity:.35; box-shadow:0 0 0 rgba(59,130,246,0)} }
            `}</style>
            <div
              className="relative bg-brand-night rounded-3xl p-8 shadow-md border border-white/10 min-h-[24rem] overflow-hidden"
              onMouseMove={(e) => {
                if (!enableTilt) return;
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const max = 6;
                setTiltY(((x - cx) / cx) * max);
                setTiltX(-((y - cy) / cy) * max);
              }}
              onMouseLeave={() => { if (!enableTilt) return; setTiltX(0); setTiltY(0); }}
              style={{ transform: enableTilt ? `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` : undefined, transition: 'transform 300ms ease', willChange: 'transform' }}
            >
              <div key={pulseTick} className="absolute left-0 top-0 bottom-0 w-[2px]">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-40" style={{ background: 'linear-gradient(to bottom, rgba(59,130,246,0.65), rgba(255,138,61,0.55))', animation: 'neonPulse 0.35s ease-out' }}></div>
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,138,61,.08), rgba(59,130,246,.06) 50%, transparent 70%)', transform: enableTilt ? `translateX(${tiltY * 2}px) translateY(${tiltX * -2}px)` : undefined }}></div>
              <style>{`@keyframes dashMoveCard { 0%{ stroke-dashoffset: 0 } 100%{ stroke-dashoffset: -400 }`}</style>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.75" />
                  </linearGradient>
                  <filter id="cardGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.4" result="bl" />
                    <feMerge>
                      <feMergeNode in="bl" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect x="1.5" y="1.5" width="97" height="97" rx="18" ry="18" fill="none" stroke="url(#cardGrad)" strokeWidth="1.4" strokeLinecap="round" filter="url(#cardGlow)" style={{ strokeDasharray: '48 352', animation: 'dashMoveCard 3s linear infinite', opacity: 0.85 }} />
              </svg>
              {itinerary.map((day, d) => (
                <div
                  key={d}
                  className={`transition-all duration-[340ms] ${visibleDays >= d + 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} mb-6`}
                  style={visibleDays >= d + 1 ? { animation: 'fadeUpDay 0.34s ease-out forwards' } : undefined}
                >
                  <h3 className="text-slate-100 font-semibold title-glow">{day.title}</h3>
                  <div className="mt-1 h-[2px] w-24 bg-gradient-to-r from-brand-orange/60 to-brand-blue/60 blur-[1px] opacity-60"></div>
                  <ul className="mt-2 space-y-1 text-slate-300 text-sm leading-relaxed">
                    {day.lines.slice(0, shownLines[d] ?? 0).map((line, j) => (
                      <li key={`${d}-${j}`} style={{ animation: 'fadeLine 0.32s ease-out forwards' }}>{line}</li>
                    ))}
                    {currentDay === d && (shownLines[d] ?? 0) < day.lines.length ? (
                      <li key={`${d}-typing`}>
                        {day.lines[shownLines[d] ?? 0].slice(0, typedCount)}
                        <span style={{ animation: 'blink 1s step-end infinite' }} className="inline-block w-[1ch]">|</span>
                      </li>
                    ) : null}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Text content */}
        <div>
          <style>{`
            @keyframes badgePulse { 0%{transform:scale(1); box-shadow:0 0 0 rgba(0,0,0,0)} 50%{transform:scale(1.08); box-shadow:0 0 10px rgba(59,130,246,0.15)} 100%{transform:scale(1); box-shadow:0 0 0 rgba(0,0,0,0)} }
          `}</style>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
          Il tuo viaggio, <span className="text-transparent bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text">creato in tempo reale</span>
          </h2>
          <div className="h-[2px] w-28 bg-gradient-to-r from-brand-orange/60 to-brand-blue/60 blur-[0.5px] mb-6"></div>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Dalla scelta del volo alla prenotazione dell'hotel, fino ai ristoranti locali e ai luoghi imperdibili — ItinerAI analizza milioni di dati e costruisce per te l'esperienza perfetta.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              Ogni itinerario è unico, come il tuo modo di viaggiare.
            </p>

            <div className="mt-8 flex gap-3 items-center">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-[1px]">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #FF8A3D, #FDAF6E)', animation: 'badgePulse 1.6s ease-in-out infinite' }}></div>
                <span className="text-slate-700 font-medium">IA generativa</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-[1px]">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #3B82F6, #6AA7FA)', animation: 'badgePulse 1.6s ease-in-out infinite' }}></div>
                <span className="text-slate-700 font-medium">Personalizzato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
