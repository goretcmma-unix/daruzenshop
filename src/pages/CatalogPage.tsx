import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { categoryKeys, products, getCategoryLabel, localizeProducts, dedupeProducts, isNewProduct, type LocalizedProduct, type CategoryKey, type Product } from '../data';
import { useLang, formatPrice } from '../i18n';
import { fetchProducts } from '../lib/supabase';
import { SEOHead } from '../seo/SEOHead';
import { NormalizedImg } from '../components/NormalizedImg';

const CatalogPage: React.FC = () => {
  const { lang, t } = useLang();
  const isRtl = lang === 'ar';
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  const [productsData, setProductsData] = useState<Product[]>(() => dedupeProducts(products));
  useEffect(() => {
    fetchProducts()
      .then(data => { if (data.length) setProductsData(dedupeProducts(data)); })
      .catch(() => {});
  }, []);

  const localizedProducts = useMemo(() => localizeProducts(lang, productsData), [lang, productsData]);

  const filteredProducts = useMemo(() => {
    return localizedProducts.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.categoryKey === selectedCategory;
      return matchesCategory;
    }).sort((a, b) => (isNewProduct(a) ? 1 : 0) - (isNewProduct(b) ? 1 : 0) || (b.createdAt ?? 0) - (a.createdAt ?? 0) || a.name.localeCompare(b.name));
  }, [selectedCategory, localizedProducts]);

  useEffect(() => { setPage(0); }, [selectedCategory]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleCategorySelect = (cat: 'all' | CategoryKey) => {
    setSelectedCategory(cat);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Каталог витаминов и добавок Daruzen',
    description: 'Полный каталог премиальных витаминов, минералов и БАД от Daruzen. Натуральные добавки для здоровья из Турции.',
    url: `https://drdaruzen.com/${lang}/catalog`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://drdaruzen.com/${lang}/product/${p.id}`,
        name: p.name,
        image: `https://drdaruzen.com${p.image}`,
      })),
    },
  };

  const hreflangs = [
    { lang: 'ru', href: 'https://drdaruzen.com/ru/catalog' },
    { lang: 'tr', href: 'https://drdaruzen.com/tr/catalog' },
    { lang: 'en', href: 'https://drdaruzen.com/en/catalog' },
    { lang: 'ar', href: 'https://drdaruzen.com/ar/catalog' },
  ];

  return (
    <>
      <SEOHead
        title="Каталог витаминов и добавок Daruzen — Витамины, минералы, БАД | drdaruzen.com"
        description="Каталог премиальных витаминов, минералов и добавок Daruzen. BSO мармеладки, Омега-3, магний, мультивитамины и другие натуральные добавки из Турции."
        keywords="Daruzen каталог, витамины, турецкие витамины, витамины из Турции, добавки, БАД, БАДы из Турции, дарузен, омега 3, магний, мультивитамины, минералы, натуральные добавки, турецкие добавки"
        canonical={`https://drdaruzen.com/${lang}/catalog`}
        hreflang={hreflangs}
        jsonLd={jsonLd}
      />

      <section className="section-padding" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="catalog-header">
            <motion.h2
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: 'var(--primary-dark)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '24px' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-80px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
            >
              {t.catalog.title}
            </motion.h2>
            <div className="category-filter-container">
              <div className="category-filter">
                {categoryKeys.map(cat => (
                  <div
                    key={cat}
                    className={selectedCategory === cat ? 'chip active' : 'chip'}
                    onClick={() => handleCategorySelect(cat)}
                    style={{ borderRadius: '12px', fontWeight: '600' }}
                  >
                    {getCategoryLabel(lang, cat)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid-catalog"
            >
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="product-card"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
                  onClick={() => navigate(`/${lang}/product/` + product.id)}
                >
                  <div className="product-image-container">
                    <NormalizedImg
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                      decoding="async"
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '6px 12px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--primary-dark)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      {product.category}
                    </div>
                    {isNewProduct(product) && (
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'linear-gradient(135deg, #e5484d 0%, #c0392b 100%)',
                        color: '#fff',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '900',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        boxShadow: '0 6px 18px rgba(229,72,77,0.6)',
                        zIndex: 10,
                        border: '2px solid rgba(255,255,255,0.4)',
                        backdropFilter: 'blur(2px)'
                      }}>
                        {t.catalog.newLabel}
                      </span>
                    )}
                    {product.inStock === false && (
                      <span style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(80, 80, 80, 0.9)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
                      }}>
                        {t.catalog.outOfStock}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 className="product-card-title">
                      {product.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto'
                    }}>
                      <span className="product-card-price">{formatPrice(product.price, lang)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.inStock !== false) {
                            navigate(`/${lang}/product/` + product.id);
                          }
                        }}
                        className="btn-primary"
                        style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: product.inStock === false ? 'not-allowed' : 'pointer', opacity: product.inStock === false ? 0.4 : 1 }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {pageCount > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
              <button
                type="button"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--primary-dark)',
                  cursor: page === 0 ? 'default' : 'pointer',
                  opacity: page === 0 ? 0.4 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {isRtl ? `→ ${t.catalog.prev}` : `← ${t.catalog.prev}`}
              </button>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', minWidth: '48px', textAlign: 'center' }}>
                {page + 1} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--primary-dark)',
                  cursor: page >= pageCount - 1 ? 'default' : 'pointer',
                  opacity: page >= pageCount - 1 ? 0.4 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {isRtl ? `${t.catalog.next} ←` : `${t.catalog.next} →`}
              </button>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Search size={48} color="#ddd" style={{ marginBottom: '20px' }} />
              <p style={{ color: '#999', fontSize: '18px' }}>{t.catalog.empty}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CatalogPage;
