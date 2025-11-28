import { useState } from 'react';
import type { ItineraryDay, CityPoi } from '../types/trip';

const activityIcons: Record<string, string> = {
  culture: '🏛️',
  food: '🍴',
  nature: '🌳',
  shopping: '🛍️',
  entertainment: '🎭',
  transport: '🚗',
  other: '📍',
};

interface ItineraryDayCardProps {
  day: ItineraryDay;
  poiById?: Record<string, CityPoi>;
  loading?: boolean;
  onChange: (next: ItineraryDay) => void;
  onDeleteItem: (itemIndex: number) => void;
  defaultExpanded?: boolean;
}

export default function ItineraryDayCard({
  day,
  poiById,
  loading,
  onChange,
  onDeleteItem,
  defaultExpanded = false,
}: ItineraryDayCardProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [title, setTitle] = useState(day.title);
  const [items, setItems] = useState(day.items);

  const save = () => {
    setEditing(false);
    onChange({ ...day, title, items });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-brand-orangelight text-white font-bold text-lg shrink-0">
            {day.dayIndex}
          </div>
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-lg md:text-xl font-semibold bg-transparent focus:outline-none border-b border-brand-orange"
            />
          ) : (
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Giorno {day.dayIndex}</div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">{day.title}</h3>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!editing && (
            <span className="text-xs text-slate-500 hidden sm:block">
              {items.length} {items.length === 1 ? 'attività' : 'attività'}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-5">
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-end gap-2 mb-4">
              {editing ? (
                <button
                  onClick={save}
                  className="px-4 py-2 rounded-xl bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors text-sm font-medium"
                >
                  Salva modifiche
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  Modifica giorno
                </button>
              )}
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => {
                const icon = activityIcons[item.type || 'other'];
                const poi = item.poiId && poiById?.[item.poiId];

                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xl shrink-0">
                        {icon}
                      </div>
                      {idx < items.length - 1 && (
                        <div className="w-0.5 h-full bg-gradient-to-b from-slate-200 to-transparent mt-2 min-h-[20px]" />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          {item.time && (
                            <div className="text-xs font-semibold text-brand-orange mb-1">
                              {item.time}
                            </div>
                          )}
                          {editing ? (
                            <input
                              value={item.description}
                              onChange={(e) =>
                                setItems(
                                  items.map((x, i) =>
                                    i === idx ? { ...x, description: e.target.value } : x
                                  )
                                )
                              }
                              className="w-full bg-transparent border-b border-slate-200 focus:border-brand-orange focus:outline-none text-sm text-slate-700 pb-1"
                            />
                          ) : (
                            <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          {poi && (
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              {poi.category && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  {poi.category}
                                </span>
                              )}
                              {poi.shortDescription && (
                                <span className="text-xs text-slate-500">
                                  {poi.shortDescription}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => onDeleteItem(idx)}
                          className="text-xs px-3 py-1.5 rounded-full border border-slate-300 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors shrink-0"
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/logo.png"
              alt="ItinerAI"
              className="h-10 w-10 object-contain shrink-0 rounded-xl shadow-lg shadow-brand-orange/40"
            />
            <div className="w-48 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-blue animate-[loadingBar_1.4s_ease-in-out_infinite]" />
            </div>
            <p className="text-xs text-slate-600">Rigenerazione in corso...</p>
          </div>
        </div>
      )}
    </div>
  );
}
