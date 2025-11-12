import { useEffect, useMemo, useState } from 'react';
import { PenLine } from 'lucide-react';

export default function WhatIsItinerAI() {
  const scheduleLines = useMemo(() => [
    'Roma – Itinerario',
    'Giorno 1: Arrivo e Centro Storico',
    '• Check-in Hotel Artemide (4★)',
    '• Passeggiata Colosseo e Fori Romani',
    'Giorno 2: Musei e Vaticano',
    '• Galleria Borghese – mattina',
    '• Musei Vaticani e Basilica di San Pietro',
    'Giorno 3: Trastevere e sapori locali',
    '• Pranzo da Armando al Pantheon',
    '• Tramonto al Gianicolo'
  ], []);

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState<string[]>(Array(scheduleLines.length).fill(''));

  useEffect(() => {
    const interval = setInterval(() => {
      const current = scheduleLines[lineIndex];
      if (!current) {
        clearInterval(interval);
        return;
      }
      const nextChar = charIndex + 1;
      const nextText = current.slice(0, nextChar);
      setDisplayed(prev => {
        const copy = [...prev];
        copy[lineIndex] = nextText;
        return copy;
      });
      setCharIndex(nextChar);
      if (nextChar >= current.length) {
        setLineIndex(i => i + 1);
        setCharIndex(0);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [charIndex, lineIndex, scheduleLines]);
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-6 shadow-2xl border border-slate-300 h-96 flex flex-col overflow-hidden -rotate-2">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(#e2e8f0 0 1px, transparent 1px 28px)' }}></div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange">
                  <PenLine className="w-4 h-4" />
                </div>
                <span className="text-slate-700 text-sm">Roma – Appunti di viaggio</span>
              </div>
              <div className="relative z-10 flex-1 overflow-y-auto">
                {displayed.map((line, idx) => (
                  <p
                    key={idx}
                    className="text-brand-orange text-sm tracking-wide"
                    style={{ fontFamily: 'ui-script, "Segoe Script", "Comic Sans MS", cursive' }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Text content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
              Il tuo viaggio, <span className="text-transparent bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text">creato in tempo reale</span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Dalla scelta del volo alla prenotazione dell'hotel, fino ai ristoranti locali e ai luoghi imperdibili — ItinerAI analizza milioni di dati e costruisce per te l'esperienza perfetta.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              Ogni itinerario è unico, come il tuo modo di viaggiare.
            </p>

            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
                <span className="text-slate-700 font-medium">IA generativa</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
                <span className="text-slate-700 font-medium">Personalizzato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
