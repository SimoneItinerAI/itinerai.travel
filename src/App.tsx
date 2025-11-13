import Hero from './components/Hero';
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

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhatIsItinerAI />
      <HowItWorks />
      <WhyChoose />
      <Examples />
      <DemoTryIt />
      <Technology />
      <FinalCTA />
      <Footer />
      <Aura />
    </div>
  );
}

export default App;
