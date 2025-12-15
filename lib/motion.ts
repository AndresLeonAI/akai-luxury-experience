/**
 * AKAI Motion System - Single source of truth for all motion
 * Luxury, cinematic, editorial motion language
 */

// ============================================
// EASING CURVES
// ============================================
export const EASING = {
  luxury: [0.16, 1, 0.3, 1] as const,    // Signature AKAI ease - smooth deceleration
  sharp: [0.22, 1, 0.36, 1] as const,    // Quick start, elegant finish
  smooth: [0.33, 1, 0.68, 1] as const,   // Gentle throughout
  out: [0, 0, 0.2, 1] as const,          // Ease out only
} as const;

// ============================================
// DURATION PRESETS
// ============================================
export const DURATION = {
  fast: 0.3,
  default: 0.6,
  slow: 0.9,
  scene: 1.5,
  glacial: 2.5,
  ultraSlow: 30,  // For background zoom effects
} as const;

// ============================================
// DELAY PRESETS  
// ============================================
export const DELAY = {
  stagger: 0.08,
  staggerSlow: 0.15,
  page: 0.2,
  section: 0.4,
} as const;

// ============================================
// MOTION VARIANTS
// ============================================

// Reveal variant - used for viewport-triggered reveals
export const revealVariants = {
  hidden: (custom: { y?: number; blur?: number } = {}) => ({
    opacity: 0,
    y: custom.y ?? 24,
    filter: `blur(${custom.blur ?? 4}px)`,
  }),
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: DURATION.default,
      ease: EASING.luxury,
    },
  },
};

// Fade with blur - simpler variant
export const fadeBlur = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: DURATION.default,
      ease: EASING.luxury,
    },
  },
};

// Stagger container - wraps staggered children
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: (custom: { stagger?: number; delay?: number } = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger ?? DELAY.stagger,
      delayChildren: custom.delay ?? 0,
    },
  }),
};

// Stagger item - children of stagger container
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.default,
      ease: EASING.luxury,
    },
  },
};

// Line draw variant for SVG lines
export const lineDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: DURATION.slow, ease: EASING.luxury },
      opacity: { duration: DURATION.fast },
    },
  },
};

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
    filter: 'blur(4px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: DURATION.default,
      ease: EASING.luxury,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: {
      duration: DURATION.fast,
      ease: EASING.luxury,
    },
  },
};

// Lacquer wipe transition
export const lacquerWipe = {
  initial: { scaleY: 0 },
  enter: {
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: EASING.luxury,
    },
  },
  exit: {
    scaleY: 0,
    transition: {
      duration: 0.4,
      ease: EASING.sharp,
    },
  },
};

// Scale with fade - for stamps/monograms
export const stampReveal = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.luxury,
    },
  },
};

// Magnetic button helper values
export const MAGNETIC_STRENGTH = 0.15;
export const MAGNETIC_RADIUS = 100;
