/**
 * AI Gravity Lab - Generate Sci-Fi Inventions.
 * Interactive blueprint synthesizer with prompt presets, copy, JSON export,
 * and vault retrieval.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';
import NeonButton from '../components/NeonButton';
import { generateInvention } from '../utils/mockAI';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SAMPLE_PROMPTS = [
  'Heavy cargo lifter to transport 50 tons over steep canyon fissures',
  'Exo-grav boots with smooth vertical cliff-face traction for astronauts',
  'Planetary Alcubierre warp propulsion for interplanetary transport',
  'Kinetic graviton deflector shield against hypervelocity micro-meteorites',
  'Subterranean tectonic ore harvester extracting rare metals from asteroids',
];

const AILab = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [savedInventions, setSavedInventions] = useLocalStorage('gravityInventions', []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleGenerate = async (queryToUse) => {
    const text = typeof queryToUse === 'string' ? queryToUse : prompt;
    if (!text.trim()) {
      triggerToast('Please describe an engineering requirement or choose a preset.');
      return;
    }
    setLoading(true);
    try {
      const generated = await generateInvention(text);
      setCurrentResult(generated);
    } catch (e) {
      console.error(e);
      triggerToast('Synthesis failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!currentResult) return;
    const exists = savedInventions.find((i) => i.protoId === currentResult.protoId || i.name === currentResult.name);
    if (!exists) {
      setSavedInventions([currentResult, ...savedInventions]);
      triggerToast('Blueprint secured in vault.');
    } else {
      triggerToast('Blueprint already archived in vault.');
    }
  };

  const handleDelete = (protoId) => {
    setSavedInventions(savedInventions.filter((i) => (i.protoId || i.name) !== protoId));
    triggerToast('Archived prototype removed.');
  };

  const handleCopy = () => {
    if (!currentResult) return;
    const textToCopy = `[NEOGRAVITY BLUEPRINT: ${currentResult.name}]
Proto-ID: ${currentResult.protoId}
Power Source: ${currentResult.powerSource}
Efficiency: ${currentResult.efficiency} | Field Radius: ${currentResult.fieldRadius}

Summary:
${currentResult.description}

Physics Foundation:
${currentResult.physicsPrinciple}

Applications:
${currentResult.useCases.map((u) => `- ${u}`).join('\n')}

Safety Protocol:
${currentResult.safetyWarning}`;

    navigator.clipboard.writeText(textToCopy);
    triggerToast('Blueprint telemetry copied to clipboard!');
  };

  const handleExportJSON = () => {
    if (savedInventions.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedInventions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'neogravity_vault_blueprints.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Vault data exported to JSON.');
  };

  return (
    <PageTransition className="flex flex-col lg:flex-row gap-8">
      {/* Main Generator Workspace */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-4xl font-black neon-text-purple mb-2">AI Gravity Lab</h1>
          <p className="text-gray-400 font-rajdhani text-lg">
            Harness neural algorithms to synthesize theoretical anti-gravity constructs and quantum blueprints.
          </p>
        </div>

        {/* Input Card */}
        <GlowCard className="mb-8 p-6">
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
            Mission Objective / Engineering Brief:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            className="w-full h-28 bg-space-black/60 border border-white/20 rounded-lg p-4 text-white font-rajdhani text-lg focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_12px_rgba(0,245,255,0.3)] resize-none transition-all placeholder:text-gray-600"
            placeholder="Describe your engineering requirement... (e.g. Need to float a heavy excavation station over volcanic tectonic fissures). [Press Ctrl+Enter to generate]"
          />

          {/* Quick Prompt Chips */}
          <div className="mt-3">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1 font-bold">
              Rapid Synthesis Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(sample);
                    handleGenerate(sample);
                  }}
                  className="text-xs py-1 px-2.5 rounded-full bg-white/5 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/50 text-gray-300 hover:text-white transition-all text-left font-rajdhani"
                >
                  ⚡ {sample.split(' ').slice(0, 4).join(' ')}...
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <NeonButton onClick={() => handleGenerate()} disabled={loading} variant="secondary">
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Synthesizing Blueprint...
                </span>
              ) : (
                'Generate Blueprint'
              )}
            </NeonButton>
          </div>
        </GlowCard>

        {/* Blueprint Display Result */}
        <AnimatePresence mode="wait">
          {currentResult && (
            <motion.div
              key={currentResult.protoId || currentResult.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <GlowCard className="border-neon-cyan bg-neon-cyan/5 p-6 relative overflow-hidden">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-4 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-mono text-neon-cyan/80 uppercase tracking-widest block">
                      ARCHIVE: {currentResult.protoId}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-neon-cyan neon-text">{currentResult.name}</h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs bg-neon-purple/20 text-neon-purple px-2.5 py-1 rounded border border-neon-purple/50 uppercase tracking-wider font-orbitron font-bold">
                      {currentResult.powerSource}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 font-mono">
                      Field Eff: {currentResult.efficiency} | Radius: {currentResult.fieldRadius}
                    </span>
                  </div>
                </div>

                <p className="text-gray-200 font-rajdhani text-lg mb-5 leading-relaxed">
                  {currentResult.description}
                </p>

                {currentResult.physicsPrinciple && (
                  <div className="mb-4 bg-black/40 p-3 rounded-lg border border-white/10">
                    <h4 className="text-xs text-neon-purple uppercase tracking-wider font-bold mb-1 font-orbitron">
                      Quantum Physics Basis
                    </h4>
                    <p className="text-sm text-gray-300 font-mono">{currentResult.physicsPrinciple}</p>
                  </div>
                )}

                <div className="mb-5">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold font-orbitron">
                    Operational Applications
                  </h4>
                  <ul className="list-disc pl-5 text-gray-300 font-rajdhani space-y-1">
                    {currentResult.useCases.map((useCase, idx) => (
                      <li key={idx} className="marker:text-neon-cyan">
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                {currentResult.safetyWarning && (
                  <div className="mb-5 text-xs text-amber-300/90 bg-amber-500/10 p-2.5 rounded border border-amber-500/30 flex items-start gap-2">
                    <span className="text-base leading-none">⚠️</span>
                    <span>
                      <strong>Safety Protocol:</strong> {currentResult.safetyWarning}
                    </span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 flex flex-wrap justify-between items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="text-gray-300 hover:text-neon-cyan transition-colors uppercase tracking-widest font-orbitron text-xs inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Telemetry
                  </button>

                  <button
                    onClick={handleSave}
                    className="text-neon-cyan hover:text-white transition-colors uppercase tracking-widest font-orbitron text-xs inline-flex items-center border border-neon-cyan/40 px-3 py-1.5 rounded hover:bg-neon-cyan/20"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Secure In Vault
                  </button>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Secure Vault */}
      <aside className="w-full lg:w-96">
        <div className="glass-card p-6 h-full border-white/10 border-t-2 border-t-neon-purple min-h-[500px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neon-purple flex items-center">
                <svg className="w-5 h-5 mr-2 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8-4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
                Secure Vault
              </h3>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-gray-300">
                {savedInventions.length} Items
              </span>
            </div>

            <p className="text-xs text-gray-400 font-rajdhani mb-4">
              Click any blueprint to inspect or restore.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {savedInventions.length === 0 ? (
                <div className="text-center py-16 text-gray-500 font-rajdhani text-base">
                  <span className="text-3xl block mb-2 opacity-50">📂</span>
                  Vault is empty.
                  <br />
                  Generate and secure blueprints above.
                </div>
              ) : (
                <AnimatePresence>
                  {savedInventions.map((inv) => (
                    <motion.div
                      key={inv.protoId || inv.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => setCurrentResult(inv)}
                      className={`group relative p-3 border rounded-lg cursor-pointer transition-all ${
                        currentResult?.name === inv.name
                          ? 'border-neon-cyan bg-neon-cyan/15'
                          : 'border-white/10 bg-space-black/60 hover:border-neon-purple/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-gray-100 group-hover:text-neon-cyan transition-colors pr-6">
                          {inv.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-400 font-rajdhani truncate mt-1">{inv.description}</p>
                      <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500 font-mono">
                        <span>{inv.protoId || 'PROTO'}</span>
                        <span className="text-neon-purple">{inv.efficiency}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(inv.protoId || inv.name);
                        }}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors p-1"
                        title="Delete blueprint"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {savedInventions.length > 0 && (
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
              <button onClick={handleExportJSON} className="text-neon-cyan hover:underline font-orbitron">
                Export JSON ⬇
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear all stored vault blueprints?')) {
                    setSavedInventions([]);
                    triggerToast('Vault cleared.');
                  }
                }}
                className="text-red-400 hover:underline font-rajdhani"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 border border-neon-cyan text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(0,245,255,0.4)] backdrop-blur z-50 text-xs font-orbitron flex items-center gap-2"
          >
            <span className="text-neon-cyan font-bold">⚡</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default AILab;
