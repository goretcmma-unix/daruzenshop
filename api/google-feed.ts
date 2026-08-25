import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const SEO_NAMES: Record<string, Record<string, string>> = {
  'prod-1': { ru: 'BSO Gummy — Витамин D3, Цинк', tr: 'BSO Gummy — D3 Vitamini, Çinko', en: 'BSO Gummy — Vitamin D3, Zinc', ar: 'BSO جيمي — فيتامين د3، زنك' },
  'prod-2': { ru: 'Omega 3 Gummy — EPA 600 мг, DHA 400 мг', tr: 'Omega 3 Gummy — EPA 600 mg, DHA 400 mg', en: 'Omega 3 Gummy — EPA 600 mg, DHA 400 mg', ar: 'أوميغا 3 جيمي — EPA 600 ملغ، DHA 400 ملغ' },
  'prod-3': { ru: 'ACV Gummy — B12, B9, Яблочный уксус', tr: 'ACV Gummy — B12, B9, Elma Sirkesi', en: 'ACV Gummy — B12, B9, Apple Cider Vinegar', ar: 'ACV جيمي — ب12، ب9، خل التفاح' },
  'prod-4': { ru: 'Magnesium B6 Gummy — 4 формы магния', tr: 'Magnesium B6 Gummy — 4 Form Magnezyum', en: 'Magnesium B6 Gummy — 4 Form Magnesium', ar: 'مغنيسيوم B6 جيمي — 4 أشكال مغنيسيوم' },
  'prod-5': { ru: 'Herb Gummy — 11 растительных экстрактов', tr: 'Herb Gummy — 11 Bitki Özü', en: 'Herb Gummy — 11 Herbal Extracts', ar: 'هيرب جيمي — 11 مستخلص عشبي' },
  'prod-6': { ru: 'Zinc Selenium Gummy — Цинк, Селен, Медь', tr: 'Zinc Selenium Gummy — Çinko, Selenyum, Bakır', en: 'Zinc Selenium Gummy — Zinc, Selenium, Copper', ar: 'زنك سيلينيوم جيمي — زنك، سيلينيوم، نحاس' },
  'prod-7': { ru: 'Artichoke Gummy — Артишок, Расторопша', tr: 'Artichoke Gummy — Enginar, Deve Dikeni', en: 'Artichoke Gummy — Artichoke, Milk Thistle', ar: 'أرتيشوك جيمي — خرشوف، شوكة القديس' },
  'prod-8': { ru: 'CoQ10 NADH Gummy — B6, B12, Глутатион', tr: 'CoQ10 NADH Gummy — B6, B12, Glutatyon', en: 'CoQ10 NADH Gummy — B6, B12, Glutathione', ar: 'كوجيميو NADH جيمي — ب6، ب12، غلوتاثيون' },
  'prod-9': { ru: 'Chromium Gummy — Хром, Гимнема', tr: 'Chromium Gummy — Krom, Gymnema', en: 'Chromium Gummy — Chromium, Gymnema', ar: 'كروم جيمي — كروم، جيمنيما' },
  'prod-10': { ru: 'Ginkgo Ginseng Gummy — Гинкго, Женьшень', tr: 'Ginkgo Ginseng Gummy — Ginkgo, Ginseng', en: 'Ginkgo Ginseng Gummy — Ginkgo Biloba, Ginseng', ar: 'جنكجو جنسنج جيمي — جنكجو بيلوبا، جنسنج' },
  'prod-11': { ru: 'Multi Gummy — C, D3, Лютейн, Омега-3, Цинк', tr: 'Multi Gummy — C, D3, Lutein, Omega-3, Çinko', en: 'Multi Gummy — C, D3, Lutein, Omega-3, Zinc', ar: 'מולטי جيمي — سي، د3، لوتين، أوميغا 3، زنك' },
  'prod-12': { ru: 'Multivitamin Gummy — C, E, A, B12', tr: 'Multivitamin Gummy — C, E, A, B12', en: 'Multivitamin Gummy — C, E, A, B12', ar: 'ملتي فيتامين جيمي — سي، إي، أ، ب12' },
  'prod-13': { ru: 'Folic Acid Gummy — Фолиевая кислота, Цинк, Q10', tr: 'Folic Acid Gummy — Folik Asit, Çinko, Q10', en: 'Folic Acid Gummy — Folic Acid, Zinc, Q10', ar: 'حمض فوليك جيمي — حمض فوليك، زنك، Q10' },
  'prod-14': { ru: 'Iron Gummy — Железо, Витамин C', tr: 'Iron Gummy — Demir, C Vitamini', en: 'Iron Gummy — Iron, Vitamin C', ar: 'حديد جيمي — حديد، فيتامين سي' },
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(d: Date): string {
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  let products: any[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: false });
      if (data && !error) products = data;
    } catch {}
  }

  if (products.length === 0) {
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel></channel></rss>');
    return;
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
  xml += '<channel>\n';
  xml += '<title>Daruzen — Vitamins &amp; Supplements from Turkey</title>\n';
  xml += '<link>' + SITE + '</link>\n';
  xml += '<description>Daruzen — natural vitamins, minerals and supplements from Turkey.</description>\n';

  const LANGS = ['ru', 'tr', 'en', 'ar'] as const;
  const COUNTRY_MAP: Record<string, string> = { ru: 'RU', tr: 'TR', en: 'US', ar: 'SA' };
  const CURRENCY_MAP: Record<string, string> = { ru: 'RUB', tr: 'TRY', en: 'USD', ar: 'TRY' };
  const RATE_MAP: Record<string, number> = { ru: 2.2, tr: 1, en: 0.025, ar: 1 };
  const PRICE_LABELS: Record<string, string> = { ru: 'RUB', tr: 'TRY', en: 'USD', ar: 'TRY' };

  for (const lang of LANGS) {
    for (const p of products) {
      const seoName = SEO_NAMES[p.id]?.[lang] || SEO_NAMES[p.id]?.en || p.id;
      if (!seoName) continue;
      const desc = (typeof p[`desc_${lang}`] === 'string' ? p[`desc_${lang}`] : '') || (typeof p.desc_en === 'string' ? p.desc_en : '') || '';
      const imageUrl = p.image?.startsWith('http') ? p.image : SITE + p.image;
      const basePrice = Number(p.price) || 0;
      const priceVal = (basePrice * RATE_MAP[lang]).toFixed(2);
      const stockSpec = (p.specs as Record<string, unknown>)?._stock;
      const inStock = stockSpec !== '0' && (Array.isArray(stockSpec) ? stockSpec[0] !== '0' : true) && p.inStock !== false && p.in_stock !== false;
      const url = SITE + '/' + lang + '/product/' + p.id;
      const catKey = p.category_key || p.categoryKey || 'supplements';
      const categoryMap: Record<string, string> = {
        supplements: 'Health & Beauty > Health Care > Dietary Supplements & Vitamins',
        vitamins: 'Health & Beauty > Health Care > Dietary Supplements & Vitamins',
        minerals: 'Health & Beauty > Health Care > Dietary Supplements & Vitamins',
        beauty: 'Health & Beauty > Personal Care',
        herbs: 'Health & Beauty > Health Care > Herbal & Homeopathic Remedies',
      };
      const category = categoryMap[catKey] || categoryMap.supplements;
      const country = COUNTRY_MAP[lang];
      const priceLabel = PRICE_LABELS[lang];

      xml += '<item>\n';
      xml += '<g:id>' + esc(p.id + '-' + lang) + '</g:id>\n';
      xml += '<g:title>' + esc(seoName) + '</g:title>\n';
      xml += '<g:description>' + esc(desc) + '</g:description>\n';
      xml += '<g:link>' + esc(url) + '</g:link>\n';
      xml += '<g:image_link>' + esc(imageUrl) + '</g:image_link>\n';
      xml += '<g:availability>' + (inStock ? 'in_stock' : 'out_of_stock') + '</g:availability>\n';
      xml += '<g:price>' + priceVal + ' ' + priceLabel + '</g:price>\n';
      xml += '<g:brand>Daruzen</g:brand>\n';
      xml += '<g:condition>new</g:condition>\n';
      xml += '<g:google_product_category>' + esc(category) + '</g:google_product_category>\n';
      xml += '<g:product_type>' + esc(category) + '</g:product_type>\n';
      xml += '<g:identifier_exists>false</g:identifier_exists>\n';
      xml += '<g:shipping>\n';
      xml += '<g:country>' + country + '</g:country>\n';
      xml += '<g:service>standard</g:service>\n';
      xml += '<g:price>0 ' + priceLabel + '</g:price>\n';
      xml += '</g:shipping>\n';
      xml += '</item>\n';
    }
  }

  xml += '</channel>\n';
  xml += '</rss>';

  res.status(200).send(xml);
}
