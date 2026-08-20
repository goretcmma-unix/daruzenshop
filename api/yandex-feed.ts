import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const CATEGORY_MAP: Record<string, { id: string; name: string }> = {
  supplements: { id: '1', name: 'БАД и добавки' },
  vitamins: { id: '2', name: 'Витамины' },
  minerals: { id: '3', name: 'Минералы' },
  beauty: { id: '4', name: 'Красота и здоровье' },
  herbs: { id: '5', name: 'Лекарственные травы' },
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
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<yml_catalog date="' + formatDate(new Date()) + '"><shop><offers></offers></shop></yml_catalog>');
    return;
  }

  const categories = Object.values(CATEGORY_MAP);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<yml_catalog date="' + formatDate(new Date()) + '">\n';
  xml += '<shop>\n';
  xml += '<name>Daruzen</name>\n';
  xml += '<company>Daruzen</company>\n';
  xml += '<url>' + SITE + '</url>\n';
  xml += '<currencies>\n';
  xml += '<currency id="RUB" rate="1"/>\n';
  xml += '</currencies>\n';

  xml += '<categories>\n';
  for (const cat of categories) {
    xml += '<category id="' + cat.id + '">' + esc(cat.name) + '</category>\n';
  }
  xml += '</categories>\n';

  xml += '<offers>\n';

  for (const p of products) {
    const name = p.names?.ru || p.name_ru || p.names?.en || p.name_en || p.id;
    const desc = p.descriptions?.ru || p.desc_ru || p.descriptions?.en || p.desc_en || '';
    const catKey = p.category_key || p.categoryKey || 'supplements';
    const catInfo = CATEGORY_MAP[catKey] || CATEGORY_MAP.supplements;
    const imageUrl = p.image?.startsWith('http') ? p.image : SITE + p.image;
    const price = p.price || 0;
    const inStock = p.in_stock !== false && p.inStock !== false;
    const url = SITE + '/ru/product/' + p.id;

    xml += '<offer id="' + esc(p.id) + '" available="' + (inStock ? 'true' : 'false') + '">\n';
    xml += '<url>' + esc(url) + '</url>\n';
    xml += '<name>' + esc(name) + '</name>\n';
    xml += '<price>' + price + '</price>\n';
    xml += '<currencyId>RUB</currencyId>\n';
    xml += '<categoryId>' + catInfo.id + '</categoryId>\n';
    xml += '<picture>' + esc(imageUrl) + '</picture>\n';
    xml += '<description>' + esc(desc) + '</description>\n';
    xml += '<vendor>Daruzen</vendor>\n';
    xml += '<vendorCode>' + esc(p.id) + '</vendorCode>\n';
    xml += '<model>' + esc(name) + '</model>\n';

    if (p.isNew) {
      xml += '<param name="Новинка">Да</param>\n';
    }

    xml += '</offer>\n';
  }

  xml += '</offers>\n';
  xml += '</shop>\n';
  xml += '</yml_catalog>';

  res.status(200).send(xml);
}
