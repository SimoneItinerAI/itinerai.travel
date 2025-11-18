import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function DemoTryIt() {
  const [demo, setDemo] = useState('');
  const [result, setResult] = useState<string | null>(null);
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
    setResult(`Creando itinerario per "${example}"...`);
    setTimeout(() => {
      setResult(`✨ Itinerario personalizzato creato!`);
    }, 1500);
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
          <style>{`@keyframes moveX{0%{transform:translateX(-30%)}100%{transform:translateX(130%)}}`}</style>
          <div className="absolute inset-0 opacity-[.12] pointer-events-none" style={{backgroundImage:'radial-gradient(600px 120px at 10% 0%, rgba(255,138,61,.12), transparent 60%), radial-gradient(600px 120px at 90% 0%, rgba(59,130,246,.12), transparent 60%)'}}></div>
          <div className="absolute top-0 left-0 h-[2px] w-24 bg-gradient-to-r from-brand-orange/60 via-brand-blue/60 to-transparent opacity-70 pointer-events-none" style={{ animation: 'moveX 4s linear infinite' }}></div>
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
          

          {/* Result display */}
          {result && (
            <div className="bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 border border-brand-orange/30 rounded-2xl p-6 animate-in fade-in duration-300">
              <p className="text-brand-orange mb-4 font-semibold">{result}</p>
              <div className="space-y-3 text-sm text-slate-200">
                <p>📍 <strong>Giorno 1:</strong> Arrivo e check-in</p>
                <p>🎭 <strong>Giorno 2:</strong> Attrazioni principali</p>
                <p>🍽️ <strong>Giorno 3:</strong> Esperienze locali autentiche</p>
              </div>
              <button className="mt-4 text-brand-orange font-semibold hover:opacity-90 transition-colors inline-flex items-center gap-2">
                Continua su app completa
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick examples */}
        
      </div>
    </section>
  );
}
