import { Lang } from '../i18n';

export const SEO_QUERIES: Record<Lang, {
  title: string;
  description: string;
  keywords: string;
}> = {
  ru: {
    title: 'Daruzen — Витамины и БАДы из Турции | Омега-3, Магний, Витамин D3, Цинк',
    description: 'Интернет-магазин турецких витаминов и добавок Daruzen. Витамины для иммунитета, энергии, волос, суставов. Омега-3, магний, цинк, железо, витамин D3, C, E. Доставка по всей России. Оригинальные турецкие БАДы от Orzax, Bioxin, Solgar.',
    keywords: 'витамины из Турции, купить витамины, БАДы Турция, витамины для иммунитета, витамины от стресса, витамины для энергии, витамины для волос, витамины для сна, витамины для суставов, витамины для детей, омега-3, магний, цинк, железо, витамин D3, витамин C, витамин E, биотин, калий, йод, селен, витамины группы B, Orzax витамины, Bioxin БАДы, Solgar комплексы, Daruzen витамины, Nature\'s Bounty, Витрум, Супрадин, Основит, турецкие добавки, натуральные витамины, витамины для женщин, витамины для мужчин, магний глицинат, магний цитрат, железо липосомальное, омега-3 премиум, витамин D3 с K2',
  },
  tr: {
    title: 'Daruzen — Türk Vitaminleri ve Takviyeleri | Omega-3, Magnezyum, D3 Vitamini, Çinko',
    description: 'Daruzen online mağazası — Türk vitaminleri ve takviyeleri. Bağışıklık, enerji, saç, eklem vitaminleri. Omega-3, magnezyum, çinko, demir, D3, C, E vitamini. Türkiye orijinal takviyeleri Orzax, Bioxin, Solgar.',
    keywords: 'türkiye vitaminleri, vitamin al, takviye türkiye, bağışıklık vitamini, stres vitamini, enerji vitamini, saç vitamini, uyku vitamini, eklem vitamini, çocuk vitaminleri, omega-3, magnezyum, çinko, demir, D vitamini, C vitamini, E vitamini, biotin, potasyum, iyot, selenyum, B vitaminleri, Orzax vitamin, Bioxin takviye, Solgar kompleks, Daruzen vitamin, Nature\'s Bounty, Vitrum, Supradyn, Orgavit, türk takviyeleri, doğal vitamin, kadın vitamin, erkek vitamin, magnezyum glisinat, magnezyum sitrat, lipozomal demir, omega-3 premium, D3 K2 vitamini',
  },
  en: {
    title: 'Daruzen — Turkish Vitamins & Supplements | Omega-3, Magnesium, Vitamin D3, Zinc',
    description: 'Daruzen online store — Turkish vitamins and supplements. Immunity, energy, hair, joint vitamins. Omega-3, magnesium, zinc, iron, vitamin D3, C, E. Original Turkish supplements from Orzax, Bioxin, Solgar. Worldwide delivery.',
    keywords: 'turkish vitamins, buy vitamins, supplements turkey, immunity vitamins, stress vitamins, energy vitamins, hair vitamins, sleep vitamins, joint vitamins, children vitamins, omega-3, magnesium, zinc, iron, vitamin D3, vitamin C, vitamin E, biotin, potassium, iodine, selenium, B vitamins, Orzax vitamins, Bioxin supplements, Solgar complexes, Daruzen vitamins, turkish supplements, natural vitamins, women vitamins, men vitamins, magnesium glycinate, magnesium citrate, liposomal iron, omega-3 premium, vitamin D3 with K2',
  },
  ar: {
    title: 'داروزن — فيتامينات ومكملات غذائية تركية | أوميغا 3، مغنيسيوم، فيتامين D3، زنك',
    description: 'متجر داروزن الإلكتروني — فيتامينات ومكملات غذائية تركية. فيتامينات للمناعة والطاقة والشعر والمفاصل. أوميغا 3، مغنيسيوم، زنك، حديد، فيتامين D3، C، E. منتجات تركية أصلية من أورزكس وبايوكسين وسولجار.',
    keywords: 'فيتامينات تركية, شراء فيتامينات, مكملات تركية, فيتامينات المناعة, فيتامينات التوتر, فيتامينات الطاقة, فيتامينات الشعر, فيتامينات النوم, فيتامينات المفاصل, فيتامينات الأطفال, أوميغا 3, مغنيسيوم, زنك, حديد, فيتامين D3, فيتامين C, فيتامين E, بيوتين, بوتاسيوم, يود, سيلينيوم, فيتامينات B, أورزكس فيتامين, بايوكسين مكملات, سولجار معقدات, داروزن فيتامين, مكملات تركية, فيتامينات طبيعية, فيتامينات نسائية, فيتامينات رجالية, مغنيسيوم جليسينات, مغنيسيوم سيترات, حديد ليبوسومالي, أوميغا 3 بريميوم, فيتامين D3 مع K2',
  },
};

export const SEO_CATEGORIES: Record<Lang, {
  purposeHeading: string;
  purposeItems: string[];
  componentsHeading: string;
  componentsItems: string[];
  brandsHeading: string;
  brandsText: string;
}> = {
  ru: {
    purposeHeading: 'Витамины по назначению',
    purposeItems: [
      'Витамины для иммунитета — укрепление защитных сил организма, профилактика простудных заболеваний',
      'Витамины от стресса и усталости — антистресс комплексы, восстановление нервной системы',
      'Витамины для энергии и тонуса — повышение жизненных сил, борьба с хронической усталостью',
      'Витамины для волос и ногтей — укрепление волос, предотвращение выпадения, рост ногтей',
      'Витамины для сна и нервной системы — нормализация сна, снятие нервного напряжения',
      'Витамины для суставов и связок — поддержка суставов, укрепление связок',
      'Витамины для женского здоровья — поддержка цикла, облегчение ПМС, менопауза',
      'Витамины для мужского здоровья — поддержка мужской силы, тестостерон',
      'Витамины для детей — детские витамины, рост и развитие',
      'Витамины для мозга и памяти — улучшение концентрации, поддержка когнитивных функций',
      'Витамин D при дефиците — восполнение дефицита витамина D',
      'Витамины для сердца — поддержка сердечно-сосудистой системы',
    ],
    componentsHeading: 'Витамины по компоненту',
    componentsItems: [
      'Омега-3 — полиненасыщенные жирные кислоты для сердца, мозга и суставов',
      'Магний глицинат, цитрат, малат —多种形式 магния для нервной системы и мышц',
      'Железо липосомальное, хелат — усваиваемое железо при анемии',
      'Цинк — essential mineral для иммунитета, кожи и волос',
      'Селен — антиоксидант для щитовидной железы и иммунитета',
      'Витамин D3 — в том числе с K2 для правильного усвоения кальция',
      'Витамины группы B — B1, B6, B12 для энергии и нервной системы',
      'Витамин C — иммунитет и антиоксидант',
      'Витамин E — антиоксидант для кожи и здоровья',
      'Биотин — красота волос, ногтей и кожи',
      'Калий — нормализация давления и работы сердца',
      'Йод — поддержка щитовидной железы',
    ],
    brandsHeading: 'Бренды витаминов',
    brandsText: 'Daruzen, Orzax, Bioxin, Solgar, Nature\'s Bounty, Витрум, Супрадин, Основит — оригинальные турецкие и мировые бренды витаминов и добавок. Все товары сертифицированы, с гарантией подлинности.',
  },
  tr: {
    purposeHeading: 'Vitaminler Kullanım Amacına Göre',
    purposeItems: [
      'Bağışıklık için vitaminler — bağışıklık sistemini güçlendirme, soğuk algınlığı önleme',
      'Stres ve yorgunluk için vitaminler — anti-stres kompleksleri, sinir sistemi desteği',
      'Enerji ve tonus için vitaminler — canlılık artırma, kronik yorgunlukla mücadele',
      'Saç ve tırnak için vitaminler — saç güçlendirme, dökülme önleme',
      'Uyku ve sinir sistemi için vitaminler — uyku düzenleme, sinir gerilimini azaltma',
      'Eklem ve bağlar için vitaminler — eklem desteği, bağ güçlendirme',
      'Kadın sağlığı için vitaminler — döngü desteği, PMS rahatlatma, menopoz',
      'Erkek sağlığı için vitaminler — erkek güç desteği, testosteron',
      'Çocuklar için vitaminler — çocuk vitaminleri, büyüme ve gelişme',
      'Beyin ve hafıza için vitaminler — konsantrasyon artırma, bilişsel fonksiyon desteği',
      'D vitamini eksikliği için — D vitamini eksikliğini giderme',
      'Kalp için vitaminler — kardiyovasküler sistem desteği',
    ],
    componentsHeading: 'Vitaminler Bileşene Göre',
    componentsItems: [
      'Omega-3 — kalp, beyin ve eklem için poli-ç doymamış yağ asitleri',
      'Magnezyum glisinat, sitrat, malat — sinir sistemi ve kas için magnezyum',
      'Demir lipozomal, helat — anemi ve demir eksikliği için yüksek emilimli demir',
      'Çinko — bağışıklık, cilt ve saç için temel mineral',
      'Selenyum — tiroid bezi ve bağışıklık için antioksidan',
      'D3 vitamini — kalsiyum emilimi için K2 ile birlikte',
      'B vitaminleri — B1, B6, B12 enerji ve sinir sistemi için',
      'C vitamini — bağışıklık ve antioksidan',
      'E vitamini — cilt ve sağlık için antioksidan',
      'Biotin — saç, tırnak ve cilt güzelliği',
      'Potasyum — tansiyon ve kalp düzenlemesi',
      'İyot — tiroid bezi desteği',
    ],
    brandsHeading: 'Vitamin Markaları',
    brandsText: 'Daruzen, Orzax, Bioxin, Solgar, Nature\'s Bounty, Vitrum, Supradyn, Orgavit — Türkiye ve dünya markalarının orijinal vitaminleri ve takviyeleri. Tüm ürünler sertifikalı, otantik garantili.',
  },
  en: {
    purposeHeading: 'Vitamins by Purpose',
    purposeItems: [
      'Immunity vitamins — strengthening body defenses, preventing colds',
      'Stress and fatigue vitamins — anti-stress complexes, nervous system support',
      'Energy and tone vitamins — boosting vitality, fighting chronic fatigue',
      'Hair and nail vitamins — strengthening hair, preventing hair loss',
      'Sleep and nervous system vitamins — sleep regulation, relieving tension',
      'Joint and ligament vitamins — joint support, ligament strengthening',
      'Women\'s health vitamins — cycle support, PMS relief, menopause',
      'Men\'s health vitamins — men\'s strength support, testosterone',
      'Children\'s vitamins — growth and development, children\'s immunity',
      'Brain and memory vitamins — concentration, cognitive function support',
      'Vitamin D for deficiency — replenishing vitamin D deficiency',
      'Heart vitamins — cardiovascular system support',
    ],
    componentsHeading: 'Vitamins by Component',
    componentsItems: [
      'Omega-3 — polyunsaturated fatty acids for heart, brain and joints',
      'Magnesium glycinate, citrate, malate — for nervous system, muscles and sleep',
      'Iron liposomal, chelate — high-absorption iron for anemia',
      'Zinc — essential mineral for immunity, skin and hair',
      'Selenium — antioxidant for thyroid and immunity',
      'Vitamin D3 — including with K2 for calcium absorption',
      'B vitamins — B1, B6, B12 for energy and nervous system',
      'Vitamin C — immunity and antioxidant',
      'Vitamin E — antioxidant for skin and health',
      'Biotin — beauty of hair, nails and skin',
      'Potassium — blood pressure and heart regulation',
      'Iodine — thyroid support',
    ],
    brandsHeading: 'Vitamin Brands',
    brandsText: 'Daruzen, Orzax, Bioxin, Solgar, Nature\'s Bounty, Vitrum, Supradyn, Organix — original Turkish and world brand vitamins. All products certified, authenticity guaranteed.',
  },
  ar: {
    purposeHeading: 'فيتامينات حسب الاستخدام',
    purposeItems: [
      'فيتامينات المناعة — تعزيز الدفاعات الجسمية، الوقاية من نزلات البرد',
      'فيتامينات التوتر والتعب — مركبات مضادة للتوتر، دعم الجهاز العصبي',
      'فيتامينات الطاقة — زيادة الحيوية، مكافحة الإرهاق المزمن',
      'فيتامينات الشعر والأظافر — تعزيز الشعر، منع تساقط الشعر',
      'فيتامينات النوم والجهاز العصبي — تنظيم النوم، تخفيف التوتر',
      'فيتامينات المفاصل والأربطة — دعم المفاصل، تعزيز الأربطة',
      'فيتامينات صحة المرأة — دعم الدورة الشهرية، تخفيف متلازمة ما قبل الطمث',
      'فيتامينات صحة الرجل — دعم قوة الرجل، التستوستيرون',
      'فيتامينات الأطفال — النمو والتطور، دعم مناعة الأطفال',
      'فيتامينات الدماغ والذاكرة — تحسين التركيز، دعم الوظائف الإدراكية',
      'فيتامين D لعلاج العجز — سد نقص فيتامين D',
      'فيتامينات القلب — دعم الجهاز القلبي الوعائي',
    ],
    componentsHeading: 'فيتامينات حسب المكون',
    componentsItems: [
      'أوميغا 3 — أحماض دهنية غير مشبعة للقلب والدماغ والمفاصل',
      'مغنيسيوم جليسينات وسيترات ومالات — للجهاز العصبي والعضلات',
      'حديد ليبوسومالي وخلات — حديد عالي الامتصاص لفقر الدم',
      'زنك — معدن أساسي للمناعة والجلد والشعر',
      'سيلينيوم — مضاد للأكسدة للغدة الدرقية والمناعة',
      'فيتامين D3 — مع K2 لامتصاص الكالسيوم الصحيح',
      'فيتامينات B — B1 وB6 وB12 للطاقة والجهاز العصبي',
      'فيتامين C — المناعة ومضاد للأكسدة',
      'فيتامين E — مضاد للأكسدة للجلد والصحة',
      'بيوتين — جمال الشعر والأظافر والجلد',
      'بوتاسيوم — تنظيم ضغط الدم وصحة القلب',
      'يود — دعم الغدة الدرقية',
    ],
    brandsHeading: 'علامات الفيتامينات',
    brandsText: 'داروزن، أورزكس، بايوكسين، سولجار، فيتريوم، سوبرادين — فيتامينات ومكملات تركية وعالمية أصلية. جميع المنتجات معتمدة، ضمان الأصالة.',
  },
};