import { MapPin, Clock } from 'lucide-react';

export default function Examples() {
  const examples = [
    {
      title: '4 giorni a Barcellona',
      description: 'Arte, tapas e tramonti sul mare',
      gradient: 'from-brand-orange to-brand-blue',
      duration: '4 giorni'
    },
    {
      title: 'Tour della Costiera Amalfitana',
      description: 'Paesaggi, limoni e viste mozzafiato',
      gradient: 'from-brand-blue to-brand-teal',
      duration: '5 giorni'
    },
    {
      title: 'Weekend a Tokyo',
      description: 'Tradizione e futuro in equilibrio perfetto',
      gradient: 'from-brand-orange to-brand-teal',
      duration: '3 giorni'
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Ispirati e <span className="text-brand-orange">parti</span>
        </h2>

        <p className="text-xl text-center text-slate-300 mb-16">
          Scopri cosa può creare ItinerAI in pochi secondi
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${example.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>

              <div className="relative p-8">
                <div className="flex items-center gap-2 text-sm text-brand-blue mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{example.duration}</span>
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  {example.title}
                </h3>

                <p className="text-slate-300 mb-6">
                  {example.description}
                </p>

                <div className="flex items-center gap-2 text-brand-orange font-semibold group-hover:gap-4 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                  <span>Esplora itinerario</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
