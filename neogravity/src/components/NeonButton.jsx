/**
 * Reusable button with neon pulse animation.
 */
import React from 'react';
import { motion } from 'framer-motion';

const NeonButton = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  let baseColor = 'neon-cyan';
  let shadowColor = 'rgba(0, 245, 255, 0.5)';
  
  if (variant === 'secondary') {
    baseColor = 'neon-purple';
    shadowColor = 'rgba(168, 85, 247, 0.5)';
  } else if (variant === 'danger') {
    baseColor = 'red-500';
    shadowColor = 'rgba(239, 68, 68, 0.5)';
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
      className={`relative px-6 py-3 font-orbitron font-bold text-white uppercase tracking-wider overflow-hidden rounded-lg border border-${baseColor} bg-transparent transition-all hover:bg-${baseColor}/20 ${className}`}
      style={{ boxShadow: `0 0 10px ${shadowColor}, inset 0 0 5px ${shadowColor}` }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;
