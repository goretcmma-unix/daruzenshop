import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  return (
    <AnimatePresence>
      {selectedProduct && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 4000 }} />
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={{ position: 'fixed', top: '50%', left: '50%', width: '300px', background: 'white', zIndex: 4001 }}>
            <div>test</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
