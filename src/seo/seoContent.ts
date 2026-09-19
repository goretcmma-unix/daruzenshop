import { Lang } from '../i18n';

export const SEO_QUERIES: Record<Lang, {
  title: string;
  description: string;
  keywords: string;
}> = {
  ru: {
    title: 'Daruzen — Витамины и БАДы из Турции',
    description: 'Интернет-магазин турецких витаминов и БАДов Daruzen. Омега-3, магний, цинк, железо, витамин D3. Оригинальные турецкие БАДы от Orzax, Bioxin, Solgar.',
    keywords: 'витамины из Турции, купить витамины, БАДы Турция, БАДы для похудения, БАДы для женщин, БАДы для мужчин, БАДы для суставов, БАДы для печени, БАДы для иммунитета, БАДы для сердца, БАДы для мозга и памяти, БАДы для нервной системы, БАДы для волос, БАДы для глаз, БАДы для энергии, БАДы для сна, БАДы для кожи, БАДы для детей, БАДы для спортсменов, БАДы для потенции, БАДы для сосудов, БАДы для кишечника, БАДы для желудка, БАДы для почек, БАДы для щитовидной железы, БАДы для холестерина, БАДы для сахара, БАДы для крови, БАДы для роста волос, БАДы для ногтей, БАДы для метаболизма, БАДы для набора массы, БАДы для снижения веса, БАДы для аппетита, БАДы для климакса, БАДы для беременных, БАДы для настроения, лучшие БАДы, рейтинг БАДов, омега-3, магний, цинк, железо, витамин D3, витамин C, витамин E, биотин, селен, хром, гинкго билоба, Orzax витамины, Bioxin БАДы, Solgar комплексы, Daruzen витамины, турецкие добавки, натуральные витамины, витамины для женщин, витамины для мужчин, магний глицинат, магний цитрат, железо липосомальное, омега-3 премиум, витамин D3 с K2',
  },
  tr: {
    title: 'Daruzen — Türk Vitaminleri ve Takviyeleri',
    description: 'Daruzen online mağazası — Türk vitaminleri ve takviyeleri. Omega-3, magnezyum, çinko, demir, D3 vitamini. Orijinal takviyeleri Orzax, Bioxin, Solgar.',
    keywords: 'türkiye vitaminleri, vitamin al, takviye türkiye, bağışıklık vitamini, stres vitamini, enerji vitamini, saç vitamini, uyku vitamini, eklem vitamini, çocuk vitaminleri, omega-3, magnezyum, çinko, demir, D vitamini, C vitamini, E vitamini, biotin, potasyum, iyot, selenyum, B vitaminleri, Orzax vitamin, Bioxin takviye, Solgar kompleks, Daruzen vitamin, Nature\'s Bounty, Vitrum, Supradyn, Orgavit, türk takviyeleri, doğal vitamin, kadın vitamin, erkek vitamin, magnezyum glisinat, magnezyum sitrat, lipozomal demir, omega-3 premium, D3 K2 vitamini',
  },
  en: {
    title: 'Daruzen — Turkish Vitamins & Supplements',
    description: 'Daruzen online store — Turkish vitamins and supplements. Omega-3, magnesium, zinc, iron, vitamin D3, C, E. Original supplements from Orzax, Bioxin, Solgar.',
    keywords: 'turkish vitamins, buy vitamins, supplements turkey, immunity vitamins, stress vitamins, energy vitamins, hair vitamins, sleep vitamins, joint vitamins, children vitamins, omega-3, magnesium, zinc, iron, vitamin D3, vitamin C, vitamin E, biotin, potassium, iodine, selenium, B vitamins, Orzax vitamins, Bioxin supplements, Solgar complexes, Daruzen vitamins, turkish supplements, natural vitamins, women vitamins, men vitamins, magnesium glycinate, magnesium citrate, liposomal iron, omega-3 premium, vitamin D3 with K2',
  },
  ar: {
    title: 'داروزن — فيتامينات ومكملات غذائية تركية',
    description: 'متجر داروزن — فيتامينات ومكملات تركية. أوميغا 3، مغنيسيوم، زنك، حديد، فيتامين D3. منتجات تركية أصلية من أورزكس وبايوكسين وسولجار.',
    keywords: 'فيتامينات تركية, شراء فيتامينات, مكملات تركية, فيتامينات المناعة, فيتامينات التوتر, فيتامينات الطاقة, فيتامينات الشعر, فيتامينات النوم, فيتامينات المفاصل, فيتامينات الأطفال, أوميغا 3, مغنيسيوم, زنك, حديد, فيتامين D3, فيتامين C, فيتامين E, بيوتين, بوتاسيوم, يود, سيلينيوم, فيتامينات B, أورزكس فيتامين, بايوكسين مكملات, سولجار معقدات, داروزن فيتامين, مكملات تركية, فيتامينات طبيعية, فيتامينات نسائية, فيتامينات رجالية, مغنيسيوم جليسينات, مغنيسيوم سيترات, حديد ليبوسومالي, أوميغا 3 بريميوم, فيتامين D3 مع K2',
  },
};

export interface SeoPageMeta {
  title: string;
  description: string;
  keywords: string;
}

export const SEO_PAGES: Record<'about' | 'contacts' | 'catalog', Record<Lang, SeoPageMeta>> = {
  about: {
    ru: {
      title: 'О бренде Daruzen — Качество, безопасность, эффективность | drdaruzen.com',
      description: 'Daruzen — премиальный бренд витаминов и добавок из Турции. Узнайте о философии бренда, стандартах качества и миссии компании.',
      keywords: 'Daruzen, о бренде, дарузен, турецкие витамины, БАД, витамины из Турции',
    },
    tr: {
      title: 'Daruzen Hakkında — Kalite, Güvenlik, Etkinlik | drdaruzen.com',
      description: "Daruzen, Türkiye'den premium vitamin ve takviye markasıdır. Marka felsefemiz, kalite standartlarımız ve misyonumuz hakkında bilgi edinin.",
      keywords: 'Daruzen, Daruzen hakkında, Daruzen markası, Türk vitaminleri, takviye, Türkiye vitaminleri',
    },
    en: {
      title: 'About Daruzen — Quality, Safety, Effectiveness | drdaruzen.com',
      description: 'Daruzen is a premium vitamin and supplement brand from Turkey. Learn about our philosophy, quality standards and company mission.',
      keywords: 'Daruzen, about Daruzen, Daruzen brand, Turkish vitamins, supplements, vitamins from Turkey',
    },
    ar: {
      title: 'عن داروزن — الجودة، الأمان، الفعالية | drdaruzen.com',
      description: 'داروزن علامة تجارية متميزة للفيتامينات والمكملات الغذائية من تركيا. تعرف على فلسفتنا ومعايير الجودة ورسالة الشركة.',
      keywords: 'داروزن, عن داروزن, علامة داروزن, فيتامينات تركية, مكملات, فيتامينات من تركيا',
    },
  },
  contacts: {
    ru: {
      title: 'Контакты Daruzen — Телефон, Email, Офис в Турции | drdaruzen.com',
      description: 'Свяжитесь с Daruzen: +90 544 679 10 12, daruzenshop@outlook.com. Офис в Стамбуле (Bağcılar), Турция. Поможем с выбором витаминов и доставкой.',
      keywords: 'Daruzen контакты, дарузен телефон, daruzen email, офис Daruzen Стамбул',
    },
    tr: {
      title: 'Daruzen İletişim — Telefon, E-posta, Türkiye Ofisi | drdaruzen.com',
      description: 'Daruzen ile iletişime geçin: +90 544 679 10 12, daruzenshop@outlook.com. İstanbul (Bağcılar), Türkiye ofisi. Vitamin seçimi ve gönderimde yardımcı oluruz.',
      keywords: 'Daruzen iletişim, Daruzen telefon, Daruzen e-posta, Daruzen ofis İstanbul',
    },
    en: {
      title: 'Contact Daruzen — Phone, Email, Office in Turkey | drdaruzen.com',
      description: 'Contact Daruzen: +90 544 679 10 12, daruzenshop@outlook.com. Office in Istanbul (Bağcılar), Turkey. We help with vitamin selection and delivery.',
      keywords: 'Daruzen contact, Daruzen phone, Daruzen email, Daruzen office Istanbul',
    },
    ar: {
      title: 'اتصل بداروزن — هاتف، بريد إلكتروني، مكتب في تركيا | drdaruzen.com',
      description: 'تواصل مع داروزن: +90 544 679 10 12، daruzenshop@outlook.com. مكتب في إسطنبول (باغجلار)، تركيا. نساعدك في اختيار الفيتامينات والشحن.',
      keywords: 'اتصل بداروزن, هاتف داروزن, بريد داروزن, مكتب داروزن إسطنبول',
    },
  },
  catalog: {
    ru: {
      title: 'Каталог витаминов и добавок Daruzen — Витамины, минералы, БАД | drdaruzen.com',
      description: 'Полный каталог Daruzen: БАДы, витамины, минералы, добавки для красоты и травяные комплексы из Турции. Оригинальные сертифицированные товары с доставкой.',
      keywords: 'Daruzen каталог, витамины, турецкие витамины, БАД, добавки из Турции',
    },
    tr: {
      title: 'Daruzen Kataloğu — Vitaminler, Mineraller, Takviyeler | drdaruzen.com',
      description: "Daruzen tam katalog: takviyeler, vitaminler, mineraller, güzellik ve bitkisel kompleksler. Orijinal ve sertifikalı ürünler gönderimle.",
      keywords: 'Daruzen katalog, vitaminler, Türk vitaminleri, takviyeler, Türkiye takviyeleri',
    },
    en: {
      title: 'Daruzen Catalog — Vitamins, Minerals, Supplements | drdaruzen.com',
      description: 'Full Daruzen catalog: supplements, vitamins, minerals, beauty and herbal complexes from Turkey. Original certified products with delivery.',
      keywords: 'Daruzen catalog, vitamins, Turkish vitamins, supplements, supplements from Turkey',
    },
    ar: {
      title: 'كتالوج داروزن — فيتامينات، معادن، مكملات | drdaruzen.com',
      description: 'كتالوج داروزن الكامل: مكملات وفيتامينات ومعادن ومركبات الجمال والأعشاب من تركيا. منتجات أصلية معتمدة مع شحن.',
      keywords: 'كتالوج داروزن, فيتامينات, فيتامينات تركية, مكملات, مكملات من تركيا',
    },
  },
};

export const SEO_CATALOG_CATEGORIES: Record<string, Record<Lang, SeoPageMeta>> = {
  supplements: {
    ru: {
      title: 'БАДы и добавки из Турции — купить оригинальные БАД | Daruzen',
      description: 'Оригинальные БАДы и добавки из Турции: BSO мармеладки, ACV-комплексы, антистресс фитокомплексы. Сертифицированные турецкие добавки с доставкой.',
      keywords: 'купить БАДы, БАДы из Турции, дарузен, daruzen, турецкие добавки',
    },
    tr: {
      title: "Türkiye'den Takviyeler — Orijinal Takviyeler | Daruzen",
      description: "Türkiye'den orijinal takviyeler: BSO jöle, ACV kompleksleri, anti-stres bitkisel kompleksler. Sertifikalı Türk takviyeleri gönderim ile.",
      keywords: 'takviye al, Türkiye takviyeleri, Daruzen takviye, Türk takviyeleri',
    },
    en: {
      title: 'Supplements from Turkey — Buy Original Supplements | Daruzen',
      description: 'Original supplements from Turkey: BSO gummies, ACV complexes, anti-stress phyto complexes. Certified Turkish supplements with delivery.',
      keywords: 'buy supplements, supplements from Turkey, Daruzen supplements, Turkish supplements',
    },
    ar: {
      title: 'مكملات من تركيا — شراء مكملات أصلية | داروزن',
      description: 'مكملات أصلية من تركيا: أقراص BSO، مركبات ACV، مركبات مضادة للإجهاد. مكملات تركية معتمدة مع الشحن.',
      keywords: 'شراء مكملات, مكملات من تركيا, مكملات داروزن, مكملات تركية',
    },
  },
  vitamins: {
    ru: {
      title: 'Витамины из Турции — купить оригинальные витамины | Daruzen',
      description: 'Витамины из Турции: Омега-3 премиум, мультивитамины, витамин D3 с K2. Оригинальные турецкие витамины от Daruzen с доставкой.',
      keywords: 'купить витамины, витамины из Турции, турецкие витамины, daruzen, омега-3',
    },
    tr: {
      title: "Türkiye'den Vitaminler — Orijinal Vitaminler | Daruzen",
      description: "Türkiye'den vitaminler: Omega 3 premium, multivitaminler, K2'li D3 vitamini. Daruzen'den orijinal Türk vitaminleri gönderim ile.",
      keywords: 'vitamin al, Türkiye vitaminleri, Türk vitaminleri, Daruzen vitamin',
    },
    en: {
      title: 'Vitamins from Turkey — Buy Original Vitamins | Daruzen',
      description: 'Vitamins from Turkey: Omega 3 premium, multivitamins, vitamin D3 with K2. Original Turkish vitamins from Daruzen with delivery.',
      keywords: 'buy vitamins, vitamins from Turkey, Turkish vitamins, Daruzen vitamins, omega-3',
    },
    ar: {
      title: 'فيتامينات من تركيا — شراء فيتامينات أصلية | داروزن',
      description: 'فيتامينات من تركيا: أوميغا 3 بريميوم، فيتامينات متعددة، فيتامين D3 مع K2. فيتامينات تركية أصلية من داروزن مع الشحن.',
      keywords: 'شراء فيتامينات, فيتامينات من تركيا, فيتامينات تركية, داروزن فيتامين',
    },
  },
  minerals: {
    ru: {
      title: 'Минералы — магний, цинк, железо из Турции | Daruzen',
      description: 'Минералы из Турции: магний комплекс, цинк с селеном и медью, липосомальное железо. Высококачественные минеральные комплексы Daruzen.',
      keywords: 'магний, цинк, железо, минералы из Турции, дарузен, daruzen',
    },
    tr: {
      title: 'Mineraller — Magnezyum, Çinko, Demir | Daruzen',
      description: "Türkiye'den mineraller: magnezyum kompleksi, selenyumlu çinko ve bakır, lipozomal demir. Daruzen kaliteli mineral kompleksleri.",
      keywords: 'magnezyum, çinko, demir, Türkiye mineralleri, Daruzen mineral',
    },
    en: {
      title: 'Minerals — Magnesium, Zinc, Iron from Turkey | Daruzen',
      description: 'Minerals from Turkey: magnesium complex, zinc with selenium and copper, liposomal iron. High-quality Daruzen mineral complexes.',
      keywords: 'magnesium, zinc, iron, minerals from Turkey, Daruzen minerals',
    },
    ar: {
      title: 'معادن — مغنيسيوم، زنك، حديد من تركيا | داروزن',
      description: 'معادن من تركيا: مركب المغنيسيوم، زنك مع سيلينيوم ونحاس، حديد ليبوسومالي. مركبات معادن عالية الجودة من داروزن.',
      keywords: 'مغنيسيوم, زنك, حديد, معادن من تركيا, داروزن معادن',
    },
  },
  beauty: {
    ru: {
      title: 'Добавки для красоты — волосы, кожа, ногти | Daruzen',
      description: 'Добавки для красоты: NADH гамми, коллаген и биотин для волос, кожи и ногтей. Оригинальные beauty-комплексы от Daruzen.',
      keywords: 'добавки для красоты, NADH, биотин, коллаген, дарузен, daruzen',
    },
    tr: {
      title: 'Güzellik Takviyeleri — Saç, Cilt, Tırnak | Daruzen',
      description: "Güzellik takviyeleri: NADH gummies, saç, cilt ve tırnaklar için kolajen ve biotin. Daruzen'den orijinal güzellik kompleksleri.",
      keywords: 'güzellik takviyeleri, NADH, biotin, kolajen, Daruzen güzellik',
    },
    en: {
      title: 'Beauty Supplements — Hair, Skin, Nails | Daruzen',
      description: 'Beauty supplements: NADH gummies, collagen and biotin for hair, skin and nails. Original beauty complexes from Daruzen.',
      keywords: 'beauty supplements, NADH, biotin, collagen, Daruzen beauty',
    },
    ar: {
      title: 'مكملات الجمال — الشعر، الجلد، الأظافر | داروزن',
      description: 'مكملات الجمال: أقراص NADH، كولاجين وبيوتين للشعر والجلد والأظافر. مركبات جمال أصلية من داروزن.',
      keywords: 'مكملات الجمال, NADH, بيوتين, كولاجين, داروزن جمال',
    },
  },
  herbs: {
    ru: {
      title: 'Травяные БАДы и фитокомплексы из Турции | Daruzen',
      description: 'Травяные фитокомплексы из Турции: гинкго и женьшень, артишок для печени, DNL антистресс. Натуральные фитопрепараты Daruzen.',
      keywords: 'травяные БАДы, фитокомплексы, гинкго, женьшень, артишок, дарузен',
    },
    tr: {
      title: 'Bitkisel Takviyeler — Türkiye Bitkisel Kompleksleri | Daruzen',
      description: "Türkiye'den bitkisel kompleksler: ginkgo ve ginseng, karaciğer için enginar, anti-stres DNL. Daruzen doğal bitkisel ürünleri.",
      keywords: 'bitkisel takviye, ginkgo, ginseng, enginar, Daruzen bitkisel',
    },
    en: {
      title: 'Herbal Supplements — Phyto Complexes from Turkey | Daruzen',
      description: 'Herbal phyto complexes from Turkey: ginkgo and ginseng, artichoke for the liver, anti-stress DNL. Natural Daruzen herbal products.',
      keywords: 'herbal supplements, ginkgo, ginseng, artichoke, Daruzen herbs',
    },
    ar: {
      title: 'مكملات عشبية — مركبات نباتية من تركيا | داروزن',
      description: 'مكملات عشبية من تركيا: جينكو وجينسينغ، أرتيشوك للكبد، DNL المضاد للإجهاد. منتجات عشبية طبيعية من داروزن.',
      keywords: 'مكملات عشبية, جينكو, جينسينغ, أرتيشوك, داروزن أعشاب',
    },
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
    purposeHeading: 'БАДы и витамины по назначению',
    purposeItems: [
      'БАДы для похудения — эффективные добавки для снижения веса и контроля аппетита',
      'БАДы для женщин — комплексная поддержка женского здоровья, цикла, менопаузы',
      'БАДы для мужчин — поддержка мужского здоровья, потенции, тестостерона',
      'БАДы для суставов — хондроитин, глюкозамин, поддержка связок и хрящей',
      'БАДы для печени — очищение и восстановление печени, желчного пузыря',
      'БАДы для иммунитета — укрепление защитных сил организма',
      'БАДы для сердца и сосудов — поддержка сердечно-сосудистой системы',
      'БАДы для мозга и памяти — улучшение концентрации, когнитивных функций',
      'БАДы для нервной системы — антистресс, нормализация сна',
      'БАДы для волос и ногтей — укрепление, рост, красота',
      'БАДы для энергии и бодрости — борьба с усталостью, повышение тонуса',
      'БАДы для глаз — поддержка зрения',
      'БАДы для детей — рост, развитие, иммунитет',
      'БАДы для спортсменов — набор массы, восстановление, тренировки',
      'БАДы для потенции — мужская сила, либидо',
      'БАДы для кишечника и ЖКТ — микрофлора, пищеварение',
      'БАДы для почек — поддержка почечной системы',
      'БАДы для щитовидной железы — нормализация гормонов',
      'БАДы для холестерина — снижение уровня холестерина',
      'БАДы для сахара в крови — контроль глюкозы',
      'БАДы для беременных — витамины для мамы и ребенка',
      'БАДы для климакса — облегчение симптомов менопаузы',
      'БАДы для настроения — антидепрессанты натурального происхождения',
    ],
    componentsHeading: 'БАДы по компоненту',
    componentsItems: [
      'Омега-3 — полиненасыщенные жирные кислоты для сердца, мозга и суставов',
      'Магний глицинат, цитрат, малат — для нервной системы, мышц и сна',
      'Железо липосомальное, хелат — усваиваемое железо при анемии',
      'Цинк — essential mineral для иммунитета, кожи и волос',
      'Селен — антиоксидант для щитовидной железы и иммунитета',
      'Витамин D3 — в том числе с K2 для правильного усвоения кальция',
      'Витамины группы B — B1, B6, B12 для энергии и нервной системы',
      'Витамин C — иммунитет и антиоксидант',
      'Витамин E — антиоксидант для кожи и здоровья',
      'Биотин — красота волос, ногтей и кожи',
      'Хром — контроль сахара в крови и метаболизма',
      'Гинкго билоба — память, кровообращение, мозговая активность',
      'Калий — нормализация давления и работы сердца',
      'Йод — поддержка щитовидной железы',
    ],
    brandsHeading: 'Бренды БАДов и витаминов',
    brandsText: 'Daruzen, Orzax, Bioxin, Solgar, Nature\'s Bounty, Витрум, Супрадин, Основит — оригинальные турецкие и мировые бренды витаминов и добавок. Все товары сертифицированы, с гарантией подлинности.',
  },
  tr: {
    purposeHeading: 'Vitaminler Kullanım Amacına Göre',
    purposeItems: [
      'Bağışıklık için vitaminler — bağışıklık sistemini güçlendirme',
      'Stres ve yorgunluk için vitaminler — anti-stres kompleksleri',
      'Enerji ve tonus için vitaminler — canlılık artırma',
      'Saç ve tırnak için vitaminler — saç güçlendirme, dökülme önleme',
      'Uyku ve sinir sistemi için vitaminler — uyku düzenleme',
      'Eklem ve bağlar için vitaminler — eklem desteği',
      'Kadın sağlığı için vitaminler — döngü desteği, menopoz',
      'Erkek sağlığı için vitaminler — erkek güç desteği',
      'Çocuklar için vitaminler — büyüme ve gelişme',
      'Beyin ve hafıza için vitaminler — konsantrasyon artırma',
      'D vitamini eksikliği için — D vitamini eksikliğini giderme',
      'Kalp için vitaminler — kardiyovasküler sistem desteği',
    ],
    componentsHeading: 'Vitaminler Bileşene Göre',
    componentsItems: [
      'Omega-3 — kalp, beyin ve eklem için poli-ç doymamış yağ asitleri',
      'Magnezyum glisinat, sitrat, malat — sinir sistemi ve kas için',
      'Demir lipozomal, helat — anemi ve demir eksikliği için',
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
    purposeHeading: 'Supplements by Purpose',
    purposeItems: [
      'Weight loss supplements — effective additives for weight management',
      'Immunity supplements — strengthening body defenses',
      'Joint supplements — chondroitin, glucosamine, ligament support',
      'Liver supplements — liver cleansing and restoration',
      'Heart and cardiovascular supplements — heart health support',
      'Brain and memory supplements — cognitive function, concentration',
      'Nervous system supplements — anti-stress, sleep normalization',
      'Hair and nail supplements — strengthening, growth, beauty',
      'Energy supplements — fighting fatigue, boosting vitality',
      'Children\'s supplements — growth, development, immunity',
      'Sports supplements — mass gain, recovery, training',
      'Men\'s health supplements — potency, testosterone',
      'Women\'s health supplements — cycle, menopause support',
      'Digestive supplements — gut flora, digestion',
    ],
    componentsHeading: 'Supplements by Component',
    componentsItems: [
      'Omega-3 — polyunsaturated fatty acids for heart, brain and joints',
      'Magnesium glycinate, citrate, malate — for nervous system and muscles',
      'Iron liposomal, chelate — high-absorption iron for anemia',
      'Zinc — essential mineral for immunity, skin and hair',
      'Selenium — antioxidant for thyroid and immunity',
      'Vitamin D3 — including with K2 for calcium absorption',
      'B vitamins — B1, B6, B12 for energy and nervous system',
      'Vitamin C — immunity and antioxidant',
      'Vitamin E — antioxidant for skin and health',
      'Biotin — beauty of hair, nails and skin',
      'Chromium — blood sugar and metabolism control',
      'Ginkgo biloba — memory, blood circulation, brain activity',
      'Potassium — blood pressure and heart regulation',
      'Iodine — thyroid support',
    ],
    brandsHeading: 'Supplement Brands',
    brandsText: 'Daruzen, Orzax, Bioxin, Solgar, Nature\'s Bounty, Vitrum, Supradyn, Organix — original Turkish and world brand vitamins. All products certified, authenticity guaranteed.',
  },
  ar: {
    purposeHeading: 'مكملات حسب الاستخدام',
    purposeItems: [
      'مكملات المناعة — تعزيز الدفاعات الجسمية',
      'مكملات التوتر والتعب — مركبات مضادة للتوتر',
      'مكملات الطاقة — زيادة الحيوية',
      'مكملات الشعر والأظافر — تعزيز الشعر، منع التساقط',
      'مكملات النوم والجهاز العصبي — تنظيم النوم',
      'مكملات المفاصل والأربطة — دعم المفاصل',
      'مكملات صحة المرأة — دعم الدورة الشهرية',
      'مكملات صحة الرجل — دعم القوة الرجالية',
      'مكملات الأطفال — النمو والتطور',
      'مكملات الدماغ والذاكرة — تحسين التركيز',
      'فيتامين D لعلاج العجز — سد نقص فيتامين D',
      'مكملات القلب — دعم الجهاز القلبي الوعائي',
    ],
    componentsHeading: 'مكملات حسب المكون',
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
    brandsHeading: 'علامات المكملات',
    brandsText: 'داروزن، أورزكس، بايوكسين، سولجار، فيتريوم، سوبرادين — فيتامينات ومكملات تركية وعالمية أصلية. جميع المنتجات معتمدة، ضمان الأصالة.',
  },
};
