import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AtmosphereLayer from './components/AtmosphereLayer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Philosophy from './pages/Philosophy';
import Reservations from './pages/Reservations';
import Confirmation from './pages/Confirmation';
import PrivateDining from './pages/PrivateDining';
import PageTransition from './components/PageTransition';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />
        <Route path="/philosophy" element={<PageTransition><Philosophy /></PageTransition>} />
        <Route path="/reservations" element={<PageTransition><Reservations /></PageTransition>} />
        <Route path="/confirmation" element={<PageTransition><Confirmation /></PageTransition>} />
        <Route path="/private-dining" element={<PageTransition><PrivateDining /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AtmosphereLayer />
      <ScrollToTop />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </HashRouter>
  );
};

export default App;