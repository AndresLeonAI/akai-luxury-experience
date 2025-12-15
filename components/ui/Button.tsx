import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { EASING } from '../../motion/tokens';
import clsx from 'clsx';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center px-12 h-14 text-xs font-bold tracking-[0.2em] uppercase overflow-hidden transition-colors duration-500 rounded-sm group";
  
  const variants = {
    primary: "bg-akai-red text-white hover:bg-akai-red-dark shadow-[0_0_30px_rgba(168,28,28,0.2)]",
    outline: "border border-white/20 text-akai-ivory hover:border-white hover:text-white bg-transparent",
    ghost: "bg-transparent text-white/70 hover:text-white"
  };

  return (
    <motion.button
      className={clsx(baseStyles, variants[variant], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ ease: EASING.luxury, duration: 0.4 }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Subtle scanline/sheen effect on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        initial={{ x: '-150%' }}
        whileHover={{ x: '150%' }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.button>
  );
};

export default Button;