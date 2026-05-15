/**
 * Reusable wrapper with glassmorphism styles and neon border glow.
 */
import React from 'react';

const GlowCard = ({ children, className = '', ...props }) => {
  return (
    <div className={`glass-card p-6 transition-all duration-300 hover:neon-border ${className}`} {...props}>
      {children}
    </div>
  );
};

export default GlowCard;
