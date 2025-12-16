import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASING, DURATION } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface DatePickerProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
    availabilityByDate?: Record<string, 'available' | 'limited' | 'unavailable'>;
}

/**
 * Returns availability for a given date
 * Deterministic: even days available, weekends limited (Sat available, Sun closed)
 * Past dates unavailable
 */
const getAvailability = (date: Date, today: Date): 'available' | 'limited' | 'unavailable' => {
    // Past dates
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        return 'unavailable';
    }

    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    // Sunday closed
    if (dayOfWeek === 0) return 'unavailable';

    // Saturday limited
    if (dayOfWeek === 6) return 'limited';

    // Even days available, odd days limited
    return dayOfMonth % 2 === 0 ? 'available' : 'limited';
};

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * DatePicker Component - Dynamic calendar for reservations
 * Shows current month + 2 future months
 * Elegant styling with AKAI design tokens
 */
const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect, availabilityByDate }) => {
    const today = useMemo(() => new Date(), []);
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const prefersReduced = useReducedMotion();

    // Calculate month range (current + 2 months)
    const maxMonthOffset = 2;
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + maxMonthOffset + 1, 0);

    const canGoBack = () => {
        return viewYear > minDate.getFullYear() ||
            (viewYear === minDate.getFullYear() && viewMonth > minDate.getMonth());
    };

    const canGoForward = () => {
        const currentViewDate = new Date(viewYear, viewMonth);
        const maxViewDate = new Date(maxDate.getFullYear(), maxDate.getMonth());
        return currentViewDate < maxViewDate;
    };

    const goToPrevMonth = () => {
        if (!canGoBack()) return;
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (!canGoForward()) return;
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    // Generate calendar days for current view
    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
        const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);
        const startDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = lastDayOfMonth.getDate();

        const days: (Date | null)[] = [];

        // Empty cells for days before month starts
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(viewYear, viewMonth, day));
        }

        return days;
    }, [viewMonth, viewYear]);

    const isSelected = (date: Date | null) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const toIsoDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    return (
        <div className="w-full max-w-2xl select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <motion.div
                    className="font-serif text-3xl text-white"
                    key={`${viewMonth}-${viewYear}`}
                    initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: EASING.luxury }}
                >
                    {MONTH_NAMES[viewMonth]} <span className="text-white/20 text-lg font-sans tracking-widest ml-2">{viewYear}</span>
                </motion.div>
                <div className="flex gap-1">
                    <button
                        onClick={goToPrevMonth}
                        disabled={!canGoBack()}
                        className="w-12 h-12 flex items-center justify-center hover:bg-white/5 text-white/50 hover:text-white transition-all rounded-sm disabled:opacity-20 disabled:cursor-not-allowed"
                        aria-label="Mes anterior"
                    >
                        <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    <button
                        onClick={goToNextMonth}
                        disabled={!canGoForward()}
                        className="w-12 h-12 flex items-center justify-center hover:bg-white/5 text-white/50 hover:text-white transition-all rounded-sm disabled:opacity-20 disabled:cursor-not-allowed"
                        aria-label="Mes siguiente"
                    >
                        <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Day names header */}
            <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map(day => (
                    <div key={day} className="text-center text-[9px] text-white/20 uppercase tracking-[0.2em] py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5">
                <AnimatePresence mode="wait">
                    {calendarDays.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} className="aspect-square bg-akai-black" />;
                        }

                        const isoDate = toIsoDate(date);
                        const availability = availabilityByDate?.[isoDate] ?? getAvailability(date, today);
                        const selected = isSelected(date);
                        const isDisabled = availability === 'unavailable';

                        return (
                            <motion.button
                                key={date.toISOString()}
                                onClick={() => !isDisabled && onDateSelect(date)}
                                disabled={isDisabled}
                                className={`
                  aspect-square bg-akai-black flex items-center justify-center relative transition-all duration-300
                  ${isDisabled ? 'cursor-not-allowed opacity-30' : 'hover:bg-white/5 cursor-pointer'}
                  ${selected ? 'bg-akai-red-bright shadow-[0_0_25px_-5px_rgba(185,28,28,0.4)] z-10' : ''}
                `}
                                whileHover={!isDisabled && !prefersReduced ? { scale: 1.05 } : {}}
                                whileTap={!isDisabled && !prefersReduced ? { scale: 0.95 } : {}}
                            >
                                <span className={`
                  text-sm font-medium transition-colors
                  ${selected ? 'text-white font-serif text-lg' : 'text-white/80'}
                  ${!isDisabled && !selected ? 'group-hover:text-akai-red-bright' : ''}
                `}>
                                    {date.getDate()}
                                </span>

                                {/* Availability indicator */}
                                {availability === 'limited' && !selected && (
                                    <span className="absolute bottom-2 left-0 right-0 flex justify-center">
                                        <span className="w-0.5 h-0.5 bg-yellow-500/60 rounded-full" />
                                    </span>
                                )}

                                {selected && (
                                    <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-white rounded-full" />
                                )}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 text-[9px] text-white/30 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-akai-red-bright rounded-sm" />
                    <span>Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500/60 rounded-full" />
                    <span>Disponibilidad limitada</span>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;
