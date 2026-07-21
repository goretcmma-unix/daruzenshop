import { useEffect, useRef, useState } from 'react';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import { supabase, fetchProducts, upsertProduct, deleteProduct } from '../lib/supabase';
import { autoTranslateFromRu } from '../lib/translate';
import type { Product, CategoryKey, Lang } from '../data';

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
  const [dots, setDots] = useState(0);
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const setVal = (v: string) => { valueRef.current = v; setDots(v.length); };
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
          ? valueRef.current
          : dots > 0
            ? '•'.repeat(dots)
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
  const [email, setEmail] = useState('');
  const passwordRef = useRef('');
  const [authError, setAuthError] = useState('');
  const [items, setItems] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [tabLang, setTabLang] = useState<Lang>('ru');
  const [showHint, setShowHint] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session as never));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s as never));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      setNotice('Загрузка…');
      fetchProducts().then(data => { setItems(data); setNotice(''); });
    }
  }, [session]);

  useEffect(() => {
    if (!editingId) return;
    setShowHint(true);
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
    setSession(null);
    setItems([]);
  };

  const update = (id: string, fn: (p: Product) => Product) =>
    setItems(prev => prev.map(p => (p.id === id ? fn(p) : p)));

  const save = async (p: Product) => {
    setSavingId(p.id);
    setNotice('');
    try {
      await upsertProduct(p);
      setNotice('Сохранено ✓');
      setTimeout(() => setNotice(''), 2000);
      setEditingId(null);
      const data = await fetchProducts();
      setItems(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setNotice('Ошибка сохранения: ' + msg);
    } finally {
      setSavingId(null);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm('Удалить этот товар?')) return;
    await deleteProduct(id);
    setItems(prev => prev.filter(p => p.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const add = () => {
    const p = emptyProduct();
    setItems(prev => [p, ...prev]);
    setTabLang('ru');
    setEditingId(p.id);
  };

  const translate = async (id: string) => {
    setTranslatingId(id);
    setNotice('Перевод…');
    try {
      const p = items.find(x => x.id === id);
      if (p) {
        const translated = await autoTranslateFromRu(p);
        update(id, () => translated);
        setNotice('Переведено ✓ (проверьте и сохраните)');
        setTimeout(() => setNotice(''), 3000);
      }
    } catch {
      setNotice('Ошибка перевода');
    } finally {
      setTranslatingId(null);
    }
  };

  const handleImageFile = (file: File | null) => {
    if (!editing || !file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => update(editing.id, pr => ({ ...pr, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const specsLines = (p: Product, l: Lang) => (p.specs?.[l] ?? []).join('\n');
  const setSpecsLine = (p: Product, l: Lang, val: string): Product => ({
    ...p,
    specs: { ...(p.specs ?? {}), [l]: val.split('\n').map(s => s.trim()).filter(Boolean) },
  });

  if (!supabase) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
        <h2>Админ-панель</h2>
        <p style={{ color: '#888' }}>Supabase не настроен. Заполните .env и перезапустите сайт.</p>
      </div>
    );
  }

  if (!session) {
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

  const editing = items.find(p => p.id === editingId) ?? null;

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
      `}</style>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {items.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 }}>Пока нет товаров. Нажмите «+ Товар».</p>}
        <div className="admin-grid">
          {items.map(p => (
            <div key={p.id} className="admin-card">
              <div className="admin-card-img">
                {p.image ? <img src={p.image} alt="" /> : <span className="admin-noimg">нет фото</span>}
              </div>
              <div className="admin-card-body">
                <span className="admin-chip">{CAT_LABEL[p.categoryKey]}</span>
                <div className="admin-card-name">{p.names.ru || '— без названия —'}</div>
                <div className="admin-card-foot">
                  <span className="admin-price">{p.price} ₺</span>
                  <button onClick={() => { setTabLang('ru'); setEditingId(p.id); }} className="admin-edit-btn">Изменить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit modal */}
      {editing && (
        <div onClick={() => setEditingId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(58,36,16,0.45)', backdropFilter: 'blur(3px)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 16px', overflowY: 'auto' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 880, background: '#fff', borderRadius: 24, boxShadow: '0 30px 80px rgba(0,0,0,0.28)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #efeae4' }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary-dark)' }}>Редактирование товара</div>
              <button onClick={() => setEditingId(null)} style={{ border: 'none', background: '#f3efe9', width: 34, height: 34, borderRadius: 10, cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)' }}>×</button>
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
                      ? <img src={editing.image} alt="" />
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

                  <div className="admin-label">Характеристики — каждая с новой строки</div>
                  <textarea className="admin-field" style={{ minHeight: 64 }} value={specsLines(editing, tabLang)} onChange={e => update(editing.id, pr => setSpecsLine(pr, tabLang, e.target.value))} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, padding: '16px 22px', borderTop: '1px solid #efeae4', background: '#fbfaf8', flexWrap: 'wrap' }}>
              <button onClick={() => translate(editing.id)} disabled={translatingId === editing.id || savingId === editing.id} style={{ ...btnGhost, borderColor: '#2a7', color: '#2a7', opacity: translatingId === editing.id ? 0.6 : 1 }}>
                {translatingId === editing.id ? 'Перевожу…' : '🌐 Перевести с русского'}
              </button>
              <button onClick={() => save(editing)} disabled={savingId === editing.id} style={{ ...btnGold, opacity: savingId === editing.id ? 0.6 : 1 }}>
                {savingId === editing.id ? 'Сохраняю…' : 'Сохранить'}
              </button>
              <button onClick={() => del(editing.id)} style={{ ...btnGhost, color: '#c0392b', borderColor: '#f0d6d6', marginLeft: 'auto' }}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
