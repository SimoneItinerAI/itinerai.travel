import { useState, useMemo } from 'react';
import type { TripParams } from '../../types/trip';
import { buildSkyscannerUrl } from '../../utils/affiliateLinks';

interface FlightsCardProps {
  params: TripParams;
}

const AIRPORTS = [
  { code: 'MXP', city: 'Milano', name: 'Malpensa' },
  { code: 'LIN', city: 'Milano', name: 'Linate' },
  { code: 'BGY', city: 'Bergamo', name: 'Orio al Serio' },
  { code: 'FCO', city: 'Roma', name: 'Fiumicino' },
  { code: 'CIA', city: 'Roma', name: 'Ciampino' },
  { code: 'VCE', city: 'Venezia', name: 'Marco Polo' },
  { code: 'NAP', city: 'Napoli', name: 'Capodichino' },
  { code: 'TRN', city: 'Torino', name: 'Caselle' },
  { code: 'BLQ', city: 'Bologna', name: 'Guglielmo Marconi' },
  { code: 'PSA', city: 'Pisa', name: 'Galileo Galilei' },
  { code: 'PMO', city: 'Palermo', name: 'Falcone Borsellino' },
  { code: 'CAG', city: 'Cagliari', name: 'Elmas' },
  { code: 'CTA', city: 'Catania', name: 'Fontanarossa' },
];

export default function FlightsCard({ params }: FlightsCardProps) {
  const [origin, setOrigin] = useState('');
  const [originInput, setOriginInput] = useState('');

  const suggestions = useMemo(() => {
    const q = originInput.trim().toLowerCase();
    if (q.length < 2) return [];
    return AIRPORTS.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [originInput]);

  const flightsUrl = buildSkyscannerUrl({
    destination: params.destination,
    startDate: params.startDate,
    endDate: params.endDate,
    people: params.people,
    origin: origin && origin.trim() ? origin.trim().toUpperCase() : undefined,
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-brand-blue/5 to-brand-teal/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-teal flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Voli per {params.destination}</h2>
            <p className="text-xs text-slate-500">Powered by Skyscanner</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Date:</span>
          <span className="font-medium text-slate-900">
            {new Date(params.startDate).toLocaleDateString('it-IT')} →{' '}
            {new Date(params.endDate).toLocaleDateString('it-IT')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Passeggeri:</span>
          <span className="font-medium text-slate-900">{params.people}</span>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Aeroporto di partenza
          </label>
          <input
            type="text"
            value={originInput}
            onChange={(e) => {
              const v = e.target.value;
              setOriginInput(v);
              const code = v.trim().toUpperCase();
              if (/^[A-Z]{3}$/.test(code)) {
                setOrigin(code);
              } else {
                setOrigin('');
              }
            }}
            placeholder="Es. Milano (MXP)"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 z-20 rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onMouseDown={() => {
                    setOrigin(s.code);
                    setOriginInput(`${s.city} (${s.code})`);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <span className="block text-sm font-medium text-slate-900">
                    {s.city} ({s.code})
                  </span>
                  <span className="block text-xs text-slate-500">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Suggerimento: usa il codice IATA (es. MXP, FCO) per risultati migliori.
        </p>

        <a
          href={flightsUrl || '#'}
          onClick={(e) => {
            if (!flightsUrl) e.preventDefault();
          }}
          target="_blank"
          rel="noopener noreferrer"
          className={`block px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center transition-all duration-300 ${
            !flightsUrl
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-lg hover:shadow-brand-blue/20'
          }`}
          aria-disabled={!flightsUrl}
        >
          {flightsUrl ? 'Cerca voli su Skyscanner' : 'Inserisci aeroporto di partenza'}
        </a>
      </div>
    </div>
  );
}
