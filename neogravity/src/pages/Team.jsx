/**
 * Team and Contact Page.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';
import NeonButton from '../components/NeonButton';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Team = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [showToast, setShowToast] = useState(false);
  const [savedMessages, setSavedMessages] = useLocalStorage('neogravityContact', []);

  const teamMembers = [
    { name: 'Vaishnavi Kolekar', role: 'Creator', avatar: 'bg-neon-purple/20 text-neon-purple' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSavedMessages([...savedMessages, { ...formData, date: new Date().toISOString() }]);
    setFormData({ name: '', email: '', message: '' });
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <PageTransition>
      <div className="text-center mb-16 mt-8">
        <h1 className="text-5xl font-black neon-text uppercase tracking-widest mb-4">Command Crew</h1>
        <p className="text-gray-300 text-xl font-rajdhani">The creator behind the NeoGravity project.</p>
      </div>

      <div className="flex justify-center gap-6 mb-24">
        {teamMembers.map((member, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="w-full max-w-sm"
          >
            <GlowCard className="text-center group h-full">
              <div className={`w-24 h-24 mx-auto rounded-full ${member.avatar} flex items-center justify-center text-3xl font-orbitron mb-4 border border-current transition-transform group-hover:scale-110`}>
                {member.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-neon-purple font-rajdhani">{member.role}</p>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <GlowCard className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-purple"></div>
          <h2 className="text-3xl font-bold mb-8 text-center">Establish Connection</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-rajdhani">Designation (Name)</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-space-black/80 border border-white/10 rounded p-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-rajdhani">Commlink (Email)</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-space-black/80 border border-white/10 rounded p-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-rajdhani">Transmission (Message)</label>
              <textarea 
                required
                rows="4"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-space-black/80 border border-white/10 rounded p-3 text-white focus:border-neon-cyan focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>
            <div className="text-center pt-4">
              <NeonButton type="submit" className="w-full">Transmit Data</NeonButton>
            </div>
          </form>
        </GlowCard>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-neon-cyan/20 border border-neon-cyan text-white px-6 py-3 rounded-full backdrop-blur z-50 flex items-center"
          >
            <svg className="w-5 h-5 mr-3 text-neon-cyan" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Transmission Successful!
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Team;
