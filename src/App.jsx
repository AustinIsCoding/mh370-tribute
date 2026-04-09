import './index.css';
import { LangProvider } from './context/LangContext';
import StarCanvas from './components/StarCanvas';
import Nav from './components/Nav';
import MemorialBar from './components/MemorialBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Hero from './sections/Hero';
import Timeline from './sections/Timeline';
import Souls from './sections/Souls';
import Theories from './sections/Theories';
import Updates from './sections/Updates';
import Tribute from './sections/Tribute';

export default function App() {
  return (
    <LangProvider>
      {/* 239 animated stars — fixed behind everything */}
      <StarCanvas />

      {/* Sticky nav */}
      <Nav />

      {/* Gold memorial bar */}
      <MemorialBar />

      {/* Main content */}
      <main>
        <Hero />
        <Timeline />
        <Souls />
        <Theories />
        <Updates />
        <Tribute />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating scroll-to-top button */}
      <ScrollToTop />
    </LangProvider>
  );
}
