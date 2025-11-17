import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const [destination, setDestination] = useState('');
  const bgMobileUrl = '/backgroundmobile.png';

  return (
    <section id="hero" className="HeroSection relative min-h-screen w-full bg-slate-950 text-white overflow-hidden flex items-center justify-center">
      <style>{`
        @media (max-width: 768px) {
          .HeroSection {
            background-image: url('${bgMobileUrl}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          .HeroSection picture { display: none; }
          .HeroSection::before {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-image: url('${bgMobileUrl}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            filter: blur(3px);
            z-index: 0;
          }
        }
      `}</style>
      {/* Background image - supports PNG with JPG fallback */}
      <picture>
        <source srcSet="/background.png" type="image/png" />
        <img
          src="/background.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_35%] sm:object-center"
        />
      </picture>

      {/* Animated SVG elements */}
      <div className="absolute left-0 right-0 bottom-0 top-20 opacity-40 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow-hero" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="shadow-hero">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
            <style>{`
              @keyframes float-plane-1 {
                0% { transform: translateX(-150px) translateY(-100px); }
                50% { transform: translateX(300px) translateY(-80px); }
                100% { transform: translateX(750px) translateY(-100px); }
              }
              @keyframes float-plane-2 {
                0% { transform: translateX(-100px) translateY(50px); }
                50% { transform: translateX(350px) translateY(30px); }
                100% { transform: translateX(800px) translateY(50px); }
              }
              @keyframes float-plane-3 {
                0% { transform: translateX(-80px) translateY(200px); }
                50% { transform: translateX(400px) translateY(180px); }
                100% { transform: translateX(850px) translateY(200px); }
              }
              @keyframes pulse-node {
                0%, 100% { r: 4; opacity: 0.4; }
                50% { r: 6; opacity: 1; }
              }
              @keyframes orbit-circle {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes circuit-pulse {
                0%, 100% { stroke-width: 1; opacity: 0.3; }
                50% { stroke-width: 1.5; opacity: 0.7; }
              }
              .plane-1 { animation: float-plane-1 14s infinite ease-in-out; }
              .plane-2 { animation: float-plane-2 16s infinite ease-in-out 2s; }
              .plane-3 { animation: float-plane-3 18s infinite ease-in-out 4s; }
              .pulse-node { animation: pulse-node 3s infinite; }
              .orbit { animation: orbit-circle 40s infinite linear; transform-origin: 600px 320px; }
              .circuit { animation: circuit-pulse 2s infinite; }
            `}</style>
            <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base gradient background */}
          <rect width="1200" height="800" fill="url(#glow-grad)" opacity="0.4" />

          {/* Grid pattern subtle */}
          <g opacity="0.08" stroke="#3b82f6" strokeWidth="0.5">
            {[...Array(16)].map((_, i) => (
              <line key={`grid-h-${i}`} x1="0" y1={i * 50} x2="1200" y2={i * 50} />
            ))}
            {[...Array(24)].map((_, i) => (
              <line key={`grid-v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="800" />
            ))}
          </g>

          {/* Central globe with orbiting elements */}
          <g className="orbit">
            <circle cx="600" cy="320" r="120" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" />
            <circle cx="600" cy="320" r="100" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
            <circle cx="600" cy="320" r="80" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" />
          </g>

          {/* Core globe */}
          <circle cx="600" cy="320" r="60" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.3" filter="url(#glow-hero)" />
          <circle cx="600" cy="320" r="45" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" filter="url(#glow-hero)" />
          <circle cx="600" cy="320" r="30" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.5" filter="url(#glow-hero)" />

          {/* Central bright point */}
          <circle cx="600" cy="320" r="6" fill="#f97316" opacity="0.6" filter="url(#glow-hero)" />

          {/* Continents/map markers - pulsing nodes */}
          <circle className="pulse-node" cx="500" cy="250" r="4" fill="#f97316" filter="url(#glow-hero)" />
          <circle className="pulse-node" cx="720" cy="280" r="4" fill="#3b82f6" filter="url(#glow-hero)" style={{animationDelay: '0.5s'}} />
          <circle className="pulse-node" cx="480" cy="380" r="4" fill="#f97316" filter="url(#glow-hero)" style={{animationDelay: '1s'}} />
          <circle className="pulse-node" cx="750" cy="360" r="4" fill="#3b82f6" filter="url(#glow-hero)" style={{animationDelay: '1.5s'}} />

          {/* Flight routes - circuit lines */}
          <path className="circuit" d="M 500 250 Q 600 280 720 280" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path className="circuit" d="M 720 280 Q 700 320 750 360" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.5" style={{animationDelay: '0.3s'}} />
          <path className="circuit" d="M 750 360 Q 650 380 480 380" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.5" style={{animationDelay: '0.6s'}} />
          <path className="circuit" d="M 480 380 Q 500 300 500 250" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.5" style={{animationDelay: '0.9s'}} />

          {/* Circuit nodes on routes */}
          <circle cx="550" cy="265" r="3" fill="#f97316" opacity="0.7" filter="url(#glow-hero)" />
          <circle cx="710" cy="320" r="3" fill="#3b82f6" opacity="0.7" filter="url(#glow-hero)" />
          <circle cx="615" cy="370" r="3" fill="#f97316" opacity="0.7" filter="url(#glow-hero)" />
          <circle cx="490" cy="340" r="3" fill="#3b82f6" opacity="0.7" filter="url(#glow-hero)" />

          {/* AI circuits pattern - geometric elements */}
          <g opacity="0.25" stroke="#3b82f6" strokeWidth="0.8" fill="none">
            <rect x="150" y="100" width="80" height="80" rx="5" />
            <rect x="200" y="120" width="40" height="40" rx="2" />
            <line x1="150" y1="140" x2="230" y2="140" />
            <line x1="190" y1="100" x2="190" y2="180" />
          </g>

          <g opacity="0.25" stroke="#f97316" strokeWidth="0.8" fill="none">
            <rect x="970" y="650" width="80" height="80" rx="5" />
            <rect x="990" y="680" width="40" height="40" rx="2" />
            <line x1="970" y1="690" x2="1050" y2="690" />
            <line x1="1010" y1="650" x2="1010" y2="730" />
          </g>

          

          {/* Connecting lines between nodes - tech style */}
          <line x1="200" y1="150" x2="500" y2="250" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" strokeDasharray="5,5" />
          <line x1="1000" y1="700" x2="720" y2="280" stroke="#f97316" strokeWidth="0.5" opacity="0.2" strokeDasharray="5,5" />
          <line x1="100" y1="700" x2="480" y2="380" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" strokeDasharray="5,5" />

          {/* Subtle data points */}
          <circle cx="150" cy="150" r="2" fill="#3b82f6" opacity="0.4" />
          <circle cx="1050" cy="750" r="2" fill="#f97316" opacity="0.4" />
          <circle cx="120" cy="720" r="2" fill="#3b82f6" opacity="0.4" />
          <circle cx="1100" cy="150" r="2" fill="#f97316" opacity="0.4" />
        </svg>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/30 to-slate-950/50"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Pianifica.
          <br />
          <span className="text-transparent bg-gradient-to-r from-orange-500 via-blue-400 to-orange-500 bg-clip-text">
            Esplora. Vivi.
          </span>
          <br />
          Tutto grazie all'<span className="text-blue-400">intelligenza artificiale.</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Inserisci una destinazione e guarda ItinerAI creare il tuo viaggio ideale in pochi secondi.
        </p>

        <div className="max-w-xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3 bg-white/5 backdrop-blur-md p-2 rounded-full border border-white/20 hover:border-orange-500/50 transition-all">
            <input
              type="text"
              placeholder="Dove vuoi andare?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 bg-transparent px-6 py-3 text-white placeholder-slate-400 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-orange-500/50 whitespace-nowrap">
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
