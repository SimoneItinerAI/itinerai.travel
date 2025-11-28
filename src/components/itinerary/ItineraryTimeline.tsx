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
    </div>
  );
}
