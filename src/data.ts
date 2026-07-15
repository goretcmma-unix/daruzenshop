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
      ru: ['60 конфет', 'Витамин D3', '2% Тимохинон', 'Цинк'],
      tr: ['60 çekirdek', 'D3 Vitamini', '%2 Timokinon', 'Çinko'],
      en: ['60 candies', 'Vitamin D3', '2% Thymoquinone', 'Zinc'],
      ar: ['60 حبة', 'فيتامين D3', '2% ثيموكينون', 'زنك'],
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
      ru: ['1000мг', 'ЭПК/ДГК', 'Натуральный лимонный вкус'],
      tr: ['1000mg', 'EPA/DHA', 'Doğal limon aroması'],
      en: ['1000mg', 'EPA/DHA', 'Natural lemon flavor'],
      ar: ['1000mg', 'EPA/DHA', 'نكهة الليمون الطبيعية'],
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
      ru: ['Яблочный уксус', 'Детокс', '60 жевательных пастилок'],
      tr: ['Elma sirkesi', 'Detoks', '60 çiğneme jölesi'],
      en: ['Apple cider vinegar', 'Detox', '60 chewing gummies'],
      ar: ['خل التفاح', 'إزالة السموم', '60 قرصاً قابلاً للمضغ'],
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
      ru: ['400мг', 'Глицинат, Цитрат, Малат'],
      tr: ['400mg', 'Glisinat, Sitrat, Malat'],
      en: ['400mg', 'Glycinate, Citrate, Malate'],
      ar: ['400mg', 'غلايسينات، سترات، مالات'],
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
      ru: ['Растительный состав', 'Комплексное действие', 'Натуральные экстракты'],
      tr: ['Bitkisel içerik', 'Kompleks etki', 'Doğal ekstreler'],
      en: ['Plant-based formula', 'Complex action', 'Natural extracts'],
      ar: ['تركيبة نباتية', 'تأثير شامل', 'مستخلصات طبيعية'],
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
      ru: ['50мг', 'Глюконат цинка', 'Без ГМО'],
      tr: ['50mg', 'Çinko glukonat', "GDO'suz"],
      en: ['50mg', 'Zinc gluconate', 'Non-GMO'],
      ar: ['50mg', 'غلوكونات الزنك', 'خالٍ من الكائنات المعدلة جينياً'],
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
      ru: ['Богат антиоксидантами', 'Без сахара', 'Подходит для детей'],
      tr: ['Antioksidan açısından zengin', 'Şekersiz', 'Çocuklar için uygun'],
      en: ['Rich in antioxidants', 'Sugar-free', 'Suitable for children'],
      ar: ['غني بمضادات الأكسدة', 'خالٍ من السكر', 'مناسب للأطفال'],
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
      ru: ['Морской коллаген', 'Гиалуроновая кислота', 'Витамин С'],
      tr: ['Deniz kolajeni', 'Hiyalüronik asit', 'C Vitamini'],
      en: ['Marine collagen', 'Hyaluronic acid', 'Vitamin C'],
      ar: ['كولاجين بحري', 'حمض الهيالورونيك', 'فيتامين C'],
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
      ru: ['Гимнема Сильвестра', 'Пиколинат хрома', 'Поддержка метаболизма'],
      tr: ['Gymnema Sylvestre', 'Krom pikolinat', 'Metabolizma desteği'],
      en: ['Gymnema Sylvestre', 'Chromium picolinate', 'Metabolism support'],
      ar: ['غيمنيميا سيلفستريس', 'بيكولينات الكروم', 'دعم الأيض'],
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
      ru: ['Гинкго Билоба', 'Женьшень', 'Поддержка памяти'],
      tr: ['Ginkgo Biloba', 'Ginseng', 'Hafıza desteği'],
      en: ['Ginkgo Biloba', 'Ginseng', 'Memory support'],
      ar: ['جينكو بيلوبا', 'الجنسنغ', 'دعم الذاكرة'],
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
      ru: ['B1, B2, B6, B12', 'Заряд энергии', 'Ежедневная поддержка'],
      tr: ['B1, B2, B6, B12', 'Enerji kaynağı', 'Günlük destek'],
      en: ['B1, B2, B6, B12', 'Energy boost', 'Daily support'],
      ar: ['B1, B2, B6, B12', 'دفعة طاقة', 'دعم يومي'],
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
      ru: ['Витамины A-Z', 'Богат минералами', 'Защита иммунитета'],
      tr: ['A\'dan Z\'ye Vitaminler', 'Mineraller açısından zengin', 'Bağışıklık koruması'],
      en: ['Vitamins A-Z', 'Rich in minerals', 'Immune protection'],
      ar: ['فيتامينات A-Z', 'غني بالمعادن', 'حماية المناعة'],
    },
  },
];

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
