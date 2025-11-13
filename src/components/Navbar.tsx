export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-16 mt-4 rounded-full border border-white/15 bg-slate-950/60 backdrop-blur flex items-center justify-between px-5">
          <a href="#" className="flex items-center gap-3">
            <img src="/logo.png?v=20251113" alt="ItinerAI" className="h-8 w-8 object-contain shrink-0" />
            <span className="text-white/90 font-semibold">ItinerAI</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#how" className="text-white/70 hover:text-brand.orange transition">Come funziona</a>
            <a href="#examples" className="text-white/70 hover:text-brand.orange transition">Esempi</a>
            <a href="#contact" className="text-white/70 hover:text-brand.orange transition">Contatti</a>
          </nav>
          <a href="#try" className="bg-gradient-to-r from-brand.orange to-brand.orangelight text-white px-5 py-2 rounded-full font-medium shadow hover:from-brand.orangelight hover:to-brand.orange transition">Crea Itinerario</a>
        </div>
      </div>
    </header>
  );
}
