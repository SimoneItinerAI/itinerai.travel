import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function DemoTryIt() {
  const [demo, setDemo] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const examples = [
    '3 giorni a Lisbona',
    'Viaggio gastronomico in Sicilia',
    'Weekend a Venezia',
    'Avventura nei Dolomiti'
  ];

  const handleDemo = (example: string) => {
    setDemo(example);
    setResult(`Creando itinerario per "${example}"...`);
    setTimeout(() => {
      setResult(`✨ Itinerario personalizzato creato!`);
    }, 1500);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-900 to-brand-navy text-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Prova <span className="text-transparent bg-gradient-to-r from-brand-orangelight to-brand-blue bg-clip-text">subito</span>
        </h2>

        <p className="text-center text-slate-300 mb-12 max-w-2xl mx-auto text-lg">
          Scrivi una destinazione e guarda ItinerAI creare il tuo itinerario in tempo reale
        </p>

        {/* Input box */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Esempio: 3 giorni a Roma o Viaggio gastronomico..."
              value={demo}
              onChange={(e) => setDemo(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange"
            />
            <button
              onClick={() => handleDemo(demo || examples[0])}
              className="bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-brand-orange/50 flex items-center gap-2 whitespace-nowrap"
            >
              Genera
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Result display */}
          {result && (
            <div className="bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 border border-brand-orange/30 rounded-2xl p-6 animate-in fade-in duration-300">
              <p className="text-brand-orange mb-4 font-semibold">{result}</p>
              <div className="space-y-3 text-sm text-slate-200">
                <p>📍 <strong>Giorno 1:</strong> Arrivo e check-in</p>
                <p>🎭 <strong>Giorno 2:</strong> Attrazioni principali</p>
                <p>🍽️ <strong>Giorno 3:</strong> Esperienze locali autentiche</p>
              </div>
              <button className="mt-4 text-brand-orange font-semibold hover:opacity-90 transition-colors inline-flex items-center gap-2">
                Continua su app completa
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick examples */}
        <p className="text-center text-slate-400 mb-4 text-sm">O prova uno di questi:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleDemo(example)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-brand-orange/50 rounded-full px-4 py-3 text-sm text-slate-200 transition-all duration-300 text-center"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
