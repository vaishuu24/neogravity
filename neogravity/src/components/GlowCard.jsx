/**
 * Reusable wrapper with glassmorphism styles and neon border glow.
 */
import React from 'react';

const GlowCard = ({ children, className = '', onClick, ...props }) => {
  const isClickable = Boolean(onClick);
  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      className={`glass-card p-6 transition-all duration-300 hover:neon-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlowCard;
