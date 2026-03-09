import { useState } from 'react';
import './portfolio.css';

import { Loader } from './components/Loader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="pf" style={{ minHeight: '100vh', background: '#000', color: '#f5f5f5' }}>
      {/* Grain overlay */}
      <div className="pf-grain" aria-hidden="true" />

      {/* Loading screen */}
      <Loader onDone={() => setLoaded(true)} />

      {/* Main content — rendered in DOM immediately but visually hidden until loaded */}
      <div style={{ visibility: loaded ? 'visible' : 'hidden' }}>
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}