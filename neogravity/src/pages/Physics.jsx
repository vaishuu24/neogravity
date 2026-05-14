/**
 * Physics Educational Page.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';

const Physics = () => {
  const [mass1, setMass1] = useState(5.972e24); // Earth mass
  const [mass2, setMass2] = useState(1); // 1kg
  const [distance, setDistance] = useState(6371000); // Earth radius

  const G = 6.6743e-11;
  const force = (G * mass1 * mass2) / (distance * distance);

  const sections = [
    {
      title: "Newton's Law of Gravitation",
      content: "Newton's law states that every particle attracts every other particle in the universe with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers.",
      formula: "F = G * (m1 * m2) / r²"
    },
    {
      title: "Anti-Gravity Concepts",
      content: "Theoretical frameworks suggest methods like electromagnetic shielding, diamagnetic levitation, or the manipulation of gravitons to negate gravitational pull. Currently, true anti-gravity remains elusive in modern physics.",
      formula: "Λ g_uv = ..."
    },
    {
      title: "Magnetic Levitation",
      content: "Maglev uses magnetic repulsion to lift objects, eliminating friction. While not technically 'anti-gravity', it simulates weightlessness locally and is extensively used in high-speed rail systems.",
      formula: "F = B²A / 2μ₀"
    }
  ];

  return (
    <PageTransition className="max-w-4xl">
      <h1 className="text-4xl font-bold neon-text text-center mb-12">The Physics of Gravity</h1>
      
      <div className="space-y-8 mb-16">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <GlowCard>
              <h2 className="text-2xl font-bold text-neon-purple mb-4">{section.title}</h2>
              <p className="text-gray-300 font-rajdhani text-lg mb-4">{section.content}</p>
              <div className="bg-space-black/80 rounded p-4 border border-white/5 font-mono text-neon-cyan text-center tracking-widest">
                {section.formula}
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <GlowCard className="border-neon-cyan border-opacity-50">
          <h2 className="text-2xl font-bold text-white mb-6 text-center neon-text">Interactive Calculator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-gray-400 mb-2 font-rajdhani">Mass 1 (kg)</label>
              <input 
                type="number" 
                value={mass1} 
                onChange={e => setMass1(Number(e.target.value))}
                className="w-full bg-transparent border-b border-neon-cyan text-white p-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 font-rajdhani">Mass 2 (kg)</label>
              <input 
                type="number" 
                value={mass2} 
                onChange={e => setMass2(Number(e.target.value))}
                className="w-full bg-transparent border-b border-neon-cyan text-white p-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 font-rajdhani">Distance (m)</label>
              <input 
                type="number" 
                value={distance} 
                onChange={e => setDistance(Number(e.target.value))}
                className="w-full bg-transparent border-b border-neon-cyan text-white p-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="text-center p-6 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30">
            <p className="text-gray-400 mb-2 uppercase tracking-widest text-sm font-bold">Gravitational Force</p>
            <p className="text-4xl text-white font-orbitron drop-shadow-[0_0_10px_#00f5ff]">{force.toExponential(4)} N</p>
          </div>
        </GlowCard>
      </motion.div>
    </PageTransition>
  );
};

export default Physics;
