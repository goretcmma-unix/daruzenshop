import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, AlertTriangle, Pill, Snowflake, X, ChevronDown } from 'lucide-react';
import { products, localizeProducts, dedupeProducts, type Product, type LocalizedProduct } from '../data';
import { useLang, formatPrice } from '../i18n';
import { fetchProducts } from '../lib/supabase';
import { SEOHead } from '../seo/SEOHead';
import { FadeInImage } from '../components/FadeInImage';
import { CompositionPanel } from '../components/CompositionView';
import QtyButton from '../components/QtyButton';

const SEO_DATA: Record<string, { titleSuffix: string; keywords: (name: string, cat: string) => string }> = {
  ru: {
    titleSuffix: 'Daruzen | Купить витамины и БАДы из Турции',
    keywords: (name: string, cat: string) => `${name}, Daruzen, дарузен, турецкие витамины, витамины из Турции, ${cat}, купить витамины, БАДы, бады из Турции, турецкие добавки, витамины турция, натуральные добавки, купить добавки, дарузен витамины, витамины купить онлайн`,
  },
  tr: {
    titleSuffix: 'Daruzen | Türk Vitaminleri ve Takviyeleri',
    keywords: (name: string, cat: string) => `${name}, Daruzen, daruzen, türk vitaminleri, türkiye vitaminleri, ${cat}, vitamin al, takviye, besin takviyesi, türk takviyeleri, doğal takviyeler, daruzen vitamin, türkiye ürünleri, online vitamin`,
  },
  en: {
    titleSuffix: 'Daruzen | Turkish Vitamins & Supplements',
    keywords: (name: string, cat: string) => `${name}, Daruzen, daruzen, turkish vitamins, vitamins from turkey, ${cat}, buy vitamins, supplements, dietary supplements, turkish supplements, natural supplements, daruzen vitamins, turkey vitamins, order vitamins online`,
  },
  ar: {
    titleSuffix: 'داروزن | فيتامينات ومكملات غذائية من تركيا',
    keywords: (name: string, cat: string) => `${name}, داروزن, daruzen, فيتامينات تركية, فيتامينات من تركيا, ${cat}, شراء فيتامينات, مكملات, مكملات غذائية, مكملات تركية, مكملات طبيعية, داروزن فيتамين, منتجات تركية, فيتامينات اونلاين`,
  },
};

interface ProductPageProps {
  product: LocalizedProduct;
  onAddToCart: (product: LocalizedProduct, qty: number) => void;
  onBuyNow: (product: LocalizedProduct, qty: number) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onAddToCart, onBuyNow }) => {
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'product' | 'composition' | 'note'>('product');

  const isRtl = lang === 'ar';

  const switchTab = useCallback((tab: 'product' | 'composition' | 'note') => {
    setActiveTab(tab);
    const viewport = document.querySelector('.modal-tabs-viewport');
    if (viewport) viewport.scrollTop = 0;
  }, []);

  const getAvailableTabs = useCallback((p: { specs?: unknown[]; note?: string } | null): ('product' | 'composition' | 'note')[] => [
    'product',
    ...(p?.specs && p.specs.length > 0 ? (['composition'] as const) : []),
    ...(p?.note ? (['note'] as const) : []),
  ], []);

  useEffect(() => {
    const tabs = getAvailableTabs(product);
    const viewport = document.querySelector('.modal-tabs-viewport');
    if (!viewport) return;
    const idx = tabs.indexOf(activeTab);
    const track = viewport.querySelector('.modal-tabs-track') as HTMLElement;
    if (track) track.style.transform = `translateX(${(isRtl ? 1 : -1) * idx * 100}%)`;
    viewport.scrollTop = 0;
  }, [activeTab, product, isRtl, getAvailableTabs]);

  useEffect(() => {
    document.body.classList.add('scroll-locked');
    return () => { document.body.classList.remove('scroll-locked'); };
  }, []);

  const goBack = useCallback(() => {
    const prev = document.referrer;
    const isSameSite = prev && new URL(prev, location.origin).origin === location.origin;
    if (isSameSite && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') goBack(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goBack]);

  const availableTabs = getAvailableTabs(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [`https://drdaruzen.com${product.image}`],
    sku: product.id,
    mpn: product.id,
    url: `https://drdaruzen.com/product/${product.id}`,
    brand: { '@type': 'Brand', name: 'Daruzen' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '12',
    },
    offers: {
      '@type': 'Offer',
      url: `https://drdaruzen.com/product/${product.id}`,
      priceCurrency: lang === 'en' ? 'USD' : lang === 'ru' ? 'RUB' : 'TRY',
      price: lang === 'en' ? (product.price * 0.025).toFixed(2) : product.price,
      availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Daruzen', url: 'https://drdaruzen.com' },
    },
    category: product.category,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ position: 'fixed', inset: 0, zIndex: 4000, pointerEvents: 'auto' }}
    >
      <SEOHead
        title={`${product.name} — ${(SEO_DATA[lang] || SEO_DATA.en).titleSuffix}`}
        description={product.description}
        keywords={(SEO_DATA[lang] || SEO_DATA.en).keywords(product.name, product.category)}
        canonical={`https://drdaruzen.com/product/${product.id}`}
        ogImage={product.image.startsWith("http") ? product.image : `https://drdaruzen.com${product.image}`}
        ogType="product"
        jsonLd={jsonLd}
      />

      {/* Backdrop */}
      <div onClick={goBack} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />

      {/* Modal */}
      <div className="modal-shell">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, x: '-50%', y: '-55%' }}
          animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
          exit={{ scale: 0.96, opacity: 0, x: '-50%', y: '-55%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 350, exitDuration: 0.15 }}
          className="modal-layout"
          data-active-tab={activeTab}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: 'clamp(320px, 94vw, 1280px)',
            height: '90vh',
            maxHeight: '90vh',
            background: 'white',
            borderRadius: '24px',
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehaviorY: 'contain',
            pointerEvents: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            zIndex: 4001,
          }}
        >
          <div className="modal-scroll-region">
            <motion.div className="modal-image-col">
              <motion.div
                className="modal-image-wrapper"
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', position: 'relative' }}
              >
                <div className="modal-photo" style={{ width: 'auto', height: '100%', maxWidth: '100%', maxHeight: '100%' }}>
                  <FadeInImage
                    src={product.image}
                    targetOpacity={product.inStock === false ? 0.3 : 1}
                    decoding="async"
                    className="modal-image"
                    style={{ filter: product.inStock === false ? 'grayscale(1)' : 'none' }}
                  />
                  <img src="/images/label_certificates.webp" alt="Certificates" className="modal-product-media__cert-label" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goBack}
                  style={{
                    position: 'absolute', top: '16px', insetInlineStart: '16px',
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
            </motion.div>

            <div className="modal-info-wrapper">
              <motion.span
                className="modal-category"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '20px', display: 'inline-block' }}
              >
                {product.category}
              </motion.span>
              <motion.h2
                className="modal-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                style={{ fontWeight: '700', marginBottom: '16px', lineHeight: '1.15', color: 'var(--primary-dark)', letterSpacing: '-0.03em' }}
              >
                {product.name}
              </motion.h2>
              <motion.div
                className="modal-price"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{ fontWeight: '700', marginBottom: '32px', color: 'var(--primary)' }}
              >
                {formatPrice(product.price, lang)}
              </motion.div>

              {/* Mobile tab bar */}
              <div className="modal-mobile-tabs">
                <button type="button" className={`modal-mobile-tab${activeTab === 'product' ? ' active' : ''}`} onClick={() => switchTab('product')}>
                  {t.modal.tabProduct}
                </button>
                {product.specs && product.specs.length > 0 && (
                  <button type="button" className={`modal-mobile-tab${activeTab === 'composition' ? ' active' : ''}`} onClick={() => switchTab('composition')}>
                    {t.modal.tabComposition}
                  </button>
                )}
                {product.note && (
                  <button type="button" className={`modal-mobile-tab${activeTab === 'note' ? ' active' : ''}`} onClick={() => switchTab('note')}>
                    {t.modal.tabNote}
                  </button>
                )}
              </div>

              {/* Tab content track */}
              <div className="modal-tabs-viewport">
                <div className="modal-tabs-track" style={{ transform: `translateX(${(isRtl ? 1 : -1) * availableTabs.indexOf(activeTab) * 100}%)` }}>
                  {/* Product tab */}
                  <div className={`modal-tab-pane${activeTab === 'product' ? ' is-active' : ''}`} data-tab="product">
                    <div className="modal-product-media">
                      <div className="modal-product-photo">
                        <FadeInImage src={product.image} className="modal-product-media__img" alt={product.name} decoding="async" />
                        <img src="/images/label_certificates.webp" alt="Certificates" className="modal-product-media__cert-label" />
                      </div>
                      <motion.button whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={goBack} className="modal-tab-close" aria-label="Close">
                        <X size={16} color="var(--text-muted)" />
                      </motion.button>
                    </div>
                    <div className="modal-product-head">
                      <h3 className="modal-note-title">{product.name}</h3>
                      <div className="modal-product-price" style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '20px', marginTop: '6px' }}>{formatPrice(product.price, lang)}</div>
                    </div>
                    <div className="desc-card__content">
                      <p>{product.description}</p>
                    </div>
                  </div>

                  {/* Composition tab */}
                  {product.specs && product.specs.length > 0 && (
                    <div className={`modal-tab-pane${activeTab === 'composition' ? ' is-active' : ''}`} data-tab="composition">
                      <div className="modal-note-media">
                        <FadeInImage src={product.image} className="modal-note-media__img" alt={product.name} decoding="async" />
                        <motion.button whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={goBack} className="modal-tab-close" aria-label="Close" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255, 255, 255, 0.7)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease' }}>
                          <X size={16} color="var(--text-muted)" />
                        </motion.button>
                      </div>
                      <CompositionPanel specs={product.specs} t={t} />
                    </div>
                  )}

                  {/* Note tab */}
                  {product.note && (
                    <div className={`modal-tab-pane${activeTab === 'note' ? ' is-active' : ''}`} data-tab="note">
                      <div className="modal-note-media">
                        <FadeInImage src={product.image} className="modal-note-media__img" alt={product.name} decoding="async" />
                        <motion.button whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={goBack} className="modal-tab-close" aria-label="Close" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255, 255, 255, 0.7)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease' }}>
                          <X size={16} color="var(--text-muted)" />
                        </motion.button>
                      </div>
                      <div className="modal-note-head">
                        <h3 className="modal-note-title">{product.name}</h3>
                      </div>
                      <div className="modal-note-hint">
                        <span>{t.modal.noteScrollHint}</span>
                        <ChevronDown size={14} className="modal-note-hint__icon" />
                      </div>
                      {(() => {
                        const paragraphs = product.note.split('\n\n').map((paragraph, pi) => {
                          const trimmed = paragraph.trim();
                          const isWarning = /^(ЭТО НЕ|НЕ ЯВЛЯЕТСЯ|BU BİR|THIS IS NOT|هذا ليس)/.test(trimmed);
                          const isCaution = /^(Внимание|Dikkat|Caution|Attention|انتبه|انتباه|تحذير)/.test(trimmed);
                          const isNegated = /^(Не |НЕ |No |Do not |Don'?t |Dont |لا )/.test(trimmed);
                          const isDosage = !isNegated && /дозировк|суточная доз|способ применени|Günlük önerilen|Recommended daily|الجرعة|önerilen doz|daily dose/i.test(trimmed);
                          const isStorage = /хранени|хранить|Saklama|Storage conditions|ظروف التخزين|saklama koşulları|Store in/i.test(trimmed);
                          const type = isWarning ? 'warning' : isCaution ? 'info' : isDosage ? 'dosage' : isStorage ? 'storage' : 'info';
                          const body = isWarning ? trimmed : trimmed.replace(/^[^:]+:\s*/, '');
                          return { pi, type, body, isWarning };
                        });
                        const items = paragraphs.filter(p => !p.isWarning);
                        const warnings = paragraphs.filter(p => p.isWarning);
                        return (
                          <div className="modal-note-content">
                            {items.length > 0 && (
                              <div className="modal-note-table">
                                {items.map(({ pi, type, body }) => (
                                  <div key={pi} className={`modal-note-item is-${type}`}>
                                    {type !== 'info' && (
                                      <span className="modal-note-item__icon" aria-hidden="true">
                                        {type === 'dosage' && <Pill size={18} strokeWidth={2.2} />}
                                        {type === 'storage' && <Snowflake size={18} strokeWidth={2.2} />}
                                      </span>
                                    )}
                                    <p className="modal-note-paragraph">{body}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            {warnings.map(({ pi, body }) => {
                              const m = body.match(/^([^!.!؟\n]+[!.!؟])\s*(.*)$/s);
                              const head = (m && m[1] ? m[1] : '').trim();
                              const rest = (m && m[2] ? m[2] : '').trim();
                              const isUpper = /[A-ZА-ЯЁ]/.test(head) && !/[a-zа-яё]/.test(head);
                              return (
                                <div key={pi} className="modal-note-alert">
                                  {isUpper ? (
                                    <>
                                      <div className="modal-note-alert__plate">
                                        <AlertTriangle size={14} strokeWidth={2.6} aria-hidden="true" />
                                        {head}
                                      </div>
                                      {rest && <p className="modal-note-paragraph">{rest}</p>}
                                    </>
                                  ) : (
                                    <>
                                      <div className="modal-note-alert__label">{t.modal.noteWarning}</div>
                                      <p className="modal-note-paragraph">{body}</p>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {product.inStock === false ? (
                <div className="modal-out-of-stock" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', height: '54px', borderRadius: '14px', border: '2px solid #d5cfc6', color: '#8a8a8a', fontWeight: '600', fontSize: '15px', letterSpacing: '0.01em', background: 'transparent' }}>
                  Нет в наличии
                </div>
              ) : (
                <div className="modal-buy-under">
                  <div className="modal-buy-actions">
                    <div className="modal-buy-qty">
                      <QtyButton label="-" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                        <Minus size={18} />
                      </QtyButton>
                      <span className="modal-buy-qty__value">{quantity}</span>
                      <QtyButton label="+" withRotate onClick={() => setQuantity(q => q + 1)}>
                        <Plus size={18} />
                      </QtyButton>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAddToCart(product, quantity)}
                      className="btn btn-primary"
                      style={{ height: '54px', borderRadius: '14px', fontSize: '16px', boxShadow: '0 4px 12px rgba(93, 64, 55, 0.1)' }}
                    >
                      <ShoppingCart size={20} /> {t.cart.inCart}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onBuyNow(product, quantity)}
                      className="modal-buy-btn"
                      style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', border: 'none', height: '54px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(37, 211, 102, 0.15)' }}
                    >
                      {t.cart.buyNow}
                    </motion.button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Mobile/tablet bottom buy bar — direct child of modal-layout so flex keeps it pinned */}
          {product.inStock !== false && (
            <div className="modal-tab-buy">
              <div className="modal-buy-actions">
                <div className="modal-buy-qty">
                  <QtyButton label="-" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus size={18} />
                  </QtyButton>
                  <span className="modal-buy-qty__value">{quantity}</span>
                  <QtyButton label="+" withRotate onClick={() => setQuantity(q => q + 1)}>
                    <Plus size={18} />
                  </QtyButton>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToCart(product, quantity)}
                  className="btn btn-primary"
                  style={{ height: '54px', borderRadius: '14px', fontSize: '16px', boxShadow: '0 4px 12px rgba(93, 64, 55, 0.1)' }}
                >
                  <ShoppingCart size={20} /> {t.cart.inCart}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onBuyNow(product, quantity)}
                  className="modal-buy-btn"
                  style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', border: 'none', height: '54px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(37, 211, 102, 0.15)' }}
                >
                  {t.cart.buyNow}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductPage;
