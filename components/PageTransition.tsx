import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASING, DURATION, pageVariants } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition Component - Lacquer Wipe Effect
 * On route change: red panel wipes across screen, then reveals new page
 * Respects prefers-reduced-motion (falls back to simple fade)
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const prefersReduced = useReducedMotion();
  const [showWipe, setShowWipe] = useState(true);

  useEffect(() => {
    // Start revealing content after wipe animation
    const timer = setTimeout(() => {
      setShowWipe(false);
    }, prefersReduced ? 100 : 500);

    return () => clearTimeout(timer);
  }, [prefersReduced]);

  // Reduced motion: simple fade
  if (prefersReduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <>
      {/* Lacquer Wipe Overlay */}
      <AnimatePresence>
        {showWipe && (
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transition: { duration: 0.45, ease: EASING.sharp, originY: 0 } }}
            style={{
              originY: 1,
              background: 'linear-gradient(to top, #7f1d1d 0%, #A81C1C 50%, #D91C1C 100%)',
            }}
            transition={{
              duration: 0.55,
              ease: EASING.luxury,
            }}
          >
            {/* Subtle top edge blur/glow */}
            <div
              className="absolute top-0 left-0 right-0 h-8"
              style={{
                background: 'linear-gradient(to bottom, rgba(217, 28, 28, 0.5), transparent)',
                filter: 'blur(8px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.div
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;