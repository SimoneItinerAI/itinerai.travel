import { useState } from 'react';
import type { Itinerary, ItineraryDay } from '../../types/trip';
import ItineraryDayCard from '../ItineraryDayCard';
import { regenerateDayCity, saveLastItinerary } from '../../utils/itinerary';

interface ItineraryTimelineProps {
  itinerary: Itinerary;
  onUpdate: (updated: Itinerary) => void;
}

export default function ItineraryTimeline({ itinerary, onUpdate }: ItineraryTimelineProps) {
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  const handleDayChange = (dayIndex: number, updatedDay: ItineraryDay) => {
    const updated: Itinerary = {
      ...itinerary,
      days: itinerary.days.map((d) => (d.dayIndex === dayIndex ? updatedDay : d)),
    };
    saveLastItinerary(updated);
    onUpdate(updated);
  };

  const handleDeleteItem = (dayIndex: number, itemIndex: number) => {
    const dayToUpdate = itinerary.days.find((d) => d.dayIndex === dayIndex);
    if (!dayToUpdate) return;

    const updatedItems = dayToUpdate.items.filter((_, idx) => idx !== itemIndex);
    const updatedDay = { ...dayToUpdate, items: updatedItems };
    handleDayChange(dayIndex, updatedDay);
  };

  const handleRegenerateDay = async (dayIndex: number) => {
    setRegeneratingDay(dayIndex);
    try {
      const updated = await regenerateDayCity(itinerary, dayIndex);
      saveLastItinerary(updated);
      onUpdate(updated);
    } catch (error) {
      console.error('Failed to regenerate day', error);
    } finally {
      setRegeneratingDay(null);
    }
  };

  const poiById = Object.fromEntries((itinerary.poisUsed ?? []).map((p) => [p.id, p]));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Itinerario giorno per giorno</h2>

      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <div key={day.dayIndex} className="space-y-3">
            <ItineraryDayCard
              day={day}
              poiById={poiById}
              loading={regeneratingDay === day.dayIndex}
              onChange={(updated) => handleDayChange(day.dayIndex, updated)}
              onDeleteItem={(itemIdx) => handleDeleteItem(day.dayIndex, itemIdx)}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRegenerateDay(day.dayIndex)}
                disabled={regeneratingDay === day.dayIndex}
                className="px-4 py-2 rounded-xl border border-brand-blue text-brand-blue hover:bg-brand-blue/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {regeneratingDay === day.dayIndex ? 'Rigenerazione...' : 'Rigenera questo giorno'}
              </button>
              <p className="text-xs text-slate-500">
                Crea nuove attività basate sui luoghi della destinazione
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Pronto per prenotare?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Ora che hai il tuo itinerario personalizzato, scopri le proposte complete di voli, alloggi e attività.
          </p>
          <button
            onClick={() => {
              const event = new CustomEvent('navigate-to-proposals');
              window.dispatchEvent(event);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>Vedi le proposte di viaggio</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
