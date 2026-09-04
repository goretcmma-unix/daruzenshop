import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

// language -> { currency code, rate (price in base currency * rate), name field, desc field }
const LANGS: Record<string, { cur: string; rate: number; lang: string; title: string }> = {
  ru: { cur: 'RUB', rate: 2.2, lang: 'ru', title: 'Daruzen — Витамины и БАДы из Турции' },
  tr: { cur: 'TRY', rate: 1, lang: 'tr', title: 'Daruzen — Türkiye\'den Vitaminler ve Takviyeler' },
  en: { cur: 'USD', rate: 0.025, lang: 'en', title: 'Daruzen — Vitamins & Supplements from Turkey' },
  ar: { cur: 'TRY', rate: 1, lang: 'ar', title: 'دروزن — فيتامينات ومكملات من تركيا' },
};

const getDesc = (p: any, lang: string): string =>
  p[`desc_${lang}`] || p.desc_en || p.desc_ru || '';

// Убираем из описания медицинские/лечебные claims, которые Google блокирует для БАД
function sanitizeClaim(text: string): string {
  return text
    .replace(/\bлечен[иеяй]?|лечит|терапи|therapeutic|treatment|лечебн/gi, 'поддержки')
    .replace(/\bпрофилактик[а-я]*|prevention/gi, 'поддержания')
    .replace(/\b(?:(?:иммунитет|immune(?:\s|-)?boost)|boost(?:s|ing)?\s*(?:immune|immunity))/gi, 'защитных сил')
    .replace(/\bпохуден|weight\s?(?:loss|control)|снижени\w* веса?/gi, 'контроля веса')
    .replace(/\banemi(?:a|e)|анеми[яи]/gi, 'дефицита железа')
    .replace(/\bhemoglobin|гемоглобин/gi, 'для крови')
    .replace(/\bсure|heals?|treat(?:s|ing|ment)?/gi, 'supports')
    .replace(/\bcures?\b/gi, 'supports')
    .replace(/\s+/g, ' ')
    .trim();
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const langKey = (String(req.query.lang || 'ru')).toLowerCase();
  const cfg = LANGS[langKey] || LANGS.ru;

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
  xml += '<title>' + esc(cfg.title) + '</title>\n';
  xml += '<link>' + SITE + '/' + cfg.lang + '</link>\n';
  xml += '<description>' + esc(cfg.title) + '</description>\n';

  for (const p of products) {
    const name = p[`name_${cfg.lang}`] || p.name_en || p.name_ru || p.id;
    if (!name) continue;
    const rawDesc = getDesc(p, cfg.lang) || getDesc(p, 'en');
    const desc = sanitizeClaim(rawDesc);
    const imageUrl = p.image?.startsWith('http') ? p.image : SITE + p.image;
    const basePrice = Number(p.price) || 0;
    const priceVal = (basePrice * cfg.rate).toFixed(2);
    const stockSpec = (p.specs as Record<string, unknown>)?._stock;
    const inStock = stockSpec !== '0' && (Array.isArray(stockSpec) ? stockSpec[0] !== '0' : true) && p.inStock !== false && p.in_stock !== false;
    const url = SITE + '/' + cfg.lang + '/product/' + p.id;
    const category = 'Health & Beauty > Health Care > Vitamins & Supplements';

    xml += '<item>\n';
    xml += '<g:id>' + esc(cfg.lang + '-' + p.id) + '</g:id>\n';
    xml += '<g:title>' + esc(name.replace(/^Daruzen\s+/i, '')) + '</g:title>\n';
    xml += '<g:description>' + esc(desc) + '</g:description>\n';
    xml += '<g:link>' + esc(url) + '</g:link>\n';
    xml += '<g:image_link>' + esc(imageUrl) + '</g:image_link>\n';
    xml += '<g:availability>' + (inStock ? 'in_stock' : 'out_of_stock') + '</g:availability>\n';
    xml += '<g:price>' + priceVal + ' ' + cfg.cur + '</g:price>\n';
    xml += '<g:brand>Daruzen</g:brand>\n';
    xml += '<g:mpn>' + esc(p.id) + '</g:mpn>\n';
    xml += '<g:condition>new</g:condition>\n';
    xml += '<g:google_product_category>' + esc(category) + '</g:google_product_category>\n';
    xml += '<g:product_type>' + esc(category) + '</g:product_type>\n';
    xml += '</item>\n';
  }

  xml += '</channel>\n';
  xml += '</rss>';

  res.status(200).send(xml);
}
