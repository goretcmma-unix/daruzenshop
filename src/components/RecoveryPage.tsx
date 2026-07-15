import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const parseHash = () => {
  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);
  return {
    access_token: params.get('access_token') || '',
    refresh_token: params.get('refresh_token') || '',
    type: params.get('type') || '',
  };
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Outfit, sans-serif',
  background: '#F9F9FB',
  padding: '20px',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '380px',
  background: '#fff',
  padding: '32px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 13px',
  fontSize: '15px',
  borderRadius: '12px',
  border: '1px solid #e4e0db',
  background: '#fff',
  fontFamily: 'inherit',
  color: 'var(--text-main)',
  outline: 'none',
  marginBottom: '6px',
};

const RecoveryPage: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const { access_token, refresh_token, type } = parseHash();
    if (type !== 'recovery' || !access_token || !refresh_token) {
      setError('Ссылка недействительна или устарела.');
      setReady(true);
      return;
    }
    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) setError('Не удалось начать сброс пароля: ' + error.message);
        setReady(true);
      });
  }, []);

  const submit = async () => {
    if (password.length < 6) {
      setError('Пароль слишком короткий (минимум 6 символов).');
      return;
    }
    if (password !== confirm) {
      setError('Пароли не совпадают.');
      return;
    }
    setSaving(true);
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    window.history.replaceState(null, '', window.location.pathname);
    setTimeout(() => {
      window.location.href = '/admin';
    }, 1300);
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, fontSize: 22, color: 'var(--primary-dark)' }}>Новый пароль</h2>

        {!ready && <p style={{ color: '#888' }}>Проверка ссылки…</p>}

        {ready && error && !done && (
          <p style={{ color: '#c0392b', fontSize: 14 }}>{error}</p>
        )}

        {ready && !error && !done && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', margin: '10px 0 4px' }}>Новый пароль</div>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', margin: '10px 0 4px' }}>Повторите пароль</div>
            <input
              style={inputStyle}
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••"
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
            {error && <p style={{ color: '#c0392b', fontSize: 14 }}>{error}</p>}
            <button
              onClick={submit}
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--accent)',
                color: '#3a2410',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Сохраняю…' : 'Сохранить пароль'}
            </button>
          </>
        )}

        {done && (
          <p style={{ color: '#2a7', fontSize: 15, fontWeight: 600 }}>
            ✓ Пароль сохранён. Перенаправление в панель…
          </p>
        )}
      </div>
    </div>
  );
};

export default RecoveryPage;
