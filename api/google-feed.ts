import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const SEO_NAMES: Record<string, Record<string, string>> = {
'prod-1': { ru: 'BSO Gummy — Масло чёрного тмина, D3, Цинк', tr: 'BSO Gummy — Siyah Kimyon Yağı, D3, Çinko', en: 'BSO Gummy — Black Seed Oil, D3, Zinc', ar: 'BSO جيمي — زيت الحبة السوداء، D3، زنك' },
'prod-2': { ru: 'Омега 3 — EPA 600 мг, DHA 400 мг', tr: 'Omega 3 — EPA 600 mg, DHA 400 mg', en: 'Omega 3 — EPA 600 mg, DHA 400 mg', ar: 'أوميغا 3 — EPA 600 ملغ، DHA 400 ملغ' },
'prod-3': { ru: 'ACV Gummy — Яблочный уксус, B12, B9', tr: 'ACV Gummy — Elma Sirkesi, B12, B9', en: 'ACV Gummy — Apple Cider Vinegar, B12, B9', ar: 'ACV جيمي — خل التفاح، B12، B9' },
'prod-4': { ru: 'Магний + Витамин B6 — 4 формы', tr: 'Magnezyum + B6 Vitamini — 4 Form', en: 'Magnesium + Vitamin B6 — 4 Forms', ar: 'مغنيسيوم + فيتامين B6 — 4 أشكال' },
'prod-5': { ru: 'Травяной комплекс — 11 растительных экстрактов', tr: 'Bitkisel Kompleks — 11 Bitki Özü', en: 'Herbal Complex — 11 Plant Extracts', ar: 'مجمع عشبي — 11 مستخلص نباتي' },
'prod-6': { ru: 'Цинк + Селен + Медь — Комплекс', tr: 'Çinko + Selenyum + Bakır — Kompleks', en: 'Zinc + Selenium + Copper — Complex', ar: 'زنك + سيلينيوم + نحاس — مجمع' },
'prod-7': { ru: 'Травяной комплекс — Артишок и растительные экстракты', tr: 'Bitkisel Kompleks — Enginar ve Bitki Özleri', en: 'Herbal Complex — Artichoke & Plant Extracts', ar: 'مجمع عشبي — خرشوف ومستخلصات نباتية' },
'prod-8': { ru: 'Энергетический комплекс', tr: 'Enerji Kompleksi', en: 'Active Lifestyle Complex', ar: 'مجمع الطاقة' },
'prod-9': { ru: 'Хром + Растительный комплекс', tr: 'Krom + Bitkisel Kompleks', en: 'Chromium + Herbal Complex', ar: 'كروم + مجمع عشبي' },
'prod-10': { ru: 'Гинкго Билоба + Женьшень — Растительный комплекс', tr: 'Ginkgo Biloba + Ginseng — Bitkisel Kompleks', en: 'Ginkgo Biloba + Ginseng — Herbal Complex', ar: 'جنكغو بيلوبا + جنسنج — مجمع عشبي' },
'prod-11': { ru: 'Optima Kompleks', tr: 'Optima Kompleks', en: 'Optima Kompleks', ar: 'أوبتيما كومبلكس' },
'prod-12': { ru: 'Мультивитамин — Жевательные мармеладки', tr: 'Multivitamin — Çiğneme Şekercikleri', en: 'Multivitamin — Gummy Vitamins', ar: 'ملتي فيتامين — فيتامينات مضغ' },
'prod-13': { ru: 'Женский комплекс', tr: 'Kadın Kompleksi', en: "Women's Complex", ar: 'مجمع نسائي' },
'prod-14': { ru: 'Железо + Витамин C — Комплекс', tr: 'Demir + C Vitamini — Kompleks', en: 'Iron + Vitamin C — Complex', ar: 'حديد + فيتامين C — مجمع' },
};

const SAFE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  'prod-1': {
    ru: 'Жевательные пастилки с маслом чёрного тмина, витамином D3 и цинком. Дополнение к ежедневному рациону в удобном вкусном формате.',
    tr: 'Siyah kimyon yağı, D3 vitamini ve çinko içeren çiğneme jölesi. Günlük beslenmenizi tamamlayan lezzetli bir takviye.',
    en: 'Chewing gummies with black seed oil, vitamin D3 and zinc. A tasty addition to your daily wellness routine.',
    ar: 'أقراص مضغ بزيت الحبة السوداء وفيتامين د3 والزنك. مكمل لذيذ يكمل روتينك اليومي.',
  },
  'prod-2': {
    ru: 'Омега-3 из норвежской рыбы — EPA 600 мг, DHA 400 мг. Высококачественная добавка для тех, кто заботится о своём рационе.',
    tr: 'Norveç balığından Omega-3 — EPA 600 mg, DHA 400 mg. Beslenmenize değer katan yüksek kaliteli takviye.',
    en: 'Omega-3 from Norwegian fish — EPA 600 mg, DHA 400 mg. A high-quality supplement for your balanced lifestyle.',
    ar: 'أوميغا 3 من الأسماك النرويجية — EPA 600 ملغ، DHA 400 ملغ. مكمل عالي الجودة لنظامك الغذائي المتوازن.',
  },
  'prod-3': {
    ru: 'Жевательные пастилки с яблочным уксусом, фолиевой кислотой и витамином B12. Вкусный формат для тех, кто ценит натуральные ингредиенты.',
    tr: 'Elma sirkesi, folik asit ve B12 vitamini içeren çiğneme jölesi. Doğal bileşenleri sevenler için lezzetli bir seçenek.',
    en: 'Chewing gummies with apple cider vinegar, folic acid and vitamin B12. A delicious format for those who value natural ingredients.',
    ar: 'أقراص مضغ بخل التفاح وحمض الفوليك وفيتامين ب12. صيغة لذيذة لعشاق المكونات الطبيعية.',
  },
  'prod-4': {
    ru: 'Магний в четырёх формах с витамином B6. Дополнение к рациону в формате жевательных мармеладок с фруктовым вкусом.',
    tr: 'Dört formda magnezyum ve B6 vitamini. Meyve tadında çiğneme jölesi olarak beslenmenizi tamamlayın.',
    en: 'Magnesium in four forms with vitamin B6. A fruity gummy supplement to complement your daily nutrition.',
    ar: 'مغنيسيوم بأربع أشكال مع فيتامين ب6. مكمل بطعم الفاكهة يكمل تغذيتك اليومية.',
  },
  'prod-5': {
    ru: 'Комплекс из 11 растительных экстрактов — лаванда, базилик, боярышник и другие. Вкусные пастилки для вашего ежедневного ритуала заботы о себе.',
    tr: '11 bitkisel öz — lavanta, fesleğen, alıç ve diğerleri. Günlük bakım rutininiz için lezzetli jöle.',
    en: 'A blend of 11 herbal extracts — lavender, basil, hawthorn and more. Tasty gummies for your daily self-care ritual.',
    ar: 'مزيج من 11 مستخلص عشبي — لافندر ونعناع وبورياة والمزيد. أقراص مضغ لذيذة لروتين العناية الذاتية اليومي.',
  },
  'prod-6': {
    ru: 'Цинк, селен и медь в формате жевательных мармеладок. Дополнение к рациону для тех, кто следит за питанием.',
    tr: 'Çinko, selenyum ve bakır çiğneme jölesi. Beslenmesine dikkat edenler için günlük takviye.',
    en: 'Zinc, selenium and copper in gummy form. A daily supplement for those who care about their nutrition.',
    ar: 'زنك وسيلينيوم ونحاس في صيغة أقراص المضغ. مكمل يومي لمن يهتم بتغذيته.',
  },
  'prod-7': {
    ru: 'Экстракты артишока, расторопши и одуванчика в вкусном формате жевательных пастилок. Натуральный состав для вашего рациона.',
    tr: 'Enginar, devedikeni ve karahindiba ekstreleri ile lezzetli çiğneme jölesi. Doğal içerikli besin takviyesi.',
    en: 'Artichoke, milk thistle and dandelion extracts in tasty gummy format. A natural supplement for your daily routine.',
    ar: 'مستخلصات الخرشوف وشوك الحليب والهندباء في صيغة أقراص مضغ لذيذة. مكمل طبيعي لروتينك اليومي.',
  },
  'prod-8': {
    ru: 'Жевательные пастилки с коэнзимом Q10, NADH и витаминами B6, B12. Формула для тех, кто ведёт активный образ жизни.',
    tr: 'Koenzim Q10, NADH ve B6-B12 vitaminleri içeren çiğneme jölesi. Aktif yaşam tarzı için formül.',
    en: 'Chewing gummies with coenzyme Q10 and B vitamins B6, B12. A formula for those with an active lifestyle.',
    ar: 'أقراص مضغ بالإنزيم المساعد Q10 وNADH وفيتاميني ب6 وب12. تركيبة لمن يعيش نمط حياة نشط.',
  },
  'prod-9': {
    ru: 'Хром и гимнема в формате жевательных мармеладок. Дополнение к рациону с приятным вкусом.',
    tr: 'Krom ve gymnema çiğneme jölesi. Lezzetli tadıyla beslenmenizi tamamlayan takviye.',
    en: 'Chromium and gymnema in gummy format. A tasty dietary supplement to complement your routine.',
    ar: 'كروم وجيمنيما في صيغة أقراص المضغ. مكمل غذائي لذيذ يكمل روتينك.',
  },
  'prod-10': {
    ru: 'Гинкго билоба, женьшень и цитиколин в жидком формате. Добавка для тех, кто ценит активный ум и ясность мышления.',
    tr: 'Ginkgo biloba, ginseng ve sitikolin içeren sıvı kompleks. Aktif zihin ve netlik isteyenler için takviye.',
    en: 'Ginkgo biloba, ginseng and citicoline in liquid format. A supplement for those who value an active mind.',
    ar: 'جنكغو بيلوبا وجنسنج وسيتيكولين في صيغة سائلة. مكمل لمن يقدّر عقلاً نشطاً ووضوحاً في التفكير.',
  },
  'prod-11': {
    ru: 'Сбалансированный комплекс с омега-3, лютеином, витаминами C и D3, цинком. Мульти-добавка для вашего ежедневного рациона.',
    tr: 'Omega-3, lutein, C ve D3 vitaminleri, çinko içeren dengeli kompleks. Günlük beslenmeniz için multi takviye.',
    en: 'A balanced complex with omega-3, lutein, vitamins C and D3, zinc. A multi-supplement for your daily nutrition.',
    ar: 'مجمع متوازن بأوميغا 3 واللوتين وفيتاميني سي ود3 والزنك. مكمل متعدد يكمل تغذيتك اليومية.',
  },
  'prod-12': {
    ru: 'Мультивитамины C, E, A, B12 в формате жевательных мармеладок с фруктовым вкусом. Вкусный способ поддержать ваш ежедневный рацион.',
    tr: 'C, E, A ve B12 vitaminleri içeren meyve aromalı çiğneme jölesi. Günlük beslenmenizi lezzetli hale getirin.',
    en: 'Multivitamin C, E, A, B12 in fruity gummy format. A tasty way to complement your daily nutrition.',
    ar: 'ملتي فيتامين سي وإي وأ وب12 في صيغة أقراص مضغ بطعم الفاكهة. طريقة لذيذة لإكمال تغذيتك اليومية.',
  },
  'prod-13': {
    ru: 'Фолиевая кислота, цинк и коэнзим Q10 в формате жевательных пастилок. Добавка для женщин, которые заботятся о себе.',
    tr: 'Folik asit, çinko ve koenzim Q10 çiğneme jölesi. Kendine özen gösteren kadınlar için takviye.',
    en: 'Folic acid, zinc and coenzyme Q10 in gummy format. A supplement for women who care about their wellness.',
    ar: 'حمض فوليك والزنك والإنزيم المساعد Q10 في صيغة أقراص المضغ. مكمل للنساء اللواتي يهتمّن بصحتهن.',
  },
  'prod-14': {
    ru: 'Железо бисглицинат и витамин C в формате жевательных мармеладок. Дополнение к рациону для тех, кто следит за питанием.',
    tr: 'Demir bisglisinat ve C vitamini çiğneme jölesi. Beslenmesine özen gösterenler için günlük takviye.',
    en: 'Iron bisglycinate and vitamin C in gummy format. A daily supplement for those who pay attention to nutrition.',
    ar: 'حديد بيسغليسينات وفيتامين سي في صيغة أقراص المضغ. مكمل يومي لمن يهتم بتغذيته.',
  },
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
      const desc = SAFE_DESCRIPTIONS[p.id]?.[lang] || SAFE_DESCRIPTIONS[p.id]?.en || "";
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
