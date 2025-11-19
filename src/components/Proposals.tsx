import { useEffect, useMemo, useState } from 'react';
import { geocodeCity as geocodeCityOSM } from '../services/nominatim';
import { fetchAttractions, type Attraction } from '../services/overpass';
import { loadItineraryFromStorage, type ItineraryData, forceGenerateItinerary } from '../utils/itinerary';

type Wiki = { title: string; description?: string; extract?: string; thumbnailUrl?: string; pageUrl?: string };
type EnrichedAttraction = Attraction & { wiki?: Wiki };

export default function Proposals({ destination, onBack }: { destination: string; onBack?: () => void }) {
  const city = useMemo(() => (destination ? destination[0].toUpperCase() + destination.slice(1) : ''), [destination]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pois, setPois] = useState<EnrichedAttraction[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);

  useEffect(() => {
    setItinerary(loadItineraryFromStorage());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError(null);
      setPois([]);
      const dest = itinerary?.params.destination || city;
      if (!dest) return;
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
                } catch {}
                return { ...p, wiki } as EnrichedAttraction;
              })
            );
            if (!cancelled) setPois(enriched);
          }
        }
      } catch (e: any) {
        if (!cancelled) setError('Impossibile caricare i luoghi da vedere.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [city, itinerary]);

  const destForLinks = itinerary?.params.destination || city;
  const bookingUrl = destForLinks ? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destForLinks)}` : '#';
  const airbnbUrl = destForLinks ? `https://www.airbnb.com/s/${encodeURIComponent(destForLinks)}/homes` : '#';
  const gygUrl = destForLinks ? `https://www.getyourguide.com/s/?q=${encodeURIComponent(destForLinks)}` : '#';

  return (
    <section className="min-h-screen w-full bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!itinerary ? (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Proposte</h1>
              <p className="text-slate-600">Collegamenti reali e luoghi consigliati</p>
            </div>
            <button onClick={onBack} className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">← Torna indietro</button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Proposte per {itinerary.summaryTitle}</h1>
              <p className="text-slate-600">Collegamenti reali e luoghi consigliati</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { if (!itinerary) return; forceGenerateItinerary(itinerary.params); setItinerary(loadItineraryFromStorage()); }} className="px-4 py-2 rounded-full border border-brand-orange text-brand-orange hover:bg-brand-orange/10">Rigenera itinerario</button>
              <button onClick={onBack} className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">← Torna indietro</button>
            </div>
          </div>
        )}

        {itinerary && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-brand-teal" />
            <div>
              <p className="text-xl md:text-2xl font-semibold">{itinerary.summaryTitle} – Itinerario generato da ItinerAI</p>
              <p className="text-sm text-slate-600">{itinerary.summarySubtitle}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <style>{`@keyframes fadeLine{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}`}</style>
            {itinerary.daysPreview.map((d, i) => (
              <div key={d.day} className="rounded-xl border border-slate-200 p-3" style={{ animation: 'fadeLine 520ms ease forwards', animationDelay: `${120 * i}ms`, opacity: 0 }}>
                <p className="text-sm font-semibold">{d.title}</p>
                <p className="text-xs text-slate-600">{d.shortDescription}</p>
                <ul className="mt-1 list-disc list-inside text-xs text-slate-600">
                  {d.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 10h14a3 3 0 013 3v5h-2v-2H5v2H3v-8zM5 8a3 3 0 016 0H5z"/></svg>
                <h2 className="text-xl font-semibold">Alloggi a {destForLinks}{itinerary ? ` per ${itinerary.params.people} ${itinerary.params.people === 1 ? 'persona' : 'persone'} ${itinerary.params.days} ${itinerary.params.days === 1 ? 'giorno' : 'giorni'}` : ''}</h2>
              </div>
              <p className="text-xs text-slate-500">Booking.com / Airbnb</p>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-600">Zona consigliata: vicino al centro o alle tappe principali del tuo itinerario.</p>
              <p className="text-xs text-slate-600">Fascia di prezzo stimata: €€</p>
              <a href={bookingUrl} target="_blank" rel="noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center">Cerca su Booking</a>
              <a href={airbnbUrl} target="_blank" rel="noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangelight text-white font-semibold text-center">Cerca su Airbnb</a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16l-2 10H6L4 7zm3-3h10v2H7V4z"/></svg>
                <h2 className="text-xl font-semibold">Esperienze a {destForLinks}{itinerary ? ` per ${itinerary.params.days} ${itinerary.params.days === 1 ? 'giorno' : 'giorni'}` : ''}</h2>
              </div>
              <p className="text-xs text-slate-500">GetYourGuide</p>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-600">Suggerito: tour panoramico o crociera sul fiume.</p>
              <p className="text-xs text-slate-600">Consigliato anche un free walking tour nel centro storico.</p>
              <a href={gygUrl} target="_blank" rel="noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center">Cerca tour e attività</a>
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
                </div>
              ) : pois.length === 0 ? (
                <p className="text-sm text-slate-600">Nessun luogo disponibile.</p>
              ) : (
                pois.map((p) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}