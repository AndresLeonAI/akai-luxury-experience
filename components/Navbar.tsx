import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { EASING } from '../motion/tokens';
import clsx from 'clsx';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Transform values for scroll effects
  const headerHeight = useTransform(scrollY, [0, 100], [96, 80]); // h-24 to h-20
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(5, 5, 5, 0)", "rgba(5, 5, 5, 0.85)"]);
  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.08)"]);
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const links = [
    { path: "/philosophy", label: "Filosofía" },
    { path: "/menu", label: "Menú" },
    { path: "/private-dining", label: "Eventos" },
    { path: "/reservations", label: "Reservas" },
  ];

  return (
    <>
      <motion.nav 
        style={{ 
          height: headerHeight, 
          backgroundColor: headerBg,
          borderColor: headerBorder,
          backdropFilter: backdropBlur,
          WebkitBackdropFilter: backdropBlur // Safari
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-colors"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group cursor-pointer z-50 outline-none">
            <motion.div 
              className="w-10 h-10 border border-akai-red flex items-center justify-center group-hover:bg-akai-red/10 group-focus:bg-akai-red/10 transition-colors"
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.5, ease: EASING.luxury }}
            >
              <motion.span 
                className="text-akai-red font-serif font-bold text-xl leading-none pt-0.5"
                whileHover={{ rotate: -45 }}
                transition={{ duration: 0.5, ease: EASING.luxury }}
              >
                A
              </motion.span>
            </motion.div>
            <span className="text-lg tracking-[0.25em] font-medium text-white uppercase font-sans">AKAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-16 relative">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={clsx(
                  "relative text-xs font-medium transition-colors tracking-[0.2em] uppercase py-2 outline-none focus-visible:ring-1 focus-visible:ring-akai-red",
                  location.pathname === link.path ? "text-white" : "text-akai-muted hover:text-white"
                )}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-akai-red shadow-[0_0_8px_rgba(168,28,28,0.8)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link to="/reservations" className="group relative overflow-hidden flex items-center justify-center h-10 px-8 border border-white/20 hover:border-white text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-akai-red">
               <span className="relative z-10 group-hover:text-akai-black transition-colors duration-500">Reservar</span>
               <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white z-50 relative w-8 h-8 flex items-center justify-center outline-none focus-visible:ring-1 focus-visible:ring-akai-red"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
             <span className="material-symbols-outlined font-light text-2xl">
               {mobileOpen ? 'close' : 'menu'}
             </span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            transition={{ duration: 0.6, ease: EASING.luxury }}
            className="fixed inset-0 bg-akai-black z-40 flex flex-col items-center justify-center gap-8 lg:hidden"
          >
             <div className="flex flex-col items-center gap-10">
               {links.map((link, i) => (
                 <motion.div
                   key={link.path}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 + (i * 0.1), duration: 0.5, ease: EASING.luxury }}
                 >
                    <Link 
                      to={link.path} 
                      className="text-3xl font-serif text-white uppercase tracking-widest hover:text-akai-red transition-colors"
                    >
                      {link.label}
                    </Link>
                 </motion.div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;