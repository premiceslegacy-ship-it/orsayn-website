import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Concept from './components/Concept';
import StructureImage from './components/StructureImage';
import Services from './components/Services';
import Perspectives from './components/Perspectives';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GridLines from './components/GridLines';

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink overflow-x-hidden selection:bg-ink selection:text-paper font-sans">
      <GridLines />
      <Navigation />
      
      <main className="relative z-10">
        <Hero />
        {/* Clients is now integrated inside Hero for the requested layout flow */}
        <Concept />
        <StructureImage />
        <Services />
        <Perspectives />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;