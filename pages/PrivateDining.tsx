import React from 'react';
import { motion } from 'framer-motion';
import { Reveal, LineDraw, ParallaxImage } from '../components/motion';
import { EASING } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const PrivateDining: React.FC = () => {
   const prefersReduced = useReducedMotion();

   return (
      <div className="bg-akai-black text-white">
         {/* Hero */}
         <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
               <ParallaxImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqNLJNurLHhS1NgLVFtJya1gG_8ggtH8ktcJZ7e0MPrVbZSepzUmd45x51S3TyiQiYC3ym_vMKwKjKKVSh9V61zN7jQBYakM2Uu9KqRwIwW6YqvjIpVT6ErepFtVYhiRl3Pf3u2IxP80tDHHiWd231-xgtmKHSctnh-VoFALNBkaEiC4sLaVtDpjkYCT3mpGMe4ckTo_ocf6bpxgHiwTjJxsGN32VjlWXdzlIMx9pmqZ6voo-UEDTxmeGe6a_MsRSUYMgWRm-itjAK"
                  alt="Private Dining"
                  className="w-full h-full opacity-60"
                  parallaxStrength={0.1}
                  zoomAmount={1.04}
                  overlayClassName="bg-black/50"
               />
            </div>
            <div className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center gap-10 mt-12">
               <Reveal delay={0}>
                  <div className="flex flex-col items-center gap-6">
                     <div className="flex items-center gap-4 mb-2 opacity-80">
                        <LineDraw width={32} color="#A81C1C" />
                        <span className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">Acceso Exclusivo</span>
                        <LineDraw width={32} color="#A81C1C" />
                     </div>
                     <h2 className="text-5xl md:text-8xl font-serif font-light text-white tracking-tight leading-[0.9]">
                        SANTUARIO <br /> <span className="italic font-normal">PRIVADO</span>
                     </h2>
                     <p className="text-akai-muted text-lg md:text-xl font-light max-w-lg leading-relaxed mt-4 font-serif italic text-white/80">
                        "Laca roja sobre tinta negra"
                     </p>
                  </div>
               </Reveal>
            </div>
         </section>

         {/* Content */}
         <section className="py-32 px-6 md:px-12 bg-akai-black">
            <div className="max-w-[1440px] mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
                  <div className="flex flex-col justify-between order-2 lg:order-1 h-full">
                     <div>
                        <Reveal delay={0}>
                           <h3 className="text-4xl md:text-5xl font-serif text-white italic mb-10">Inicie la Conversación</h3>
                        </Reveal>
                        <Reveal delay={0.1}>
                           <p className="text-akai-muted font-light leading-relaxed mb-16 max-w-sm text-sm">
                              Nuestro equipo de eventos dedicado curará cada aspecto de su velada. Por favor, permita hasta 24 horas para una respuesta.
                           </p>
                        </Reveal>
                        <Reveal delay={0.2}>
                           <div className="space-y-8">
                              <div className="flex flex-col gap-1">
                                 <span className="text-[10px] uppercase tracking-widest text-akai-muted">Correo</span>
                                 <span className="text-sm tracking-wide text-white font-light">privado@akai-kaiseki.com</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                 <span className="text-[10px] uppercase tracking-widest text-akai-muted">Teléfono</span>
                                 <span className="text-sm tracking-wide text-white font-light">+34 91 123 45 67</span>
                              </div>
                           </div>
                        </Reveal>
                     </div>
                     <Reveal delay={0.3} className="mt-16 lg:mt-0 relative group">
                        <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/5 z-10 pointer-events-none" />
                        <motion.img
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVfU9idnXH0cvP-hgGnXpgc8xlLINUDgsqeCaF4GtVl_fN_1zGm2r92rd5hl5xBddILUs5wLNOHG9eubsijf9H1OvGUEKxy6eJntbMivadV32gJ45-cHdRYMTE_wWMHYLbzhF-DhTPxXJE_Wu2FTnN8Rm6x9Nv0ZMMON30zJ4ZDy6_d4sydy8-xGC3UNTGMC9CoipYjFbyPjR-Ak5E0QCxU9xO2Kksmj_bAWOkWyNzQrn_0Tbkw-0P_7SizWJMItn7ACuT9-CVTzWd"
                           alt="Abstract texture"
                           className={`w-full h-80 object-cover filter brightness-[0.4] ${prefersReduced ? '' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000 ease-in-out`}
                           whileHover={prefersReduced ? {} : { scale: 1.02 }}
                           transition={{ duration: 1, ease: EASING.luxury }}
                        />
                     </Reveal>
                  </div>

                  <Reveal delay={0.15} className="bg-akai-card/50 p-8 md:p-16 border border-white/5 order-1 lg:order-2 self-center">
                     <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="group relative z-0 w-full mb-2">
                              <input
                                 type="text"
                                 name="name"
                                 id="name"
                                 className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b border-akai-border appearance-none focus:outline-none focus:ring-0 focus:border-akai-red peer transition-colors duration-300"
                                 placeholder=" "
                                 required
                              />
                              <label
                                 htmlFor="name"
                                 className="peer-focus:font-medium absolute text-sm text-akai-muted duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-akai-red peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 uppercase tracking-widest text-[10px]"
                              >
                                 Nombre Completo
                              </label>
                           </div>
                           <div className="group relative z-0 w-full mb-2">
                              <input
                                 type="email"
                                 name="email"
                                 id="email"
                                 className="block py-3 px-0 w-full text-sm text-white bg-transparent border-0 border-b border-akai-border appearance-none focus:outline-none focus:ring-0 focus:border-akai-red peer transition-colors duration-300"
                                 placeholder=" "
                                 required
                              />
                              <label
                                 htmlFor="email"
                                 className="peer-focus:font-medium absolute text-sm text-akai-muted duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-akai-red peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 uppercase tracking-widest text-[10px]"
                              >
                                 Correo Electrónico
                              </label>
                           </div>
                        </div>
                        <motion.button
                           className="mt-6 self-start px-0 py-2 bg-transparent text-white hover:text-akai-red transition-all duration-300 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-4 group"
                           type="button"
                           whileHover={prefersReduced ? {} : { x: 4 }}
                           transition={{ duration: 0.3, ease: EASING.luxury }}
                        >
                           Enviar Solicitud
                           <motion.div
                              className="w-8 h-[1px] bg-white group-hover:bg-akai-red group-hover:w-12 transition-all duration-300"
                           />
                        </motion.button>
                     </form>
                  </Reveal>
               </div>
            </div>
         </section>
      </div>
   );
};

export default PrivateDining;
