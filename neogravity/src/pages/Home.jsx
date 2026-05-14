/**
 * Home page with hero, features, and footer.
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
    { title: 'Simulator', desc: 'Interact with anti-gravity in our 3D playground.', path: '/simulator' },
    { title: 'Zero-G Game', desc: 'Navigate asteroid fields while floating in space.', path: '/game' },
    { title: 'AI Lab', desc: 'Generate impossible sci-fi tools with artificial intelligence.', path: '/ai-lab' },
    { title: 'Physics', desc: 'Learn the real (and theoretical) science behind gravity.', path: '/physics' },
    { title: 'The Team', desc: 'Meet the brilliant minds behind NeoGravity.', path: '/team' },
  ];

  const title = "NeoGravity".split("");

  return (
    <PageTransition className="!pt-0 !px-0 max-w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-cyan/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        
        <div className="z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-4 flex justify-center neon-text">
            {title.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 font-light mb-8 max-w-2xl mx-auto px-4"
          >
            A futuristic anti-gravity themed interactive platform
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <NeonButton onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Enter The Void
            </NeonButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold neon-text-purple mb-4">Modules</h2>
          <div className="w-24 h-1 bg-neon-purple mx-auto rounded"></div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <GlowCard className="h-full flex flex-col justify-between cursor-pointer" onClick={() => navigate(feature.path)}>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-neon-cyan">{feature.title}</h3>
                  <p className="text-gray-400 mb-6 font-rajdhani text-lg">{feature.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-neon-purple group-hover:neon-text-purple inline-flex items-center">
                    Access <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </span>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12 bg-space-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-orbitron font-bold neon-text mb-4">NEO⚡GRAVITY</h2>
          <p className="text-gray-500 font-rajdhani text-lg">College Final-Year Project.</p>
          <div className="flex space-x-4 mt-6">
            <span className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:neon-border cursor-pointer transition">GH</span>
            <span className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:neon-border cursor-pointer transition">IN</span>
            <span className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:neon-border cursor-pointer transition">TW</span>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
};
export default Home;
