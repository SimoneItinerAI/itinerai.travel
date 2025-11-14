import { useEffect, useMemo, useRef, useState } from 'react';

export default function HowItWorks() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animations = useMemo(() => ({
    style: `
      @keyframes glowPulse { 0%,100%{opacity:.6} 50%{opacity:1} }
      @keyframes scanMove { 0%{transform:translateX(0)} 100%{transform:translateX(100%)} }
      @keyframes dashFlow { to{stroke-dashoffset:-120} }
      @keyframes nodePulse { 0%,100%{r:4;opacity:.35} 50%{r:6;opacity:.9} }
      @keyframes fadeUp { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)} }
    `
  }), []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-3">Come funziona ItinerAI</h2>
        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">Tre semplici passaggi per creare il tuo viaggio ideale.</p>

        <style>{animations.style}</style>

        <div className={`grid md:grid-cols-3 gap-8 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="relative group rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-slate-900/5 to-brand-blue/10 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute -inset-[1px] rounded-3xl pointer-events-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-blue/20 to-brand-orange/20 opacity-40 blur-md"></div>
            </div>
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-blue rounded-full text-white font-bold flex items-center justify-center shadow" aria-hidden>1</div>
            <div className="mb-6">
              <div className="relative">
                <div className="flex items-center gap-3 bg-white/70 rounded-full border border-brand-blue/30 px-5 py-3 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-orange to-brand-blue opacity-80" style={{animation: 'glowPulse 2.2s ease-in-out infinite'}} />
                  <span className="text-sm text-slate-500">Cerca destinazione...</span>
                </div>
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-px overflow-hidden">
                  <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-70" style={{animation: 'scanMove 1.8s linear infinite'}} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 flex items-center justify-center border border-brand-orange/40 shadow-inner">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Inserisci la destinazione</h3>
                <p className="text-slate-600 text-sm">Digita la destinazione che vuoi esplorare.</p>
              </div>
            </div>
            <svg className="absolute right-6 bottom-6 w-24 h-16 opacity-15 pointer-events-none" viewBox="0 0 120 80">
              <g fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.35">
                <rect x="2" y="20" width="50" height="14" rx="6" />
                <line x1="6" y1="27" x2="48" y2="27" />
              </g>
              <circle cx="80" cy="40" r="12" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.25" />
              <circle cx="80" cy="40" r="2" fill="#f97316" opacity="0.6" />
            </svg>
          </div>

          <div className="relative group rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-slate-900/5 to-brand-blue/10 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute -inset-[1px] rounded-3xl pointer-events-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-blue/20 to-brand-orange/20 opacity-40 blur-md"></div>
            </div>
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-blue rounded-full text-white font-bold flex items-center justify-center shadow" aria-hidden>2</div>
            <svg className="w-full h-28 mb-6" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="aiGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#aiGrad)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M20 60 Q 100 20 180 60 T 340 60" strokeDasharray="120 120" style={{animation: 'dashFlow 3s linear infinite'}} />
                <path d="M40 80 Q 120 40 200 80 T 360 80" strokeDasharray="120 120" style={{animation: 'dashFlow 3.2s linear infinite', animationDelay: '.3s'}} />
              </g>
              <circle cx="180" cy="60" r="4" fill="#f97316" style={{animation: 'nodePulse 2s ease-in-out infinite'}} />
              <circle cx="240" cy="70" r="4" fill="#3b82f6" style={{animation: 'nodePulse 2.2s ease-in-out infinite', animationDelay: '.4s'}} />
              <circle cx="300" cy="60" r="4" fill="#f97316" style={{animation: 'nodePulse 2s ease-in-out infinite', animationDelay: '.8s'}} />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900">Elaborazione dell’intelligenza artificiale</h3>
            <p className="text-slate-600 text-sm">ItinerAI analizza voli, hotel, ristoranti e attività in tempo reale.</p>
            <svg className="absolute left-6 bottom-6 w-24 h-16 opacity-15 pointer-events-none" viewBox="0 0 120 80">
              <g fill="none" stroke="#3b82f6" strokeWidth="0.6" opacity="0.35">
                <rect x="8" y="10" width="24" height="24" rx="4" />
                <line x1="32" y1="22" x2="70" y2="22" />
                <circle cx="90" cy="22" r="4" />
              </g>
            </svg>
          </div>

          <div className="relative group rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-slate-900/5 to-brand-blue/10 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute -inset-[1px] rounded-3xl pointer-events-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-blue/20 to-brand-orange/20 opacity-40 blur-md"></div>
            </div>
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-blue rounded-full text-white font-bold flex items-center justify-center shadow" aria-hidden>3</div>
            <div className="bg-white/70 backdrop-blur rounded-2xl border border-brand-blue/20 p-5 mb-4">
              <div className="flex items-center justify-between mb-4" style={{animation: 'fadeUp .6s ease forwards'}}>
                <div className="text-sm font-medium text-slate-700">Roma</div>
                <div className="text-xs text-slate-500">3 giorni</div>
              </div>
              <div className="grid md:grid-cols-2 gap-4" style={{animation: 'fadeUp .8s ease forwards', animationDelay: '.1s'}}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-orange flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16 L22 12"/><path d="M6 5 L10 13"/><path d="M10 13 L6 15"/></svg>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Giorno 1</div>
                      <div className="text-xs text-slate-600">Volo e check‑in in hotel</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="9" width="18" height="10" rx="2"/><path d="M8 9 V6 H16 V9"/></svg>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Giorno 2</div>
                      <div className="text-xs text-slate-600">Attività culturali e pranzo tipico</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-orange flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4 L18 4"/><path d="M4 8 L20 8"/><path d="M6 12 L18 12"/><path d="M10 16 L14 16"/></svg>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Giorno 3</div>
                      <div className="text-xs text-slate-600">Passeggiata serale e cena</div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <img loading="lazy" src="https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=160&h=100&fit=crop&auto=format&dpr=2" alt="tappa 1" className="w-24 h-16 rounded-lg object-cover"/>
                    <img loading="lazy" src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=160&h=100&fit=crop&auto=format&dpr=2" alt="tappa 2" className="w-24 h-16 rounded-lg object-cover"/>
                    <img loading="lazy" src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=160&h=100&fit=crop&auto=format&dpr=2" alt="tappa 3" className="w-24 h-16 rounded-lg object-cover"/>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-brand-orange/20 to-brand-orange/10 border border-brand-orange/40"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5"><path d="M2 16 L22 12"/><path d="M6 5 L10 13"/><path d="M10 13 L6 15"/></svg>Volo</span>
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-brand-blue/20 to-brand-blue/10 border border-brand-blue/40"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><rect x="3" y="9" width="18" height="10" rx="2"/><path d="M8 9 V6 H16 V9"/></svg>Hotel</span>
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-brand-orange/20 to-brand-orange/10 border border-brand-orange/40"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5"><path d="M12 2 L14 8 L20 9 L15 13 L16 20 L12 17 L8 20 L9 13 L4 9 L10 8 Z"/></svg>Attività</span>
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-brand-blue/20 to-brand-blue/10 border border-brand-blue/40"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M8 3 L8 21"/><path d="M12 8 C12 12 20 12 20 8 L20 21"/></svg>Ristorante</span>
                  </div>
                </div>
                <div className="relative rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-brand-blue/20 p-3">
                  <svg className="w-full h-32" viewBox="0 0 300 140" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="routeGrad" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <g opacity="0.15" stroke="#0f172a" strokeWidth="1">
                      <rect x="1" y="1" width="298" height="138" rx="10" fill="none" />
                      <line x1="50" y1="10" x2="50" y2="130" />
                      <line x1="150" y1="10" x2="150" y2="130" />
                      <line x1="250" y1="10" x2="250" y2="130" />
                    </g>
                    <path d="M30 110 Q 80 70 130 100 T 220 60" fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6 4" style={{animation: 'dashFlow 4s linear infinite'}} />
                    <circle cx="30" cy="110" r="4" fill="#f97316" />
                    <circle cx="130" cy="100" r="4" fill="#3b82f6" />
                    <circle cx="220" cy="60" r="4" fill="#f97316" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Itinerario generato</h3>
            <p className="text-slate-600 text-sm">Ottieni un itinerario completo, personalizzato e prenotabile.</p>
            <svg className="absolute right-6 bottom-6 w-24 h-16 opacity-15 pointer-events-none" viewBox="0 0 120 80">
              <g fill="none" stroke="#f97316" strokeWidth="0.6" opacity="0.35">
                <path d="M10 60 L40 40 L70 55 L100 35" />
                <circle cx="40" cy="40" r="3" />
                <circle cx="70" cy="55" r="3" />
              </g>
            </svg>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-brand-orange/50">
            <span>🔍</span>
            Guarda un itinerario d'esempio
          </button>
        </div>
      </div>
    </section>
  );
}
