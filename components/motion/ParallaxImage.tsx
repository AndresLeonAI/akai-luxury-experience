import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ParallaxImageProps {
    src: string;
    alt?: string;
    parallaxStrength?: number;  // 0-1, how much parallax effect (default 0.1)
    zoomDuration?: number;      // Duration in seconds for zoom cycle
    zoomAmount?: number;        // 1.0 = no zoom, 1.1 = 10% zoom
    className?: string;
    overlayClassName?: string;
}

/**
 * ParallaxImage Component - Scroll-linked parallax with ultra-slow zoom
 * Creates cinematic depth effect for hero sections
 * Completely disabled with prefers-reduced-motion
 */
const ParallaxImage: React.FC<ParallaxImageProps> = ({
    src,
    alt = '',
    parallaxStrength = 0.1,
    zoomDuration = 30,
    zoomAmount = 1.05,
    className = '',
    overlayClassName = '',
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const prefersReduced = useReducedMotion();

    // Scroll-based parallax
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // Transform scroll progress to Y translation
    const yRaw = useTransform(
        scrollYProgress,
        [0, 1],
        prefersReduced ? [0, 0] : [-50 * parallaxStrength, 50 * parallaxStrength]
    );

    // Smooth the parallax
    const y = useSpring(yRaw, { stiffness: 100, damping: 30, mass: 0.5 });

    // Scale transform (continuous zoom)
    const scale = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        prefersReduced ? [1, 1, 1] : [1, zoomAmount, 1]
    );

    const smoothScale = useSpring(scale, { stiffness: 50, damping: 30 });

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div
                className="absolute inset-0 w-full h-full"
                style={{
                    y: prefersReduced ? 0 : y,
                    scale: prefersReduced ? 1 : smoothScale,
                }}
            >
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${src}')` }}
                    role="img"
                    aria-label={alt}
                />
            </motion.div>
            {overlayClassName && (
                <div className={`absolute inset-0 ${overlayClassName}`} />
            )}
        </div>
    );
};

export default ParallaxImage;
