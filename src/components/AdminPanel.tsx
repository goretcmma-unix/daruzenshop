import { useEffect, useRef, useState } from 'react';
import { RefreshCw, Eye, EyeOff, Plus, Trash2, ChevronUp, ChevronDown, ArrowDownLeft } from 'lucide-react';
import { supabase, fetchProducts, upsertProduct, deleteProduct, uploadProductImage } from '../lib/supabase';
import { autoTranslateFromRu } from '../lib/translate';
import { cropToStandard } from '../lib/imagePipeline';
import { NormalizedImg } from './NormalizedImg';
import { parseCompositionLine, dedupeProducts, products, type Product, type CategoryKey, type Lang } from '../data';

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'supplements', label: 'Добавки' },
  { key: 'vitamins', label: 'Витамины' },
  { key: 'minerals', label: 'Минералы' },
  { key: 'beauty', label: 'Красота' },
  { key: 'herbs', label: 'Травы' },
];

const CAT_LABEL: Record<CategoryKey, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.key, c.label]),
) as Record<CategoryKey, string>;

const LANGS: Lang[] = ['ru', 'tr', 'en', 'ar'];
const LANG_LABELS: Record<Lang, string> = { ru: 'РУ', tr: 'TR', en: 'EN', ar: 'AR' };

// Поля логина/пароля вводятся пользователем — никаких учётных данных в коде
const ADMIN_EMAIL_HINT = 'daruzenshop@outlook.com';

const emptyProduct = (): Product => ({
  id: 'prod-' + Date.now(),
  names: { ru: '', tr: '', en: '', ar: '' },
  categoryKey: 'supplements',
  price: 0,
  image: '',
  descriptions: { ru: '', tr: '', en: '', ar: '' },
  specs: undefined,
});

const input: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 13px',
  fontSize: '15px',
  borderRadius: '12px',
  border: '1px solid #e4e0db',
  background: '#fbfaf8',
  fontFamily: 'inherit',
  color: 'var(--text-main)',
  outline: 'none',
};

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: '14px 0 6px',
};

const btnGold: React.CSSProperties = {
  padding: '11px 18px',
  borderRadius: '12px',
  border: 'none',
  background: 'linear-gradient(180deg, #f0cd83 0%, #e7be63 100%)',
  color: '#5e3312',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer',
};

const btnGhost: React.CSSProperties = {
  padding: '11px 18px',
  borderRadius: '12px',
  border: '1px solid #e4e0db',
  background: '#fff',
  color: 'var(--text-main)',
  fontWeight: '600',
  fontSize: '15px',
  cursor: 'pointer',
};

// Кастомное поле пароля: в DOM попадают только точки, реальное значение —
// только в ref (память JS), поэтому в «коде элемента» пароль не виден.
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
      <style>{`@keyframes pwBlink{50%{opacity:0}}.pw-caret{animation:pwBlink 1s step-end infinite;margin-left:1px;fontWeight:400;}`}</style>
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
          ...input,
          display: 'flex',
          alignItems: 'center',
          cursor: 'text',
          color: 'var(--text-main)',
          paddingRight: 42,
          borderColor: focused ? 'var(--accent)' : '#e4e0db',
          boxShadow: focused ? '0 0 0 3px rgba(207,155,65,0.18)' : 'none',
        }}
      >
        {show
          ? value
          : value.length > 0
            ? '•'.repeat(value.length)
            : <span style={{ color: '#bcb4aa' }}>••••••</span>}
        {focused && <span className="pw-caret">|</span>}
      </div>
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
        aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
        style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [session, setSession] = useState<{ user: { email: string } } | null>(null);
  const [hadSession, setHadSession] = useState(false);
  const [email, setEmail] = useState('');
  const passwordRef = useRef('');
  const [authError, setAuthError] = useState('');
  const [items, setItems] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(() => {
    try { return sessionStorage.getItem('adminEditingId'); } catch { return null; }
  });
  const [editingDraft, setEditingDraft] = useState<Product | null>(() => {
    try {
      const raw = sessionStorage.getItem('adminEditingDraft');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [tabLang, setTabLang] = useState<Lang>('ru');
  const [showHint, setShowHint] = useState(false);
  const [notice, setNotice] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

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

  useEffect(() => {
    try {
      if (editingId) sessionStorage.setItem('adminEditingId', editingId);
      else sessionStorage.removeItem('adminEditingId');
    } catch { /* ignore */ }
  }, [editingId]);

  useEffect(() => {
    try {
      if (editingDraft) sessionStorage.setItem('adminEditingDraft', JSON.stringify(editingDraft));
      else sessionStorage.removeItem('adminEditingDraft');
    } catch { /* ignore */ }
  }, [editingDraft]);

  useEffect(() => {
    if (!editingId) return;
    const t = setTimeout(() => setShowHint(false), 2800);
    return () => clearTimeout(t);
  }, [editingId]);

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
  };

  const update = (id: string, fn: (p: Product) => Product) => {
    setItems(prev => prev.map(p => (p.id === id ? fn(p) : p)));
    setEditingDraft(prev => prev && prev.id === id ? fn(prev) : prev);
  };

  const save = async (p: Product) => {
    setSavingId(p.id);
    setNotice('');
    try {
      await upsertProduct(p);
      setItems(prev => {
        const i = prev.findIndex(x => x.id === p.id);
        if (i >= 0) { const next = [...prev]; next[i] = p; return next; }
        return [p, ...prev];
      });
      setSavedId(p.id);
      await new Promise(r => setTimeout(r, 1200));
      setSavedId(null);
      setEditingDraft(null);
      setEditingId(null);
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
    if (editingId === id) { setEditingDraft(null); setEditingId(null); }
  };

  const add = () => {
    const p = emptyProduct();
    setItems(prev => [p, ...prev]);
    setTabLang('ru');
    setEditingDraft(p);
    setEditingId(p.id);
    setShowHint(true);
  };

  const translate = async (p: Product) => {
    setTranslatingId(p.id);
    setNotice('Перевод…');
    try {
      const translated = await autoTranslateFromRu(p);
      update(p.id, () => translated);
      setTabLang('en');
      setNotice('Переведено ✓');
      setTimeout(() => setNotice(''), 3000);
    } catch {
      setNotice('Ошибка перевода');
    } finally {
      setTranslatingId(null);
    }
  };

  const handleImageFile = (file: File | null) => {
    if (!editing || !file || !file.type.startsWith('image/')) return;
    const localUrl = URL.createObjectURL(file);
    update(editing.id, pr => ({ ...pr, image: localUrl }));
    setNotice('Обработка фото…');
    const img = new Image();
    img.onload = async () => {
      try {
        const c = cropToStandard(img);
        const blob: Blob = await new Promise((resolve, reject) =>
          c.toBlob(b => (b ? resolve(b) : reject(new Error('Ошибка конвертации фото'))), 'image/webp', 0.95)
        );
        const url = await uploadProductImage(editing.id, blob);
        update(editing.id, pr => ({ ...pr, image: url }));
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

  type SpecEntry = { type: 'section' | 'colheader' | 'row'; cells: string[] };

  const SPEC_EMPTY_4 = ['', '', '', ''];

  const parseSpecEntries = (lines: string[]): SpecEntry[] =>
    lines.map(line => {
      const part = parseCompositionLine(line);
      if (part.type === 'section') return { type: 'section', cells: [part.text] };
      if (part.type === 'colheader') return { type: 'colheader', cells: [...part.cells, ...SPEC_EMPTY_4].slice(0, 4) };
      if (part.type === 'row') return { type: 'row', cells: [...part.cells, ...SPEC_EMPTY_4].slice(0, 4) };
      return { type: 'row', cells: [...SPEC_EMPTY_4] };
    });

  const serializeSpecEntry = (e: SpecEntry): string => {
    if (e.type === 'section') return `# ${(e.cells[0] ?? '').trim()}`.trimEnd();
    if (e.type === 'colheader') return `## ${e.cells.map(c => c.trim()).join(' | ')}`;
    return e.cells.map(c => c.trim()).filter(Boolean).join(' | ');
  };

  const isSpecEntryEmpty = (e: SpecEntry): boolean => e.cells.every(c => !(c ?? '').trim());

  const entriesToSpecs = (entries: SpecEntry[]): string[] =>
    entries.filter(e => !isSpecEntryEmpty(e)).map(serializeSpecEntry);

  const writeSpecs = (p: Product, l: Lang, entries: SpecEntry[]): Product => ({
    ...p,
    specs: { ...(p.specs ?? {}), [l]: entriesToSpecs(entries) },
  });

  const getSpecLines = (p: Product, l: Lang): string[] => p.specs?.[l] ?? [];

  type SpecRow = { entryIdx: number; cells: string[] };
  type SpecBlock =
    | { kind: 'section'; entryIdx: number; text: string }
    | { kind: 'table'; headerIdx: number | null; headers: string[]; rows: SpecRow[] };

  const buildSpecBlocks = (entries: SpecEntry[]): SpecBlock[] => {
    const blocks: SpecBlock[] = [];
    let cur: Extract<SpecBlock, { kind: 'table' }> | null = null;
    entries.forEach((e, i) => {
      if (e.type === 'section') {
        cur = null;
        blocks.push({ kind: 'section', entryIdx: i, text: e.cells[0] ?? '' });
      } else if (e.type === 'colheader') {
        cur = { kind: 'table', headerIdx: i, headers: e.cells, rows: [] };
        blocks.push(cur);
      } else {
        if (!cur) {
          cur = { kind: 'table', headerIdx: null, headers: [...SPEC_EMPTY_4], rows: [] };
          blocks.push(cur);
        }
        cur.rows.push({ entryIdx: i, cells: e.cells });
      }
    });
    return blocks;
  };

  const tableInsertRowIdx = (t: Extract<SpecBlock, { kind: 'table' }>): number =>
    t.rows.length ? t.rows[t.rows.length - 1].entryIdx + 1 : (t.headerIdx ?? 0) + 1;

  const blockRange = (b: SpecBlock): [number, number] => {
    if (b.kind === 'section') return [b.entryIdx, b.entryIdx + 1];
    const start = b.headerIdx ?? (b.rows.length ? b.rows[0].entryIdx : 0);
    const end = b.rows.length ? b.rows[b.rows.length - 1].entryIdx + 1 : (b.headerIdx ?? -1) + 1;
    return [start, end];
  };

  const moveSpecRange = (entries: SpecEntry[], start: number, count: number, dir: 1 | -1): SpecEntry[] => {
    const copy = entries.slice();
    if (dir === -1) {
      if (start <= 0) return copy;
      const moved = copy.splice(start, count);
      copy.splice(start - 1, 0, ...moved);
    } else {
      if (start + count >= copy.length) return copy;
      const moved = copy.splice(start, count);
      copy.splice(start + count, 0, ...moved);
    }
    return copy;
  };

  const setSpecCell = (p: Product, l: Lang, entryIdx: number, cellIdx: number, value: string): Product => {
    const entries = parseSpecEntries(getSpecLines(p, l));
    const e = entries[entryIdx];
    if (!e) return p;
    entries[entryIdx] = { ...e, cells: [...e.cells] };
    entries[entryIdx].cells[cellIdx] = value;
    return writeSpecs(p, l, entries);
  };

  const toggleSpecSub = (p: Product, l: Lang, entryIdx: number): Product => {
    const entries = parseSpecEntries(getSpecLines(p, l));
    const e = entries[entryIdx];
    if (!e) return p;
    const name = (e.cells[0] ?? '').trim();
    const sub = name.startsWith('└');
    e.cells[0] = sub ? name.replace(/^└\s*/, '') : (name ? '└ ' + name : '└ ');
    return writeSpecs(p, l, entries);
  };

  const addSpecRowTo = (p: Product, l: Lang, block: Extract<SpecBlock, { kind: 'table' }>): Product => {
    const entries = parseSpecEntries(getSpecLines(p, l));
    entries.splice(tableInsertRowIdx(block), 0, { type: 'row', cells: [...SPEC_EMPTY_4] });
    return writeSpecs(p, l, entries);
  };

  const addSpecBlockAfter = (p: Product, l: Lang, blockIdx: number, kind: 'section' | 'table'): Product => {
    const entries = parseSpecEntries(getSpecLines(p, l));
    const blocks = buildSpecBlocks(entries);
    const b = blocks[blockIdx];
    const at = b ? blockRange(b)[1] : entries.length;
    const line = kind === 'section'
      ? { type: 'section' as const, cells: [''] }
      : { type: 'colheader' as const, cells: [...SPEC_EMPTY_4] };
    entries.splice(at, 0, line);
    return writeSpecs(p, l, entries);
  };

  const removeSpecBlock = (p: Product, l: Lang, blockIdx: number): Product => {
    const entries = parseSpecEntries(getSpecLines(p, l));
    const b = buildSpecBlocks(entries)[blockIdx];
    if (!b) return p;
    const [start, end] = blockRange(b);
    entries.splice(start, end - start);
    return writeSpecs(p, l, entries);
  };

  const removeSpecRow = (p: Product, l: Lang, entryIdx: number): Product => {
    const entries = parseSpecEntries(getSpecLines(p, l));
    entries.splice(entryIdx, 1);
    return writeSpecs(p, l, entries);
  };

  const moveSpecBlock = (p: Product, l: Lang, blockIdx: number, dir: 1 | -1): Product => {
    const entries = parseSpecEntries(getSpecLines(p, l));
    const blocks = buildSpecBlocks(entries);
    const swapWith = dir === -1 ? blockIdx - 1 : blockIdx + 1;
    if (swapWith < 0 || swapWith >= blocks.length) return p;
    const a = blockRange(blocks[Math.min(blockIdx, swapWith)]);
    const b = blockRange(blocks[Math.max(blockIdx, swapWith)]);
    const copy = [...entries.slice(0, a[0]), ...entries.slice(b[0], b[1]), ...entries.slice(a[0], b[0]), ...entries.slice(b[1])];
    return writeSpecs(p, l, copy);
  };

  const moveSpecRow = (p: Product, l: Lang, entryIdx: number, dir: 1 | -1): Product => {
    const entries = parseSpecEntries(getSpecLines(p, l));
    const adj = entries[entryIdx + dir];
    if (adj?.type !== 'row') return p;
    return writeSpecs(p, l, moveSpecRange(entries, entryIdx, 1, dir));
  };

  if (!supabase) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
        <h2>Админ-панель</h2>
        <p style={{ color: '#888' }}>Supabase не настроен. Заполните .env и перезапустите сайт.</p>
      </div>
    );
  }

  if (!session && !hadSession) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg,#fbfaf8,#f1ece6)' }}>
        <div style={{ width: '100%', maxWidth: '380px', background: '#fff', padding: '36px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(99,67,49,0.12)' }}>
          <img src="/images/dr.svg.png" alt="Daruzen" style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 16, marginBottom: 18, filter: 'brightness(0) saturate(100%) invert(26%) sepia(13%) saturate(1185%) hue-rotate(331deg) brightness(94%) contrast(89%)' }} />
          <h2 style={{ marginTop: 0, fontSize: 22, color: 'var(--primary-dark)' }}>Личный кабинет</h2>
          <div style={label}>Email</div>
          <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={ADMIN_EMAIL_HINT} />
          <div style={label}>Пароль</div>
          <PasswordField valueRef={passwordRef} onEnter={login} />
          {authError && <p style={{ color: '#c0392b', fontSize: '14px', margin: '8px 0 0' }}>{authError}</p>}
          <button onClick={login} style={{ ...btnGold, width: '100%', marginTop: 18, padding: 13, fontSize: 16 }}>Войти</button>
        </div>
      </div>
    );
  }

  const editing = editingDraft ?? items.find(p => p.id === editingId) ?? null;

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Outfit, sans-serif', background: '#f7f4f0', color: 'var(--text-main)' }}>
      {/* Top bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #ece7e1', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/images/dr.svg.png" alt="Daruzen" style={{ width: 46, height: 46, objectFit: 'contain', borderRadius: 12, filter: 'brightness(0) saturate(100%) invert(26%) sepia(13%) saturate(1185%) hue-rotate(331deg) brightness(94%) contrast(89%)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, lineHeight: 1 }}>Панель управления</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{items.length} товаров</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {notice && <span style={{ color: '#2a7', fontSize: 14, fontWeight: 600 }}>{notice}</span>}
          <button onClick={add} style={btnGold}>+ Товар</button>
          <button onClick={logout} style={btnGhost}>Выйти</button>
        </div>
      </header>

      {/* Product grid */}
      <style>{`
        .admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }
        .admin-card {
          background: #fff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow .2s ease;
        }
        .admin-card:hover {
          box-shadow: var(--shadow-md);
        }
        .admin-card-img {
          aspect-ratio: 3 / 4;
          background: #fff;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 12px 8px 28px;
        }
        .admin-card-img img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 90%;
          object-fit: contain;
          transform: translateY(-6%);
          transition: transform .4s ease-out;
        }
        .admin-card:hover .admin-card-img img { transform: scale(1.06) translateY(-6%); }
        .admin-noimg { color: #bbb; font-size: 13px; }
        .admin-card-body { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; }
        .admin-chip {
          align-self: flex-start; font-size: 11px; font-weight: 700;
          color: var(--accent); background: #fbf3e2; padding: 3px 10px; border-radius: 100px; margin-bottom: 8px;
        }
        .admin-card-name { font-weight: 600; font-size: 15px; line-height: 1.25; min-height: 38px; color: var(--primary-dark); }
        .admin-card-foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 10px; }
        .admin-price { font-weight: 800; color: var(--primary); }
        .admin-edit-btn {
          padding: 7px 16px; border-radius: 11px; border: 1px solid #e4e0db;
          background: #fff; color: var(--text-main); font-weight: 600; font-size: 14px; cursor: pointer;
        }
        .admin-edit-btn:hover { border-color: var(--accent); color: var(--accent); }

        .admin-modal-body { display: flex; gap: 26px; align-items: flex-start; }
        .admin-modal-left { width: 300px; flex-shrink: 0; }
        .admin-modal-right { flex: 1; min-width: 0; }
        @media (max-width: 720px) {
          .admin-modal-body { flex-direction: column; }
          .admin-modal-left { width: 100%; }
        }
        .admin-modal-img {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 18px;
          background: #ffffff;
          display: grid;
          align-items: start;
          justify-items: center;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow .2s ease;
          padding: 0 0 22px;
        }
        .admin-modal-img.drag {
          box-shadow: 0 0 0 3px var(--accent) inset;
        }
        .admin-modal-img img { width: auto; height: auto; max-width: 90%; max-height: 90%; object-fit: contain; }
        .admin-modal-img-empty { color: #bbb; font-size: 13px; }
        .admin-modal-img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(58,36,16,0.55);
          backdrop-filter: blur(1px);
          display: grid;
          place-items: center;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          opacity: 0;
          transition: opacity .2s ease;
          pointer-events: none;
        }
        .admin-modal-img:hover .admin-modal-img-overlay { opacity: 1; }
        .admin-modal-link { fontSize: 12; color: #999; margin-top: 12px; }
        .admin-modal-link input { marginTop: 4px; }
        .admin-field {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          font-size: 15px;
          font-family: inherit;
          color: var(--text-main);
          background: #fff;
          border: 1px solid #e6e1da;
          border-radius: 12px;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease;
          resize: vertical;
        }
        .admin-field:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(207,155,65,0.18);
        }
        .admin-field::placeholder { color: #bcb4aa; }
        .admin-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          margin: 16px 0 7px;
        }
        .admin-tabs {
          display: flex;
          gap: 6px;
          margin-top: 22px;
          background: #f5f1ec;
          padding: 5px;
          border-radius: 14px;
        }
        .admin-tab {
          flex: 1;
          padding: 9px 8px;
          border: none;
          background: transparent;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          color: var(--text-muted);
          border-radius: 10px;
          transition: all .15s ease;
        }
        .admin-tab.active { background: var(--primary); color: #fff; }
        .admin-modal-img-overlay.show { opacity: 1; }
        .admin-modal-img-overlay svg { opacity: 0.92; }

        @keyframes draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes draw-check { to { stroke-dashoffset: 0; } }
        .check-circle { stroke-dasharray: 226; stroke-dashoffset: 226; animation: draw-circle .45s ease-out forwards; }
        .check-mark { stroke-dasharray: 48; stroke-dashoffset: 48; animation: draw-check .35s ease-out .45s forwards; }

        .admin-spec { display: flex; flex-direction: column; gap: 12px; }
        .admin-spec-card {
          background: #fff; border: 1px solid #e6ddcf; border-radius: 14px;
          box-shadow: 0 1px 3px rgba(99,67,49,0.05); overflow: hidden;
        }
        .admin-spec-card-head {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; background: #faf6ef; border-bottom: 1px solid #efe6d8;
        }
        .admin-spec-tag {
          font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
          color: #a08a6d; background: #f3ead9; padding: 3px 10px; border-radius: 100px;
        }
        .admin-spec-card-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .admin-spec-cols { display: flex; gap: 8px; }
        .admin-spec-row { display: flex; gap: 6px; align-items: center; }
        .admin-spec-row.is-sub {
          background: #fbf9f4; padding: 6px 8px; border-radius: 10px; margin: -2px 0;
        }
        .admin-spec-row.is-sub input {
          background: #fffdf9;
        }
        .admin-spec-icobtn {
          width: 28px; height: 28px; flex: 0 0 28px; border-radius: 8px; border: 1px solid #e6ddcf;
          background: #fff; color: #8a7a68; display: inline-flex; align-items: center;
          justify-content: center; cursor: pointer; padding: 0;
        }
        .admin-spec-icobtn:hover { border-color: #c9b28a; color: #a08a6d; }
        .admin-spec-icobtn.danger:hover { border-color: #e5b3b3; color: #c0392b; background: #fdf3f3; }
        .admin-spec-icobtn.active { border-color: #d9bf93; color: #a08a6d; background: #fbf3e2; }
        .admin-spec-icobtn:disabled { opacity: 0.3; cursor: default; }
        .admin-spec-icobtn:disabled:hover { border-color: #e6ddcf; color: #8a7a68; }
        .admin-spec-add {
          align-self: flex-start; margin-top: 4px; padding: 8px 14px; border-radius: 10px;
          border: 1px dashed #d5c3a6; background: #fdfaf4; color: #a08a6d;
          font-weight: 700; font-size: 13px; cursor: pointer;
        }
        .admin-spec-add:hover { border-color: #c9b28a; background: #fbf3e2; }
        .admin-spec-toolbar { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .admin-spec-addblock {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 9px 16px; border-radius: 11px; border: 1px solid #e0d6c6;
          background: #fff; color: #7a6a58; font-weight: 700; font-size: 13.5px; cursor: pointer;
        }
        .admin-spec-addblock:hover { border-color: #c9b28a; color: #a08a6d; }

        .admin-spec-table { width: 100%; border-collapse: collapse; table-layout: auto; }
        .admin-spec-table th, .admin-spec-table td { border: 1px solid #eee5d6; padding: 6px 7px; vertical-align: middle; }
        .admin-spec-table thead th { background: #faf5ec; }
        .admin-spec-table thead input {
          border: none; background: transparent; font-weight: 800; font-size: 12.5px;
          color: #7a5c3a; width: 100%; box-sizing: border-box; padding: 4px 6px; outline: none;
        }
        .admin-spec-table thead input:focus { background: #fff; border-radius: 6px; }
        .admin-spec-table tbody input {
          width: 100%; box-sizing: border-box; border: 1px solid transparent; border-radius: 8px;
          padding: 7px 9px; font-size: 13.5px; color: #4a3a2a; background: transparent;
        }
        .admin-spec-table tbody input:hover { border-color: #e6ddcf; background: #fff; }
        .admin-spec-table tbody input:focus { border-color: #c9b28a; background: #fff; outline: none; }
        .admin-spec-table tbody tr.is-sub td { background: #fbf9f4; }
        .admin-spec-table tbody tr.is-sub td.admin-spec-nest-col { border-left: 3px solid #d9bf93; }
        .admin-spec-table tbody tr.is-sub input { background: #fffdf9; }
        .admin-spec-table tbody tr.is-sub td:nth-child(2) input { padding-left: 22px; }
        .admin-spec-table .admin-spec-nest-col { width: 42px; text-align: center; }
        .admin-spec-table .admin-spec-actions-col { width: 106px; text-align: center; }
        .admin-spec-table .admin-spec-icobtn { width: 24px; height: 24px; flex: 0 0 24px; }
        .admin-spec-table .admin-spec-row-actions { display: inline-flex; gap: 3px; opacity: 0.35; transition: opacity 0.15s ease; }
        .admin-spec-table tbody tr:hover .admin-spec-row-actions { opacity: 1; }
        .admin-spec-subtag { font-size: 11.5px; color: #b3a58f; }
        .admin-spec-section-input {
          width: 100%; box-sizing: border-box; border: 1px solid #e6ddcf; border-radius: 10px;
          padding: 10px 12px; font-size: 14px; font-weight: 700; color: #4a3a2a; background: #fffdf8;
        }
        .admin-spec-section-input:focus { border-color: #c9b28a; outline: none; }
      `}</style>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {items.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 }}>Пока нет товаров. Нажмите «+ Товар».</p>}
        <div className="admin-grid">
          {items.map(p => (
            <div key={p.id} className="admin-card">
              <div className="admin-card-img">
                {p.image ? <NormalizedImg src={p.image} alt="" /> : <span className="admin-noimg">нет фото</span>}
              </div>
              <div className="admin-card-body">
                <span className="admin-chip">{CAT_LABEL[p.categoryKey]}</span>
                <div className="admin-card-name">{p.names.ru || '— без названия —'}</div>
                <div className="admin-card-foot">
                  <span className="admin-price">{p.price} ₺</span>
                  <button onClick={() => { setTabLang('ru'); setEditingDraft(p); setEditingId(p.id); setShowHint(true); }} className="admin-edit-btn">Изменить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit modal */}
      {editing && (
        <div onClick={() => { setEditingDraft(null); setEditingId(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(58,36,16,0.45)', backdropFilter: 'blur(3px)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 16px', overflowY: 'auto' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 880, background: '#fff', borderRadius: 24, boxShadow: '0 30px 80px rgba(0,0,0,0.28)', overflow: 'hidden', position: 'relative' }}>

            {/* Checkmark animation overlay */}
            {savedId === editing?.id && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(255,255,255,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, borderRadius: 24 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#28a745" strokeWidth="5" strokeLinecap="round" className="check-circle" />
                  <polyline points="24,42 36,54 56,32" fill="none" stroke="#28a745" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="check-mark" />
                </svg>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#28a745' }}>Сохранено</div>
              </div>
            )}

            {editing && (<>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #efeae4' }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary-dark)' }}>Редактирование товара</div>
              <button onClick={() => { setEditingDraft(null); setEditingId(null); }} style={{ border: 'none', background: '#f3efe9', width: 34, height: 34, borderRadius: 10, cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)' }}>×</button>
            </div>

            <div style={{ padding: 22, maxHeight: '74vh', overflowY: 'auto' }}>
              <div className="admin-modal-body">
                <div className="admin-modal-left">
                  <div
                    className={'admin-modal-img' + (dragOver ? ' drag' : '')}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setDragOver(false);
                      handleImageFile(e.dataTransfer.files?.[0] ?? null);
                    }}
                    onClick={() => (document.getElementById('img-input-' + editing.id) as HTMLInputElement | null)?.click()}
                  >
                    {editing.image
                      ? <NormalizedImg src={editing.image} alt="" />
                      : <span className="admin-modal-img-empty">Нет фото</span>}
                    <div className={'admin-modal-img-overlay' + ((showHint || dragOver) ? ' show' : '')}>
                      <RefreshCw size={34} strokeWidth={2} />
                    </div>
                    <input
                      id={'img-input-' + editing.id}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleImageFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  <div className="admin-modal-link">
                    или ссылка:
                    <input style={{ ...input, marginTop: 4, fontSize: 13 }} value={editing.image} onChange={e => update(editing.id, pr => ({ ...pr, image: e.target.value }))} placeholder="https://…" />
                  </div>
                  {editing.image && (
                    <button type="button" onClick={() => update(editing.id, pr => ({ ...pr, image: '' }))} style={{ ...btnGhost, color: '#c0392b', borderColor: '#f0d6d6', marginTop: 10, padding: '8px 14px', fontSize: 13 }}>Удалить фото</button>
                  )}
                </div>

                <div className="admin-modal-right">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <div className="admin-label">Категория</div>
                      <select className="admin-field" value={editing.categoryKey} onChange={e => update(editing.id, pr => ({ ...pr, categoryKey: e.target.value as CategoryKey }))}>
                        {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <div className="admin-label">Цена (₺)</div>
                      <input className="admin-field" type="number" value={editing.price} onChange={e => update(editing.id, pr => ({ ...pr, price: Number(e.target.value) }))} />
                    </div>
                  </div>

                  <div className="admin-tabs">
                    {LANGS.map(l => {
                      const filled = Boolean(editing.names[l] || editing.descriptions[l]);
                      return (
                        <button key={l} onClick={() => setTabLang(l)} className={'admin-tab' + (tabLang === l ? ' active' : '')}>
                          {LANG_LABELS[l]}{filled && <span style={{ color: tabLang === l ? 'rgba(255,255,255,0.7)' : '#2a7', marginLeft: 4 }}>●</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="admin-label">Название</div>
                  <input className="admin-field" value={editing.names[tabLang]} onChange={e => update(editing.id, pr => ({ ...pr, names: { ...pr.names, [tabLang]: e.target.value } }))} />

                  <div className="admin-label">Описание</div>
                  <textarea className="admin-field" style={{ minHeight: 90 }} value={editing.descriptions[tabLang]} onChange={e => update(editing.id, pr => ({ ...pr, descriptions: { ...pr.descriptions, [tabLang]: e.target.value } }))} />

                  <div style={{ marginTop: 26, paddingTop: 20, borderTop: '1px dashed #e2d8ca' }}>
                    <div className="admin-label" style={{ color: '#a08a6d' }}>Состав</div>
                    <p style={{ margin: '-2px 0 12px', fontSize: 12.5, color: '#a89a88', lineHeight: 1.55 }}>
                      Заголовки колонок кликабельны (например «1 таблетка», «Норма %»). Кнопка «вложить» делает строку подчинённой предыдущей. Порядок = порядок на сайте. Пустые строки не сохраняются.
                    </p>
                    {(() => {
                      const entries = parseSpecEntries(getSpecLines(editing, tabLang));
                      const blocks = buildSpecBlocks(entries);
                      const blockCount = blocks.length;
                      const staticHead = ['Компонент', 'Дозировка', 'Дозировка 2', 'Норма %'];
                      return (
                        <>
                          <div className="admin-spec">
                            {blocks.map((block, bi) => (
                              <div key={block.kind === 'section' ? 's' + block.entryIdx : 't' + (block.headerIdx ?? block.rows[0]?.entryIdx)} className="admin-spec-card">
                                {block.kind === 'section' ? (
                                  <>
                                    <div className="admin-spec-card-head">
                                      <span className="admin-spec-tag">Раздел</span>
                                      <span className="admin-spec-subtag">заголовок группы веществ</span>
                                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                        <button type="button" disabled={bi === 0} onClick={() => update(editing.id, pr => moveSpecBlock(pr, tabLang, bi, -1))} className="admin-spec-icobtn" title="Выше"><ChevronUp size={15} /></button>
                                        <button type="button" disabled={bi === blockCount - 1} onClick={() => update(editing.id, pr => moveSpecBlock(pr, tabLang, bi, 1))} className="admin-spec-icobtn" title="Ниже"><ChevronDown size={15} /></button>
                                        <button type="button" onClick={() => update(editing.id, pr => removeSpecBlock(pr, tabLang, bi))} className="admin-spec-icobtn danger" title="Удалить раздел"><Trash2 size={15} /></button>
                                      </div>
                                    </div>
                                    <div className="admin-spec-card-body">
                                      <input className="admin-spec-section-input" value={block.text} onChange={e => update(editing.id, pr => setSpecCell(pr, tabLang, block.entryIdx, 0, e.target.value))} placeholder="Например: Состав на 1 порцию (2 таблетки)" />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="admin-spec-card-head">
                                      <span className="admin-spec-tag">Таблица</span>
                                      <span className="admin-spec-subtag">{block.rows.length} {block.rows.length % 10 === 1 && block.rows.length % 100 !== 11 ? 'вещество' : 'веществ'}</span>
                                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                        <button type="button" disabled={bi === 0} onClick={() => update(editing.id, pr => moveSpecBlock(pr, tabLang, bi, -1))} className="admin-spec-icobtn" title="Выше"><ChevronUp size={15} /></button>
                                        <button type="button" disabled={bi === blockCount - 1} onClick={() => update(editing.id, pr => moveSpecBlock(pr, tabLang, bi, 1))} className="admin-spec-icobtn" title="Ниже"><ChevronDown size={15} /></button>
                                        <button type="button" onClick={() => update(editing.id, pr => removeSpecBlock(pr, tabLang, bi))} className="admin-spec-icobtn danger" title="Удалить таблицу"><Trash2 size={15} /></button>
                                      </div>
                                    </div>
                                    <div className="admin-spec-card-body">
                                      <table className="admin-spec-table">
                                        <thead>
                                          <tr>
                                            <th className="admin-spec-nest-col"></th>
                                            {block.headers.map((h, ci) => (
                                              <th key={ci} style={{ minWidth: ci === 0 ? 240 : 110 }}>
                                                {block.headerIdx !== null ? (
                                                  <input
                                                    value={h}
                                                    onChange={e => update(editing.id, pr => setSpecCell(pr, tabLang, block.headerIdx, ci, e.target.value))}
                                                    placeholder={staticHead[ci] ?? ''}
                                                  />
                                                ) : (
                                                  <span>{staticHead[ci] ?? ''}</span>
                                                )}
                                              </th>
                                            ))}
                                            <th className="admin-spec-actions-col"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {block.rows.map((row, ri) => {
                                            const sub = (row.cells[0] ?? '').trim().startsWith('└');
                                            return (
                                              <tr key={row.entryIdx} className={sub ? 'is-sub' : ''}>
                                                <td className="admin-spec-nest-col">
                                                  <button type="button" title={sub ? 'Снять вложенность' : 'Вложить под предыдущее'} onClick={() => update(editing.id, pr => toggleSpecSub(pr, tabLang, row.entryIdx))} className={'admin-spec-icobtn' + (sub ? ' active' : '')}><ArrowDownLeft size={15} /></button>
                                                </td>
                                                {row.cells.map((c, ci) => (
                                                  <td key={ci}>
                                                    <input value={c} onChange={e => update(editing.id, pr => setSpecCell(pr, tabLang, row.entryIdx, ci, e.target.value))} placeholder={ci === 0 ? 'Активное вещество' : 'Доза'} />
                                                  </td>
                                                ))}
                                                <td className="admin-spec-actions-col">
                                                  <span className="admin-spec-row-actions">
                                                    <button type="button" disabled={ri === 0} onClick={() => update(editing.id, pr => moveSpecRow(pr, tabLang, row.entryIdx, -1))} className="admin-spec-icobtn" title="Выше"><ChevronUp size={15} /></button>
                                                    <button type="button" disabled={ri === block.rows.length - 1} onClick={() => update(editing.id, pr => moveSpecRow(pr, tabLang, row.entryIdx, 1))} className="admin-spec-icobtn" title="Ниже"><ChevronDown size={15} /></button>
                                                    <button type="button" onClick={() => update(editing.id, pr => removeSpecRow(pr, tabLang, row.entryIdx))} className="admin-spec-icobtn danger" title="Удалить"><Trash2 size={15} /></button>
                                                  </span>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                      <button type="button" className="admin-spec-add" onClick={() => update(editing.id, pr => addSpecRowTo(pr, tabLang, block))}>
                                        <Plus size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Добавить вещество
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                            {blockCount === 0 && (
                              <div style={{ padding: 22, border: '1px dashed #e0d6c6', borderRadius: 14, textAlign: 'center', color: '#a89a88', fontSize: 13.5 }}>
                                Состав пуст. Добавьте таблицу с веществами или раздел.
                              </div>
                            )}
                          </div>
                          <div className="admin-spec-toolbar">
                            <button type="button" className="admin-spec-addblock" onClick={() => update(editing.id, pr => addSpecBlockAfter(pr, tabLang, blockCount - 1, 'table'))}>
                              <Plus size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Таблица
                            </button>
                            <button type="button" className="admin-spec-addblock" onClick={() => update(editing.id, pr => addSpecBlockAfter(pr, tabLang, blockCount - 1, 'section'))}>
                              <Plus size={14} style={{ verticalAlign: -2, marginRight: 5 }} />Раздел
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, padding: '16px 22px', borderTop: '1px solid #efeae4', background: '#fbfaf8', flexWrap: 'wrap' }}>
              <button onClick={() => translate(editing)} disabled={translatingId === editing.id || savingId === editing.id} style={{ ...btnGhost, borderColor: '#2a7', color: '#2a7', opacity: translatingId === editing.id ? 0.6 : 1 }}>
                {translatingId === editing.id ? 'Перевожу…' : '🌐 Перевести с русского'}
              </button>
              <button onClick={() => save(editing)} disabled={savingId === editing.id} style={{ ...btnGold, opacity: savingId === editing.id ? 0.6 : 1 }}>
                {savingId === editing.id ? 'Сохраняю…' : 'Сохранить'}
              </button>
              <button onClick={() => del(editing.id)} style={{ ...btnGhost, color: '#c0392b', borderColor: '#f0d6d6', marginLeft: 'auto' }}>Удалить</button>
            </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
