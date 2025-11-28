import type { TripParams } from '../../types/trip';
import { formatDateRange, calculateTripDuration } from '../../lib/searchParams';

interface ItineraryHeaderProps {
  params: TripParams;
  onNavigateHome: () => void;
  onNavigateProposals: () => void;
}

export default function ItineraryHeader({ params, onNavigateHome, onNavigateProposals }: ItineraryHeaderProps) {
  const { nights, days } = calculateTripDuration(params.startDate, params.endDate);
  const dateRange = formatDateRange(params.startDate, params.endDate);

  return (
    <div className="bg-gradient-to-br from-brand-navy to-slate-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Il tuo itinerario per {params.destination}
            </h1>
            <div className="flex flex-wrap gap-4 text-slate-300 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{dateRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{days} {days === 1 ? 'giorno' : 'giorni'} · {nights} {nights === 1 ? 'notte' : 'notti'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{params.people} {params.people === 1 ? 'persona' : 'persone'}</span>
              </div>
            </div>
            <p className="mt-4 text-slate-300 max-w-2xl leading-relaxed">
              Un viaggio pensato su misura, tra cultura, sapori locali e momenti indimenticabili.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              onClick={onNavigateProposals}
              className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Vedi proposte di viaggio
            </button>
            <button
              onClick={onNavigateHome}
              className="px-6 py-3 border border-white/30 hover:bg-white/10 text-white rounded-xl font-medium transition-all duration-300"
            >
              Torna alla home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
