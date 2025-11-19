import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { type ItineraryParams } from '../utils/itinerary';

export default function DemoTryIt({ onStart }: { onStart?: (p: ItineraryParams) => void }) {
  const [demo, setDemo] = useState('');
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [focused, setFocused] = useState(false);

  const examples = [
    '3 giorni a Lisbona',
    'Viaggio gastronomico in Sicilia',
    'Weekend a Venezia',
    'Avventura nei Dolomiti'
  ];

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

  const handleDemo = (example: string) => {
    setDemo(example);
    const m = example.match(/(\d+)\s+giorni?\s+a\s+(.*)/i);
    const days = m && m[1] ? parseInt(m[1]) : 3;
    const destination = m && m[2] ? m[2] : (example || 'Roma');
    const p: ItineraryParams = { destination, days: isNaN(days) ? 3 : days, people: 2 };
    onStart?.(p);
  };

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-gradient-to-br from-slate-900 to-brand-navy text-white">
      <div className="max-w-5xl mx-auto">
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

        {/* Input box */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8 overflow-hidden" style={{ boxShadow: focused ? '0 0 24px rgba(255,138,61,.12)' : undefined, transition: 'box-shadow 200ms ease' }}>
          <style>{`@keyframes dashMove{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-400}}`}</style>
          <div className="absolute inset-0 opacity-[.12] pointer-events-none" style={{backgroundImage:'radial-gradient(600px 120px at 10% 0%, rgba(255,138,61,.12), transparent 60%), radial-gradient(600px 120px at 90% 0%, rgba(59,130,246,.12), transparent 60%)'}}></div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
              </linearGradient>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.6" result="bl" />
                <feMerge>
                  <feMergeNode in="bl" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x="1.5" y="1.5" width="97" height="97" rx="16" ry="16" fill="none" stroke="url(#gradLine)" strokeWidth="1.6" strokeLinecap="round" filter="url(#softGlow)" style={{ strokeDasharray: '48 352', animation: 'dashMove 2.8s linear infinite', opacity: 0.92 }} />
          </svg>
          <div className="absolute top-2 left-2 w-6 h-[2px] bg-gradient-to-r from-brand-orange/70 to-transparent blur-[0.5px] opacity-70 pointer-events-none"></div>
          <div className="absolute top-2 left-2 h-6 w-[2px] bg-gradient-to-b from-brand-blue/70 to-transparent blur-[0.5px] opacity-70 pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Esempio: 3 giorni a Roma o Viaggio gastronomico..."
              value={demo}
              onChange={(e) => setDemo(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleDemo(demo || examples[0]); }}
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange"
            />
            <button
              onClick={() => handleDemo(demo || examples[0])}
              className="bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-brand-orange/50 flex items-center gap-2 whitespace-nowrap"
            >
              Genera
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          

          
        </div>

        {/* Quick examples */}
        
      </div>
    </section>
  );
}
