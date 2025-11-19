import { useState } from 'react';
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
import { startItineraryGeneration, type ItineraryParams, loadItineraryFromStorage } from './utils/itinerary';

function App() {
  const [view, setView] = useState<'home' | 'proposals'>('home');
  const [dest, setDest] = useState('');

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
      <Hero onStart={(p: ItineraryParams) => {
        startItineraryGeneration(p, () => { setDest(p.destination); setView('proposals'); });
      }} />
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
    </div>
  );
}

export default App;
