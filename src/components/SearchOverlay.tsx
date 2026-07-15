import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useLang } from './i18n';
import type { LocalizedProduct } from './data';

interface Props {
  isSearchOpen: boolean;
  setIsSearchOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredProducts: LocalizedProduct[];
  scrollToCatalog: () => void;
}

const SearchOverlay: React.FC<Props> = (props) => {
  const { t } = useLang();
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, filteredProducts, scrollToCatalog } = props;
  return (
    <>
{/* Трендовый Floating Search (Spotlight-style) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0, 0, 0, 0.1)', // Полупрозрачный фон без блюра на весь экран
              backdropFilter: 'none', // Убрали блюр с оверлея
              WebkitBackdropFilter: 'none',
              zIndex: 5000,
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '100px'
            }}
          >
            <motion.div 
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '90%', 
                maxWidth: '500px', 
                background: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(12px) saturate(180%)',
                borderRadius: '20px',
                padding: '12px 16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '60px'
              }}
            >
               <Search size={22} color="var(--primary)" style={{ opacity: 0.4 }} />
               {/* Контейнер с посимвольной анимацией: реальный input (прозрачный текст,
                   видимый акцентный курсор) лежит поверх слоя с анимированными символами */}
               <div style={{ position: 'relative', flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'center' }}>
                 <div
                   aria-hidden="true"
                   style={{
                     position: 'absolute',
                     inset: 0,
                     display: 'flex',
                     alignItems: 'center',
                     whiteSpace: 'pre',
                     overflow: 'hidden',
                     pointerEvents: 'none',
                     fontSize: '18px',
                     fontWeight: '500',
                     color: 'var(--primary)',
                     fontFamily: 'inherit',
                     lineHeight: 1,
                     textShadow: '0 0 1px rgba(212, 175, 55, 0.35)',
                   }}
                 >
                    {searchQuery.split('').map((ch, i) => (() => (
                      <span key={i} className="search-char">{ch}</span>
                    ))())}
            </motion.div>
          </AnimatePresence>

      
    </>
  );
};
export default SearchOverlay;
