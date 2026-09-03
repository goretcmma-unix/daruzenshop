import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const getName = (p: any, lang: string): string =>
  p[`name_${lang}`] || p.name_en || p.name_ru || p.id;

const getDesc = (p: any, lang: string): string =>
  p[`desc_${lang}`] || p.desc_en || p.desc_ru || '';

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
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');

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
      const seoName = getName(p, lang);
      if (!seoName) continue;
      const desc = getDesc(p, lang);
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
