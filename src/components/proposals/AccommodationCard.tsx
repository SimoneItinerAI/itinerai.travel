import type { TripParams } from '../../types/trip';
import { buildBookingUrl, buildAirbnbUrl } from '../../utils/linkBuilders';

interface AccommodationCardProps {
  params: TripParams;
}

export default function AccommodationCard({ params }: AccommodationCardProps) {
  const bookingUrl = buildBookingUrl({
    city: params.destination,
    days: params.days,
    guests: params.people,
  });

  const airbnbUrl = buildAirbnbUrl({
    city: params.destination,
    days: params.days,
    guests: params.people,
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-brand-orange/5 to-brand-orangelight/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orangelight flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Alloggi a {params.destination}</h2>
            <p className="text-xs text-slate-500">
              Per {params.people} {params.people === 1 ? 'persona' : 'persone'} · {params.days}{' '}
              {params.days === 1 ? 'giorno' : 'giorni'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Zona consigliata
          </h3>
          <p className="text-sm text-slate-600">
            Centro città o vicino alle tappe principali del tuo itinerario
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            Fascia di prezzo
          </h3>
          <p className="text-sm text-slate-600">
            Da €€ a €€€ in base alla categoria e posizione
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={bookingUrl || '#'}
            onClick={(e) => {
              if (!bookingUrl) e.preventDefault();
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/20"
          >
            Cerca su Booking.com
          </a>

          <a
            href={airbnbUrl || '#'}
            onClick={(e) => {
              if (!airbnbUrl) e.preventDefault();
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangelight text-white font-semibold text-center transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/20"
          >
            Cerca su Airbnb
          </a>
        </div>

        <p className="text-xs text-slate-500 text-center">
          I link ti portano alle piattaforme di prenotazione con i tuoi criteri di ricerca
        </p>
      </div>
    </div>
  );
}
