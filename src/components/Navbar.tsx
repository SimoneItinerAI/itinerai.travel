import { useState } from 'react';
import { useI18n } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMobileMenu = () => {
    if (!menuVisible) {
      setMenuVisible(true);
      setTimeout(() => setMobileOpen(true), 0);
    } else {
      setMobileOpen(true);
    }
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setTimeout(() => setMenuVisible(false), 200);
  };

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (id === 'hero-search-container') {
      setTimeout(() => {
        const input = el.querySelector('input[type="text"]') as HTMLInputElement | null;
        input?.focus();
      }, 400);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`relative h-16 mt-4 rounded-full border border-white/15 bg-slate-950 flex items-center justify-between px-5 opacity-100`}>
          <a href="#" className="flex items-center gap-3">
            <img src="/logo.png?v=20251113" alt="ItinerAI" className="h-8 w-8 object-contain shrink-0" />
            <span className="text-white/90 font-semibold">{t('nav_brand')}</span>
          </a>
          <div className="flex-1 flex items-center justify-center">
            <button type="button" onClick={() => { closeMobileMenu(); handleNavClick('hero-search-container'); }} className="bg-gradient-to-r from-brand-orange to-brand-orangelight text-white px-4 sm:px-5 py-2 rounded-full font-medium shadow hover:from-brand-orangelight hover:to-brand-orange transition">
              {t('nav_create')}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-6 text-sm">
              <button type="button" onClick={() => handleNavClick('how')} className="text-white/70 hover:text-brand-orange transition">{t('nav_how')}</button>
              <button type="button" onClick={() => handleNavClick('examples')} className="text-white/70 hover:text-brand-orange transition">{t('nav_examples')}</button>
              <button type="button" onClick={() => handleNavClick('contact')} className="text-white/70 hover:text-brand-orange transition">{t('nav_contact')}</button>
            </nav>
            <button type="button" className="text-white/85 hover:text-brand-orange transition-colors duration-200 drop-shadow hover:drop-shadow-md text-sm">{t('nav_login')}</button>
            <div className="relative">
              <select
                aria-label={t('nav_lang')}
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="text-white/90 bg-slate-900/40 border border-white/20 rounded-full px-3 py-1 text-xs focus:outline-none"
              >
                <option value="it">IT</option>
                <option value="en">EN</option>
                <option value="de">DE</option>
                <option value="zh">中文</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <button
              type="button"
              aria-expanded={menuVisible && mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => {
                if (!menuVisible || !mobileOpen) openMobileMenu(); else closeMobileMenu();
              }}
              className="text-white/90 hover:text-brand-orange transition"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
          {menuVisible && (
            <div id="mobile-menu" className={`absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/20 rounded-2xl p-4 transition-all duration-200 ease-out origin-top will-change-transform ${mobileOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}>
              <div className="flex flex-col gap-3">
                <button type="button" onClick={() => { closeMobileMenu(); handleNavClick('how'); }} className="text-white/80 hover:text-brand-orange text-sm">{t('nav_how')}</button>
                <button type="button" onClick={() => { closeMobileMenu(); handleNavClick('examples'); }} className="text-white/80 hover:text-brand-orange text-sm">{t('nav_examples')}</button>
                <button type="button" onClick={() => { closeMobileMenu(); handleNavClick('contact'); }} className="text-white/80 hover:text-brand-orange text-sm">{t('nav_contact')}</button>
                <button type="button" className="text-white/85 hover:text-brand-orange transition-colors duration-200 drop-shadow hover:drop-shadow-md text-sm">{t('nav_login')}</button>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white/70 text-xs">{t('nav_lang')}</span>
                  <select
                    aria-label={t('nav_lang')}
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="text-white/90 bg-slate-900/60 border border-white/20 rounded-full px-3 py-1 text-xs focus:outline-none"
                  >
                    <option value="it">IT</option>
                    <option value="en">EN</option>
                    <option value="de">DE</option>
                    <option value="zh">中文</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
