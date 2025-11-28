import { useEffect, useState } from 'react';
import type { TripParams, Itinerary } from '../types/trip';
import { loadTripParams, loadLastItinerary, saveLastItinerary, buildItineraryForCity, sameParams, createItineraryFromParams } from '../utils/itinerary';
import ItineraryHeader from '../components/itinerary/ItineraryHeader';
import ItinerarySummary from '../components/itinerary/ItinerarySummary';
import ItineraryTimeline from '../components/itinerary/ItineraryTimeline';

interface ItineraryPageProps {
  onNavigateProposals: () => void;
  onNavigateHome: () => void;
}

export default function ItineraryPage({ onNavigateProposals, onNavigateHome }: ItineraryPageProps) {
  const [params, setParams] = useState<TripParams | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

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
          .then((gen) => {
            saveLastItinerary(gen);
            setItinerary(gen);
          })
          .catch(() => {
            const gen = createItineraryFromParams(tp);
            saveLastItinerary(gen);
            setItinerary(gen);
          })
          .finally(() => setLoading(false));
      }
      return;
    }

    if (tp && !last) {
      setParams(tp);
      setLoading(true);
      buildItineraryForCity(tp)
        .then((gen) => {
          saveLastItinerary(gen);
          setItinerary(gen);
        })
        .catch(() => {
          const gen = createItineraryFromParams(tp);
          saveLastItinerary(gen);
          setItinerary(gen);
        })
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

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#1f2937,_transparent_55%),radial-gradient(circle_at_bottom,_#0f172a,_transparent_55%)]" />
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ItinerAI"
              className="h-10 w-10 object-contain shrink-0 rounded-xl shadow-lg shadow-brand-orange/40"
            />
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                ItinerAI sta lavorando
              </p>
              <p className="text-lg font-semibold text-white">
                Creiamo il tuo itinerario perfetto...
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-300 text-center max-w-md">
            Stiamo analizzando la destinazione, cercando i luoghi più iconici, esperienze autentiche
            e gemme nascoste per costruire un itinerario su misura.
          </div>
          <div className="mt-3 flex flex-col sm:flex-row gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>1. Analizzo la destinazione</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70">
              <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>2. Cerco luoghi e attività</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>3. Organizzo l'itinerario</span>
            </div>
          </div>
          <div className="mt-5 w-64 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-blue animate-[loadingBar_1.4s_ease-in-out_infinite]" />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 italic">
            Questo passaggio richiede solo pochi secondi.
          </p>
        </div>
      </div>
    );
  }

  if (!params) {
    return (
      <div className="min-h-screen w-full bg-white text-slate-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nessun itinerario trovato</h1>
          <p className="text-slate-600">
            Per creare il tuo itinerario personalizzato, inizia una nuova ricerca dalla home.
          </p>
          <button
            onClick={onNavigateHome}
            className="mt-6 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangelight text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            Vai alla home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <ItineraryHeader
        params={params}
        onNavigateHome={onNavigateHome}
        onNavigateProposals={onNavigateProposals}
      />

      <ItinerarySummary params={params} />

      {itinerary && (
        <ItineraryTimeline
          itinerary={itinerary}
          onUpdate={(updated) => {
            setItinerary(updated);
            saveLastItinerary(updated);
          }}
        />
      )}
    </div>
  );
}
