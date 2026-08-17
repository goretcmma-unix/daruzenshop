import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, AlertTriangle, Pill, Snowflake } from 'lucide-react';
import { products, localizeProducts, dedupeProducts, type Product } from '../data';
import { useLang, formatPrice } from '../i18n';
import { fetchProducts } from '../lib/supabase';
import { SEOHead } from '../seo/SEOHead';
import { FadeInImage } from '../components/FadeInImage';

interface ProductPageProps {
  onAddToCart: (product: any, qty: number) => void;
  onBuyNow: (product: any, qty: number) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ onAddToCart, onBuyNow }) => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLang();
  const [quantity, setQuantity] = useState(1);

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
      <div style={{ textAlign: 'center', padding: '200px 20px' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--text-muted)' }}>Товар не найден</h1>
        <a href="/catalog" style={{ color: 'var(--primary)', marginTop: '16px', display: 'inline-block' }}>← Вернуться в каталог</a>
      </div>
    );
  }

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

      <section style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
            <ol style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--text-muted)', listStyle: 'none', padding: 0, flexWrap: 'wrap' }}>
              <li><Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Главная</Link></li>
              <li>/</li>
              <li><Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Каталог</Link></li>
              <li>/</li>
              <li>{product.name}</li>
            </ol>
          </nav>

          <div className="product-page-grid">
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ background: '#FDFBFA', borderRadius: '24px', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FadeInImage
                  src={product.image}
                  alt={product.name}
                  style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                  decoding="async"
                />
              </div>
              <img src="/images/label_certificates.webp" alt="Сертификаты Daruzen" style={{ width: '100%', marginTop: '16px', borderRadius: '12px' }} />
            </div>

            <div>
              <span style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                {product.category}
              </span>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '700', color: 'var(--primary-dark)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '12px 0 8px' }}>
                {product.name}
              </h1>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', marginBottom: '32px' }}>
                {formatPrice(product.price, lang)}
              </div>

              <div style={{ lineHeight: 1.8, color: 'var(--text-muted)', fontSize: '16px', marginBottom: '40px' }}>
                {product.description}
              </div>

              {product.specs && product.specs.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '16px' }}>{t.modal.composition}</h2>
                  <div style={{ background: '#FDFBFA', borderRadius: '16px', padding: '20px', overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <tbody>
                        {product.specs.map((row: string, i: number) => {
                          const cells = row.split('|').filter((c: string) => c.trim());
                          return (
                            <tr key={i} style={{ borderBottom: i < product.specs!.length - 1 ? '1px solid var(--border)' : 'none' }}>
                              {cells.map((cell: string, ci: number) => (
                                <td key={ci} style={{ padding: '10px 12px', color: 'var(--text-muted)', fontWeight: i === 0 ? '600' : '400' }}>
                                  {cell.replace(/\*\*/g, '').trim()}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F5F7', padding: '4px 16px', borderRadius: '12px' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}><Minus size={16} /></button>
                  <span style={{ fontWeight: '700', fontSize: '16px', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}><Plus size={16} /></button>
                </div>
                <button onClick={() => onAddToCart(product, quantity)} className="btn btn-primary" style={{ height: '48px', borderRadius: '14px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={18} /> {t.cart.inCart}
                </button>
                <button onClick={() => onBuyNow(product, quantity)} style={{ height: '48px', borderRadius: '14px', padding: '0 24px', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t.cart.buyNow}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
