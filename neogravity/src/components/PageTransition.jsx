/**
 * Wraps pages to provide entrance and exit animations.
 */
import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
