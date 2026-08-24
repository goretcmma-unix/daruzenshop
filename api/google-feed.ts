import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const SEO_NAMES: Record<string, Record<string, string>> = {
  'prod-1': { ru: 'Витамин D3, Цинк, Масло чёрного тмина — BSO Gummy', tr: 'D3 Vitamini, Çinko, Kara Mela Yağı — BSO Gummy', en: 'Vitamin D3, Zinc, Black Seed Oil — BSO Gummy', ar: 'فيتامين د3، زيت الحبة السوداء — BSO جيمي' },
  'prod-2': { ru: 'Омега 3 — EPA 600 мг, DHA 400 мг, Рыбий жир', tr: 'Omega 3 — EPA 600 mg, DHA 400 mg, Balık Yağı', en: 'Omega 3 — EPA 600 mg, DHA 400 mg, Fish Oil', ar: 'أوميغا 3 — EPA 600 ملغ، DHA 400 ملغ، زيت السمك' },
  'prod-3': { ru: 'Витамин B12, Витамин B9, Яблочный уксус — ACV', tr: 'B12 Vitamini, B9 Vitamini, Elma Sirkesi — ACV', en: 'Vitamin B12, Vitamin B9, Apple Cider Vinegar — ACV', ar: 'فيتامين ب12، فيتامين ب9، خل التفاح — ACV' },
  'prod-4': { ru: 'Магний + Витамин B6 — Комплекс 4 форм', tr: 'Magnezyum + B6 Vitamini — 4 Form Kompleks', en: 'Magnesium + Vitamin B6 — 4 Form Complex', ar: 'مغنيسيوم + فيتامين ب6 — كومبلكس 4 أشكال' },
  'prod-5': { ru: 'Антистресс — Витамины для нервной системы, 11 трав', tr: 'Anti-Stres — Sinir Sistemi için Vitaminler, 11 Bitki', en: 'Anti-Stress — Vitamins for Nervous System, 11 Herbs', ar: 'مضاد للتوتر — فيتامينات للجهاز العصبي، 11 عشبة' },
  'prod-6': { ru: 'Витамин Цинк + Селен + Медь — Комплекс', tr: 'Çinko + Selenyum + Bakır — Kompleks', en: 'Zinc + Selenium + Copper — Complex', ar: 'زنك + سيلينيوم + نحاس — كومبلكس' },
  'prod-7': { ru: 'Артишок + Расторопша + Одуванчик — Витамين для печени', tr: 'Enginar + Deve Dikeni + Radika — Karaciğer Vitamini', en: 'Artichoke + Milk Thistle + Dandelion — Liver Vitamin', ar: 'خرشوف + شوكة القديس + الهندباء — فيتامين الكبد' },
  'prod-8': { ru: 'Витамин B6, B12, NADH, Глутатион, CoQ10 — Антиоксидант', tr: 'B6, B12, NADH, Glutatyon, CoQ10 Vitamini — Antioksidan', en: 'Vitamin B6, B12, NADH, Glutathione, CoQ10 — Antioxidant', ar: 'فيتامين ب6، ب12، إناديه، غلوتاثيون، كوคيو10 — مضاد أكسدة' },
  'prod-9': { ru: 'Хром + Гимнема — Витамин для сахара в крови', tr: 'Krom + Gymnema — Kan Şekeri Vitamini', en: 'Chromium + Gymnema — Blood Sugar Vitamin', ar: 'كروم + جيمنيما — فيتامين سكر الدم' },
  'prod-10': { ru: 'Гинкго Билоба + Женьшень + Цитиколин — Витамин для мозга', tr: 'Ginkgo Biloba + Ginseng + Sitikolin — Beyin Vitamini', en: 'Ginkgo Biloba + Ginseng + Citicoline — Brain Vitamin', ar: 'جنكго بيلوبا + جنسنج + سيتيكولين — فيتامين الدماغ' },
  'prod-11': { ru: 'Витамин C, D3, Лютейн, Омега-3, Цинк, Куркумин — Мульти', tr: 'C, D3, Lutein, Omega-3, Çinko, Kürkumin Vitamini — Multi', en: 'Vitamin C, D3, Lutein, Omega-3, Zinc, Curcumin — Multi', ar: 'فيتامين سي، د3، لوتين، أوميغا 3، زنك، كركيumann — ملتي' },
  'prod-12': { ru: 'Мультивитамин C, E, A, B12 — Жевательные мармеладки', tr: 'Multivitamin C, E, A, B12 — Çiğneme Jel Şekerleri', en: 'Multivitamin C, E, A, B12 — Gummy Vitamins', ar: 'ملتي فيتامين سي، إي، أ، ب12 — م nalj تحللي' },
  'prod-13': { ru: 'Фолиевая кислота + Цинк + Q10 — Женский витамин', tr: 'Folik Asit + Çinko + Q10 — Kadın Vitamini', en: 'Folic Acid + Zinc + Q10 — Women\'s Vitamin', ar: 'حمض الفوليك + زنك + كو Q10 — فيتامين المرأة' },
  'prod-14': { ru: 'Железо Бисглицинат + Витамин C — Витамин для крови', tr: 'Bisglisinat Demir + C Vitamini — Kan Vitamini', en: 'Iron Bisglycinate + Vitamin C — Blood Vitamin', ar: 'حديد البيسغلايسينات + فيتامين سي — فيتامين الدم' },
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
      const desc = p.descriptions?.[lang] || p.descriptions?.en || '';
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
