import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, startTransition } from 'react';
import { 
  ShoppingCart, 
  Search, 
  X, 
  Send, 
  MessageCircle, 
  Plus,
  Minus,
  Trash2,
  //ArrowRight,
  MapPin,
  Mail,
  Phone,
  //Check,
  ShieldCheck,
  FlaskConical,
  Award,
  Sparkles,
  LayoutGrid,
  ChevronRight,
  ChevronDown,
  Pill,
  Snowflake,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useAnimationControls } from 'framer-motion';
import { categoryKeys, products, getCategoryLabel, localizeProducts, dedupeProducts, isNewProduct, type LocalizedProduct, type CategoryKey, type Product } from './data';
import { useLang, LANGS, formatPrice } from './i18n';
import { fetchProducts, supabase } from './lib/supabase';

import AppStyles from './AppStyles';
import QtyButton from './components/QtyButton';
import AdminPanel from './components/AdminPanel';
import RecoveryPage from './components/RecoveryPage';
import { NormalizedImg } from './components/NormalizedImg';
import { CompositionPanel } from './components/CompositionView';
import { useNormalizedImage } from './lib/normalizeImage';

const getAvailableTabs = (p: { specs?: unknown[]; note?: string } | null): ('product' | 'composition' | 'note')[] => [
  'product',
  ...(p?.specs && p.specs.length > 0 ? (['composition'] as const) : []),
  ...(p?.note ? (['note'] as const) : []),
];

const App: React.FC = () => {
  const { lang, setLang, t } = useLang();
  const isRtl = lang === 'ar';
  const [cart, setCart] = useState<{ product: LocalizedProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuCatalogOpen, setIsMenuCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [selectedProduct, setSelectedProduct] = useState<LocalizedProduct | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [activeMobileTab, setActiveMobileTab] = useState<'product' | 'composition' | 'note'>('product');
  const switchTab = (next: 'product' | 'composition' | 'note') => {
    setActiveMobileTab(next);
  };
  const modalTabsTrackRef = useRef<HTMLDivElement>(null);
  const tabBuyRef = useRef<HTMLDivElement>(null);
  const modalTouchYRef = useRef<number | null>(null);
  const selectedProductImage = useNormalizedImage(selectedProduct?.image);
  const navClickRef = useRef(false);

  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  useEffect(() => {
    if (selectedProduct === null) {
      setModalQuantity(1);
    }
    setActiveMobileTab('product');
  }, [selectedProduct]);

  useEffect(() => {
    const track = modalTabsTrackRef.current;
    if (track) {
      const pane = track.querySelector<HTMLElement>('.modal-tab-pane.is-active');
      if (pane) pane.scrollTop = 0;
    }
  }, [activeMobileTab]);

  useLayoutEffect(() => {
    if (!selectedProduct || activeMobileTab !== 'product') return;
    const pane = document.querySelector<HTMLElement>('.modal-tab-pane[data-tab="product"]');
    const viewport = document.querySelector<HTMLElement>('.modal-tabs-viewport');
    if (!pane || !viewport) return;
    const update = () => {
      const scrollable = pane.scrollHeight > pane.clientHeight + 1;
      viewport.style.maskImage = scrollable ? '' : 'none';
      viewport.style.webkitMaskImage = scrollable ? '' : 'none';
    };
    update();
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    const timers = [350, 700, 1400].map((ms) => window.setTimeout(update, ms));
    const img = pane.querySelector<HTMLImageElement>('img');
    const onImgLoad = () => update();
    if (img) {
      if (!img.complete) img.addEventListener('load', onImgLoad, { once: true });
      else onImgLoad();
    }
    return () => {
      window.removeEventListener('resize', onResize);
      timers.forEach((t) => window.clearTimeout(t));
      if (img) img.removeEventListener('load', onImgLoad);
      viewport.style.maskImage = '';
      viewport.style.webkitMaskImage = '';
    };
  }, [selectedProduct, activeMobileTab]);
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
      .on('postgres_changes', { event: '*' as const, schema: 'public', table: 'products' }, async () => {
        if (!active) return;
        try {
          const data = await fetchProducts();
          if (active && data.length) setProductsData(dedupeProducts(data));
        } catch { /* ignore */ }
      })
      .subscribe();
    return () => {
      active = false;
      if (channel && supabase) {
        try { supabase.removeChannel(channel); } catch { /* ignore */ }
      }
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

  useEffect(() => {
    const header = document.querySelector('header');
    const headerH = header?.offsetHeight || 80;
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (navClickRef.current) return;
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) {
          let best = visible[0].target.id;
          let bestTop = visible[0].boundingClientRect.top;
          visible.forEach(e => {
            if (e.boundingClientRect.top < bestTop) { bestTop = e.boundingClientRect.top; best = e.target.id; }
          });
          setActiveSection(best);
        }
      },
      { threshold: 0, rootMargin: `-${headerH}px 0px -40% 0px` }
    );
    sections.forEach(s => io.observe(s));

    const onScrollEnd = () => { navClickRef.current = false; };
    window.addEventListener('scrollend', onScrollEnd, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scrollend', onScrollEnd); };
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = localizedProducts.filter(p => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = query === '' || 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || p.categoryKey === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    // Новые товары показываем первыми
    return [...filtered].sort((a, b) => {
      const aNew = isNewProduct(a) ? 1 : 0;
      const bNew = isNewProduct(b) ? 1 : 0;
      if (aNew !== bNew) return bNew - aNew;
      // Остальные — по дате создания (новые выше), затем по имени
      const aDate = a.createdAt ?? 0;
      const bDate = b.createdAt ?? 0;
      if (aDate !== bDate) return bDate - aDate;
      return a.name.localeCompare(b.name);
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
      return [...prev, { product: product as any, quantity }];
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
    navClickRef.current = true;
    setTimeout(() => { navClickRef.current = false; }, 800);
    setActiveSection(targetId);
    
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }

    const element = targetId === 'top' ? null : document.getElementById(targetId);
    const targetY = element ? element.offsetTop - 80 : 0;
    
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
    const price = product.price;
    const message = encodeURIComponent(`${t.cart.buyNowGreeting}\n\n• ${name} x${quantity} - ${formatPrice(price * quantity, lang)}\n\n${t.cart.orderTotal}: ${formatPrice(price * quantity, lang)}`);
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
    const appLink = `tg://resolve?domain=vitamini_optom&text=${generateOrderMessage()}`;
    const webLink = `https://t.me/vitamini_optom?text=${generateOrderMessage()}`;
    const t0 = Date.now();
    window.location.href = appLink;
    setTimeout(() => {
      const handled = document.hidden || Date.now() - t0 < 1200;
      if (!handled) {
        window.location.href = webLink;
      }
    }, 1800);
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
         <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 'none', paddingLeft: '40px', paddingRight: '40px' }}>
          <div className="header-left-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="md-hidden burger-btn" onClick={() => setIsMobileMenuOpen(true)} aria-label="Menu">
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" style={{ display: 'block' }}>
                <line className="b-line b-line-top" x1="3.5" y1="6" x2="20.5" y2="6" />
                <line className="b-line b-line-mid" x1="3.5" y1="12" x2="20.5" y2="12" />
                <line className="b-line b-line-bot" x1="3.5" y1="18" x2="20.5" y2="18" />
              </svg>
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
            <a href="#" className={`nav-link${activeSection === 'top' ? ' active' : ''}`} onClick={(e) => handleNavClick(e, 'top')}>{t.nav.home}</a>
            <a href="#catalog" className={`nav-link${activeSection === 'catalog' ? ' active' : ''}`} onClick={(e) => handleNavClick(e, 'catalog')}>{t.nav.catalog}</a>
            <a href="#about" className={`nav-link${activeSection === 'about' ? ' active' : ''}`} onClick={(e) => handleNavClick(e, 'about')}>{t.nav.about}</a>
            <a href="#contacts" className={`nav-link${activeSection === 'contacts' ? ' active' : ''}`} onClick={(e) => handleNavClick(e, 'contacts')}>{t.nav.contacts}</a>
          </nav>

          <div className="header-right-group" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
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
                justifyContent: 'center',
                padding: '6px',
                width: '36px',
                height: '36px'
              }}
            >
              <ShoppingCart size={20} color="var(--primary)" />
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
            <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
              <div
                onClick={() => setIsLangOpen(o => !o)}
                title={LANGS.find(l => l.code === lang)?.label}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', cursor: 'pointer', borderRadius: '50%' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', overflow: 'hidden' }}>
                  <img src={LANGS.find(l => l.code === lang)?.flag} alt={lang} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
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
                        <motion.div
                          key={l.code}
                          onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                          whileHover={{ background: 'rgba(0,0,0,0.06)' }}
                          transition={{ duration: 0.15 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: lang === l.code ? 'rgba(0,0,0,0.06)' : 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            fontSize: '14px',
                            color: 'var(--primary-dark)',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={l.flag} alt={l.code} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </div>
                          <span>{l.label}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setIsSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', width: '36px', height: '36px', color: 'var(--primary)' }}>
              <Search size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
      {/* Hero Section */}
            <section className="hero-section" style={{ position: 'relative' }}>
        <div className="container hero-content-wrapper">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} // Еще быстрее и энергичнее
            className="hero-text-container"
          >
            <h1 className="hero-title">
              {t.hero.titlePre.split(' ')[0]}<br />
              {t.hero.titlePre.includes(' ') && <>{t.hero.titlePre.split(' ').slice(1).join(' ')} </>}
              {t.hero.titleAccent.replace('Daruzen', '').trim()}<br className="hero-br-line3" />{' '}
              <span style={{ background: 'linear-gradient(135deg, #e6bd63 0%, #cf9b41 55%, #b9822f 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent', display: 'inline-block' }}>Daruzen</span>
            </h1>
            <p className="hero-description">
              {t.hero.description.split(' ').length > 2 ? (
                <>{t.hero.description.split(' ').slice(0, -4).join(' ')} <br className="hero-desc-br3" />{t.hero.description.split(' ').slice(-4, -2).join(' ')} <br className="hero-desc-br" />{t.hero.description.split(' ').slice(-2).join(' ')}</>
              ) : t.hero.description}
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
                  onClick={() => setSelectedProduct(product)}
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
                        Новое
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
                        Нет в наличии
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
                          if (product.inStock !== false) addToCart(product);
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

      {/* About Us Section */}
      <section id="about" className="section-padding" style={{ background: 'linear-gradient(180deg, #FDFBFA 0%, #F6F1EA 100%)', paddingTop: '80px' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '-20px auto 40px', textAlign: 'center' }}>
            <motion.h2
              className="section-title"
              style={{ marginBottom: '24px', lineHeight: 1.15, display: 'inline-block' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            >
              {t.about.titlePre.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: wi === t.about.titlePre.split(' ').length - 1 ? '0.16em' : '0.22em' }}
                  variants={{ hidden: { opacity: 0, y: 16, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } } }}
                >
                  {word}
                </motion.span>
              ))}
              <span style={{ color: 'var(--accent)' }}>
                {t.about.titleAccent.split(' ').map((word, wi) => (
                  <motion.span
                    key={wi}
                    style={{ display: 'inline-block', marginRight: wi === t.about.titleAccent.split(' ').length - 1 ? 0 : '0.22em' }}
                    variants={{ hidden: { opacity: 0, y: 16, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } } }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h2>
            <motion.p
              style={{ fontSize: '20px', color: 'var(--text-muted)', lineHeight: '1.7' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.015 } } }}
            >
              {t.about.desc.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </div>

          {/* Три принципа: трендовые прогресс-бары */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '100px' }}>
            {[ShieldCheck, FlaskConical, Award].map((Icon, i) => (
              <AboutFeatureCard
                key={i}
                Icon={Icon}
                title={t.about.features[i].title}
                pct={100}
                desc={t.about.features[i].desc}
                delay={i * 0.1}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Секция: Качество и безопасность */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, #FDF9F2 0%, #FFFFFF 50%, #FAF3E7 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <motion.h2
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: 'var(--primary-dark)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '24px' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-80px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
            >
              {t.about.brand.items[0].title.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                  variants={{ hidden: { opacity: 0, y: 20, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <motion.div
              style={{ width: '64px', height: '3px', borderRadius: '999px', background: 'linear-gradient(90deg, var(--accent-light), var(--accent))', margin: '0 auto 36px' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
            <motion.p
              style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.85, color: 'var(--text-muted)', fontWeight: '400' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-40px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.012 } } }}
            >
              {t.about.brand.items[0].text.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Секция: Наша Миссия */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #FAF3E7 0%, #FDF9F2 50%, #FFFFFF 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(207,155,65,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <motion.h2
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: 'var(--primary-dark)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '24px' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-80px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
            >
              {t.about.brand.items[1].title.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                  variants={{ hidden: { opacity: 0, y: 20, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <motion.div
              style={{ width: '64px', height: '3px', borderRadius: '999px', background: 'linear-gradient(90deg, var(--accent-light), var(--accent))', margin: '0 auto 32px' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
            <motion.p
              style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.85, color: 'var(--text-muted)', fontWeight: '400' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-40px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.012 } } }}
            >
              {t.about.brand.items[1].text.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Секция: Наша Философия */}
      <section className="section-padding" style={{ background: 'linear-gradient(225deg, #FFFFFF 0%, #FDF9F2 50%, #FAF3E7 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <motion.h2
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: 'var(--primary-dark)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '24px' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-80px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
            >
              {t.about.brand.items[2].title.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                  variants={{ hidden: { opacity: 0, y: 20, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <motion.div
              style={{ width: '64px', height: '3px', borderRadius: '999px', background: 'linear-gradient(90deg, var(--accent-light), var(--accent))', margin: '0 auto 32px' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
            <motion.p
              style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.85, color: 'var(--text-muted)', fontWeight: '400' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-40px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.012 } } }}
            >
              {t.about.brand.items[2].text.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Секция: Почему Daruzen? */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #FAF3E7 0%, #FDF9F2 50%, #FFFFFF 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(207,155,65,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
            <motion.h2
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: 'var(--primary-dark)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '24px' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-80px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
            >
              {t.about.why.title.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                  variants={{ hidden: { opacity: 0, y: 20, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <motion.div
              style={{ width: '64px', height: '3px', borderRadius: '999px', background: 'linear-gradient(90deg, var(--accent-light), var(--accent))', margin: '0 auto 36px' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
            <motion.p
              style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.85, color: 'var(--text-muted)', fontWeight: '400', marginBottom: '24px' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-40px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.012 } } }}
            >
              {t.about.why.p1.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
            <motion.p
              style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.85, color: 'var(--text-muted)', fontWeight: '400' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: '-40px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.012 } } }}
            >
              {t.about.why.p2.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="section-padding">
        <div className="container">
          <div className="contacts-grid">
            <div>
              <motion.h2
                className="section-title"
                style={{ lineHeight: 1.15 }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
              >
                {t.contacts.titlePre.split(' ').map((word, wi) => (
                  <motion.span
                    key={wi}
                    style={{ display: 'inline-block', marginRight: wi === t.contacts.titlePre.split(' ').length - 1 ? '0.16em' : '0.22em' }}
                    variants={{ hidden: { opacity: 0, y: 16, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } } }}
                  >
                    {word}
                  </motion.span>
                ))}
                <span style={{ color: 'var(--accent)' }}>
                  {t.contacts.titleAccent.split(' ').map((word, wi) => (
                    <motion.span
                      key={wi}
                      style={{ display: 'inline-block', marginRight: wi === t.contacts.titleAccent.split(' ').length - 1 ? 0 : '0.22em' }}
                      variants={{ hidden: { opacity: 0, y: 16, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } } }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </motion.h2>
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
                  whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || isSubmitted}
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '60px', marginTop: '10px', ...(isSubmitted ? { background: '#25D366' } : {}) }}
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
                        <NormalizedImg src={localizedProduct.image} className="cart-item-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                 placeholder={t.search.placeholder}
                 style={{
                   flex: 1,
                   minWidth: 0,
                   width: '100%',
                   height: '100%',
                   border: 'none',
                   background: 'transparent',
                   outline: 'none',
                   color: 'var(--primary)',
                   caretColor: 'var(--accent)',
                   fontFamily: 'inherit',
                   fontSize: '18px',
                   fontWeight: '500',
                   padding: 0,
                 }}
               />
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
              exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 4000 }}
            />
            <div className="modal-shell">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="modal-layout"
              data-active-tab={activeMobileTab}
              style={{ 
                width: 'clamp(320px, 94vw, 1280px)', 
                height: '90vh',
                maxHeight: '90vh', 
                background: 'white', 
                borderRadius: '24px', 
                overflowY: 'auto',
                overflowX: 'hidden',
                overscrollBehaviorY: 'contain',
                pointerEvents: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
              }}
            >
              <div className="modal-scroll-region">
              <motion.div className="modal-image-col">
                <motion.div 
                  className="modal-image-wrapper"
                  style={{ flex: '1 1 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', position: 'relative' }}
                >
                  <motion.img 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: selectedProduct.inStock === false ? 0.3 : 1 }}
                    src={selectedProductImage}
                    loading="lazy"
                    decoding="async"
                    className="modal-image"
                    style={{ filter: selectedProduct.inStock === false ? 'grayscale(1)' : 'none' }}
                  />
                  <img src="/images/label_certificates.png" alt="Certificates" className="modal-product-media__cert-label" />
                  <motion.button 
                    whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedProduct(null); setModalQuantity(1); }} 
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
                  {selectedProduct.category}
                </motion.span>
                <motion.h2 
                  className="modal-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  style={{ fontWeight: '700', marginBottom: '16px', lineHeight: '1.15', color: 'var(--primary-dark)', letterSpacing: '-0.03em' }}
                >
                  {selectedProduct.name}
                </motion.h2>
                <motion.div 
                  className="modal-price"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  style={{ fontWeight: '700', marginBottom: '32px', color: 'var(--primary)' }}
                >
                  {formatPrice(selectedProduct.price, lang)}
                </motion.div>
                
                {/* Mobile tab bar */}
                <div className="modal-mobile-tabs">
                  <button type="button" className={`modal-mobile-tab${activeMobileTab === 'product' ? ' active' : ''}`} onClick={() => switchTab('product')}>
                    {t.modal.tabProduct}
                  </button>
                  {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                    <button type="button" className={`modal-mobile-tab${activeMobileTab === 'composition' ? ' active' : ''}`} onClick={() => switchTab('composition')}>
                      {t.modal.tabComposition}
                    </button>
                  )}
                  {selectedProduct.note && (
                    <button type="button" className={`modal-mobile-tab${activeMobileTab === 'note' ? ' active' : ''}`} onClick={() => switchTab('note')}>
                      {t.modal.tabNote}
                    </button>
                  )}
                </div>

                {/* Tab content track */}
                <div className="modal-tabs-viewport">
                <div ref={modalTabsTrackRef} className="modal-tabs-track" style={{ transform: `translateX(${(isRtl ? 1 : -1) * getAvailableTabs(selectedProduct).indexOf(activeMobileTab) * 100}%)` }}>
                  {/* Product tab */}
                  <div className={`modal-tab-pane${activeMobileTab === 'product' ? ' is-active' : ''}`} data-tab="product">
                    <div className="modal-product-media">
                      <NormalizedImg src={selectedProduct.image} className="modal-product-media__img" alt={selectedProduct.name} loading="lazy" decoding="async" />
                      <img src="/images/label_certificates.png" alt="Certificates" className="modal-product-media__cert-label" />
                      <motion.button whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={() => { setSelectedProduct(null); setModalQuantity(1); }} className="modal-tab-close" aria-label="Close">
                        <X size={16} color="var(--text-muted)" />
                      </motion.button>
                    </div>
                    <div className="modal-product-head">
                      <h3 className="modal-note-title">{selectedProduct.name}</h3>
                      <div className="modal-product-price" style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '20px', marginTop: '6px' }}>{formatPrice(selectedProduct.price, lang)}</div>
                    </div>
                    <div className="desc-card__content">
                      <p>{selectedProduct.description}</p>
                    </div>
                  </div>

                  {/* Composition tab */}
                  {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                    <div className={`modal-tab-pane${activeMobileTab === 'composition' ? ' is-active' : ''}`} data-tab="composition">
                      <div className="modal-note-media">
                        <NormalizedImg src={selectedProduct.image} className="modal-note-media__img" alt={selectedProduct.name} loading="lazy" decoding="async" />
                        <motion.button whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={() => { setSelectedProduct(null); setModalQuantity(1); }} className="modal-tab-close" aria-label="Close" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255, 255, 255, 0.7)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease' }}>
                          <X size={16} color="var(--text-muted)" />
                        </motion.button>
                      </div>
                      <CompositionPanel specs={selectedProduct.specs} t={t} />
                    </div>
                  )}

                  {/* Note tab */}
                  {selectedProduct.note && (
                    <div className={`modal-tab-pane${activeMobileTab === 'note' ? ' is-active' : ''}`} data-tab="note">
                      <div className="modal-note-media">
                        <NormalizedImg src={selectedProduct.image} className="modal-note-media__img" alt={selectedProduct.name} loading="lazy" decoding="async" />
                        <motion.button whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={() => { setSelectedProduct(null); setModalQuantity(1); }} className="modal-tab-close" aria-label="Close" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255, 255, 255, 0.7)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease' }}>
                          <X size={16} color="var(--text-muted)" />
                        </motion.button>
                      </div>
                      <div className="modal-note-head">
                        <h3 className="modal-note-title">{selectedProduct.name}</h3>
                      </div>
                      <div className="modal-note-hint">
                        <span>{t.modal.noteScrollHint}</span>
                        <ChevronDown size={14} className="modal-note-hint__icon" />
                      </div>
                      {(() => {
                        const paragraphs = selectedProduct.note.split('\n\n').map((paragraph, pi) => {
                          const trimmed = paragraph.trim();
                          const isWarning = /^(ЭТО НЕ|НЕ ЯВЛЯЕТСЯ|BU BİR|THIS IS NOT|هذا ليس)/.test(trimmed);
                          const isCaution = /^(Внимание|Dikkat|Caution|Attention|انتبه|انتباه|تحذير)/.test(trimmed);
                          const isNegated = /^(Не |НЕ |No |Do not |Don'?t |Dont |لا )/.test(trimmed);
                          const isDosage = !isNegated && /дозировк|суточная доз|способ применени|Günlük önerilen|Recommended daily|الجرعة|önerilen doz|daily dose/i.test(trimmed);
                          const isStorage = /хранени|хранить|Saklama|Storage conditions|ظروف التخزين|saklama koşulları|Store in/i.test(trimmed);
                          const type = isWarning ? 'warning' : isCaution ? 'info' : isDosage ? 'dosage' : isStorage ? 'storage' : 'info';
                          const label = isWarning ? t.modal.noteWarning : isDosage ? t.modal.noteDosage : isStorage ? t.modal.noteStorage : t.modal.noteInfo;
                          const body = isWarning ? trimmed : trimmed.replace(/^[^:]+:\s*/, '');
                          return { pi, type, label, body, isWarning };
                        });
                        const items = paragraphs.filter(p => !p.isWarning);
                        const warnings = paragraphs.filter(p => p.isWarning);
                        return (
                          <div className="modal-note-content">
                            {items.length > 0 && (
                              <div className="modal-note-table">
                                {items.map(({ pi, type, label, body }) => (
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
                {selectedProduct.inStock === false ? (
                  <div className="modal-out-of-stock" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', height: '54px', borderRadius: '14px', border: '2px solid #d5cfc6', color: '#8a8a8a', fontWeight: '600', fontSize: '15px', letterSpacing: '0.01em', background: 'transparent' }}>
                    Нет в наличии
                  </div>
                ) : (
                  <div className="modal-buy-under">
                    <div className="modal-buy-actions">
                      <div className="modal-buy-qty">
                        <QtyButton label="-" onClick={() => setModalQuantity(q => Math.max(1, q - 1))}>
                          <Minus size={18} />
                        </QtyButton>
                        <span className="modal-buy-qty__value">{modalQuantity}</span>
                        <QtyButton label="+" withRotate onClick={() => setModalQuantity(q => q + 1)}>
                          <Plus size={18} />
                        </QtyButton>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(selectedProduct, modalQuantity)}
                        className="btn btn-primary"
                        style={{ height: '54px', borderRadius: '14px', fontSize: '16px', boxShadow: '0 4px 12px rgba(93, 64, 55, 0.1)' }}
                      >
                        <ShoppingCart size={20} /> {t.cart.inCart}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => buyNow(selectedProduct, modalQuantity)}
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

              {/* Buy bar inside modal — pinned to the bottom edge on tablets, sticky on mobile */}
              <AnimatePresence>
                {selectedProduct && (
                  <motion.div
                    key="modal-tab-buy"
                    ref={tabBuyRef}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="modal-tab-buy"
                  >
                    {selectedProduct.inStock === false ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', height: '54px', borderRadius: '14px', border: '2px solid #d5cfc6', color: '#8a8a8a', fontWeight: '600', fontSize: '15px', letterSpacing: '0.01em', background: 'transparent' }}>
                        Нет в наличии
                      </div>
                    ) : (
                      <div className="modal-buy-actions">
                        <div className="modal-buy-qty">
                          <QtyButton label="-" onClick={() => setModalQuantity(q => Math.max(1, q - 1))}>
                            <Minus size={18} />
                          </QtyButton>
                          <span className="modal-buy-qty__value">{modalQuantity}</span>
                          <QtyButton label="+" withRotate onClick={() => setModalQuantity(q => q + 1)}>
                            <Plus size={18} />
                          </QtyButton>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addToCart(selectedProduct, modalQuantity)}
                          className="btn btn-primary"
                          style={{ height: '54px', borderRadius: '14px', fontSize: '16px', boxShadow: '0 4px 12px rgba(93, 64, 55, 0.1)' }}
                        >
                          <ShoppingCart size={20} /> {t.cart.inCart}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => buyNow(selectedProduct, modalQuantity)}
                          className="modal-buy-btn"
                          style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', border: 'none', height: '54px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(37, 211, 102, 0.15)' }}
                        >
                          {t.cart.buyNow}
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>


      


      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
              key="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mobile-menu-overlay" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
        )}
        {isMobileMenuOpen && (
            <motion.div 
              key="mobile-menu-content"
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                willChange: 'transform', 
                backfaceVisibility: 'hidden',
                background: '#FFFFFF',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column'
              }}
              className="mobile-menu-content"
            >
              {/* Шапка — всегда на месте */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2, padding: '22px 20px 0', flexShrink: 0 }}>
                <motion.div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img 
                    src="/images/dr.svg.png" 
                    alt="Daruzen Logo"
                    style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0, marginLeft: '-4px' }}
                  />
                </motion.div>
                <motion.button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileTap={{ scale: 0.88 }}
                  style={{ 
                    background: '#F2F0EE',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#6B6B6B',
                    flexShrink: 0
                  }}
                  initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Скролл-область */}
              <div style={{ flex: 1, overflowY: 'auto', overscrollBehaviorY: 'contain', WebkitOverflowScrolling: 'touch', paddingBottom: '8px' }}>
                {/* Каталог — свернутая категория */}
                <div style={{ padding: '0 20px', marginTop: '18px' }}>
                  <motion.button
                    onClick={() => setIsMenuCatalogOpen(o => !o)}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: '#F7F5F3',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '13px 14px',
                      cursor: 'pointer',
                      color: '#1A1A1A'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: '700' }}>
                      <span style={{ display: 'flex', color: 'var(--primary)' }}>
                        <LayoutGrid size={17} strokeWidth={1.9} />
                      </span>
                      {t.nav.catalog}
                    </span>
                    <motion.span
                      animate={{ rotate: isMenuCatalogOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: 'flex', color: '#8A857F' }}
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isMenuCatalogOpen && (
                      <motion.div
                        key="menu-catalog-list"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ paddingTop: '10px' }}>
                          {/* Все товары */}
                          <motion.a
                            onClick={() => { handleCategorySelect('all'); setIsMobileMenuOpen(false); }}
                            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                            transition={{ duration: 0.25, delay: 0.03, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 14px',
                              borderRadius: '10px',
                              background: selectedCategory === 'all' ? 'rgba(99,67,49,0.07)' : 'transparent',
                              color: selectedCategory === 'all' ? 'var(--primary)' : '#1A1A1A',
                              fontWeight: selectedCategory === 'all' ? '700' : '500',
                              fontSize: '15px',
                              textDecoration: 'none',
                              cursor: 'pointer',
                              marginBottom: '2px'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {selectedCategory === 'all' && (
                                <span style={{
                                  width: '6px', height: '6px', borderRadius: '50%',
                                  background: 'var(--primary)', flexShrink: 0
                                }} />
                              )}
                              {getCategoryLabel(lang, 'all')}
                            </span>
                            <span style={{ color: '#C0B8AE', fontSize: '13px', fontWeight: '600' }}>{productsData.length}</span>
                          </motion.a>

                          {/* Категории */}
                          {categoryKeys.filter(k => k !== 'all').map((cat, idx) => {
                            const isActive = selectedCategory === cat;
                            const count = productsData.filter(p => p.categoryKey === cat).length;
                            return (
                              <motion.a
                                key={cat}
                                onClick={() => { handleCategorySelect(cat); setIsMobileMenuOpen(false); }}
                                initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                                transition={{ duration: 0.25, delay: 0.06 + idx * 0.03, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '12px 14px',
                                  borderRadius: '10px',
                                  background: isActive ? 'rgba(99,67,49,0.07)' : 'transparent',
                                  color: isActive ? 'var(--primary)' : '#1A1A1A',
                                  fontWeight: isActive ? '700' : '500',
                                  fontSize: '15px',
                                  textDecoration: 'none',
                                  cursor: 'pointer',
                                  marginBottom: '2px'
                                }}
                              >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  {isActive && (
                                    <span style={{
                                      width: '6px', height: '6px', borderRadius: '50%',
                                      background: 'var(--primary)', flexShrink: 0
                                    }} />
                                  )}
                                  {getCategoryLabel(lang, cat)}
                                </span>
                                <span style={{ color: '#C0B8AE', fontSize: '13px', fontWeight: '600' }}>{count}</span>
                              </motion.a>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Разделитель */}
                <motion.div
                  style={{ height: '1px', background: '#ECEAE7', margin: '16px 20px 0' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Навигация */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '0 20px', marginTop: '6px' }}>
                  {[
                    { id: 'top', label: t.nav.home },
                    { id: 'about', label: t.nav.about },
                    { id: 'contacts', label: t.nav.contacts }
                   ].map((link, idx) => (
                     <motion.a
                       key={link.id}
                       className="mobile-menu-link"
                       onClick={(e) => handleNavClick(e, link.id)}
                       initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                       transition={{ duration: 0.28, delay: 0.35 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                       style={{
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'space-between',
                         gap: '12px',
                         padding: '13px 4px',
                         color: activeSection === link.id ? 'var(--primary)' : '#1A1A1A',
                         fontWeight: activeSection === link.id ? '700' : '500',
                         fontSize: '15px',
                         textDecoration: 'none',
                         cursor: 'pointer'
                       }}
                     >
                       <span>{link.label}</span>
                       <ChevronRight size={16} color="#C0B8AE" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
                     </motion.a>
                   ))}
                </div>

                {/* Контакты внизу — компактно */}
                <div style={{ padding: '8px 20px 16px' }}>
                  <motion.div
                    style={{
                      borderTop: '1px solid #ECEAE7',
                      paddingTop: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a href="tel:+9054496791012" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8A857F', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                      <Phone size={14} color="#8A857F" />
                      {t.contacts.phoneNum}
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
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
                    filter: 'brightness(0) invert(1)'
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

      </motion.div>
      </AnimatePresence>

      {/* CSS for components not using inline styles */}
      <AppStyles />
    </div>
  );
};

const HIGHLIGHT_WORDS = [
  'качество', 'безопасность', 'эффективность', 'миссия', 'доверие', 'философия',
  'kalite', 'güvenlik', 'etkinlik', 'misyon', 'güven', 'felsefe',
  'quality', 'safety', 'effectiveness', 'mission', 'trust', 'philosophy',
  'الجودة', 'السلامة', 'الفعالية', 'المهمة', 'الثقة', 'الفلسفة',
];

const HighlightLead = ({ text }: { text: string }) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wi) => {
        const cleanWord = word.replace(/[.,;:!?()«»""—–-]/g, '').toLowerCase();
        const isHighlight = cleanWord.length >= 4 && HIGHLIGHT_WORDS.some(hw => cleanWord.includes(hw));
        return (
          <span
            key={wi}
            style={isHighlight ? { fontWeight: 700, color: 'var(--accent)' } : undefined}
          >
            {word}{wi < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </>
  );
};

const BrandBlock = ({ index, title, text }: { index: number; title: string; text: string }) => {
  const isEven = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        gap: '32px',
        alignItems: 'flex-start',
        padding: '40px 44px',
        borderRadius: '28px',
        background: isEven
          ? 'linear-gradient(135deg, #FFFFFF 0%, #FDF9F2 60%, #FAF3E7 100%)'
          : 'linear-gradient(135deg, #FAF3E7 0%, #FDF9F2 40%, #FFFFFF 100%)',
        border: '1px solid rgba(207, 155, 65, 0.18)',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(94, 51, 18, 0.07)',
      }}
    >
      {/* Декоративная золотая полоса слева */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: 0,
        width: '4px',
        height: '70%',
        borderRadius: '0 8px 8px 0',
        background: 'linear-gradient(180deg, transparent, var(--accent), var(--accent-light), var(--accent), transparent)',
      }} />

      {/* Мягкое золотое свечение */}
      <div style={{
        position: 'absolute',
        top: -60,
        right: -60,
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(207,155,65,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Номер блока */}
      <div style={{
        flexShrink: 0,
        width: '56px',
        height: '56px',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(207,155,65,0.14) 0%, rgba(237,196,77,0.22) 100%)',
        color: 'var(--accent)',
        fontSize: '22px',
        fontWeight: '700',
        letterSpacing: '0.02em',
        fontFamily: 'inherit',
        boxShadow: 'inset 0 0 0 1px rgba(207,155,65,0.25)',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Контент */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: 'clamp(20px, 2.5vw, 26px)',
          fontWeight: '600',
          color: 'var(--primary-dark)',
          margin: '0 0 16px',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h4>
        <p style={{
          color: 'var(--text-muted)',
          lineHeight: 1.85,
          fontSize: 'clamp(15px, 1.6vw, 18px)',
          margin: 0,
          fontWeight: '400',
        }}>
          <HighlightLead text={text} />
        </p>
      </div>
    </motion.div>
  );
};

const AboutFeatureCard = ({ Icon, title, pct, desc, delay }: { Icon: any; title: string; pct: number; desc: string; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false });
  const barControls = useAnimationControls();
  const pctControls = useAnimationControls();

  useEffect(() => {
    if (!inView) return;
    barControls.set({ width: '0%' });
    barControls.start({
      width: ['0%', `${pct}%`],
      transition: { duration: 3.5, ease: 'easeInOut', delay: 0.3 + delay },
    });
    pctControls.start({
      scale: [1, 1.12, 1],
      transition: { duration: 2.2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut', delay: 0.6 + delay },
    });
  }, [inView, pct, barControls, pctControls, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="about-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(207,155,65,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}><Icon size={22} /></div>
          <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary-dark)', margin: 0 }}>{title}</h4>
        </div>
        <motion.span animate={pctControls} style={{ fontSize: '26px', fontWeight: '700', color: 'var(--accent)', lineHeight: 1, display: 'inline-block' }}>{pct}%</motion.span>
      </div>
      <div style={{ height: '10px', borderRadius: '999px', background: 'rgba(207,155,65,0.15)', overflow: 'hidden' }}>
        <motion.div
          animate={barControls}
          style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, var(--accent-light), var(--accent))' }}
        />
      </div>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '14px', marginTop: '18px', marginBottom: 0 }}>{desc}</p>
    </motion.div>
  );
};

export default App;
