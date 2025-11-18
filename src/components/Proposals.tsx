import { useEffect, useMemo, useState } from 'react';
import { geocodeCity as geocodeCityOSM } from '../services/nominatim';
import { fetchAttractions, type Attraction } from '../services/overpass';

export default function Proposals({ destination, onBack }: { destination: string; onBack?: () => void }) {
  const city = useMemo(() => (destination ? destination[0].toUpperCase() + destination.slice(1) : ''), [destination]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pois, setPois] = useState<Attraction[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError(null);
      setPois([]);
      if (!city) return;
      setLoading(true);
      try {
        const geo = await geocodeCityOSM(city);
        if (!geo) {
          if (!cancelled) setError('Impossibile localizzare la città.');
        } else {
          const list = await fetchAttractions(geo.lat, geo.lon, 10000, 12);
          if (!cancelled) setPois(list);
        }
      } catch (e: any) {
        if (!cancelled) setError('Impossibile caricare i luoghi da vedere.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [city]);

  const bookingUrl = city ? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}` : '#';
  const airbnbUrl = city ? `https://www.airbnb.com/s/${encodeURIComponent(city)}/homes` : '#';
  const gygUrl = city ? `https://www.getyourguide.com/s/?q=${encodeURIComponent(city)}` : '#';

  return (
    <section className="min-h-screen w-full bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Proposte per {city}</h1>
            <p className="text-slate-600">Collegamenti reali e luoghi consigliati</p>
          </div>
          <button onClick={onBack} className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">← Torna indietro</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-xl font-semibold">Alloggi a {city}</h2>
              <p className="text-xs text-slate-500">Booking.com / Airbnb</p>
            </div>
            <div className="p-4 space-y-3">
              <a href={bookingUrl} target="_blank" rel="noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center">Cerca su Booking</a>
              <a href={airbnbUrl} target="_blank" rel="noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangelight text-white font-semibold text-center">Cerca su Airbnb</a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-xl font-semibold">Esperienze a {city}</h2>
              <p className="text-xs text-slate-500">GetYourGuide</p>
            </div>
            <div className="p-4 space-y-3">
              <a href={gygUrl} target="_blank" rel="noreferrer" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-white font-semibold text-center">Cerca tour e attività</a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-xl font-semibold">Luoghi da vedere</h2>
              <p className="text-xs text-slate-500">OpenTripMap</p>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-600">Caricamento in corso…</p>
              ) : error ? (
                <p className="text-sm text-slate-600">{error}</p>
              ) : pois.length === 0 ? (
                <p className="text-sm text-slate-600">Nessun luogo disponibile.</p>
              ) : (
                pois.map((p) => (
                  <div key={p.id} className="space-y-1">
                    <p className="text-sm font-medium">{p.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}