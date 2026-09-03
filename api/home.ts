import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

type Lang = 'ru' | 'tr' | 'en' | 'ar';
const ALL_LANGS: Lang[] = ['ru', 'tr', 'en', 'ar'];

const HOME_TITLE: Record<Lang, string> = {
  ru: 'Daruzen — Витамины и БАДы из Турции | Купить онлайн',
  tr: 'Daruzen — Türkiye\'den Vitaminler ve Takviyeler | Daruzen',
  en: 'Daruzen — Vitamins and Supplements from Turkey | Buy Online',
  ar: 'داروزن — فيتامينات ومكملات من تركيا | تسوق أونلاين',
};

const HOME_DESC: Record<Lang, string> = {
  ru: 'Интернет-магазин турецких витаминов и БАДов Daruzen. Омега-3, магний, цинк, железо, витамин D3, фитокомплексы. Оригинальные турецкие БАДы с доставкой.',
  tr: 'Türkiye\'den orijinal vitaminler ve takviyeler Daruzen. Omega-3, magnezyum, çinko, demir, D3 vitamini. Orijinal Türk takviyeleri.',
  en: 'Daruzen online shop of Turkish vitamins and supplements. Omega-3, magnesium, zinc, iron, vitamin D3, herbal complexes. Original Turkish supplements.',
  ar: 'متجر داروزن للفيتامينات والمكملات التركية الأصلية. أوميغا 3، مغنيسيوم، زنك، حديد، فيتامين D3، مجمعات عشبية.',
};

const HOME_KEYWORDS: Record<Lang, string> = {
  ru: 'витамины из турции, бады из турции, купить витамины, омега 3, магний, цинк, железо, витамин d3, фитокомплекс, турецкие бады',
  tr: 'türkiye vitamini, türkiye takviye, omega 3, magnezyum, çinko, demir, d3 vitamini',
  en: 'vitamins from turkey, supplements from turkey, buy vitamins, omega 3, magnesium, zinc, iron, vitamin d3',
  ar: 'فيتامينات من تركيا، مكملات من تركيا، أوميغا 3، مغنيسيوم، زنك، فيتامين d3',
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

const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  ru: { supplements: 'БАДы', vitamins: 'Витамины', minerals: 'Минералы', beauty: 'Красота', herbs: 'Травы' },
  tr: { supplements: 'Takviyeler', vitamins: 'Vitaminler', minerals: 'Mineraller', beauty: 'Güzellik', herbs: 'Bitkiler' },
  en: { supplements: 'Supplements', vitamins: 'Vitamins', minerals: 'Minerals', beauty: 'Beauty', herbs: 'Herbs' },
  ar: { supplements: 'مكملات', vitamins: 'فيتامينات', minerals: 'معادن', beauty: 'جمال', herbs: 'أعشاب' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ua = req.headers['user-agent'];
  const bot = isBot(ua);

  let lang: Lang = 'ru';
  if (ALL_LANGS.includes(req.query.lang as Lang)) {
    lang = req.query.lang as Lang;
  } else {
    const matchedPath = req.headers['x-matched-path'] as string | undefined;
    const pathMatch = matchedPath?.match(/^\/(ru|tr|en|ar)(?:\/|$)/);
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
        .select('id,name_ru,name_tr,name_en,name_ar,desc_ru,desc_tr,desc_en,desc_ar,image,price,category_key')
        .order('sort_order', { ascending: false });
      if (data) products = data;
    } catch { /* products stays [] */ }
  }

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

  const title = HOME_TITLE[lang];
  const description = HOME_DESC[lang];
  const keywords = HOME_KEYWORDS[lang];
  const canonical = `${SITE}/${lang}`;

  const hreflangTags = ALL_LANGS
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}" />`)
    .join('\n    ');
  const hreflangXDefault = `<link rel="alternate" hreflang="x-default" href="${SITE}/ru" />`;

  const catLabel = (key: string) => CATEGORY_LABELS[lang][key] || key;
  const catOf = (key: string) => `${SITE}/${lang}/catalog/${key}`;

  const url = (p: any) => `${SITE}/${lang}/product/${p.id}`;
  const image = (p: any) => (p.image?.startsWith('http') ? p.image : SITE + p.image);

  const navLinks = ['supplements', 'vitamins', 'minerals', 'beauty', 'herbs']
    .map((k) => `<a href="${catOf(k)}" style="display:inline-block;margin:0 12px 8px 0">${esc(catLabel(k))}</a>`)
    .join('');

  const productHtml = products
    .map((p) => {
      const nm = (p[`name_${lang}`] || p.name_ru || p.id).replace(/^Daruzen\s+/i, '');
      const dc = p[`desc_${lang}`] || p.desc_ru || '';
      const basePrice = Number(p.price) || 0;
      const priceRu = (basePrice * 2.2).toFixed(2);
      const short = dc.length > 140 ? dc.slice(0, 140) + '…' : dc;
      return `<li style="margin-bottom:16px"><a href="${esc(url(p))}"><img src="${esc(image(p))}" alt="${esc(nm)}" width="160" loading="lazy" style="vertical-align:top;margin-right:12px"/><strong>${esc(nm)}</strong></a><br>${esc(short)}<br><span>${priceRu} ₽</span></li>`;
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
    <meta property="og:image" content="${SITE}/images/og-image.png" />
    <meta property="og:site_name" content="Daruzen" />
    <meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : lang === 'tr' ? 'tr_TR' : lang === 'ar' ? 'ar_SA' : 'en_US'}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=8" />
    <meta name="theme-color" content="#cf9b41" />
  </head>
  <body>
    <div style="max-width:1000px;margin:0 auto;padding:24px 20px;font-family:sans-serif">
      <h1>${esc(title)}</h1>
      <p>${esc(description)}</p>
      <div style="margin:16px 0">${navLinks}</div>
      <h2>${lang === 'ru' ? 'Каталог товаров' : lang === 'tr' ? 'Ürün Kataloğu' : lang === 'ar' ? 'كتالوج المنتجات' : 'Product Catalog'}</h2>
      <ul style="list-style:none;padding:0;line-height:1.6">${productHtml}
      </ul>
    </div>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=0, max-age=300');
  res.setHeader('Vary', 'User-Agent');
  res.status(200).send(html);
}
