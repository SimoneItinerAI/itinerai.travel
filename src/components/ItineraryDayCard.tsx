import { useState } from 'react';
import type { ItineraryDay, CityPoi } from '../types/trip';

export default function ItineraryDayCard({ day, poiById, loading, onChange, onDeleteItem }: { day: ItineraryDay; poiById?: Record<string, CityPoi>; loading?: boolean; onChange: (next: ItineraryDay) => void; onDeleteItem: (itemIndex: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(day.title);
  const [items, setItems] = useState(day.items);

  const save = () => {
    setEditing(false);
    onChange({ ...day, title, items });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 relative">
      <div className="flex items-center justify-between">
        {editing ? (
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 text-lg md:text-xl font-semibold bg-transparent focus:outline-none" />
        ) : (
          <h3 className="text-lg md:text-xl font-semibold">{day.title}</h3>
        )}
        <div className="flex items-center gap-2">
          {editing ? (
            <button onClick={save} className="px-3 py-1.5 rounded-full border border-brand-blue text-brand-blue hover:bg-brand-blue/10">Salva</button>
          ) : (
            <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Modifica</button>
          )}
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {editing ? (
              <input value={it.description} onChange={(e) => setItems(items.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)))} className="flex-1 bg-transparent border-b border-slate-200 focus:outline-none" />
            ) : (
              <div className="flex-1">
                <p className="text-sm text-slate-700">{it.description}</p>
                {it.poiId && poiById?.[it.poiId] && (
                  <p className="text-[11px] text-slate-500">{poiById[it.poiId].category ?? ''}{poiById[it.poiId].shortDescription ? (poiById[it.poiId].category ? ' · ' : '') + poiById[it.poiId].shortDescription : ''}</p>
                )}
              </div>
            )}
            <button onClick={() => onDeleteItem(idx)} className="text-xs px-2 py-1 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50">🗑️</button>
          </li>
        ))}
      </ul>
      {loading && (
        <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ItinerAI" className="h-8 w-8 object-contain shrink-0 rounded-xl shadow-lg shadow-brand-orange/40" />
            <div className="w-48 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-blue animate-[loadingBar_1.4s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
