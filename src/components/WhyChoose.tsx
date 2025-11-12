export default function WhyChoose() {
  const features = [
    {
      emoji: '🛫',
      title: 'Prenota voli intelligenti',
      description: 'Trova in automatico il mix migliore di prezzo e tempo'
    },
    {
      emoji: '🏨',
      title: 'Hotel su misura',
      description: 'Filtri per atmosfera, quartiere, recensioni e budget'
    },
    {
      emoji: '🍽️',
      title: 'Esperienze locali autentiche',
      description: 'Ristoranti e attività scelte in base ai tuoi gusti'
    },
    {
      emoji: '🧠',
      title: 'Curiosità culturali',
      description: 'Scopri storie, leggende e aneddoti del luogo'
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-6">
          Scopri cosa puoi fare <span className="text-transparent bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text">con ItinerAI</span>
        </h2>

        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto text-lg">
          Dai la concretezza alle possibilità con immagini evocative e contenuti AI-friendly
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 hover:border-brand-orange/30"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative p-8 flex flex-col h-full">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {feature.emoji}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-4 h-0.5 w-0 group-hover:w-8 bg-gradient-to-r from-brand-orange to-transparent transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
