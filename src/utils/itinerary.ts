export type ItineraryParams = { 
  destination: string; 
  days: number; 
  people: number;
  startDate?: string;
  endDate?: string;
};

export type ItineraryDay = { day: number; title: string; shortDescription: string; bullets: string[] };

export type ItineraryData = {
  params: ItineraryParams;
  summaryTitle: string;
  summarySubtitle: string;
  daysPreview: ItineraryDay[];
};

const STORAGE_KEY = 'itinerai:lastItinerary';

export function saveItineraryToStorage(data: ItineraryData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Unable to save itinerary', e);
  }
}

export function loadItineraryFromStorage(): ItineraryData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ItineraryData;
  } catch (e) {
    console.warn('Unable to load itinerary', e);
    return null;
  }
}

export function isSameParams(a: ItineraryParams, b: ItineraryParams): boolean {
  return (
    a.destination.toLowerCase().trim() === b.destination.toLowerCase().trim() &&
    a.days === b.days &&
    a.people === b.people &&
    a.startDate === b.startDate &&
    a.endDate === b.endDate
  );
}

export function generateMockItinerary(params: ItineraryParams): ItineraryData {
  const { destination, days, people, startDate, endDate } = params;
  const dateRange = startDate && endDate ? ` dal ${new Date(startDate).toLocaleDateString('it-IT')} al ${new Date(endDate).toLocaleDateString('it-IT')}` : '';
  const summaryTitle = `${destination} per ${people} ${people === 1 ? 'persona' : 'persone'} ${days} ${days === 1 ? 'giorno' : 'giorni'}${dateRange}`;
  const summarySubtitle = 'Weekend tra quartieri caratteristici, luoghi iconici e sapori locali.';
  const previewDays = Math.min(days, 3);
  const daysPreview: ItineraryDay[] = Array.from({ length: previewDays }).map((_, idx) => {
    const d = idx + 1;
    const actualDate = startDate ? new Date(new Date(startDate).getTime() + (d - 1) * 24 * 60 * 60 * 1000) : null;
    const dateStr = actualDate ? actualDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : `Giorno ${d}`;
    
    if (d === 1) {
      return { day: d, title: `${dateStr} — Arrivo e centro storico`, shortDescription: 'Prime tappe tra monumenti simbolo e vie principali.', bullets: ['Arrivo e sistemazione', 'Passeggiata in centro', 'Cena tipica'] };
    }
    if (d === 2) {
      return { day: d, title: `${dateStr} — Musei e cultura`, shortDescription: 'Visita ai principali musei e punti panoramici.', bullets: ['Museo principale', 'Passeggiata panoramica', 'Aperitivo o cena in zona vivace'] };
    }
    return { day: d, title: `${dateStr} — Quartieri caratteristici`, shortDescription: 'Vita di quartiere, mercati e ultimi scorci della città.', bullets: ['Quartiere caratteristico', 'Mercato o via dello shopping', 'Ultima cena in città'] };
  });
  return { params, summaryTitle, summarySubtitle, daysPreview };
}

export function startItineraryGeneration(params: ItineraryParams, onNavigate: () => void) {
  const existing = loadItineraryFromStorage();
  if (existing && isSameParams(existing.params, params)) {
    onNavigate();
    return;
  }
  const data = generateMockItinerary(params);
  saveItineraryToStorage(data);
  onNavigate();
}

export function forceGenerateItinerary(params: ItineraryParams) {
  const data = generateMockItinerary(params);
  saveItineraryToStorage(data);
}

// -------------------- V2 API (TripParams/Itinerary full) --------------------
import type { TripParams, Itinerary as FullItinerary, ItineraryDay as FullItineraryDay, CityPoi, ItineraryDayItem } from '../types/trip';
import { geocodeCity as geocodeCityOSM } from '../services/nominatim';
import { fetchAttractions } from '../services/overpass';

const STORAGE_TRIP_PARAMS = 'itinerai:last-tripparams';
const STORAGE_FULL_ITINERARY = 'itinerai:last-itinerary';

export function saveTripParams(params: TripParams) {
  try {
    localStorage.setItem(STORAGE_TRIP_PARAMS, JSON.stringify(params));
  } catch (e) {
    console.warn('Unable to save trip params', e);
  }
}

export function loadTripParams(): TripParams | null {
  try {
    const raw = localStorage.getItem(STORAGE_TRIP_PARAMS);
    if (!raw) return null;
    return JSON.parse(raw) as TripParams;
  } catch (e) {
    console.warn('Unable to load trip params', e);
    return null;
  }
}

export function createItineraryFromParams(params: TripParams): FullItinerary {
  const days: FullItineraryDay[] = Array.from({ length: Math.max(1, params.days) }).map((_, i) => {
    const idx = i + 1;
    const titleBase = idx === 1 ? 'Centro storico' : idx === 2 ? 'Musei e cultura' : 'Quartieri caratteristici';
    const dateStr = params.startDate ? new Date(new Date(params.startDate).getTime() + i * 86400000).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : `Giorno ${idx}`;
    const items: FullItineraryDay['items'] = [
      { timeOfDay: 'morning', description: idx === 1 ? 'Arrivo e sistemazione' : 'Colazione in zona vivace' },
      { timeOfDay: 'afternoon', description: titleBase },
      { timeOfDay: 'evening', description: 'Cena tipica' },
    ];
    return { dayIndex: idx, title: `${dateStr} — ${titleBase}`, items };
  });
  const summaryTitle = `${params.destination} per ${params.people} ${params.people === 1 ? 'persona' : 'persone'} ${params.days} ${params.days === 1 ? 'giorno' : 'giorni'}`;
  return { params, summaryTitle, days };
}

export function saveLastItinerary(itinerary: FullItinerary) {
  try {
    localStorage.setItem(STORAGE_FULL_ITINERARY, JSON.stringify(itinerary));
  } catch (e) {
    console.warn('Unable to save full itinerary', e);
  }
  try {
    const preview = generateMockItinerary({ destination: itinerary.params.destination, days: itinerary.params.days, people: itinerary.params.people, startDate: itinerary.params.startDate, endDate: itinerary.params.endDate });
    saveItineraryToStorage(preview);
  } catch (e) {
    console.warn('Unable to save preview itinerary', e);
  }
}

export function loadLastItinerary(): FullItinerary | null {
  try {
    const raw = localStorage.getItem(STORAGE_FULL_ITINERARY);
    if (!raw) return null;
    return JSON.parse(raw) as FullItinerary;
  } catch (e) {
    console.warn('Unable to load full itinerary', e);
    return null;
  }
}

export function regenerateDay(itinerary: FullItinerary, dayIndex: number): FullItinerary {
  const idx = dayIndex - 1;
  if (idx < 0 || idx >= itinerary.days.length) return itinerary;
  const params = itinerary.params;
  const newDay = createItineraryFromParams({ ...params, days: Math.max(params.days, dayIndex) }).days[idx];
  const next: FullItinerary = { ...itinerary, days: itinerary.days.map((d, i) => (i === idx ? newDay : d)) };
  saveLastItinerary(next);
  return next;
}

export async function regenerateDayCity(itinerary: FullItinerary, dayIndex: number): Promise<FullItinerary> {
  const idx = dayIndex - 1;
  if (idx < 0 || idx >= itinerary.days.length) return itinerary;
  const params = itinerary.params;
  const geo = await geocodeCityOSM(params.destination);
  if (!geo) return itinerary;
  const radius = Math.max(8000, Math.min(22000, 10000 + (params.days || 1) * 1500));
  const attractions = await fetchAttractions(geo.lat, geo.lon, radius, Math.max(20, params.days * 6));
  const currentDay = itinerary.days[idx];
  const usedIdsInDay = new Set((currentDay.items || []).map(it => it.poiId).filter(Boolean) as string[]);
  const usedIdsAll = new Set((itinerary.poisUsed || []).map(p => p.id));
  const toPoi = (a: { id?: string | number; name?: string; lat?: number; lon?: number }): CityPoi => ({ id: String(a.id ?? `${a.lat}-${a.lon}`), name: a.name ?? 'Punto di interesse', lat: (a.lat as number) ?? geo.lat, lon: (a.lon as number) ?? geo.lon });
  const pool: CityPoi[] = attractions.map(toPoi);
  const fresh = pool.filter(p => !usedIdsInDay.has(p.id) && !usedIdsAll.has(p.id));
  const fallback = pool.filter(p => !usedIdsInDay.has(p.id));
  const pickFrom = (fresh.length >= 3 ? fresh : fallback);
  // Shuffle to vary results
  for (let i = pickFrom.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pickFrom[i], pickFrom[j]] = [pickFrom[j], pickFrom[i]]; }
  const slice = pickFrom.slice(0, Math.max(3, Math.min(5, pickFrom.length)));
  const title = makeDayTitle(dayIndex, slice, params.destination);
  const items: ItineraryDayItem[] = slice.map((poi, index) => ({ timeOfDay: index === 0 ? 'morning' : index === 1 ? 'afternoon' : 'evening', description: `Visita a ${poi.name}${poi.category ? ` (${poi.category})` : ''}`, poiId: poi.id }));
  const firstPoiReg = slice[0];
  const secondPoiReg = slice[1] ?? slice[slice.length - 1];
  if (firstPoiReg) { items.push({ description: `Attività consigliata: tour guidato nei dintorni di ${firstPoiReg.name}` }); }
  if (secondPoiReg && (!firstPoiReg || secondPoiReg.id !== firstPoiReg.id)) {
    items.push({ description: `Esperienza consigliata: visita guidata a ${secondPoiReg.name}` });
  } else if (firstPoiReg) {
    items.push({ description: `Esperienza consigliata: visita guidata nel centro storico di ${params.destination}` });
  }
  const updatedDay: FullItineraryDay = { dayIndex, title, items };
  const updatedPoisUsed = Array.from(new Map([...(itinerary.poisUsed || []), ...slice].map(p => [p.id, p])).values());
  const next: FullItinerary = { ...itinerary, days: itinerary.days.map((d, i) => (i === idx ? updatedDay : d)), poisUsed: updatedPoisUsed };
  saveLastItinerary(next);
  return next;
}

export function clearLastItinerary() {
  try {
    localStorage.removeItem(STORAGE_FULL_ITINERARY);
  } catch (e) {
    console.warn('Unable to clear full itinerary', e);
  }
}

export function sameParams(a: TripParams, b: TripParams): boolean {
  return (
    a.destination.trim().toLowerCase() === b.destination.trim().toLowerCase() &&
    a.startDate === b.startDate &&
    a.endDate === b.endDate &&
    a.people === b.people
  );
}

export async function buildItineraryForCity(params: TripParams): Promise<FullItinerary> {
  const geo = await geocodeCityOSM(params.destination);
  if (!geo) throw new Error('Geocoding failed');
  const radius2 = Math.max(8000, Math.min(22000, 10000 + (params.days || 1) * 1500));
  let attractions = await fetchAttractions(geo.lat, geo.lon, radius2, Math.max(16, params.days * 5));
  if (!attractions || attractions.length === 0) {
    attractions = await fetchAttractions(geo.lat, geo.lon, Math.min(40000, radius2 * 2), Math.max(24, params.days * 6));
  }
  const pois: CityPoi[] = attractions.map((a) => ({
    id: String(a.id ?? `${a.lat}-${a.lon}`),
    name: a.name ?? 'Punto di interesse',
    lat: a.lat ?? geo.lat,
    lon: a.lon ?? geo.lon,
  }));
  const sorted = [...pois].sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0));
  const days = distributePoisAcrossDays(sorted, params);
  const summaryTitle = `${params.destination} per ${params.people} ${params.people === 1 ? 'persona' : 'persone'} ${params.days} ${params.days === 1 ? 'giorno' : 'giorni'}`;
  const summarySubtitle = `Dal ${params.startDate} al ${params.endDate}`;
  return { params, summaryTitle, summarySubtitle, days, poisUsed: sorted };
}

function distributePoisAcrossDays(pois: CityPoi[], params: TripParams): FullItineraryDay[] {
  const daysCount = Math.max(1, params.days || 1);
  if (pois.length === 0) {
    return Array.from({ length: daysCount }).map((_, idx) => ({
      dayIndex: idx + 1,
      title: `Giorno ${idx + 1} — Esplora ${params.destination}`,
      items: [{ description: `Giornata libera per esplorare ${params.destination}` }],
    }));
  }

  const shuffled = [...pois];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const poisPerDay = Math.max(4, Math.ceil(shuffled.length / daysCount));
  const days: FullItineraryDay[] = [];

  const experienceTypes = [
    'tour gastronomico locale',
    'passeggiata fotografica',
    'lezione di cucina tradizionale',
    'degustazione vini e prodotti locali',
    'tour in bicicletta',
    'visita ai mercati storici',
    'aperitivo con vista panoramica',
    'concerto o spettacolo locale',
  ];

  for (let day = 0; day < daysCount; day++) {
    const start = day * poisPerDay;
    const slice = shuffled.slice(start, start + poisPerDay);
    const title = makeDayTitle(day + 1, slice, params.destination);
    const items: ItineraryDayItem[] = [];

    if (slice.length > 0) {
      const iconicPoi = slice[0];
      items.push({
        time: '09:00',
        timeOfDay: 'morning',
        description: `Luogo iconico: ${iconicPoi.name}${iconicPoi.category ? ` - ${iconicPoi.category}` : ''}`,
        poiId: iconicPoi.id,
        type: 'culture',
      });
    }

    if (slice.length > 1) {
      const culturalPoi = slice[1];
      items.push({
        time: '11:30',
        timeOfDay: 'afternoon',
        description: `Esperienza culturale: ${culturalPoi.name}`,
        poiId: culturalPoi.id,
        type: 'culture',
      });
    }

    if (slice.length > 2) {
      const hiddenPoi = slice[slice.length - 1];
      items.push({
        time: '14:30',
        timeOfDay: 'afternoon',
        description: `Gemma nascosta: ${hiddenPoi.name} - Un luogo autentico lontano dalle folle turistiche`,
        poiId: hiddenPoi.id,
        type: 'nature',
      });
    }

    const experience = experienceTypes[day % experienceTypes.length];
    items.push({
      time: '18:00',
      timeOfDay: 'evening',
      description: `Esperienza locale: ${experience}`,
      type: experience.includes('gastronomico') || experience.includes('cucina') || experience.includes('vini') || experience.includes('mercati') ? 'food' : 'entertainment',
    });

    if (slice.length > 3) {
      const extraPoi = slice[2];
      items.push({
        time: '16:00',
        description: `Tappa extra: ${extraPoi.name}`,
        poiId: extraPoi.id,
        type: 'other',
      });
    }

    days.push({ dayIndex: day + 1, title, items });
  }
  return days;
}

function makeDayTitle(dayIndex: number, pois: CityPoi[], destination: string): string {
  if (!pois.length) return `Giorno ${dayIndex} — Esplora ${destination}`;
  const dayThemes = [
    'Luoghi iconici e storia',
    'Cultura e tradizioni locali',
    'Sapori e quartieri autentici',
    'Natura e panorami',
    'Arte e architettura',
    'Mercati e vita locale',
    'Relax e scoperte nascoste'
  ];
  const theme = dayThemes[(dayIndex - 1) % dayThemes.length];
  return `Giorno ${dayIndex} — ${theme}`;
}
