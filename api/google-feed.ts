import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const SEO_NAMES: Record<string, string> = {
  'prod-1': 'Витамин D3, Цинк, Масло чёрного тмина — BSO Gummy',
  'prod-2': 'Омега 3 — EPA 600 мг, DHA 400 мг, Рыбий жир',
  'prod-3': 'Витамин B12, Витамин B9, Яблочный уксус — ACV',
  'prod-4': 'Магний + Витамин B6 — Комплекс 4 форм',
  'prod-5': 'Антистресс — Витамины для нервной системы, 11 трав',
  'prod-6': 'Витамин Цинк + Селен + Медь — Комплекс',
  'prod-7': 'Артишок + Расторопша + Одуванчик — Витамин для печени',
  'prod-8': 'Витамин B6, B12, NADH, Глутатион, CoQ10 — Антиоксидант',
  'prod-9': 'Хром + Гимнема — Витамин для сахара в крови',
  'prod-10': 'Гинкго Билоба + Женьшень + Цитиколин — Витамин для мозга',
  'prod-11': 'Витамин C, D3, Лютейн, Омега-3, Цинк, Куркумин — Мульти',
  'prod-12': 'Мультивитамин C, E, A, B12 — Жевательные мармеладки',
  'prod-13': 'Фолиевая кислота + Цинк + Q10 — Женский витамин',
  'prod-14': 'Железо Бисглицинат + Витамин C — Витамин для крови',
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
  xml += '<title>Daruzen — Витамины и БАДы из Турции</title>\n';
  xml += '<link>' + SITE + '</link>\n';
  xml += '<description>Daruzen — натуральные витамины, минералы и БАДы из Турции. Оригинальные добавки с доставкой.</description>\n';

  for (const p of products) {
    const seoName = SEO_NAMES[p.id] || p.names?.ru || p.name_ru || p.id;
    if (!seoName) continue;
    const desc = p.descriptions?.ru || p.desc_ru || '';
    const imageUrl = p.image?.startsWith('http') ? p.image : SITE + p.image;
    const basePrice = Number(p.price) || 0;
    const priceRUB = (basePrice * 2.2).toFixed(2);
    const stockSpec = (p.specs as Record<string, unknown>)?._stock;
    const inStock = stockSpec !== '0' && (Array.isArray(stockSpec) ? stockSpec[0] !== '0' : true) && p.inStock !== false && p.in_stock !== false;
    const url = SITE + '/ru/product/' + p.id;
    const catKey = p.category_key || p.categoryKey || 'supplements';
    const categoryMap: Record<string, string> = {
      supplements: 'Health & Beauty > Health Care > Dietary Supplements & Vitamins',
      vitamins: 'Health & Beauty > Health Care > Dietary Supplements & Vitamins',
      minerals: 'Health & Beauty > Health Care > Dietary Supplements & Vitamins',
      beauty: 'Health & Beauty > Personal Care',
      herbs: 'Health & Beauty > Health Care > Herbal & Homeopathic Remedies',
    };
    const category = categoryMap[catKey] || categoryMap.supplements;

    xml += '<item>\n';
    xml += '<g:id>' + esc(p.id) + '</g:id>\n';
    xml += '<g:title>' + esc(seoName) + '</g:title>\n';
    xml += '<g:description>' + esc(desc) + '</g:description>\n';
    xml += '<g:link>' + esc(url) + '</g:link>\n';
    xml += '<g:image_link>' + esc(imageUrl) + '</g:image_link>\n';
    xml += '<g:availability>' + (inStock ? 'in_stock' : 'out_of_stock') + '</g:availability>\n';
    xml += '<g:price>' + priceRUB + ' RUB</g:price>\n';
    xml += '<g:brand>Daruzen</g:brand>\n';
    xml += '<g:condition>new</g:condition>\n';
    xml += '<g:google_product_category>' + esc(category) + '</g:google_product_category>\n';
    xml += '<g:product_type>' + esc(category) + '</g:product_type>\n';
    xml += '<g:identifier_exists>false</g:identifier_exists>\n';
    xml += '<g:shipping>\n';
    xml += '<g:country>RU</g:country>\n';
    xml += '<g:service>standard</g:service>\n';
    xml += '<g:price>0 RUB</g:price>\n';
    xml += '</g:shipping>\n';
    xml += '</item>\n';
  }

  xml += '</channel>\n';
  xml += '</rss>';

  res.status(200).send(xml);
}
