import React from 'react';
import { motion, useInView } from 'framer-motion';
import { lineDraw, DURATION, EASING } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface LineDrawProps {
    width?: number | string;
    height?: number;
    className?: string;
    delay?: number;
    color?: string;
}

/**
 * LineDraw Component - SVG horizontal line that draws itself on viewport entry
 * Creates elegant separator/divider effect
 * Respects prefers-reduced-motion
 */
const LineDraw: React.FC<LineDrawProps> = ({
    width = '100%',
    height = 1,
    className = '',
    delay = 0,
    color = 'currentColor',
}) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const prefersReduced = useReducedMotion();

    const lineWidth = typeof width === 'number' ? width : 100;
    const viewBoxWidth = typeof width === 'number' ? width : 100;

    return (
        <svg
            ref={ref}
            width={width}
            height={height}
            viewBox={`0 0 ${viewBoxWidth} ${height}`}
            fill="none"
            className={className}
            preserveAspectRatio="none"
        >
            <motion.line
                x1="0"
                y1={height / 2}
                x2={viewBoxWidth}
                y2={height / 2}
                stroke={color}
                strokeWidth={height}
                initial={{ pathLength: 0, opacity: prefersReduced ? 1 : 0 }}
                animate={
                    isInView
                        ? { pathLength: 1, opacity: 1 }
                        : { pathLength: 0, opacity: prefersReduced ? 1 : 0 }
                }
                transition={{
                    pathLength: {
                        duration: prefersReduced ? 0 : DURATION.slow,
                        ease: EASING.luxury,
                        delay: prefersReduced ? 0 : delay,
                    },
                    opacity: {
                        duration: prefersReduced ? 0.1 : DURATION.fast,
                        delay: prefersReduced ? 0 : delay,
                    },
                }}
            />
        </svg>
    );
};

export default LineDraw;
