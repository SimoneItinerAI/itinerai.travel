export default function Technology() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Globe visualization */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80">
              <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="glow-tech">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <style>{`
                    @keyframes pulse-node {
                      0%, 100% { r: 3; opacity: 0.6; }
                      50% { r: 5; opacity: 1; }
                    }
                    .pulse-node { animation: pulse-node 2s infinite; }
                    @keyframes orbit {
                      0% { transform: rotate(0deg) translateX(70px) rotate(0deg); }
                      100% { transform: rotate(360deg) translateX(70px) rotate(-360deg); }
                    }
                    .orbit { transform-origin: 100px 100px; animation: orbit 20s linear infinite; }
                  `}</style>
                </defs>

                {/* Globe */}
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" className="text-brand-blue" strokeWidth="0.5" opacity="0.3" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" className="text-brand-blue" strokeWidth="0.5" opacity="0.3" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" className="text-brand-blue" strokeWidth="0.5" opacity="0.3" />

                {/* Central sphere */}
                <circle cx="100" cy="100" r="35" fill="currentColor" className="text-brand-orange" opacity="0.1" filter="url(#glow-tech)" />

                {/* Nodes */}
                <g className="pulse-node">
                  <circle cx="100" cy="65" r="4" fill="currentColor" className="text-brand-orange" filter="url(#glow-tech)" />
                </g>
                <g className="pulse-node" style={{animationDelay: '0.5s'}}>
                  <circle cx="135" cy="100" r="4" fill="currentColor" className="text-brand-blue" filter="url(#glow-tech)" />
                </g>
                <g className="pulse-node" style={{animationDelay: '1s'}}>
                  <circle cx="100" cy="135" r="4" fill="currentColor" className="text-brand-orange" filter="url(#glow-tech)" />
                </g>
                <g className="pulse-node" style={{animationDelay: '1.5s'}}>
                  <circle cx="65" cy="100" r="4" fill="currentColor" className="text-brand-blue" filter="url(#glow-tech)" />
                </g>

                {/* Orbiting node */}
                <g className="orbit">
                  <circle cx="170" cy="100" r="3" fill="currentColor" className="text-brand-orange" filter="url(#glow-tech)" />
                </g>

                {/* Connection lines */}
                <line x1="100" y1="65" x2="135" y2="100" stroke="currentColor" className="text-brand-blue" strokeWidth="0.5" opacity="0.4" />
                <line x1="135" y1="100" x2="100" y2="135" stroke="currentColor" className="text-brand-orange" strokeWidth="0.5" opacity="0.4" />
                <line x1="100" y1="135" x2="65" y2="100" stroke="currentColor" className="text-brand-blue" strokeWidth="0.5" opacity="0.4" />
                <line x1="65" y1="100" x2="100" y2="65" stroke="currentColor" className="text-brand-orange" strokeWidth="0.5" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* Right: Text content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Dove l'<span className="text-transparent bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text">intelligenza artificiale</span> incontra l'esperienza di viaggio
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Ogni itinerario nasce da una rete neurale che combina dati turistici, recensioni reali e informazioni culturali.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Sicurezza, precisione e aggiornamenti continui — perché viaggiare merita fiducia.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-slate-900">IA Generativa</p>
                  <p className="text-slate-600 text-sm">Modelli di machine learning all'avanguardia</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-slate-900">Dati in Tempo Reale</p>
                  <p className="text-slate-600 text-sm">Aggiornamenti continui su voli, prezzi e disponibilità</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-slate-900">Personalizzazione Profonda</p>
                  <p className="text-slate-600 text-sm">Algoritmi che imparano dai tuoi gusti e preferenze</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-brand-orange/10 to-brand-blue/10 rounded-2xl border border-brand-orange/30">
              <p className="text-lg font-semibold text-slate-900">
                "Il futuro del travel planning è <span className="text-brand-orange">già qui</span>."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
