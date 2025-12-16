import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASING } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { apiJson } from '../../lib/api';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date | null;
}

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * WaitlistModal Component - UI for joining waitlist when no availability
 */
const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, date }) => {
    const prefersReduced = useReducedMotion();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toIsoDate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || submitting) return;
        setSubmitting(true);
        setError(null);

        try {
            await apiJson('/api/v1/waitlist', {
                method: 'POST',
                body: JSON.stringify({ date: toIsoDate(date), email }),
            });
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setEmail('');
                setError(null);
            }, 2000);
        } catch (_err) {
            setError('No pudimos registrarle en la lista. Intente de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (d: Date) => {
        return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-full max-w-md"
                        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: EASING.luxury }}
                    >
                        <div className="bg-akai-card border border-white/10 relative mx-4">
                            {/* Top accent */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-akai-red" />

                            <div className="p-8 md:p-10">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                    aria-label="Cerrar"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>

                                {!submitted ? (
                                    <>
                                        <div className="mb-8">
                                            <span className="block text-[10px] text-akai-red uppercase tracking-[0.2em] mb-3">
                                                Lista de Espera
                                            </span>
                                            <h3 className="text-2xl font-serif text-white mb-3">
                                                Sin disponibilidad
                                            </h3>
                                            {date && (
                                                <p className="text-white/50 text-sm">
                                                    Actualmente no hay mesas disponibles para el {formatDate(date)}.
                                                    Únase a nuestra lista de espera.
                                                </p>
                                            )}
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <label
                                                    htmlFor="waitlist-email"
                                                    className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2"
                                                >
                                                    Correo Electrónico
                                                </label>
                                                <input
                                                    type="email"
                                                    id="waitlist-email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="w-full bg-akai-black border border-white/10 p-4 text-sm text-white focus:border-akai-red focus:ring-1 focus:ring-akai-red transition-all duration-300 placeholder-white/20"
                                                    placeholder="su@correo.com"
                                                />
                                            </div>

                                            {error && (
                                                <div className="text-[10px] text-akai-red-bright tracking-wide">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-akai-red text-white h-12 flex items-center justify-center text-xs uppercase tracking-[0.2em] font-bold hover:bg-akai-red-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                {submitting ? 'Enviando…' : 'Unirse a Lista de Espera'}
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <motion.div
                                        className="text-center py-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <span className="material-symbols-outlined text-4xl text-akai-red mb-4 block">
                                            check_circle
                                        </span>
                                        <h3 className="text-xl font-serif text-white mb-2">Confirmado</h3>
                                        <p className="text-white/50 text-sm">
                                            Le notificaremos cuando haya disponibilidad.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WaitlistModal;
