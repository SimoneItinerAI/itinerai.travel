import { useEffect, useState } from 'react';
import type { TripParams, Itinerary } from '../types/trip';
import { loadTripParams, loadLastItinerary, forceGenerateItinerary, saveTripParams } from '../utils/itinerary';
import ProposalsHeader from './proposals/ProposalsHeader';
import FlightsCard from './proposals/FlightsCard';
import AccommodationCard from './proposals/AccommodationCard';
import ExperiencesCard from './proposals/ExperiencesCard';

interface ProposalsProps {
  onBack: () => void;
}

export default function Proposals({ onBack }: ProposalsProps) {
  const [params, setParams] = useState<TripParams | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentParams = loadTripParams();
    const lastItinerary = loadLastItinerary();

    if (!currentParams) {
      setLoading(false);
      setParams(null);
      setItinerary(null);
      return;
    }

    setParams(currentParams);
    setItinerary(lastItinerary);
    setLoading(false);
  }, []);

  const handleRegenerateItinerary = () => {
    if (!params) return;
    forceGenerateItinerary(params);
    saveTripParams(params);
    setItinerary(loadLastItinerary());
    onBack();
  };

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
              <p className="text-lg font-semibold text-white">Prepariamo le tue proposte...</p>
            </div>
          </div>
          <div className="mt-4 w-64 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-blue animate-[loadingBar_1.4s_ease-in-out_infinite]" />
          </div>
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nessuna ricerca trovata</h1>
          <p className="text-slate-600">
            Per vedere le proposte di viaggio, effettua prima una ricerca dalla home.
          </p>
          <button
            onClick={onBack}
            className="mt-6 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangelight text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            Torna indietro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <ProposalsHeader
        params={params}
        onNavigateBack={onBack}
        onRegenerateItinerary={handleRegenerateItinerary}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Prenota i componenti del viaggio</h2>
          <p className="text-slate-600">
            Utilizza i link affiliati per prenotare voli, alloggi e attività in modo semplice e veloce
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <FlightsCard params={params} />
          <AccommodationCard params={params} />
          <ExperiencesCard params={params} itinerary={itinerary} />
        </div>

        <div className="mt-12 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Hai bisogno di una proposta personalizzata?
              </h3>
              <p className="text-slate-600">
                Contattaci e creeremo un pacchetto su misura per te con voli, alloggio e attività
                inclusi.
              </p>
            </div>
            <a
              href="mailto:info@itinerai.travel?subject=Richiesta pacchetto personalizzato&body=Ciao, vorrei ricevere una proposta personalizzata per il mio viaggio."
              className="px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-teal text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
            >
              Richiedi preventivo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
