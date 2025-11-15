import { useEffect, useMemo, useRef, useState } from 'react';

export default function HowItWorks() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animations = useMemo(() => ({
    style: `
      @keyframes glowPulse { 0%,100%{opacity:.6} 50%{opacity:1} }
      @keyframes scanMove { 0%{transform:translateX(0)} 100%{transform:translateX(100%)} }
      @keyframes dashFlow { to{stroke-dashoffset:-120} }
      @keyframes nodePulse { 0%,100%{r:4;opacity:.35} 50%{r:6;opacity:.9} }
      @keyframes fadeUp { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)} }
      @keyframes blink { 0%,40%{opacity:1} 50%,100%{opacity:0} }
      @keyframes tiltIn { 0%{opacity:0; transform:rotateX(12deg) translateY(6px) scale(.98)} 100%{opacity:1; transform:rotateX(0) translateY(0) scale(1)} }
      @keyframes rotate360 { to{transform:rotate(360deg)} }
      @keyframes barSlide { 0%{transform:translateX(-60%)} 100%{transform:translateX(120%)} }
    `
  }), []);

  const [stepIndex, setStepIndex] = useState(0);
  const flowTimersRef = useRef<number[]>([]);
  const typingTimersRef = useRef<number[]>([]);
  const [typed1, setTyped1] = useState('');
  const [typed2, setTyped2] = useState('');
  const [typed3, setTyped3] = useState('');
  const [showUI1, setShowUI1] = useState(false);
  const [showUI2, setShowUI2] = useState(false);
  const [showUI3, setShowUI3] = useState(false);
  const full1 = 'Step 1: Inserisci la destinazione che vuoi esplorare.';
  const full2 = 'Step 2: ItinerAI analizza voli, hotel, attività e ristoranti in tempo reale.';
  const full3 = 'Step 3: Ricevi un itinerario personalizzato e completo.';

  useEffect(() => {
    flowTimersRef.current.forEach(t => clearTimeout(t));
    flowTimersRef.current = [];
    if (inView) {
      setStepIndex(1);
      flowTimersRef.current.push(window.setTimeout(() => setStepIndex(2), 2200));
      flowTimersRef.current.push(window.setTimeout(() => setStepIndex(3), 4600));
    } else {
      setStepIndex(0);
      setTyped1(''); setTyped2(''); setTyped3('');
      setShowUI1(false); setShowUI2(false); setShowUI3(false);
      typingTimersRef.current.forEach(t => clearInterval(t));
      typingTimersRef.current = [];
    }
    return () => {
      flowTimersRef.current.forEach(t => clearTimeout(t));
      flowTimersRef.current = [];
    };
  }, [inView]);

  useEffect(() => {
    typingTimersRef.current.forEach(t => clearInterval(t));
    typingTimersRef.current = [];
    if (stepIndex === 1) {
      setTyped1(''); setShowUI1(false);
      let i = 0;
      const id = window.setInterval(() => {
        i += 1;
        setTyped1(full1.slice(0, i));
        if (i >= full1.length) { clearInterval(id); setShowUI1(true); }
      }, 24);
      typingTimersRef.current.push(id);
    }
    if (stepIndex === 2) {
      setTyped2(''); setShowUI2(false);
      let i = 0;
      const id = window.setInterval(() => {
        i += 1;
        setTyped2(full2.slice(0, i));
        if (i >= full2.length) { clearInterval(id); setShowUI2(true); }
      }, 22);
      typingTimersRef.current.push(id);
    }
    if (stepIndex === 3) {
      setTyped3(''); setShowUI3(false);
      let i = 0;
      const id = window.setInterval(() => {
        i += 1;
        setTyped3(full3.slice(0, i));
        if (i >= full3.length) { clearInterval(id); setShowUI3(true); }
      }, 22);
      typingTimersRef.current.push(id);
    }
    return () => {
      typingTimersRef.current.forEach(t => clearInterval(t));
      typingTimersRef.current = [];
    };
  }, [stepIndex]);

  const isCompleted = stepIndex >= 3 && showUI3;

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-3">Come funziona ItinerAI</h2>
        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">Tre semplici passaggi per creare il tuo viaggio ideale.</p>

        <style>{animations.style}</style>

        <div className={`relative flex items-center justify-center transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="absolute w-[520px] h-[520px] rounded-full bg-gradient-to-r from-brand-blue/30 to-brand-orange/30 blur-3xl opacity-40"></div>
          <div className="relative" style={{perspective: '1200px'}}>
            <div className="relative mx-auto transition-transform duration-700 hover:scale-[1.02]" style={{transform: 'rotateX(12deg) rotateY(-10deg) rotateZ(-2deg)'}}>
              <div className="relative w-[320px] sm:w-[360px] md:w-[420px] h-[660px] rounded-[36px] bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <div className="absolute inset-0 rounded-[36px] ring-1 ring-white/5"></div>
                <div className="absolute inset-0 rounded-[36px] bg-gradient-to-t from-white/8 to-transparent opacity-30"></div>
                <div className="absolute inset-[10px] rounded-[28px] overflow-hidden bg-slate-950">
                  <div className="flex flex-col h-full justify-between">
                    <div className={`p-6 space-y-4 transition-all duration-700 ${stepIndex >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={stepIndex >= 1 ? {animation: 'fadeUp .6s ease forwards'} : undefined}>
                      <p className="text-[13px] md:text-sm font-medium text-slate-100 tracking-wide">{typed1}{typed1.length < full1.length ? <span style={{animation: 'blink 1s step-end infinite'}} className="inline-block w-[1ch] h-[1em] align-[-0.2em] bg-slate-300/70"></span> : null}</p>
                      {showUI1 && (
                        <div className="relative mx-auto w-full">
                          <div className="flex items-center gap-3 bg-white/10 rounded-2xl border border-white/20 px-6 py-4">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-orange to-brand-blue opacity-80" style={{animation: 'glowPulse 2.2s ease-in-out infinite'}} />
                            <span className="text-base text-slate-100">Cerca destinazione...</span>
                          </div>
                          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-px overflow-hidden">
                            <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-70" style={{animation: 'scanMove 1.8s linear infinite'}} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`px-6 transition-all duration-700 ${stepIndex >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={stepIndex >= 2 ? {animation: 'fadeUp .6s ease forwards'} : undefined}>
                      <p className="text-[13px] md:text-sm font-medium text-slate-100 tracking-wide mb-3">{typed2}{typed2.length < full2.length ? <span style={{animation: 'blink 1s step-end infinite'}} className="inline-block w-[1ch] h-[1em] align-[-0.2em] bg-slate-300/70"></span> : null}</p>
                      {showUI2 && (
                        <div className="rounded-xl bg-white/6 border border-white/10 p-3 flex items-center gap-4">
                          <div className="relative w-8 h-8">
                            <svg viewBox="0 0 36 36" className="w-8 h-8" style={isCompleted ? undefined : {animation: 'rotate360 1.8s linear infinite'}}>
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#1f2937" strokeWidth="4" opacity="0.25" />
                              <circle cx="18" cy="18" r="16" fill="none" stroke={isCompleted ? '#10b981' : '#3b82f6'} strokeWidth="4" strokeDasharray={isCompleted ? undefined : '80 100'} strokeLinecap="round" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-100">{isCompleted ? 'Itinerario completato' : 'Caricamento itinerario...'}</span>
                              <span className={`text-xs ${isCompleted ? 'text-brand-orange' : 'text-brand-blue'}`}>{isCompleted ? '✓' : '⏳'}</span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                              <div className={`h-full rounded-full ${isCompleted ? 'bg-gradient-to-r from-brand-orange to-brand-orangelight' : 'bg-gradient-to-r from-brand-blue to-brand-orange'}`} style={isCompleted ? {width: '100%'} : {animation: 'barSlide 1.6s linear infinite', width: '40%'}} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  <div className={`p-5 space-y-3 transition-all duration-700 ${stepIndex >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={stepIndex >= 3 ? {animation: 'fadeUp .6s ease forwards'} : undefined}>
                      <p className="text-[13px] md:text-sm font-medium text-slate-100 tracking-wide">{typed3}{typed3.length < full3.length ? <span style={{animation: 'blink 1s step-end infinite'}} className="inline-block w-[1ch] h-[1em] align-[-0.2em] bg-slate-300/70"></span> : null}</p>
                      {showUI3 && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-2.5">
                            <div className="relative flex items-center gap-3 rounded-xl bg-white/6 px-2.5 py-2 border border-white/10 shadow-[0_0_12px_rgba(59,130,246,0.10)]">
                              <div className="relative w-9 h-9 rounded-md overflow-hidden ring-1 ring-white/10 bg-black/20">
                                <img loading="lazy" decoding="async" src="/day1.png" alt="giorno1" className="w-full h-full object-cover brightness-[.95] contrast-[1.05] saturate-[1.1]" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 to-brand-orange/25 mix-blend-multiply opacity-80"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-slate-100">Giorno 1</span>
                                  <span className="text-xs">✈️</span>
                                </div>
                                <ul className="mt-0.5 text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                                  <li>Arrivo e check-in</li>
                                  <li>Passeggiata nel centro</li>
                                </ul>
                              </div>
                            </div>
                            <div className="relative flex items-center gap-3 rounded-xl bg-white/6 px-2.5 py-2 border border-white/10 shadow-[0_0_12px_rgba(59,130,246,0.10)]">
                              <div className="relative w-9 h-9 rounded-md overflow-hidden ring-1 ring-white/10 bg-black/20">
                                <img loading="lazy" decoding="async" src="/day2.png" alt="giorno2" className="w-full h-full object-cover brightness-[.95] contrast-[1.05] saturate-[1.1]" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 to-brand-orange/25 mix-blend-multiply opacity-80"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-slate-100">Giorno 2</span>
                                  <span className="text-xs">⭐</span>
                                </div>
                                <ul className="mt-0.5 text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                                  <li>Tour culturale</li>
                                  <li>Museo principale</li>
                                </ul>
                              </div>
                            </div>
                            <div className="relative flex items-center gap-3 rounded-xl bg-white/6 px-2.5 py-2 border border-white/10 shadow-[0_0_12px_rgba(249,115,22,0.10)]">
                              <div className="relative w-9 h-9 rounded-md overflow-hidden ring-1 ring-white/10 bg-black/20">
                                <img loading="lazy" decoding="async" src="/day3.png" alt="giorno3" className="w-full h-full object-cover brightness-[.95] contrast-[1.05] saturate-[1.1]" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 to-brand-orange/25 mix-blend-multiply opacity-80"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-slate-100">Giorno 3</span>
                                  <span className="text-xs">🍽️</span>
                                </div>
                                <ul className="mt-0.5 text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                                  <li>Escursione breve</li>
                                  <li>Cena tipica</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
