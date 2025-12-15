import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Hook for detecting prefers-reduced-motion system setting
 * Returns true if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
    return useFramerReducedMotion() ?? false;
}

/**
 * Helper to conditionally return motion-safe values
 */
export function useMotionSafe<T>(motionValue: T, reducedValue: T): T {
    const prefersReduced = useReducedMotion();
    return prefersReduced ? reducedValue : motionValue;
}
