import React from 'react';
import { motion, useInView } from 'framer-motion';
import { revealVariants, DURATION, EASING } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RevealProps {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
    delay?: number;
    y?: number;
    blur?: number;
    once?: boolean;
    amount?: number;
    className?: string;
}

/**
 * Reveal Component - Viewport-triggered reveal animation
 * Wraps content with elegant fade+blur+translate reveal
 * Respects prefers-reduced-motion
 */
const Reveal: React.FC<RevealProps> = ({
    children,
    as = 'div',
    delay = 0,
    y = 24,
    blur = 4,
    once = true,
    amount = 0.3,
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
            custom={{ y, blur }}
            variants={{
                hidden: {
                    opacity: 0,
                    y: y,
                    filter: `blur(${blur}px)`,
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: {
                        duration: DURATION.default,
                        ease: EASING.luxury,
                        delay,
                    },
                },
            }}
        >
            {children}
        </MotionComponent>
    );
};

export default Reveal;
