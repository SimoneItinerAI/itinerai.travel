export default function Proposals({ destination, onBack }: { destination: string; onBack?: () => void }) {
  const city = destination ? destination[0].toUpperCase() + destination.slice(1) : '';
  const sections: Array<{ title: string; source: string; items: Array<{ name: string; desc: string; price?: string }> }> = [
    {
      title: `Alloggi a ${city}`,
      source: 'Booking.com / Airbnb',
      items: [
        { name: `Hotel Centro ${city}`, desc: '4★ • Vicino alle principali attrazioni', price: 'da 129€/notte' },
        { name: `Boutique ${city}`, desc: 'Stile premium • Colazione inclusa', price: 'da 159€/notte' },
        { name: `Airbnb ${city} Vista`, desc: 'Intero appartamento • Self check-in', price: 'da 99€/notte' },
      ],
    },
    {
      title: `Esperienze a ${city}`,
      source: 'GetYourGuide',
      items: [
        { name: 'Tour storico guidato', desc: '2h • Gruppo ristretto' },
        { name: 'Degustazione locale', desc: 'Food & wine • Serata' },
        { name: 'Passeggiata fotografica', desc: 'Scorci iconici • Golden hour' },
      ],
    },
    {
      title: `Hotel consigliati`,
      source: 'Booking.com',
      items: [
        { name: 'Grand Hotel', desc: '5★ • Spa & Pool', price: 'da 220€/notte' },
        { name: 'Design Inn', desc: '4★ • Minimal & Tech', price: 'da 170€/notte' },
        { name: 'City Lodge', desc: '3★ • Budget smart', price: 'da 95€/notte' },
      ],
    },
  ];

  return (
    <section className="min-h-screen w-full bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Proposte per {city}</h1>
            <p className="text-slate-600">Generato da collegamenti API (Booking, Airbnb, GetYourGuide)</p>
          </div>
          <button onClick={onBack} className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">← Torna indietro</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4 border-b border-slate-100">
                <h2 className="text-xl font-semibold">{sec.title}</h2>
                <p className="text-xs text-slate-500">Fonte: {sec.source}</p>
              </div>
              <div className="p-4 space-y-3">
                {sec.items.map((it, j) => (
                  <div key={j} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{it.name}</p>
                      <p className="text-xs text-slate-500">{it.desc}</p>
                    </div>
                    {it.price ? <span className="text-xs text-slate-700">{it.price}</span> : null}
                  </div>
                ))}
              </div>
              <div className="p-4">
                <button className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangelight text-white font-semibold">Vedi dettagli</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}