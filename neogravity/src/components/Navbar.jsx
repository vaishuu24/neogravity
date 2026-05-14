/**
 * Main navigation bar.
 */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Simulator', path: '/simulator' },
    { name: 'Game', path: '/game' },
    { name: 'AI Lab', path: '/ai-lab' },
    { name: 'Physics', path: '/physics' },
    { name: 'Team', path: '/team' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-card border-b border-white/10' : 'bg-transparent'} p-4`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-orbitron font-bold neon-text">
          NEO⚡GRAVITY
        </NavLink>
        
        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `font-rajdhani text-lg font-medium transition-all duration-300 hover:text-neon-cyan ${isActive ? 'text-neon-cyan border-b-2 border-neon-cyan neon-text' : 'text-white'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden text-white hover:text-neon-cyan focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-card border-t border-white/10 p-4 flex flex-col space-y-4">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block font-rajdhani text-lg font-medium transition-all ${isActive ? 'text-neon-cyan' : 'text-white'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
