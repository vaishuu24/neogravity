/**
 * Canvas particle background spanning full screen.
 */
import React from 'react';
import { useParticles } from '../hooks/useParticles';

const ParticleBackground = () => {
  const canvasRef = useParticles();

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
    />
  );
};

export default ParticleBackground;
