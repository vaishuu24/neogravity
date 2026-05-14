/**
 * AI Gravity Lab - Generate Sci-Fi Inventions.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';
import NeonButton from '../components/NeonButton';
import { generateInvention } from '../utils/mockAI';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AILab = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [savedInventions, setSavedInventions] = useLocalStorage('gravityInventions', []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const generated = await generateInvention(prompt);
      setCurrentResult(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (currentResult && !savedInventions.find(i => i.name === currentResult.name)) {
      setSavedInventions([currentResult, ...savedInventions]);
    }
  };

  const handleDelete = (name) => {
    setSavedInventions(savedInventions.filter(i => i.name !== name));
  };

  return (
    <PageTransition className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-4xl font-bold neon-text-purple mb-2">AI Gravity Lab</h1>
        <p className="text-gray-400 mb-8 font-rajdhani text-lg">Harness the power of neural networks to prototype theoretical anti-gravity constructs.</p>
        
        <GlowCard className="mb-8 p-8">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 bg-space-black/50 border border-white/20 rounded-lg p-4 text-white font-rajdhani focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,245,255,0.3)] resize-none transition-all"
            placeholder="Describe your anti-gravity problem... (e.g. I need to lift a 10-ton cargo across a canyon)"
          ></textarea>
          
          <div className="mt-6 flex justify-end">
            <NeonButton onClick={handleGenerate} disabled={loading} variant="secondary">
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Generate Blueprint'}
            </NeonButton>
          </div>
        </GlowCard>

        <AnimatePresence mode="wait">
          {currentResult && (
            <motion.div
              key={currentResult.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <GlowCard className="border-neon-cyan bg-neon-cyan/5">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-neon-cyan neon-text">{currentResult.name}</h2>
                  <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded border border-neon-purple/50 uppercase tracking-widest">
                    {currentResult.powerSource}
                  </span>
                </div>
                
                <p className="text-gray-300 font-rajdhani text-lg mb-6 leading-relaxed">
                  {currentResult.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-bold">Applications</h4>
                  <ul className="list-disc pl-5 text-gray-300 font-rajdhani space-y-1">
                    {currentResult.useCases.map((useCase, idx) => (
                      <li key={idx} className="marker:text-neon-cyan">{useCase}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-white/10 pt-4 text-right">
                  <button 
                    onClick={handleSave}
                    className="text-neon-cyan hover:text-white transition-colors uppercase tracking-widest font-orbitron text-sm inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Save Prototype
                  </button>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="w-full lg:w-96">
        <div className="glass-card p-6 h-full border-white/5 border-t-neon-purple min-h-[500px]">
          <h3 className="text-xl font-bold text-neon-purple mb-6 flex items-center">
            <svg className="w-5 h-5 mr-3 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            Secure Vault
          </h3>
          
          <div className="space-y-4">
            {savedInventions.length === 0 ? (
              <p className="text-gray-500 italic text-sm text-center py-10">Vault is empty. Generate a prototype first.</p>
            ) : (
              <AnimatePresence>
                {savedInventions.map((inv) => (
                  <motion.div
                    key={inv.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group relative bg-space-black/60 p-4 border border-white/5 rounded-lg hover:border-neon-purple/50 transition-all"
                  >
                    <h4 className="font-bold text-gray-200 group-hover:text-neon-purple transition-colors">{inv.name}</h4>
                    <p className="text-xs text-gray-500 font-rajdhani truncate mt-1">{inv.description}</p>
                    
                    <button 
                      onClick={() => handleDelete(inv.name)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors bg-space-black rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </aside>
    </PageTransition>
  );
};

export default AILab;
