import { useEffect, useMemo, useState } from 'react';
import type { TripParams, Itinerary } from '../types/trip';
import { loadTripParams, loadLastItinerary, saveLastItinerary, buildItineraryForCity, regenerateDayCity, sameParams, createItineraryFromParams } from '../utils/itinerary';
import ItineraryDayCard from '../components/ItineraryDayCard';

export default function ItineraryPage({ onNavigateProposals, onNavigateHome }: { onNavigateProposals: () => void; onNavigateHome: () => void }) {
  const [params, setParams] = useState<TripParams | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  useEffect(() => {
    const tp = loadTripParams();
    const last = loadLastItinerary();
    if (!tp && !last) {
      setLoading(false);
      setParams(null);
      setItinerary(null);
      return;
    }
    if (tp && last) {
      setParams(tp);
      if (sameParams(last.params, tp)) {
        setItinerary(last);
        setLoading(false);
      } else {
        setLoading(true);
        buildItineraryForCity(tp)
          .then((gen) => { saveLastItinerary(gen); setItinerary(gen); })
          .catch(() => { const gen = createItineraryFromParams(tp); saveLastItinerary(gen); setItinerary(gen); })
          .finally(() => setLoading(false));
      }
      return;
    }
    if (tp && !last) {
      setParams(tp);
      setLoading(true);
      buildItineraryForCity(tp)
        .then((gen) => { saveLastItinerary(gen); setItinerary(gen); })
        .catch(() => { const gen = createItineraryFromParams(tp); saveLastItinerary(gen); setItinerary(gen); })
        .finally(() => setLoading(false));
      return;
    }
    if (!tp && last) {
      setParams(last.params);
      setItinerary(last);
      setLoading(false);
      return;
    }
  }, []);

  const headerTitle = useMemo(() => {
    if (!params) return '';
    return `${params.destination} · ${params.days} ${params.days === 1 ? 'giorno' : 'giorni'} · ${params.people} ${params.people === 1 ? 'persona' : 'persone'}`;
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#1f2937,_transparent_55%),radial-gradient(circle_at_bottom,_#0f172a,_transparent_55%)]" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ItinerAI" className="h-8 w-8 object-contain shrink-0 rounded-xl shadow-lg shadow-brand-orange/40" />
            <p className="text-lg font-semibold text-white">ItinerAI sta preparando il tuo viaggio…</p>
          </div>
          <div className="mt-2 w-56 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-blue animate-[loadingBar_1.4s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  if (!params) {
    return (
      <div className="min-h-screen w-full bg-white text-slate-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <p className="text-xl font-semibold">Non ho trovato nessun viaggio.</p>
          <p className="text-sm text-slate-600 mt-1">Torna alla home per crearne uno.</p>
          <button onClick={onNavigateHome} className="mt-4 w-full px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Torna alla home</button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{headerTitle}</h1>
            <p className="text-sm text-slate-600">dal {new Date(params.startDate).toLocaleDateString('it-IT')} al {new Date(params.endDate).toLocaleDateString('it-IT')}</p>
          </div>
          <div className="mt-3 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row md:gap-3">
            <button onClick={onNavigateProposals} className="w-full md:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-orangelight text-white">Vai alle proposte di hotel, voli e attività</button>
            <button onClick={() => itinerary && saveLastItinerary(itinerary)} className="w-full md:w-auto px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Salva questo viaggio</button>
            <button onClick={onNavigateHome} className="w-full md:w-auto px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Ritorna alla Home page</button>
          </div>
        </div>

        {!itinerary ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <p className="text-sm text-slate-700">Itinerario non disponibile.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {itinerary.days.map((d, i) => (
              <div key={d.dayIndex} className="space-y-2">
                <ItineraryDayCard
                  day={d}
                  poiById={Object.fromEntries((itinerary.poisUsed ?? []).map(p => [p.id, p]))}
                  loading={regeneratingDay === d.dayIndex}
                  onChange={(next) => {
                    const updated: Itinerary = { ...itinerary, days: itinerary.days.map((x, xi) => (xi === i ? next : x)) };
                    setItinerary(updated);
                    saveLastItinerary(updated);
                  }}
                  onDeleteItem={(itemIndex) => {
                    const updatedItems = d.items.filter((_, idx) => idx !== itemIndex);
                    const updatedDay = { ...d, items: updatedItems };
                    const updated: Itinerary = { ...itinerary, days: itinerary.days.map((x, xi) => (xi === i ? updatedDay : x)) };
                    setItinerary(updated);
                    saveLastItinerary(updated);
                  }}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setRegeneratingDay(d.dayIndex);
                      const next = await regenerateDayCity(itinerary, d.dayIndex);
                      setItinerary(next);
                      setRegeneratingDay(null);
                    }}
                    className="px-3 py-1.5 rounded-full border border-brand-blue text-brand-blue hover:bg-brand-blue/10"
                  >
                    Rigenera giorno
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
