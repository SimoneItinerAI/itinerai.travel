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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
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
              setShownLines(prev => {
                const copy = [...prev];
                copy[d] = lineIndex + 1;
                return copy;
              });
              lineIndex += 1;
              if (lineIndex < total) {
                const to = window.setTimeout(typeLine, 220);
                timers.push(to);
              } else if (d + 1 < itineraryRef.current.length) {
                const to = window.setTimeout(() => revealDay(d + 1), 480);
                timers.push(to);
              }
            }
            return next;
          });
        }, 160);
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
          <div className="relative">
            <style>{`
              @keyframes fadeUpDay { 0%{opacity:0; transform:translateY(6px)} 100%{opacity:1; transform:translateY(0)} }
              @keyframes fadeLine { 0%{opacity:0; transform:translateY(4px)} 100%{opacity:1; transform:translateY(0)} }
              @keyframes blink { 0%,40%{opacity:1} 50%,100%{opacity:0} }
              .title-glow { text-shadow: 0 0 10px rgba(255,138,61,0.25); }
            `}</style>
            <div className="relative bg-brand-night rounded-3xl p-8 shadow-md border border-white/10 min-h-[24rem]">
              {itinerary.map((day, d) => (
                <div
                  key={d}
                  className={`transition-all duration-[340ms] ${visibleDays >= d + 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} mb-6`}
                  style={visibleDays >= d + 1 ? { animation: 'fadeUpDay 0.34s ease-out forwards' } : undefined}
                >
                  <h3 className="text-slate-100 font-semibold title-glow">{day.title}</h3>
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
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
          Il tuo viaggio, <span className="text-transparent bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text">creato in tempo reale</span>
          </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Dalla scelta del volo alla prenotazione dell'hotel, fino ai ristoranti locali e ai luoghi imperdibili — ItinerAI analizza milioni di dati e costruisce per te l'esperienza perfetta.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              Ogni itinerario è unico, come il tuo modo di viaggiare.
            </p>

            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
                <span className="text-slate-700 font-medium">IA generativa</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
                <span className="text-slate-700 font-medium">Personalizzato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
