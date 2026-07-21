import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Search, X, Send, MessageCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { useLang, formatPrice } from './i18n';
import { localizeProducts, parseCompositionLine, type LocalizedProduct } from './data';

interface CartItem { productId: string; quantity: number; }

interface OverlaysProps {
  isCartOpen: boolean;
  setIsCartOpen: (v: boolean) => void;
  cart: CartItem[];
  isRtl: boolean;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  totalAmount: number;
  shopOnWhatsApp: () => void;
  shopOnTelegram: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredProducts: LocalizedProduct[];
  scrollToCatalog: () => void;
  selectedProduct: LocalizedProduct | null;
  setSelectedProduct: (p: LocalizedProduct | null) => void;
  modalQuantity: number;
  setModalQuantity: (n: number) => void;
  addToCart: (p: LocalizedProduct, q?: number) => void;
  buyNow: (p: LocalizedProduct, q: number) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
  handleNavClick: (e: React.MouseEvent<HTMLElement> | null, id: string) => void;
}

const Overlays: React.FC<OverlaysProps> = (props) => {
  const { lang, t } = useLang();
  const localizedProducts = localizeProducts(lang);
  const {
    isCartOpen, setIsCartOpen, cart, isRtl, setCart, updateQuantity, removeFromCart,
    totalAmount, shopOnWhatsApp, shopOnTelegram,
    isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, filteredProducts, scrollToCatalog,
    selectedProduct, setSelectedProduct, modalQuantity, setModalQuantity,
    addToCart, buyNow, isMobileMenuOpen, setIsMobileMenuOpen, handleNavClick
  } = props;

  return (
    <>
{/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 3000 }}
            />
            <motion.div 
              initial={{ x: isRtl ? '-110%' : '110%', opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: isRtl ? '-110%' : '110%', opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ 
                position: 'fixed', 
                top: '16px', 
                [isRtl ? 'left' : 'right']: '16px', 
                bottom: '16px', 
                width: 'calc(100% - 32px)', 
                maxWidth: '420px', 
                background: '#FFFFFF', // Полностью белый фон без прозрачности
                zIndex: 3001, 
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: '32px', 
                boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '32px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>{t.cart.title}</h3>
                  {cart.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setCart([])}
                      style={{ background: 'rgba(255, 59, 48, 0.08)', border: 'none', color: '#FF3B30', padding: '4px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                      whileHover={{ background: 'rgba(255, 59, 48, 0.12)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t.cart.clear}
                    </motion.button>
                  )}
                </div>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '80px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#F5F5F7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <ShoppingCart size={32} color="#D1D1D6" />
                    </div>
                    <p style={{ color: '#86868B', fontSize: '17px', fontWeight: '500' }}>{t.cart.empty}</p>
                  </div>
                ) : (
                  cart.map(item => (() => { const localizedProduct = localizeProducts(lang).find(p => p.id === item.productId) || { id: item.productId, name: item.productId, price: 0, image: "", categoryKey: "supplements", category: "", description: "" }; return (
                      <motion.div 
                      layout
                      key={item.productId} 
                      className="cart-drawer-item"
                      style={{ gap: '24px', background: 'none', padding: '28px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}
                    >
                      <div className="cart-drawer-item-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <img src={localizedProduct.image} className="cart-item-img" />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '4px', lineHeight: '1.3', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{localizedProduct.name}</div>
                           <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '20px' }}>{formatPrice(localizedProduct.price, lang)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#F5F5F7', padding: '4px 12px', borderRadius: '10px' }}>
                            <button onClick={() => updateQuantity(item.productId, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Minus size={14} /></button>
                            <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Plus size={14} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.productId)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', opacity: 0.4, cursor: 'pointer', padding: '4px', transition: 'opacity 0.2s ease' }} 
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} 
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ); })())
                )}
              </div>

              <div style={{ padding: '32px 24px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 -15px 40px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '600' }}>{t.cart.total}</span>
                   <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary-dark)' }}>{formatPrice(totalAmount, lang)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <motion.button 
                    whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                    whileTap={{ scale: 0.98 }}
                    disabled={cart.length === 0}
                    onClick={shopOnWhatsApp}
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', height: '72px', borderRadius: '22px', border: 'none', fontWeight: '700', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', opacity: cart.length === 0 ? 0.5 : 1, transition: 'all 0.3s ease', boxShadow: '0 10px 25px rgba(37, 211, 102, 0.2)' }}
                  >
                    <MessageCircle size={24} /> {t.cart.whatsapp}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                    whileTap={{ scale: 0.98 }}
                    disabled={cart.length === 0}
                    onClick={shopOnTelegram}
                    style={{ background: 'linear-gradient(135deg, #0088CC 0%, #005580 100%)', color: 'white', height: '72px', borderRadius: '22px', border: 'none', fontWeight: '700', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', opacity: cart.length === 0 ? 0.5 : 1, transition: 'all 0.3s ease', boxShadow: '0 10px 25px rgba(0, 136, 204, 0.2)' }}
                  >
                    <Send size={24} /> {t.cart.telegram}
                  </motion.button>
                </div>
              </div>
            </motion.div>
            </div>
        )}
      </AnimatePresence>

      
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
                    {searchQuery.split('').map((ch, i) => (
                      <span key={i} className="search-char">{ch}</span>
                    ))}
            </motion.div>
          </AnimatePresence>

      
{/* Product Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 4000 }}
              onTap={() => { 
                setSelectedProduct(null);
                setModalQuantity(1);
              }}/>
             <motion.div 
              initial={{ scale: 0.95, opacity: 0, x: '-50%', y: '-55%' }} 
              animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }} 
              exit={{ scale: 0.95, opacity: 0, x: '-50%', y: '-55%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="modal-layout"
              style={{ 
                position: 'fixed', 
                top: '50%',
                left: '50%', 
                width: 'clamp(280px, 92%, 800px)', 
                maxHeight: '90vh', 
                background: 'white', 
                zIndex: 4001, 
                borderRadius: '24px', 
                overflowY: 'auto',
                overscrollBehaviorY: 'contain',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
              }}
            >
              <motion.div 
                className="modal-image-wrapper"
                style={{ flex: '1.4', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
              >
                 <motion.img 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={selectedProduct.image}
                  loading="lazy"
                  decoding="async"
                  className="modal-image"
                />
                  <motion.button 
                    whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedProduct(null); setModalQuantity(1); }} 
                    style={{ 
                      position: 'absolute', top: '16px', left: '16px', 
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: 'none', borderRadius: '50%', 
                      width: '36px', height: '36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      cursor: 'pointer', zIndex: 10,
                      transition: 'all 0.2s ease'
                    }}>
                    <X size={16} color="var(--text-muted)" />
                   </motion.button>
                 </motion.div>
                 <div className="modal-info-wrapper">
                  <span className="modal-category" style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>{selectedProduct.category}</span>
                  <h2 className="modal-title" style={{ fontWeight: '700', marginBottom: '12px', lineHeight: '1.1', color: 'var(--primary-dark)', letterSpacing: '-0.03em' }}>{selectedProduct.name}</h2>
                   <div className="modal-price" style={{ fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>{formatPrice(selectedProduct.price, lang)}</div>
                  
                  <p className="modal-desc" style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', opacity: 0.9 }}>{selectedProduct.description}</p>
                  
                   {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                     <table className="modal-comp-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                       <thead>
                         <tr>
                           <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid var(--border)', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Активное вещество</th>
                           <th style={{ textAlign: 'right', padding: '8px', borderBottom: '2px solid var(--border)', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: '100px' }}>на порцию</th>
                           <th style={{ textAlign: 'right', padding: '8px', borderBottom: '2px solid var(--border)', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: '90px' }}>% суточной нормы</th>
                         </tr>
                       </thead>
                       <tbody>
                         {selectedProduct.specs.map((spec, i) => {
                           const { ingredient, dosage, daily } = parseCompositionLine(spec);
                           if (!ingredient || !dosage) return null;
                           const dailyText = daily && daily !== '—' ? daily : '—';
                           return (
                             <tr key={i}>
                               <td style={{ padding: '8px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--primary-dark)', lineHeight: '1.5' }}>{ingredient}</td>
                               <td style={{ padding: '8px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--accent)', fontWeight: '700', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{dosage}</td>
                               <td style={{ padding: '8px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{dailyText}</td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   )}
                  
                  <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--primary-dark)' }}>{t.modal.quantity}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', background: '#F5F5F7', padding: '8px 18px', borderRadius: '12px' }}>
                        <button onClick={() => setModalQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}><Minus size={18} /></button>
                        <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center', fontSize: '18px' }}>{modalQuantity}</span>
                        <button onClick={() => setModalQuantity(q => q + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}><Plus size={18} /></button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(selectedProduct, modalQuantity)}
                        className="btn btn-primary"
                        style={{ width: '100%', height: '54px', borderRadius: '14px', fontSize: '16px', boxShadow: '0 4px 12px rgba(93, 64, 55, 0.1)' }}
                      >
                        <ShoppingCart size={20} /> {t.cart.inCart}
                      </motion.button>
                       <motion.button 
                         whileHover={{ scale: 1.02, background: '#20b857' }}
                         whileTap={{ scale: 0.98 }}
                         onClick={() => buyNow(selectedProduct, modalQuantity)} 
                         className="modal-buy-btn"
                         style={{ width: '100%', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', border: 'none', borderRadius: '22px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.2s ease', boxShadow: '0 10px 20px rgba(37, 211, 102, 0.15)' }}
                       >
                        {t.cart.buyNow}
                      </motion.button>
                    </div>
                   </div>
                 </div>
               </motion.div>
             </div>
         )}
       </AnimatePresence>

      
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

      
<footer style={{ 
        background: 'rgba(62, 39, 35, 0.96)', 
        color: 'white', 
        padding: '80px 0 40px' 
      }}>
        <div className="container">
          <div className="footer-grid">
            <div style={{ gridColumn: 'span 2' }}>
              <img 
                src="/images/dr.svg.png" 
                alt="Daruzen Logo" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'contain', 
                  marginBottom: '24px',
                  opacity: 0.85 /* Полупрозрачность для логотипа внизу */
                }} 
              />
              <p style={{ opacity: 0.6, maxWidth: '300px', lineHeight: '1.8' }}>
                {t.footer.desc}
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '24px', fontWeight: '700' }}>{t.footer.company}</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.6 }}>
                 {t.footer.links.map(link => (() => {
                   return (<a key={link} href="#">{link}</a>);
                 })())}
              </nav>
            </div>
            <div>
              <h4 style={{ marginBottom: '24px', fontWeight: '700' }}>{t.footer.connect}</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.6 }}>
                <a href="mailto:daruzenshop@outlook.com" style={{ color: 'inherit', textDecoration: 'none' }}>daruzenshop@outlook.com</a>
                <a href="tel:+905446791012" style={{ color: 'inherit', textDecoration: 'none' }}>+90 544 679 10 12</a>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                   <MessageCircle size={20} />
                   <Send size={20} />
                </div>
              </nav>
            </div>
          </div>
          <div style={{ paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', opacity: 0.4, fontSize: '14px' }}>
            © {new Date().getFullYear()} DARUZEN. {t.footer.rights}
          </div>
        </div>
      
    </>
  );
};

export default Overlays;
