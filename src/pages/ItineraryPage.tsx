import { useEffect, useMemo, useState } from 'react';
import { buildGetYourGuideUrl, type BaseItineraryContext } from '../utils/linkBuilders';
import type { TripParams, Itinerary } from '../types/trip';
import { loadTripParams, loadLastItinerary, saveLastItinerary, buildItineraryForCity, regenerateDayCity, sameParams, createItineraryFromParams } from '../utils/itinerary';
import ItineraryDayCard from '../components/ItineraryDayCard';

export default function ItineraryPage({ onNavigateProposals, onNavigateHome }: { onNavigateProposals: () => void; onNavigateHome: () => void }) {
  const [params, setParams] = useState<TripParams | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [continentFilter, setContinentFilter] = useState<string>('all');
  const [preferHighQualityImages, setPreferHighQualityImages] = useState<boolean>(() => {
    try { return localStorage.getItem('itinerai:pref:hqimg') === '1'; } catch { return false; }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { const raw = localStorage.getItem('itinerai:favorites'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });

  useEffect(() => {
    const tp = loadTripParams();
    const last = loadLastItinerary();
    if (!tp && !last) {
      setLoading(false);
      setParams(null);
      setItinerary(null);
      return;
    }
    if (tp && last) {
      setParams(tp);
      if (sameParams(last.params, tp)) {
        setItinerary(last);
        setLoading(false);
      } else {
        setLoading(true);
        buildItineraryForCity(tp)
          .then((gen) => { saveLastItinerary(gen); setItinerary(gen); })
          .catch(() => { const gen = createItineraryFromParams(tp); saveLastItinerary(gen); setItinerary(gen); })
          .finally(() => setLoading(false));
      }
      return;
    }
    if (tp && !last) {
      setParams(tp);
      setLoading(true);
      buildItineraryForCity(tp)
        .then((gen) => { saveLastItinerary(gen); setItinerary(gen); })
        .catch(() => { const gen = createItineraryFromParams(tp); saveLastItinerary(gen); setItinerary(gen); })
        .finally(() => setLoading(false));
      return;
    }
    if (!tp && last) {
      setParams(last.params);
      setItinerary(last);
      setLoading(false);
      return;
    }
  }, []);

  const headerTitle = useMemo(() => {
    if (!params) return '';
    return `${params.destination} · ${params.days} ${params.days === 1 ? 'giorno' : 'giorni'} · ${params.people} ${params.people === 1 ? 'persona' : 'persone'}`;
  }, [params]);

  const iconic: Array<{ id: string; name: string; city: string; country: string; continent: 'Europa'|'Americhe'|'Asia'|'Oceania'|'Africa'; image: string; wiki: string; desc: string; why: string }> = [
    { id: 'eiffel', name: 'Torre Eiffel', city: 'Parigi', country: 'Francia', continent: 'Europa', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/640px-Tour_Eiffel_Wikimedia_Commons.jpg', wiki: 'https://it.wikipedia.org/wiki/Tour_Eiffel', desc: 'Simbolo di Parigi con vista mozzafiato sulla città.', why: 'Icona mondiale dell’ingegneria e del romanticismo.' },
    { id: 'colosseo', name: 'Colosseo', city: 'Roma', country: 'Italia', continent: 'Europa', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Colosseo_2020.jpg/640px-Colosseo_2020.jpg', wiki: 'https://it.wikipedia.org/wiki/Colosseo', desc: 'Anfiteatro romano meglio conservato e più visitato.', why: 'Testimonianza unica della civiltà romana.' },
    { id: 'machu', name: 'Machu Picchu', city: 'Cusco', country: 'Perù', continent: 'Americhe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/View_of_Machu_Picchu%2C_Peru.jpg/640px-View_of_Machu_Picchu%2C_Peru.jpg', wiki: 'https://it.wikipedia.org/wiki/Machu_Picchu', desc: 'Città Inca tra le Ande con panorami spettacolari.', why: 'Patrimonio UNESCO e meta da sogno per trekking.' },
    { id: 'greatwall', name: 'Grande Muraglia', city: 'Pechino', country: 'Cina', continent: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_Great_Wall_8185.jpg/640px-20090529_Great_Wall_8185.jpg', wiki: 'https://it.wikipedia.org/wiki/Grande_Muraglia', desc: 'Imponente opera difensiva che si snoda per migliaia di km.', why: 'Capolavoro di architettura militare.' },
    { id: 'liberty', name: 'Statua della Libertà', city: 'New York', country: 'USA', continent: 'Americhe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/640px-Statue_of_Liberty_7.jpg', wiki: 'https://it.wikipedia.org/wiki/Statua_della_Libert%C3%A0', desc: 'Simbolo di accoglienza e libertà nel porto di New York.', why: 'Icona culturale degli Stati Uniti.' },
    { id: 'taj', name: 'Taj Mahal', city: 'Agra', country: 'India', continent: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/640px-Taj-Mahal.jpg', wiki: 'https://it.wikipedia.org/wiki/Taj_Mahal', desc: 'Mausoleo in marmo bianco di straordinaria bellezza.', why: 'Capolavoro dell’arte moghul e dell’amore eterno.' },
    { id: 'cristo', name: 'Cristo Redentore', city: 'Rio de Janeiro', country: 'Brasile', continent: 'Americhe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg/640px-Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg', wiki: 'https://it.wikipedia.org/wiki/Cristo_Redentore', desc: 'Statua che domina Rio e la Baia di Guanabara.', why: 'Panorama iconico e spiritualità.' },
    { id: 'sydney', name: 'Sydney Opera House', city: 'Sydney', country: 'Australia', continent: 'Oceania', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Sydney_Opera_House_-_Dec_2008.jpg/640px-Sydney_Opera_House_-_Dec_2008.jpg', wiki: 'https://it.wikipedia.org/wiki/Opera_di_Sydney', desc: 'Teatro celebre per l’architettura a vele.', why: 'Icona moderna e centro culturale.' }
  ];

  const hiddenGems: Array<{ id: string; name: string; city: string; country: string; continent: 'Europa'|'Americhe'|'Asia'|'Oceania'|'Africa'; lat: number; lon: number; desc: string; unique: string }> = [
    { id: 'matera', name: 'Sassi di Matera', city: 'Matera', country: 'Italia', continent: 'Europa', lat: 40.666, lon: 16.606, desc: 'Case scavate nella roccia e vicoli scenografici.', unique: 'Atmosfera unica tra grotte e chiese rupestri.' },
    { id: 'giethoorn', name: 'Giethoorn', city: 'Overijssel', country: 'Paesi Bassi', continent: 'Europa', lat: 52.738, lon: 6.079, desc: 'Villaggio senza strade con canali e ponticelli.', unique: 'Giro in barca tra case tradizionali.' },
    { id: 'sapa', name: 'Sapa', city: 'Lào Cai', country: 'Vietnam', continent: 'Asia', lat: 22.335, lon: 103.843, desc: 'Terrazze di riso e trekking tra villaggi.', unique: 'Esperienze autentiche con minoranze locali.' },
    { id: 'chefchaouen', name: 'Chefchaouen', city: 'Tanger-Tetouan', country: 'Marocco', continent: 'Africa', lat: 35.170, lon: -5.270, desc: 'Città blu tra le montagne del Rif.', unique: 'Vicoli dipinti di blu e artigianato locale.' },
    { id: 'hallstatt', name: 'Hallstatt', city: 'Alta Austria', country: 'Austria', continent: 'Europa', lat: 47.563, lon: 13.649, desc: 'Paesino sul lago tra Alpi e case colorate.', unique: 'Scorci da cartolina e miniere di sale.' },
    { id: 'plitvice', name: 'Laghi di Plitvice', city: 'Lika-Senj', country: 'Croazia', continent: 'Europa', lat: 44.880, lon: 15.616, desc: 'Laghi turchesi collegati da cascate.', unique: 'Passerelle di legno e natura incontaminata.' }
  ];

  const filteredIconic = iconic.filter(i => continentFilter === 'all' || i.continent === continentFilter);
  const filteredGems = hiddenGems.filter(i => continentFilter === 'all' || i.continent === continentFilter);

  const itineraryContext: BaseItineraryContext = {
    city: params?.destination || '',
    days: params?.days,
    guests: params?.people,
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('itinerai:favorites', JSON.stringify(next)); } catch { void 0; }
      return next;
    });
  };

  const handleDiscover = () => {
    const pool = [...filteredIconic, ...filteredGems];
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const el = document.getElementById(`dest-${pick.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleShare = () => {
    const ids = favorites.join(', ');
    const text = `Le mie destinazioni preferite su ItinerAI: ${ids || 'nessuna'}\n${window.location.origin}/itinerario`;
    if (navigator.share) {
      navigator.share({ title: 'ItinerAI – Preferiti', text, url: window.location.href }).catch(()=>{});
      return;
    }
    navigator.clipboard?.writeText(text).catch(()=>{});
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#1f2937,_transparent_55%),radial-gradient(circle_at_bottom,_#0f172a,_transparent_55%)]" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ItinerAI" className="h-8 w-8 object-contain shrink-0 rounded-xl shadow-lg shadow-brand-orange/40" />
            <p className="text-lg font-semibold text-white">ItinerAI sta preparando il tuo viaggio…</p>
          </div>
          <div className="mt-2 w-56 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-blue animate-[loadingBar_1.4s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  if (!params) {
    return (
      <div className="min-h-screen w-full bg-white text-slate-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <p className="text-xl font-semibold">Non ho trovato nessun viaggio.</p>
          <p className="text-sm text-slate-600 mt-1">Torna alla home per crearne uno.</p>
          <button onClick={onNavigateHome} className="mt-4 w-full px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Torna alla home</button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{headerTitle}</h1>
            <p className="text-sm text-slate-600">dal {new Date(params.startDate).toLocaleDateString('it-IT')} al {new Date(params.endDate).toLocaleDateString('it-IT')}</p>
          </div>
          <div className="mt-3 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row md:gap-3">
            <button onClick={onNavigateProposals} className="w-full md:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-orangelight text-white">Vai alle proposte di hotel, voli e attività</button>
            <button onClick={() => itinerary && saveLastItinerary(itinerary)} className="w-full md:w-auto px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Salva questo viaggio</button>
            <button onClick={onNavigateHome} className="w-full md:w-auto px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Ritorna alla Home page</button>
          </div>
      </div>

        {!itinerary ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <p className="text-sm text-slate-700">Itinerario non disponibile.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {itinerary.days.map((d, i) => (
              <div key={d.dayIndex} className="space-y-2">
                <ItineraryDayCard
                  day={d}
                  poiById={Object.fromEntries((itinerary.poisUsed ?? []).map(p => [p.id, p]))}
                  loading={regeneratingDay === d.dayIndex}
                  onChange={(next) => {
                    const updated: Itinerary = { ...itinerary, days: itinerary.days.map((x, xi) => (xi === i ? next : x)) };
                    setItinerary(updated);
                    saveLastItinerary(updated);
                  }}
                  onDeleteItem={(itemIndex) => {
                    const updatedItems = d.items.filter((_, idx) => idx !== itemIndex);
                    const updatedDay = { ...d, items: updatedItems };
                    const updated: Itinerary = { ...itinerary, days: itinerary.days.map((x, xi) => (xi === i ? updatedDay : x)) };
                    setItinerary(updated);
                    saveLastItinerary(updated);
                  }}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setRegeneratingDay(d.dayIndex);
                      const next = await regenerateDayCity(itinerary, d.dayIndex);
                      setItinerary(next);
                      setRegeneratingDay(null);
                    }}
                    className="px-3 py-1.5 rounded-full border border-brand-blue text-brand-blue hover:bg-brand-blue/10"
                  >
                    Rigenera giorno
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {['all','Europa','Americhe','Asia','Oceania','Africa'].map(c => (
              <button key={c} onClick={()=>setContinentFilter(c)} className={`px-3 py-1.5 rounded-full border ${continentFilter===c?'border-brand-blue text-brand-blue bg-brand-blue/10':'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-700">Immagini alta qualità</label>
            <input type="checkbox" checked={preferHighQualityImages} onChange={(e)=>{ setPreferHighQualityImages(e.target.checked); try{ localStorage.setItem('itinerai:pref:hqimg', e.target.checked?'1':'0'); }catch{ void 0; } }} />
            <button onClick={handleDiscover} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-orange to-brand-orangelight text-white">Scopri casualmente</button>
            <button onClick={handleShare} className="px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Condividi</button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold">Destinazioni Iconiche</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3">
            {filteredIconic.map(item => (
              <div id={`dest-${item.id}`} key={item.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <img src={item.image} loading="lazy" alt={item.name} className="w-full h-40 object-cover" sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" srcSet={preferHighQualityImages?`${item.image} 640w`:`${item.image} 320w`} />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.city}, {item.country} · {item.continent}</p>
                    </div>
                    <button onClick={()=>toggleFavorite(item.id)} aria-label="Salva preferito" className={`px-2 py-1 rounded-full text-sm ${favorites.includes(item.id)?'bg-brand-orange/10 text-brand-orange border border-brand-orange':'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{favorites.includes(item.id)?'★':'☆'}</button>
                  </div>
                  <p className="text-sm text-slate-700">{item.desc}</p>
                  <p className="text-xs text-slate-500">{item.why}</p>
                  <div className="flex gap-2">
                    <a href={item.wiki} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Guida locale</a>
                    <a href={buildGetYourGuideUrl({ ...itineraryContext, city: item.city }) || '#'} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-teal text-white">Prenota attività</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Percorsi Insoliti</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3">
            {filteredGems.map(item => (
              <div id={`dest-${item.id}`} key={item.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="aspect-video w-full">
                  <iframe
                    title={item.name}
                    loading="lazy"
                    className="w-full h-full"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${item.lon-0.05}%2C${item.lat-0.05}%2C${item.lon+0.05}%2C${item.lat+0.05}&layer=mapnik&marker=${item.lat}%2C${item.lon}`}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.city}, {item.country} · {item.continent}</p>
                    </div>
                    <button onClick={()=>toggleFavorite(item.id)} aria-label="Salva preferito" className={`px-2 py-1 rounded-full text-sm ${favorites.includes(item.id)?'bg-brand-orange/10 text-brand-orange border border-brand-orange':'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{favorites.includes(item.id)?'★':'☆'}</button>
                  </div>
                  <p className="text-sm text-slate-700">{item.desc}</p>
                  <p className="text-xs text-slate-500">{item.unique}</p>
                  <div className="flex gap-2">
                    <a href={buildGetYourGuideUrl({ ...itineraryContext, city: item.city }) || '#'} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-teal text-white">Prenota attività</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
