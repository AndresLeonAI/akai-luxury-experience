import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal, LineDraw } from '../components/motion';
import Stagger, { StaggerItem } from '../components/motion/Stagger';
import { MenuSection } from '../types';
import { EASING } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const menuData: MenuSection[] = [
  {
    id: 'omakase',
    title: 'Omakase AKAI',
    subtitle: 'Temporada de Invierno',
    items: [
      { name: 'Omakase AKAI', description: '20 tiempos — Ceremonia completa — Selección del Chef', price: 180 }
    ]
  },
  {
    id: 'nigiri',
    title: 'Nigiri',
    jpTitle: '握り',
    items: [
      { name: 'O-Toro', description: 'Ventresca de Atún Rojo salvaje. Maduración de 7 días. Corte graso superior.', price: 18 },
      { name: 'Uni Hokkaido', description: 'Erizo de mar importado de Hokkaido. Textura cremosa, notas oceánicas profundas.', price: 22 },
      { name: 'Kinmedai', description: 'Alfonsino de ojo dorado. Piel soasada al carbón Binchotan, toque ahumado.', price: 14 },
      { name: 'Saba', description: 'Caballa curada en sal y vinagre rojo Akazu. Jengibre rallado y cebollino fino.', price: 12 },
    ]
  },
  {
    id: 'sashimi',
    title: 'Sashimi',
    jpTitle: '刺身',
    items: [
      { name: 'Moriawase', description: 'Selección del día. 5 variedades de pescado premium, corte grueso. Wasabi fresco de Shizuoka.', price: 45 },
      { name: 'Hotate Trufa', description: 'Vieira viva en láminas translúcidas. Aceite de trufa blanca, flor de sal y zest de yuzu.', price: 32 },
      { name: 'Hamachi', description: 'Pez limón japonés (Yellowtail). Servido con ponzu de jalapeño y cilantro micro.', price: 28 },
    ]
  },
  {
    id: 'kaiseki',
    title: 'Kaiseki',
    jpTitle: '懐石',
    items: [
      { name: 'Wagyu A5 Kagoshima', description: '80g. Cocinado sobre piedra volcánica del Monte Fuji. Salsa ponzu añejada casera y wasabi.', price: 95 },
      { name: 'Chawanmushi Real', description: 'Natilla de huevo al vapor sedosa. Carne de cangrejo real, ikura marinada y dashi doble.', price: 24 },
      { name: 'Tempura de Anago', description: 'Anguila de mar en tempura ligera como aire. Sal de matcha y tsuyu caliente.', price: 26 },
    ]
  },
  {
    id: 'sake',
    title: 'Sake',
    jpTitle: '日本酒',
    items: [
      { name: 'Dassai 23', description: 'Afrutado y floral, con un final limpio como el agua de manantial. Pulido extremo al 23% para máxima pureza.', price: 45 },
      { name: 'Kubota Manju', description: 'La joya de Niigata. Complejo y equilibrado. Notas de pera y melón con una textura aterciopelada inolvidable.', price: 38 },
      { name: 'Hakkaisan', description: 'Seco y crujiente (Karakuchi). Perfecto para limpiar el paladar entre piezas grasas. Nieve derretida.', price: 22 },
    ]
  }
];

const Menu: React.FC = () => {
  const [activeSection, setActiveSection] = useState('omakase');
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuData.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(menuData[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-akai-black min-h-screen pt-32 pb-24 text-akai-ivory">
      <main className="w-full max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 relative">

        {/* Sidebar Nav */}
        <aside className="hidden lg:block col-span-2 relative">
          <div className="sticky top-32 flex flex-col gap-12 pr-8 border-r border-akai-border h-[calc(100vh-200px)]">
            <Reveal delay={0}>
              <div className="flex flex-col gap-2 mb-4">
                <span className="text-akai-red-bright text-[9px] uppercase tracking-[0.3em] font-bold">Índice</span>
                <h1 className="text-white font-serif text-3xl tracking-tight">Menú</h1>
              </div>
            </Reveal>
            <nav className="flex flex-col gap-6">
              {menuData.map((section, index) => (
                <Reveal key={section.id} delay={0.05 * index}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`text-left text-xs font-medium pl-6 py-1 tracking-widest uppercase transition-all duration-500 border-l ${activeSection === section.id
                        ? 'text-akai-red-bright border-akai-red-bright'
                        : 'text-akai-muted hover:text-white border-transparent'
                      }`}
                  >
                    {section.title.split(' ')[0]}
                  </button>
                </Reveal>
              ))}
            </nav>
            <Reveal delay={0.4} className="mt-auto">
              <div className="opacity-20 hover:opacity-100 transition-opacity duration-700">
                <div className="border border-white/20 w-12 h-12 flex items-center justify-center p-2">
                  <span className="font-serif text-akai-red-bright text-2xl">赤</span>
                </div>
              </div>
            </Reveal>
          </div>
        </aside>

        {/* Content */}
        <div className="col-span-12 lg:col-span-10 flex flex-col gap-20 pl-0 lg:pl-16">

          {/* Omakase Header Section */}
          <section id="omakase" className="relative min-h-[50vh] flex flex-col justify-center py-12 scroll-mt-32">
            <div className="relative z-10 w-full">
              <Reveal delay={0}>
                <span className="inline-block text-akai-red-bright text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
                  Temporada de Invierno
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-8 leading-[1.1]">
                  Laca roja sobre<br /><span className="text-[#333]">tinta negra.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-akai-muted text-lg font-light leading-relaxed max-w-xl mb-16">
                  Una experiencia culinaria de silencio absoluto. Nuestro menú Omakase es un diálogo entre el chef y la naturaleza, cambiando diariamente según la captura.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="w-full border-t border-b border-akai-border py-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-baseline gap-4">
                    <div className="md:col-span-3">
                      <p className="text-white text-xl font-serif tracking-wide">Omakase AKAI</p>
                    </div>
                    <div className="md:col-span-7">
                      <p className="text-akai-muted text-sm font-light">20 tiempos — Ceremonia completa — Selección del Chef</p>
                    </div>
                    <div className="md:col-span-2 text-right">
                      <p className="text-white text-lg font-serif tabular-nums">$180</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Standard Sections */}
          {menuData.slice(1).map((section, sectionIndex) => (
            <React.Fragment key={section.id}>
              <Reveal delay={0}>
                <div className="w-full h-px bg-akai-border opacity-50 my-12" />
              </Reveal>
              <section id={section.id} className="scroll-mt-32">
                <Reveal delay={0.05}>
                  <div className="flex items-end justify-between mb-16">
                    <h2 className="text-3xl font-serif text-white tracking-tight">
                      {section.title}
                      {section.jpTitle && <span className="text-lg text-[#333] ml-4 font-serif italic">{section.jpTitle}</span>}
                    </h2>
                  </div>
                </Reveal>

                <div className="flex flex-col">
                  <Reveal delay={0.1}>
                    <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-akai-border text-[10px] uppercase tracking-[0.2em] text-[#444] font-bold">
                      <div className="col-span-3">Selección</div>
                      <div className="col-span-8">Detalle</div>
                      <div className="col-span-1 text-right">Precio</div>
                    </div>
                  </Reveal>

                  {section.items.map((item, idx) => (
                    <Reveal key={idx} delay={0.15 + idx * 0.05}>
                      <motion.div
                        className="group grid grid-cols-1 md:grid-cols-12 gap-y-2 gap-x-4 py-6 border-b border-akai-border/50 hover:bg-white/[0.02] transition-colors items-baseline"
                        whileHover={prefersReduced ? {} : { x: 4 }}
                        transition={{ duration: 0.3, ease: EASING.luxury }}
                      >
                        <div className="md:col-span-3">
                          <h3 className="text-lg text-white font-serif tracking-wide group-hover:text-white transition-colors">{item.name}</h3>
                          {section.id === 'sake' && <span className="text-[10px] uppercase text-[#666] tracking-widest block mt-1">Junmai Daiginjo</span>}
                        </div>
                        <p className="md:col-span-8 text-sm text-akai-muted font-light leading-relaxed self-center">
                          {item.description}
                        </p>
                        <div className="md:col-span-1 text-right md:self-center">
                          <span className="text-white text-sm font-sans tabular-nums">${item.price}</span>
                        </div>
                      </motion.div>
                    </Reveal>
                  ))}
                </div>
              </section>
            </React.Fragment>
          ))}

        </div>
      </main>
    </div>
  );
};

export default Menu;
