import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLang } from './i18n';

interface Props {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
  handleNavClick: (e: React.MouseEvent<HTMLElement> | null, id: string) => void;
}

const MobileMenu: React.FC<Props> = (props) => {
  const { t } = useLang();
  const { isMobileMenuOpen, setIsMobileMenuOpen, handleNavClick } = props;
  return (
    <>
{/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mobile-menu-overlay" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
              className="mobile-menu-content"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>DARUZEN</span>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none' }}><X size={28} /></button>
              </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
                {[
                  { id: 'top', label: t.nav.home },
                  { id: 'catalog', label: t.nav.catalog },
                  { id: 'about', label: t.nav.about },
                  { id: 'contacts', label: t.nav.contacts }
                 ].map((link) => (() => (
                   <a
                     key={link.id}
                     className="mobile-menu-link"
                     onClick={(e) => handleNavClick(e, link.id)}
                   >
                     {link.label}
                   </a>
                 ))())}
              </div>
            </motion.div>
            </div>
        )}
      </AnimatePresence>

      
    </>
  );
};
export default MobileMenu;
