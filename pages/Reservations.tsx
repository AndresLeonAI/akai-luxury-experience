import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, LineDraw } from '../components/motion';
import {
  DatePicker,
  TimeSlotGrid,
  SeatCounter,
  DepositSummaryCard,
  ReservationStepper,
  WaitlistModal,
} from '../components/reservations';
import { EASING, DURATION } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);

  // Reservation data
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');

  // Waitlist modal
  const [showWaitlist, setShowWaitlist] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Simulate checking availability - Sundays show waitlist
    if (date.getDay() === 0) {
      setShowWaitlist(true);
    } else {
      // Auto-advance to step 2 after date selection
      setTimeout(() => setCurrentStep(2), 400);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (currentStep === 1 && selectedDate) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedTime) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      navigate('/confirmation');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canContinue = () => {
    if (currentStep === 1) return !!selectedDate;
    if (currentStep === 2) return !!selectedTime;
    if (currentStep === 3) return true;
    return false;
  };

  const formatDate = (d: Date) => {
    return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
  };

  const getDayName = (d: Date) => {
    return DAY_NAMES[d.getDay()].toUpperCase();
  };

  // Step content animations
  const stepVariants = {
    initial: { opacity: 0, x: prefersReduced ? 0 : 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: prefersReduced ? 0 : -30 },
  };

  return (
    <div className="min-h-screen bg-akai-black text-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Stepper */}
        <ReservationStepper
          currentStep={currentStep}
          onStepClick={(step) => step < currentStep && setCurrentStep(step)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column - Steps */}
          <div className="lg:col-span-7 flex flex-col pt-10">
            <AnimatePresence mode="wait">
              {/* Step 1: Date Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: EASING.luxury }}
                >
                  <div className="mb-16 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-akai-red-bright text-[10px] tracking-[0.3em] uppercase font-bold">
                        Paso 01
                      </span>
                      <LineDraw width={48} color="rgba(255,255,255,0.1)" />
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white font-normal">
                      Seleccione su <br />
                      <span className="text-akai-red-bright italic pr-4">fecha</span>
                    </h1>
                    <p className="max-w-lg text-white/40 font-light text-sm leading-relaxed pt-6 tracking-wide">
                      Debido a la naturaleza ceremonial de nuestra experiencia, las mesas son limitadas a 8 comensales por noche.
                    </p>
                  </div>

                  <DatePicker
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                  />
                </motion.div>
              )}

              {/* Step 2: Time & Guests */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: EASING.luxury }}
                >
                  <div className="mb-16 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-akai-red-bright text-[10px] tracking-[0.3em] uppercase font-bold">
                        Paso 02
                      </span>
                      <LineDraw width={48} color="rgba(255,255,255,0.1)" />
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white font-normal">
                      Configure su <br />
                      <span className="text-akai-red-bright italic pr-4">experiencia</span>
                    </h1>
                  </div>

                  <div className="space-y-12">
                    {/* Time Selection */}
                    <div className="space-y-6">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
                        Horario de Servicio
                      </label>
                      <TimeSlotGrid
                        selectedTime={selectedTime}
                        onTimeSelect={handleTimeSelect}
                        date={selectedDate}
                      />
                    </div>

                    {/* Guest Counter */}
                    <SeatCounter
                      value={guests}
                      min={1}
                      max={8}
                      onChange={setGuests}
                    />

                    {/* Notes */}
                    <div className="space-y-6">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
                        Preferencias & Alergias
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-akai-black border border-white/10 p-5 text-sm text-white focus:border-akai-red-bright focus:ring-1 focus:ring-akai-red-bright transition-all duration-300 h-32 resize-none placeholder-white/10 font-light leading-relaxed rounded-sm"
                        placeholder="Indique cualquier restricción dietética severa..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: EASING.luxury }}
                >
                  <div className="mb-16 relative">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-akai-red-bright text-[10px] tracking-[0.3em] uppercase font-bold">
                        Paso 03
                      </span>
                      <LineDraw width={48} color="rgba(255,255,255,0.1)" />
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white font-normal">
                      Confirme su <br />
                      <span className="text-akai-red-bright italic pr-4">reserva</span>
                    </h1>
                    <p className="max-w-lg text-white/40 font-light text-sm leading-relaxed pt-6 tracking-wide">
                      Revise los detalles de su experiencia antes de proceder al pago del depósito.
                    </p>
                  </div>

                  <DepositSummaryCard
                    date={selectedDate}
                    time={selectedTime}
                    guests={guests}
                    pricePerPerson={180}
                    depositPercentage={0.5}
                  />

                  {notes && (
                    <div className="mt-8 p-6 border border-white/5 bg-akai-card/50">
                      <span className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">
                        Notas Especiales
                      </span>
                      <p className="text-sm text-white/60 font-light">{notes}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="lg:col-span-5 relative pt-10">
            <div className="flex flex-col h-full pl-0 lg:pl-4">
              {/* Sticky Summary */}
              <div className="lg:sticky lg:top-32">
                {/* Selected Date Display */}
                {selectedDate && (
                  <Reveal className="mb-14 pb-6 border-b border-white/5">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.3em] text-akai-red-bright font-bold mb-2">
                          Fecha Seleccionada
                        </div>
                        <h2 className="text-4xl font-serif text-white">
                          {formatDate(selectedDate)}
                        </h2>
                      </div>
                      <span className="text-white/30 font-light text-sm tracking-widest pb-1">
                        {getDayName(selectedDate)}
                      </span>
                    </div>
                  </Reveal>
                )}

                {/* Quick Summary for Steps 2-3 */}
                {currentStep >= 2 && selectedTime && (
                  <Reveal className="mb-8 pb-6 border-b border-white/5" delay={0.1}>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <span className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
                          Hora
                        </span>
                        <span className="text-xl font-serif text-white">{selectedTime}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
                          Comensales
                        </span>
                        <span className="text-xl font-serif text-white">{guests}</span>
                      </div>
                    </div>
                  </Reveal>
                )}

                {/* Navigation Buttons */}
                <div className="space-y-4 mt-16">
                  {/* Back Button */}
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      className="w-full border border-white/10 text-white h-14 flex items-center justify-center px-8 group hover:border-white/30 transition-all duration-300"
                    >
                      <span className="material-symbols-outlined text-xl mr-3 transform group-hover:-translate-x-1 transition-transform duration-300">
                        arrow_back
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] font-bold">Volver</span>
                    </button>
                  )}

                  {/* Continue/Confirm Button */}
                  <button
                    onClick={handleContinue}
                    disabled={!canContinue()}
                    className={`
                      w-full bg-akai-red-bright text-white h-16 flex items-center justify-between px-8 group 
                      hover:bg-akai-red-dark transition-all duration-500 rounded-sm 
                      shadow-[0_10px_40px_-15px_rgba(185,28,28,0.4)] relative overflow-hidden
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-akai-red-bright
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="text-xs uppercase tracking-[0.2em] font-bold relative z-10">
                      {currentStep === 3 ? 'Proceder al Pago' : 'Continuar'}
                    </span>
                    <span className="material-symbols-outlined text-xl transform group-hover:translate-x-2 transition-transform duration-300 relative z-10">
                      arrow_right_alt
                    </span>
                  </button>

                  {/* Deposit note */}
                  <p className="mt-4 text-[9px] text-center text-white/20 font-light tracking-[0.05em]">
                    Depósito de garantía: $90 USD por persona (50%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        date={selectedDate}
      />
    </div>
  );
};

export default Reservations;
