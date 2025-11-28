import type { TripParams, Itinerary } from '../../types/trip';
import { buildGetYourGuideUrl } from '../../utils/linkBuilders';

interface ExperiencesCardProps {
  params: TripParams;
  itinerary: Itinerary | null;
}

export default function ExperiencesCard({ params, itinerary }: ExperiencesCardProps) {
  const gygUrl = buildGetYourGuideUrl({
    city: params.destination,
    days: params.days,
    guests: params.people,
  });

  const topPois = itinerary?.poisUsed?.slice(0, 3) ?? [];
  const poisLabel = topPois.map((p) => p.name).join(', ');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Esperienze a {params.destination}</h2>
            <p className="text-xs text-slate-500">Tour e attività guidate</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {topPois.length > 0 ? (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Basato sul tuo itinerario
            </h3>
            <p className="text-sm text-slate-600">
              Tour e attività in zona: {poisLabel}
            </p>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Esperienze personalizzate
            </h3>
            <p className="text-sm text-slate-600">
              Tour e attività in linea con il tuo itinerario
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-medium text-slate-900 text-sm">Cosa include:</h3>
          <ul className="space-y-1.5">
            <li className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-brand-orange mt-0.5">•</span>
              <span>Visite guidate con esperti locali</span>
            </li>
            <li className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-brand-orange mt-0.5">•</span>
              <span>Esperienze culinarie e degustazioni</span>
            </li>
            <li className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-brand-orange mt-0.5">•</span>
              <span>Tour culturali e storici</span>
            </li>
            <li className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-brand-orange mt-0.5">•</span>
              <span>Attività all'aperto e nella natura</span>
            </li>
          </ul>
        </div>

        <a
          href={gygUrl || '#'}
          onClick={(e) => {
            if (!gygUrl) e.preventDefault();
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/20"
        >
          Scopri esperienze su GetYourGuide
        </a>

        <p className="text-xs text-slate-500 text-center">
          Prenota attività e tour con cancellazione gratuita
        </p>
      </div>
    </div>
  );
}
