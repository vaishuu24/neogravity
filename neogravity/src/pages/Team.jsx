/**
 * Team and Contact Commlink Page.
 * Displays project command crew with status indicators, transmission console,
 * and persistent local transmission archives.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';
import NeonButton from '../components/NeonButton';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TEAM_MEMBERS = [
  {
    name: 'Alex Vance',
    role: 'Lead Architect & Quantum Dynamics',
    status: 'ACTIVE • STATION ALPHA',
    avatar: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
    skills: ['Three.js', 'Graviton Mechanics', 'Vite Architecture'],
  },
  {
    name: 'Sarah Jin',
    role: 'Physics Engine & Orbital Math',
    status: 'ACTIVE • SOL OBSERVATORY',
    avatar: 'bg-neon-purple/20 text-neon-purple border-neon-purple/50',
    skills: ['Tensor Math', 'Collision Physics', 'Kinetic Dynamics'],
  },
  {
    name: 'Dr. R. Cole',
    role: 'AI Neural Networks & Heuristics',
    status: 'RESEARCH • DEEP SPACE LINK',
    avatar: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    skills: ['Neural Networks', 'Generative Blueprinting', 'NLP'],
  },
  {
    name: 'Max Thorne',
    role: 'UI/UX Design & Cyberpunk Systems',
    status: 'STANDBY • TERRESTRIAL LAB',
    avatar: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    skills: ['Framer Motion', 'Tailwind CSS', 'Shader Effects'],
  },
];

const Team = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', priority: 'Normal' });
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [savedMessages, setSavedMessages] = useLocalStorage('neogravityContact', []);

  const triggerToast = (text) => {
    setToastText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    const newTransmission = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      priority: formData.priority,
      timestamp: new Date().toLocaleString(),
      status: 'TRANSMITTED • RECEIVED',
    };

    setSavedMessages([newTransmission, ...savedMessages]);
    setFormData({ name: '', email: '', message: '', priority: 'Normal' });
    triggerToast(`Transmission ${newTransmission.id} beamed to orbital command!`);
  };

  const handleDeleteMessage = (id) => {
    setSavedMessages(savedMessages.filter((m) => m.id !== id));
  };

  return (
    <PageTransition className="max-w-6xl">
      {/* Page Title */}
      <div className="text-center mb-16 mt-4">
        <h1 className="text-5xl md:text-6xl font-black neon-text uppercase tracking-widest mb-4">Command Crew</h1>
        <p className="text-gray-400 text-xl font-rajdhani max-w-xl mx-auto">
          The researchers, engineers, and designers powering the NeoGravity anti-gravity platform.
        </p>
      </div>

      {/* Crew Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {TEAM_MEMBERS.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <GlowCard className="text-center group h-full flex flex-col justify-between p-6">
              <div>
                <div
                  className={`w-20 h-20 mx-auto rounded-full ${member.avatar} flex items-center justify-center text-3xl font-orbitron mb-4 border transition-transform duration-300 group-hover:scale-110 shadow-lg`}
                >
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                  {member.name}
                </h3>
                <p className="text-neon-purple font-rajdhani text-sm font-semibold mb-3">{member.role}</p>
                <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 block mb-4">
                  {member.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 justify-center pt-3 border-t border-white/5">
                {member.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-rajdhani text-gray-300 bg-black/40 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Comms Transmission Console */}
      <div className="max-w-3xl mx-auto">
        <GlowCard className="relative overflow-hidden p-8 border-neon-cyan/40">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-purple-500 to-neon-purple"></div>

          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-neon-cyan font-orbitron font-bold">
              Sub-Space Telemetry
            </span>
            <h2 className="text-3xl font-bold mt-1 text-white neon-text">Establish Commlink</h2>
            <p className="text-gray-400 font-rajdhani text-base">
              Send transmissions, feedback, or collaborative proposals directly to the NeoGravity team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 font-rajdhani text-sm">Designation (Name)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Commander Shepard"
                  className="w-full bg-space-black/80 border border-white/15 rounded-lg p-3 text-white focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 font-rajdhani text-sm">Commlink Address (Email)</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="shepard@normandy.space"
                  className="w-full bg-space-black/80 border border-white/15 rounded-lg p-3 text-white focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] focus:outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-rajdhani text-sm">Transmission Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {['Standard', 'Urgent', 'Classified Quantum'].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`py-2 rounded border text-xs font-orbitron transition ${
                      formData.priority === p
                        ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan font-bold'
                        : 'border-white/10 text-gray-400 hover:text-white bg-black/30'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-rajdhani text-sm">Encoded Transmission (Message)</label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Transmitting telemetry report on anti-gravity harmonics..."
                className="w-full bg-space-black/80 border border-white/15 rounded-lg p-3 text-white focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,245,255,0.2)] focus:outline-none transition-all resize-none placeholder:text-gray-600"
              />
            </div>

            <div className="text-center pt-2">
              <NeonButton type="submit" className="w-full">
                Transmit Packet to Orbit
              </NeonButton>
            </div>
          </form>

          {/* Collapsible Transmission Logs */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="text-xs font-orbitron text-gray-400 hover:text-neon-cyan transition flex items-center gap-1.5"
              >
                <span>{showLogs ? '▼' : '▶'}</span>
                Transmission Logs ({savedMessages.length})
              </button>
              {savedMessages.length > 0 && (
                <button
                  onClick={() => setSavedMessages([])}
                  className="text-xs text-red-400 hover:underline font-rajdhani"
                >
                  Clear Logs
                </button>
              )}
            </div>

            {showLogs && (
              <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
                {savedMessages.length === 0 ? (
                  <p className="text-xs text-gray-500 font-rajdhani text-center py-4">No logged transmissions yet.</p>
                ) : (
                  savedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-black/50 p-3 rounded-lg border border-white/10 flex justify-between items-start text-xs font-rajdhani"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-neon-cyan font-bold">{msg.id}</span>
                          <span className="text-gray-400">• {msg.name} ({msg.email})</span>
                          <span className="text-[10px] bg-neon-purple/20 text-neon-purple px-1.5 rounded font-mono">
                            {msg.priority}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{msg.message}</p>
                        <span className="text-[10px] text-gray-500 font-mono mt-1 block">{msg.timestamp}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-gray-500 hover:text-red-400 ml-2"
                        title="Delete log"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </GlowCard>
      </div>

      {/* Floating Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/90 border border-neon-cyan text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,245,255,0.4)] backdrop-blur z-50 flex items-center font-orbitron text-xs gap-3"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{toastText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Team;
