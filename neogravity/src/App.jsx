/**
 * Main application component.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home.jsx'));
const Simulator = lazy(() => import('./pages/Simulator.jsx'));
const Game = lazy(() => import('./pages/Game.jsx'));
const AILab = lazy(() => import('./pages/AILab.jsx'));
const Physics = lazy(() => import('./pages/Physics.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/game" element={<Game />} />
        <Route path="/ai-lab" element={<AILab />} />
        <Route path="/physics" element={<Physics />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ParticleBackground />
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-neon-cyan animate-pulse">
          <h2 className="font-orbitron text-2xl tracking-widest">INITIALIZING...</h2>
        </div>
      }>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
