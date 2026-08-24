import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
  hreflang?: { lang: string; href: string }[];
  hreflangLinks?: { lang: string; href: string }[];
  lang?: string;
  ogLocale?: string;
  ogLocaleAlternates?: string[];
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://drdaruzen.com/images/og-image.png',
  ogType = 'website',
  jsonLd,
  hreflang,
  hreflangLinks,
  lang,
  ogLocale,
  ogLocaleAlternates,
}) => {
  const hreflangs = hreflang || hreflangLinks || [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Daruzen" />
      {ogLocale && <meta property="og:locale" content={ogLocale} />}
      {ogLocaleAlternates?.map(loc => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {hreflangs.map(h => (
        <link key={h.lang} rel="alternate" hreflang={h.lang} href={h.href} />
      ))}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};
