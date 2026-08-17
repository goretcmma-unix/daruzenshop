import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FlaskConical, Award } from 'lucide-react';
import { useLang } from '../i18n';
import { SEOHead } from '../seo/SEOHead';

const AboutPage: React.FC = () => {
  const { t } = useLang();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'О бренде Daruzen — Премиальные витамины и добавки из Турции',
    description: t.about.desc,
    url: 'https://drdaruzen.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Daruzen',
      url: 'https://drdaruzen.com',
    },
  };

  return (
    <>
      <SEOHead
        title="О бренде Daruzen — Качество, безопасность, эффективность | drdaruzen.com"
        description="Daruzen — премиальный бренд витаминов и добавок из Турции. Узнайте о нашей философии, миссии и.commitment к качеству. БАД для здоровья, иммунитета и красоты."
        keywords="Daruzen, о бренде, дарузен, турецкие витамины, витамины из Турции, витамины Турция, БАД, БАДы из Турции, пищевые добавки, качество, натуральные добавки, иммунитет, турецкие добавки, турецкий магний комплекс, турецкая омега 3, витамин д3 из турции, турецкий морской коллаген, органические витамины из турции"
        canonical="https://drdaruzen.com/about"
        jsonLd={jsonLd}
      />

      <section className="hero-section" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', paddingTop: '120px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t.about.titlePre.split(' ').slice(0, -1).join(' ')}{' '}
            <span style={{ background: 'linear-gradient(135deg, #e6bd63 0%, #cf9b41 55%, #b9822f 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent', display: 'inline-block' }}>
              {t.about.titleAccent || 'Daruzen'}
            </span>
          </motion.h1>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t.about.desc}
          </motion.p>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #FDFBFA 0%, #F6F1EA 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[ShieldCheck, FlaskConical, Award].map((Icon, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(207,155,65,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '20px' }}>
                  <Icon size={26} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '12px' }}>{t.about.features[i].title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '16px' }}>{t.about.features[i].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {t.about.brand.items.map((item, i) => (
        <section key={i} className="section-padding" style={{ background: i % 2 === 0 ? 'linear-gradient(180deg, #FAF3E7 0%, #FFFFFF 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #FDF9F2 100%)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: 'var(--primary-dark)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '24px' }}>
              {item.title}
            </h2>
            <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.85, color: 'var(--text-muted)' }}>
              {item.text}
            </p>
          </div>
        </section>
      ))}

      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #FAF3E7 0%, #FDF9F2 50%, #FFFFFF 100%)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: 'var(--primary-dark)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '24px' }}>
            {t.about.why.title}
          </h2>
          <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '24px' }}>
            {t.about.why.p1}
          </p>
          <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.85, color: 'var(--text-muted)' }}>
            {t.about.why.p2}
          </p>
        </div>
      </section>

      <nav aria-label="Breadcrumb" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>
        <ol style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--text-muted)', listStyle: 'none', padding: 0 }}>
          <li><a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Главная</a></li>
          <li>/</li>
          <li>О бренде</li>
        </ol>
      </nav>
    </>
  );
};

export default AboutPage;
