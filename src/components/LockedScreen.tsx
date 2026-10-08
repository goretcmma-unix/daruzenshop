import React from 'react';

const LockedScreen: React.FC<{ subtitle?: string }> = ({ subtitle = 'Сервис временно отключён. После оплаты доступ будет открыт.' }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: '#000',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '24px',
    zIndex: 9999,
  }}>
    <h1 style={{
      margin: 0,
      maxWidth: '920px',
      fontSize: 'clamp(30px, 6vw, 64px)',
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    }}>
      Сервис будет доступен после оплаты
    </h1>
    <p style={{
      margin: '28px 0 0',
      maxWidth: '640px',
      fontSize: 'clamp(15px, 2vw, 20px)',
      lineHeight: 1.6,
      color: 'rgba(255, 255, 255, 0.55)',
    }}>
      {subtitle}
    </p>
  </div>
);

export default LockedScreen;
