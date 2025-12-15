import React from 'react';

const Confirmation: React.FC = () => {
  return (
    <div className="min-h-screen bg-akai-black text-white flex flex-col pt-32 pb-20 px-6 relative">
       {/* Noise overlay effect */}
       <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-[0.04] mix-blend-overlay bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGuQ09yH-nVW-jjyDoYzloXMmcNI5GZwn_MrQLP_h0_p6imRsuS3Y5tHBvVFKTS8QJXWYexpjpMnCeWTRakiZrjzDDI48d7MvletvvOLt6ty96tmxL8WAR3DnlsSZA5t8BYiVxEzhRxrIiH3YpFpkZCkZ4zdQhjY_LyTs8w_ValT9ab9KE6DAHiF7rpYTKx1CEZiX2pLXVNZCEYe0_8FUrDzOxswkEFalKd1xtIhPiYV10IgqJgMe0lgdAQ0wdbHSNEL96Ltq3Yy-E')]"></div>

       <div className="flex-grow flex flex-col items-center justify-center">
         <div className="max-w-[1440px] w-full flex flex-col items-center">
            <div className="mb-6 flex flex-col items-center gap-3">
               <div className="h-12 w-[1px] bg-gradient-to-b from-transparent to-akai-red"></div>
               <span className="text-akai-red text-xs uppercase tracking-[0.25em] font-medium">Confirmación</span>
            </div>
            
            <div className="text-center mb-20 space-y-6">
               <h2 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">Su mesa le espera</h2>
               <p className="text-akai-muted text-sm font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                 Hemos preparado el escenario para su ceremonia. <br/>Bienvenido al silencio de AKAI.
               </p>
            </div>

            <div className="w-full max-w-[900px] bg-akai-card border-x border-b border-akai-border/50 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <div className="absolute top-0 left-0 w-full h-[2px] bg-akai-red opacity-80"></div>
               <div className="p-10 md:p-16">
                  <div className="flex justify-between items-start mb-16 relative">
                     <div className="space-y-2">
                        <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em]">Identificador</span>
                        <p className="text-lg font-sans text-white tracking-widest opacity-90">REF. JP-8821</p>
                     </div>
                     <div className="hanko-stamp transform -rotate-12 opacity-90">
                        <span>AKAI</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-x-12 mb-16">
                     <div className="md:col-span-1 group">
                        <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em] mb-4 group-hover:text-akai-red transition-colors duration-500">Fecha</span>
                        <div className="flex flex-col">
                           <span className="text-4xl font-serif text-white">24</span>
                           <span className="text-sm text-akai-muted uppercase tracking-widest mt-1">Noviembre</span>
                        </div>
                     </div>
                     <div className="md:col-span-1 group border-t md:border-t-0 md:border-l border-akai-border/50 pt-8 md:pt-0 md:pl-12">
                        <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em] mb-4 group-hover:text-akai-red transition-colors duration-500">Hora</span>
                        <div className="flex items-baseline gap-1">
                           <span className="text-4xl font-serif text-white">20:30</span>
                           <span className="text-xs text-akai-muted font-light">PM</span>
                        </div>
                     </div>
                     <div className="md:col-span-2 group border-t md:border-t-0 md:border-l border-akai-border/50 pt-8 md:pt-0 md:pl-12">
                        <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em] mb-4 group-hover:text-akai-red transition-colors duration-500">Experiencia</span>
                        <p className="text-2xl font-serif text-white italic mb-1">Omakase de Estación</p>
                        <p className="text-xs text-akai-muted">Barra Principal · 2 Personas</p>
                     </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-akai-border to-transparent mb-10 w-full opacity-50"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs text-akai-muted uppercase tracking-widest">Depósito Garantía</span>
                           <span className="text-sm text-white font-sans">$300.00 USD</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-xs text-akai-muted uppercase tracking-widest">Estado</span>
                           <span className="text-xs text-akai-red uppercase tracking-widest">Pagado</span>
                        </div>
                     </div>
                     <div className="flex flex-col md:items-end text-left md:text-right space-y-4">
                        <div>
                           <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em] mb-1">Ubicación</span>
                           <p className="text-sm text-white font-light">Calle de la Cruz 14, Madrid<br/><span className="text-akai-muted">Acceso Privado</span></p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-16 flex flex-col md:flex-row items-center gap-12">
               <button className="group relative px-6 py-3 overflow-hidden">
                  <span className="relative z-10 text-xs text-white uppercase tracking-[0.25em] group-hover:text-akai-red transition-colors duration-300">Añadir a Calendario</span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-akai-border group-hover:bg-akai-red transition-colors duration-300"></div>
               </button>
            </div>
         </div>
       </div>
    </div>
  );
};

export default Confirmation;
