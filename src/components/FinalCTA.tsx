import { Rocket } from 'lucide-react';

import { type ItineraryParams } from '../utils/itinerary';

export default function FinalCTA({ onStart }: { onStart?: (p: ItineraryParams) => void }) {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-slate-950 via-brand-navy to-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600">
          <defs>
            <style>{`
              @keyframes plane-move {
                0% { transform: translateX(-200px) translateY(100px); }
                50% { transform: translateX(600px) translateY(50px); }
                100% { transform: translateX(1400px) translateY(100px); }
              }
              .plane-moving { animation: plane-move 12s infinite; }
            `}</style>
          </defs>
          <g opacity="0.15" stroke="currentColor" className="text-brand-orange" strokeWidth="1">
            {[...Array(10)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 60} x2="1200" y2={i * 60} />
            ))}
          </g>
          <g className="plane-moving" style={{filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))'}}>
            <text x="0" y="0" fontSize="40" fill="currentColor" className="text-brand-orange">✈️</text>
          </g>
        </svg>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-brand-orange/20 via-transparent to-transparent opacity-50"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Sei pronto a partire con la tua <br />
          <span className="text-transparent bg-gradient-to-r from-brand-orangelight via-brand-blue to-brand-orangelight bg-clip-text">intelligenza artificiale di fiducia?</span>
        </h2>

        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Crea il tuo itinerario perfetto in pochi secondi, senza stress e senza compromessi.
        </p>

        <button onClick={() => onStart?.({ destination: 'Roma', days: 3, people: 2 })} className="group bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl hover:shadow-brand-orange/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3">
          <Rocket className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          Prova ItinerAI Gratis
        </button>

        <p className="mt-8 text-slate-400 text-sm">
          Nessuna carta di credito richiesta • Supporto 24/7 • Sempre gratuito per iniziare
        </p>
      </div>
    </section>
  );
}
