import React, { useState, useEffect, useRef, useMemo, useLayoutEffect, startTransition } from 'react';
import { 
  ShoppingCart, 
  Search, 
  X, 
  Send, 
  MessageCircle, 
  Plus,
  Minus,
  Trash2,
  Menu as BurgerMenu,
  //ArrowRight,
  ShieldCheck,
  Award,
  FlaskConical,
  MapPin,
  Mail,
  Phone,
  //Check
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { categoryKeys, products, getCategoryLabel, localizeProducts, dedupeProducts, type LocalizedProduct, type CategoryKey, type Product } from './data';
import { useLang, LANGS, formatPrice } from './i18n';
import { fetchProducts, supabase } from './lib/supabase';

import AppStyles from './AppStyles';
import QtyButton from './components/QtyButton';
import AdminPanel from './components/AdminPanel';
import RecoveryPage from './components/RecoveryPage';

const App: React.FC = () => {
  const { lang, setLang, t } = useLang();
  const isRtl = lang === 'ar';
  const [cart, setCart] = useState<{ product: LocalizedProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LocalizedProduct | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [productTab, setProductTab] = useState(0);
  const swipeStartX = useRef(0);
  const swipeContentRef = useRef<HTMLDivElement | null>(null);
  const [swipeHeight, setSwipeHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!selectedProduct) {
      setSwipeHeight(undefined);
      return;
    }
    const el = swipeContentRef.current;
    if (!el) return;
    const update = () => setSwipeHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [selectedProduct, productTab]);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  useEffect(() => {
    if (selectedProduct === null) {
      setModalQuantity(1);
    } else {
      setProductTab(0);
    }
  }, [selectedProduct]);
  //const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  // Состояния для формы контактов (ИСПРАВЛЯЮТ БЕЛЫЙ ЭКРАН)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const trainCategories = useMemo(() => categoryKeys.filter(cat => cat !== 'all'), []);
  const [productsData, setProductsData] = useState<Product[]>(() => dedupeProducts(products));
  useEffect(() => {
    let active = true;
    fetchProducts()
      .then(data => { if (active && data.length) setProductsData(dedupeProducts(data)); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
        if (!active) return;
        try {
          const data = await fetchProducts();
          if (active && data.length) setProductsData(dedupeProducts(data));
        } catch {}
      })
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const interval = setInterval(async () => {
      if (!active) return;
      try {
        const data = await fetchProducts();
        if (active && data.length) setProductsData(dedupeProducts(data));
      } catch {}
    }, 15000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    const onVisibility = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const data = await fetchProducts();
          if (data.length) setProductsData(dedupeProducts(data));
        } catch {}
      }
    };
    const onFocus = async () => {
      try {
        const data = await fetchProducts();
        if (data.length) setProductsData(dedupeProducts(data));
      } catch {}
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
    };
  }, []);
  const localizedProducts = useMemo(() => localizeProducts(lang, productsData), [lang, productsData]);

  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  // Бегущая строка крутится бесконечно и занимает композитор — ставим паузу,
  // когда она вне экрана, чтобы не воровать FPS у скролла на слабых устройствах
  useEffect(() => {
    const el = marqueeTrackRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { scrollY } = useScroll();
  
  // Ограничиваем диапазон работы трансформаций, чтобы не считать лишнего внизу сайта
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0], { clamp: true });
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.96], { clamp: true });

  useEffect(() => {
    const isLocked = isMobileMenuOpen || isCartOpen || selectedProduct !== null;
    const root = document.documentElement;
    // Лёгкий лок без position:fixed: не сбрасывает позицию скролла и не
    // вызывает reflow/прыжок на мобильных (главный источник лагов меню/модалок)
    if (isLocked) {
      root.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      root.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      root.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen, isCartOpen, selectedProduct]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    return localizedProducts.filter(p => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = query === '' || 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || p.categoryKey === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, localizedProducts]);

  useEffect(() => { setPage(0); }, [selectedCategory, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const didMountPage = useRef(true);
  useEffect(() => {
    if (didMountPage.current) { didMountPage.current = false; return; }
    const el = document.getElementById('catalog');
    if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 80), behavior: 'auto' });
  }, [page]);

  const addToCart = (product: LocalizedProduct, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
    setSelectedProduct(null);
  };

  // Универсальная функция прокрутки к результатам
  const scrollToCatalog = () => {
    // Скроллим к паровозу, чтобы он и каталог были видны вместе
    const marqueeSection = document.getElementById('marquee-results');
    if (marqueeSection) {
      const targetY = marqueeSection.offsetTop - 80; // Учитываем высоту шапки
      window.scrollTo({ top: targetY, behavior: 'auto' });
    }
  };

  const handleCategorySelect = (category: 'all' | CategoryKey) => {
    // Используем startTransition, чтобы не блокировать UI при переключении фильтров
    startTransition(() => {
      setSelectedCategory(category);
      setSearchQuery('');
    });
    
    // Скролл запускаем сразу, но без задержек от рендера
    scrollToCatalog();
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement> | null, targetId: string) => {
    if (e) e.preventDefault();
    
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }

    const element = targetId === 'top' ? null : document.getElementById(targetId);
    const targetY = element ? element.offsetTop - 80 : 0;
    
    // Нативный плавный скролл (крутится на стороне композитора — без rAF-нагрузки на основной поток)
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const buyNow = (product: LocalizedProduct, quantity: number) => {
    const name = product.name;
    const message = encodeURIComponent(`${t.cart.buyNowGreeting}\n\n• ${name} x${quantity} - ${formatPrice(product.price * quantity, lang)}\n\n${t.cart.orderTotal}: ${formatPrice(product.price * quantity, lang)}`);
    const phone = '905510485725'; 
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const generateOrderMessage = () => {
    const itemsList = cart.map(item => `• ${item.product.name} x${item.quantity} - ${formatPrice(item.product.price * item.quantity, lang)}`).join('\n');
    return encodeURIComponent(`${t.cart.orderGreeting}\n\n${itemsList}\n\n${t.cart.orderTotal}: ${formatPrice(totalAmount, lang)}`);
  };

  const shopOnWhatsApp = () => {
    const phone = '905510485725'; 
    window.open(`https://wa.me/${phone}?text=${generateOrderMessage()}`, '_blank');
  };

  const shopOnTelegram = () => {
    const username = 'Marwa_badi_istanbul'; 
    window.open(`https://t.me/${username}?text=${generateOrderMessage()}`, '_blank');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { // Имитация работы сервера
      setIsSubmitting(false);
      setIsSubmitted(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const totalItemsCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (typeof window !== 'undefined') {
    const h = window.location.hash;
    if (h.includes('access_token') && h.includes('type=recovery')) {
      return <RecoveryPage />;
    }
  }

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return <AdminPanel />;
  }

  return (
    <div className="app-shell">
      {/* Meta tags для мобильного приложения */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (display-mode: standalone) {
          .header { padding-top: env(safe-area-inset-top); }
        }
      `}} />
      {/* Navigation */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="header-left-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="md-hidden burger-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <BurgerMenu size={22} color="var(--primary)" />
            </button>
            <div 
              onClick={(e) => handleNavClick(e, 'top')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
               <img 
                src="/images/dr.svg.png" 
                alt="Daruzen Logo"
                className="header-logo" 
              />
            </div>
          </div>

          <nav className="desktop-nav" style={{ display: 'flex', gap: '35px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <a href="#" className="nav-link" onClick={(e) => handleNavClick(e, 'top')}>{t.nav.home}</a>
            <a href="#catalog" className="nav-link" onClick={(e) => handleNavClick(e, 'catalog')}>{t.nav.catalog}</a>
            <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>{t.nav.about}</a>
            <a href="#contacts" className="nav-link" onClick={(e) => handleNavClick(e, 'contacts')}>{t.nav.contacts}</a>
          </nav>

          <div className="header-right-group" style={{ display: 'flex', alignItems: 'center', gap: '18px', justifyContent: 'flex-end' }}>
            <div className="lang-switch" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                onClick={() => setIsLangOpen(o => !o)}
                className="lang-btn active"
                title={LANGS.find(l => l.code === lang)?.label}
                aria-haspopup="true"
                aria-expanded={isLangOpen}
                style={{ fontSize: '20px', lineHeight: 1 }}
              >
                {LANGS.find(l => l.code === lang)?.flag}
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <>
                    <motion.div
                      key="lang-backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsLangOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 1190 }}
                    />
                    <motion.div
                      key="lang-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="lang-dropdown"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        insetInlineEnd: 0,
                        background: '#fff',
                        borderRadius: '14px',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.14)',
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        zIndex: 1200,
                        minWidth: '150px',
                      }}
                    >
                      {LANGS.map(l => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                          className={`lang-dropdown-item ${lang === l.code ? 'active' : ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: lang === l.code ? 'rgba(0,0,0,0.06)' : 'none',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            fontSize: '14px',
                            color: 'var(--primary-dark)',
                            textAlign: 'left',
                            outline: 'none',
                          }}
                        >
                          <span style={{ fontSize: '18px' }}>{l.flag}</span>
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setIsSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--primary)' }}>
              <Search size={18} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="header-cart-btn"
              style={{ 
                position: 'relative',
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                gap: '10px',
                padding: '8px',
                transform: 'translateY(-1px)'
              }}
            >
              <ShoppingCart size={22} color="var(--primary)" />
              <AnimatePresence mode="wait">
                {cart.length > 0 && (
                  <motion.span 
                    key={totalItemsCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="cart-badge"
                    style={{ 
                      position: 'absolute',
                      top: '-2px',
                      right: '-4px',
                      background: 'var(--accent-light)', 
                      color: 'var(--primary-dark)', 
                      fontSize: '10px', 
                      fontWeight: '900', 
                      padding: '1px 6px',
                      borderRadius: '100px',
                      boxShadow: '0 2px 6px rgba(237, 196, 77, 0.5)',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.2'
                    }}
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content-wrapper">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} // Еще быстрее и энергичнее
            className="hero-text-container"
          >
            <h1 className="hero-title">
              {t.hero.titlePre} <br className="md-hidden" />{t.hero.titleAccent.split(/(Daruzen)/).map((part, i) => part === 'Daruzen' ? (<span key={i} style={{ background: 'linear-gradient(135deg, #e6bd63 0%, #cf9b41 55%, #b9822f 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent', display: 'inline-block' }}>Daruzen</span>) : (<span key={i} style={{ color: 'var(--primary)' }}>{part}</span>))}
            </h1>
            <p className="hero-description">
              {t.hero.description}
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={(e) => handleNavClick(e, 'catalog')}>
                {t.hero.cta}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Truly Infinite Keyword Train */}
      <motion.section 
        id="marquee-results"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="marquee-section"
      >
        <div className="keyword-train" style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          display: 'flex',
          padding: '30px 0' 
        }}>
          {/* Фикс лагов: заменяем CSS mask на наложения (overlays) */}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '15%', background: 'linear-gradient(to right, var(--bg-main), transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '15%', background: 'linear-gradient(to left, var(--bg-main), transparent)', zIndex: 2, pointerEvents: 'none' }} />
          
          <div
            ref={marqueeTrackRef}
            className="keyword-train-track"
            style={{ 
              display: 'flex', 
              width: 'max-content',
              alignItems: 'center',
            }}
          >
            {/* 3 набора гарантируют отсутствие пустоты и плавный стык */}
            {[...Array(3)].map((_, groupIdx) => (
              <div key={groupIdx} style={{ display: 'flex', alignItems: 'center' }}>
                {trainCategories.map((cat, idx) => (
                  <div 
                    key={`${cat}-${groupIdx}-${idx}`} 
                    className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat)}
                    style={{ 
                      minWidth: 'max-content', 
                      background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                      border: 'none',
                      color: selectedCategory === cat ? 'white' : 'var(--primary)',
                      fontWeight: '700',
                      fontSize: 'clamp(20px, 5vw, 32px)', // Резиновый шрифт для паровоза
                      letterSpacing: '-0.02em',
                      padding: '10px 50px',
                      cursor: 'pointer',
                    }}
                  >
                    {getCategoryLabel(lang, cat)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Catalog */}
      <section id="catalog" className="section-padding" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="catalog-header">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="product-card"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-image-container">
                    <img
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
                          addToCart(product);
                        }}
                        className="btn-primary"
                        style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
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
                {isRtl ? '→ السابق' : '← Назад'}
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
                {isRtl ? 'التالي ←' : 'Далее →'}
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

      {/* About Us Section */}
      <section id="about" className="section-padding" style={{ background: '#F9F9FB' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', marginBottom: '60px' }}>
            <h2 className="section-title">{t.about.titlePre} <br /><span style={{ color: 'var(--accent)' }}>{t.about.titleAccent}</span></h2>
            <p style={{ fontSize: '20px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {t.about.desc}
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[ShieldCheck, FlaskConical, Award].map((Icon, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                style={{ background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid var(--border)' }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: '24px' }}><Icon size={32} /></div>
                <h4 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary-dark)' }}>{t.about.features[i].title}</h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{t.about.features[i].desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professor Section */}
      <section className="section-padding" style={{ background: '#F9F9FB', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '48px', flexDirection: 'row' }}>
            <div style={{ flex: '0 0 auto', position: 'relative' }}>
              <div style={{ width: '180px', height: '180px', borderRadius: '50%', padding: '6px', background: 'linear-gradient(135deg, #e6bd63 0%, #cf9b41 100%)', flexShrink: 0 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#fff' }}>
                  <img src="/images/professor.png" alt="Professor" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #e6bd63 0%, #cf9b41 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '800', border: '3px solid #F9F9FB' }}>✓</div>
            </div>
            <div style={{ flex: 1, minWidth: 0, borderLeft: '3px solid rgba(212, 175, 55, 0.3)', paddingLeft: '48px' }}>
              <p style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.professor.subtitle}</p>
              <h3 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary-dark)', lineHeight: '1.2' }}>{t.professor.title}</h3>
              <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                {t.professor.description}
              </p>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .professor-section-inner {
              flex-direction: column !important;
              text-align: center;
            }
            .professor-section-inner > div:first-child {
              margin-bottom: 24px;
            }
            .professor-section-inner > div:last-child {
              border-left: none !important;
              padding-left: 0 !important;
              border-top: 3px solid rgba(212, 175, 55, 0.3);
              padding-top: 24px;
            }
          }
        `}</style>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="section-padding">
        <div className="container">
          <div className="contacts-grid">
            <div>
              <h2 className="section-title">{t.contacts.titlePre} <br />{t.contacts.titleAccent}</h2>
              <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '48px' }}>{t.contacts.desc}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><MapPin size={24} /></div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{t.contacts.office}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{t.contacts.officeAddr}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><Mail size={24} /></div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{t.contacts.email}</div>
                     <a href={`mailto:${t.contacts.emailAddr}`} style={{ color: 'inherit', textDecoration: 'none' }}>{t.contacts.emailAddr}</a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><Phone size={24} /></div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{t.contacts.phone}</div>
                     <a href="tel:+905510485725" style={{ color: 'inherit', textDecoration: 'none' }}>{t.contacts.phoneNum}</a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '40px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-dark)', marginLeft: '4px' }}>{t.contacts.form.nameLabel}</label>
                  <input 
                    required
                    type="text" 
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    placeholder={t.contacts.form.namePlaceholder} 
                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border)', background: '#FDFBFA', fontSize: '16px', outline: 'none' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-dark)', marginLeft: '4px' }}>{t.contacts.form.emailLabel}</label>
                  <input 
                    required
                    type="email" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder={t.contacts.form.emailPlaceholder} 
                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border)', background: '#FDFBFA', fontSize: '16px', outline: 'none' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-dark)', marginLeft: '4px' }}>{t.contacts.form.msgLabel}</label>
                  <textarea 
                    rows={4} 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder={t.contacts.form.msgPlaceholder} 
                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border)', background: '#FDFBFA', fontSize: '16px', outline: 'none', resize: 'none' }} 
                  ></textarea>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || isSubmitted}
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '60px', marginTop: '10px', background: isSubmitted ? '#25D366' : 'var(--primary)' }}
                >
                  {isSubmitting ? t.contacts.form.submitting : isSubmitted ? t.contacts.form.submitted : t.contacts.form.submit}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </section>

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
                  <div style={{ textAlign: 'center', marginTop: '56px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#F5F5F7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <ShoppingCart size={32} color="#D1D1D6" />
                    </div>
                    <p style={{ color: '#86868B', fontSize: '17px', fontWeight: '500' }}>{t.cart.empty}</p>
                  </div>
                ) : (
                  cart.map(item => (() => { const localizedProduct = item.product; return (
                      <motion.div 
                      layout
                      key={item.product.id} 
                      className="cart-drawer-item"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px', background: 'none', padding: '16px 0', borderBottom: '1px solid var(--border)' }}
                    >
                      <div className="cart-drawer-item-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={localizedProduct.image} className="cart-item-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '4px', lineHeight: '1.3', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{localizedProduct.name}</div>
                         <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '20px' }}>{formatPrice(localizedProduct.price, lang)}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#F5F5F7', padding: '4px 12px', borderRadius: '10px' }}>
                            <QtyButton label="-" onClick={() => updateQuantity(item.product.id, -1)}>
                              <Minus size={14} />
                            </QtyButton>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 0.4, opacity: 0.3 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                              style={{ fontWeight: '700', fontSize: '14px', minWidth: '18px', textAlign: 'center', display: 'inline-block' }}
                            >
                              {item.quantity}
                            </motion.span>
                            <QtyButton label="+" withRotate onClick={() => updateQuantity(item.product.id, 1)}>
                              <Plus size={14} />
                            </QtyButton>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', opacity: 0.4, cursor: 'pointer', padding: '4px', transition: 'opacity 0.2s ease' }} 
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
                  {searchQuery === '' && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: 0,
                        pointerEvents: 'none',
                        color: 'var(--text-muted)',
                        opacity: 0.5,
                        fontSize: '18px',
                        fontWeight: '500',
                        fontFamily: 'inherit',
                        lineHeight: 1,
                      }}
                    >
                      {t.search.placeholder}
                    </span>
                  )}
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
                   </div>
                   <input
                     autoFocus
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         setIsSearchOpen(false);
                         scrollToCatalog();
                       }
                     }}
                     style={{
                       position: 'absolute',
                       inset: 0,
                       width: '100%',
                       height: '100%',
                       border: 'none',
                       background: 'transparent',
                       outline: 'none',
                       color: 'transparent',
                       caretColor: 'var(--accent)',
                       fontFamily: 'inherit',
                       fontSize: '18px',
                       fontWeight: '500',
                       padding: 0,
                     }}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => {
                      if (searchQuery) setSearchQuery('');
                      else setIsSearchOpen(false);
                    }}
                    style={{
                      flex: '0 0 auto',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      marginLeft: '2px',
                      color: 'var(--primary)',
                      opacity: 0.5,
                    }}
                  >
                    <X size={20} />
                  </button>
               </motion.div>
            </motion.div>
            )}
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
                width: 'clamp(300px, 94vw, 800px)', 
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
                      position: 'absolute', top: '16px', ...(isRtl ? { right: '16px' } : { left: '16px' }),
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
                  
                   <div className="modal-tabs">
                     <button type="button" className={`modal-tab ${productTab === 0 ? 'active' : ''}`} onClick={() => setProductTab(0)}>{t.modal.description}</button>
                     <button type="button" className={`modal-tab ${productTab === 1 ? 'active' : ''}`} onClick={() => setProductTab(1)}>{t.modal.composition}</button>
                   </div>
                    <motion.div
                      className="modal-swipe"
                      onPointerDown={(e) => { swipeStartX.current = e.clientX; }}
                      onPointerUp={(e) => {
                        const dx = e.clientX - swipeStartX.current;
                        if (Math.abs(dx) < 30) return;
                        setProductTab((t) => (dx < 0 ? Math.min(1, t + 1) : Math.max(0, t - 1)));
                      }}
                      animate={{ height: swipeHeight ?? 'auto' }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      style={{ position: 'relative', overflow: 'hidden' }}
                    >
                      <div ref={swipeContentRef} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                      <AnimatePresence mode="wait" initial={false}>
                        {productTab === 0 ? (
                          <motion.div
                            key="desc"
                            className="modal-panel"
                            initial={{ x: -24, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -24, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="modal-desc" style={{ color: 'var(--text-muted)', lineHeight: '1.6', opacity: 0.9 }}>{selectedProduct.description}</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="comp"
                            className="modal-panel"
                            initial={{ x: 24, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 24, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <table className="modal-comp-table">
                              <tbody>
                                {selectedProduct.specs?.map((spec, i) => (
                                  <tr key={spec}>
                                    <td>{i + 1}</td>
                                    <td>{spec}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      </div>
                    </motion.div>
                   
                   <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--primary-dark)' }}>{t.modal.quantity}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', background: '#F5F5F7', padding: '8px 18px', borderRadius: '12px' }}>
                        <QtyButton label="-" onClick={() => setModalQuantity(q => Math.max(1, q - 1))}>
                          <Minus size={18} />
                        </QtyButton>
                        <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center', fontSize: '18px' }}>{modalQuantity}</span>
                        <QtyButton label="+" withRotate onClick={() => setModalQuantity(q => q + 1)}>
                          <Plus size={18} />
                        </QtyButton>
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
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
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
      </footer>

      {/* CSS for components not using inline styles */}
      <AppStyles />
    </div>
  );
};
export default App;
