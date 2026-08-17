import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, AlertTriangle, Pill, Snowflake, X, ChevronDown } from 'lucide-react';
import { products, localizeProducts, dedupeProducts, type Product, type LocalizedProduct } from '../data';
import { useLang, formatPrice } from '../i18n';
import { fetchProducts } from '../lib/supabase';
import { SEOHead } from '../seo/SEOHead';
import { FadeInImage } from '../components/FadeInImage';
import { CompositionPanel } from '../components/CompositionView';

interface ProductPageProps {
  onAddToCart: (product: LocalizedProduct, qty: number) => void;
  onBuyNow: (product: LocalizedProduct, qty: number) => void;
}

const getAvailableTabs = (p: { specs?: unknown[]; note?: string } | null): ('product' | 'composition' | 'note')[] => [
  'product',
  ...(p?.specs && p.specs.length > 0 ? (['composition'] as const) : []),
  ...(p?.note ? (['note'] as const) : []),
];

const ProductPage: React.FC<ProductPageProps> = ({ onAddToCart, onBuyNow }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'product' | 'composition' | 'note'>('product');

  const [productsData, setProductsData] = useState<Product[]>(() => dedupeProducts(products));
  useEffect(() => {
    fetchProducts()
      .then(data => { if (data.length) setProductsData(dedupeProducts(data)); })
      .catch(() => {});
  }, []);

  const localizedProducts = useMemo(() => localizeProducts(lang, productsData), [lang, productsData]);
  const product = useMemo(() => localizedProducts.find(p => p.id === id), [localizedProducts, id]);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '200px 20px', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--text-muted)' }}>Товар не найден</h1>
        <Link to="/" style={{ color: 'var(--primary)', marginTop: '16px', display: 'inline-block' }}>&#8592; Вернуться на главную</Link>
      </div>
    );
  }

  const availableTabs = getAvailableTabs(product);
  const isRtl = lang === 'ar';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `https://drdaruzen.com${product.image}`,
    url: `https://drdaruzen.com/product/${product.id}`,
    brand: { '@type': 'Brand', name: 'Daruzen' },
    offers: {
      '@type': 'Offer',
      url: `https://drdaruzen.com/product/${product.id}`,
      priceCurrency: lang === 'en' ? 'USD' : lang === 'ru' ? 'RUB' : 'TRY',
      price: lang === 'en' ? (product.price * 0.025).toFixed(2) : product.price,
      availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Daruzen',
        url: 'https://drdaruzen.com',
      },
    },
    category: product.category,
  };

  return (
    <>
      <SEOHead
        title={`${product.name} — Daruzen | Купить витамины и добавки`}
        description={product.description}
        keywords={`${product.name}, Daruzen, дарузен, турецкие витамины, витамины из Турции, ${product.category}, купить, витамины, добавки, БАД, БАДы из Турции, турецкие добавки`}
        canonical={`https://drdaruzen.com/product/${product.id}`}
        ogType="product"
        jsonLd={jsonLd}
      />

      <div className="modal-layout" data-active-tab={activeTab} style={{
          width: '100%',
          minHeight: '100vh',
          background: 'white',
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
            <div className="modal-image-col" style={{ flex: '1 1 50%' }}>
              <div className="modal-image-wrapper" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', position: 'relative' }}>
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
              </div>
            </div>

            <div className="modal-info-wrapper" style={{ flex: '1 1 50%', padding: '32px 40px' }}>
              <span className="modal-category" style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '20px', display: 'inline-block' }}>
                {product.category}
              </span>
              <h1 className="modal-title" style={{ fontWeight: '700', marginBottom: '16px', lineHeight: '1.15', color: 'var(--primary-dark)', letterSpacing: '-0.03em', fontSize: 'clamp(24px, 3vw, 32px)' }}>
                {product.name}
              </h1>
              <div className="modal-price" style={{ fontWeight: '700', marginBottom: '32px', color: 'var(--primary)', fontSize: '28px' }}>
                {formatPrice(product.price, lang)}
              </div>

              {/* Tabs */}
              <div className="modal-mobile-tabs">
                {availableTabs.map(tab => (
                  <button key={tab} type="button" className={`modal-mobile-tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab === 'product' ? t.modal.tabProduct : tab === 'composition' ? t.modal.tabComposition : t.modal.tabNote}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="modal-tabs-viewport">
                <div className="modal-tabs-track" style={{ transform: `translateX(${(isRtl ? 1 : -1) * availableTabs.indexOf(activeTab) * 100}%)` }}>
                  {/* Product tab */}
                  <div className={`modal-tab-pane${activeTab === 'product' ? ' is-active' : ''}`} data-tab="product">
                    <div className="modal-product-media">
                      <div className="modal-product-photo">
                        <FadeInImage src={product.image} className="modal-product-media__img" alt={product.name} decoding="async" />
                        <img src="/images/label_certificates.webp" alt="Certificates" className="modal-product-media__cert-label" />
                      </div>
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
                      </div>
                      <CompositionPanel specs={product.specs} t={t} />
                    </div>
                  )}

                  {/* Note tab */}
                  {product.note && (
                    <div className={`modal-tab-pane${activeTab === 'note' ? ' is-active' : ''}`} data-tab="note">
                      <div className="modal-note-media">
                        <FadeInImage src={product.image} className="modal-note-media__img" alt={product.name} decoding="async" />
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
                            {warnings.map(({ pi, body }) => (
                              <div key={pi} className="modal-note-alert">
                                <div className="modal-note-alert__label">{t.modal.noteWarning}</div>
                                <p className="modal-note-paragraph">{body}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* Buy section */}
              {product.inStock === false ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', height: '54px', borderRadius: '14px', border: '2px solid #d5cfc6', color: '#8a8a8a', fontWeight: '600', fontSize: '15px', marginTop: '24px' }}>
                  Нет в наличии
                </div>
              ) : (
                <div className="modal-buy-under" style={{ marginTop: '24px' }}>
                  <div className="modal-buy-actions">
                    <div className="modal-buy-qty">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '12px', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={18} /></button>
                      <span className="modal-buy-qty__value">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '12px', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={18} /></button>
                    </div>
                    <button onClick={() => onAddToCart(product, quantity)} className="btn btn-primary" style={{ height: '54px', borderRadius: '14px', fontSize: '16px', boxShadow: '0 4px 12px rgba(93, 64, 55, 0.1)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px', border: 'none', cursor: 'pointer' }}>
                      <ShoppingCart size={20} /> {t.cart.inCart}
                    </button>
                    <button onClick={() => onBuyNow(product, quantity)} style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', border: 'none', height: '54px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(37, 211, 102, 0.15)', padding: '0 24px', fontSize: '16px' }}>
                      {t.cart.buyNow}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
};

export default ProductPage;
