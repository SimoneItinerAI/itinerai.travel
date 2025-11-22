import { useEffect, useMemo, useRef, useState } from 'react';
 

import { type ItineraryParams } from '../utils/itinerary';

export default function DemoTryIt({ onStart: _onStart }: { onStart?: (p: ItineraryParams) => void }) {
  void _onStart;
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
 

 

  const rotating = useMemo(() => [
    '3 giorni a Roma',
    'Tour culturale a Firenze',
    'Weekend romantico a Verona',
    'Roadtrip in Puglia',
    'Sapore di Napoli',
  ], []);
  const [rotIndex, setRotIndex] = useState(0);
  const [rotChars, setRotChars] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let mounted = true;
    const timers: number[] = [];
    const intervals: number[] = [];
    const typeNext = () => {
      if (!mounted) return;
      setRotChars(0);
      const text = rotating[rotIndex] ?? '';
      const iv = window.setInterval(() => {
        if (!mounted) { window.clearInterval(iv); return; }
        setRotChars(c => {
          const next = c + 1;
          if (next >= text.length) {
            window.clearInterval(iv);
            const to = window.setTimeout(() => {
              setRotIndex(i => (i + 1) % rotating.length);
              typeNext();
            }, 1200);
            timers.push(to);
          }
          return next;
        });
      }, 42);
      intervals.push(iv);
    };
    const start = window.setTimeout(typeNext, 200);
    timers.push(start);
    return () => { mounted = false; timers.forEach(t => window.clearTimeout(t)); intervals.forEach(i => window.clearInterval(i)); };
  }, [inView, rotIndex, rotating]);

 

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 px-6 bg-gradient-to-br from-slate-900 to-brand-navy text-white">
      <div className="absolute inset-0 bg-gradient-radial from-brand-orange/20 via-transparent to-transparent opacity-50"></div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Prova <span className="text-transparent bg-gradient-to-r from-brand-orangelight to-brand-blue bg-clip-text">subito</span>
        </h2>

        <div className="relative mb-12">
          <style>{`@keyframes blink{0%,40%{opacity:1}50%,100%{opacity:0}}`}</style>
          <p className="text-center text-slate-300 max-w-2xl mx-auto text-lg">
            Descrivi la tua meta: ItinerAI genera un itinerario <span className="text-transparent bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text">in pochi secondi</span>.
            <span className="block mt-2 text-slate-400 text-base">
              Prova con: <span className="text-brand-orange">{rotating[rotIndex].slice(0, rotChars)}</span>
              <span className="inline-block w-[1ch] align-[-0.1em]" style={{animation:'blink 1s step-end infinite'}}>▌</span>
            </span>
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 h-[2px] w-40 bg-gradient-to-r from-brand-orange/50 to-brand-blue/50 blur-[1px] opacity-70"></div>
        </div>

        {/* Input box rimosso come richiesto */}

        {/* Quick examples */}
        
      </div>
    </section>
  );
}
