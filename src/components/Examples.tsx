import { MapPin, Clock } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Trip = { days: string; title: string; subtitle: string };
type Spotlight = { id: string; gradient: string; trips: Trip[] };

function SpotlightCard({ trips, gradient }: { trips: Trip[]; gradient: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const pointerFine = useRef<boolean>(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener?.('change', handler);
    const pf = window.matchMedia('(pointer: fine)');
    pointerFine.current = pf.matches;
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex(i => (i + 1) % trips.length);
    }, 5000);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [reduceMotion, paused, trips.length]);

  const current = trips[index] ?? trips[0];

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      onMouseEnter={() => { if (pointerFine.current) setPaused(true); }}
      onMouseLeave={() => { if (pointerFine.current) setPaused(false); }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
      <style>{`
        @keyframes fadeSoftIn { 0%{opacity:0; transform:translateY(6px) rotateZ(-1.5deg) scale(0.995)} 50%{opacity:.7} 100%{opacity:1; transform:translateY(0) rotateZ(0) scale(1)} }
      `}</style>
      <div key={`${current.title}-${index}`} className="relative p-8" style={reduceMotion ? undefined : { animation: 'fadeSoftIn 640ms cubic-bezier(0.22, 1, 0.36, 1)', willChange: 'transform, opacity' }}>
        <div className="flex items-center gap-2 text-sm text-brand-blue mb-4">
          <Clock className="w-4 h-4" />
          <span>{current.days}</span>
        </div>

        <h3 className="text-2xl font-bold mb-3">{current.title}</h3>

        <p className="text-slate-300 mb-6">{current.subtitle}</p>

        <div className="flex items-center gap-2 text-brand-orange font-semibold group-hover:gap-4 transition-all duration-300">
          <MapPin className="w-5 h-5" />
          <span>Esplora itinerario</span>
        </div>
      </div>
    </div>
  );
}

export default function Examples() {
  const spotlightTrips: Spotlight[] = useMemo(() => [
    {
      id: 'city-break',
      gradient: 'from-brand-orange to-brand-blue',
      trips: [
        { days: '4 giorni', title: '4 giorni a Barcellona', subtitle: 'Arte, tapas e tramonti sul mare' },
        { days: '3 giorni', title: 'Weekend a Lisbona', subtitle: 'Miradouros, tram storici e pastéis' },
        { days: '3 giorni', title: 'Weekend a Parigi', subtitle: 'Musei, bistrot e Senna al tramonto' },
      ],
    },
    {
      id: 'coast',
      gradient: 'from-brand-blue to-brand-teal',
      trips: [
        { days: '5 giorni', title: 'Tour della Costiera Amalfitana', subtitle: 'Paesaggi, limoni e viste mozzafiato' },
        { days: '4 giorni', title: 'Weekend a Capri', subtitle: 'Faraglioni, mare cristallino e relax' },
      ],
    },
    {
      id: 'long-haul',
      gradient: 'from-brand-orange to-brand-teal',
      trips: [
        { days: '3 giorni', title: 'Weekend a Tokyo', subtitle: 'Tradizione e futuro in equilibrio perfetto' },
        { days: '7 giorni', title: 'Settimana a New York', subtitle: 'Skyline, Broadway e Central Park' },
      ],
    },
  ], []);

  return (
    <section
      className="ExamplesSection relative py-24 px-6 text-white"
      style={{ backgroundImage: "url('/ispiratiepartisection.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/60"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Ispirati e <span className="text-brand-orange">parti</span>
        </h2>

        <p className="text-xl text-center text-slate-300 mb-16">
          Scopri cosa può creare ItinerAI in pochi secondi
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {spotlightTrips.map((spot) => (
            <SpotlightCard key={spot.id} trips={spot.trips} gradient={spot.gradient} />
          ))}
        </div>
      </div>
    </section>
  );
}
