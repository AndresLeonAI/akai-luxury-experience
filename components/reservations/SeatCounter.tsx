import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASING, DURATION } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SeatCounterProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
}

/**
 * SeatCounter Component - Animated guest counter
 * Uses Framer Motion number morphing for elegant transitions
 */
const SeatCounter: React.FC<SeatCounterProps> = ({
    value,
    min = 1,
    max = 8,
    onChange,
}) => {
    const prefersReduced = useReducedMotion();

    const increment = () => {
        if (value < max) onChange(value + 1);
    };

    const decrement = () => {
        if (value > min) onChange(value - 1);
    };

    return (
        <div className="space-y-6">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
                Comensales
            </label>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-2">
                <span className="text-white/50 text-xs font-light tracking-wide">
                    Cantidad de personas
                </span>
                <div className="flex items-center gap-8">
                    <motion.button
                        onClick={decrement}
                        disabled={value <= min}
                        className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        whileTap={!prefersReduced ? { scale: 0.9 } : {}}
                        aria-label="Reducir comensales"
                    >
                        <span className="material-symbols-outlined text-lg">remove</span>
                    </motion.button>

                    <div className="relative w-10 h-12 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key={value}
                                className="font-serif text-3xl text-white absolute"
                                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
                                transition={{ duration: 0.25, ease: EASING.luxury }}
                            >
                                {value}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    <motion.button
                        onClick={increment}
                        disabled={value >= max}
                        className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        whileTap={!prefersReduced ? { scale: 0.9 } : {}}
                        aria-label="Aumentar comensales"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                    </motion.button>
                </div>
            </div>
            <p className="text-[9px] text-white/20 text-right uppercase tracking-widest pt-1">
                Grupos {'>'} {max} contactar concierge
            </p>
        </div>
    );
};

export default SeatCounter;
