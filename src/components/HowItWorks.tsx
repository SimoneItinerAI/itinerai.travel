import { useMemo } from 'react';

export default function HowItWorks() {
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
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-3">Come funziona ItinerAI</h2>
        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">Tre semplici passaggi per creare il tuo viaggio ideale.</p>

        <style>{animations.style}</style>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative rounded-3xl p-8 border bg-gradient-to-br from-slate-50 to-brand-blue/10 border-brand-blue/20 shadow-sm">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-blue rounded-full text-white font-bold flex items-center justify-center shadow" aria-hidden>1</div>
            <div className="mb-6">
              <div className="relative">
                <div className="flex items-center gap-3 bg-white/80 rounded-full border border-brand-blue/30 px-5 py-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-orange to-brand-blue opacity-80" style={{animation: 'glowPulse 2.2s ease-in-out infinite'}} />
                  <span className="text-sm text-slate-500">Cerca destinazione...</span>
                </div>
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-px overflow-hidden">
                  <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-70" style={{animation: 'scanMove 1.8s linear infinite'}} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 flex items-center justify-center border border-brand-orange/40">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Inserisci la destinazione</h3>
                <p className="text-slate-600 text-sm">Digita la destinazione che vuoi esplorare.</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl p-8 border bg-gradient-to-br from-slate-50 to-brand-blue/10 border-brand-blue/20 shadow-sm">
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
          </div>

          <div className="relative rounded-3xl p-8 border bg-gradient-to-br from-slate-50 to-brand-blue/10 border-brand-blue/20 shadow-sm">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-blue rounded-full text-white font-bold flex items-center justify-center shadow" aria-hidden>3</div>
            <div className="bg-white/70 backdrop-blur rounded-2xl border border-brand.blue/20 p-5 mb-4">
              <div className="flex items-center justify-between mb-3" style={{animation: 'fadeUp .6s ease forwards'}}>
                <div className="text-sm font-medium text-slate-700">Roma</div>
                <div className="text-xs text-slate-500">3 giorni</div>
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded bg-gradient-to-r from-brand-orange/60 to-brand-orange/30" style={{animation: 'fadeUp .6s ease forwards', animationDelay: '.1s'}} />
                <div className="h-3 rounded bg-gradient-to-r from-brand-blue/60 to-brand-blue/30" style={{animation: 'fadeUp .6s ease forwards', animationDelay: '.2s'}} />
                <div className="h-3 rounded bg-gradient-to-r from-brand-orange/60 to-brand-orange/30" style={{animation: 'fadeUp .6s ease forwards', animationDelay: '.3s'}} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Itinerario generato</h3>
            <p className="text-slate-600 text-sm">Ottieni un itinerario completo, personalizzato e prenotabile.</p>
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
