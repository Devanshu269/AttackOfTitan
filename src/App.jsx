import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import Loader from './components/Loader';

import Home from './pages/Home';
import Episodes from './pages/Episodes';
import Characters from './pages/Characters';
import Titans from './pages/Titans';
import Cast from './pages/Cast';

import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const pageVariants = {
  initial: { opacity: 0, y: 30, filter: "blur(6px)" },
  enter:   { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit:    { opacity: 0, y: -20, filter: "blur(6px)", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  );
}

function AppContent() {
  const [loaderDone, setLoaderDone] = useState(false);
  const location = useLocation();

  return (
    <>
      <AnimatePresence>
        {!loaderDone && <Loader onComplete={() => setLoaderDone(true)} />}
      </AnimatePresence>

      {loaderDone && (
        <div className="app-container">
          <ScrollToTop />
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"           element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/episodes"   element={<AnimatedPage><Episodes /></AnimatedPage>} />
              <Route path="/characters" element={<AnimatedPage><Characters /></AnimatedPage>} />
              <Route path="/titans"     element={<AnimatedPage><Titans /></AnimatedPage>} />
              <Route path="/cast"       element={<AnimatedPage><Cast /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
          <AudioPlayer />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppContent />
    </Router>
  );
}
