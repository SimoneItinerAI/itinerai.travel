import type { TripParams } from '../../types/trip';

interface ItinerarySummaryProps {
  params: TripParams;
}

export default function ItinerarySummary({ params }: ItinerarySummaryProps) {
  const estimatedCostPerPerson = Math.ceil((params.days * 150) + 250);
  const estimatedTotal = estimatedCostPerPerson * params.people;

  const highlights = [
    'Tour del centro storico',
    'Musei e gallerie principali',
    'Esperienze culinarie locali',
    'Quartieri caratteristici',
    params.days >= 4 ? 'Escursione nei dintorni' : null,
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Riepilogo del viaggio</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-teal flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Alloggio</h3>
              <p className="text-xs text-slate-500">Consigliato</p>
            </div>
          </div>
          <p className="text-sm text-slate-700 mb-2">Hotel o appartamento in posizione centrale</p>
          <p className="text-xs text-slate-500">Zona consigliata: vicino ai principali punti di interesse</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orangelight flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Esperienze</h3>
              <p className="text-xs text-slate-500">Highlight del viaggio</p>
            </div>
          </div>
          <ul className="space-y-1.5">
            {highlights.slice(0, 4).map((item, idx) => (
              <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-brand-orange mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Costo stimato</h3>
              <p className="text-xs text-slate-500">Indicativo</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-slate-600">Per persona:</span>
              <span className="text-lg font-bold text-slate-900">{estimatedCostPerPerson}€</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-600">Totale:</span>
              <span className="text-xl font-bold text-brand-orange">{estimatedTotal}€</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Include alloggio, esperienze e pasti indicativi</p>
        </div>
      </div>
    </div>
  );
}
