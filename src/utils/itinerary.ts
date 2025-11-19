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