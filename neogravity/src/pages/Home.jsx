/**
 * Home page with hero, interactive modules, and cosmic aesthetic.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';
import NeonButton from '../components/NeonButton';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: '3D Simulator',
      desc: 'Interact with anti-gravity in our real-time 3D playground with custom fields, matter spawners, and orbital presets.',
      path: '/simulator',
      icon: '🌌',
      badge: 'Interactive 3D',
    },
    {
      title: 'Zero-G Game',
      desc: 'Navigate high-speed asteroid fields, boost your ship, collect quantum cores, and compete for high scores.',
      path: '/game',
      icon: '🚀',
      badge: 'Arcade Mode',
    },
    {
      title: 'AI Gravity Lab',
      desc: 'Generate sci-fi blueprints and theoretical anti-gravity constructs using the neural prototype engine.',
      path: '/ai-lab',
      icon: '🧠',
      badge: 'Neural Engine',
    },
    {
      title: 'Physics Lab',
      desc: 'Interactive formula calculators for universal gravitation, escape velocity, and solar system body weights.',
      path: '/physics',
      icon: '⚛️',
      badge: 'Educational Lab',
    },
    {
      title: 'Command Crew',
      desc: 'Meet the architects behind the NeoGravity project and beam transmissions directly to orbital command.',
      path: '/team',
      icon: '📡',
      badge: 'Comms Link',
    },
  ];

  const title = 'NEO⚡GRAVITY'.split('');

  return (
    <PageTransition className="!pt-0 !px-0 max-w-full">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-neon-cyan/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-neon-purple/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <span className="px-3.5 py-1 rounded-full text-xs font-orbitron font-bold tracking-widest text-neon-cyan border border-neon-cyan/40 bg-neon-cyan/10">
              ⚡ NEXT-GEN GRAVITATIONAL PLATFORM
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 flex justify-center flex-wrap neon-text tracking-wider">
            {title.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={char === '⚡' ? 'text-yellow-400 drop-shadow-[0_0_15px_#facc15]' : ''}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 font-light mb-10 max-w-2xl mx-auto px-4 font-rajdhani"
          >
            Defy physical limits with interactive 3D particle fields, zero-gravity mechanics, and generative quantum blueprints.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            <NeonButton onClick={() => navigate('/simulator')} variant="primary">
              Launch 3D Simulator
            </NeonButton>
            <NeonButton onClick={() => navigate('/game')} variant="secondary">
              Play Zero-G Game
            </NeonButton>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 font-orbitron text-xs text-gray-400 hover:text-white uppercase tracking-wider transition border border-white/10 hover:border-white/30 rounded-lg"
            >
              Explore Modules ↓
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features / Modules Section */}
      <section id="features" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan block mb-2">
            Integrated Systems
          </span>
          <h2 className="text-4xl md:text-5xl font-black neon-text-purple mb-4">Command Modules</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple mx-auto rounded"></div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03 }}
              className="h-full"
            >
              <GlowCard
                className="h-full flex flex-col justify-between cursor-pointer group hover:border-neon-cyan transition-all"
                onClick={() => navigate(feature.path)}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </span>
                    <span className="text-[10px] font-mono text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 px-2 py-0.5 rounded">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-neon-cyan transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-6 font-rajdhani text-base leading-relaxed">{feature.desc}</p>
                </div>

                <div className="text-right pt-4 border-t border-white/5">
                  <span className="text-neon-purple group-hover:text-neon-cyan inline-flex items-center font-orbitron text-xs font-bold transition-colors">
                    Access System
                    <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-12 bg-space-black/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-orbitron font-black neon-text mb-2">NEO⚡GRAVITY</h2>
          <p className="text-gray-400 font-rajdhani text-lg">
            Final-Year Capstone Project • High-Performance Physics & Sci-Fi Simulation
          </p>
          <div className="flex space-x-4 mt-6">
            <span
              onClick={() => navigate('/simulator')}
              className="px-4 py-1.5 rounded-full glass-card hover:neon-border cursor-pointer transition text-xs font-mono"
            >
              Simulator
            </span>
            <span
              onClick={() => navigate('/game')}
              className="px-4 py-1.5 rounded-full glass-card hover:neon-border cursor-pointer transition text-xs font-mono"
            >
              Zero-G Game
            </span>
            <span
              onClick={() => navigate('/ai-lab')}
              className="px-4 py-1.5 rounded-full glass-card hover:neon-border cursor-pointer transition text-xs font-mono"
            >
              AI Lab
            </span>
            <span
              onClick={() => navigate('/physics')}
              className="px-4 py-1.5 rounded-full glass-card hover:neon-border cursor-pointer transition text-xs font-mono"
            >
              Physics
            </span>
            <span
              onClick={() => navigate('/team')}
              className="px-4 py-1.5 rounded-full glass-card hover:neon-border cursor-pointer transition text-xs font-mono"
            >
              Crew
            </span>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
};

export default Home;
