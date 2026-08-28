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
  'prod-11': 'Оптима Комплекс — Витамин C, D3, Лютейн, Омега-3, Цинк, Куркумин',
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
    const name = p.names?.ru || p.name_ru || p.id;
    if (!name) continue;
    const seoName = SEO_NAMES[p.id] || name;
    const desc = p.descriptions?.ru || p.desc_ru || '';
    const catKey = p.category_key || p.categoryKey || 'supplements';
    const catInfo = CATEGORY_MAP[catKey] || CATEGORY_MAP.supplements;
    const imageUrl = p.image?.startsWith('http') ? p.image : SITE + p.image;
    const basePrice = Number(p.price) || 0;
    const price = (basePrice * 2.2).toFixed(2);
    const stockSpec = (p.specs as Record<string, unknown>)?._stock;
    const inStock = stockSpec !== '0' && (Array.isArray(stockSpec) ? stockSpec[0] !== '0' : true) && p.inStock !== false && p.in_stock !== false;
    const url = SITE + '/ru/product/' + p.id;

    xml += '<offer id="' + esc(p.id) + '" available="' + (inStock ? 'true' : 'false') + '">\n';
    xml += '<url>' + esc(url) + '</url>\n';
    xml += '<name>' + esc(seoName) + '</name>\n';
    xml += '<price>' + price + '</price>\n';
    xml += '<currencyId>RUB</currencyId>\n';
    xml += '<categoryId>' + catInfo.id + '</categoryId>\n';
    xml += '<picture>' + esc(imageUrl) + '</picture>\n';
    xml += '<description>' + esc(desc) + '</description>\n';
    xml += '<vendor>Daruzen</vendor>\n';
    xml += '<vendorCode>' + esc(p.id) + '</vendorCode>\n';
    xml += '<model>' + esc(seoName) + '</model>\n';
    xml += '<delivery>true</delivery>\n';
    xml += '<condition type="likenew"><quality>10</quality></condition>\n';

    if (p.isNew) {
      xml += '<param name="Новинка">Да</param>\n';
    }

    const weightSpec = (p.specs as Record<string, unknown>)?._weight;
    if (weightSpec) {
      xml += '<param name="Вес">' + esc(String(weightSpec)) + '</param>\n';
    }

    const volumeSpec = (p.specs as Record<string, unknown>)?._volume;
    if (volumeSpec) {
      xml += '<param name="Объём">' + esc(String(volumeSpec)) + '</param>\n';
    }

    const countSpec = (p.specs as Record<string, unknown>)?._count;
    if (countSpec) {
      xml += '<param name="Количество в упаковке">' + esc(String(countSpec)) + '</param>\n';
    }

    xml += '</offer>\n';
  }

  xml += '</offers>\n';
  xml += '</shop>\n';
  xml += '</yml_catalog>';

  res.status(200).send(xml);
}
