import React from 'react';
import { motion, useInView } from 'framer-motion';
import { staggerContainer, staggerItem, DELAY } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StaggerProps {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
    delay?: number;
    stagger?: number;
    once?: boolean;
    amount?: number;
    className?: string;
}

/**
 * Stagger Component - Container for staggered child animations
 * Children should be direct children and will animate in sequence
 * Respects prefers-reduced-motion
 */
const Stagger: React.FC<StaggerProps> = ({
    children,
    as = 'div',
    delay = 0,
    stagger = DELAY.stagger,
    once = true,
    amount = 0.2,
    className = '',
}) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once, amount });
    const prefersReduced = useReducedMotion();

    const MotionComponent = motion[as as keyof typeof motion] as any;

    // Reduced motion: instant reveal
    if (prefersReduced) {
        return (
            <MotionComponent
                ref={ref}
                className={className}
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </MotionComponent>
        );
    }

    return (
        <MotionComponent
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={{ stagger, delay }}
            variants={staggerContainer}
        >
            {children}
        </MotionComponent>
    );
};

export default Stagger;

/**
 * StaggerItem - Wrap individual items inside Stagger container
 */
export const StaggerItem: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <motion.div className={className} variants={staggerItem}>
            {children}
        </motion.div>
    );
};
