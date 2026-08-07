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
  notes?: Record<Lang, string>;
  createdAt?: number;
  isNew?: boolean;
  inStock?: boolean;
}

export const STOCK_SPECS_KEY = '_stock';

export const isNewProduct = (p: { isNew?: boolean; createdAt?: number }, days = 7): boolean => {
  if (p.isNew) return true;
  if (!p.createdAt) return false;
  const age = Math.floor(Date.now() / 1000) - p.createdAt;
  return age >= 0 && age <= days * 24 * 60 * 60;
};

export const getInStock = (p: Product): boolean => {
  if (typeof p.inStock === 'boolean') return p.inStock;
  const raw = p.specs?.[STOCK_SPECS_KEY]?.[0];
  return raw !== '0';
};

export const setInStock = (p: Product, inStock: boolean): Product => {
  const specs = { ...(p.specs ?? {}) } as Record<Lang, string[]>;
  if (inStock) delete specs[STOCK_SPECS_KEY as Lang];
  else specs[STOCK_SPECS_KEY as Lang] = ['0'];
  return { ...p, inStock, specs };
};

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
      ru: 'BSO Жевательные мармеладки',
      tr: 'BSO Çiğneme Jölesi',
      en: 'BSO Chewing Gummies',
      ar: 'أقراص بذور السوداء للمضغ',
    },
    categoryKey: 'supplements',
    price: 1800,
    image: '/images/bso.webp',
    descriptions: {
      ru: 'Daruzen BSO Gummy (60 жевательных пастилок) — комплекс с маслом черного тмина (BSO), витамином D3, тимохиноном и цинком для поддержки иммунитета. Способствует укреплению защитных сил организма, общему оздоровлению и повышению жизненного тонуса в удобной форме жевательных мармеладок.',
      tr: 'Siyah kimyon yağı, D3 vitamini ve çinko içeren çiğneme jölesi. Bağışıklığı, kemik ve cilt sağlığını destekler; D vitamini ve çinko eksikliğinin giderilmesine lezzetli bir şekilde yardımcı olur.',
      en: 'Chewing gummies with black seed oil, vitamin D3 and zinc. Support immunity, bone and skin health, and help replenish vitamin D and zinc in a convenient, tasty form.',
      ar: 'أقراص قابلة للمضغ بزيت الحبة السوداء وفيتامين D3 والزنك. تدعم المناعة وصحة العظام والجلد، وتساعد على تعويض نقص فيتامين D والزنك بشكل سهل ولذيذ.',
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
        '| D3 vitamini | 16.67 mcg | 333% |',
        '| Çinko | 16.67 mg | 100% |',
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
    notes: {
      ru: 'Рекомендуется для взрослых и детей с 11 лет.\n\nСпособ применения: принимать по 2 жевательные пастилки (gummies) 1 раз в день.\n\nВажно: не превышайте рекомендуемую суточную дозу. Биологически активная добавка к пище. Не является лекарственным средством. Не может использоваться в качестве замены полноценного и сбалансированного питания. При беременности, в период грудного вскармливания, а также при наличии хронических заболеваний перед применением рекомендуется проконсультироваться с врачом. Хранить в сухом, прохладном месте, недоступном для детей.',
      tr: '11 yaş ve üzeri yetişkinler ve çocuklar için önerilir.\n\nKullanım şekli: Günde 1 kez 2 çiğneme pastili (gummies) alın.\n\nÖnemli: Önerilen günlük dozu aşmayın. Gıda takviyesidir. İlaç değildir. Tam ve dengeli bir beslenmenin yerine kullanılamaz. Hamilelikte, emzirme döneminde ve kronik hastalıklarda kullanmadan önce doktorunuza danışmanız önerilir. Serin ve kuru yerde, çocukların erişemeyeceği yerlerde saklayınız.',
      en: 'Recommended for adults and children aged 11 and over.\n\nDirections for use: Take 2 chewable pastilles (gummies) once a day.\n\nImportant: Do not exceed the recommended daily dose. This is a food supplement. It is not a medicinal product and cannot be used as a substitute for a complete and balanced diet. Consult your doctor before use if you are pregnant, breastfeeding, or have chronic diseases. Store in a dry, cool place out of reach of children.',
      ar: 'يُنصح به للبالغين والأطفال من سن 11 عامًا فما فوق.\n\nطريقة الاستخدام: تناول حبتين للمضغ (gummies) مرة واحدة يوميًا.\n\nهام: لا تتجاوز الجرعة اليومية الموصى بها. هذا مكمل غذائي وليس دواءً. لا يمكن استخدامه كبديل عن التغذية الكاملة والمتوازنة. يُنصح باستشارة الطبيب قبل الاستخدام أثناء الحمل والرضاعة وعند وجود أمراض مزمنة. يُخزن في مكان جاف وبارد بعيدًا عن متناول الأطفال.',
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
      ru: 'Высококачественный источник омега-3 жирных кислот (EPA — 600 мг, DHA — 400 мг), полученных из норвежской рыбы. Способствует поддержанию здоровья сердца, мозга и зрения, укреплению иммунной системы, улучшению памяти и концентрации, а также помогает поддерживать общий тонус и хорошее самочувствие.',
      tr: 'İki kapsülde 1000 mg Omega-3 (600 mg EPA, 400 mg DHA) içeren yüksek saflıkta balık yağı. Kalp, beyin ve göz sağlığını destekler, trigliserit seviyesinin normal kalmasına yardımcı olur.',
      en: 'High-purity fish oil providing 1000 mg of Omega-3 per two capsules (600 mg EPA, 400 mg DHA). Supports heart, brain and eye health and helps maintain normal triglyceride levels.',
      ar: 'زيت سمك فائق النقاء يوفر 1000 ملغ من أوميغا 3 في كبسولتين (600 ملغ EPA، 400 ملغ DHA). يدعم صحة القلب والدماغ والعينين ويساعد في الحفاظ على مستويات طبيعية من الدهون الثلاثية.',
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
    notes: {
      ru: 'Рекомендуемая суточная доза: взрослым в возрасте 11 лет и старше рекомендуется принимать по 1 капсуле утром и 1 капсуле вечером (два раза в день) после еды, запивая большим количеством воды.\n\nУсловия хранения: хранить в прохладном, сухом месте, вдали от солнечных лучей и в недоступном для детей месте, плотно закрыв крышку.\n\nНЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ! Не используется для профилактики или лечения заболеваний. Проконсультируйтесь с врачом, если вы беременны, кормите грудью, имеете какое-либо заболевание или принимаете лекарства.',
      tr: 'Günlük önerilen doz: 11 yaş ve üzeri yetişkinlerin sabah 1 kapsül ve akşam 1 kapsül (günde iki kez) yemeklerden sonra bol miktarda su ile alması önerilir.\n\nSaklama koşulları: Serin ve kuru bir yerde, güneş ışığından uzakta ve çocukların erişemeyeceği bir yerde, kapağı sıkıca kapatılmış olarak saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR! Hastalıkların önlenmesi veya tedavisi için kullanılmaz. Hamileyseniz, emziriyorsanız, herhangi bir hastalığınız varsa veya ilaç kullanıyorsanız doktorunuza danışınız.',
      en: 'Recommended daily dose: For adults aged 11 and over, take 1 capsule in the morning and 1 capsule in the evening (twice a day) after meals, with plenty of water.\n\nStorage conditions: Store in a cool, dry place, away from sunlight and out of reach of children, with the lid tightly closed.\n\nTHIS IS NOT A MEDICINAL PRODUCT! It is not used for the prevention or treatment of diseases. Consult your doctor if you are pregnant, breastfeeding, have any disease, or are taking medication.',
      ar: 'الجرعة اليومية الموصى بها: بالنسبة للبالغين الذين تبلغ أعمارهم 11 عامًا وما فوق، يُنصح بتناول كبسولة واحدة في الصباح وكبسولة واحدة في المساء (مرتين يوميًا) بعد الوجبات، مع الكثير من الماء.\n\nظروف التخزين: يُخزن في مكان بارد وجاف، بعيدًا عن أشعة الشمس وبعيدًا عن متناول الأطفال، مع إغلاق الغطاء بإحكام.\n\nهذا ليس منتجًا طبيًا! لا يُستخدم للوقاية من الأمراض أو علاجها. استشر طبيبك إذا كنت حاملاً أو ترضعين أو تعاني من أي مرض أو تتناول أدوية.',
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
      ru: 'Daruzen ACV Gummy (60 жевательных пастилок) — комплекс с яблочным уксусом, фолиевой кислотой, витамином B12 и экстрактом граната для детоксикации и контроля веса. Способствует улучшению пищеварения, обмена веществ, повышению энергии и общему оздоровлению организма.',
      tr: 'Elma sirkesi, pancar, nar ekstresi ve B9-B12 vitaminleri içeren çiğneme jölesi. Metabolizmayı, sindirimi ve vücudun doğal detoks süreçlerini destekler.',
      en: 'Chewing gummies with apple cider vinegar, beetroot, pomegranate extract and vitamins B9 and B12. Support metabolism, digestion and natural detoxification of the body.',
      ar: 'أقراص قابلة للمضغ تحتوي على خل التفاح والشمندر ومستخلص الرمان وفيتاميني B9 وB12. تدعم الأيض والهضم وعمليات إزالة السموم الطبيعية من الجسم.',
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
        '| **Pancar tozu** | 12 mg | 100% |',
        '| **Nar ekstresi** | 50 mg | — |',
        '| **Folik asit (B9 vitamini)** | 50 mcg | — |',
        '| **Siyanokobalamin (B12 vitamini)** | 10 mcg | 100% |',
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
    notes: {
      ru: 'Рекомендуется для взрослых и детей с 11 лет.\n\nСпособ применения: принимать по 2 жевательные пастилки (gummies) 1 раз в день.\n\nВажно: не превышайте рекомендуемую суточную дозу. Биологически активная добавка к пище. Не является лекарственным средством. Не может использоваться в качестве замены полноценного и сбалансированного питания. При беременности, в период грудного вскармливания, а также при наличии хронических заболеваний перед применением рекомендуется проконсультироваться с врачом. Хранить в сухом, прохладном месте, недоступном для детей.',
      tr: '11 yaş ve üzeri yetişkinler ve çocuklar için önerilir.\n\nKullanım şekli: Günde 1 kez 2 çiğneme pastili (gummies) alın.\n\nÖnemli: Önerilen günlük dozu aşmayın. Gıda takviyesidir. İlaç değildir. Tam ve dengeli bir beslenmenin yerine kullanılamaz. Hamilelikte, emzirme döneminde ve kronik hastalıklarda kullanmadan önce doktorunuza danışmanız önerilir. Serin ve kuru yerde, çocukların erişemeyeceği yerlerde saklayınız.',
      en: 'Recommended for adults and children aged 11 and over.\n\nDirections for use: Take 2 chewable pastilles (gummies) once a day.\n\nImportant: Do not exceed the recommended daily dose. This is a food supplement. It is not a medicinal product and cannot be used as a substitute for a complete and balanced diet. Consult your doctor before use if you are pregnant, breastfeeding, or have chronic diseases. Store in a dry, cool place out of reach of children.',
      ar: 'يُنصح به للبالغين والأطفال من سن 11 عامًا فما فوق.\n\nطريقة الاستخدام: تناول حبتين للمضغ (gummies) مرة واحدة يوميًا.\n\nهام: لا تتجاوز الجرعة اليومية الموصى بها. هذا مكمل غذائي وليس دواءً. لا يمكن استخدامه كبديل عن التغذية الكاملة والمتوازنة. يُنصح باستشارة الطبيب قبل الاستخدام أثناء الحمل والرضاعة وعند وجود أمراض مزمنة. يُخزن في مكان جاف وبارد بعيدًا عن متناول الأطفال.',
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
      ru: 'Магний Complex 4 + Витамин B6 — сочетает четыре высокоусвояемые формы магния для поддержки нервной системы, мышц и сердца. Способствует снижению усталости, улучшению качества сна, уменьшению мышечных спазмов и поддержанию эмоционального баланса.',
      tr: 'Dört kolay emilen magnezyum formu (asetiltaurat, bisglisinat, malat ve sitrat) ve B6 vitamini. Kas ve sinir sisteminin normal işleyişini destekler, rahatlamaya yardımcı olur ve uyku kalitesini artırır.',
      en: 'Four highly absorbable forms of magnesium (acetyltaurate, bisglycinate, malate and citrate) with vitamin B6. Supports normal muscle and nervous system function, promotes relaxation and improves sleep quality.',
      ar: 'أربع صور سريعة الامتصاص من المغنيسيوم (أسيتيل تورات، بيسغليسينات، مالات وسيترات) مع فيتامين B6. يدعم الوظيفة الطبيعية للعضلات والجهاز العصبي، ويساعد على الاسترخاء ويحسّن جودة النوم.',
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
        '| **Magnezyum (toplam)** | 125 mg | 250 mg | **67%** |',
        '| └ Magnezyum asetiltaurat | 33.005 mg | 66.010 mg | — |',
        '| └ Magnezyum bisglisinat | 49.65 mg | 99.3 mg | — |',
        '| └ Magnezyum malat | 34.5 mg | 69 mg | — |',
        '| └ Magnezyum sitrat | 7.845 mg | 15.69 mg | — |',
        '| **B6 vitamini** | 2 mg | 4 mg | **286%** |',
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
        '| **مغنيسيوم (إجمالي)** | 125 ملغ | 250 ملغ | **67%** |',
        '| └ ماغنيسيوم أسيتيل تورات | 33.005 ملغ | 66.010 ملغ | — |',
        '| └ مغنيسيوم بيسغليسينات | 49.65 ملغ | 99.3 ملغ | — |',
        '| └ مغنيسيوم مالات | 34.5 ملغ | 69 ملغ | — |',
        '| └ سترات المغنيسيوم | 7.845 ملغ | 15.69 ملغ | — |',
        '| **فيتامين B6** | 2 ملغ | 4 ملغ | **286%** |',
        '~~يُحسب BRD لقرصين. لم يتم تحديد الكمية اليومية الموصى بها للأشكال الفردية من المغنيسيوم.',
      ],
    },
    notes: {
      ru: 'Рекомендуемая суточная доза: взрослым в возрасте 11 лет и старше рекомендуется принимать по 2 таблетки один раз в день, запивая большим количеством воды.\n\nУсловия хранения: хранить в прохладном, сухом месте, вдали от солнечных лучей и в недоступном для детей месте, плотно закрыв крышку.\n\nНЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ! Не используется для профилактики или лечения заболеваний. Проконсультируйтесь с врачом, если вы беременны, кормите грудью, имеете какое-либо заболевание или принимаете лекарства.',
      tr: 'Günlük önerilen doz: 11 yaş ve üzeri yetişkinlerin günde bir kez 2 tablet, bol miktarda su ile alması önerilir.\n\nSaklama koşulları: Serin ve kuru bir yerde, güneş ışığından uzakta ve çocukların erişemeyeceği bir yerde, kapağı sıkıca kapatılmış olarak saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR! Hastalıkların önlenmesi veya tedavisi için kullanılmaz. Hamileyseniz, emziriyorsanız, herhangi bir hastalığınız varsa veya ilaç kullanıyorsanız doktorunuza danışınız.',
      en: 'Recommended daily dose: Adults aged 11 and over are recommended to take 2 tablets once a day, with plenty of water.\n\nStorage conditions: Store in a cool, dry place, away from sunlight and out of reach of children, with the lid tightly closed.\n\nTHIS IS NOT A MEDICINAL PRODUCT! It is not used for the prevention or treatment of diseases. Consult your doctor if you are pregnant, breastfeeding, have any disease, or are taking medication.',
      ar: 'الجرعة اليومية الموصى بها: يُنصح البالغون الذين تبلغ أعمارهم 11 عامًا وما فوق بتناول قرصين مرة واحدة يوميًا مع الكثير من الماء.\n\nظروف التخزين: يُخزن في مكان بارد وجاف، بعيدًا عن أشعة الشمس وبعيدًا عن متناول الأطفال، مع إغلاق الغطاء بإحكام.\n\nهذا ليس منتجًا طبيًا! لا يُستخدم للوقاية من الأمراض أو علاجها. استشر طبيبك إذا كنت حاملاً أو ترضعين أو تعاني من أي مرض أو تتناول أدوية.',
    },
  },
  {
    id: 'prod-5',
    names: {
      ru: 'DNL — Антистресс фитокомплекс',
      tr: 'DNL — Anti-stres Bitkisel Kompleks',
      en: 'DNL — Anti-Stress Phyto Complex',
      ar: 'DNL — المركب النباتي المضاد للإجهاد',
    },
    categoryKey: 'supplements',
    price: 2200,
    image: '/images/dnl__.webp',
    descriptions: {
      ru: 'Комплекс растительных экстрактов (включая лаванду, базилик, боярышник и др.) помогает организму справляться с повседневным стрессом и нервным напряжением. Способствует расслаблению, улучшению эмоционального состояния и поддержанию общего тонуса нервной системы.',
      tr: 'Alıç, kereviz, kedi pençesi, fesleğen, lavanta, hibiskus ve diğerleri olmak üzere 11 bitkisel bileşenden oluşan kompleks. Sinir gerginliğini azaltmaya yardımcı olur, duygusal dengeyi ve sakin uykuyu destekler.',
      en: 'A phyto-complex of 11 plant ingredients including hawthorn, celery, cat\'s claw, basil, lavender and hibiscus. Helps reduce nervous tension, supports emotional balance and restful sleep.',
      ar: 'مركب نباتي من 11 مكونًا نباتيًا منها الزعرور والكرفس ومخلب القط والريحان والخزامى والكركديه. يساعد على تخفيف التوتر العصبي ويدعم التوازن العاطفي والنوم الهادئ.',
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
    notes: {
      ru: 'Рекомендуемая суточная дозировка: Взрослым в возрасте 11 лет и старше рекомендуется принимать по 1 капсуле два раза в день, утром и вечером, после еды, запивая большим количеством воды.\n\nУсловия хранения: Хранить в прохладном, сухом месте, вдали от солнечных лучей, с плотно закрытой крышкой и в недоступном для детей месте.\n\nЭТО НЕ ЛЕКАРСТВЕННОЕ СРЕДСТВО! Оно не используется для профилактики или лечения заболеваний. Проконсультируйтесь с врачом, если вы беременны, кормите грудью, имеете какое-либо заболевание или принимаете лекарства.',
      tr: 'Günlük önerilen doz: 11 yaş ve üzeri yetişkinler için günde 2 kapsül, sabah ve akşam, yemekten sonra, bol miktarda su ile birlikte alınmalıdır.\n\nSaklama koşulları: Serin, kuru bir yerde, güneş ışığından uzakta, sıkı kapatılmış bir kapakla ve çocukların erişemediği bir yerde saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR! Hastalıkların önlenmesi veya tedavisi için kullanılmaz. Hamileyseniz, emziriyorsanız, herhangi bir hastalığınız varsa veya ilaç kullanıyorsanız doktorunuza danışın.',
      en: 'Recommended daily dose: For adults aged 11 and over, take 1 capsule twice a day, in the morning and evening, after meals, with plenty of water.\n\nStorage conditions: Store in a cool, dry place, away from sunlight, with a tightly closed lid and out of reach of children.\n\nTHIS IS NOT A MEDICINAL PRODUCT! It is not used for the prevention or treatment of diseases. Consult your doctor if you are pregnant, breastfeeding, have any disease, or are taking medication.',
      ar: 'الجرعة اليومية الموصى بها: بالنسبة للبالغين الذين تبلغ أعمارهم 11 عامًا وما فوق، يُنصح بأخذ كبسولة مرتين يوميًا، في الصباح والمساء، بعد الوجبات، مع شربة كمية كبيرة من الماء.\n\nظروف التخزين: يتم التخزين في مكان بارد وجاف، بعيدًا عن أشعة الشمس، مع غطاء مغلق تمامًا وفي مكان غير قابل للوصول إلى الأطفال.\n\nهذا ليس منتجًا طبيًا! لا يتم استخدامه لمنع أو علاج الأمراض. استشر طبيبك إذا كنت حاملاً، ترضيح الأطفال، تعاني من أي مرض، أو تتناول أدوية.',
    },
  },
  {
    id: 'prod-6',
    names: {
      ru: 'Цинк Комплекс',
      tr: 'Çinko Kompleks',
      en: 'Zinc Complex',
      ar: 'مركب الزنك',
    },
    categoryKey: 'minerals',
    price: 1100,
    image: '/images/zincpng.webp',
    descriptions: {
      ru: 'Цинк + Медь + Селен — комплекс для поддержки иммунной системы, антиоксидантной защиты и общего здоровья организма. Способствует поддержанию здоровья кожи, волос и ногтей, а также нормальной работе щитовидной железы и репродуктивной функции.',
      tr: 'Çinko, bakır ve selenyum kompleksi. Çinko bağışıklığı, cilt, saç ve tırnak sağlığını destekler; selenyum ve bakır hücreleri oksidatif strese karşı korur.',
      en: 'A complex of zinc, copper and selenium. Zinc supports immunity and the health of skin, hair and nails, while selenium and copper protect cells from oxidative stress.',
      ar: 'مركب من الزنك والنحاس والسيلينيوم. يدعم الزنك المناعة وصحة الجلد والشعر والأظافر، بينما يحمي السيلينيوم والنحاس الخلايا من الإجهاد التأكسدي.',
    },
    specs: {
      ru: ['Цинк | 15 мг', 'Медь | 2000 мг', 'Селен | 55 мг'],
      tr: [
        '| **Aktif Bileşen** | **Miktar (1 Kapsül)** |',
        '| --- | ---: |',
        '| Çinko | 15 mg |',
        '| Bakır | 2000 mg |',
        '| Selenyum | 55 mg |',
      ],
      en: ['Zinc | 15 mg', 'Copper | 2000 mg', 'Selenium | 55 mg'],
      ar: ['زنك | 15 ملغ', 'نحاس | 2000 ملغ', 'سيلينيوم | 55 ملغ'],
    },
    notes: {
      ru: 'Рекомендуемая суточная доза: взрослым от 11 лет и старше рекомендуется принимать по 1 капсуле один раз в день, запивая большим количеством воды.\n\nПринимайте через один час после завтрака.\n\nУсловия хранения: хранить в прохладном, сухом месте, вдали от солнечных лучей и в недоступном для детей месте, плотно закрыв крышку.\n\nНЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ! Не используется для профилактики или лечения заболеваний. Проконсультируйтесь с врачом, если вы беременны, кормите грудью, имеете какое-либо заболевание или принимаете лекарства.',
      tr: 'Günlük önerilen doz: 11 yaş ve üzeri yetişkinlerin günde 1 kapsül, bol miktarda su ile alması önerilir.\n\nSaklama koşulları: Serin ve kuru bir yerde, güneş ışığından uzakta ve çocukların erişemeyeceği bir yerde, kapağı sıkıca kapatılmış olarak saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR! Hastalıkların önlenmesi veya tedavisi için kullanılmaz. Hamileyseniz, emziriyorsanız, herhangi bir hastalığınız varsa veya ilaç kullanıyorsanız doktorunuza danışınız.',
      en: 'Recommended daily dose: Adults aged 11 and over are recommended to take 1 capsule once a day, with plenty of water.\n\nStorage conditions: Store in a cool, dry place, away from sunlight and out of reach of children, with the lid tightly closed.\n\nTHIS IS NOT A MEDICINAL PRODUCT! It is not used for the prevention or treatment of diseases. Consult your doctor if you are pregnant, breastfeeding, have any disease, or are taking medication.',
      ar: 'الجرعة اليومية الموصى بها: يُنصح البالغون الذين تبلغ أعمارهم 11 عامًا وما فوق بتناول كبسولة واحدة مرة واحدة يوميًا مع الكثير من الماء.\n\nظروف التخزين: يُخزن في مكان بارد وجاف، بعيدًا عن أشعة الشمس وبعيدًا عن متناول الأطفال، مع إغلاق الغطاء بإحكام.\n\nهذا ليس منتجًا طبيًا! لا يُستخدم للوقاية من الأمراض أو علاجها. استشر طبيبك إذا كنت حاملاً أو ترضعين أو تعاني من أي مرض أو تتناول أدوية.',
    },
  },
  {
    id: 'prod-7',
    names: {
      ru: 'Enginar',
      tr: 'Enginar',
      en: 'Enginar',
      ar: 'Enginar',
    },
    categoryKey: 'supplements',
    price: 2100,
    image: '/images/enginar__.webp',
    descriptions: {
      ru: 'ENGINAR — натуральный комплекс с экстрактами артишока, расторопши и одуванчика для ежедневной поддержки печени и пищеварительной системы. Способствует нормальному оттоку желчи, поддерживает естественные процессы очищения организма и помогает сохранить здоровье печени. Содержит 60 капсул и подходит для регулярного применения в рамках сбалансированного рациона.',
      tr: 'Enginar, devedikeni ve karahindiba ekstrelerinden oluşan doğal kompleks. Karaciğer fonksiyonunu, safra atılımını ve sindirimi destekler, vücudun yumuşak detoksuna katkı sağlar.',
      en: 'A natural complex of artichoke, milk thistle and dandelion extracts. Supports liver function, bile flow and digestion, and contributes to gentle detoxification of the body.',
      ar: 'مركب طبيعي من مستخلصات الخرشوف وشوك الحليب والهندباء. يدعم وظائف الكبد وتدفق الصفراء والهضم، ويساهم في إزالة السموم بلطف.',
    },
    specs: {
      ru: [
        '| **Активный компонент** | **Состав на 2 капсулы** |',
        '| --- | ---: |',
        '| **Экстракт расторопши** | 500 мг |',
        '| **Экстракт артишока** | 300 мг |',
        '| **Экстракт одуванчика** | 120 мг |',
      ],
      tr: [
        '| **Aktif bileşen** | **2 kapsül için içerik** |',
        '| --- | ---: |',
        '| **Devedikeni ekstresi** | 500 mg |',
        '| **Enginar ekstresi** | 300 mg |',
        '| **Karahindiba ekstresi** | 120 mg |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 2 capsules** |',
        '| --- | ---: |',
        '| **Milk thistle extract** | 500 mg |',
        '| **Artichoke extract** | 300 mg |',
        '| **Dandelion extract** | 120 mg |',
      ],
      ar: [
        '| **المكون النشط** | **مكونات كبسولتين** |',
        '| --- | ---: |',
        '| **مستخلص شوك الحليب** | 500 ملغ |',
        '| **مستخلص الخرشوف** | 300 ملغ |',
        '| **مستخلص الهندباء** | 120 ملغ |',
      ],
    },
    notes: {
      ru: 'Рекомендуемая суточная доза: взрослым от 11 лет и старше рекомендуется принимать по 1 капсуле два раза в день, утром и вечером.\n\nУсловия хранения: хранить в прохладном, сухом месте, вдали от солнечных лучей и недоступном для детей месте, плотно закрыв крышку.\n\nНЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ! Не используется для профилактики или лечения заболеваний. Проконсультируйтесь с врачом, если вы беременны, кормите грудью, имеете какое-либо заболевание или принимаете лекарства.',
      tr: 'Günlük önerilen doz: 11 yaş ve üzeri yetişkinlerin sabah ve akşam olmak üzere günde 2 kez 1 kapsül alması önerilir.\n\nSaklama koşulları: Serin ve kuru bir yerde, güneş ışığından uzakta, çocukların erişemeyeceği bir yerde, kapağı sıkıca kapatılmış olarak saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR! Hastalıkların önlenmesi veya tedavisi için kullanılmaz. Hamileyseniz, emziriyorsanız, herhangi bir hastalığınız varsa veya ilaç kullanıyorsanız doktorunuza danışınız.',
      en: 'Recommended daily dose: Adults aged 11 and over are recommended to take 1 capsule twice a day, in the morning and in the evening.\n\nStorage conditions: Store in a cool, dry place, away from sunlight and out of reach of children, with the lid tightly closed.\n\nTHIS IS NOT A MEDICINAL PRODUCT! It is not used for the prevention or treatment of diseases. Consult your doctor if you are pregnant, breastfeeding, have any disease, or are taking medication.',
      ar: 'الجرعة اليومية الموصى بها: يُنصح البالغون الذين تبلغ أعمارهم 11 عامًا وما فوق بتناول كبسولة واحدة مرتين يوميًا، صباحًا ومساءً.\n\nظروف التخزين: يُخزن في مكان بارد وجاف، بعيدًا عن أشعة الشمس وبعيدًا عن متناول الأطفال، مع إغلاق الغطاء بإحكام.\n\nهذا ليس منتجًا طبيًا! لا يُستخدم للوقاية من الأمراض أو علاجها. استشر طبيبك إذا كنت حاملاً أو ترضعين أو تعاني من أي مرض أو تتناول أدوية.',
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
      ru: 'Daruzen NADH Gummy (60 жевательных пастилок) — мощный антивозрастной комплекс в форме жевательных мармеладок с ежевичным вкусом. Содержит NADH, коэнзим Q10, глутатион и ресвератрол для повышения энергии, улучшения работы мозга и поддержки клеточного здоровья.',
      tr: 'Glutatyon, resveratrol, koenzim Q10 ve NADH ile B6-B12 vitaminlerinden oluşan güçlü antioksidan kompleks. Hücreleri serbest radikallere karşı korur, enerjiyi ve gençliği destekler.',
      en: 'A powerful antioxidant complex of glutathione, resveratrol, coenzyme Q10 and NADH with vitamins B6 and B12. Protects cells from free radicals, supports energy and youthful vitality.',
      ar: 'مركب مضاد للأكسدة قوي من الجلوتاثيون والريسفيراترول والإنزيم المساعد Q10 وNADH مع فيتاميني B6 وB12. يحمي الخلايا من الجذور الحرة ويدعم الطاقة والحيوية.',
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
        '| Piridoksin hidroklorür (B6 vitamini) | 1,4 mg | 100% |',
        '| Siyanokobalamin (B12 vitamini) | 2,50 mcg | 100% |',
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
    notes: {
      ru: 'Не является лекарственным средством.\n\nБиологически активная добавка к пище (БАД).\n\nНе превышайте рекомендуемую суточную дозировку.\n\nБиологически активные добавки не заменяют полноценное и сбалансированное питание.\n\nНе рекомендуется детям до 11 лет.\n\nБеременным и кормящим женщинам, а также лицам с хроническими заболеваниями перед применением рекомендуется проконсультироваться с врачом.\n\nПри индивидуальной непереносимости компонентов применение следует прекратить.\n\nУсловия хранения: Хранить в сухом, прохладном месте при температуре до 25 °C, вдали от прямых солнечных лучей и в недоступном для детей месте.\n\nНа упаковке также указано способ применения: Взрослым и детям старше 11 лет принимать по 2 жевательные пастилки (gummies) в день.',
      tr: 'İlaç değildir.\n\nBir gıda takviyesidir (besin desteği).\n\nÖnerilen günlük dozu aşmayın.\n\nBesin takviyeleri, yeterli ve dengeli beslenmenin yerine geçmez.\n\n11 yaşından küçük çocuklara önerilmez.\n\nHamileler, emziren kadınlar ve kronik hastalığı olan kişilerin kullanmadan önce doktora danışması önerilir.\n\nBileşenlere karşı bireysel intolerans durumunda kullanımı bırakın.\n\nSaklama koşulları: 25 °C\'yi aşmayan serin ve kuru bir yerde, doğrudan güneş ışığından uzakta ve çocukların erişemeyeceği bir yerde saklayın.\n\nGünlük önerilen doz: 11 yaş üzeri yetişkinler ve çocuklar günde 2 çiğneme pastili (gummies) almalıdır.',
      en: 'It is not a medicine.\n\nIt is a food supplement (dietary supplement).\n\nDo not exceed the recommended daily dose.\n\nDietary supplements do not replace a complete and balanced diet.\n\nNot recommended for children under 11 years of age.\n\nPregnant and breastfeeding women, as well as persons with chronic diseases, are advised to consult a doctor before use.\n\nIn case of individual intolerance to the components, stop use.\n\nStorage conditions: Store in a dry, cool place at a temperature of up to 25 °C, away from direct sunlight and out of reach of children.\n\nRecommended daily dose: Adults and children over 11 should take 2 chewable pastilles (gummies) per day.',
      ar: 'ليس دواءً.\n\nإنه مكمل غذائي.\n\nلا تتجاوز الجرعة اليومية الموصى بها.\n\nلا تحل المكملات الغذائية محل نظام غذائي كامل ومتوازن.\n\nلا يُنصح به للأطفال دون سن 11 عامًا.\n\nيُنصح النساء الحوامل والمرضعات والأشخاص المصابين بأمراض مزمنة باستشارة الطبيب قبل الاستخدام.\n\nفي حالة عدم تحمل المكونات بشكل فردي، يجب التوقف عن الاستخدام.\n\nظروف التخزين: يُخزن في مكان جاف وبارد عند درجة حرارة تصل إلى 25 درجة مئوية، بعيدًا عن أشعة الشمس المباشرة وبعيدًا عن متناول الأطفال.\n\nالجرعة اليومية الموصى بها: يجب أن يتناول البالغون والأطفال فوق 11 عامًا حبتين من أقراص المضغ (gummies) يوميًا.',
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
      ru: 'Комплекс экстракта джимнемы (500 мг) и хрома разработан для снижения тяги к сладкому и контроля уровня сахара в крови. Способствует нормализации обмена веществ, снижению аппетита и эффективному контролю веса при похудении.',
      tr: 'Krom içeren gymnema ekstresi. Kan şekerinin normal seviyede kalmasına yardımcı olur, karbonhidrat metabolizmasına katkı sağlar ve tatlı isteğini azaltır.',
      en: 'Gymnema extract with chromium. Helps maintain normal blood sugar levels, supports carbohydrate metabolism and reduces sugar cravings.',
      ar: 'مستخلص جيمنيما مع الكروم. يساعد في الحفاظ على مستويات طبيعية من سكر الدم، ويدعم أيض الكربوهيدرات ويقلل الرغبة في تناول السكريات.',
    },
    specs: {
      ru: [
        '| **Активный компонент** | **Состав на 1 таблетку** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| **Экстракт джимнемы** | 500 мг | — |',
        '| **Хром** | 65 мкг | 162,5% |',
      ],
      tr: [
        '| **Aktif Bileşen** | **Miktar (1 Tablet)** | **%BRD** |',
        '| --- | ---: | ---: |',
        '| **Gimneya Ekstresi** | 500 mg | — |',
        '| **Krom** | 65 mcg | 162.5% |',
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
    notes: {
      ru: 'Рекомендуемая суточная доза: Взрослым в возрасте 11 лет и старше рекомендуется принимать по 1 таблетке утром, 1 в полдень и 1 вечером (3 таблетки в день).\n\nУсловия хранения: Хранить в прохладном, сухом месте при температуре ниже 25 градусов Цельсия, вдали от солнечных лучей и в недоступном для детей месте, плотно закрыв крышку.\n\nЭТО НЕ ЛЕКАРСТВЕННОЕ СРЕДСТВО! Оно не используется для профилактики или лечения заболеваний. Проконсультируйтесь с врачом, если вы беременны, кормите грудью, имеете какое-либо заболевание или принимаете лекарства.',
      tr: 'Günlük önerilen doz: 11 yaş ve üzeri yetişkinlerin sabah 1, öğlen 1 ve akşam 1 tablet olmak üzere günde 3 tablet alması önerilir.\n\nSaklama koşulları: 25 santigrat derecenin altındaki serin ve kuru bir yerde, güneş ışığından uzakta ve çocukların erişemeyeceği bir yerde, kapağı sıkıca kapatılmış olarak saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR! Hastalıkların önlenmesi veya tedavisi için kullanılmaz. Hamileyseniz, emziriyorsanız, herhangi bir hastalığınız varsa veya ilaç kullanıyorsanız doktorunuza danışınız.',
      en: 'Recommended daily dose: Adults aged 11 and over are recommended to take 1 tablet in the morning, 1 at noon and 1 in the evening (3 tablets per day).\n\nStorage conditions: Store in a cool, dry place at a temperature below 25 degrees Celsius, away from sunlight and out of reach of children, with the lid tightly closed.\n\nTHIS IS NOT A MEDICINAL PRODUCT! It is not used for the prevention or treatment of diseases. Consult your doctor if you are pregnant, breastfeeding, have any disease, or are taking medication.',
      ar: 'الجرعة اليومية الموصى بها: يُنصح البالغون الذين تبلغ أعمارهم 11 عامًا وما فوق بتناول قرص واحد صباحًا وقرص واحد ظهرًا وقرص واحد مساءً (3 أقراص يوميًا).\n\nظروف التخزين: يُخزن في مكان بارد وجاف عند درجة حرارة أقل من 25 درجة مئوية، بعيدًا عن أشعة الشمس وبعيدًا عن متناول الأطفال، مع إغلاق الغطاء بإحكام.\n\nهذا ليس منتجًا طبيًا! لا يُستخدم للوقاية من الأمراض أو علاجها. استشر طبيبك إذا كنت حاملاً أو ترضعين أو تعاني من أي مرض أو تتناول أدوية.',
    },
  },
  {
    id: 'prod-10',
    names: {
      ru: 'Комплекс с гинкго билоба, женьшенем и цитиколином',
      tr: 'Ginkgo biloba, ginseng ve sitikolin kompleksi',
      en: 'Complex with Ginkgo biloba, ginseng and citicoline',
      ar: 'مركب يحتوي على الجنكو بيلوبا والجنسنغ والسيتيكولين',
    },
    categoryKey: 'herbs',
    price: 2300,
    image: '/images/ginko_ginseng.webp',
    descriptions: {
      ru: 'Гинкго билоба, женьшень и цитиколин — комплекс для поддержки памяти, концентрации внимания и когнитивных функций. Способствует улучшению мозгового кровообращения, повышению умственной работоспособности, энергии и снижению умственной усталости.',
      tr: 'Ginkgo biloba, Kore ginsengi ve sitikolin içeren sıvı kompleks. Hafızayı, konsantrasyonu ve beyin dolaşımını geliştirir, zihinsel performansı destekler.',
      en: 'A liquid complex of ginkgo biloba, Korean ginseng and citicoline. Improves memory, concentration and cerebral circulation, and supports mental performance.',
      ar: 'مركب سائل من الجنكو بيلوبا والجنسنغ الكوري والسيتيكولين. يحسّن الذاكرة والتركيز والدورة الدموية الدماغية ويدعم الأداء الذهني.',
    },
    specs: {
      ru: ['# На 5 мл', 'Экстракт гинкго билоба | 375 мг', 'Экстракт корейского женьшеня | 20 мг', 'Цитиколин | 15 мг', '# На 10 мл', 'Экстракт гинкго билоба | 750 мг', 'Экстракт корейского женьшеня | 40 мг', 'Цитиколин | 30 мг'],
      tr: ['# 5 ml başına', 'Ginkgo biloba ekstresi | 375 mg', 'Kore ginsengi ekstresi | 20 mg', 'Sitikolin | 15 mg', '# 10 ml başına', 'Ginkgo biloba ekstresi | 750 mg', 'Kore ginsengi ekstresi | 40 mg', 'Sitikolin | 30 mg'],
      en: ['# Per 5 ml', 'Ginkgo biloba extract | 375 mg', 'Korean ginseng extract | 20 mg', 'Citicoline | 15 mg', '# Per 10 ml', 'Ginkgo biloba extract | 750 mg', 'Korean ginseng extract | 40 mg', 'Citicoline | 30 mg'],
      ar: ['# لكل 5 مل', 'مستخلص الجنكو بيلوبا | 375 ملغ', 'مستخلص الجنسنغ الكوري | 20 ملغ', 'سيتيكولين | 15 ملغ', '# لكل 10 مل', 'مستخلص الجنكو بيلوبا | 750 ملغ', 'مستخلص الجنسنغ الكوري | 40 ملغ', 'سيتيكولين | 30 ملغ'],
    },
    notes: {
      ru: 'Рекомендуемая суточная доза: Детям в возрасте от 4 до 10 лет рекомендуется принимать 1 мерную ложку (5 мл) в день, а взрослым старше 11 лет — 2 мерные ложки (10 мл) в день.\n\nУсловия хранения: Хранить в прохладном, сухом месте, вдали от солнечных лучей, с плотно закрытой крышкой и в недоступном для детей месте.\n\nНЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ! Не используется для профилактики или лечения заболеваний. Не применять во время беременности, кормления грудью, а также при наличии заболеваний или приеме лекарств. В этом случае проконсультируйтесь с врачом.',
      tr: 'Günlük önerilen doz: 4 ila 10 yaş arası çocukların günde 1 ölçek (5 ml) alması, 11 yaş üzeri yetişkinlerin ise günde 2 ölçek (10 ml) alması önerilir.\n\nSaklama koşulları: Serin ve kuru bir yerde, güneş ışığından uzakta, kapağı sıkıca kapatılmış ve çocukların erişemeyeceği bir yerde saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR! Hastalıkların önlenmesi veya tedavisi için kullanılmaz. Hamilelik, emzirme döneminde veya herhangi bir hastalık ya da ilaç kullanımı durumunda kullanmayın. Bu durumda doktorunuza danışınız.',
      en: 'Recommended daily dose: Children aged 4 to 10 are recommended to take 1 measuring spoon (5 ml) per day, and adults over 11 — 2 measuring spoons (10 ml) per day.\n\nStorage conditions: Store in a cool, dry place, away from sunlight, with the lid tightly closed and out of reach of children.\n\nTHIS IS NOT A MEDICINAL PRODUCT! It is not used for the prevention or treatment of diseases. Do not use during pregnancy, breastfeeding, or if you have any disease or are taking medication. In this case, consult your doctor.',
      ar: 'الجرعة اليومية الموصى بها: يُنصح الأطفال من عمر 4 إلى 10 سنوات بتناول ملعقة قياس واحدة (5 مل) يوميًا، أما البالغون فوق 11 عامًا فيُنصحون بتناول ملعقتين (10 مل) يوميًا.\n\nظروف التخزين: يُخزن في مكان بارد وجاف، بعيدًا عن أشعة الشمس، مع إغلاق الغطاء بإحكام وبعيدًا عن متناول الأطفال.\n\nهذا ليس منتجًا طبيًا! لا يُستخدم للوقاية من الأمراض أو علاجها. لا يُستخدم أثناء الحمل والرضاعة، وكذلك في حال وجود أمراض أو تناول أدوية. في هذه الحالة استشر طبيبك.',
    },
  },
  {
    id: 'prod-11',
    names: {
      ru: 'Оптима Комплекс',
      tr: 'Optima Kompleks',
      en: 'Optima Complex',
      ar: 'أوبتيما كومبلكس',
    },
    categoryKey: 'vitamins',
    price: 1650,
    image: '/images/optimacomplex.webp',
    descriptions: {
      ru: 'Сбалансированный комплекс с лютеином, зеаксантином, омега-3, антиоксидантами и витаминами создан специально для поддержки остроты зрения и защиты сетчатки. Способствует снижению усталости глаз при нагрузках и сохранению здоровья зрительной системы.',
      tr: 'Balık yağı Omega-3, kurkumin, koenzim Q10, C vitamini, çinko, lutein, astaksantin ve diğer aktif bileşenleri içeren çok bileşenli formül. Kalp, görme, eklem ve bağışıklık için kapsamlı destek.',
      en: 'A multi-ingredient formula with fish oil Omega-3, curcumin, coenzyme Q10, vitamin C, zinc, lutein, astaxanthin and other active compounds. Comprehensive support for heart, vision, joints and immunity.',
      ar: 'تركيبة متعددة المكونات تحتوي على زيت السمك وأوميغا 3 والكركمين والإنزيم المساعد Q10 وفيتامين C والزنك واللوتين والأستازانتين ومركبات نشطة أخرى. دعم شامل للقلب والرؤية والمفاصل والمناعة.',
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
    notes: {
      ru: 'Группа пользователей и суточная дозировка: Взрослым в возрасте 11 лет и старше рекомендуется принимать по 1 мягкой капсуле в день.\n\nВнимание: это пищевая добавка. Не превышайте рекомендуемую суточную дозу.\n\nЭТО НЕ ЛЕКАРСТВЕННОЕ СРЕДСТВО. Оно не используется для лечения заболеваний. Проконсультируйтесь с врачом, если вы беременны, кормите грудью, имеете какое-либо заболевание или принимаете лекарства.',
      tr: 'Kullanıcı grubu ve günlük doz: 11 yaş ve üzeri yetişkinlerin günde 1 yumuşak kapsül alması önerilir.\n\nDikkat: Bu bir besin takviyesidir. Önerilen günlük dozu aşmayın.\n\nBU BİR İLAÇ DEĞİLDİR. Hastalıkların tedavisi için kullanılmaz. Hamileyseniz, emziriyorsanız, herhangi bir hastalığınız varsa veya ilaç kullanıyorsanız doktorunuza danışınız.',
      en: 'User group and daily dosage: For adults aged 11 and over, take 1 soft capsule per day.\n\nCaution: This is a dietary supplement. Do not exceed the recommended daily dose.\n\nTHIS IS NOT A MEDICINAL PRODUCT. It is not used to treat diseases. Consult your doctor if you are pregnant, breastfeeding, have any disease, or are taking medication.',
      ar: 'الفئة المستهدفة والجرعة اليومية: للبالغين في سن 11 عامًا فما فوق، يُنصح بتناول كبسولة لينة واحدة يوميًا.\n\nتنبيه: هذا مكمل غذائي. لا تتجاوز الجرعة اليومية الموصى بها.\n\nهذا ليس منتجًا طبيًا! لا يُستخدم لعلاج الأمراض. استشر طبيبك إذا كنتِ حاملاً أو مرضعًا أو لديك أي مرض أو تتناول أدوية.',
    },
  },
  {
    id: 'prod-12',
    names: {
      ru: 'MultiGummy Мультивитаминные жевательные мармеладки',
      tr: 'MultiGummy Çoklu Vitamin Çiğneme Jölesi',
      en: 'MultiGummy',
      ar: 'فيتامينات متعددة للمضغ',
    },
    categoryKey: 'vitamins',
    price: 2900,
    image: '/images/multigummy.webp',
    descriptions: {
      ru: 'Daruzen MultiGummy (60 жевательных пастилок) — сбалансированный витаминный комплекс в форме жевательных мармеладок (со вкусом микса фруктов) для ежедневной поддержки организма. Содержит основные витамины C, E, B12 и A для укрепления иммунитета, повышения жизненного тонуса и общего здоровья взрослых.',
      tr: 'C, E, A ve B12 vitaminleri içeren çoklu vitamin çiğneme jölesi. Bağışıklığı, enerjiyi ve cilt sağlığını gün boyu destekler. Vitamin ihtiyacını karşılamanın lezzetli yolu.',
      en: 'Multivitamin chewing gummies with vitamins C, E, A and B12. Support immunity, energy and skin health throughout the day. A tasty way to cover your daily vitamin needs.',
      ar: 'أقراص فيتامينات متعددة قابلة للمضغ تحتوي على فيتامينات C وE وA وB12. تدعم المناعة والطاقة وصحة الجلد طوال اليوم. طريقة لذيذة لتغطية احتياجك اليومي من الفيتامينات.',
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
        '| C vitamini | 40 mg | 50% |',
        '| E vitamini | 12 mg | 100% |',
        '| B12 vitamini | 0.02 mg | 800% |',
        '| A vitamini | 0.12 mg | 15% |',
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
    notes: {
      ru: 'Целевая аудитория: подходит для взрослых и детей с 11 лет.\n\nСпособ применения и рекомендуемая суточная доза: принимать по 2 жевательные пастилки (гумми) 1 раз в день, желательно во время или после еды.\n\nПредупреждение: не превышайте рекомендуемую суточную дозу. Не использовать в качестве замены полноценного и сбалансированного питания. При беременности, в период грудного вскармливания, а также при наличии хронических заболеваний или приёме лекарственных препаратов рекомендуется проконсультироваться с врачом.\n\nУсловия хранения: хранить в сухом, прохладном месте при температуре до 25 °C, вдали от прямых солнечных лучей и в недоступном для детей месте.\n\nНЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ.',
      tr: 'Hedef kitle: 11 yaş ve üzeri yetişkinler ve çocuklar için uygundur.\n\nKullanım şekli ve önerilen günlük doz: Günde 1 kez 2 çiğneme pastili (gummies) alın, tercihen yemek sırasında veya sonrasında.\n\nUyarı: Önerilen günlük dozu aşmayın. Tam ve dengeli bir beslenmenin yerine kullanmayın. Hamilelikte, emzirme döneminde, kronik hastalıklarda veya ilaç kullanımında doktorunuza danışmanız önerilir.\n\nSaklama koşulları: 25 santigrat derecenin altındaki kuru ve serin bir yerde, doğrudan güneş ışığından uzakta ve çocukların erişemeyeceği bir yerde saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR.',
      en: 'Target audience: suitable for adults and children aged 11 and over.\n\nDirections for use and recommended daily dose: Take 2 chewable pastilles (gummies) once a day, preferably during or after meals.\n\nWarning: Do not exceed the recommended daily dose. Do not use as a substitute for a complete and balanced diet. Consult your doctor if you are pregnant, breastfeeding, have chronic diseases, or are taking medication.\n\nStorage conditions: Store in a dry, cool place at up to 25 °C, away from direct sunlight and out of reach of children.\n\nTHIS IS NOT A MEDICINAL PRODUCT.',
      ar: 'الفئة المستهدفة: مناسب للبالغين والأطفال من سن 11 عامًا فما فوق.\n\nطريقة الاستخدام والجرعة اليومية الموصى بها: تناول حبتين للمضغ (gummies) مرة واحدة يوميًا، ويفضل أثناء أو بعد الوجبات.\n\nتحذير: لا تتجاوز الجرعة اليومية الموصى بها. لا تستخدم كبديل عن التغذية الكاملة والمتوازنة. يُنصح باستشارة الطبيب أثناء الحمل والرضاعة وعند وجود أمراض مزمنة أو تناول أدوية.\n\nظروف التخزين: يُخزن في مكان جاف وبارد عند درجة حرارة تصل إلى 25 درجة مئوية، بعيدًا عن أشعة الشمس المباشرة وبعيدًا عن متناول الأطفال.\n\nهذا ليس منتجًا طبيًا!',
    },
  },
  {
    id: 'prod-1785669452074',
    names: {
      ru: 'Экстракт витекса священного',
      tr: 'Hayıt Ekstresi',
      en: 'Chasteberry Extract',
      ar: 'مستخلص تشاستيبيري',
    },
    categoryKey: 'herbs',
    price: 1400,
    image: 'https://fstihxljqljhfyubptsk.supabase.co/storage/v1/object/public/product_image/prod-1785669452074/1785669463531.webp',
    createdAt: 1754496000,
    isNew: true,
    descriptions: {
      ru: 'Комплекс с экстрактами витекса и тысячелистника, коэнзимом Q10, L-аргинином, женьшенем, цинком, селеном и фолиевой кислотой — способствует поддержанию женского гормонального баланса, репродуктивного здоровья и регулярности менструального цикла. Помогает уменьшить проявления ПМС, поддерживает энергию, антиоксидантную защиту и общее самочувствие.',
      tr: 'Hayıt özü bazlı, koenzim Q10, ginseng, çinko, folik asit ve selenyum içeren kadın kompleksi. Hormonal dengeyi ve kadın sağlığını destekler, PMS belirtilerinin hafiflemesine yardımcı olur.',
      en: 'A women\'s complex based on chasteberry (Vitex agnus-castus) extract with coenzyme Q10, ginseng, zinc, folic acid and selenium. Supports hormonal balance and women\'s health, and helps ease PMS symptoms.',
      ar: 'مركب نسائي يعتمد على مستخلص تشاستيبيري (Vitex agnus-castus) مع الإنزيم المساعد Q10 والجنسنغ والزنك وحمض الفوليك والسيلينيوم. يدعم التوازن الهرموني وصحة المرأة ويساعد في تخفيف أعراض متلازمة ما قبل الحيض.',
    },
    specs: {
      ru: [
        '| **Активный компонент** | **Состав на 2 капсулы** | **% от суточной нормы** |',
        '| --- | ---: | ---: |',
        '| Экстракт витекса священного | 400 мг | — |',
        '| Экстракт тысячелистника | 100 мг | — |',
        '| Коэнзим Q10 | 100 мг | — |',
        '| L-аргинин | 100 мг | — |',
        '| Экстракт корейского женьшеня | 80 мг | — |',
        '| Цинк | 15 мг | 150% |',
        '| Фолиевая кислота | 600 мкг | 300% |',
        '| Селен | 200 мкг | 364% |',
      ],
      tr: [
        '| **Aktif Bileşen** | **Miktar (2 Kapsül)** | **%BRD** |',
        '| --- | ---: | ---: |',
        '| Hayıt ekstresi | 400 mg | — |',
        '| Civanperçemi ekstresi | 100 mg | — |',
        '| Koenzim Q10 | 100 mg | — |',
        '| L-Arjinin | 100 mg | — |',
        '| Kore ginsengi ekstresi | 80 mg | — |',
        '| Çinko | 15 mg | 150% |',
        '| Folik asit | 600 µg | 300% |',
        '| Selenyum | 200 µg | 364% |',
      ],
      en: [
        '| **Active ingredient** | **Composition per 2 capsules** | **% of daily value** |',
        '| --- | ---: | ---: |',
        '| Chasteberry extract | 400 mg | — |',
        '| Yarrow extract | 100 mg | — |',
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
        '| مستخلص اليارو | 100 ملغ | — |',
        '| الإنزيم المساعد Q10 | 100 ملغ | — |',
        '| L-أرجينين | 100 ملغ | — |',
        '| مستخلص الجنسنغ الكوري | 80 ملغ | — |',
        '| الزنك | 15 ملغ | 150% |',
        '| حمض الفوليك | 600 مكغ | 300% |',
        '| السيلينيوم | 200 مكغ | 364% |',
      ],
    },
    notes: {
      ru: 'Способ применения: Женский комплекс Хайит&Тысячелистник&КоэнзимQ10 пьётся натощак утром и вечером по одной капсуле.\n\nВажное примечание: на период менструального цикла приём необходимо прекратить. По окончании менструального цикла возобновить.\n\nМенструальный цикл - имеется в виду столько, сколько он обычно продолжается (3-5-7 дней).\n\nЕсли же цикл идёт дольше обычного, то приём капсул необходимо возобновить, отсчитав обычное количество дней цикла.\n\nПример: ваш цикл 3 дня, но он сбился и продолжается дольше обычного, в этом случае, по прошествии трёх дней возобновляете приём несмотря на то, что цикл ещё не завершился.',
      tr: 'Günlük önerilen doz: Kadın Kompleksi Hayıt&Civanperçemi&KoenzimQ10, sabah ve akşam aç karnına birer kapsül olarak alınır.\n\nÖnemli not: Adet döngüsü süresince kullanıma ara verilmelidir. Adet döngüsü bittikten sonra kullanıma devam edilir.\n\nAdet döngüsü - genellikle sürdüğü süre kadar kastedilmektedir (3-5-7 gün).\n\nDöngü normalden uzun sürerse, normal döngü günü sayısı kadar bekleyerek kapsül kullanımına devam edilmelidir.\n\nÖrnek: döngünüz 3 gün ama uzadı ve normalden daha uzun sürüyor; bu durumda üç gün geçtikten sonra döngü henüz bitmemiş olsa bile kullanıma devam edersiniz.',
      en: 'Recommended daily dose: The Women\'s Complex Hayıt&Yarrow&Coenzyme Q10 is taken on an empty stomach, one capsule in the morning and one in the evening.\n\nImportant note: Stop taking it during the menstrual cycle and resume after it ends.\n\nMenstrual cycle - this means as long as it usually lasts (3-5-7 days).\n\nIf the cycle lasts longer than usual, resume taking the capsules after the usual number of cycle days has passed.\n\nExample: your cycle is 3 days, but it got disrupted and lasts longer than usual; in this case, resume taking it after three days have passed, even if the cycle has not ended yet.',
      ar: 'الجرعة اليومية الموصى بها: يُؤخذ المركب النسائي Hayıt واليارو والإنزيم المساعد Q10 على معدة فارغة، كبسولة واحدة صباحًا وكبسولة واحدة مساءً.\n\nملاحظة مهمة: يجب التوقف عن الاستخدام خلال فترة الدورة الشهرية، واستئنافه بعد انتهائها.\n\nالدورة الشهرية - أي للمدة التي تستمر فيها عادة (3-5-7 أيام).\n\nإذا استمرت الدورة أطول من المعتاد، فيجب استئناف تناول الكبسولات بعد احتساب العدد المعتاد من أيام الدورة.\n\nمثال: دورتك 3 أيام، لكنها تعطلت واستمرت أطول من المعتاد؛ في هذه الحالة تستأنفين الاستخدام بعد مرور ثلاثة أيام حتى لو لم تنتهِ الدورة بعد.',
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
    createdAt: 1754582400,
    isNew: true,
    descriptions: {
      ru: 'Железо бисглицинат + Витамин C — способствует восполнению дефицита железа, поддерживает нормальный уровень гемоглобина и снижает риск усталости и слабости. Витамин C улучшает усвоение железа, повышая эффективность комплекса.',
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
        '| **Aktif Bileşen** | **Miktar (1 Kapsül)** | **%BRD** |',
        '| --- | ---: | ---: |',
        '| **Vitamin C** | 100 mg | 125% |',
        '| **Demir (Demir bisglisinat 62,13 mg)** | 17 mg | 121% |',
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
    notes: {
      ru: 'Рекомендуемая суточная доза: взрослым в возрасте 11 лет и старше рекомендуется принимать по 1 капсуле один раз в день, запивая большим количеством воды.\n\nУсловия хранения: хранить в прохладном, сухом месте, вдали от солнечных лучей и в недоступном для детей месте, плотно закрыв крышку.\n\nНЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ! Не используется для профилактики или лечения заболеваний. Проконсультируйтесь с врачом, если вы беременны, кормите грудью, имеете какое-либо заболевание или принимаете лекарства.',
      tr: 'Günlük önerilen doz: 11 yaş ve üzeri yetişkinlerin günde 1 kapsül, bol miktarda su ile alması önerilir.\n\nSaklama koşulları: Serin ve kuru bir yerde, güneş ışığından uzakta ve çocukların erişemeyeceği bir yerde, kapağı sıkıca kapatılmış olarak saklayınız.\n\nBU BİR İLAÇ DEĞİLDİR! Hastalıkların önlenmesi veya tedavisi için kullanılmaz. Hamileyseniz, emziriyorsanız, herhangi bir hastalığınız varsa veya ilaç kullanıyorsanız doktorunuza danışınız.',
      en: 'Recommended daily dose: For adults aged 11 and over, take 1 capsule once a day, with plenty of water.\n\nStorage conditions: Store in a cool, dry place, away from sunlight and out of reach of children, with the lid tightly closed.\n\nTHIS IS NOT A MEDICINAL PRODUCT! It is not used for the prevention or treatment of diseases. Consult your doctor if you are pregnant, breastfeeding, have any disease, or are taking medication.',
      ar: 'الجرعة اليومية الموصى بها: بالنسبة للبالغين الذين تبلغ أعمارهم 11 عامًا وما فوق، يُنصح بتناول كبسولة واحدة مرة واحدة يوميًا مع الكثير من الماء.\n\nظروف التخزين: يُخزن في مكان بارد وجاف، بعيدًا عن أشعة الشمس وبعيدًا عن متناول الأطفال، مع إغلاق الغطاء بإحكام.\n\nهذا ليس منتجًا طبيًا! لا يُستخدم للوقاية من الأمراض أو علاجها. استشر طبيبك إذا كنت حاملاً أو ترضعين أو تعاني من أي مرض أو تتناول أدوية.',
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
  note?: string;
  createdAt?: number;
  isNew?: boolean;
  inStock?: boolean;
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
    note: p.notes ? (p.notes[lang] || p.notes.ru) : undefined,
    createdAt: p.createdAt,
    isNew: p.isNew,
    inStock: getInStock(p),
  }));

// Ключи категорий (первый — «все»)
export const categoryKeys: ('all' | CategoryKey)[] = [
  'all',
  ...Array.from(new Set(products.map(p => p.categoryKey))),
];

export const getCategoryLabel = (lang: Lang, key: 'all' | CategoryKey): string =>
  key === 'all' ? categoryLabels[lang].all : categoryLabels[lang][key];
