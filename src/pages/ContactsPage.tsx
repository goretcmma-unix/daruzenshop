import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';
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
        keywords="Daruzen контакты, дарузен телефон, daruzen email, заказать витамины, турецкие витамины, витамины из Турции, БАД Турция, турецкие добавки"
        canonical="https://drdaruzen.com/contacts"
        jsonLd={jsonLd}
      />

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
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
    </>
  );
};

export default ContactsPage;
