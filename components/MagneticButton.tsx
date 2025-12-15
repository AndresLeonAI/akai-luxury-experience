import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EASING, DURATION, MAGNETIC_STRENGTH_VAL, MAGNETIC_RADIUS_VAL } from '../lib/motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
}

const MAGNETIC_STRENGTH = 0.15;
const MAGNETIC_RADIUS = 100;

/**
 * MagneticButton Component - Button with subtle magnetic cursor attraction
 * Creates premium interactive feel
 * Disabled with prefers-reduced-motion
 */
const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
    onClick,
    href,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReduced = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    // Sheen effect position
    const sheenX = useMotionValue(0);
    const sheenSpring = useSpring(sheenX, { stiffness: 100, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (prefersReduced || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        x.set(distX * MAGNETIC_STRENGTH);
        y.set(distY * MAGNETIC_STRENGTH);
        sheenX.set((distX / rect.width) * 100);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        sheenX.set(0);
    };

    const Component = href ? motion.a : motion.button;
    const props = href ? { href } : { onClick };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                x: prefersReduced ? 0 : xSpring,
                y: prefersReduced ? 0 : ySpring,
            }}
            className="inline-block"
        >
            <Component
                {...props}
                className={`relative overflow-hidden ${className}`}
            >
                {children}
                {/* Sheen overlay */}
                {!prefersReduced && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)`,
                            x: useTransform(sheenSpring, [-50, 50], ['-100%', '100%']),
                        }}
                    />
                )}
            </Component>
        </motion.div>
    );
};

export default MagneticButton;
