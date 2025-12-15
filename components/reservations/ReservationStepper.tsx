import React from 'react';
import { motion } from 'framer-motion';
import { EASING } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Step {
    number: number;
    label: string;
}

interface ReservationStepperProps {
    currentStep: number;
    onStepClick?: (step: number) => void;
}

const STEPS: Step[] = [
    { number: 1, label: 'Fecha' },
    { number: 2, label: 'Detalles' },
    { number: 3, label: 'Confirmar' },
];

/**
 * ReservationStepper Component - 3-step progress indicator
 * Shows current position in reservation flow
 */
const ReservationStepper: React.FC<ReservationStepperProps> = ({
    currentStep,
    onStepClick,
}) => {
    const prefersReduced = useReducedMotion();

    return (
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
            {STEPS.map((step, index) => {
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;
                const isClickable = onStepClick && step.number < currentStep;

                return (
                    <React.Fragment key={step.number}>
                        <motion.button
                            onClick={() => isClickable && onStepClick(step.number)}
                            className={`
                flex items-center gap-3 group
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
              `}
                            whileHover={isClickable && !prefersReduced ? { scale: 1.02 } : {}}
                            disabled={!isClickable}
                        >
                            {/* Step number circle */}
                            <motion.div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  transition-all duration-500 border
                  ${isActive ? 'bg-akai-red border-akai-red text-white' : ''}
                  ${isCompleted ? 'bg-transparent border-akai-red/50 text-akai-red' : ''}
                  ${!isActive && !isCompleted ? 'bg-transparent border-white/10 text-white/30' : ''}
                `}
                                animate={isActive && !prefersReduced ? {
                                    boxShadow: ['0 0 0 0 rgba(168, 28, 28, 0)', '0 0 0 8px rgba(168, 28, 28, 0.1)', '0 0 0 0 rgba(168, 28, 28, 0)'],
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {isCompleted ? (
                                    <span className="material-symbols-outlined text-sm">check</span>
                                ) : (
                                    step.number
                                )}
                            </motion.div>

                            {/* Step label */}
                            <span className={`
                text-[10px] uppercase tracking-[0.15em] font-medium transition-colors hidden sm:block
                ${isActive ? 'text-white' : ''}
                ${isCompleted ? 'text-akai-red/70 group-hover:text-akai-red' : ''}
                ${!isActive && !isCompleted ? 'text-white/30' : ''}
              `}>
                                {step.label}
                            </span>
                        </motion.button>

                        {/* Connector line */}
                        {index < STEPS.length - 1 && (
                            <div className="relative h-[1px] w-8 md:w-16 bg-white/10">
                                <motion.div
                                    className="absolute inset-0 bg-akai-red origin-left"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: EASING.luxury }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ReservationStepper;
