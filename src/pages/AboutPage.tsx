import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimationControls } from 'framer-motion';
import { ShieldCheck, FlaskConical, Award } from 'lucide-react';
import { useLang } from '../i18n';
import { SEOHead } from '../seo/SEOHead';

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
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(207,155,65,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <Icon size={22} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--primary-dark)' }}>{title}</h3>
        </div>
        <motion.span
          style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)' }}
          animate={pctControls}
        >
          {pct}%
        </motion.span>
      </div>
      <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(207,155,65,0.12)', overflow: 'hidden', marginBottom: '14px' }}>
        <motion.div
          style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, var(--accent-light), var(--accent))' }}
          animate={barControls}
        />
      </div>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '15px' }}>{desc}</p>
    </motion.div>
  );
};

const AboutPage: React.FC = () => {
  const { lang, t } = useLang();

  const hreflangs = [
    { lang: 'ru', href: 'https://drdaruzen.com/ru/about' },
    { lang: 'tr', href: 'https://drdaruzen.com/tr/about' },
    { lang: 'en', href: 'https://drdaruzen.com/en/about' },
    { lang: 'ar', href: 'https://drdaruzen.com/ar/about' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'О бренде Daruzen — Премиальные витамины и добавки из Турции',
    description: t.about.desc,
    url: `https://drdaruzen.com/${lang}/about`,
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
        keywords="Daruzen, о бренде, дарузен, турецкие витамины, витамины из Турции, витамины Турция, БАД, БАДы из Турции, пищевые добавки, качество, натуральные добавки, иммунитет, турецкие добавки"
        canonical={`https://drdaruzen.com/${lang}/about`}
        hreflang={hreflangs}
        jsonLd={jsonLd}
      />

      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #FDFBFA 0%, #F6F1EA 100%)', paddingTop: '80px' }}>
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
    </>
  );
};

export default AboutPage;
