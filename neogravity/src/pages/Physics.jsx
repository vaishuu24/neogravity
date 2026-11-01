/**
 * Physics Educational Page.
 * Includes Newton's Law of Gravitation with celestial presets,
 * Escape Velocity calculator, and Solar System Weight Simulator.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';

const G = 6.6743e-11;

const PRESETS = [
  { name: 'Earth & Moon', m1: 5.972e24, m2: 7.342e22, r: 384400000, desc: 'Lunar orbital attraction' },
  { name: 'Sun & Earth', m1: 1.989e30, m2: 5.972e24, r: 149600000000, desc: 'Planetary orbit around the Sun' },
  { name: 'Human on Earth', m1: 5.972e24, m2: 75, r: 6371000, desc: 'Everyday surface gravitational pull' },
  { name: 'ISS in Low Earth Orbit', m1: 5.972e24, m2: 450000, r: 6771000, desc: '400 km above sea level' },
  { name: 'Binary Neutron Stars', m1: 2.8e30, m2: 2.8e30, r: 50000000, desc: 'Extreme relativistic gravitational field' },
];

const CELESTIAL_BODIES = [
  { name: 'Mercury', g: 0.38, color: '#94a3b8' },
  { name: 'Venus', g: 0.91, color: '#f59e0b' },
  { name: 'Earth', g: 1.0, color: '#00f5ff' },
  { name: 'Moon', g: 0.166, color: '#cbd5e1' },
  { name: 'Mars', g: 0.38, color: '#ef4444' },
  { name: 'Jupiter', g: 2.34, color: '#f97316' },
  { name: 'Saturn', g: 1.06, color: '#eab308' },
  { name: 'Uranus', g: 0.92, color: '#06b6d4' },
  { name: 'Neptune', g: 1.12, color: '#3b82f6' },
  { name: 'Pluto', g: 0.063, color: '#a855f7' },
];

const ESCAPE_BODIES = [
  { name: 'Earth', mass: 5.972e24, radius: 6371000 },
  { name: 'Moon', mass: 7.342e22, radius: 1737000 },
  { name: 'Mars', mass: 6.417e23, radius: 3389000 },
  { name: 'Jupiter', mass: 1.898e27, radius: 69911000 },
  { name: 'Sun', mass: 1.989e30, radius: 696340000 },
];

const Physics = () => {
  // Newton's Law
  const [mass1, setMass1] = useState(5.972e24);
  const [mass2, setMass2] = useState(1);
  const [distance, setDistance] = useState(6371000);

  // Weight on other worlds
  const [userWeight, setUserWeight] = useState(70);

  // Escape velocity
  const [escMass, setEscMass] = useState(5.972e24);
  const [escRadius, setEscRadius] = useState(6371000);

  const force = distance > 0 ? (G * mass1 * mass2) / (distance * distance) : 0;
  const escapeVelocity = escRadius > 0 ? Math.sqrt((2 * G * escMass) / escRadius) : 0;

  const sections = [
    {
      title: "Newton's Law of Universal Gravitation",
      content:
        'Every mass particle attracts every other particle in the cosmos with a force directly proportional to the product of their masses and inversely proportional to the square of the distance separating their centers.',
      formula: 'F = G · (m₁ · m₂) / r²',
    },
    {
      title: "Einstein's General Relativity & Spacetime Curvature",
      content:
        'Gravity is not an attractive mechanical force, but the geometrical curvature of four-dimensional spacetime caused by mass and energy distribution. Objects simply follow straight paths (geodesics) through curved spacetime.',
      formula: 'G_μν + Λ g_μν = (8πG / c⁴) · T_μν',
    },
    {
      title: 'Theoretical Anti-Gravity & Quantum Levitation',
      content:
        'Theoretical anti-gravity seeks to create localized negative energy densities (as in Casimir cavities) or manipulate hypothetical gravitons and Higgs fields to repel spacetime, producing frictionless weightlessness.',
      formula: 'ρ < 0  ⟹  T₀₀ < 0 (Negative Energy Density)',
    },
  ];

  return (
    <PageTransition className="max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black neon-text mb-3">Gravitational Physics Lab</h1>
        <p className="text-gray-400 font-rajdhani text-xl max-w-2xl mx-auto">
          Explore universal gravitation, escape thresholds, and theoretical propulsion physics through interactive models.
        </p>
      </div>

      {/* Physics Core Theory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlowCard className="h-full flex flex-col justify-between p-6">
              <div>
                <h2 className="text-xl font-bold text-neon-purple mb-3">{section.title}</h2>
                <p className="text-gray-300 font-rajdhani text-base leading-relaxed mb-4">{section.content}</p>
              </div>
              <div className="bg-space-black/90 rounded-lg p-3 border border-white/10 font-mono text-neon-cyan text-xs text-center tracking-wider overflow-x-auto">
                {section.formula}
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Interactive Calculator: Newton's Law */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14">
        <GlowCard className="border-neon-cyan/50 p-8">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white neon-text">Gravitational Force Calculator</h2>
              <p className="text-gray-400 text-sm font-rajdhani">Calculate the mutual attraction between any two cosmic masses.</p>
            </div>
            <span className="text-xs font-mono text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded border border-neon-cyan/30">
              G = 6.6743 × 10⁻¹¹ N·m²/kg²
            </span>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-2">
              Cosmic Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setMass1(p.m1);
                    setMass2(p.m2);
                    setDistance(p.r);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-neon-cyan hover:bg-neon-cyan/15 text-xs text-gray-300 hover:text-white transition font-rajdhani"
                >
                  🔭 {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-space-black/60 p-4 rounded-lg border border-white/10">
              <label className="block text-gray-400 mb-1 font-rajdhani text-sm">Mass 1 (kg)</label>
              <input
                type="number"
                value={mass1}
                onChange={(e) => setMass1(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent border-b border-neon-cyan text-white p-2 font-mono text-sm focus:outline-none"
              />
              <span className="text-[11px] text-gray-500 font-mono mt-1 block">m₁ = {mass1.toExponential(3)} kg</span>
            </div>

            <div className="bg-space-black/60 p-4 rounded-lg border border-white/10">
              <label className="block text-gray-400 mb-1 font-rajdhani text-sm">Mass 2 (kg)</label>
              <input
                type="number"
                value={mass2}
                onChange={(e) => setMass2(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent border-b border-neon-cyan text-white p-2 font-mono text-sm focus:outline-none"
              />
              <span className="text-[11px] text-gray-500 font-mono mt-1 block">m₂ = {mass2.toExponential(3)} kg</span>
            </div>

            <div className="bg-space-black/60 p-4 rounded-lg border border-white/10">
              <label className="block text-gray-400 mb-1 font-rajdhani text-sm">Separation Distance (m)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent border-b border-neon-cyan text-white p-2 font-mono text-sm focus:outline-none"
              />
              <span className="text-[11px] text-gray-500 font-mono mt-1 block">r = {(distance / 1000).toLocaleString()} km</span>
            </div>
          </div>

          <div className="text-center p-6 bg-neon-cyan/10 rounded-xl border border-neon-cyan/40 shadow-[0_0_20px_rgba(0,245,255,0.15)]">
            <p className="text-gray-400 mb-1 uppercase tracking-widest text-xs font-bold font-orbitron">
              Total Resultant Force
            </p>
            <p className="text-4xl md:text-5xl text-white font-orbitron font-black drop-shadow-[0_0_15px_#00f5ff]">
              {force.toExponential(4)} <span className="text-neon-cyan text-2xl">Newtons (N)</span>
            </p>
          </div>
        </GlowCard>
      </motion.div>

      {/* Escape Velocity Section */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14">
        <GlowCard className="border-neon-purple/50 p-8">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white neon-text-purple">Escape Velocity Calculator</h2>
              <p className="text-gray-400 text-sm font-rajdhani">
                Speed required for a projectile to permanently overcome a body's gravitational well.
              </p>
            </div>
            <span className="text-xs font-mono text-neon-purple bg-neon-purple/10 px-3 py-1 rounded border border-neon-purple/30">
              v_esc = √(2GM / R)
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {ESCAPE_BODIES.map((b) => (
              <button
                key={b.name}
                onClick={() => {
                  setEscMass(b.mass);
                  setEscRadius(b.radius);
                }}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-neon-purple hover:bg-neon-purple/15 text-xs text-gray-300 hover:text-white transition font-rajdhani"
              >
                🪐 {b.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-space-black/60 p-4 rounded-lg border border-white/10">
              <label className="block text-gray-400 mb-1 font-rajdhani text-sm">Celestial Mass (kg)</label>
              <input
                type="number"
                value={escMass}
                onChange={(e) => setEscMass(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent border-b border-neon-purple text-white p-2 font-mono text-sm focus:outline-none"
              />
            </div>
            <div className="bg-space-black/60 p-4 rounded-lg border border-white/10">
              <label className="block text-gray-400 mb-1 font-rajdhani text-sm">Radius from Center (m)</label>
              <input
                type="number"
                value={escRadius}
                onChange={(e) => setEscRadius(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent border-b border-neon-purple text-white p-2 font-mono text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="text-center p-6 bg-neon-purple/10 rounded-xl border border-neon-purple/40">
            <p className="text-gray-400 mb-1 uppercase tracking-widest text-xs font-bold font-orbitron">
              Escape Velocity Threshold
            </p>
            <p className="text-3xl md:text-4xl text-white font-orbitron font-black drop-shadow-[0_0_15px_#a855f7]">
              {(escapeVelocity / 1000).toFixed(2)} <span className="text-neon-purple text-xl">km/s</span>
              <span className="text-gray-400 text-lg font-light ml-3">
                ({(escapeVelocity * 2.23694).toFixed(0)} mph)
              </span>
            </p>
          </div>
        </GlowCard>
      </motion.div>

      {/* Weight on Other Worlds */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <GlowCard className="p-8">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Weight in the Solar System</h2>
              <p className="text-gray-400 text-sm font-rajdhani">
                See how surface gravity scales your physical weight across neighboring worlds.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 font-rajdhani">Your Earth Mass/Weight (kg):</label>
              <input
                type="number"
                value={userWeight}
                onChange={(e) => setUserWeight(parseFloat(e.target.value) || 0)}
                className="w-20 bg-space-black border border-neon-cyan rounded px-2 py-1 text-center font-mono text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CELESTIAL_BODIES.map((planet) => {
              const calcWeight = (userWeight * planet.g).toFixed(1);
              return (
                <div
                  key={planet.name}
                  className="bg-space-black/70 p-3 rounded-xl border border-white/10 hover:border-neon-cyan/50 transition-all text-center flex flex-col justify-between"
                >
                  <div className="w-8 h-8 rounded-full mx-auto mb-2 opacity-90" style={{ backgroundColor: planet.color }} />
                  <h4 className="font-bold text-sm text-gray-200">{planet.name}</h4>
                  <p className="text-[11px] text-gray-400 font-mono mb-2">{planet.g}g</p>
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-lg font-orbitron font-bold text-neon-cyan">{calcWeight}</span>
                    <span className="text-[11px] text-gray-400 ml-1">kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlowCard>
      </motion.div>
    </PageTransition>
  );
};

export default Physics;
