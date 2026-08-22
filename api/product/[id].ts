import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

type Lang = 'ru' | 'tr' | 'en' | 'ar';
const ALL_LANGS: Lang[] = ['ru', 'tr', 'en', 'ar'];

const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  ru: { supplements: 'БАД', vitamins: 'Витамины', minerals: 'Минералы', beauty: 'Добавки для красоты', herbs: 'Травяная добавка' },
  tr: { supplements: 'Takviye', vitamins: 'Vitamin', minerals: 'Mineral', beauty: 'Güzellik Takviyesi', herbs: 'Bitkisel Takviye' },
  en: { supplements: 'Supplement', vitamins: 'Vitamin', minerals: 'Mineral', beauty: 'Beauty Supplement', herbs: 'Herbal Supplement' },
  ar: { supplements: 'مكمل', vitamins: 'فيتامين', minerals: 'معادن', beauty: 'مكمل جمال', herbs: 'مكمل عشبي' },
};

const META_DESC_TEMPLATES: Record<Lang, (name: string, catLabel: string, firstSentence: string) => string> = {
  ru: (name, cat, s) => `${name}. ${s} Купить ${cat.toLowerCase()} из Турции с доставкой по России. Daruzen — оригинал.`,
  tr: (name, cat, s) => `${name}. ${s} Türkiye'den ${cat.toLowerCase()} satın al. Daruzen — en iyi fiyat.`,
  en: (name, cat, s) => `${name}. ${s} Buy ${cat.toLowerCase()} from Turkey with delivery. Daruzen — original at the best price.`,
  ar: (name, cat, s) => `${name}. ${s} اشترِ ${cat} من تركيا مع التوصيل. داروزن — أصلي بأفضل سعر.`,
};

const KEYWORDS_TEMPLATES: Record<Lang, (name: string, cat: string, firstSentence: string) => string> = {
  ru: (name, cat, s) => `${name}, ${cat.toLowerCase()} из Турции, купить ${cat.toLowerCase()}, ${name} купить, турция витамины, дарузен, daruzen, ${s}`,
  tr: (name, cat, s) => `${name}, Türkiye ${cat.toLowerCase()}, ${cat.toLowerCase()} al, ${name} al, daruzen, türk vitaminleri, ${s}`,
  en: (name, cat, s) => `${name}, ${cat.toLowerCase()} from Turkey, buy ${cat.toLowerCase()}, ${name} buy, daruzen, turkish vitamins, ${s}`,
  ar: (name, cat, s) => `${name}, ${cat} من تركيا، شراء ${cat}، ${name} شراء، داروزن، فيتامينات تركية، ${s}`,
};

const LOCALE_MAP: Record<Lang, string> = {
  ru: 'ru_RU',
  tr: 'tr_TR',
  en: 'en_US',
  ar: 'ar_SA',
};

const CURRENCY: Record<Lang, { code: string; rate: number; symbol: string }> = {
  ru: { code: 'RUB', rate: 2.2, symbol: '₽' },
  tr: { code: 'TRY', rate: 1, symbol: '₺' },
  en: { code: 'USD', rate: 0.025, symbol: '$' },
  ar: { code: 'TRY', rate: 1, symbol: '₺' },
};

function detectLang(acceptLanguage: string | undefined): Lang {
  if (!acceptLanguage) return 'ru';
  const prefs = acceptLanguage
    .split(',')
    .map((q) => {
      const [langPart, qPart] = q.trim().split(';');
      const qVal = qPart ? parseFloat(qPart.split('=')[1]) || 0 : 1;
      return { lang: langPart.split('-')[0].toLowerCase(), q: qVal };
    })
    .sort((a, b) => b.q - a.q);
  for (const p of prefs) {
    if (ALL_LANGS.includes(p.lang as Lang)) return p.lang as Lang;
  }
  return 'ru';
}

function isBot(ua: string | undefined): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return /googlebot|bingbot|yandex|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|applebot|whatsapp|telegrambot|ai\.yandex|duckduckbot|baidu|sogou|petalbot/i.test(lower);
}

let cachedAssets: string | null = null;
let cacheTime = 0;

async function getAssets(): Promise<string> {
  if (cachedAssets && Date.now() - cacheTime < 60000) return cachedAssets;
  try {
    const resp = await fetch(SITE, { redirect: 'follow' });
    const html = await resp.text();
    const srcSeen = new Set<string>();
    const tags: string[] = [];

    function extract(section: string) {
      const linkRe = /<link[^>]*href="([^"]+)"[^>]*>/g;
      const scriptRe = /<script[^>]*src="([^"]+)"[^>]*>(?:<\/script>)?/g;
      let m;
      while ((m = linkRe.exec(section)) !== null) {
        if (m[1].includes('/assets/') && !m[1].includes('fonts.googleapis') && !srcSeen.has(m[1])) {
          srcSeen.add(m[1]);
          tags.push(m[0]);
        }
      }
      while ((m = scriptRe.exec(section)) !== null) {
        if (!srcSeen.has(m[1])) {
          srcSeen.add(m[1]);
          tags.push(m[0]);
        }
      }
    }

    const headMatch = html.match(/<head[\s\S]*?<\/head>/);
    if (headMatch) extract(headMatch[0]);
    const bodyMatch = html.match(/<body[\s\S]*?<\/body>/);
    if (bodyMatch) extract(bodyMatch[0]);

    cachedAssets = tags.join('\n    ');
    cacheTime = Date.now();
    return cachedAssets;
  } catch {
    return '';
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) return res.status(400).send('Missing product id');

  const ua = req.headers['user-agent'];
  const bot = isBot(ua);

  let lang: Lang = 'ru';
  if (ALL_LANGS.includes(req.query.lang as Lang)) {
    lang = req.query.lang as Lang;
  } else {
    const matchedPath = req.headers['x-matched-path'] as string | undefined;
    const pathMatch = matchedPath?.match(/\/(ru|tr|en|ar)\/product\//);
    if (pathMatch && ALL_LANGS.includes(pathMatch[1] as Lang)) {
      lang = pathMatch[1] as Lang;
    } else {
      lang = detectLang(req.headers['accept-language']);
    }
  }

  let product: Record<string, unknown> | null = null;
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      product = data as Record<string, unknown> | null;
    } catch {
      /* product stays null */
    }
  }

  if (!product) return res.status(404).send('Product not found');

  const get = (field: string): string => {
    const val = product![`${field}_${lang}`] ?? product![`${field}_ru`] ?? '';
    return typeof val === 'string' ? val : '';
  };

  const name = get('name') || id;
  const cleanName = name.replace(/^Daruzen\s+/i, '');
  const desc = get('desc') || '';
  const catKey = (product.category_key as string) || 'supplements';
  const catLabel = CATEGORY_LABELS[lang][catKey] || CATEGORY_LABELS[lang].supplements;
  const imageUrl = typeof product.image === 'string'
    ? (product.image.startsWith('http') ? product.image : SITE + product.image)
    : SITE + '/images/og-image.png';
  const basePrice = Number(product.price) || 0;
  const cur = CURRENCY[lang];
  const converted = basePrice * cur.rate;
  const price = converted.toFixed(2);
  const firstSentence = desc.split(/[.!؟]\s/)[0] || desc.slice(0, 120);

  const title = `${cleanName} | Daruzen`;
  const rawDesc = META_DESC_TEMPLATES[lang](name, catLabel, firstSentence);
  const description = rawDesc.length > 155 ? rawDesc.slice(0, 152).replace(/[,;]\s*$/, '') + '...' : rawDesc;
  const keywords = KEYWORDS_TEMPLATES[lang](name, catLabel, firstSentence);

  const canonical = `${SITE}/${lang}/product/${id}`;

  const hreflangLinks = ALL_LANGS.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/product/${id}" />`
  ).join('\n    ');
  const xDefaultLink = `<link rel="alternate" hreflang="x-default" href="${canonical}" />`;

  const stockSpec = (product.specs as Record<string, unknown>)?._stock;
  const inStock = stockSpec !== '0' && (Array.isArray(stockSpec) ? stockSpec[0] !== '0' : true) && product.inStock !== false && product.in_stock !== false;

  const jsonLd: Record<string, unknown> = {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    name,
    description: desc,
    image: [imageUrl],
    sku: id,
    mpn: id,
    brand: { '@type': 'Brand', name: 'Daruzen' },
    category: catLabel,
    url: canonical,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: cur.code,
      availability: inStock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
      url: canonical,
      seller: { '@type': 'Organization', name: 'Daruzen' },
    },
  };

  const ratingVal = product.rating_value != null ? Number(product.rating_value) : null;
  const reviewCount = product.review_count != null ? Number(product.review_count) : null;
  if (ratingVal && reviewCount && reviewCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(ratingVal),
      reviewCount: String(reviewCount),
    };
  }

  if (!bot) {
    try {
      const resp = await fetch(SITE, { redirect: 'follow' });
      const spaHtml = await resp.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return res.status(200).send(spaHtml);
    } catch {
      return res.redirect(302, '/');
    }
  }

  const html = `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="keywords" content="${esc(keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${esc(canonical)}" />
    ${hreflangLinks}
    ${xDefaultLink}
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:type" content="${imageUrl.endsWith('.png') ? 'image/png' : imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') ? 'image/jpeg' : 'image/webp'}" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="800" />
    <meta property="og:image:alt" content="${esc(name)}" />
    <meta property="og:site_name" content="Daruzen" />
    <meta property="og:locale" content="${LOCALE_MAP[lang]}" />
    ${ALL_LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LOCALE_MAP[l]}" />`).join('\n    ')}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192.png" />
    <meta name="theme-color" content="#cf9b41" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Daruzen","url":"${SITE}","logo":"${SITE}/images/dr.svg.png"}</script>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"${lang === 'ru' ? 'Главная' : lang === 'tr' ? 'Ana Sayfa' : lang === 'ar' ? 'الرئيسية' : 'Home'}","item":"${SITE}/${lang}"},{"@type":"ListItem","position":2,"name":"${lang === 'ru' ? 'Каталог' : lang === 'tr' ? 'Katalog' : lang === 'ar' ? 'الفهرس' : 'Catalog'}","item":"${SITE}/${lang}#catalog"},{"@type":"ListItem","position":3,"name":"${name}","item":"${canonical}"}]}</script>
  </head>
  <body>
    <div style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:sans-serif">
      <h1>${esc(name)}</h1>
      <p>${esc(desc)}</p>
      <p><strong>${lang === 'ru' ? 'Цена' : lang === 'tr' ? 'Fiyat' : lang === 'ar' ? 'السعر' : 'Price'}:</strong> ${price} ${cur.symbol}</p>
      <p><strong>${lang === 'ru' ? 'Наличие' : lang === 'tr' ? 'Stok durumu' : lang === 'ar' ? 'التوفر' : 'Availability'}:</strong> ${inStock ? (lang === 'ru' ? 'В наличии' : lang === 'tr' ? 'Stokta' : lang === 'ar' ? 'متوفر' : 'In Stock') : (lang === 'ru' ? 'Нет в наличии' : lang === 'tr' ? 'Stokta yok' : lang === 'ar' ? 'غير متوفر' : 'Out of Stock')}</p>
      <img src="${imageUrl}" alt="${esc(name)}" width="600" />
      <p><a href="${esc(canonical)}">${lang === 'ru' ? 'Открыть на сайте Daruzen' : lang === 'tr' ? 'Daruzen sitesinde aç' : lang === 'ar' ? 'فتح على موقع داروزن' : 'Open on Daruzen website'}</a></p>
    </div>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=0, max-age=300');
  res.setHeader('Vary', 'User-Agent');
  res.status(200).send(html);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
