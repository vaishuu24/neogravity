/**
 * Reusable button with neon pulse animation.
 */
import React from 'react';
import { motion } from 'framer-motion';

const NeonButton = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const styles = {
    primary: {
      border: 'border-neon-cyan hover:bg-neon-cyan/20 text-white',
      shadow: '0 0 12px rgba(0, 245, 255, 0.5), inset 0 0 6px rgba(0, 245, 255, 0.4)',
    },
    secondary: {
      border: 'border-neon-purple hover:bg-neon-purple/20 text-white',
      shadow: '0 0 12px rgba(168, 85, 247, 0.5), inset 0 0 6px rgba(168, 85, 247, 0.4)',
    },
    danger: {
      border: 'border-red-500 hover:bg-red-500/20 text-white',
      shadow: '0 0 12px rgba(239, 68, 68, 0.5), inset 0 0 6px rgba(239, 68, 68, 0.4)',
    },
  };

  const current = styles[variant] || styles.primary;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.04, filter: 'brightness(1.2)' }}
      className={`relative px-6 py-3 font-orbitron font-bold uppercase tracking-wider overflow-hidden rounded-lg border bg-transparent transition-all duration-300 ${current.border} ${className}`}
      style={{ boxShadow: current.shadow }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;
