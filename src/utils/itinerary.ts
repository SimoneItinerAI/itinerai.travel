export type ItineraryParams = { destination: string; days: number; people: number };

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
    a.people === b.people
  );
}

export function generateMockItinerary(params: ItineraryParams): ItineraryData {
  const { destination, days, people } = params;
  const summaryTitle = `${destination} per ${people} ${people === 1 ? 'persona' : 'persone'} ${days} ${days === 1 ? 'giorno' : 'giorni'}`;
  const summarySubtitle = 'Weekend tra quartieri caratteristici, luoghi iconici e sapori locali.';
  const previewDays = Math.min(days, 3);
  const daysPreview: ItineraryDay[] = Array.from({ length: previewDays }).map((_, idx) => {
    const d = idx + 1;
    if (d === 1) {
      return { day: d, title: `Giorno ${d} — Arrivo e centro storico`, shortDescription: 'Prime tappe tra monumenti simbolo e vie principali.', bullets: ['Arrivo e sistemazione', 'Passeggiata in centro', 'Cena tipica'] };
    }
    if (d === 2) {
      return { day: d, title: `Giorno ${d} — Musei e cultura`, shortDescription: 'Visita ai principali musei e punti panoramici.', bullets: ['Museo principale', 'Passeggiata panoramica', 'Aperitivo o cena in zona vivace'] };
    }
    return { day: d, title: `Giorno ${d} — Quartieri caratteristici`, shortDescription: 'Vita di quartiere, mercati e ultimi scorci della città.', bullets: ['Quartiere caratteristico', 'Mercato o via dello shopping', 'Ultima cena in città'] };
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