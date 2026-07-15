import React from 'react';
import { useLang } from './i18n';

const SiteFooter: React.FC = () => {
  const { t } = useLang();
  return (
    <>
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
                <a href="mailto:info@daruzen.ru" style={{ color: 'inherit', textDecoration: 'none' }}>info@daruzen.ru</a>
                <a href="tel:+905510485725" style={{ color: 'inherit', textDecoration: 'none' }}>+90 551 048 57 25</a>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                   <MessageCircle size={20} />
                   <Send size={20} />
                </div>
              </nav>
            </div>
          </div>
          <div style={{ paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', opacity: 0.4, fontSize: '14px' }}>
            © {new Date().getFullYear()} DARUZEN. {t.footer.rights}
            <div style={{ marginTop: 10 }}>
              <a href="/admin" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7, fontSize: '13px' }}>
                Вход для администратора
              </a>
            </div>
          </div>
        </div>
      
    </>
  );
};
export default SiteFooter;
