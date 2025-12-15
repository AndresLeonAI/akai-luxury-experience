import React from 'react';
import { motion } from 'framer-motion';
import { Reveal, LineDraw, ParallaxImage } from '../components/motion';
import { EASING, DURATION } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const Philosophy: React.FC = () => {
  const prefersReduced = useReducedMotion();

  const principles = [
    { title: 'Precisión', desc: 'Décadas de maestría en un solo movimiento. La textura, la temperatura y el tiempo convergen en un instante de perfección técnica y espiritual.' },
    { title: 'Pureza', desc: 'Importamos lo esencial desde el Mercado de Toyosu. Respetamos el sabor natural por encima de cualquier artificio, buscando la verdad del ingrediente.' },
    { title: 'Armonía', desc: 'Un santuario para los sentidos. El juego sutil entre el vinagre akazu, el arroz y el pescado crea una sinfonía silenciosa en el paladar.' }
  ];

  return (
    <div className="bg-akai-black text-akai-ivory">
      {/* Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6hijmh8Mbk3b6W6pjVM9oZK-Pq77IP61u-SvRSiqW-hWcleRyrKx2lFz1tWZK62DTkGm3hMvbjWnhxyw0NMnzT6NHLi4CsxlHRPlR5JwKs6N9xUBzfwKrybvUEZHInm-BEtBx_xdfBBEIk7J_apxUJ_VvCOodOxl5675jyE3HLXrIigeaib11J1mnaW6jgXYJZFR3ArxewrY8zTMi4gW1CQy_jkQwJr4tTYd8KJa71g8TvwFmu_pMKxb_S8BYwlHCU2Jke13JqCva"
            alt="Philosophy Hero"
            className="w-full h-full opacity-80"
            parallaxStrength={0.12}
            zoomAmount={1.03}
            overlayClassName="bg-gradient-to-t from-akai-black via-akai-black/40 to-black/60"
          />
        </div>

        <div className="relative z-20 max-w-[1440px] w-full px-6 md:px-24 flex flex-col items-center text-center gap-10 pt-24">
          <Reveal delay={0}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <LineDraw width={32} color="rgba(168, 28, 28, 0.6)" delay={0.2} />
                <span className="text-white/60 text-[10px] font-medium tracking-[0.4em] uppercase">
                  Tradición Edomae
                </span>
                <LineDraw width={32} color="rgba(168, 28, 28, 0.6)" delay={0.2} />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-extralight tracking-tight text-white leading-none">
                Tinta y <br /><span className="italic text-white/80 font-thin">Silencio</span>
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="max-w-lg text-akai-muted text-sm leading-8 font-light tracking-wide">
              Una ceremonia de precisión absoluta. Donde cada corte es deliberado y el tiempo se suspende entre la madera y el acero.
            </p>
          </Reveal>

          <Reveal delay={0.4} className="mt-16">
            <div className="flex flex-col items-center gap-6">
              <motion.div
                className="h-20 w-[1px] bg-gradient-to-b from-white/10 via-white/20 to-transparent"
                animate={prefersReduced ? {} : {
                  opacity: [0.5, 1, 0.5],
                  scaleY: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Philosophy Details */}
      <section id="filosofia" className="py-32 md:py-40 bg-akai-black relative">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-20 md:gap-32 items-start">
            <div className="flex flex-col gap-8 md:w-5/12 md:sticky md:top-40">
              <Reveal delay={0}>
                <span className="text-akai-red text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-3">
                  <LineDraw width={24} color="#A81C1C" />
                  Filosofía AKAI
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-serif text-white leading-[1.15] font-light">
                  Confianza en la <br /> <span className="text-white/30 italic">Mano del Maestro</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-akai-muted text-sm leading-8 font-light max-w-sm">
                  Omakase es la expresión de confianza absoluta. Honramos las estaciones, los ingredientes invisibles y el momento fugaz que nunca se repetirá.
                </p>
              </Reveal>
            </div>
            <div className="flex flex-col gap-16 md:w-7/12 md:pt-10">
              {principles.map((item, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <motion.div
                    className="group flex flex-col gap-4 border-l border-white/5 pl-8 transition-colors duration-1000 hover:border-akai-red/50"
                    whileHover={prefersReduced ? {} : { x: 4 }}
                    transition={{ duration: 0.4, ease: EASING.luxury }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="h-[1px] w-4 bg-white/20 group-hover:bg-akai-red group-hover:w-8 transition-all duration-500" />
                      <h3 className="text-lg font-serif font-light text-white tracking-widest uppercase">{item.title}</h3>
                    </div>
                    <p className="text-akai-muted text-sm leading-7 pl-8 font-light text-justify">{item.desc}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interior Image Section */}
      <section className="relative w-full py-24 bg-akai-card">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-0 min-h-[600px] border border-white/5 bg-akai-black">
            <Reveal delay={0} y={40}>
              <motion.div
                className={`relative w-full min-h-[400px] md:min-h-full bg-cover bg-center overflow-hidden ${prefersReduced ? '' : 'grayscale hover:grayscale-0'} transition-all duration-1000`}
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLvIc3vKY-tAVa0PzawSlGph547NrgeR-oVIKR2ERZIxc_q59guRWILp0tl_YAEy2j8mr2IJ6Ge-an7rle47we_73jCiVM6tgfOR41L2iylC5_-zTpzXDGrEJ14_ihRNyy9UcflM1GX6o3B0n2SD-ZMlx7L7G1R-DLx3wI99YmeJNCa5O8tRs1XuWitJwkIWWV8F4qL3u27MbnXKfOcK-3eXFHRKBJTQc2IQsh_XRxzGSa1uURLCHOIaIQTLpwKWqVULkHg5QMzznq')" }}
                whileHover={prefersReduced ? {} : { scale: 1.05 }}
                transition={{ duration: 1.5, ease: EASING.luxury }}
              >
                <div className="absolute inset-0 bg-black/30 transition-all duration-1000 hover:bg-black/10" />
              </motion.div>
            </Reveal>
            <div className="p-12 md:p-24 flex flex-col justify-center gap-10 bg-akai-black">
              <Reveal delay={0.1}>
                <div className="flex flex-col gap-6">
                  <span className="text-akai-red text-[10px] font-bold tracking-[0.3em] uppercase">El Espacio</span>
                  <h2 className="text-4xl md:text-5xl font-serif text-white font-light leading-tight">
                    Sombra y <br /><span className="italic text-white/40">Madera Hinoki</span>
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-akai-muted text-sm leading-8 max-w-sm font-light">
                  Diseñado para eliminar la distracción. Nuestra barra de 8 asientos está tallada en una sola pieza de ciprés Hinoki de 200 años. La iluminación se enfoca únicamente en el escenario: su plato.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Philosophy;