import { EASING, DURATION, DELAY } from './tokens';

export const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 8,
    filter: 'blur(4px)'
  },
  enter: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: DURATION.medium,
      ease: EASING.luxury,
    }
  },
  exit: { 
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: {
      duration: DURATION.fast,
      ease: EASING.luxury,
    }
  }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay = 0) => ({ 
    opacity: 1, 
    y: 0,
    transition: {
      duration: DURATION.medium,
      ease: EASING.luxury,
      delay: customDelay
    }
  })
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: DELAY.stagger
    }
  }
};

export const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.luxury
    }
  }
};