import { Compass, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-slate-950 to-slate-900 text-white py-16 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-blue rounded-xl flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ItinerAI</span>
          </div>
          <p className="text-slate-400 text-lg">
            Il tuo compagno di viaggio intelligente
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-brand-blue">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            AURA è online
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12 text-slate-300">
          <a href="#" className="hover:text-brand-orange transition-colors duration-300">
            Chi siamo
          </a>
          <span className="text-slate-600">•</span>
          <a href="#" className="hover:text-brand-orange transition-colors duration-300">
            Contatti
          </a>
          <span className="text-slate-600">•</span>
          <a href="#" className="hover:text-brand-orange transition-colors duration-300">
            Privacy
          </a>
          <span className="text-slate-600">•</span>
          <a href="#" className="hover:text-brand-orange transition-colors duration-300">
            Termini
          </a>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <a
            href="#"
            className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 hover:border-brand-orange"
          aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 hover:border-brand-orange"
          aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 hover:border-brand-orange"
          aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-800">
          <p>© 2024 ItinerAI. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
