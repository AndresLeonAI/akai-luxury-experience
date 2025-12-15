import React from 'react';
import { motion } from 'framer-motion';
import { EASING } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface DepositSummaryCardProps {
    date: Date | null;
    time: string | null;
    guests: number;
    pricePerPerson: number;
    depositPercentage: number;
}

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/**
 * DepositSummaryCard Component - Reservation summary with breakdown
 * Shows date, time, guests, total, and deposit amount
 */
const DepositSummaryCard: React.FC<DepositSummaryCardProps> = ({
    date,
    time,
    guests,
    pricePerPerson = 180,
    depositPercentage = 0.5,
}) => {
    const prefersReduced = useReducedMotion();

    const total = guests * pricePerPerson;
    const deposit = total * depositPercentage;

    const formatDate = (d: Date) => {
        return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
    };

    const getDayName = (d: Date) => {
        return DAY_NAMES[d.getDay()];
    };

    return (
        <motion.div
            className="bg-akai-card border border-white/5 relative"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASING.luxury }}
        >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-akai-red opacity-80" />

            <div className="p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                    <div>
                        <span className="block text-[9px] text-white/40 uppercase tracking-[0.25em] mb-1">
                            Resumen de Reserva
                        </span>
                        <span className="text-xl font-serif text-white">Omakase AKAI</span>
                    </div>
                    <div className="hanko-stamp transform -rotate-6 opacity-70 text-[10px]">
                        <span>確認</span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="group">
                        <span className="block text-[9px] text-white/40 uppercase tracking-[0.2em] mb-2 group-hover:text-akai-red transition-colors">
                            Fecha
                        </span>
                        {date ? (
                            <>
                                <span className="block text-2xl font-serif text-white">{formatDate(date)}</span>
                                <span className="block text-[10px] text-white/30 uppercase tracking-widest mt-1">
                                    {getDayName(date)}
                                </span>
                            </>
                        ) : (
                            <span className="block text-lg text-white/30">—</span>
                        )}
                    </div>

                    <div className="group">
                        <span className="block text-[9px] text-white/40 uppercase tracking-[0.2em] mb-2 group-hover:text-akai-red transition-colors">
                            Hora
                        </span>
                        {time ? (
                            <span className="block text-2xl font-serif text-white">{time}</span>
                        ) : (
                            <span className="block text-lg text-white/30">—</span>
                        )}
                    </div>

                    <div className="group">
                        <span className="block text-[9px] text-white/40 uppercase tracking-[0.2em] mb-2 group-hover:text-akai-red transition-colors">
                            Comensales
                        </span>
                        <span className="block text-2xl font-serif text-white">{guests}</span>
                    </div>

                    <div className="group">
                        <span className="block text-[9px] text-white/40 uppercase tracking-[0.2em] mb-2 group-hover:text-akai-red transition-colors">
                            Experiencia
                        </span>
                        <span className="block text-sm text-white/60">${pricePerPerson} / persona</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                {/* Totals */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/40 uppercase tracking-widest">Total</span>
                        <motion.span
                            className="text-lg font-serif text-white"
                            key={total}
                            initial={prefersReduced ? {} : { scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            ${total.toFixed(2)} USD
                        </motion.span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div>
                            <span className="block text-xs text-akai-red uppercase tracking-widest font-medium">
                                Depósito Requerido
                            </span>
                            <span className="block text-[9px] text-white/30 mt-1">
                                ({(depositPercentage * 100).toFixed(0)}% del total)
                            </span>
                        </div>
                        <motion.span
                            className="text-2xl font-serif text-akai-red-bright"
                            key={deposit}
                            initial={prefersReduced ? {} : { scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            ${deposit.toFixed(2)}
                        </motion.span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DepositSummaryCard;
