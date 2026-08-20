import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { categoryKeys, products, getCategoryLabel, localizeProducts, dedupeProducts, isNewProduct, type LocalizedProduct, type CategoryKey, type Product } from '../data';
import { useLang, formatPrice } from '../i18n';
import { fetchProducts } from '../lib/supabase';
import { SEOHead } from '../seo/SEOHead';

interface CatalogPageProps {
  onSelectProduct: (product: LocalizedProduct) => void;
  onAddToCart: (product: LocalizedProduct) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectProduct, onAddToCart }) => {
  const { lang, t } = useLang();
  const [searchQuery, setSearchQuery] = useState('');
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
    const query = searchQuery.toLowerCase();
    return localizedProducts.filter(p => {
      const matchesSearch = query === '' || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || p.categoryKey === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => (isNewProduct(a) ? 1 : 0) - (isNewProduct(b) ? 1 : 0) || (b.createdAt ?? 0) - (a.createdAt ?? 0) || a.name.localeCompare(b.name));
  }, [searchQuery, selectedCategory, localizedProducts]);

  useEffect(() => { setPage(0); }, [selectedCategory, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const categoryList = categoryKeys.filter(k => k !== 'all');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Каталог витаминов и добавок Daruzen',
    description: 'Полный каталог премиальных витаминов, минералов и БАД от Daruzen. Натуральные добавки для здоровья из Турции.',
    url: 'https://drdaruzen.com/catalog',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://drdaruzen.com/product/${p.id}`,
        name: p.name,
        image: `https://drdaruzen.com${p.image}`,
      })),
    },
  };

  return (
    <>
      <SEOHead
        title="Каталог витаминов и добавок Daruzen — Витамины, минералы, БАД | drdaruzen.com"
        description="Каталог премиальных витаминов, минералов и добавок Daruzen. BSO мармеладки, Омега-3, магний, мультивитамины и другие натуральные добавки из Турции."
        keywords="Daruzen каталог, витамины, турецкие витамины, витамины из Турции, добавки, БАД, БАДы из Турции, дарузен, омега 3, магний, мультивитамины, минералы, натуральные добавки, турецкие добавки, витамины купить, где заказать оригинальные турецкие бады, турецкие витамины официальный дистрибьютор, витамины из турции с доставкой недорого, купить сертифицированные БАДы из стамбула, интернет магазин витаминов напрямую из турции"
        canonical="https://drdaruzen.com/catalog"
        jsonLd={jsonLd}
      />

      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', alignItems: 'center', paddingTop: '120px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="hero-title">{t.catalog.title}</h1>
        </div>
      </section>

      <section id="catalog" className="section-padding" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
            {categoryKeys.map(cat => (
              <div
                key={cat}
                className={selectedCategory === cat ? 'chip active' : 'chip'}
                onClick={() => setSelectedCategory(cat)}
                style={{ borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                {getCategoryLabel(lang, cat)}
              </div>
            ))}
          </div>

          <div className="grid-catalog">
            {visibleProducts.map((product) => (
              <motion.div
                key={product.id}
                className="product-card"
                style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
                onClick={() => onSelectProduct(product)}
              >
                <div className="product-image-container">
                  <div className="product-image-bg" style={{ backgroundImage: `url(${product.image})` }} role="img" aria-label={product.name} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '6px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: '8px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--primary-dark)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    {product.category}
                  </div>
                  {isNewProduct(product) && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'linear-gradient(135deg, #e5484d 0%, #c0392b 100%)', color: '#fff', padding: '8px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '900', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Новое
                    </span>
                  )}
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 className="product-card-title">{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span className="product-card-price">{formatPrice(product.price, lang)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                      className="btn-primary"
                      style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {pageCount > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.4 : 1, fontWeight: '600' }}>
                ← {t.catalog.prev}
              </button>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{page + 1} / {pageCount}</span>
              <button onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', cursor: page >= pageCount - 1 ? 'default' : 'pointer', opacity: page >= pageCount - 1 ? 0.4 : 1, fontWeight: '600' }}>
                {t.catalog.next} →
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

      <nav aria-label="Breadcrumb" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>
        <ol style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--text-muted)', listStyle: 'none', padding: 0 }}>
          <li><a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Главная</a></li>
          <li>/</li>
          <li>Каталог</li>
        </ol>
      </nav>
    </>
  );
};

export default CatalogPage;
