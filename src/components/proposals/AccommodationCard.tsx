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
        <div className="bg-gradient-to-br from-brand-orange/10 to-brand-orangelight/10 rounded-xl p-4 border border-brand-orange/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 mb-1">Prezzo indicativo a notte</p>
              <p className="text-2xl font-bold text-brand-orange">€60 - €180</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-orange" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Da hotel 3★ ad appartamenti di lusso</p>
        </div>

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
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Include
          </h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• WiFi gratuito</li>
            <li>• Cancellazione flessibile</li>
            <li>• Recensioni verificate</li>
          </ul>
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
