import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal, ParallaxImage, LineDraw } from '../components/motion';
import MagneticButton from '../components/MagneticButton';
import GalleryNarrative from '../components/GalleryNarrative';
import { EASING, DURATION, stampReveal } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const Home: React.FC = () => {
  const prefersReduced = useReducedMotion();

  return (
    <div className="bg-akai-black overflow-hidden">
      {/* Hero Section */}
      <header className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGN7iAZR9xPp7H-gEQpA-RHQz2h4dKfQ7QCbDoBHaKt254E6iklNjQid9AanaVCrWZo6hNNo-AIphKeSS5A3zYMXBoRx05A3ZHxa1W8ZaSLhqdJhL6vZnFpK-SupCRXAq83EBi7wVO4v0kygqsaJ4waAmj0bZhlg8WWrg-mCSefGUNjdl4SyW1pLVhzatc4GGZ15hJwaWdlLi8bfAyaEJdTHb5JkjOgZWHmE2UaR_qyWwmPAx4XyBv79Mp64WQPMKobhp9KBvySzdz"
            alt="AKAI Interior"
            className="w-full h-full"
            parallaxStrength={0.15}
            zoomAmount={1.08}
            zoomDuration={30}
            overlayClassName="bg-gradient-to-b from-black/60 via-black/30 to-akai-black"
          />
        </div>

        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-6xl mx-auto mt-20">
          {/* Hanko Stamp with entrance animation */}
          <Reveal delay={0}>
            <motion.div
              className="mb-12"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: DURATION.slow,
                ease: EASING.luxury,
                delay: 0.3
              }}
            >
              <div className="hanko-stamp text-xs bg-black/20 backdrop-blur-sm border-akai-red/70">
                <span className="block">席</span>
                <span className="block">数</span>
                <span className="block">限</span>
                <span className="block">定</span>
              </div>
            </motion.div>
          </Reveal>

          {/* Main Title with reveal */}
          <Reveal delay={0.1} y={30} blur={6}>
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-serif text-white leading-[0.85] tracking-tight mb-8 select-none">
              AKAI
            </h1>
          </Reveal>

          {/* Tagline */}
          <Reveal delay={0.2} y={20}>
            <p className="text-lg md:text-xl text-akai-ivory/80 font-light tracking-widest mb-16 max-w-2xl font-serif italic">
              Silencio, precisión y laca roja.
            </p>
          </Reveal>

          {/* CTAs with magnetic effect */}
          <Reveal delay={0.35} y={16}>
            <div className="flex flex-col sm:flex-row gap-8">
              <MagneticButton>
                <Link
                  to="/reservations"
                  className="flex items-center justify-center h-14 px-12 bg-akai-red hover:bg-akai-red-dark text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 rounded-none shadow-[0_0_30px_rgba(168,28,28,0.2)] hover:shadow-[0_0_40px_rgba(168,28,28,0.4)]"
                >
                  Reservar Omakase
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/menu"
                  className="flex items-center justify-center h-14 px-12 border border-white/20 hover:border-white hover:bg-white/5 text-akai-ivory text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 rounded-none"
                >
                  Explorar Menú
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <Reveal delay={0.6} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-4 opacity-30">
            <motion.div
              className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"
              animate={prefersReduced ? {} : {
                opacity: [0.3, 0.6, 0.3],
                scaleY: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        </Reveal>
      </header>

      {/* Experience Section */}
      <section id="experience" className="relative py-32 md:py-40 bg-akai-black overflow-hidden">
        <div className="absolute top-20 right-0 w-[40%] h-[80%] bg-[#0a0a0a] -z-10"></div>
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-center">
            <div className="lg:col-span-5 flex flex-col gap-12">
              <Reveal delay={0}>
                <div>
                  <LineDraw width={32} height={1} color="#A81C1C" className="mb-6" />
                  <span className="text-akai-muted text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">La Experiencia</span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-none mb-8">
                    Laca roja sobre<br /><span className="text-akai-muted">tinta negra.</span>
                  </h2>
                  <p className="text-akai-muted leading-loose font-light text-base md:text-lg">
                    En un espacio donde la sombra define la luz, nuestra barra de madera hinoki es el altar de un ritual silencioso. Sin ruido, sin prisa. Solo el sonido del corte preciso y el sabor puro de ingredientes que han viajado desde las costas de Japón hasta Madrid.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-10">
                  <div className="flex flex-col gap-2">
                    <motion.span
                      className="text-4xl font-serif text-white font-light"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      12
                    </motion.span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-akai-muted">Asientos</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <motion.span
                      className="text-4xl font-serif text-white font-light"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      22
                    </motion.span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-akai-muted">Tiempos</span>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7 relative pl-0 lg:pl-12">
              <Reveal delay={0.15} y={40}>
                <div className={`relative w-full aspect-[4/5] overflow-hidden ${prefersReduced ? '' : 'grayscale hover:grayscale-0'} transition-all duration-[1.5s] ease-in-out group`}>
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6wVR7Qadhk1k79FqoDvHzeMahiXYBtIRwzcVyS7zmUbfTUcJxiErZ8bRtN_1kQz5tirqARGrPTI8WYOnriCvxFzwMd9X8qRotrNtS2rK9pIQAcWaBXqRvfXW1_T96Mbug3CrKS4l2eBR9-dAoWhK_r_GobLTjsR5BETh3uw-xmU6sehGEwhkrn_C2Hu0ahfKBVShh3YfFBfbf6QsTayAZKrnVex8SwT1Kf8roRofSYuU1ZDJyyGlUZb_Ex5P_zY40c5x8s0m069bC')" }}
                    whileHover={prefersReduced ? {} : { scale: 1.1 }}
                    transition={{ duration: 1.5, ease: EASING.luxury }}
                  />
                  <div className="absolute bottom-0 right-0 bg-akai-black p-6 border-t border-l border-white/10">
                    <p className="text-white font-serif italic text-lg">"El Escenario"</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Narrative Section */}
      <GalleryNarrative />

      {/* Chef Section */}
      <section id="chef" className="py-32 bg-akai-black relative overflow-hidden border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <Reveal className="w-full md:w-5/12 relative" delay={0} y={40}>
              <div
                className={`aspect-[3/4] w-full bg-cover bg-center ${prefersReduced ? '' : 'grayscale contrast-125 hover:contrast-100'} transition-all duration-1000`}
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQ7kjMlohgWjLKjQYLADZ62wv2qhGtSILJcoYrHx4beMd41WrX725KrU6OigGWpfi4bBBoD08c_YamXfszPn-SB4h_2a_oYT6Lw_hO5PbzZvAhhUMCJWBPsGR7uvo4ALtydLuQZdBQ8wOqrcRR94OvJm52b0wS1vQbXCrh2KSV_VzfkWe-VB5Dbu20jd57WbdmbcqYTTnogMmv5qxKzVtRQiVeyC5KPYyLWYjPUkQF457fhoBs_seNXiWbJVs8Paaxpjp84uHl8EW5')" }}
              />
            </Reveal>
            <div className="w-full md:w-7/12">
              <Reveal delay={0.1}>
                <LineDraw width={48} height={1} color="#A81C1C" className="mb-8" />
              </Reveal>
              <Reveal delay={0.15}>
                <h2 className="text-5xl md:text-7xl font-serif text-white mb-10">Kenjiro Sato</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-akai-ivory/80 font-serif italic mb-12">
                  "No cocinamos para transformar, sino para revelar. El cuchillo no corta el pescado, <span className="text-white decoration-akai-red decoration-1 underline underline-offset-4">abre su alma.</span>"
                </blockquote>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="text-akai-muted leading-loose mb-12 max-w-lg font-light">
                  Con más de 30 años de experiencia entre Kyoto y Tokyo, el Chef Sato trae una visión purista del Edomae sushi, respetando la temperatura, el tiempo y el silencio necesario para cada bocado.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex justify-start opacity-80">
                  <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                      d="M20 50 C 40 45, 60 20, 90 30 S 120 60, 150 50 S 190 20, 200 30"
                      stroke="#A81C1C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: EASING.luxury }}
                    />
                    <rect x="160" y="20" width="30" height="30" stroke="#A81C1C" strokeWidth="1" fill="none" />
                    <path d="M165 25 L 185 45" stroke="#A81C1C" strokeWidth="1" />
                    <path d="M185 25 L 165 45" stroke="#A81C1C" strokeWidth="1" />
                  </svg>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
