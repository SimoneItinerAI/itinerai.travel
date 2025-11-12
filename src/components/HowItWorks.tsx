import { Globe, Zap, ShoppingCart } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Globe,
      title: 'Destinazione',
      description: 'Icona del mappamondo con circuiti luminosi',
      emoji: '🌍'
    },
    {
      icon: Zap,
      title: 'Elaborazione AI',
      description: 'Effetto rete neurale in movimento',
      emoji: '🧠'
    },
    {
      icon: ShoppingCart,
      title: 'Risultato visuale',
      description: 'Mappa 3D o card dell\'itinerario completo',
      emoji: '✅'
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-6">
          Come funziona <span className="text-transparent bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text">in 3 step</span>
        </h2>

        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
          Ogni step rappresentato da un'animazione o un'icona AI dinamica
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 -right-4 w-8 h-0.5 bg-gradient-to-r from-brand-orange to-transparent"></div>
              )}

              <div className="relative bg-gradient-to-br from-slate-50 to-brand-blue/10 rounded-3xl p-8 border border-brand-blue/20 hover:border-brand-orange transition-all duration-300 h-full">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>

                {/* Icon circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-orange/50">
                  <span className="text-4xl">{step.emoji}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-orange to-brand-orangelight hover:from-brand-orangelight hover:to-brand-orange text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-brand-orange/50">
            <span>🔍</span>
            Guarda un itinerario d'esempio
          </button>
        </div>
      </div>
    </section>
  );
}
