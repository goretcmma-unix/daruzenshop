import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { useLang } from '../i18n';
import { SEOHead } from '../seo/SEOHead';

const ContactsPage: React.FC = () => {
  const { t } = useLang();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Контакты Daruzen — Свяжитесь с нами',
    description: 'Контакты бренда Daruzen: телефон, email, офис в Турции. Закажите витамины и добавки.',
    url: 'https://drdaruzen.com/contacts',
  };

  return (
    <>
      <SEOHead
        title="Контакты Daruzen — Телефон, Email, Офис в Турции | drdaruzen.com"
        description="Свяжитесь с Daruzen: +90 544 679 10 12, daruzenshop@outlook.com. Офис в Стамбуле, Турция. Закажите витамины и добавки через WhatsApp или Telegram."
        keywords="Daruzen контакты, дарузен телефон, daruzen email, заказать витамины, БАД Турция"
        canonical="https://drdaruzen.com/contacts"
        jsonLd={jsonLd}
      />

      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', alignItems: 'center', paddingTop: '120px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="hero-title">{t.contacts.titlePre} <span style={{ color: 'var(--accent)' }}>{t.contacts.titleAccent}</span></h1>
          <p className="hero-description">{t.contacts.desc}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="contacts-grid">
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}><MapPin size={24} /></div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{t.contacts.office}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{t.contacts.officeAddr}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}><Mail size={24} /></div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{t.contacts.email}</div>
                    <a href={`mailto:${t.contacts.emailAddr}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t.contacts.emailAddr}</a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}><Phone size={24} /></div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{t.contacts.phone}</div>
                    <a href="tel:+905510485725" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t.contacts.phoneNum}</a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '40px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-dark)', display: 'block', marginBottom: '8px', marginLeft: '4px' }}>{t.contacts.form.nameLabel}</label>
                  <input required type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder={t.contacts.form.namePlaceholder}
                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border)', background: '#FDFBFA', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-dark)', display: 'block', marginBottom: '8px', marginLeft: '4px' }}>{t.contacts.form.emailLabel}</label>
                  <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder={t.contacts.form.emailPlaceholder}
                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border)', background: '#FDFBFA', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-dark)', display: 'block', marginBottom: '8px', marginLeft: '4px' }}>{t.contacts.form.msgLabel}</label>
                  <textarea rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder={t.contacts.form.msgPlaceholder}
                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border)', background: '#FDFBFA', fontSize: '16px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting || isSubmitted}
                  className="btn btn-primary" style={{ width: '100%', height: '60px', marginTop: '10px', ...(isSubmitted ? { background: '#25D366' } : {}) }}>
                  {isSubmitting ? t.contacts.form.submitting : isSubmitted ? t.contacts.form.submitted : t.contacts.form.submit}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Breadcrumb" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>
        <ol style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--text-muted)', listStyle: 'none', padding: 0 }}>
          <li><a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Главная</a></li>
          <li>/</li>
          <li>Контакты</li>
        </ol>
      </nav>
    </>
  );
};

export default ContactsPage;
