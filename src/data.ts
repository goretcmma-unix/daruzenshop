import type { Lang } from './i18n';

export type CategoryKey = 'supplements' | 'vitamins' | 'minerals' | 'beauty' | 'herbs';

export interface Product {
  id: string;
  names: Record<Lang, string>;
  categoryKey: CategoryKey;
  price: number;
  image: string;
  descriptions: Record<Lang, string>;
  specs?: Record<Lang, string[]>;
}

export const categoryLabels = {
  ru: {
    all: 'Все',
    supplements: 'Добавки',
    vitamins: 'Витамины',
    minerals: 'Минералы',
    beauty: 'Красота',
    herbs: 'Травы',
  },
  tr: {
    all: 'Tümü',
    supplements: 'Takviyeler',
    vitamins: 'Vitaminler',
    minerals: 'Mineraller',
    beauty: 'Güzellik',
    herbs: 'Bitkiler',
  },
  en: {
    all: 'All',
    supplements: 'Supplements',
    vitamins: 'Vitamins',
    minerals: 'Minerals',
    beauty: 'Beauty',
    herbs: 'Herbs',
  },
  ar: {
    all: 'الكل',
    supplements: 'المكملات',
    vitamins: 'الفيتامينات',
    minerals: 'المعادن',
    beauty: 'الجمال',
    herbs: 'الأعشاب',
  },
} as const;

export const products: Product[] = [
  {
    id: 'prod-1',
    names: {
      ru: 'BSO Жевательные конфеты',
      tr: 'BSO Çiğneme Şekeri',
      en: 'BSO Chewing Candies',
      ar: 'حلوى بذور السوداء القابلة للمضغ',
    },
    categoryKey: 'supplements',
    price: 1800,
    image: '/images/bso.webp',
    descriptions: {
      ru: 'Жевательные конфеты с маслом черного тмина для иммунитета и общего самочувствия. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Bağışıklık ve genel sağlık için siyah kimyon yağı içeren çiğneme şekerleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Chewing candies with black seed oil for immunity and overall well-being. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'حلوى قابلة للمضغ بزيت الحبة السوداء لتعزيز المناعة والعافية العامة. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Масло черного тмина | 500 мг', 'Тимохинон | 5 мг', 'Витамин D3 | 10 мкг', 'Цинк | 10 мг'],
      tr: ['Siyah kimyon yağı | 500 mg', 'Timokinon | 5 mg', 'D3 vitamini | 10 mcg', 'Çinko | 10 mg'],
      en: ['Black seed oil | 500 mg', 'Thymoquinone | 5 mg', 'Vitamin D3 | 10 mcg', 'Zinc | 10 mg'],
      ar: ['زيت الحبة السوداء | 500 ملغ', 'ثيموكينون | 5 ملغ', 'فيتامين D3 | 10 مكغ', 'زنك | 10 ملغ'],
    },
  },
  {
    id: 'prod-2',
    names: {
      ru: 'Омега 3 Премиум',
      tr: 'Omega 3 Premium',
      en: 'Omega 3 Premium',
      ar: 'أوميغا 3 بريميوم',
    },
    categoryKey: 'vitamins',
    price: 2400,
    image: '/images/omg.webp',
    descriptions: {
      ru: 'Высокочистые капсулы рыбьего жира Омега-3 для здоровья сердца и мозга. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Kalp ve beyin sağlığı için yüksek saflıkta balık yağı kapsülleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'High-purity fish oil Omega-3 capsules for heart and brain health. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'كبسولات زيت السمك أوميغا 3 فائقة النقاء لصحة القلب والدماغ. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Омега-3 | 1000 мг', 'ЭПК | 300 мг', 'ДГК | 200 мг'],
      tr: ['Omega-3 | 1000 mg', 'EPA | 300 mg', 'DHA | 200 mg'],
      en: ['Omega-3 | 1000 mg', 'EPA | 300 mg', 'DHA | 200 mg'],
      ar: ['أوميغا 3 | 1000 ملغ', 'EPA | 300 ملغ', 'DHA | 200 ملغ'],
    },
  },
  {
    id: 'prod-3',
    names: {
      ru: 'ACV Мармелад',
      tr: 'ACV Jöle',
      en: 'ACV Gummies',
      ar: 'أقراص المكمّلات ACV',
    },
    categoryKey: 'supplements',
    price: 1500,
    image: '/images/acv.webp',
    descriptions: {
      ru: 'Жевательный мармелад на основе яблочного уксуса для поддержки обмена веществ, детоксикации и здорового пищеварения.',
      tr: 'Metabolizma desteği, detoks ve sağlıklı sindirim için elma sirkesi bazlı çiğneme jölesi.',
      en: 'Apple cider vinegar-based chewing gummies to support metabolism, detox and healthy digestion.',
      ar: 'أقراص قابلة للمضغ على أساس خل التفاح لدعم الأيض وإزالة السموم والهضم الصحي.',
    },
    specs: {
      ru: ['Яблочный уксус | 500 мг', 'Витамин B12 | 10 мкг', 'Пиридоксин (B6) | 5 мг'],
      tr: ['Elma sirkesi | 500 mg', 'B12 vitamini | 10 mcg', 'Piridoksin (B6) | 5 mg'],
      en: ['Apple cider vinegar | 500 mg', 'Vitamin B12 | 10 mcg', 'Pyridoxine (B6) | 5 mg'],
      ar: ['خل التفاح | 500 ملغ', 'فيتامين B12 | 10 مكغ', 'بيريدوكسين (B6) | 5 ملغ'],
    },
  },
  {
    id: 'prod-4',
    names: {
      ru: 'Магний Комплекс',
      tr: 'Magnezyum Kompleks',
      en: 'Magnesium Complex',
      ar: 'مجمّع المغنيسيوم',
    },
    categoryKey: 'minerals',
    price: 1950,
    image: '/images/magnezyum.webp',
    descriptions: {
      ru: 'Тройная смесь магния для расслабления мышц и улучшения сна. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Kas gevşemesi ve uyku kalitesi için üçlü magnezyum karışımı. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Triple magnesium blend for muscle relaxation and better sleep. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'مزيج ثلاثي المغنيسيوم لاسترخاء العضلات وتحسين النوم. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Магний | 400 мг', 'Глицинат магния | 150 мг', 'Цитрат магния | 150 мг', 'Малат магния | 100 мг'],
      tr: ['Magnezyum | 400 mg', 'Glisinat magnezyum | 150 mg', 'Sitrat magnezyum | 150 mg', 'Malat magnezyum | 100 mg'],
      en: ['Magnesium | 400 mg', 'Magnesium Glycinate | 150 mg', 'Magnesium Citrate | 150 mg', 'Magnesium Malate | 100 mg'],
      ar: ['مغنيسيوم | 400 ملغ', 'غلايسينات المغنيسيوم | 150 ملغ', 'سترات المغنيسيوم | 150 ملغ', 'مالات المغنيسيوم | 100 ملغ'],
    },
  },
  {
    id: 'prod-5',
    names: {
      ru: 'DNL Фитокомплекс',
      tr: 'DNL Fito Kompleks',
      en: 'DNL Phyto Complex',
      ar: 'المجمّع النباتي DNL',
    },
    categoryKey: 'supplements',
    price: 2200,
    image: '/images/dnl__.webp',
    descriptions: {
      ru: 'Натуральный фитокомплекс для поддержки организма и общего укрепления здоровья. Качественный препарат на основе растительных компонентов.',
      tr: 'Vücudu desteklemek ve genel sağlığı güçlendirmek için doğal bitkisel kompleks. Bitkisel bileşenlere dayalı kaliteli bir ürün.',
      en: 'Natural phyto-complex to support the body and strengthen overall health. A quality product based on plant components.',
      ar: 'مجمّع نباتي طبيعي لدعم الجسم وتعزيز الصحة العامة. منتج عالي الجودة مبني على مكونات نباتية.',
    },
    specs: {
      ru: ['Экстракт расторопши | 200 мг | —', 'Экстракт одуванчика | 150 мг | —', 'Экстракт артишока | 100 мг | —'],
      tr: ['Devedikeni ekstresi | 200 mg | —', 'Karahindiba ekstresi | 150 mg | —', 'Enginar ekstresi | 100 mg | —'],
      en: ['Milk thistle extract | 200 mg | —', 'Dandelion extract | 150 mg | —', 'Artichoke extract | 100 mg | —'],
      ar: ['مستخلص شوك الحليب | 200 ملغ | —', 'مستخلص الهندباء | 150 ملغ | —', 'مستخلص الخرشف | 100 ملغ | —'],
    },
  },
  {
    id: 'prod-6',
    names: {
      ru: 'Цинк Защита',
      tr: 'Çinko Koruma',
      en: 'Zinc Protection',
      ar: 'حماية الزنك',
    },
    categoryKey: 'minerals',
    price: 1100,
    image: '/images/zincpng.webp',
    descriptions: {
      ru: 'Максимально сильная добавка цинка для сезонного иммунитета. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Mevsimsel bağışıklık için güçlü çinko takviyesi. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Maximum-strength zinc supplement for seasonal immunity. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'مكمّل زنك بأقصى قوة للمناعة الموسمية. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Цинк | 50 мг | 455%', 'Глюконат цинка | 50 мг | —', 'Витамин C | 20 мг | 22%'],
      tr: ['Çinko | 50 mg | 455%', 'Çinko glukonat | 50 mg | —', 'C vitamini | 20 mg | 22%'],
      en: ['Zinc | 50 mg | 455%', 'Zinc gluconate | 50 mg | —', 'Vitamin C | 20 mg | 22%'],
      ar: ['زنك | 50 ملغ | 455%', 'غلوكونات الزنك | 50 ملغ | —', 'فيتامين C | 20 ملغ | 22%'],
    },
  },
  {
    id: 'prod-7',
    names: {
      ru: 'Экстракт расторопши и одуванчика',
      tr: 'Devedikeni ve Karahindiba Ekstresi',
      en: 'Milk Thistle & Dandelion Extract',
      ar: 'مستخلص شوك الحليب والهندباء',
    },
    categoryKey: 'supplements',
    price: 2100,
    image: '/images/enginar__.webp',
    descriptions: {
      ru: 'Натуральные жевательные конфеты с экстрактом бузины, витамином С и цинком. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Kuş üzümü ekstresi, C vitamini ve çinko içeren doğal çiğneme şekerleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Natural chewing candies with elderberry extract, vitamin C and zinc. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'حلوى طبيعية قابلة للمضغ بمستخلص البلسان وفيتامين C والزنك. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Экстракт бузины | 150 мг | —', 'Витамин C | 20 мг | 22%', 'Цинк | 10 мг | 100%'],
      tr: ['Kuş üzümü ekstresi | 150 mg | —', 'C vitamini | 20 mg | 22%', 'Çinko | 10 mg | 100%'],
      en: ['Elderberry extract | 150 mg | —', 'Vitamin C | 20 mg | 22%', 'Zinc | 10 mg | 100%'],
      ar: ['مستخلص البلسان | 150 ملغ | —', 'فيتامين C | 20 ملغ | 22%', 'زنك | 10 ملغ | 100%'],
    },
  },
  {
    id: 'prod-8',
    names: {
      ru: 'Антиоксидант',
      tr: 'Antioksidan',
      en: 'Antioxidant',
      ar: 'مضاد الأكسدة',
    },
    categoryKey: 'beauty',
    price: 3500,
    image: '/images/nadh_gummy.webp',
    descriptions: {
      ru: 'Гидролизованные пептиды коллагена для эластичности кожи и здоровья суставов. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Cilt esnekliği ve eklem sağlığı için hidrolize kolajen peptitleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Hydrolyzed collagen peptides for skin elasticity and joint health. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'ببتيدات الكولاجين المتحللة مائياً لمرونة البشرة وصحة المفاصل. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Гидролизованный коллаген | 300 мг | —', 'Гиалуроновая кислота | 50 мг | —', 'Витамин C | 20 мг | 22%'],
      tr: ['Hidrolize kolajen | 300 mg | —', 'Hiyalüronik asit | 50 mg | —', 'C vitamini | 20 mg | 22%'],
      en: ['Hydrolyzed collagen | 300 mg | —', 'Hyaluronic acid | 50 mg | —', 'Vitamin C | 20 mg | 22%'],
      ar: ['كولاجين محلول مائياً | 300 ملغ | —', 'حمض الهيالورونيك | 50 ملغ | —', 'فيتامين C | 20 ملغ | 22%'],
    },
  },
  {
    id: 'prod-9',
    names: {
      ru: 'Хром',
      tr: 'Krom',
      en: 'Chromium',
      ar: 'الكروم',
    },
    categoryKey: 'herbs',
    price: 2800,
    image: '/images/gimne.webp',
    descriptions: {
      ru: 'Травяной экстракт с хромом для поддержания уровня сахара в крови и метаболизма. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Kan şekeri seviyesi ve metabolizma desteği için krom içeren bitkisel ekstre. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Herbal extract with chromium to support blood sugar levels and metabolism. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'مستخلص عشبي بالكروم لدعم مستويات سكر الدم والأيض. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Экстракт гимнемы | 150 мг | —', 'Хром (пиколинат) | 100 мкг | 91%', 'Биотин | 50 мкг | 167%'],
      tr: ['Gymnema ekstresi | 150 mg | —', 'Krom (pikolinat) | 100 mcg | 91%', 'Biyotin | 50 mcg | 167%'],
      en: ['Gymnema extract | 150 mg | —', 'Chromium (picolinate) | 100 mcg | 91%', 'Biotin | 50 mcg | 167%'],
      ar: ['مستخلص غيمنيميا | 150 ملغ | —', 'كروم (بيكولينات) | 100 مكغ | 91%', 'بيوتين | 50 مكغ | 167%'],
    },
  },
  {
    id: 'prod-10',
    names: {
      ru: 'Джинко Фитокомплекс',
      tr: 'Ginkgo Fito Kompleks',
      en: 'Ginkgo Phyto Complex',
      ar: 'المجمّع النباتي جينكو',
    },
    categoryKey: 'herbs',
    price: 2300,
    image: '/images/ginko_ginseng.webp',
    descriptions: {
      ru: 'Натуральный фитокомплекс на основе гинкго билоба и женьшеня для поддержки мозговой активности, улучшения памяти и концентрации.',
      tr: 'Beyin aktivitesi, hafıza ve konsantrasyon desteği için ginkgo biloba ve ginseng bazlı doğal bitkisel kompleks.',
      en: 'Natural phyto-complex based on ginkgo biloba and ginseng to support brain activity, improve memory and concentration.',
      ar: 'مجمّع نباتي طبيعي على أساس الجنكو بيلوبا والجنسنغ لدعم النشاط الذهني وتحسين الذاكرة والتركيز.',
    },
    specs: {
      ru: ['Экстракт гинкго билоба | 150 мг', 'Экстракт женьшеня | 100 мг', 'Витамин B6 | 5 мг'],
      tr: ['Ginkgo biloba ekstresi | 150 mg', 'Saman ekstresi | 100 mg', 'B6 vitamini | 5 mg'],
      en: ['Ginkgo biloba extract | 150 mg', 'Ginseng extract | 100 mg', 'Vitamin B6 | 5 mg'],
      ar: ['مستخلص الجنكو بيلوبا | 150 ملغ', 'مستخلص الجنسنغ | 100 ملغ', 'فيتامين B6 | 5 ملغ'],
    },
  },
  {
    id: 'prod-11',
    names: {
      ru: 'Витамин B-Комплекс',
      tr: 'B Vitamini Kompleksi',
      en: 'Vitamin B-Complex',
      ar: 'فيتامين B المجمّع',
    },
    categoryKey: 'vitamins',
    price: 1650,
    image: '/images/optimacomplex.webp',
    descriptions: {
      ru: 'Полный комплекс витаминов группы B для энергетического обмена и поддержки нервной системы. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Enerji metabolizması ve sinir sistemi desteği için tam B vitamini kompleksi. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Complete B-group vitamin complex for energy metabolism and nervous system support. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'مجمّع فيتامينات B الكامل لدعم الأيض والجهاز العصبي. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Витамин B1 | 2 мг', 'Витамин B2 | 2 мг', 'Витамин B6 | 2 мг', 'Витамин B12 | 2 мкг', 'Ниацин | 15 мг'],
      tr: ['B1 vitamini | 2 mg', 'B2 vitamini | 2 mg', 'B6 vitamini | 2 mg', 'B12 vitamini | 2 mcg', 'Niasin | 15 mg'],
      en: ['Vitamin B1 | 2 mg', 'Vitamin B2 | 2 mg', 'Vitamin B6 | 2 mg', 'Vitamin B12 | 2 mcg', 'Niacin | 15 mg'],
      ar: ['فيتامين B1 | 2 ملغ', 'فيتامين B2 | 2 ملغ', 'فيتامين B6 | 2 ملغ', 'فيتامين B12 | 2 مكغ', 'نياسين | 15 ملغ'],
    },
  },
  {
    id: 'prod-12',
    names: {
      ru: 'Мультивитамин Специальный',
      tr: 'Özel Multivitamin',
      en: 'Special Multivitamin',
      ar: 'فيتامينات متعددة خاصة',
    },
    categoryKey: 'vitamins',
    price: 2900,
    image: '/images/multigummy.webp',
    descriptions: {
      ru: 'Премиальная мультивитаминная формула для активного образа жизни и иммунитета. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Aktif yaşam ve bağışıklık için premium multivitamin formülü. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Premium multivitamin formula for an active lifestyle and immunity. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'تركيبة فيتامينات متعددة متميزة لنمط حياة نشط والمناعة. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: ['Витамин C | 60 мг | 67%', 'Цинк | 10 мг | 100%', 'Селен | 50 мкг | 91%', 'Биотин | 50 мкг | 167%', 'Йод | 100 мкг | 67%'],
      tr: ['C vitamini | 60 mg | 67%', 'Çinko | 10 mg | 100%', 'Selen | 50 mcg | 91%', 'Biyotin | 50 mcg | 167%', 'İyot | 100 mcg | 67%'],
      en: ['Vitamin C | 60 mg | 67%', 'Zinc | 10 mg | 100%', 'Selenium | 50 mcg | 91%', 'Biotin | 50 mcg | 167%', 'Iodine | 100 mcg | 67%'],
      ar: ['فيتامين C | 60 ملغ | 67%', 'زنك | 10 ملغ | 100%', 'سيلينيوم | 50 مكغ | 91%', 'بيوتين | 50 مكغ | 167%', 'يود | 100 مكغ | 67%'],
    },
  },
];

export const parseCompositionLine = (line: string): { ingredient: string; dosage: string; daily: string } => {
  const parts = line.split('|').map(s => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return { ingredient: parts[0], dosage: parts[1], daily: parts[2] };
  }
  if (parts.length === 2) {
    return { ingredient: parts[0], dosage: parts[1], daily: '' };
  }
  if (parts.length === 1) {
    const text = parts[0];
    const m = text.match(/(\d+(?:[\s.,]\d+)?\s*(?:мкг|мг|г|%|ед|мл|л|mcg|mg|g|ml|l|IU|UI|капс|табл|штук|доз|ed|iu|ui|Ед|пастилок|tablet|capsul|drop|sachet|пак|кап))/i);
    if (m) {
      const dosage = m[1].trim();
      const ingredient = text.replace(m[1], '').trim().replace(/^[\s,;:-]+|[\s,;:-]+$/g, '');
      return { ingredient: ingredient || text, dosage, daily: '' };
    }
    return { ingredient: text, dosage: '', daily: '' };
  }
  return { ingredient: line, dosage: '', daily: '' };
};

export const dedupeProducts = (list: Product[]): Product[] => {
  const seen = new Set<string>();
  return list.filter(p => {
    if (!p.id || seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
};

export interface LocalizedProduct {
  id: string;
  name: string;
  categoryKey: CategoryKey;
  category: string;
  price: number;
  image: string;
  description: string;
  specs?: string[];
}

export const localizeProducts = (lang: Lang, source: Product[] = products): LocalizedProduct[] =>
  source.map(p => ({
    id: p.id,
    name: p.names[lang],
    categoryKey: p.categoryKey,
    category: categoryLabels[lang][p.categoryKey],
    price: p.price,
    image: p.image,
    description: p.descriptions[lang],
    specs: p.specs ? p.specs[lang] : undefined,
  }));

// Ключи категорий (первый — «все»)
export const categoryKeys: ('all' | CategoryKey)[] = [
  'all',
  ...Array.from(new Set(products.map(p => p.categoryKey))),
];

export const getCategoryLabel = (lang: Lang, key: 'all' | CategoryKey): string =>
  key === 'all' ? categoryLabels[lang].all : categoryLabels[lang][key];
