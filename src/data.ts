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
      ru: ['60 жев. пастилок', '500 мг масла черного тмина', '10 мкг витамина D3', '10 мг цинка', '5 мг тимохинона'],
      tr: ['60 çiğn. jölesi', '500 mg siyah kimyon yağı', '10 mcg D3 vitamini', '10 mg çinko', '5 mg timokinon'],
      en: ['60 gummies', '500 mg black seed oil', '10 mcg Vitamin D3', '10 mg Zinc', '5 mg Thymoquinone'],
      ar: ['60 حلبة قابلة للمضغ', '500 ملغ زيت الحبة السوداء', '10 مكغ فيتامين D3', '10 ملغ زنك', '5 ملغ ثيموكينون'],
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
      ru: ['1000 мг', 'ЭПК 300 мг', 'ДГК 200 мг', 'Натуральный лимонный вкус'],
      tr: ['1000 mg', 'EPA 300 mg', 'DHA 200 mg', 'Doğal limon aroması'],
      en: ['1000 mg', 'EPA 300 mg', 'DHA 200 mg', 'Natural lemon flavor'],
      ar: ['1000 ملغ', 'EPA 300 ملغ', 'DHA 200 ملغ', 'نكهة الليمون الطبيعية'],
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
      ru: ['60 жев. пастилок', '500 мг яблочного уксуса', '10 мкг витамина B12', '5 мг пироксидина'],
      tr: ['60 çiğn. jölesi', '500 mg elma sirkesi', '10 mcg B12 vitamini', '5 mg piridoksin'],
      en: ['60 gummies', '500 mg apple cider vinegar', '10 mcg Vitamin B12', '5 mg Pyridoxine'],
      ar: ['60 حلبة قابلة للمضغ', '500 ملغ خل التفاح', '10 مكغ فيتامين B12', '5 ملغ بيريدوكسين'],
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
      ru: ['400 мг', 'Глицинат 150 мг', 'Цитрат 150 мг', 'Малат 100 мг'],
      tr: ['400 mg', 'Glisinat 150 mg', 'Sitrat 150 mg', 'Malat 100 mg'],
      en: ['400 mg', 'Glycinate 150 mg', 'Citrate 150 mg', 'Malate 100 mg'],
      ar: ['400 ملغ', 'غلايسينات 150 ملغ', 'سترات 150 ملغ', 'مالات 100 ملغ'],
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
      ru: ['600 мг', 'Экстракт расторопши 200 мг', 'Экстракт одуванчика 150 мг', 'Артишок 100 мг'],
      tr: ['600 mg', 'Devedikeni ekstresi 200 mg', 'Karahindiba ekstresi 150 mg', 'Enginar 100 mg'],
      en: ['600 mg', 'Milk thistle extract 200 mg', 'Dandelion extract 150 mg', 'Artichoke 100 mg'],
      ar: ['600 ملغ', 'مستخلص شوك الحليب 200 ملغ', 'مستخلص الهندباء 150 ملغ', 'خرشوف 100 ملغ'],
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
      ru: ['50 мг', 'Глюконат цинка 50 мг', 'Витамин C 20 мг', 'Без ГМО', 'Без сахара'],
        tr: ['50 mg', 'Çinko glukonat 50 mg', 'C vitamini 20 mg', 'GDO içermez', 'Şekersiz'],
      en: ['50 mg', 'Zinc gluconate 50 mg', 'Vitamin C 20 mg', 'Non-GMO', 'Sugar-free'],
      ar: ['50 ملغ', 'غلوكونات الزنك 50 ملغ', 'فيتامين C 20 ملغ', 'خالٍ من الكائنات المعدلة جينياً', 'خالٍ من السكر'],
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
      ru: ['400 мг', 'Экстракт бузины 150 мг', 'Витамин C 20 мг', 'Цинк 10 мг', 'Без сахара'],
      tr: ['400 mg', 'Kuş üzümü ekstresi 150 mg', 'C vitamini 20 mg', 'Çinko 10 mg', 'Şekersiz'],
      en: ['400 mg', 'Elderberry extract 150 mg', 'Vitamin C 20 mg', 'Zinc 10 mg', 'Sugar-free'],
      ar: ['400 ملغ', 'مستخلص البلسان 150 ملغ', 'فيتامين C 20 ملغ', 'زنك 10 ملغ', 'خالٍ من السكر'],
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
      ru: ['500 мг', 'Гидролизованный коллаген 300 мг', 'Гиалуроновая кислота 50 мг', 'Витамин C 20 мг'],
      tr: ['500 mg', 'Hidrolize kolajen 300 mg', 'Hiyalüronik asit 50 mg', 'C vitamini 20 mg'],
      en: ['500 mg', 'Hydrolyzed collagen 300 mg', 'Hyaluronic acid 50 mg', 'Vitamin C 20 mg'],
      ar: ['500 ملغ', 'كولاجين محلول مائياً 300 ملغ', 'حمض الهيالورونيك 50 ملغ', 'فيتامين C 20 ملغ'],
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
      ru: ['300 мг', 'Экстракт гимнемы 150 мг', 'Пиколинат хрома 100 мкг', 'Биотин 50 мкг'],
      tr: ['300 mg', 'Gymnema ekstresi 150 mg', 'Krom pikolinat 100 mcg', 'Biyotin 50 mcg'],
      en: ['300 mg', 'Gymnema extract 150 mg', 'Chromium picolinate 100 mcg', 'Biotin 50 mcg'],
      ar: ['300 ملغ', 'مستخلص غيمنيميا 150 ملغ', 'بيكولينات الكروم 100 مكغ', 'بيوتين 50 مكغ'],
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
      ru: ['300 мг', 'Экстракт гинкго билоба 150 мг', 'Экстракт женьшеня 100 мг', 'Витамин B6 5 мг'],
      tr: ['300 mg', 'Ginkgo biloba ekstresi 150 mg', 'Samsung ekstresi 100 mg', 'B6 vitamini 5 mg'],
      en: ['300 mg', 'Ginkgo biloba extract 150 mg', 'Ginseng extract 100 mg', 'Vitamin B6 5 mg'],
      ar: ['300 ملغ', 'مستخلص الجنكو بيلوبا 150 ملغ', 'مستخلص الجنسنغ 100 ملغ', 'فيتامين B6 5 ملغ'],
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
      ru: ['10 мг', 'B1 2 мг', 'B2 2 мг', 'B6 2 мг', 'B12 2 мкг', 'Ниацин 15 мг'],
      tr: ['10 mg', 'B1 2 mg', 'B2 2 mg', 'B6 2 mg', 'B12 2 mcg', 'Niasin 15 mg'],
      en: ['10 mg', 'B1 2 mg', 'B2 2 mg', 'B6 2 mg', 'B12 2 mcg', 'Niacin 15 mg'],
      ar: ['10 ملغ', 'B1 2 ملغ', 'B2 2 ملغ', 'B6 2 ملغ', 'B12 2 مكغ', 'نياسين 15 ملغ'],
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
      ru: ['500 мг', 'Витамин C 60 мг', 'Цинк 10 мг', 'Селен 50 мкг', 'Биотин 50 мкг', 'Йод 100 мкг'],
      tr: ['500 mg', 'C vitamini 60 mg', 'Çinko 10 mg', 'Selen 50 mcg', 'Biyotin 50 mcg', 'İyot 100 mcg'],
      en: ['500 mg', 'Vitamin C 60 mg', 'Zinc 10 mg', 'Selenium 50 mcg', 'Biotin 50 mcg', 'Iodine 100 mcg'],
      ar: ['500 ملغ', 'فيتامين C 60 ملغ', 'زنك 10 ملغ', 'سيلينيوم 50 مكغ', 'بيوتين 50 مكغ', 'يود 100 مكغ'],
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
