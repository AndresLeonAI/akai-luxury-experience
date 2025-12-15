import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-akai-black border-t border-white/[0.03] py-20">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <span className="text-3xl font-serif text-white block tracking-tight">AKAI</span>
            <address className="not-italic text-sm text-akai-muted/60 leading-loose font-light">
              Calle de Velázquez 12<br />
              Salamanca, 28001 Madrid<br />
              +34 91 123 45 67
            </address>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Social</span>
              <a href="#" className="text-xs text-akai-muted hover:text-white transition-colors tracking-widest uppercase">Instagram</a>
              <a href="#" className="text-xs text-akai-muted hover:text-white transition-colors tracking-widest uppercase">Facebook</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Contacto</span>
              <a href="#" className="text-xs text-akai-muted hover:text-white transition-colors tracking-widest uppercase">prensa@akai.es</a>
              <a href="#" className="text-xs text-akai-muted hover:text-white transition-colors tracking-widest uppercase">info@akai.es</a>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Legal</span>
               <a href="#" className="text-xs text-akai-muted hover:text-white transition-colors tracking-widest uppercase">Privacidad</a>
               <a href="#" className="text-xs text-akai-muted hover:text-white transition-colors tracking-widest uppercase">Términos</a>
            </div>
          </div>
        </div>
        
        <div className="mt-24 flex flex-col md:flex-row justify-between items-end text-[9px] text-akai-muted/30 uppercase tracking-[0.2em]">
          <p>© 2024 AKAI Restaurant. Madrid.</p>
          <p className="mt-2 md:mt-0">Diseñado con precisión</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
