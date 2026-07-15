import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, Trash2, MessageCircle, Send } from 'lucide-react';
import { useLang, formatPrice } from './i18n';
import { localizeProducts, type LocalizedProduct } from './data';

interface CartItem { productId: string; quantity: number; }

interface Props {
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
}

const CartDrawer: React.FC<Props> = (props) => {
  const { lang, t } = useLang();
  const {
    isCartOpen, setIsCartOpen, cart, isRtl, setCart, updateQuantity, removeFromCart,
    totalAmount, shopOnWhatsApp, shopOnTelegram
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

      
    </>
  );
};
export default CartDrawer;
