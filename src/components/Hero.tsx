import { useState } from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export default function Hero() {
  const [destination, setDestination] = useState('');

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-brand-navy to-slate-950 text-white overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <style>{`
              @keyframes float-plane {
                0% { transform: translateX(-100px) translateY(0px); }
                50% { transform: translateX(600px) translateY(-30px); }
                100% { transform: translateX(1300px) translateY(0px); }
              }
              .animate-plane { animation: float-plane 8s infinite; }
            `}</style>
          </defs>
          <g opacity="0.15" stroke="currentColor" className="text-brand-blue" strokeWidth="1">
            {[...Array(12)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="1200" y2={i * 50} />
            ))}
            {[...Array(24)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
            ))}
          </g>
          <line x1="150" y1="100" x2="400" y2="250" stroke="currentColor" className="text-brand-orange" strokeWidth="2" opacity="0.5" />
          <line x1="400" y1="250" x2="700" y2="180" stroke="currentColor" className="text-brand-blue" strokeWidth="2" opacity="0.5" />
          <line x1="700" y1="180" x2="950" y2="350" stroke="currentColor" className="text-brand-orange" strokeWidth="2" opacity="0.5" />
          <circle cx="150" cy="100" r="6" fill="currentColor" className="text-brand-orange" filter="url(#glow)" opacity="0.8" />
          <circle cx="400" cy="250" r="6" fill="currentColor" className="text-brand-blue" filter="url(#glow)" opacity="0.8" />
          <circle cx="700" cy="180" r="6" fill="currentColor" className="text-brand-orange" filter="url(#glow)" opacity="0.8" />
          <circle cx="950" cy="350" r="6" fill="currentColor" className="text-brand-blue" filter="url(#glow)" opacity="0.8" />
          <g className="animate-plane" filter="url(#glow)">
            <text x="0" y="0" fontSize="28" fill="currentColor" className="text-brand-orange" textAnchor="middle">✈️</text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:border-brand-orange/50 transition-colors">
          <Compass className="w-5 h-5 text-brand-orange" />
          <span className="text-sm font-medium">ItinerAI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Pianifica.
          <br />
          <span className="text-transparent bg-gradient-to-r from-brand-orange via-brand-blue to-brand-orange bg-clip-text">
            Esplora. Vivi.
          </span>
          <br />
          Tutto grazie all'<span className="text-brand-blue">intelligenza artificiale.</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Inserisci una destinazione e guarda ItinerAI creare il tuo viaggio ideale in pochi secondi.
        </p>

        <div className="max-w-xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3 bg-white/5 backdrop-blur-md p-2 rounded-full border border-white/20 hover:border-brand-orange/50 transition-all">
            <input
              type="text"
              placeholder="Dove vuoi andare?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 bg-transparent px-6 py-3 text-white placeholder-slate-400 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-brand-orange/50 whitespace-nowrap">
              Crea Itinerario
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-slate-400 text-sm">
          Nessuna registrazione • Creato in pochi secondi • Sempre aggiornato
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
