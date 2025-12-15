import React from 'react';
import { motion } from 'framer-motion';
import { EASING } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TimeSlot {
    time: string;
    label: string;
    available: boolean;
}

interface TimeSlotCardProps {
    slot: TimeSlot;
    selected: boolean;
    onSelect: () => void;
}

/**
 * TimeSlotCard Component - Individual time slot selection
 * Shows time with micro-label (Sunset/Late Night)
 */
const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ slot, selected, onSelect }) => {
    const prefersReduced = useReducedMotion();

    return (
        <motion.button
            onClick={onSelect}
            disabled={!slot.available}
            className={`
        group relative border py-5 px-6 text-left transition-all duration-300 bg-akai-black/50
        ${!slot.available ? 'opacity-30 cursor-not-allowed border-white/5' : ''}
        ${selected ? 'border-akai-red-bright shadow-[0_0_20px_-10px_rgba(185,28,28,0.3)]' : 'border-white/10 hover:border-white/30'}
      `}
            whileHover={slot.available && !prefersReduced ? { y: -2 } : {}}
            whileTap={slot.available && !prefersReduced ? { scale: 0.98 } : {}}
        >
            <span className={`
        block text-2xl font-serif mb-1 transition-colors
        ${selected ? 'text-akai-red-bright' : 'text-white group-hover:text-akai-red-bright'}
      `}>
                {slot.time}
            </span>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors">
                {slot.label}
            </span>

            {/* Selected corner triangle */}
            {selected && (
                <div className="absolute top-0 right-0 w-3 h-3">
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-akai-red-bright border-r-transparent" />
                </div>
            )}

            {/* Unavailable label */}
            {!slot.available && (
                <span className="absolute inset-0 flex items-center justify-center text-[9px] uppercase tracking-widest text-white/30">
                    Agotado
                </span>
            )}
        </motion.button>
    );
};

export default TimeSlotCard;

/**
 * TimeSlotGrid Component - Grid of time slots for selection
 */
interface TimeSlotGridProps {
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
    date: Date | null;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ selectedTime, onTimeSelect, date }) => {
    // Generate slots based on date (deterministic availability)
    const slots: TimeSlot[] = React.useMemo(() => {
        const baseSlots = [
            { time: '18:30', label: 'Early Evening', available: true },
            { time: '19:00', label: 'Sunset', available: true },
            { time: '20:00', label: 'Prime Time', available: true },
            { time: '21:30', label: 'Late Night', available: true },
        ];

        if (!date) return baseSlots;

        // Make some slots unavailable based on date
        const dayOfMonth = date.getDate();
        return baseSlots.map((slot, index) => ({
            ...slot,
            // Simple deterministic logic: last slot unavailable on odd days
            available: !(index === 3 && dayOfMonth % 2 === 1),
        }));
    }, [date]);

    return (
        <div className="grid grid-cols-2 gap-6">
            {slots.map((slot) => (
                <TimeSlotCard
                    key={slot.time}
                    slot={slot}
                    selected={selectedTime === slot.time}
                    onSelect={() => slot.available && onTimeSelect(slot.time)}
                />
            ))}
        </div>
    );
};
