/**
 * Main application component.
 */
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import NeonButton from './components/NeonButton';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home.jsx'));
const Simulator = lazy(() => import('./pages/Simulator.jsx'));
const Game = lazy(() => import('./pages/Game.jsx'));
const AILab = lazy(() => import('./pages/AILab.jsx'));
const Physics = lazy(() => import('./pages/Physics.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20">
      <span className="text-6xl mb-4 animate-bounce">🛸</span>
      <h1 className="text-6xl font-black text-red-500 font-orbitron mb-2 drop-shadow-[0_0_20px_red]">
        404
      </h1>
      <h2 className="text-2xl font-bold text-white mb-4 font-orbitron">SIGNAL LOST IN THE VOID</h2>
      <p className="text-gray-400 font-rajdhani text-lg max-w-md mb-8">
        The coordinates you entered do not exist in the known gravitational sector.
      </p>
      <NeonButton onClick={() => navigate('/')}>Return to Base</NeonButton>
    </div>
  );
};

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ParticleBackground />
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-neon-cyan animate-pulse">
            <h2 className="font-orbitron text-2xl tracking-widest">INITIALIZING...</h2>
          </div>
        }
      >
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
