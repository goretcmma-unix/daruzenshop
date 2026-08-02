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
      ru: [
        '| **Показатель** | **Количество (100 г)** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| Энергетическая ценность | 350 ккал | — |',
        '| Жиры | 0 г | — |',
        '| Насыщенные жиры | 0 г | — |',
        '| Углеводы | 80 г | — |',
        '| Сахара | 70 г | — |',
        '| Белки | 6 г | — |',
        '| Клетчатка | 0 г | — |',
        '| Соль | 0 г | — |',
        '| Масло черного тмина | 16666.67 мг | — |',
        '| Витамин D3 | 16.67 мкг | 333% |',
        '| Цинк | 16.67 мг | 100% |',
        '| Фосфат кальция | 833.33 мг | — |',
      ],
      tr: [
        '| **Gösterge** | **Miktar (100 g)** | **% günlük ihtiyaç** |',
        '| --- | ---: | ---: |',
        '| Enerji değeri | 350 kcal | — |',
        '| Yağ | 0 g | — |',
        '| Doymuş yağ | 0 g | — |',
        '| Karbonhidrat | 80 g | — |',
        '| Şeker | 70 g | — |',
        '| Protein | 6 g | — |',
        '| Lif | 0 g | — |',
        '| Tuz | 0 g | — |',
        '| Siyah kimyon yağı | 16666.67 mg | — |',
        '| D3 vitamini | 16.67 mcg | %333 |',
        '| Çinko | 16.67 mg | %100 |',
        '| Kalsiyum fosfat | 833.33 mg | — |',
      ],
      en: [
        '| **Indicator** | **Amount (100 g)** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| Energy value | 350 kcal | — |',
        '| Fat | 0 g | — |',
        '| Saturated fat | 0 g | — |',
        '| Carbohydrates | 80 g | — |',
        '| Sugars | 70 g | — |',
        '| Protein | 6 g | — |',
        '| Fiber | 0 g | — |',
        '| Salt | 0 g | — |',
        '| Black seed oil | 16666.67 mg | — |',
        '| Vitamin D3 | 16.67 mcg | 333% |',
        '| Zinc | 16.67 mg | 100% |',
        '| Calcium phosphate | 833.33 mg | — |',
      ],
      ar: [
        '| **المؤشر** | **الكمية (100 غ)** | **% من الاحتياج اليومي** |',
        '| --- | ---: | ---: |',
        '| القيمة الطاقية | 350 ككال | — |',
        '| الدهون | 0 غ | — |',
        '| الدهون المشبعة | 0 غ | — |',
        '| الكربوهيدرات | 80 غ | — |',
        '| السكريات | 70 غ | — |',
        '| البروتين | 6 غ | — |',
        '| الألياف | 0 غ | — |',
        '| الملح | 0 غ | — |',
        '| زيت الحبة السوداء | 16666.67 ملغ | — |',
        '| فيتامين D3 | 16.67 مكغ | 333% |',
        '| الزنك | 16.67 ملغ | 100% |',
        '| فوسفات الكالسيوم | 833.33 ملغ | — |',
      ],
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
      ru: [
        '| **Активный компонент** | **Состав на 2 капсулы** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| **Рыбий жир** | 1820 мг | — |',
        '| └ Омега-3 | 1000 мг | — |',
        '| └ EPA (эйкозапентаеновая кислота) | 600 мг | — |',
        '| └ DHA (докозагексаеновая кислота) | 400 мг | — |',
      ],
      tr: [
        '| **Aktif bileşen** | **2 kapsül için içerik** | **% günlük ihtiyaç** |',
        '| --- | ---: | ---: |',
        '| **Balık yağı** | 1820 mg | — |',
        '| └ Omega-3 | 1000 mg | — |',
        '| └ EPA (eikosapentaenoik asit) | 600 mg | — |',
        '| └ DHA (dokosaheksaenoik asit) | 400 mg | — |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 2 capsules** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| **Fish oil** | 1820 mg | — |',
        '| └ Omega-3 | 1000 mg | — |',
        '| └ EPA (eicosapentaenoic acid) | 600 mg | — |',
        '| └ DHA (docosahexaenoic acid) | 400 mg | — |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات كبسولتين** | **% من الاحتياج اليومي** |',
        '| --- | ---: | ---: |',
        '| **زيت السمك** | 1820 ملغ | — |',
        '| └ أوميغا 3 | 1000 ملغ | — |',
        '| └ EPA (حمض الإيكوسابنتاينويك) | 600 ملغ | — |',
        '| └ DHA (حمض الدوكوساهيكسانويك) | 400 ملغ | — |',
      ],
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
      ru: [
        '| **Активный компонент** | **Состав на 2 жевательные пастилки** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| **Свекольный порошок** | 12 мг | 100% |',
        '| **Экстракт граната** | 50 мг | — |',
        '| **Фолиевая кислота (витамин B9)** | 50 мкг | — |',
        '| **Цианокобаламин (витамин B12)** | 10 мкг | 100% |',
      ],
      tr: [
        '| **Aktif bileşen** | **2 çiğneme pastili için içerik** | **% günlük ihtiyaç** |',
        '| --- | ---: | ---: |',
        '| **Pancar tozu** | 12 mg | %100 |',
        '| **Nar ekstresi** | 50 mg | — |',
        '| **Folik asit (B9 vitamini)** | 50 mcg | — |',
        '| **Siyanokobalamin (B12 vitamini)** | 10 mcg | %100 |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 2 chewable pastilles** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| **Beetroot powder** | 12 mg | 100% |',
        '| **Pomegranate extract** | 50 mg | — |',
        '| **Folic acid (vitamin B9)** | 50 mcg | — |',
        '| **Cyanocobalamin (vitamin B12)** | 10 mcg | 100% |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات حبتين للمضغ** | **% من الاحتياج اليومي** |',
        '| --- | ---: | ---: |',
        '| **مسحوق الشمندر** | 12 ملغ | 100% |',
        '| **مستخلص الرمان** | 50 ملغ | — |',
        '| **حمض الفوليك (فيتامين B9)** | 50 مكغ | — |',
        '| **سيانوكوبالامين (فيتامين B12)** | 10 مكغ | 100% |',
      ],
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
    image: '/images/magnez.webp',
    descriptions: {
      ru: 'Тройная смесь магния для расслабления мышц и улучшения сна. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
      tr: 'Kas gevşemesi ve uyku kalitesi için üçlü magnezyum karışımı. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
      en: 'Triple magnesium blend for muscle relaxation and better sleep. A quality product to support your health. Natural composition and high effectiveness.',
      ar: 'مزيج ثلاثي المغنيسيوم لاسترخاء العضلات وتحسين النوم. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
    },
    specs: {
      ru: [
        '| **Активный компонент** | **Состав на 1 таблетку** | **Состав на 2 таблетки** | **% от суточной нормы (BRD) на 2 таблетки** |',
        '| --- | ---: | ---: | ---: |',
        '| **Магний (всего)** | 125 мг | 250 мг | **67%** |',
        '| └ Магний ацетилтаурат | 33,005 мг | 66,010 мг | — |',
        '| └ Магний бисглицинат | 49,65 мг | 99,3 мг | — |',
        '| └ Магний малат | 34,5 мг | 69 мг | — |',
        '| └ Магний цитрат | 7,845 мг | 15,69 мг | — |',
        '| **Витамин B6** | 2 мг | 4 мг | **286%** |',
        '~~BRD рассчитан для 2 таблеток. Для отдельных форм магния рекомендуемая суточная норма не установлена.',
      ],
      tr: [
        '| **Aktif bileşen** | **1 tablet için içerik** | **2 tablet için içerik** | **% günlük ihtiyaç (BRD) 2 tablet için** |',
        '| --- | ---: | ---: | ---: |',
        '| **Magnezyum (toplam)** | 125 mg | 250 mg | **%67** |',
        '| └ Magnezyum asetiltaurat | 33.005 mg | 66.010 mg | — |',
        '| └ Magnezyum bisglisinat | 49.65 mg | 99.3 mg | — |',
        '| └ Magnezyum malat | 34.5 mg | 69 mg | — |',
        '| └ Magnezyum sitrat | 7.845 mg | 15.69 mg | — |',
        '| **B6 vitamini** | 2 mg | 4 mg | **%286** |',
        '~~BRD 2 tablet için hesaplanmıştır. Bireysel magnezyum formları için önerilen günlük alım miktarı belirlenmemiştir.',
      ],
      en: [
        '| **Active ingredient** | **Composition per 1 tablet** | **Composition per 2 tablets** | **% of daily value (BRD) per 2 tablets** |',
        '| --- | ---: | ---: | ---: |',
        '| **Magnesium (total)** | 125 mg | 250 mg | **67%** |',
        '| └ Magnesium acetyltaurate | 33.005 mg | 66.010 mg | — |',
        '| └ Magnesium bisglycinate | 49.65 mg | 99.3 mg | — |',
        '| └ Magnesium malate | 34.5 mg | 69 mg | — |',
        '| └ Magnesium citrate | 7.845 mg | 15.69 mg | — |',
        '| **Vitamin B6** | 2 mg | 4 mg | **286%** |',
        '~~BRD is calculated per 2 tablets. No recommended daily allowance is established for individual magnesium forms.',
      ],
      ar: [
        '| **المكون النشط** | **مكونات قرص واحد** | **مكونات قرصين** | **% من الاحتياج اليومي (BRD) لقرصين** |',
        '| --- | ---: | ---: | ---: |',
        '| **مغنيسيوم (إجمالي)** | 125 ملغ | 250 ملغ | **%67** |',
        '| └ ماغنيسيوم أسيتيل تورات | 33.005 ملغ | 66.010 ملغ | — |',
        '| └ مغنيسيوم بيسغليسينات | 49.65 ملغ | 99.3 ملغ | — |',
        '| └ مغنيسيوم مالات | 34.5 ملغ | 69 ملغ | — |',
        '| └ سترات المغنيسيوم | 7.845 ملغ | 15.69 ملغ | — |',
        '| **فيتامين B6** | 2 ملغ | 4 ملغ | **%286** |',
        '~~يُحسب BRD لقرصين. لم يتم تحديد الكمية اليومية الموصى بها للأشكال الفردية من المغنيسيوم.',
      ],
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
      ru: [
        '| **Активный компонент** | **Состав на 2 таблетки** |',
        '| --- | ---: |',
        '| Боярышник (*Crataegus* sp.) | 172,8 мг |',
        '| Сельдерей (*Apium graveolens*) | 154,8 мг |',
        '| Кошачий коготь (*Uncaria tomentosa*) | 118,8 мг |',
        '| Базилик (*Ocimum*) | 117,94 мг |',
        '| Черный перец (*Piper nigrum*) | 105,98 мг |',
        '| Роза (*Rosa* sp.) | 92 мг |',
        '| Гибискус (*Hibiscus sabdariffa*) | 89,86 мг |',
        '| Лаванда узколистная (*Lavandula angustifolia*) | 75,6 мг |',
        '| Корица китайская (*Cinnamomum cassia*) | 27,8 мг |',
        '| Кардамон (*Elettaria cardamomum*) | 26,06 мг |',
        '| Акация арабская (*Acacia arabica*) | 20,02 мг |',
      ],
      tr: [
        '| **Aktif bileşen** | **2 tablet için içerik** |',
        '| --- | ---: |',
        '| Alıç (*Crataegus* sp.) | 172,8 mg |',
        '| Kereviz (*Apium graveolens*) | 154,8 mg |',
        '| Kedi pençesi (*Uncaria tomentosa*) | 118,8 mg |',
        '| Fesleğen (*Ocimum*) | 117,94 mg |',
        '| Kara biber (*Piper nigrum*) | 105,98 mg |',
        '| Gül (*Rosa* sp.) | 92 mg |',
        '| Hibiskus (*Hibiscus sabdariffa*) | 89,86 mg |',
        '| Dar yapraklı lavanta (*Lavandula angustifolia*) | 75,6 mg |',
        '| Çin tarçını (*Cinnamomum cassia*) | 27,8 mg |',
        '| Kakule (*Elettaria cardamomum*) | 26,06 mg |',
        '| Arap akasyası (*Acacia arabica*) | 20,02 mg |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 2 tablets** |',
        '| --- | ---: |',
        '| Hawthorn (*Crataegus* sp.) | 172.8 mg |',
        '| Celery (*Apium graveolens*) | 154.8 mg |',
        '| Cat\'s claw (*Uncaria tomentosa*) | 118.8 mg |',
        '| Basil (*Ocimum*) | 117.94 mg |',
        '| Black pepper (*Piper nigrum*) | 105.98 mg |',
        '| Rose (*Rosa* sp.) | 92 mg |',
        '| Hibiscus (*Hibiscus sabdariffa*) | 89.86 mg |',
        '| Narrow-leaved lavender (*Lavandula angustifolia*) | 75.6 mg |',
        '| Chinese cinnamon (*Cinnamomum cassia*) | 27.8 mg |',
        '| Cardamom (*Elettaria cardamomum*) | 26.06 mg |',
        '| Arabian acacia (*Acacia arabica*) | 20.02 mg |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات قرصين** |',
        '| --- | ---: |',
        '| الزعرور (*Crataegus* sp.) | 172,8 ملغ |',
        '| الكرفس (*Apium graveolens*) | 154,8 ملغ |',
        '| مخلب القط (*Uncaria tomentosa*) | 118,8 ملغ |',
        '| الريحان (*Ocimum*) | 117,94 ملغ |',
        '| الفلفل الأسود (*Piper nigrum*) | 105,98 ملغ |',
        '| الورد (*Rosa* sp.) | 92 ملغ |',
        '| الكركديه (*Hibiscus sabdariffa*) | 89,86 ملغ |',
        '| الخزامى ضيقة الأوراق (*Lavandula angustifolia*) | 75,6 ملغ |',
        '| القرفة الصينية (*Cinnamomum cassia*) | 27,8 ملغ |',
        '| الهيل (*Elettaria cardamomum*) | 26,06 ملغ |',
        '| الأكاسيا العربية (*Acacia arabica*) | 20,02 ملغ |',
      ],
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
      ru: ['Цинк | 15 мг', 'Медь | 2000 мкг', 'Селен | 55 мкг'],
      tr: ['Çinko | 15 mg', 'Bakır | 2000 mcg', 'Selenyum | 55 mcg'],
      en: ['Zinc | 15 mg', 'Copper | 2000 mcg', 'Selenium | 55 mcg'],
      ar: ['زنك | 15 ملغ', 'نحاس | 2000 مكغ', 'سيلينيوم | 55 مكغ'],
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
      ru: [
        '| **Активный компонент** | **Состав на 2 капсулы в день** | **% от суточной нормы (BRD) на 2 капсулы** |',
        '| --- | ---: | ---: | ---: |',
        '| **Экстракт бузины** | 150 мг | — |',
        '| **Витамин C** | 20 мг | **22%** |',
        '| **Цинк** | 10 мг | **100%** |',
      ],
      tr: [
        '| **Aktif bileşen** | **Günde 2 kapsül** | **% günlük ihtiyaç (BRD) 2 kapsül için** |',
        '| --- | ---: | ---: | ---: |',
        '| **Kuş üzümü ekstresi** | 150 mg | — |',
        '| **C vitamini** | 20 mg | **%22** |',
        '| **Çinko** | 10 mg | **%100** |',
      ],
      en: [
        '| **Active ingredient** | **2 capsules per day** | **% of daily value (BRD) per 2 capsules** |',
        '| --- | ---: | ---: | ---: |',
        '| **Elderberry extract** | 150 mg | — |',
        '| **Vitamin C** | 20 mg | **22%** |',
        '| **Zinc** | 10 mg | **100%** |',
      ],
      ar: [
        '| **المكون النشط** | **كبسولتين يوميا** | **% من الاحتياج اليومي (BRD) لكبسولتين** |',
        '| --- | ---: | ---: | ---: |',
        '| **مستخلص البلسان** | 150 ملغ | — |',
        '| **فيتامين C** | 20 ملغ | **%22** |',
        '| **زنك** | 10 ملغ | **%100** |',
      ],
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
      ru: [
        '| **Активный компонент** | **Состав на 2 жевательные пастилки** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| Глутатион | 30 мг | — |',
        '| Ресвератрол | 30 мг | — |',
        '| Коэнзим Q10 | 30 мг | — |',
        '| NADH | 20 мг | — |',
        '| Пиридоксина гидрохлорид (витамин B6) | 1,4 мг | 100% |',
        '| Цианокобаламин (витамин B12) | 2,50 мкг | 100% |',
      ],
      tr: [
        '| **Aktif bileşen** | **2 çiğneme pastili için içerik** | **% günlük ihtiyaç** |',
        '| --- | ---: | ---: |',
        '| Glutatyon | 30 mg | — |',
        '| Resveratrol | 30 mg | — |',
        '| Koenzim Q10 | 30 mg | — |',
        '| NADH | 20 mg | — |',
        '| Piridoksin hidroklorür (B6 vitamini) | 1,4 mg | %100 |',
        '| Siyanokobalamin (B12 vitamini) | 2,50 mcg | %100 |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 2 chewable pastilles** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| Glutathione | 30 mg | — |',
        '| Resveratrol | 30 mg | — |',
        '| Coenzyme Q10 | 30 mg | — |',
        '| NADH | 20 mg | — |',
        '| Pyridoxine hydrochloride (vitamin B6) | 1.4 mg | 100% |',
        '| Cyanocobalamin (vitamin B12) | 2.50 mcg | 100% |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات حبتين للمضغ** | **% من الاحتياج اليومي** |',
        '| --- | ---: | ---: |',
        '| الجلوتاثيون | 30 ملغ | — |',
        '| ريسفيراترول | 30 ملغ | — |',
        '| الإنزيم المساعد Q10 | 30 ملغ | — |',
        '| NADH | 20 ملغ | — |',
        '| هيدروكلوريد البيريدوكسين (فيتامين B6) | 1,4 ملغ | 100% |',
        '| سيانوكوبالامين (فيتامين B12) | 2,50 مكغ | 100% |',
      ],
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
      ru: [
        '| **Активный компонент** | **Состав на 1 таблетку** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| **Экстракт джимнемы** | 500 мг | — |',
        '| **Хром** | 65 мкг | 162,5% |',
      ],
      tr: [
        '| **Aktif bileşen** | **1 tablet için içerik** | **% günlük ihtiyaç** |',
        '| --- | ---: | ---: |',
        '| **Gymnema ekstresi** | 500 mg | — |',
        '| **Krom** | 65 mcg | %162,5 |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 1 tablet** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| **Gymnema extract** | 500 mg | — |',
        '| **Chromium** | 65 mcg | 162.5% |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات قرص واحد** | **% من الاحتياج اليومي** |',
        '| --- | ---: | ---: |',
        '| **مستخلص غيمنيميا** | 500 ملغ | — |',
        '| **الكروم** | 65 مكغ | 162.5% |',
      ],
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
      ru: ['# На 5 мл', 'Экстракт гинкго билоба | 375 мг', 'Экстракт корейского женьшеня | 20 мг', 'Цитиколин | 15 мг', '# На 10 мл', 'Экстракт гинкго билоба | 750 мг', 'Экстракт корейского женьшеня | 40 мг', 'Цитиколин | 30 мг'],
      tr: ['# 5 ml başına', 'Ginkgo biloba ekstresi | 375 mg', 'Kore ginsengi ekstresi | 20 mg', 'Sitikolin | 15 mg', '# 10 ml başına', 'Ginkgo biloba ekstresi | 750 mg', 'Kore ginsengi ekstresi | 40 mg', 'Sitikolin | 30 mg'],
      en: ['# Per 5 ml', 'Ginkgo biloba extract | 375 mg', 'Korean ginseng extract | 20 mg', 'Citicoline | 15 mg', '# Per 10 ml', 'Ginkgo biloba extract | 750 mg', 'Korean ginseng extract | 40 mg', 'Citicoline | 30 mg'],
      ar: ['# لكل 5 مل', 'مستخلص الجنكو بيلوبا | 375 ملغ', 'مستخلص الجنسنغ الكوري | 20 ملغ', 'سيتيكولين | 15 ملغ', '# لكل 10 مل', 'مستخلص الجنكو بيلوبا | 750 ملغ', 'مستخلص الجنسنغ الكوري | 40 ملغ', 'سيتيكولين | 30 ملغ'],
    },
  },
  {
    id: 'prod-11',
    names: {
      ru: 'Оптима Комплекс с Омега-3',
      tr: 'Omega-3 İçeren Optima Kompleks',
      en: 'Optima Complex with Omega-3',
      ar: 'مجمّع أوبتيما مع أوميغا 3',
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
      ru: [
        '| **Активный компонент** | **Состав на 1 таблетку** |',
        '| --- | ---: |',
        '| Рыбий жир | 613 мг |',
        '| └ Омега-3 жирные кислоты | 490 мг |',
        '| └ └ EPA (эйкозапентаеновая кислота) | 245 мг |',
        '| └ └ DHA (докозагексаеновая кислота) | 184 мг |',
        '| Куркумин | 110 мг |',
        '| Коэнзим Q10 | 100 мг |',
        '| Витамин C | 50 мг |',
        '| Цинк | 15 мг |',
        '| Лютеин | 10 мг |',
        '| Астаксантин | 12 мг |',
        '| Зеаксантин | 5 мг |',
        '| Медь | 1000 мкг |',
        '| Селен | 50 мкг |',
        '| Витамин D3 | 5 мкг |',
      ],
      tr: [
        '| **Aktif bileşen** | **1 tablet için içerik** |',
        '| --- | ---: |',
        '| Balık yağı | 613 mg |',
        '| └ Omega-3 yağ asitleri | 490 mg |',
        '| └ └ EPA (eikosapentaenoik asit) | 245 mg |',
        '| └ └ DHA (dokosaheksaenoik asit) | 184 mg |',
        '| Kurkumin | 110 mg |',
        '| Koenzim Q10 | 100 mg |',
        '| C vitamini | 50 mg |',
        '| Çinko | 15 mg |',
        '| Lutein | 10 mg |',
        '| Astaksantin | 12 mg |',
        '| Zeaksantin | 5 mg |',
        '| Bakır | 1000 mcg |',
        '| Selenyum | 50 mcg |',
        '| D3 vitamini | 5 mcg |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 1 tablet** |',
        '| --- | ---: |',
        '| Fish oil | 613 mg |',
        '| └ Omega-3 fatty acids | 490 mg |',
        '| └ └ EPA (eicosapentaenoic acid) | 245 mg |',
        '| └ └ DHA (docosahexaenoic acid) | 184 mg |',
        '| Curcumin | 110 mg |',
        '| Coenzyme Q10 | 100 mg |',
        '| Vitamin C | 50 mg |',
        '| Zinc | 15 mg |',
        '| Lutein | 10 mg |',
        '| Astaxanthin | 12 mg |',
        '| Zeaxanthin | 5 mg |',
        '| Copper | 1000 mcg |',
        '| Selenium | 50 mcg |',
        '| Vitamin D3 | 5 mcg |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات قرص واحد** |',
        '| --- | ---: |',
        '| زيت السمك | 613 ملغ |',
        '| └ أحماض أوميغا 3 الدهنية | 490 ملغ |',
        '| └ └ EPA (حمض الإيكوسابنتاينويك) | 245 ملغ |',
        '| └ └ DHA (حمض الدوكوساهيكسانويك) | 184 ملغ |',
        '| الكركمين | 110 ملغ |',
        '| الإنزيم المساعد Q10 | 100 ملغ |',
        '| فيتامين C | 50 ملغ |',
        '| الزنك | 15 ملغ |',
        '| اللوتين | 10 ملغ |',
        '| أستازانتين | 12 ملغ |',
        '| زياكسانثين | 5 ملغ |',
        '| النحاس | 1000 مكغ |',
        '| السيلينيوم | 50 مكغ |',
        '| فيتامين D3 | 5 مكغ |',
      ],
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
      ru: [
        '| **Активный компонент** | **Состав на 2 жевательные пастилки** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| Витамин C | 40 мг | 50% |',
        '| Витамин E | 12 мг | 100% |',
        '| Витамин B12 | 0,02 мг | 800% |',
        '| Витамин A | 0,12 мг | 15% |',
      ],
      tr: [
        '| **Aktif bileşen** | **2 çiğneme pastili için içerik** | **% günlük ihtiyaç** |',
        '| --- | ---: | ---: |',
        '| C vitamini | 40 mg | %50 |',
        '| E vitamini | 12 mg | %100 |',
        '| B12 vitamini | 0.02 mg | %800 |',
        '| A vitamini | 0.12 mg | %15 |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 2 chewable pastilles** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| Vitamin C | 40 mg | 50% |',
        '| Vitamin E | 12 mg | 100% |',
        '| Vitamin B12 | 0.02 mg | 800% |',
        '| Vitamin A | 0.12 mg | 15% |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات حبتين للمضغ** | **% من الاحتياج اليومي** |',
        '| --- | ---: | ---: |',
        '| فيتامين C | 40 ملغ | 50% |',
        '| فيتامين E | 12 ملغ | 100% |',
        '| فيتامين B12 | 0.02 ملغ | 800% |',
        '| فيتامين A | 0.12 ملغ | 15% |',
      ],
    },
  },
  {
    id: 'prod-1785669452074',
    names: {
      ru: 'Экстракт витекса священного с коэнзимом Q10',
      tr: 'Koenzim Q10 içeren Hayıt Özü',
      en: 'Chasteberry Extract with Coenzyme Q10',
      ar: 'مستخلص تشاستيبيري مع الإنزيم المساعد Q10',
    },
    categoryKey: 'herbs',
    price: 1400,
    image: 'https://fstihxljqljhfyubptsk.supabase.co/storage/v1/object/public/product_image/prod-1785669452074/1785669463531.webp',
    descriptions: {
      ru: 'Hayıt — это витекс священный (Vitex agnus-castus, также известен как «авраамово дерево»).',
      tr: 'Hayıt, İbrahim\'in ağacı olarak da bilinen Vitex agnus-castus\'tur.',
      en: 'Hayıt is Vitex agnus-castus, also known as Abraham\'s tree.',
      ar: 'الحياة هي Vitex agnus-castus، والمعروفة أيضًا باسم شجرة إبراهيم.',
    },
    specs: {
      ru: [
        '| **Активный компонент** | **Состав на 2 капсулы** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| Экстракт витекса священного | 400 мг | — |',
        '| Экстракт кайенского перца | 100 мг | — |',
        '| Коэнзим Q10 | 100 мг | — |',
        '| L-аргинин | 100 мг | — |',
        '| Экстракт корейского женьшеня | 80 мг | — |',
        '| Цинк | 15 мг | 150% |',
        '| Фолиевая кислота | 600 мкг | 300% |',
        '| Селен | 200 мкг | 364% |',
      ],
      tr: [
        '| **Aktif bileşen** | **2 kapsül için içerik** | **% günlük ihtiyaç** |',
        '| --- | ---: | ---: |',
        '| Hayıt özü | 400 mg | — |',
        '| Cayenne biberi özü | 100 mg | — |',
        '| Koenzim Q10 | 100 mg | — |',
        '| L-arginin | 100 mg | — |',
        '| Kore ginsengi özü | 80 mg | — |',
        '| Çinko | 15 mg | %150 |',
        '| Folik asit | 600 mcg | %300 |',
        '| Selenyum | 200 mcg | %364 |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 2 capsules** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| Chasteberry extract | 400 mg | — |',
        '| Cayenne pepper extract | 100 mg | — |',
        '| Coenzyme Q10 | 100 mg | — |',
        '| L-arginine | 100 mg | — |',
        '| Korean ginseng extract | 80 mg | — |',
        '| Zinc | 15 mg | 150% |',
        '| Folic acid | 600 mcg | 300% |',
        '| Selenium | 200 mcg | 364% |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات كبسولتين** | **% من الاحتياج اليومي** |',
        '| --- | ---: | ---: |',
        '| مستخلص تشاستيبيري | 400 ملغ | — |',
        '| مستخلص الفلفل الحار | 100 ملغ | — |',
        '| الإنزيم المساعد Q10 | 100 ملغ | — |',
        '| L-أرجينين | 100 ملغ | — |',
        '| مستخلص الجنسنغ الكوري | 80 ملغ | — |',
        '| الزنك | 15 ملغ | 150% |',
        '| حمض الفوليك | 600 مكغ | 300% |',
        '| السيلينيوم | 200 مكغ | 364% |',
      ],
    },
  },
  {
    id: 'prod-1785672176662',
    names: {
      ru: 'Железо бисглицинат + Витамин C',
      tr: 'Demir bisglisinat + C Vitamini',
      en: 'Iron bisglycinate + Vitamin C',
      ar: 'بيسجليسينات الحديد + فيتامين سي',
    },
    categoryKey: 'supplements',
    price: 3350,
    image: '/images/ironbis_soft.webp',
    descriptions: {
      ru: 'Железо бисглицинат + Витамин C — пищевая добавка, сочетающая железо в форме бисглицината и витамин C. Железо способствует нормальному образованию гемоглобина и эритроцитов, а витамин C улучшает усвоение железа и поддерживает нормальную работу иммунной системы. Подходит для ежедневного восполнения потребности в железе.',
      tr: 'Demir Bisglisinat + C Vitamini, demir bisglisinat ve C vitaminini birleştiren bir besin takviyesidir. Demir, hemoglobin ve kırmızı kan hücrelerinin normal oluşumuna katkıda bulunur ve C vitamini, demirin emilimini artırır ve bağışıklık sisteminin normal işleyişini destekler. Günlük demir ihtiyacının karşılanması için uygundur.',
      en: 'Iron Bisglycinate + Vitamin C is a dietary supplement that combines iron bisglycinate and vitamin C. Iron contributes to the normal formation of hemoglobin and red blood cells, and vitamin C improves the absorption of iron and supports the normal functioning of the immune system.',
      ar: 'بيسجليسينات الحديد + فيتامين سي هو مكمل غذائي يجمع بين بيسجليسينات الحديد وفيتامين سي. يساهم الحديد في التكوين الطبيعي للهيموجلوبين وخلايا الدم الحمراء، ويحسن فيتامين سي امتصاص الحديد ويدعم الأداء الطبيعي لجهاز المناعة. مناسبة للتجديد اليومي لاحتياجات الحديد.',
    },
    specs: {
      ru: [
        '| **Активный компонент** | **Состав на 1 капсулу** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| Витамин C | 100 мг | 125% |',
        '| Железо | 17 мг | 121% |',
      ],
      tr: [
        '| **Aktif bileşen** | **1 kapsül için içerik** | **% günlük ihtiyaç** |',
        '| --- | ---: | ---: |',
        '| C vitamini | 100 mg | %125 |',
        '| Demir | 17 mg | %121 |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 1 capsule** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| Vitamin C | 100 mg | 125% |',
        '| Iron | 17 mg | 121% |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات كبسولة واحدة** | **% من الاحتياج اليومي** |',
        '| --- | ---: | ---: |',
        '| فيتامين C | 100 ملغ | 125% |',
        '| الحديد | 17 ملغ | 121% |',
      ],
    },
  },
];

export type CompositionPart =
  | { type: 'section'; text: string }
  | { type: 'colheader'; cells: string[] }
  | { type: 'row'; cells: string[] }
  | { type: 'note'; text: string }
  | { type: 'sep' };

const cleanCell = (s: string): string =>
  s.trim().replace(/^\*\*\s*/, '').replace(/\s*\*\*$/, '').trim();

export const parseCompositionLine = (line: string): CompositionPart => {
  const trimmed = line.trim();
  if (trimmed.startsWith('~~')) {
    return { type: 'note', text: trimmed.replace(/^~~+\s*/, '').trim() };
  }
  if (trimmed.startsWith('##')) {
    return { type: 'colheader', cells: trimmed.replace(/^##+\s*/, '').split('|').map(cleanCell) };
  }
  if (trimmed.startsWith('#')) {
    return { type: 'section', text: trimmed.replace(/^#+\s*/, '').trim() };
  }
  if (trimmed.startsWith('|') || trimmed.endsWith('|')) {
    const cells = trimmed
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cleanCell)
      .filter(Boolean);
    if (cells.length && cells.every(c => /^:?-+:?$/.test(c))) {
      return { type: 'sep' };
    }
    if (cells.length >= 2) return { type: 'row', cells };
    return { type: 'sep' };
  }
  const parts = line.split('|').map(cleanCell).filter(Boolean);
  if (parts.length >= 2) {
    return { type: 'row', cells: parts };
  }
  if (parts.length === 1) {
    const text = parts[0];
    const m = text.match(/(\d+(?:[\s.,]\d+)?\s*(?:мкг|мг|г|%|ед|мл|л|mcg|mg|g|ml|l|IU|UI|капс|табл|штук|доз|ed|iu|ui|Ед|пастилок|tablet|capsul|drop|sachet|пак|кап))/i);
    if (m) {
      const dosage = m[1].trim();
      const ingredient = text.replace(m[1], '').trim().replace(/^[\s,;:-]+|[\s,;:-]+$/g, '');
      return { type: 'row', cells: [ingredient || text, dosage] };
    }
    return { type: 'row', cells: [text] };
  }
  return { type: 'row', cells: [] };
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
    name: p.names[lang] || p.names.ru,
    categoryKey: p.categoryKey,
    category: categoryLabels[lang][p.categoryKey],
    price: p.price,
    image: p.image,
    description: p.descriptions[lang] || p.descriptions.ru,
    specs: p.specs ? (p.specs[lang] || p.specs.ru) : undefined,
  }));

// Ключи категорий (первый — «все»)
export const categoryKeys: ('all' | CategoryKey)[] = [
  'all',
  ...Array.from(new Set(products.map(p => p.categoryKey))),
];

export const getCategoryLabel = (lang: Lang, key: 'all' | CategoryKey): string =>
  key === 'all' ? categoryLabels[lang].all : categoryLabels[lang][key];
