import type { TripParams, Itinerary } from '../../types/trip'
import { useMemo, useState } from 'react'
import { buildTripAdvisorUrl } from '../../utils/linkBuilders'

export default function TripAdvisorCard({ params, itinerary }: { params: TripParams; itinerary: Itinerary | null }) {
  const [query, setQuery] = useState('esperienze locali')
  const base = useMemo(() => buildTripAdvisorUrl({ city: params.destination, query }), [params.destination, query])
  const toItalian = (s: string) => {
    // Se contiene caratteri non latini/ASCII, usa descrizioni generiche italiane
    const nonLatin = /[^\x20-\x7E]/.test(s)
    if (nonLatin) {
      if (/gemma/i.test(s)) return 'quartiere autentico'
      if (/iconico/i.test(s)) return 'monumento iconico'
      if (/culturale/i.test(s)) return 'esperienza culturale'
      if (/extra/i.test(s)) return 'tappa extra'
      return 'esperienza locale'
    }
    return s
  }
  const suggestions = useMemo(() => {
    const names = (itinerary?.days || []).flatMap(d => d.items.map(i => i.description)).filter(Boolean)
    const clean = names
      .map(s => s.replace(/^\p{Emoji_Presentation}?\s*/u, '')
        .replace(/^(Luogo iconico:|Esperienza culturale:|Gemma nascosta:|Esperienza locale:|Tappa extra:)\s*/i, ''))
      .map(toItalian)
      .filter(s => s.length > 0)
    return Array.from(new Set(clean)).slice(0,3)
  }, [itinerary])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l-8 4 8 4 8-4-8-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14l8 4 8-4" /></svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">TripAdvisor</h3>
          <p className="text-xs text-slate-500">Prenota esperienze e attività</p>
        </div>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca esperienza (es. tour gastronomico)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
        {suggestions.length > 0 && (
          <div className="text-xs text-slate-600">
            Suggerimenti: {suggestions.map((s, i) => (
              <button key={i} onClick={() => setQuery(s)} className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 mr-2 mt-1">{s}</button>
            ))}
          </div>
        )}
        <a
          href={base}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          Cerca su TripAdvisor
        </a>
      </div>
    </div>
  )
}
