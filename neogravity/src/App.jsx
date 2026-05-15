/**
 * Main application component.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';

import Home from './pages/Home.jsx';
import Simulator from './pages/Simulator.jsx';
import Game from './pages/Game.jsx';
import AILab from './pages/AILab.jsx';
import Physics from './pages/Physics.jsx';
import Team from './pages/Team.jsx';

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
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
