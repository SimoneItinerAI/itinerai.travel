import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Lang = 'it' | 'en' | 'de' | 'zh' | 'ar'

type Dict = Record<string, Record<Lang, string>>

const DICT: Dict = {
  nav_brand: { it: 'ItinerAI', en: 'ItinerAI', de: 'ItinerAI', zh: 'ItinerAI', ar: 'إيتينيراي' },
  nav_how: { it: 'Come funziona', en: 'How it works', de: 'So funktioniert es', zh: '如何运作', ar: 'كيف يعمل' },
  nav_examples: { it: 'Esempi', en: 'Examples', de: 'Beispiele', zh: '示例', ar: 'أمثلة' },
  nav_contact: { it: 'Contatti', en: 'Contacts', de: 'Kontakt', zh: '联系我们', ar: 'اتصل بنا' },
  nav_create: { it: 'Crea Itinerario', en: 'Create Itinerary', de: 'Reiseplan erstellen', zh: '创建行程', ar: 'أنشئ رحلة' },
  nav_login: { it: 'Accedi / Registrati', en: 'Sign In / Register', de: 'Anmelden / Registrieren', zh: '登录 / 注册', ar: 'تسجيل الدخول / التسجيل' },
  nav_lang: { it: 'Lingua', en: 'Language', de: 'Sprache', zh: '语言', ar: 'اللغة' },
}

const STORAGE_KEY = 'itinerai:lang'

const I18nCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof DICT) => string }>({ lang: 'it', setLang: () => {}, t: (k) => DICT[k]?.it || String(k) })

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return (raw as Lang) || 'it'
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { void 0 }
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const t = useMemo(() => (key: keyof typeof DICT) => DICT[key]?.[lang] || DICT[key]?.it || String(key), [lang])

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  return useContext(I18nCtx)
}
