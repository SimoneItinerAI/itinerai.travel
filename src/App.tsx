import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Proposals from './components/Proposals';
import Navbar from './components/Navbar';
import WhatIsItinerAI from './components/WhatIsItinerAI';
import HowItWorks from './components/HowItWorks';
import WhyChoose from './components/WhyChoose';
import Examples from './components/Examples';
import DemoTryIt from './components/DemoTryIt';
import Technology from './components/Technology';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Aura from './components/Aura';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { startItineraryGeneration, type ItineraryParams } from './utils/itinerary';
import EnhancedDatePicker from './components/EnhancedDatePicker';

function App() {
  const [view, setView] = useState<'home' | 'proposals'>('home');
  const [dest, setDest] = useState('');
  const [datePickerState, setDatePickerState] = useState<{
    isOpen: boolean;
    startDate: string;
    endDate: string;
    days: number;
    destination: string;
    people: number;
  }>({
    isOpen: false,
    startDate: '',
    endDate: '',
    days: 3,
    destination: '',
    people: 2
  });

  // Blocca lo scrolling quando il calendario è aperto e gestisci ESC
  useEffect(() => {
    if (datePickerState.isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      // Gestione tasto ESC per chiudere il modale
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setDatePickerState(prev => ({ ...prev, isOpen: false }));
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      // Cleanup function per ripristinare lo stato originale
      return () => {
        document.body.style.overflow = 'unset';
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [datePickerState.isOpen]);

  if (view === 'proposals') {
    return (
      <div className="min-h-screen bg-white">
        <Proposals destination={dest} onBack={() => setView('home')} />
        <Footer />
        <SpeedInsights />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero 
        onStart={(p: ItineraryParams) => {
          startItineraryGeneration(p, () => { setDest(p.destination); setView('proposals'); });
        }}
        onDatePickerToggle={(isOpen) => {
          setDatePickerState(prev => ({ ...prev, isOpen }));
        }}
        datePickerState={{
          isOpen: datePickerState.isOpen,
          startDate: datePickerState.startDate,
          endDate: datePickerState.endDate,
          days: datePickerState.days
        }}
      />
      <WhatIsItinerAI />
      <section id="how" className="scroll-mt-24">
        <HowItWorks />
      </section>
      <WhyChoose />
      <section id="examples" className="scroll-mt-24">
      <Examples onStart={(p: ItineraryParams) => {
        startItineraryGeneration(p, () => { setDest(p.destination); setView('proposals'); });
      }} />
      </section>
      <section id="try" className="scroll-mt-24">
      <DemoTryIt onStart={(p: ItineraryParams) => {
        startItineraryGeneration(p, () => { setDest(p.destination); setView('proposals'); });
      }} />
      </section>
      <Technology />
      <FinalCTA onStart={(p: ItineraryParams) => {
        startItineraryGeneration(p, () => { setDest(p.destination); setView('proposals'); });
      }} />
      <section id="contact" className="scroll-mt-24">
        <Footer />
      </section>
      <Aura />
      <SpeedInsights />

      {/* Global Date Picker Modal - Isolato completamente dal resto dell'applicazione */}
      {datePickerState.isOpen && (
        <div className="fixed inset-0 z-[9999] isolate">
          {/* Overlay scuro con click handler per chiusura */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setDatePickerState(prev => ({ ...prev, isOpen: false }))}
          />
          
          {/* Date Picker Container centrato con contesto di stacking isolato */}
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="relative w-full max-w-[45rem] mx-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()} // Previene la chiusura quando si clicca sul calendario
            >
              <EnhancedDatePicker
                open={datePickerState.isOpen}
                start={datePickerState.startDate}
                end={datePickerState.endDate}
                onClose={() => setDatePickerState(prev => ({ ...prev, isOpen: false }))}
                onSelectRange={(startDate, endDate) => {
                  const calculatedDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  setDatePickerState(prev => ({
                    ...prev,
                    startDate,
                    endDate,
                    days: calculatedDays,
                    isOpen: false
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
