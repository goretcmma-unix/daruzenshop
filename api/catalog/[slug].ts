import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

type Lang = 'ru' | 'tr' | 'en' | 'ar';
const ALL_LANGS: Lang[] = ['ru', 'tr', 'en', 'ar'];

// Slug -> category key. Один slug на каждом языке (без кодирования кириллицы/арабской вязи).
const SLUG_TO_KEY: Record<string, string> = {
  supplements: 'supplements',
  vitamins: 'vitamins',
  minerals: 'minerals',
  beauty: 'beauty',
  herbs: 'herbs',
};

const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  ru: { supplements: 'БАД', vitamins: 'Витамины', minerals: 'Минералы', beauty: 'Добавки для красоты', herbs: 'Травяная добавка' },
  tr: { supplements: 'Takviye', vitamins: 'Vitamin', minerals: 'Mineral', beauty: 'Güzellik Takviyesi', herbs: 'Bitkisel Takviye' },
  en: { supplements: 'Supplement', vitamins: 'Vitamin', minerals: 'Mineral', beauty: 'Beauty Supplement', herbs: 'Herbal Supplement' },
  ar: { supplements: 'мكمل', vitamins: 'فيتامين', minerals: 'معادن', beauty: 'مكمل جمال', herbs: 'مكمل عشبي' },
};

const CATEGORY_TITLE: Record<Lang, Record<string, string>> = {
  ru: {
    supplements: 'БАДы и добавки из Турции — купить оригинальные БАД доставкой по России | Daruzen',
    vitamins: 'Витамины из Турции — купить оригинальные витамины с доставкой | Daruzen',
    minerals: 'Минералы и микроэлементы — магний, цинк, железо из Турции | Daruzen',
    beauty: 'Добавки для красоты — волосы, кожа, ногти | Daruzen',
    herbs: 'Травяные БАДы и фитокомплексы из Турции | Daruzen',
  },
  tr: {
    supplements: 'Türkiye\'den Takviye ve Besin Destekleri | Daruzen',
    vitamins: 'Türkiye\'den Orijinal Vitaminler | Daruzen',
    minerals: 'Mineraller ve Çinko, Magnezyum, Demir | Daruzen',
    beauty: 'Güzellik Takviyeleri — Saç, Cilt, Tırnak | Daruzen',
    herbs: 'Bitkisel Takviyeler | Daruzen',
  },
  en: {
    supplements: 'Supplements from Turkey — Buy Original Supplements | Daruzen',
    vitamins: 'Vitamins from Turkey — Buy Original Vitamins | Daruzen',
    minerals: 'Minerals — Magnesium, Zinc, Iron from Turkey | Daruzen',
    beauty: 'Beauty Supplements — Hair, Skin, Nails | Daruzen',
    herbs: 'Herbal Supplements from Turkey | Daruzen',
  },
  ar: {
    supplements: 'مكملات غذائية من تركيا — شراء مكملات أصلية | داروزن',
    vitamins: 'فيتامينات من تركيا — شراء فيتامينات أصلية | داروزن',
    minerals: 'معادن وعناصر — مغنيسيوم، زنك، حديد | داروزن',
    beauty: 'مكملات الجمال — شعر، بشرة، أظافر | داروزن',
    herbs: 'مكملات عشبية من تركيا | داروزن',
  },
};

const CATEGORY_DESC: Record<Lang, Record<string, string>> = {
  ru: {
    supplements: 'Оригинальные БАДы из Турции с доставкой по России. Премиальные добавки для иммунитета, энергии, сердца, мозга и общего тонуса. Сертифицировано, гарантия подлинности.',
    vitamins: 'Оригинальные витамины из Турции: витамин D3, витамин C, омега-3, мультивитамины. Натуральные и эффективные комплексы с доставкой по России.',
    minerals: 'Минералы и микроэлементы: магний, цинк, железо, селен, хром. Высокоусваиваемые формы из Турции для нервной системы, иммунитета и здоровья.',
    beauty: 'Добавки для красоты: коллаген, биотин, витамины для волос, кожи и ногтей. Оригинальные комплексы из Турции для сияющей внешности.',
    herbs: 'Травяные БАДы и фитокомплексы из Турции: гинкго билоба, расторопша, куркума. Натуральные растительные экстракты для здоровья.',
  },
  tr: {
    supplements: 'Türkiye\'den orijinal takviye ve besin destekleri. Bağışıklık, enerji, kalp ve beyin için premium takviyeler. Sertifikalı, orijinal garantili.',
    vitamins: 'Türkiye\'den orijinal vitaminler: D3 vitamini, C vitamini, omega-3, multivitaminler. Doğal ve etkili kompleksler.',
    minerals: 'Mineraller ve eser elementler: magnezyum, çinko, demir, selenyum, krom. Yüksek emilimli formlar.',
    beauty: 'Güzellik takviyeleri: kolajen, biotin, saç, cilt ve tırnak vitaminleri. Orijinal kompleksler.',
    herbs: 'Türkiye\'den bitkisel takviyeler: ginkgo biloba, devedikeni, zerdeçal. Doğal bitki özleri.',
  },
  en: {
    supplements: 'Original supplements from Turkey with delivery. Premium additions for immunity, energy, heart, brain and overall tone. Certified, authenticity guaranteed.',
    vitamins: 'Original vitamins from Turkey: vitamin D3, vitamin C, omega-3, multivitamins. Natural and effective complexes.',
    minerals: 'Minerals and trace elements: magnesium, zinc, iron, selenium, chromium. Highly absorbable forms.',
    beauty: 'Beauty supplements: collagen, biotin, hair, skin and nail vitamins. Original complexes.',
    herbs: 'Herbal supplements from Turkey: ginkgo biloba, milk thistle, turmeric. Natural plant extracts.',
  },
  ar: {
    supplements: 'مكملات غذائية أصلية من تركيا مع التوصيل. مكملات مميزة للمناعة والطاقة والقلب والدماغ. معتمدة وضمان الأصالة.',
    vitamins: 'فيتامينات أصلية من تركيا: فيتامين D3، فيتامين C، أوميغا 3، مالتي فيتامين. مجمعات طبيعية وفعالة.',
    minerals: 'معادن وعناصر: مغنيسيوم، زنك، حديد، سيلينيوم، كروم. أشكال عالية الامتصاص.',
    beauty: 'مكملات الجمال: كولاجين، بيوتين، فيتامينات للشعر والبشرة والأظافر.',
    herbs: 'مكملات عشبية من تركيا: جنكغو بيلوبا، شوك الحليب، كركم. مستخلصات نباتية طبيعية.',
  },
};

const CATEGORY_KEYWORDS: Record<Lang, Record<string, string>> = {
  ru: {
    supplements: 'бады из турции, купить бады, добавки из турции, бад с рыбьим жиром, бад для иммунитета, турецкие бады, оригинальные бады',
    vitamins: 'витамины из турции, купить витамины, витамин d3, витамин c, омега 3, мультивитамины, турецкие витамины, оригинальные витамины',
    minerals: 'минералы, магний, цинк, железо, селен, хром, купить минералы, минералы из турции, микроэлементы',
    beauty: 'добавки для красоты, витамины для волос, витамины для кожи, витамины для ногтей, биотин, коллаген',
    herbs: 'травяные бады, фитокомплексы, гинкго билоба, расторопша, куркума, травы из турции, растительные экстракты',
  },
  tr: {
    supplements: 'türkiye takviye, takviye al, besin desteği, bağışıklık takviyesi, orijinal takviye',
    vitamins: 'türkiye vitamini, vitamin al, d3 vitamini, c vitamini, omega 3, multivitamin',
    minerals: 'mineral, magnezyum, çinko, demir, selenyum, krom, eser element',
    beauty: 'güzellik takviyesi, saç vitamini, cilt vitamini, tırnak vitamini, biotin, kolajen',
    herbs: 'bitkisel takviye, ginkgo biloba, devedikeni, zerdeçal, bitki özü',
  },
  en: {
    supplements: 'supplements from turkey, buy supplements, dietary supplements, immunity supplements, original supplements',
    vitamins: 'vitamins from turkey, buy vitamins, vitamin d3, vitamin c, omega 3, multivitamins, turkish vitamins',
    minerals: 'minerals, magnesium, zinc, iron, selenium, chromium, trace elements',
    beauty: 'beauty supplements, hair vitamins, skin vitamins, nail vitamins, biotin, collagen',
    herbs: 'herbal supplements, ginkgo biloba, milk thistle, turmeric, plant extracts',
  },
  ar: {
    supplements: 'مكملات من تركيا، شراء مكملات، مكملات المناعة، مكملات أصلية',
    vitamins: 'فيتامينات من تركيا، شراء فيتامينات، فيتامين d3، فيتامين c، أوميغا 3',
    minerals: 'معادن، مغنيسيوم، زنك، حديد، سيلينيوم، عناصر نادرة',
    beauty: 'مكملات الجمال، فيتامينات الشعر، فيتامينات البشرة، بيوتين، كولاجين',
    herbs: 'مكملات عشبية، جنكغو بيلوبا، كركم، مستخلصات نباتية',
  },
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isBot(ua: string | undefined): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return /googlebot|bingbot|yandex|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|applebot|whatsapp|telegrambot|ai\.yandex|duckduckbot|baidu|sogou|petalbot/i.test(lower);
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = (req.query.slug as string) || '';
  const catKey = SLUG_TO_KEY[slug.toLowerCase()];
  if (!catKey) return res.status(404).send('Category not found');

  const ua = req.headers['user-agent'];
  const bot = isBot(ua);

  let lang: Lang = 'ru';
  if (ALL_LANGS.includes(req.query.lang as Lang)) {
    lang = req.query.lang as Lang;
  } else {
    const matchedPath = req.headers['x-matched-path'] as string | undefined;
    const pathMatch = matchedPath?.match(/\/(ru|tr|en|ar)\/catalog\//);
    if (pathMatch && ALL_LANGS.includes(pathMatch[1] as Lang)) {
      lang = pathMatch[1] as Lang;
    } else {
      lang = detectLang(req.headers['accept-language']);
    }
  }

  let products: any[] = [];
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category_key', catKey)
        .order('sort_order', { ascending: false });
      if (data) products = data;
    } catch { /* products stays [] */ }
  }

  const title = CATEGORY_TITLE[lang][catKey];
  const description = CATEGORY_DESC[lang][catKey];
  const keywords = CATEGORY_KEYWORDS[lang][catKey];
  const catLabel = CATEGORY_LABELS[lang][catKey];
  const canonical = `${SITE}/${lang}/catalog/${slug}`;

  const hreflangTags = ALL_LANGS
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/catalog/${slug}" />`)
    .join('\n    ');
  const hreflangXDefault = `<link rel="alternate" hreflang="x-default" href="${SITE}/ru/catalog/${slug}" />`;

  const url = (p: any) => `${SITE}/${lang}/product/${p.id}`;
  const image = (p: any) => (p.image?.startsWith('http') ? p.image : SITE + p.image);

  const itemList = products
    .map((p, i) => {
      const nm = p[`name_${lang}`] || p.name_ru || p.id;
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: nm.replace(/^Daruzen\s+/i, ''),
        url: url(p),
        image: image(p),
      };
    })
    .slice(0, 100);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title.replace(/\s*\|\s*Daruzen\s*$/, ''),
    description,
    url: canonical,
    keywords,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: itemList.length,
      itemListElement: itemList,
    },
  };

  if (!bot) {
    try {
      const resp = await fetch(SITE + '/index.html', { redirect: 'follow' });
      const spaHtml = await resp.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return res.status(200).send(spaHtml);
    } catch {
      return res.redirect(302, '/');
    }
  }

  const productHtml = products
    .map((p) => {
      const nm = (p[`name_${lang}`] || p.name_ru || p.id).replace(/^Daruzen\s+/i, '');
      const dc = p[`desc_${lang}`] || p.desc_ru || '';
      const basePrice = Number(p.price) || 0;
      const priceRu = (basePrice * 2.2).toFixed(2);
      return `<li><a href="${esc(url(p))}">${esc(nm)}</a><br><img src="${esc(image(p))}" alt="${esc(nm)}" width="160" loading="lazy"/><br>${priceRu} ₽</li>`;
    })
    .join('\n      ');

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
    ${hreflangTags}
    ${hreflangXDefault}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:site_name" content="Daruzen" />
    <meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : lang === 'tr' ? 'tr_TR' : lang === 'ar' ? 'ar_SA' : 'en_US'}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=8" />
    <meta name="theme-color" content="#cf9b41" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"${lang === 'ru' ? 'Главная' : lang === 'tr' ? 'Ana Sayfa' : lang === 'ar' ? 'الرئيسية' : 'Home'}","item":"${SITE}/${lang}"},{"@type":"ListItem","position":2,"name":"${lang === 'ru' ? 'Каталог' : lang === 'tr' ? 'Katalog' : lang === 'ar' ? 'الفهرس' : 'Catalog'}","item":"${SITE}/${lang}/catalog"},{"@type":"ListItem","position":3,"name":"${esc(catLabel)}","item":"${canonical}"}]}</script>
  </head>
  <body>
    <nav style="max-width:900px;margin:0 auto;padding:24px 20px;font-family:sans-serif">
      <a href="${SITE}/${lang}">${lang === 'ru' ? 'Главная' : lang === 'tr' ? 'Ana Sayfa' : lang === 'ar' ? 'الرئيسية' : 'Home'}</a> &gt;
      <a href="${SITE}/${lang}/catalog">${lang === 'ru' ? 'Каталог' : lang === 'tr' ? 'Katalog' : lang === 'ar' ? 'الفهرس' : 'Catalog'}</a>
    </nav>
    <div style="max-width:900px;margin:0 auto;padding:0 20px 40px;font-family:sans-serif">
      <h1>${esc(catLabel)} — Daruzen</h1>
      <p>${esc(description)}</p>
      <a href="${esc(canonical)}" style="display:inline-block;margin:16px 0;padding:12px 20px;background:#cf9b41;color:#fff;border-radius:8px;text-decoration:none">${lang === 'ru' ? 'Открыть раздел на сайте' : lang === 'tr' ? 'Sitede aç' : lang === 'ar' ? 'فتح على الموقع' : 'Open on the site'}</a>
      <ul style="list-style:none;padding:0;line-height:1.7">${productHtml}
      </ul>
    </div>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=0, max-age=300');
  res.setHeader('Vary', 'User-Agent');
  res.status(200).send(html);
}
