import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

type Lang = 'ru' | 'tr' | 'en' | 'ar';
const ALL_LANGS: Lang[] = ['ru', 'tr', 'en', 'ar'];

const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  ru: { supplements: 'БАД', vitamins: 'Витамины', minerals: 'Минералы', beauty: 'Добавки для красоты', herbs: 'Травяная добавка' },
  tr: { supplements: 'Takviye', vitamins: 'Vitamin', minerals: 'Mineral', beauty: 'Güzellik Takviyesi', herbs: 'Bitkisel Takviye' },
  en: { supplements: 'Supplement', vitamins: 'Vitamin', minerals: 'Mineral', beauty: 'Beauty Supplement', herbs: 'Herbal Supplement' },
  ar: { supplements: 'مكمل', vitamins: 'فيتامين', minerals: 'معادن', beauty: 'مكمل جمال', herbs: 'مكمل عشبي' },
};

const KEYWORDS_TEMPLATES: Record<Lang, (name: string, cat: string, firstSentence: string) => string> = {
  ru: (name, cat, s) => `${name}, ${cat.toLowerCase()} из Турции, купить ${cat.toLowerCase()}, ${name} купить, турция витамины, дарузен, daruzen, ${s}`,
  tr: (name, cat, s) => `${name}, Türkiye ${cat.toLowerCase()}, ${cat.toLowerCase()} al, ${name} al, daruzen, türk vitaminleri, ${s}`,
  en: (name, cat, s) => `${name}, ${cat.toLowerCase()} from Turkey, buy ${cat.toLowerCase()}, ${name} buy, daruzen, turkish vitamins, ${s}`,
  ar: (name, cat, s) => `${name}, ${cat} من تركيا، شراء ${cat}، ${name} شراء، داروزن، فيتامينات تركية، ${s}`,
};

const COMPOSITION: Record<string, Record<Lang, string>> = {
  'prod-1': {
    ru: 'масло чёрного тмина, витамин D3, цинк, фосфат кальция',
    tr: 'siyah kimyon yağı, D3 vitamini, çinko, kalsiyum fosfat',
    en: 'black seed oil, vitamin D3, zinc, calcium phosphate',
    ar: 'زيت الحبة السوداء، فيتامين D3، زنك، فوسفات الكالسيوم',
  },
  'prod-2': {
    ru: 'рыбий жир, омега-3, EPA, DHA',
    tr: 'balık yağı, omega 3, EPA, DHA',
    en: 'fish oil, omega-3, EPA, DHA',
    ar: 'زيت السمك، أوميغا 3، EPA، DHA',
  },
  'prod-3': {
    ru: 'яблочный уксус, свекольный порошок, экстракт граната, фолиевая кислота B9, витамин B12',
    tr: 'elma sirkesi, pancar tozu, nar ekstresi, folik asit B9, B12 vitamini',
    en: 'apple cider vinegar, beetroot powder, pomegranate extract, folic acid B9, vitamin B12',
    ar: 'خل التفاح، مسحوق الشمندر، مستخلص الرمان، حمض الفوليك B9، فيتامين B12',
  },
  'prod-4': {
    ru: 'магний ацетилтаурат, магний бисглицинат, магний малат, магний цитрат, витамин B6',
    tr: 'magnezyum asetiltaurat, magnezyum bisglisinat, magnezyum malat, magnezyum sitrat, B6 vitamini',
    en: 'magnesium acetyltaurate, magnesium bisglycinate, magnesium malate, magnesium citrate, vitamin B6',
    ar: 'مغنيسيوم أسيتيل تورات، مغنيسيوم بيسغليسينات، مغنيسيوم مالات، سترات المغنيسيوم، فيتامين B6',
  },
  'prod-5': {
    ru: 'боярышник, сельдерей, кошачий коготь, базилик, чёрный перец, роза, гибискус, лаванда, корица, кардамон, акация',
    tr: 'alıç, kereviz, kedi pençesi, fesleğen, karabiber, gül, bamya, lavanta, tarçın, kakule, arap zamkı',
    en: 'hawthorn, celery, cat\'s claw, basil, black pepper, rose, hibiscus, lavender, cinnamon, cardamom, acacia',
    ar: 'الزعرور، الكرفس، مخلب القط، الريحان، الفلفل الأسود، الورد، الكركديه، الخزامى، القرفة، الهيل، الأكاسيا',
  },
  'prod-6': {
    ru: 'цинк, селен, медь',
    tr: 'çinko, selenyum, bakır',
    en: 'zinc, selenium, copper',
    ar: 'زنك، سيلينيوم، نحاس',
  },
  'prod-7': {
    ru: 'экстракт расторопши, экстракт артишока, экстракт одуванчика',
    tr: 'devedikeni ekstresi, enginar ekstresi, karahindiba ekstresi',
    en: 'milk thistle extract, artichoke extract, dandelion extract',
    ar: 'مستخلص شوك الحليب، مستخلص الخرشوف، مستخلص الهندباء',
  },
  'prod-8': {
    ru: 'NADH, глутатион, ресвератрол, коэнзим Q10, витамин B6, витамин B12',
    tr: 'NADH, glutatyon, resveratrol, koenzim Q10, B6 vitamini, B12 vitamini',
    en: 'NADH, glutathione, resveratrol, coenzyme Q10, vitamin B6, vitamin B12',
    ar: 'NADH، غلوتاثيون، ريسفيراترول، الإنزيم المساعد Q10، فيتامين B6، فيتامين B12',
  },
  'prod-9': {
    ru: 'хром, экстракт гимнемы',
    tr: 'krom, gimneya ekstresi',
    en: 'chromium, gymnema extract',
    ar: 'كروم، مستخلص غينيما',
  },
  'prod-10': {
    ru: 'гинкго билоба, женьшень, цитиколин',
    tr: 'ginkgo biloba, ginseng, sitikolin',
    en: 'ginkgo biloba, ginseng, citicoline',
    ar: 'جنكغو بيلوبا، جنسنج، سيتيكولين',
  },
  'prod-11': {
    ru: 'рыбий жир, омега-3, EPA, DHA, куркумин, коэнзим Q10, витамин C, цинк, лютеин, астаксантин, зеаксантин, медь, селен, витамин D3',
    tr: 'balık yağı, omega 3, EPA, DHA, kurkumin, koenzim Q10, C vitamini, çinko, lutein, astaksantin, zeaksantin, bakır, selenyum, D3 vitamini',
    en: 'fish oil, omega-3, EPA, DHA, curcumin, coenzyme Q10, vitamin C, zinc, lutein, astaxanthin, zeaxanthin, copper, selenium, vitamin D3',
    ar: 'زيت السمك، أوميغا 3، EPA، DHA، كركمين، الإنزيم المساعد Q10، فيتامين C، زنك، لوتين، أستازانتين، زياكسانثين، نحاس، سيلينيوم، فيتامين D3',
  },
  'prod-12': {
    ru: 'витамин C, витамин E, витамин A, витамин B12',
    tr: 'C vitamini, E vitamini, A vitamini, B12 vitamini',
    en: 'vitamin C, vitamin E, vitamin A, vitamin B12',
    ar: 'فيتامين C، فيتامين E، فيتامين A، فيتامين B12',
  },
  'prod-13': {
    ru: 'витекс священный, тысячелистник, коэнзим Q10, L-аргинин, женьшень, цинк, фолиевая кислота, селен',
    tr: 'hayıt, civanperçemi, koenzim Q10, L-arjinin, ginseng, çinko, folik asit, selenyum',
    en: 'chasteberry, yarrow, coenzyme Q10, L-arginine, ginseng, zinc, folic acid, selenium',
    ar: 'تشاستيبيري، يارو، الإنزيم المساعد Q10، L-أرجينين، جنسنج، زنك، حمض الفوليك، سيلينيوم',
  },
  'prod-14': {
    ru: 'железо бисглицинат, витамин C',
    tr: 'demir bisglisinat, C vitamini',
    en: 'iron bisglycinate, vitamin C',
    ar: 'حديد بيسغليسينات، فيتامين C',
  },
};

const LOCALE_MAP: Record<Lang, string> = {
  ru: 'ru_RU',
  tr: 'tr_TR',
  en: 'en_US',
  ar: 'ar_SA',
};

const CURRENCY: Record<Lang, { code: string; rate: number; symbol: string }> = {
  ru: { code: 'RUB', rate: 2.2, symbol: '₽' },
  tr: { code: 'TRY', rate: 1, symbol: '₺' },
  en: { code: 'USD', rate: 0.025, symbol: '$' },
  ar: { code: 'TRY', rate: 1, symbol: '₺' },
};

const SEO_TITLES: Record<string, Record<Lang, string>> = {
  'prod-1': {
    ru: 'BSO Жевательные мармеладки — Масло чёрного тмина, Витамин D3, Цинк | Daruzen',
    tr: 'D3 Vitamini, Çinko, Siyah Kimyon Yağı — BSO Jöle | Daruzen',
    en: 'Vitamin D3, Zinc, Black Seed Oil — BSO Gummies | Daruzen',
    ar: 'فيتامين D3، زنك، زيت الحبة السوداء — BSO جummies | Daruzen',
  },
  'prod-2': {
    ru: 'Омега 3 Премиум — Рыбий жир EPA 600 мг, DHA 400 мг | Daruzen',
    tr: 'Omega 3 — EPA 600 mg, DHA 400 mg, Balık Yağı | Daruzen',
    en: 'Omega 3 — EPA 600 mg, DHA 400 mg, Fish Oil | Daruzen',
    ar: 'أوميغا 3 — EPA 600 ملغ، DHA 400 ملغ، زيت السمك | Daruzen',
  },
  'prod-3': {
    ru: 'ACV Мармелад — Яблочный уксус, Витамин B12, Фолиевая кислота | Daruzen',
    tr: 'B12 Vitamini, B9 Vitamini, Elma Sirkesi — ACV | Daruzen',
    en: 'Vitamin B12, Vitamin B9, Apple Cider Vinegar — ACV | Daruzen',
    ar: 'فيتامين B12، فيتامين B9، خل التفاح — ACV | Daruzen',
  },
  'prod-4': {
    ru: 'Магний Комплекс + Витамин B6 — 4 формы магния | Daruzen',
    tr: 'Magnezyum + B6 Vitamini — 4 Form Kompleks | Daruzen',
    en: 'Magnesium + Vitamin B6 — 4 Form Complex | Daruzen',
    ar: 'مغنيسيوم + فيتامين B6 — مجمّع 4 أشكال | Daruzen',
  },
  'prod-5': {
    ru: 'DNL — Антистресс фитокомплекс — 11 трав для нервной системы | Daruzen',
    tr: 'Anti-Stres — Sinir Sistemi Vitamini, 11 Bitki | Daruzen',
    en: 'Anti-Stress — Nerve Vitamins, 11 Herbs | Daruzen',
    ar: 'مضاد للإجهاد — فيتامينات الأعصاب، 11 أعشاب | Daruzen',
  },
  'prod-6': {
    ru: 'Цинк Комплекс — Цинк + Селен + Медь | Daruzen',
    tr: 'Çinko Vitamini + Selenyum + Bakır Kompleks | Daruzen',
    en: 'Zinc Vitamin + Selenium + Copper Complex | Daruzen',
    ar: 'فيتامين الزنك + سيلينيوم + نحاس مجمّع | Daruzen',
  },
  'prod-7': {
    ru: 'Enginar — Артишок, Расторопша, Одуванчик для печени | Daruzen',
    tr: 'Enginar + Devedikeni + Karahindiba — Karaciğer Vitamini | Daruzen',
    en: 'Artichoke + Milk Thistle + Dandelion — Liver Vitamin | Daruzen',
    ar: 'أرتيشوك + رستورشا + بابونج — فيتامين الكبد | Daruzen',
  },
  'prod-8': {
    ru: 'Nadh Gummy — NADH, Глутатион, Коэнзим Q10, Витамин B6, B12 | Daruzen',
    tr: 'B6, B12 Vitamini, NADH, Glutatyon, CoQ10 — Antioksidan | Daruzen',
    en: 'Vitamin B6, B12, NADH, Glutathione, CoQ10 — Antioxidant | Daruzen',
    ar: 'فيتامين B6، B12، NADH، غلوتاثيون، CoQ10 — مضاد أكسدة | Daruzen',
  },
  'prod-9': {
    ru: 'Хром + Гимнема — Витамин для сахара в крови | Daruzen',
    tr: 'Krom + Gimneya — Şeker Vitamini | Daruzen',
    en: 'Chromium + Gymnema — Blood Sugar Vitamin | Daruzen',
    ar: 'كروم + غينيما — فيتامين السكر في الدم | Daruzen',
  },
  'prod-10': {
    ru: 'Комплекс с гинкго билоба, женьшенем и цитиколином — Витамин для мозга | Daruzen',
    tr: 'Ginkgo Biloba + Ginseng + Sitikolin — Beyin Vitamini | Daruzen',
    en: 'Ginkgo Biloba + Ginseng + Citicoline — Brain Vitamin | Daruzen',
    ar: 'غنكو بيلوبا + جنسنج + ستيكولين — فيتامين الدماغ | Daruzen',
  },
  'prod-11': {
    ru: 'Оптима Комплекс — Витамин C, D3, Лютеин, Омега-3, Цинк, Куркумин | Daruzen',
    tr: 'C, D3 Vitamini, Lutein, Omega-3, Çinko, Kürkümin — Multi | Daruzen',
    en: 'Vitamin C, D3, Lutein, Omega-3, Zinc, Curcumin — Multi | Daruzen',
    ar: 'فيتامين C، D3، لوتين، أوميغا 3، زنك، كركمين — مالتى | Daruzen',
  },
  'prod-12': {
    ru: 'MultiGummy Мультивитаминные жевательные мармеладки — Витамин C, E, A, B12 | Daruzen',
    tr: 'Multivitamin C, E, A, B12 — Çiğneme Jölesi | Daruzen',
    en: 'Multivitamin C, E, A, B12 — Chewing Gummies | Daruzen',
    ar: 'مالتي فيتامين C، E، A، B12 — أقراص مضغ | Daruzen',
  },
  'prod-13': {
    ru: 'Женский комплекс — Фолиевая кислота, Цинк, Q10, Женьшень | Daruzen',
    tr: 'Folik Asit + Çinko + Q10 — Kadın Vitamini | Daruzen',
    en: 'Folic Acid + Zinc + Q10 — Women\'s Vitamin | Daruzen',
    ar: 'حمض فوليك + زنك + Q10 — فيتامين نسائي | Daruzen',
  },
  'prod-14': {
    ru: 'Железо бисглицинат + Витамин C — для гемоглобина и крови | Daruzen',
    tr: 'Demir Bisglisinat + C Vitamini — Kan Vitamini | Daruzen',
    en: 'Iron Bisglycinate + Vitamin C — Blood Vitamin | Daruzen',
    ar: 'حديد بيسغليسينات + فيتامين C — فيتامين الدم | Daruzen',
  },
};

// Фразы «от/для ...» — мягкие (без «лечит»/мед. диагнозов), чтобы товар выходил по запросу
// «турецкий бад / витамин от/для ...» без упоминания бренда.
const PURPOSE: Record<string, Record<Lang, string[]>> = {
  'prod-1': {
    ru: ['турецкий бад для иммунитета', 'турецкий витамин от простуды', 'бад с чёрным тмином для иммунитета', 'жевательные витамины для иммунитета'],
    tr: ['bağışıklık için türk takviyesi', 'siyah kimyon yağı takviyesi'],
    en: ['turkish supplement for immunity', 'black seed oil gummies immunity'],
    ar: ['مكمل تركي للمناعة', 'زيت الحبة السوداء للمناعة'],
  },
  'prod-2': {
    ru: ['турецкий бад омега 3 для сердца', 'рыбий жир для мозга', 'омега 3 для памяти', 'турецкий витамин для сердца и зрения'],
    tr: ['kalp için türk omega 3', 'balık yağı beyin', 'omega 3 hafıza'],
    en: ['turkish omega 3 for heart', 'fish oil for brain', 'omega 3 memory'],
    ar: ['أوميغا 3 تركي للقلب', 'زيت السمك للدماغ', 'أوميغا 3 للذاكرة'],
  },
  'prod-3': {
    ru: ['турецкий бад для похудения', 'яблочный уксус для контроля веса', 'бад для пищеварения', 'бад от вздутия живота'],
    tr: ['kilo kontrolü için elma sirkesi', 'sindirim için türk takviyesi'],
    en: ['turkish supplement for weight control', 'apple cider vinegar digestion'],
    ar: ['خل التفاح للتحكم بالوزن', 'مكمل تركي للهضم'],
  },
  'prod-4': {
    ru: ['турецкий магний от усталости', 'магний для сна', 'бад для нервной системы', 'магний b6 от стресса'],
    tr: ['yorgunluk için türk magnezyum', 'uyku için magnezyum', 'sinir sistemi takviyesi'],
    en: ['turkish magnesium for fatigue', 'magnesium for sleep', 'nerve support supplement'],
    ar: ['مغنيسيوم تركي للتعب', 'مغنيسيوم للنوم', 'مكمل للجهاز العصبي'],
  },
  'prod-5': {
    ru: ['турецкий бад от стресса', 'бад от нервов', 'успокаивающий фитокомплекс', 'средство от тревожности', 'травы для нервной системы'],
    tr: ['stres için türk takviyesi', 'sakinleştirici bitki', 'sinir için bitki'],
    en: ['turkish supplement for stress', 'calming herbal complex', 'nerve support herbs'],
    ar: ['مكمل تركي للتوتر', 'أعشاب مهدئة', 'مكمل للأعصاب'],
  },
  'prod-6': {
    ru: ['турецкий цинк для иммунитета', 'цинк селен для кожи', 'бад для волос и ногтей', 'цинк от акне'],
    tr: ['bağışıklık için türk çinko', 'saç ve tırnak için çinko'],
    en: ['turkish zinc for immunity', 'zinc for skin hair nails'],
    ar: ['زنك تركي للمناعة', 'زنك للشعر والجلد'],
  },
  'prod-7': {
    ru: ['турецкий бад для печени', 'расторопша для печени', 'артишок для пищеварения', 'бад от тяжести после еды'],
    tr: ['karaciğer için türk takviyesi', 'devedikeni karaciğer'],
    en: ['turkish supplement for liver', 'milk thistle liver', 'artichoke digestion'],
    ar: ['مكمل تركي للكبد', 'شوك الحليب للكبد', 'أرتيشوك للهضم'],
  },
  'prod-8': {
    ru: ['турецкий бад для энергии', 'nadh для энергии и мозга', 'бад для бодрости', 'коэнзим q10 для клеток'],
    tr: ['enerji için türk takviyesi', 'nadh enerji', 'coq10 antioksidan'],
    en: ['turkish supplement for energy', 'nadh energy brain', 'coq10 antioxidant'],
    ar: ['مكمل تركي للطاقة', 'NADH للطاقة والدماغ', 'كيو 10 مضاد أكسدة'],
  },
  'prod-9': {
    ru: ['турецкий бад от тяги к сладкому', 'хром для контроля веса', 'бад для снижения аппетита', 'бад для контроля сахара'],
    tr: ['şeker isteği için türk takviyesi', 'krom kilo kontrolü'],
    en: ['turkish supplement for sugar cravings', 'chromium weight control', 'gymnema appetite'],
    ar: ['مكمل تركي لرغبة السكر', 'كروم للتحكم بالوزن'],
  },
  'prod-10': {
    ru: ['турецкий бад для памяти', 'гинкго билоба для мозга', 'бад для концентрации внимания', 'бад от усталости мозга'],
    tr: ['hafıza için türk takviyesi', 'ginkgo biloba beyin', 'konsantrasyon takviyesi'],
    en: ['turkish supplement for memory', 'ginkgo biloba brain', 'focus supplement'],
    ar: ['مكمل تركي للذاكرة', 'جنكغو بيلوبا للدماغ', 'مكمل للتركيز'],
  },
  'prod-11': {
    ru: ['турецкий витамин для зрения', 'лютеин для глаз', 'витамины от усталости глаз', 'бад для сетчатки глаза'],
    tr: ['göz için türk vitamini', 'lutein göz', 'göz yorgunluğu takviyesi'],
    en: ['turkish vitamin for vision', 'lutein for eyes', 'eye fatigue supplement'],
    ar: ['فيتامين تركي للرؤية', 'لوتين للعين', 'مكمل لإجهاد العين'],
  },
  'prod-12': {
    ru: ['турецкий мультивитамин для иммунитета', 'жевательные витамины для энергии', 'мультивитамины для взрослых'],
    tr: ['bağışıklık için türk multivitamin', 'enerji için çiğneme vitamini'],
    en: ['turkish multivitamin for immunity', 'gummies for energy'],
    ar: ['مالتي فيتامين تركي للمناعة', 'فيتامينات للمضغ للطاقة'],
  },
  'prod-13': {
    ru: ['турецкий женский витаминный комплекс', 'бад для женского здоровья', 'витамины для гормонального баланса', 'бад от пмс'],
    tr: ['kadınlar için türk vitamini', 'hormon dengesi takviyesi'],
    en: ['turkish supplement for women', 'hormone balance vitamins'],
    ar: ['مكمل تركي للنساء', 'فيتامينات لتوازن الهرمونات'],
  },
  'prod-14': {
    ru: ['турецкий бад от усталости', 'железо для гемоглобина', 'витамин от слабости', 'железо с витамином с'],
    tr: ['yorgunluk için türk demir', 'hemoglobin için demir'],
    en: ['turkish iron for fatigue', 'iron for hemoglobin', 'iron with vitamin c'],
    ar: ['حديد تركي للتعب', 'حديد للهيموغلوبين', 'حديد مع فيتامين سي'],
  },
};

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

function isBot(ua: string | undefined): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return /googlebot|bingbot|yandex|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|applebot|whatsapp|telegrambot|ai\.yandex|duckduckbot|baidu|sogou|petalbot/i.test(lower);
}


let cachedAssets: string | null = null;
let cacheTime = 0;

async function getAssets(): Promise<string> {
  if (cachedAssets && Date.now() - cacheTime < 60000) return cachedAssets;
  try {
    const resp = await fetch(SITE, { redirect: 'follow' });
    const html = await resp.text();
    const srcSeen = new Set<string>();
    const tags: string[] = [];

    function extract(section: string) {
      const linkRe = /<link[^>]*href="([^"]+)"[^>]*>/g;
      const scriptRe = /<script[^>]*src="([^"]+)"[^>]*>(?:<\/script>)?/g;
      let m;
      while ((m = linkRe.exec(section)) !== null) {
        if (m[1].includes('/assets/') && !m[1].includes('fonts.googleapis') && !srcSeen.has(m[1])) {
          srcSeen.add(m[1]);
          tags.push(m[0]);
        }
      }
      while ((m = scriptRe.exec(section)) !== null) {
        if (!srcSeen.has(m[1])) {
          srcSeen.add(m[1]);
          tags.push(m[0]);
        }
      }
    }

    const headMatch = html.match(/<head[\s\S]*?<\/head>/);
    if (headMatch) extract(headMatch[0]);
    const bodyMatch = html.match(/<body[\s\S]*?<\/body>/);
    if (bodyMatch) extract(bodyMatch[0]);

    cachedAssets = tags.join('\n    ');
    cacheTime = Date.now();
    return cachedAssets;
  } catch {
    return '';
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) return res.status(400).send('Missing product id');

  const ua = req.headers['user-agent'];
  const bot = isBot(ua);

  let lang: Lang = 'ru';
  if (ALL_LANGS.includes(req.query.lang as Lang)) {
    lang = req.query.lang as Lang;
  } else {
    const matchedPath = req.headers['x-matched-path'] as string | undefined;
    const pathMatch = matchedPath?.match(/\/(ru|tr|en|ar)\/product\//);
    if (pathMatch && ALL_LANGS.includes(pathMatch[1] as Lang)) {
      lang = pathMatch[1] as Lang;
    } else {
      const urlPath = req.headers['x-now-route-matches'] || req.headers['x-vercel-route'] || '';
      const urlMatch = String(urlPath).match(/\/(ru|tr|en|ar)\/product\//);
      if (urlMatch && ALL_LANGS.includes(urlMatch[1] as Lang)) {
        lang = urlMatch[1] as Lang;
      } else {
        lang = detectLang(req.headers['accept-language']);
      }
    }
  }

  let product: Record<string, unknown> | null = null;
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      product = data as Record<string, unknown> | null;
    } catch {
      /* product stays null */
    }
  }

  if (!product) return res.status(404).send('Product not found');

  const get = (field: string): string => {
    const val = product![`${field}_${lang}`] ?? product![`${field}_ru`] ?? '';
    return typeof val === 'string' ? val : '';
  };

  const name = get('name') || id;
  const cleanName = name.replace(/^Daruzen\s+/i, '');
  const displayName = cleanName || id;
  const desc = get('desc') || '';
  const catKey = (product.category_key as string) || 'supplements';
  const catLabel = CATEGORY_LABELS[lang][catKey] || CATEGORY_LABELS[lang].supplements;
  const imageUrl = typeof product.image === 'string'
    ? (product.image.startsWith('http') ? product.image : SITE + product.image)
    : SITE + '/images/og-image.png';
  const basePrice = Number(product.price) || 0;

  const feedPriceRUB = (basePrice * 2.2).toFixed(2);
  const stockSpec = (product.specs as Record<string, unknown>)?._stock;
  const feedInStock = stockSpec !== '0' && (Array.isArray(stockSpec) ? stockSpec[0] !== '0' : true) && product.inStock !== false && product.in_stock !== false;

  const price = bot ? feedPriceRUB : (basePrice * CURRENCY[lang].rate).toFixed(2);
  const cur = bot ? CURRENCY.ru : CURRENCY[lang];
  const inStock = feedInStock;
  const firstSentence = desc.split(/[.!؟]\s/)[0] || desc.slice(0, 120);

  const fallbackTitle = `${displayName} | Daruzen`;
  let title = (SEO_TITLES[id] && SEO_TITLES[id][lang]) || fallbackTitle;
  if (!title.toLowerCase().includes(displayName.toLowerCase())) {
    title = `${displayName} — ${title.replace(/\s*\|\s*Daruzen\s*$/, '').trim()} | Daruzen`;
  }
  const description = desc.replace(/\s+/g, ' ').trim();
  const compList = COMPOSITION[id]?.[lang] || COMPOSITION[id]?.en || '';
  const purposeList = (PURPOSE[id]?.[lang] || PURPOSE[id]?.ru || []).join(', ');
  const keywords = `${KEYWORDS_TEMPLATES[lang](name, catLabel, firstSentence)}, ${compList}, ${purposeList}`;
  const jsonLdDescription = `${displayName}. ${description || ''} ${compList ? 'Состав: ' + compList + '.' : ''}`.replace(/\s+/g, ' ').trim();

  const MAX_TITLE = 62;
  let titleForBot = title;
  if (titleForBot.length > MAX_TITLE) {
    const idx = titleForBot.lastIndexOf(' — ', MAX_TITLE);
    if (idx > 10) {
      titleForBot = titleForBot.slice(0, idx) + ' | Daruzen';
    } else {
      titleForBot = titleForBot.slice(0, MAX_TITLE - 9).replace(/\s+\S*$/, '') + ' | Daruzen';
    }
  }
  const descForBot = firstSentence || description;

  const canonical = `${SITE}/${lang}/product/${id}`;

  const hreflangTags = ALL_LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/product/${id}" />`).join('\n    ');
  const hreflangXDefault = `<link rel="alternate" hreflang="x-default" href="${SITE}/ru/product/${id}" />`;

  const seoName = displayName || title.replace(/\s*\|\s*Daruzen\s*$/, '').trim();
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': canonical + '#product',
    name: seoName,
    alternateName: title.replace(/\s*\|\s*Daruzen\s*$/, '').trim(),
    description: jsonLdDescription,
    image: [imageUrl],
    sku: id,
    mpn: id,
    brand: { '@type': 'Brand', name: 'Daruzen' },
    category: catLabel,
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    keywords: `${keywords}`,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: cur.code,
      priceValidUntil,
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: canonical,
      seller: { '@type': 'Organization', name: 'Daruzen' },
    },
  };

  const ratingVal = product.rating_value != null ? Number(product.rating_value) : null;
  const reviewCount = product.review_count != null ? Number(product.review_count) : null;
  if (ratingVal && reviewCount && reviewCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(ratingVal),
      reviewCount: String(reviewCount),
    };
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

  const html = `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(titleForBot)}</title>
    <meta name="description" content="${esc(descForBot)}" />
    <meta name="keywords" content="${esc(keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${esc(canonical)}" />
    ${hreflangTags}
    ${hreflangXDefault}
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:type" content="${imageUrl.endsWith('.png') ? 'image/png' : imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') ? 'image/jpeg' : 'image/webp'}" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="800" />
    <meta property="og:image:alt" content="${esc(seoName)}" />
    <meta property="og:site_name" content="Daruzen" />
    <meta property="og:locale" content="${LOCALE_MAP[lang]}" />
    ${ALL_LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LOCALE_MAP[l]}" />`).join('\n    ')}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=8" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png?v=8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=8" sizes="any" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png?v=8" />
    <meta name="theme-color" content="#cf9b41" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Daruzen","url":"${SITE}","logo":"${SITE}/images/dr.svg.png"}</script>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"${lang === 'ru' ? 'Главная' : lang === 'tr' ? 'Ana Sayfa' : lang === 'ar' ? 'الرئيسية' : 'Home'}","item":"${SITE}/${lang}"},{"@type":"ListItem","position":2,"name":"${lang === 'ru' ? 'Каталог' : lang === 'tr' ? 'Katalog' : lang === 'ar' ? 'الفهرس' : 'Catalog'}","item":"${SITE}/${lang}#catalog"},{"@type":"ListItem","position":3,"name":"${esc(seoName)}","item":"${canonical}"}]}</script>
  </head>
  <body>
    <div style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:sans-serif">
      <h1>${esc(seoName)}</h1>
      <p>${esc(desc)}</p>
      ${compList ? `<p><strong>${lang === 'ru' ? 'Состав' : lang === 'tr' ? 'Bileşenler' : lang === 'ar' ? 'المكونات' : 'Composition'}:</strong> ${esc(compList)}</p>` : ''}
      <p><strong>${lang === 'ru' ? 'Цена' : lang === 'tr' ? 'Fiyat' : lang === 'ar' ? 'السعر' : 'Price'}:</strong> ${price} ${cur.symbol}</p>
      <p><strong>${lang === 'ru' ? 'Наличие' : lang === 'tr' ? 'Stok durumu' : lang === 'ar' ? 'التوفر' : 'Availability'}:</strong> ${inStock ? (lang === 'ru' ? 'В наличии' : lang === 'tr' ? 'Stokta' : lang === 'ar' ? 'متوفر' : 'In Stock') : (lang === 'ru' ? 'Нет в наличии' : lang === 'tr' ? 'Stokta yok' : lang === 'ar' ? 'غير متوفر' : 'Out of Stock')}</p>
      <img src="${imageUrl}" alt="${esc(seoName)}" width="600" />
      <p><a href="${esc(canonical)}">${lang === 'ru' ? 'Открыть на сайте Daruzen' : lang === 'tr' ? 'Daruzen sitesinde aç' : lang === 'ar' ? 'فتح على موقع داروزن' : 'Open on Daruzen website'}</a></p>
    </div>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=0, max-age=300');
  res.setHeader('Vary', 'User-Agent');
  res.status(200).send(html);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
