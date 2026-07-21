import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useLang, formatPrice } from './i18n';
import { parseCompositionLine } from './data';
import type { LocalizedProduct } from './data';

interface Props {
  selectedProduct: LocalizedProduct | null;
  setSelectedProduct: (p: LocalizedProduct | null) => void;
  modalQuantity: number;
  setModalQuantity: (n: number) => void;
  addToCart: (p: LocalizedProduct, q?: number) => void;
  buyNow: (p: LocalizedProduct, q: number) => void;
}

const ProductModal: React.FC<Props> = (props) => {
  const { t } = useLang();
  const { selectedProduct, setSelectedProduct, modalQuantity, setModalQuantity, addToCart, buyNow } = props;
  return (
    <>
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
                      <table className="modal-comp-table" style={{ width: '100%', tableLayout: 'fixed', marginBottom: '16px' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '55%', textAlign: 'left', padding: '10px 18px', borderBottom: 'none', fontSize: '11px', fontWeight: '800', color: '#000', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Активное вещество</th>
                            <th style={{ width: '45%', textAlign: 'right', padding: '10px 18px', borderBottom: 'none', fontSize: '11px', fontWeight: '800', color: '#000', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Дозировка</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProduct.specs.map((spec, i) => {
                            const { ingredient, dosage } = parseCompositionLine(spec);
                            if (!ingredient || !dosage) return null;
                            return (
                              <tr key={i}>
                                <td style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#111827', lineHeight: '1.4', textAlign: 'left', fontWeight: '500' }}>{ingredient}</td>
                                <td style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#000', fontWeight: '700', textAlign: 'right', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>{dosage}</td>
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

      
    </>
  );
};
export default ProductModal;
