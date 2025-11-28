import { useEffect, useMemo, useState } from 'react';
import { geocodeCity as geocodeCityOSM } from '../services/nominatim';
import { fetchAttractions, type Attraction } from '../services/overpass';
import { loadLastItinerary, forceGenerateItinerary } from '../utils/itinerary';
import { buildSkyscannerUrl } from '../utils/affiliateLinks';
import type { Itinerary } from '../types/trip';
import {
  buildBookingUrl,
  buildAirbnbUrl,
  buildGetYourGuideUrl,
  // buildFlightsUrl,
  type BaseItineraryContext,
} from '../utils/linkBuilders';

type Wiki = { title: string; description?: string; extract?: string; thumbnailUrl?: string; pageUrl?: string };
type EnrichedAttraction = Attraction & { wiki?: Wiki };

const AIRPORTS: { code: string; city: string; name: string }[] = [
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
  { code: 'PRG', city: 'Praga', name: 'Václav Havel' },
];

export default function Proposals({ destination, onBack }: { destination: string; onBack?: () => void }) {
  const city = useMemo(() => {
    if (!destination) return '';
    const trimmed = destination.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  }, [destination]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pois, setPois] = useState<EnrichedAttraction[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [origin, setOrigin] = useState('');
  const [originInput, setOriginInput] = useState('');
  const suggestions = useMemo(() => {
    const q = originInput.trim().toLowerCase();
    if (q.length < 2) return [] as { code: string; city: string; name: string }[];
    return AIRPORTS.filter(a =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [originInput]);

  useEffect(() => {
    setItinerary(loadLastItinerary());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError(null);
      setPois([]);
      const dest = itinerary?.params.destination || city;
      if (!dest) { setPageLoading(false); return; }
      setLoading(true);
      try {
        const useBackend = import.meta.env.PROD;
        if (useBackend) {
          const params = new URLSearchParams({ city: dest, radius: '10000', limit: '12' });
          const r = await fetch(`/api/attractions?${params.toString()}`);
          if (!r.ok) throw new Error('api error');
          const data = await r.json();
          if (!cancelled) setPois(data as EnrichedAttraction[]);
        } else {
          const geo = await geocodeCityOSM(dest);
          if (!geo) {
            if (!cancelled) setError('Impossibile localizzare la città.');
          } else {
            const list = await fetchAttractions(geo.lat, geo.lon, 10000, 12);
            const lang = 'it';
            const enriched: EnrichedAttraction[] = await Promise.all(
              list.map(async (p) => {
                let wiki: Wiki | undefined = undefined;
                try {
                  const titleEnc = encodeURIComponent(p.name);
                  const sRes = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${titleEnc}`);
                  if (sRes.ok) {
                    const s = await sRes.json();
                    wiki = {
                      title: s?.title,
                      description: s?.description,
                      extract: s?.extract,
                      thumbnailUrl: s?.thumbnail?.source,
                      pageUrl: s?.content_urls?.desktop?.page,
                    };
                  } else if (p.lat && p.lon) {
                    const params = new URLSearchParams({
                      action: 'query',
                      format: 'json',
                      origin: '*',
                      list: 'geosearch',
                      gscoord: `${p.lat}|${p.lon}`,
                      gsradius: '1000',
                      gslimit: '1',
                    });
                    const gsRes = await fetch(`https://${lang}.wikipedia.org/w/api.php?${params.toString()}`);
                    if (gsRes.ok) {
                      const gs = await gsRes.json();
                      const t = gs?.query?.geosearch?.[0]?.title;
                      if (t) {
                        const s2Res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`);
                        if (s2Res.ok) {
                          const s2 = await s2Res.json();
                          wiki = {
                            title: s2?.title,
                            description: s2?.description,
                            extract: s2?.extract,
                            thumbnailUrl: s2?.thumbnail?.source,
                            pageUrl: s2?.content_urls?.desktop?.page,
                          };
                        }
                      }
                    }
                  }
                } catch { void 0 }
                return { ...p, wiki } as EnrichedAttraction;
              })
            );
            if (!cancelled) setPois(enriched);
          }
        }
      } catch {
        if (!cancelled) setError('Impossibile caricare i luoghi da vedere.');
      } finally {
        if (!cancelled) { setLoading(false); setPageLoading(false); }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [city, itinerary]);

  const destForLinks = itinerary?.params.destination || city;
  const itineraryContext: BaseItineraryContext = {
    city: destForLinks,
    days: itinerary?.params.days,
    guests: itinerary?.params.people,
  };
  const bookingUrl = buildBookingUrl(itineraryContext);
  const airbnbUrl = buildAirbnbUrl(itineraryContext);
  const gygUrl = buildGetYourGuideUrl(itineraryContext);
  const flightsUrl = buildSkyscannerUrl({
    destination: destForLinks,
    startDate: itinerary?.params.startDate,
    endDate: itinerary?.params.endDate,
    people: itinerary?.params.people,
    origin: origin && origin.trim() ? origin.trim().toUpperCase() : undefined,
  });

  if (pageLoading || loading) {
    const dest = itinerary?.params.destination || destination || '';
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#1f2937,_transparent_55%),radial-gradient(circle_at_bottom,_#0f172a,_transparent_55%)]" />
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ItinerAI" className="h-8 w-8 object-contain shrink-0 rounded-xl shadow-lg shadow-brand-orange/40" />
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">ItinerAI sta lavorando</p>
              <p className="text-lg font-semibold text-white">Prepariamo il tuo viaggio{dest ? ` per ${dest}` : ''}...</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-300 text-center max-w-md">Stiamo analizzando la destinazione, cercando alloggi, attività e luoghi da non perdere per costruire un itinerario su misura.</div>
          <div className="mt-3 flex flex-col sm:flex-row gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /><span>1. Analizzo la destinazione</span></div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70"><div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" /><span>2. Cerco alloggi & attività</span></div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70"><div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" /><span>3. Organizzo il tuo itinerario</span></div>
          </div>
          <div className="mt-5 w-56 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-blue animate-[loadingBar_1.4s_ease-in-out_infinite]" />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 italic">Questo passaggio richiede solo pochi secondi.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!itinerary ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Proposte</h1>
            </div>
            <div className="mt-3 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row md:gap-3">
              <button onClick={onBack} className="w-full md:w-auto px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">← Torna indietro</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="hidden md:block text-4xl font-bold tracking-tight text-slate-900">Proposte per {itinerary.summaryTitle}</h1>
              <h1 className="block md:hidden text-2xl font-bold tracking-tight text-slate-900">
                {destForLinks} · {itinerary.params.days} {itinerary.params.days === 1 ? 'giorno' : 'giorni'} · {itinerary.params.people} {itinerary.params.people === 1 ? 'persona' : 'persone'}
              </h1>
              {itinerary.params.startDate && itinerary.params.endDate && (
                <p className="block md:hidden text-sm text-slate-500">
                  dal {new Date(itinerary.params.startDate).toLocaleDateString('it-IT')} al {new Date(itinerary.params.endDate).toLocaleDateString('it-IT')}
                </p>
              )}

            </div>
            <div className="mt-3 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row md:gap-3">
              <button onClick={() => { if (!itinerary) return; forceGenerateItinerary(itinerary.params); setItinerary(loadLastItinerary()); onBack?.(); }} className="w-full md:w-auto px-4 py-2 rounded-full border border-brand-orange text-brand-orange hover:bg-brand-orange/10">Rigenera itinerario</button>
              <button onClick={onBack} className="w-full md:w-auto px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">← Torna indietro</button>
            </div>
          </div>
        )}

        

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 16l20-5-7 7v4l-5-3-4 3v-4l-4-2z"/></svg>
                <h2 className="text-xl font-semibold">Voli per {destForLinks}</h2>
              </div>
              <p className="text-xs text-slate-500">Skyscanner</p>
            </div>
            <div className="p-4 space-y-3">
              {itinerary?.params.startDate && itinerary?.params.endDate ? (
                <p className="text-xs text-slate-600">Date: {new Date(itinerary.params.startDate).toLocaleDateString('it-IT')} → {new Date(itinerary.params.endDate).toLocaleDateString('it-IT')}</p>
              ) : (
                <p className="text-xs text-slate-600">Imposta le date nella pagina dell’itinerario per ricerche più precise.</p>
              )}
              {typeof itinerary?.params.people === 'number' && (
                <p className="text-xs text-slate-600">Passeggeri: {itinerary.params.people}</p>
              )}
              <div className="flex items-center gap-2 relative">
                <span className="text-xs text-slate-600">Partenza</span>
                <input
                  value={originInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    setOriginInput(v);
                    const code = v.trim().toUpperCase();
                    if (/^[A-Z]{3}$/.test(code)) setOrigin(code);
                    else setOrigin('');
                  }}
                  placeholder="Es. Milano (MXP)"
                  className="w-full md:w-56 px-3 py-1.5 text-sm rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                {suggestions.length > 0 && (
                  <div className="absolute left-16 top-10 z-20 w-[calc(100%-4rem)] md:w-56 rounded-xl border border-slate-200 bg-white shadow-lg">
                    {suggestions.map(s => (
                      <button
                        key={s.code}
                        type="button"
                        onMouseDown={() => { setOrigin(s.code); setOriginInput(`${s.city} (${s.code})`); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50"
                      >
                        <span className="text-sm font-medium">{s.city} ({s.code})</span>
                        <span className="block text-[11px] text-slate-500">{s.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Suggerimento: usa il codice IATA (es. MXP, FCO) per risultati migliori.</p>
              <a
                href={flightsUrl || '#'}
                onClick={(e)=>{ if(!flightsUrl) e.preventDefault(); }}
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center ${!flightsUrl ? 'opacity-60 cursor-not-allowed' : ''}`}
                aria-disabled={!flightsUrl}
              >
                Cerca voli
              </a>
            </div>
          </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 10h14a3 3 0 013 3v5h-2v-2H5v2H3v-8zM5 8a3 3 0 016 0H5z"/></svg>
                <h2 className="text-xl font-semibold">Alloggi a {destForLinks}</h2>
              </div>
              {itinerary && (
                <p className="text-xs text-slate-500 mt-1">Per {itinerary.params.people} {itinerary.params.people === 1 ? 'persona' : 'persone'} · {itinerary.params.days} {itinerary.params.days === 1 ? 'giorno' : 'giorni'}</p>
              )}
              <p className="text-xs text-slate-500">Booking.com / Airbnb</p>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-600">Zona consigliata: vicino al centro o alle tappe principali del tuo itinerario.</p>
              <p className="text-xs text-slate-600">Fascia di prezzo stimata: €€</p>
              <a href={bookingUrl || '#'} onClick={(e)=>{ if(!bookingUrl) e.preventDefault(); }} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center">Cerca su Booking</a>
              <a href={airbnbUrl || '#'} onClick={(e)=>{ if(!airbnbUrl) e.preventDefault(); }} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangelight text-white font-semibold text-center">Cerca su Airbnb</a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16l-2 10H6L4 7zm3-3h10v2H7V4z"/></svg>
                <h2 className="text-xl font-semibold">Esperienze a {destForLinks}</h2>
              </div>
              <p className="text-xs text-slate-500">GetYourGuide</p>
            </div>
            <div className="p-4 space-y-3">
              {(() => {
                const topPois = itinerary?.poisUsed?.slice(0, 3) ?? [];
                const poisLabel = topPois.map(p => p.name).join(', ');
                return (
                  <p className="text-xs text-slate-600">
                    {topPois.length > 0
                      ? `Tour e attività in zona: ${poisLabel} e altre tappe del tuo itinerario.`
                      : `Tour e attività in linea con il tuo itinerario.`}
                  </p>
                );
              })()}
              <p className="text-xs text-slate-600">Esplora esperienze locali, visite guidate e attività che completano le tappe del viaggio.</p>
              <a href={gygUrl || '#'} onClick={(e)=>{ if(!gygUrl) e.preventDefault(); }} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center">Cerca tour e attività</a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z"/></svg>
                <h2 className="text-xl font-semibold">Luoghi da vedere</h2>
              </div>
              <p className="text-xs text-slate-500">OpenStreetMap + Wikipedia</p>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-600">Caricamento in corso…</p>
              ) : error ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Al momento non riusciamo a mostrare i luoghi da vedere.</p>
                  <p className="text-xs text-slate-600">Suggerimenti: centro storico, principali piazze e musei cittadini.</p>
                  <a href={`https://it.wikipedia.org/w/index.php?search=${encodeURIComponent(destForLinks)}+cosa+vedere`} target="_blank" rel="noreferrer" className="inline-block text-xs text-brand-blue underline">Cerca su Wikipedia</a>
                  <a href={`https://it.wikipedia.org/wiki/${encodeURIComponent(destForLinks)}`} target="_blank" rel="noreferrer" className="inline-block text-xs text-brand-blue underline">Apri la pagina Wikipedia di {destForLinks}</a>
                </div>
              ) : itinerary?.poisUsed && itinerary.poisUsed.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {itinerary.poisUsed.slice(0, 8).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl">
                      <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        {p.shortDescription && (<p className="text-xs text-slate-600 line-clamp-2">{p.shortDescription}</p>)}
                        {p.category && (<p className="text-[11px] text-slate-500 uppercase tracking-wide">{p.category}</p>)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : pois.length === 0 ? (
                <p className="text-sm text-slate-600">Nessun luogo disponibile.</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {pois.map((p) => (
                    <a key={p.id} href={p.wiki?.pageUrl ?? '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                      {p.wiki?.thumbnailUrl ? (
                        <img src={p.wiki.thumbnailUrl} alt={p.wiki?.title ?? p.name} className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        {p.wiki?.description ? (
                          <p className="text-xs text-slate-600 line-clamp-2">{p.wiki.description}</p>
                        ) : p.wiki?.extract ? (
                          <p className="text-xs text-slate-600 line-clamp-2">{p.wiki.extract}</p>
                        ) : null}
                      </div>
                    </a>
                  ))}
                  {pois.length > 5 && (
                    <p className="text-xs text-slate-500 mt-2">Altri luoghi sono disponibili nella mappa e nelle ricerche correlate.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
