import { useEffect, useRef, useState } from 'react';
import {
  Eye, EyeOff, Plus, Trash2, ChevronUp, ChevronDown, X, Upload,
  ImageIcon, Type, Coins, FileText, ListChecks, Sparkles, Languages,
  CheckCircle2, ArrowRight, ArrowLeft, Save, Pencil, LayoutGrid,
  Settings, Package, Pill, Citrus, Gem, Leaf, Lightbulb, Camera, FlaskConical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, fetchProducts, upsertProduct, deleteProduct, uploadProductImage } from '../lib/supabase';
import { autoTranslateFromRu } from '../lib/translate';
import { cropToStandard } from '../lib/imagePipeline';
import { NormalizedImg } from './NormalizedImg';
import { parseCompositionLine, dedupeProducts, isNewProduct, products, getInStock, setInStock, type Product, type CategoryKey } from '../data';

const CATEGORIES: { key: CategoryKey; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'supplements', label: 'Добавки', icon: <Pill size={20} />, desc: 'БАДы и спортивные добавки' },
  { key: 'vitamins', label: 'Витамины', icon: <Citrus size={20} />, desc: 'Витамины и комплексы' },
  { key: 'minerals', label: 'Минералы', icon: <Gem size={20} />, desc: 'Железо, цинк, магний и др.' },
  { key: 'beauty', label: 'Красота', icon: <Sparkles size={20} />, desc: 'Для кожи, волос и ногтей' },
  { key: 'herbs', label: 'Травы', icon: <Leaf size={20} />, desc: 'Травяные экстракты' },
];

const CAT_LABEL: Record<CategoryKey, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.key, c.label]),
) as Record<CategoryKey, string>;

const ADMIN_EMAIL_HINT = 'daruzenshop@outlook.com';

const imgCardStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const emptyProduct = (): Product => ({
  id: 'prod-' + Date.now(),
  names: { ru: '', tr: '', en: '', ar: '' },
  categoryKey: 'supplements',
  price: 0,
  image: '',
  descriptions: { ru: '', tr: '', en: '', ar: '' },
  specs: undefined,
  createdAt: Math.floor(Date.now() / 1000),
  inStock: true,
});

/* ------------------------------------------------------------------ */
/*  Простая модель состава                                             */
/* ------------------------------------------------------------------ */
type SpecRow =
  | { kind: 'section'; text: string }
  | { kind: 'row'; cells: string[] }
  | { kind: 'note'; text: string };

const parseSpecs = (lines: string[]): SpecRow[] =>
  lines.map(parseCompositionLine).map(p => {
    if (p.type === 'section') return { kind: 'section', text: p.text };
    if (p.type === 'note') return { kind: 'note', text: p.text };
    if (p.type === 'row') return { kind: 'row', cells: p.cells };
    return { kind: 'row', cells: [] };
  });

const serializeSpecs = (rows: SpecRow[]): string[] =>
  rows
    .filter(r => {
      if (r.kind === 'row') return r.cells.some(c => c.trim());
      return r.text.trim();
    })
    .map(r => {
      if (r.kind === 'section') return `# ${r.text.trim()}`;
      if (r.kind === 'note') return `~~ ${r.text.trim()}`;
      const cells = r.cells.map(c => c.trim());
      while (cells.length && !cells[cells.length - 1]) cells.pop();
      return cells.join(' | ');
    });

const rowCellLabel = (i: number): string =>
  i === 0 ? 'Название вещества' : i === 1 ? 'Дозировка' : i === 2 ? '% от суточной нормы' : `Колонка ${i + 1}`;

/* ------------------------------------------------------------------ */
/*  Стили                                                              */
/* ------------------------------------------------------------------ */
const field: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '13px 16px',
  fontSize: '16px',
  borderRadius: '14px',
  border: '2px solid #e7e2db',
  background: '#fff',
  fontFamily: 'inherit',
  color: 'var(--text-main)',
  outline: 'none',
  transition: 'border-color .15s ease, box-shadow .15s ease',
};

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '15px',
  fontWeight: '700',
  color: 'var(--text-main)',
  margin: '0 0 8px',
};

/* ------------------------------------------------------------------ */
/*  Поле пароля                                                        */
/* ------------------------------------------------------------------ */
const PasswordField: React.FC<{
  valueRef: React.MutableRefObject<string>;
  onEnter: () => void;
}> = ({ valueRef, onEnter }) => {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const setVal = (v: string) => { valueRef.current = v; setValue(v); };
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div
        tabIndex={0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') setVal(valueRef.current.slice(0, -1));
          else if (e.key === 'Enter') onEnter();
          else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) setVal(valueRef.current + e.key);
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text');
          if (text) setVal(valueRef.current + text);
        }}
        style={{
          ...field,
          display: 'flex',
          alignItems: 'center',
          cursor: 'text',
          color: 'var(--text-main)',
          paddingRight: 46,
          borderColor: focused ? 'var(--accent)' : '#e7e2db',
          boxShadow: focused ? '0 0 0 4px rgba(207,155,65,0.15)' : 'none',
        }}
      >
        {show ? value : value.length > 0 ? '•'.repeat(value.length) : <span style={{ color: '#c2bab0' }}>••••••</span>}
        {focused && <span style={{ marginLeft: 1 }}>|</span>}
      </div>
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
        aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
        style={{ position: 'absolute', right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Компонент                                                          */
/* ------------------------------------------------------------------ */
const AdminPanel: React.FC = () => {
  const [session, setSession] = useState<{ user: { email: string } } | null>(null);
  const [hadSession, setHadSession] = useState(false);
  const [email, setEmail] = useState('');
  const passwordRef = useRef('');
  const [authError, setAuthError] = useState('');
  const [items, setItems] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Product | null>(null);
  const [step, setStep] = useState(0);
  const [specRows, setSpecRows] = useState<SpecRow[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(true);

  const steps = [
    { id: 'photo', label: 'Фотография', icon: ImageIcon, hint: 'Покажите товар красиво — фото привлекает покупателя. Перетащите картинку прямо в это окно или нажмите на него.' },
    { id: 'name', label: 'Название', icon: Type, hint: 'Напишите название по-русски. Остальные языки (турецкий, английский, арабский) мы переведём автоматически — кнопка «Перевести» в конце.' },
    { id: 'price', label: 'Цена и категория', icon: Coins, hint: 'Выберите, к какому разделу относится товар, и укажите цену в турецких лирах (₺).' },
    { id: 'desc', label: 'Описание', icon: FileText, hint: 'Расскажите о товаре простыми словами: что это, зачем, как принимать. Это увидит покупатель.' },
    { id: 'specs', label: 'Состав', icon: ListChecks, hint: 'Что внутри? Название вещества, дозировка и % от суточной нормы. Пустые поля просто не покажем.' },
  ];

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session as never);
      if (data.session) setHadSession(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) setHadSession(true);
      setSession(s as never);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchProducts()
        .then(data => { setItems(data); setNotice(''); })
        .catch(() => { setItems(dedupeProducts(products)); });
    }
  }, [session]);

  const login = async () => {
    if (!supabase) return;
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: passwordRef.current });
    if (error) setAuthError('Неверный email или пароль');
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    setHadSession(false);
    setSession(null);
    setItems([]);
    setDraft(null);
  };

  const updateDraft = (fn: (p: Product) => Product) => {
    setDraft(prev => (prev ? fn(prev) : prev));
  };

  const save = async () => {
    if (!draft) return;
    setSavingId(draft.id);
    setNotice('');
    try {
      const withStock = setInStock(draft, getInStock(draft));
      const final = { ...withStock, specs: { ...(withStock.specs ?? {}), ru: serializeSpecs(specRows) } };
      await upsertProduct(final);
      setItems(prev => {
        const i = prev.findIndex(x => x.id === final.id);
        if (i >= 0) { const next = [...prev]; next[i] = final; return next; }
        return [final, ...prev];
      });
      setSavedId(final.id);
      await new Promise(r => setTimeout(r, 1200));
      setSavedId(null);
      setDraft(null);
      setNotice('');
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message :
        e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) :
        String(e);
      setNotice('Ошибка сохранения: ' + msg);
    } finally {
      setSavingId(null);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm('Удалить этот товар?')) return;
    await deleteProduct(id);
    setItems(prev => prev.filter(p => p.id !== id));
    if (draft?.id === id) setDraft(null);
  };

  const add = () => {
    const p = emptyProduct();
    setDraft(p);
    setSpecRows([]);
    setStep(0);
    setShowHelp(true);
  };

  const edit = (p: Product) => {
    setDraft({ ...p });
    setSpecRows(parseSpecs(p.specs?.ru ?? []));
    setStep(0);
    setShowHelp(true);
  };

  const [stockSavingId, setStockSavingId] = useState<string | null>(null);

  const toggleStock = async (p: Product) => {
    const next = setInStock(p, !getInStock(p));
    setItems(prev => prev.map(x => (x.id === p.id ? next : x)));
    setStockSavingId(p.id);
    try {
      await upsertProduct(next);
    } catch {
      setItems(prev => prev.map(x => (x.id === p.id ? p : x)));
    } finally {
      setStockSavingId(null);
    }
  };

  const translate = async () => {
    if (!draft) return;
    setTranslatingId(draft.id);
    setNotice('Переводим на другие языки…');
    try {
      const withRu = { ...draft, specs: { ...(draft.specs ?? {}), ru: serializeSpecs(specRows) } };
      const translated = await autoTranslateFromRu(withRu);
      setDraft(translated);
      setNotice('Переведено ✓');
      setTimeout(() => setNotice(''), 3000);
    } catch {
      setNotice('Ошибка перевода');
    } finally {
      setTranslatingId(null);
    }
  };

  const handleImageFile = (file: File | null) => {
    if (!draft || !file || !file.type.startsWith('image/')) return;
    const localUrl = URL.createObjectURL(file);
    updateDraft(pr => ({ ...pr, image: localUrl }));
    setNotice('Обрабатываем фото…');
    const img = new Image();
    img.onload = async () => {
      try {
        const c = cropToStandard(img);
        const blob: Blob = await new Promise((resolve, reject) =>
          c.toBlob(b => (b ? resolve(b) : reject(new Error('Ошибка конвертации фото'))), 'image/webp', 0.95)
        );
        const url = await uploadProductImage(draft.id, blob);
        updateDraft(pr => ({ ...pr, image: url }));
        setNotice('');
      } catch (e: unknown) {
        setNotice('Ошибка загрузки фото: ' + String(e instanceof Error ? e.message : e));
      }
      URL.revokeObjectURL(localUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(localUrl);
      setNotice('Ошибка чтения файла');
    };
    img.src = localUrl;
  };

  const mutateRow = (idx: number, fn: (r: SpecRow) => SpecRow) =>
    setSpecRows(prev => prev.map((r, i) => (i === idx ? fn(r) : r)));

  const moveRow = (idx: number, dir: -1 | 1) =>
    setSpecRows(prev => {
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });

  const removeRow = (idx: number) =>
    setSpecRows(prev => prev.filter((_, i) => i !== idx));

  const stepError = (): string | null => {
    if (!draft) return null;
    switch (step) {
      case 0:
        return draft.image.trim() ? null : 'Добавьте фотографию товара';
      case 1:
        return draft.names.ru.trim() ? null : 'Напишите название товара';
      case 2:
        return draft.price > 0 ? null : 'Укажите цену товара';
      case 3:
        return draft.descriptions.ru.trim() ? null : 'Напишите описание товара';
      case 4: {
        const hasRow = specRows.some(r => {
          if (r.kind === 'row') return r.cells.some(c => c.trim());
          return r.text.trim();
        });
        return hasRow ? null : 'Добавьте хотя бы один пункт состава';
      }
      default:
        return null;
    }
  };

  const currentError = stepError();

  if (!supabase) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 420, padding: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px', background: '#f3efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Settings size={32} />
          </div>
          <h2 style={{ marginTop: 0 }}>Панель товаров</h2>
          <p style={{ color: '#888' }}>Supabase не настроен. Заполните .env и перезапустите сайт.</p>
        </div>
      </div>
    );
  }

  /* ---------------- Логин ---------------- */
  if (!session && !hadSession) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', background: 'radial-gradient(1200px 600px at 80% -10%, rgba(207,155,65,0.12), transparent), radial-gradient(900px 500px at 10% 110%, rgba(99,67,49,0.10), transparent), linear-gradient(135deg,#fbfaf8,#f1ece6)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', padding: '40px', borderRadius: 28, boxShadow: '0 30px 80px rgba(99,67,49,0.16), 0 0 0 1px rgba(255,255,255,0.6)' }}
        >
          <img src="/images/dr.svg.png" alt="Daruzen" style={{ width: 76, height: 76, objectFit: 'contain', borderRadius: 20, marginBottom: 16, filter: 'brightness(0) saturate(100%) invert(26%) sepia(13%) saturate(1185%) hue-rotate(331deg) brightness(94%) contrast(89%)' }} />
          <h2 style={{ margin: '0 0 4px', fontSize: 24, color: 'var(--primary-dark)' }}>Панель товаров Daruzen</h2>
          <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontSize: 14 }}>Войдите, чтобы добавлять и редактировать товары магазина.</p>
          <div style={fieldLabel}>Ваш Email</div>
          <input style={field} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={ADMIN_EMAIL_HINT} />
          <div style={{ ...fieldLabel, marginTop: 18 }}>Пароль</div>
          <PasswordField valueRef={passwordRef} onEnter={login} />
          {authError && <p style={{ color: '#c0392b', fontSize: 14, margin: '10px 0 0' }}>{authError}</p>}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={login}
            style={{ width: '100%', marginTop: 24, padding: 15, borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, var(--primary), #7d5236)', color: '#fff', fontWeight: 800, fontSize: 17, cursor: 'pointer', boxShadow: '0 12px 30px rgba(99,67,49,0.35)' }}
          >
            Войти
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ---------------- Основная панель ---------------- */
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(180deg, #faf7f3 0%, #f3efe9 100%)', color: 'var(--text-main)' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(99,67,49,0.08)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, var(--primary), #7d5236)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 20px rgba(99,67,49,0.3)' }}>
            <LayoutGrid size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.1, color: 'var(--primary-dark)' }}>Каталог Daruzen</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{items.length} товаров</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <AnimatePresence>
            {notice && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#28a745', fontSize: 14, fontWeight: 700, background: '#eaf8ee', padding: '8px 14px', borderRadius: 12 }}
              >
                {notice}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button whileTap={{ scale: 0.96 }} onClick={add} style={{ padding: '12px 20px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #f0cd83, #e7be63)', color: '#5e3312', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 8px 20px rgba(231,190,99,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} /> Добавить товар
          </motion.button>
          <button onClick={logout} style={{ padding: '12px 18px', borderRadius: 14, border: '1px solid #e0dad2', background: '#fff', color: 'var(--text-main)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Выйти</button>
        </div>
      </header>

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 28px 60px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: 84, height: 84, borderRadius: 22, margin: '0 auto 20px', background: '#f3efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a89a88' }}>
              <Package size={40} />
            </div>
            <h2 style={{ margin: '0 0 8px', color: 'var(--primary-dark)' }}>Пока нет ни одного товара</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 24px' }}>Нажмите «Добавить товар», чтобы создать первый.</p>
            <button onClick={add} style={{ padding: '15px 28px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #f0cd83, #e7be63)', color: '#5e3312', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>+ Добавить первый товар</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20 }}>
            {items.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4 }}
                style={{ background: '#fff', borderRadius: 22, border: '1px solid rgba(99,67,49,0.08)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(99,67,49,0.05)', transition: 'box-shadow .25s ease' }}
              >
                <div style={{ aspectRatio: '3 / 4', background: 'linear-gradient(180deg, #fdfcfa, #f5f1ea)', overflow: 'hidden', position: 'relative' }}>
                  {p.image ? <NormalizedImg src={p.image} alt="" style={imgCardStyle} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9bfb2' }}><ImageIcon size={44} /></div>}
                  {isNewProduct(p) && (
                    <span style={{ position: 'absolute', top: 12, right: 12, background: '#e5484d', color: '#fff', fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 100, boxShadow: '0 4px 14px rgba(229,72,77,0.45)' }}>
                      Новое
                    </span>
                  )}
                  {!getInStock(p) && (
                    <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(80, 80, 80, 0.9)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '5px 11px', borderRadius: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', zIndex: 2 }}>
                      Нет в наличии
                    </span>
                  )}
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: '#9a7b3f', background: '#fbf3e2', padding: '4px 10px', borderRadius: 100, marginBottom: 8 }}>
                    {CATEGORIES.find(c => c.key === p.categoryKey)?.icon} {CAT_LABEL[p.categoryKey]}
                  </span>
                  <div style={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.3, minHeight: 40, color: 'var(--primary-dark)' }}>{p.names.ru || '— без названия —'}</div>
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--primary)' }}>{p.price.toLocaleString('ru-RU')} ₺</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => edit(p)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 12, border: '1px solid #e0dad2', background: '#fff', color: 'var(--primary)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                    >
                      <Pencil size={14} /> Изменить
                    </motion.button>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleStock(p)}
                    disabled={stockSavingId === p.id}
                    title={getInStock(p) ? 'В наличии — нажмите, чтобы выключить' : 'Нет в наличии — нажмите, чтобы включить'}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginTop: 12, padding: '9px 12px', borderRadius: 12, border: '1px solid ' + (getInStock(p) ? '#cde9d5' : '#e7e2db'), background: getInStock(p) ? '#f0faf3' : '#fff', cursor: stockSavingId === p.id ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all .2s ease', opacity: stockSavingId === p.id ? 0.6 : 1 }}
                  >
                    <span style={{ position: 'relative', width: 38, height: 22, borderRadius: 99, flexShrink: 0, background: getInStock(p) ? '#2f9e58' : '#d5cfc6', transition: 'background .2s ease' }}>
                      <span style={{ position: 'absolute', top: 3, left: getInStock(p) ? 18 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left .2s ease' }} />
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: getInStock(p) ? '#1f7a3d' : '#b0433a' }}>
                      {getInStock(p) ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* ---------------- Мастер товара ---------------- */}
      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDraft(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(40,26,12,0.55)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 980, maxHeight: '92vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 28, boxShadow: '0 40px 100px rgba(0,0,0,0.35)', overflow: 'hidden', position: 'relative' }}
            >
              {savedId === draft.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(255,255,255,0.94)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}
                >
                  <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                    <svg width="84" height="84" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#28a745" strokeWidth="5" strokeLinecap="round" strokeDasharray="226" strokeDashoffset="0" />
                      <path d="M24,42 L36,54 L56,32" fill="none" stroke="#28a745" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#28a745' }}>Товар сохранён!</div>
                </motion.div>
              )}

              {/* Заголовок */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px', borderBottom: '1px solid #f0ece6' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 19, color: 'var(--primary-dark)', letterSpacing: '-0.01em' }}>{draft.names.ru ? 'Редактирование товара' : 'Новый товар'}</div>
                  <div style={{ fontSize: 13.5, color: '#a39483', marginTop: 3 }}>Пройдите 5 шагов — товар появится в магазине</div>
                </div>
                <button onClick={() => setDraft(null)} style={{ border: 'none', background: '#f4f0ea', width: 38, height: 38, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a39483', transition: 'all .2s ease' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Индикатор шагов */}
              <div style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'center' }}>
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === step;
                  const done = i < step;
                  const locked = i > step && !!currentError;
                  return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                      <button
                        onClick={() => { if (!locked) setStep(i); }}
                        disabled={locked}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: 'none', background: 'none', cursor: locked ? 'default' : 'pointer', padding: 0, opacity: locked ? 0.55 : 1 }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .25s ease', background: done ? '#2f9e58' : active ? 'var(--primary)' : '#f0ece6', color: done || active ? '#fff' : '#b5a894', boxShadow: active ? '0 8px 20px rgba(99,67,49,0.28)' : 'none', border: done || active ? 'none' : '1px solid #e6dfd6' }}>
                          {done ? <CheckCircle2 size={17} /> : <Icon size={16} />}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: active ? 'var(--primary)' : done ? '#2f9e58' : '#b5a894', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>{s.label}</span>
                      </button>
                      {i < steps.length - 1 && (
                        <div style={{ flex: 1, height: 2, borderRadius: 99, background: done ? '#2f9e58' : '#eee8df', margin: '17px 10px 0', minWidth: 8 }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Контент шага */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 32 }}>
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25 }}
                    >
                      {showHelp && (
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#faf7f2', border: '1px solid #f0ebe2', borderRadius: 16, padding: '14px 16px', marginBottom: 20 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f3e7cd', color: '#8a6a30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Lightbulb size={17} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 13.5, color: '#8a6a30', marginBottom: 3 }}>Совет</div>
                            <div style={{ fontSize: 13.5, color: '#9a8c7d', lineHeight: 1.6 }}>{steps[step].hint}</div>
                          </div>
                          <button onClick={() => setShowHelp(false)} style={{ marginLeft: 'auto', border: 'none', background: 'none', color: '#b5a894', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
                        </div>
                      )}

                      {/* Шаг 1 — Фото */}
                      {step === 0 && (
                        <div>
                          <div
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); handleImageFile(e.dataTransfer.files?.[0] ?? null); }}
                            onClick={() => (document.getElementById('img-input') as HTMLInputElement | null)?.click()}
                            style={{ position: 'relative', width: '100%', maxWidth: 340, aspectRatio: '3 / 4', margin: '0 auto', borderRadius: 22, background: dragOver ? 'rgba(207,155,65,0.1)' : '#faf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', border: dragOver ? '3px solid var(--accent)' : '2px dashed #ddd3c4', transition: 'all .2s ease' }}
                          >
                            {draft.image ? (
                              <>
                                <NormalizedImg src={draft.image} alt="" style={imgCardStyle} />
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(40,26,12,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0, transition: 'opacity .2s ease', color: '#fff', fontWeight: 700 }}>
                                  <Upload size={28} />
                                  Нажмите, чтобы заменить
                                </div>
                              </>
                            ) : (
                              <div style={{ textAlign: 'center', color: '#a39483', padding: 20 }}>
                                <div style={{ width: 56, height: 56, borderRadius: 18, background: '#f0ebe3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a39483', margin: '0 auto 14px' }}>
                                  <Camera size={26} />
                                </div>
                                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary-dark)' }}>Добавьте фото</div>
                                <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>Перетащите файл сюда или нажмите,<br />чтобы выбрать. Вертикальное 3:4.</div>
                              </div>
                            )}
                          </div>
                          <input id="img-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageFile(e.target.files?.[0] ?? null)} />
                          <div style={{ marginTop: 20 }}>
                            <div style={{ ...fieldLabel, fontSize: 13.5, color: '#a39483' }}>Или вставьте ссылку на фото</div>
                            <input style={field} value={draft.image} onChange={e => updateDraft(pr => ({ ...pr, image: e.target.value }))} placeholder="https://…" />
                          </div>
                          {draft.image && (
                            <button onClick={() => updateDraft(pr => ({ ...pr, image: '' }))} style={{ marginTop: 12, padding: '10px 16px', borderRadius: 12, border: '1px solid #f0d6d6', background: '#fff', color: '#c0392b', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Убрать фото</button>
                          )}
                        </div>
                      )}

                      {/* Шаг 2 — Название */}
                      {step === 1 && (
                        <div>
                          <div style={fieldLabel}>Название товара <span style={{ color: '#c0392b' }}>*</span></div>
                          <input
                            style={field}
                            autoFocus
                            value={draft.names.ru}
                            onChange={e => updateDraft(pr => ({ ...pr, names: { ...pr.names, ru: e.target.value } }))}
                            placeholder="Например: Витамин C 1000 мг"
                          />
                          <div style={{ fontSize: 13, color: '#a89a88', marginTop: 10, lineHeight: 1.5 }}>
                            Примеры: «Цинк 25 мг», «Омега-3 с рыбьим жиром», «Коллаген для кожи». Чем понятнее название — тем легче покупателю найти товар.
                          </div>
                        </div>
                      )}

                      {/* Шаг 3 — Цена и категория */}
                      {step === 2 && (
                        <div>
                          <div style={fieldLabel}>Категория</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                            {CATEGORIES.map(c => (
                              <motion.button
                                key={c.key}
                                type="button"
                                whileTap={{ scale: 0.97 }}
                                onClick={() => updateDraft(pr => ({ ...pr, categoryKey: c.key }))}
                                style={{
                                  padding: '16px 14px',
                                  borderRadius: 16,
                                  border: '2px solid ' + (draft.categoryKey === c.key ? 'var(--accent)' : '#e7e2db'),
                                  background: draft.categoryKey === c.key ? '#fbf3e2' : '#fff',
                                  color: draft.categoryKey === c.key ? 'var(--primary)' : 'var(--text-muted)',
                                  fontWeight: 700,
                                  fontSize: 15,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: 6,
                                  textAlign: 'center',
                                  boxShadow: draft.categoryKey === c.key ? '0 6px 18px rgba(207,155,65,0.2)' : 'none',
                                }}
                              >
                                <span style={{ fontSize: 28 }}>{c.icon}</span>
                                {c.label}
                                <span style={{ fontSize: 11, fontWeight: 500, color: '#a89a88' }}>{c.desc}</span>
                              </motion.button>
                            ))}
                          </div>
                          <div style={{ ...fieldLabel, marginTop: 22 }}>Цена в турецких лирах (₺)</div>
                          <div style={{ position: 'relative', maxWidth: 240 }}>
                            <input style={{ ...field, paddingLeft: 40 }} type="number" value={draft.price} onChange={e => updateDraft(pr => ({ ...pr, price: Number(e.target.value) }))} placeholder="Например: 2500" />
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--accent)' }}>₺</span>
                          </div>

                          <div style={{ ...fieldLabel, marginTop: 24 }}>Наличие</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, border: '1px solid #e7e2db', background: '#fff' }}>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={getInStock(draft)}
                              onClick={() => updateDraft(pr => setInStock(pr, !getInStock(pr)))}
                              style={{ position: 'relative', width: 46, height: 26, borderRadius: 99, border: 'none', cursor: 'pointer', background: getInStock(draft) ? '#2f9e58' : '#d5cfc6', transition: 'background .2s ease', flexShrink: 0, padding: 0 }}
                            >
                              <span style={{ position: 'absolute', top: 3, left: getInStock(draft) ? 22 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', transition: 'left .2s ease' }} />
                            </button>
                            <span style={{ fontWeight: 700, fontSize: 15, color: getInStock(draft) ? '#1f7a3d' : '#b0433a' }}>
                              {getInStock(draft) ? 'В наличии' : 'Нет в наличии'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Шаг 4 — Описание */}
                      {step === 3 && (
                        <div>
                          <div style={fieldLabel}>Описание товара</div>
                          <textarea
                            style={{ ...field, minHeight: 150, lineHeight: 1.6 }}
                            value={draft.descriptions.ru}
                            onChange={e => updateDraft(pr => ({ ...pr, descriptions: { ...pr.descriptions, ru: e.target.value } }))}
                            placeholder="Что это за товар? Зачем нужен? Как принимать? Напишите своими словами — покупателю важно понять пользу."
                          />
                          <div style={{ fontSize: 13, color: '#a89a88', marginTop: 10, lineHeight: 1.5 }}>
                            Пример: «Натуральная добавка с высоким содержанием витамина C для поддержки иммунитета. Принимайте по 1 капсуле в день во время еды.»
                          </div>
                        </div>
                      )}

                      {/* Шаг 5 — Состав */}
                      {step === 4 && (
                        <div>
                          <div style={fieldLabel}>Состав — что внутри</div>

                          {specRows.length === 0 && (
                            <div style={{ padding: 24, border: '2px dashed #dcd3c6', borderRadius: 16, textAlign: 'center', color: '#a89a88', fontSize: 14, marginBottom: 14 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f3efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a89a88', margin: '0 auto 10px' }}>
                                <FlaskConical size={24} />
                              </div>
                              Пока состав пуст. Нажмите «Добавить вещество» ниже.
                            </div>
                          )}

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <AnimatePresence initial={false}>
                              {specRows.map((r, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ border: '1px solid ' + (r.kind === 'section' ? '#f0e2c4' : '#e7e2db'), borderRadius: 16, padding: 14, background: r.kind === 'section' ? '#fbf3e2' : r.kind === 'note' ? '#faf7f2' : '#fff' }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: r.kind === 'row' ? 10 : 0 }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: r.kind === 'section' ? '#9a7b3f' : '#a89a88', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                                      {r.kind === 'section' ? 'Заголовок раздела' : r.kind === 'note' ? 'Примечание' : `Строка ${i + 1}`}
                                    </span>
                                    <span style={{ display: 'flex', gap: 4 }}>
                                      <button type="button" disabled={i === 0} onClick={() => moveRow(i, -1)} title="Выше" style={{ width: 30, height: 30, borderRadius: 9, border: '1px solid #e6ddcf', background: '#fff', color: '#8a7a68', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: i === 0 ? 0.3 : 1 }}><ChevronUp size={15} /></button>
                                      <button type="button" disabled={i === specRows.length - 1} onClick={() => moveRow(i, 1)} title="Ниже" style={{ width: 30, height: 30, borderRadius: 9, border: '1px solid #e6ddcf', background: '#fff', color: '#8a7a68', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: i === specRows.length - 1 ? 0.3 : 1 }}><ChevronDown size={15} /></button>
                                      <button type="button" onClick={() => removeRow(i)} title="Удалить" style={{ width: 30, height: 30, borderRadius: 9, border: '1px solid #f0d6d6', background: '#fff', color: '#c0392b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={15} /></button>
                                    </span>
                                  </div>
                                  {r.kind === 'row' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                      {r.cells.map((c, ci) => (
                                        <div key={ci}>
                                          <div style={{ fontSize: 11, fontWeight: 700, color: '#a89a88', marginBottom: 3 }}>{rowCellLabel(ci)}</div>
                                          <input
                                            style={field}
                                            value={c}
                                            onChange={e => mutateRow(i, rw => (rw.kind === 'row' ? { ...rw, cells: rw.cells.map((x, xi) => (xi === ci ? e.target.value : x)) } : rw))}
                                            placeholder={ci === 0 ? 'Например: Витамин C' : ci === 1 ? 'Например: 100 мг' : 'Например: 125%'}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {r.kind !== 'row' && (
                                    <input
                                      style={field}
                                      value={r.text}
                                      onChange={e => mutateRow(i, rw => (rw.kind !== 'row' ? { ...rw, text: e.target.value } : rw))}
                                      placeholder={r.kind === 'section' ? 'Заголовок, напр. «Состав на 1 капсулу»' : 'Например: Примечание под таблицей'}
                                    />
                                  )}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>

                          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                            <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={() => setSpecRows(prev => [...prev, { kind: 'row', cells: ['', '', ''] }])} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px', borderRadius: 13, border: '2px solid var(--primary)', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                              <Plus size={16} /> Добавить вещество
                            </motion.button>
                            <button type="button" onClick={() => setSpecRows(prev => [...prev, { kind: 'section', text: '' }])} style={{ padding: '12px 18px', borderRadius: 13, border: '2px solid #e0d8cc', background: '#fff', color: 'var(--text-main)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Добавить заголовок</button>
                            <button type="button" onClick={() => setSpecRows(prev => [...prev, { kind: 'note', text: '' }])} style={{ padding: '12px 18px', borderRadius: 13, border: '2px solid #e0d8cc', background: '#fff', color: 'var(--text-main)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Добавить примечание</button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Live-превью */}
                <div style={{ position: 'sticky', top: 0, alignSelf: 'start' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#a89a88', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Eye size={14} /> Так увидит покупатель
                  </div>
                  <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(99,67,49,0.1)', boxShadow: '0 16px 40px rgba(99,67,49,0.12)' }}>
                    <div style={{ aspectRatio: '3 / 4', background: 'linear-gradient(180deg, #fdfcfa, #f2ede5)', overflow: 'hidden', position: 'relative' }}>
                      {draft.image ? <NormalizedImg src={draft.image} alt="" style={imgCardStyle} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4c9bb' }}><ImageIcon size={40} /></div>}
                      {!getInStock(draft) && (
                        <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(80, 80, 80, 0.9)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '5px 11px', borderRadius: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
                          Нет в наличии
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px 16px', background: '#fff' }}>
                      <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#9a7b3f', background: '#fbf3e2', padding: '3px 9px', borderRadius: 100, marginBottom: 8 }}>
                        {CATEGORIES.find(c => c.key === draft.categoryKey)?.icon} {CAT_LABEL[draft.categoryKey]}
                      </span>
                      <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.3, color: 'var(--primary-dark)', minHeight: 40 }}>
                        {draft.names.ru || 'Название товара'}
                      </div>
                      <div style={{ marginTop: 8, fontWeight: 800, fontSize: 18, color: getInStock(draft) ? 'var(--primary)' : '#8a8a8a' }}>
                        {draft.price ? draft.price.toLocaleString('ru-RU') + ' ₺' : '0 ₺'}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#b0a797', marginTop: 10, lineHeight: 1.5 }}>
                    Превью обновляется автоматически по мере заполнения полей.
                  </div>
                </div>
              </div>

              {/* Нижняя панель */}
              <div style={{ display: 'flex', gap: 12, padding: '16px 26px', borderTop: '1px solid #f0ece6', background: '#fbfaf8', flexWrap: 'wrap', alignItems: 'center' }}>
                <motion.button whileTap={{ scale: 0.97 }} disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 20px', borderRadius: 14, border: '2px solid #e0dad2', background: '#fff', color: 'var(--text-main)', fontWeight: 700, fontSize: 15, cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.4 : 1 }}>
                  <ArrowLeft size={16} /> Назад
                </motion.button>

                {currentError && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#c0392b', background: '#fdf0ef', padding: '9px 14px', borderRadius: 12 }}
                  >
                    <X size={15} /> {currentError}
                  </motion.span>
                )}

                <div style={{ flex: 1 }} />

                {step === steps.length - 1 ? (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={translate}
                      disabled={translatingId === draft.id || savingId === draft.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 20px', borderRadius: 14, border: '2px solid #2a7', background: '#fff', color: '#2a7', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: translatingId === draft.id ? 0.6 : 1 }}
                    >
                      <Languages size={16} /> {translatingId === draft.id ? 'Переводим…' : 'Перевести на другие языки'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={save}
                      disabled={!!currentError || savingId === draft.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 26px', borderRadius: 14, border: 'none', background: currentError ? '#d8d2c8' : 'linear-gradient(135deg, #f0cd83, #e7be63)', color: currentError ? '#fff' : '#5e3312', fontWeight: 800, fontSize: 16, cursor: currentError ? 'default' : 'pointer', boxShadow: currentError ? 'none' : '0 8px 24px rgba(231,190,99,0.45)', opacity: savingId === draft.id ? 0.6 : 1 }}
                    >
                      <Save size={17} /> {savingId === draft.id ? 'Сохраняем…' : 'Сохранить товар'}
                    </motion.button>
                  </>
                ) : (
                  <motion.button whileTap={{ scale: 0.97 }} disabled={!!currentError} onClick={() => setStep(s => s + 1)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 26px', borderRadius: 14, border: 'none', background: currentError ? '#d8d2c8' : 'linear-gradient(135deg, var(--primary), #7d5236)', color: '#fff', fontWeight: 800, fontSize: 16, cursor: currentError ? 'default' : 'pointer', boxShadow: currentError ? 'none' : '0 8px 24px rgba(99,67,49,0.35)' }}>
                    Далее <ArrowRight size={17} />
                  </motion.button>
                )}

                <button onClick={() => del(draft.id)} style={{ padding: '12px 18px', borderRadius: 14, border: '2px solid #f0d6d6', background: '#fff', color: '#c0392b', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Удалить</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
