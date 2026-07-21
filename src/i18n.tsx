import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Lang = 'ru' | 'tr' | 'en' | 'ar';

// eslint-disable-next-line react-refresh/only-export-components
export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية' },
];

type Dict = (typeof ui)[Lang];

const ui = {
  ru: {
    nav: {
      home: 'Главная',
      catalog: 'Каталог',
      about: 'О нас',
      contacts: 'Контакты',
    },
    hero: {
      titlePre: 'Здоровье начинается',
      titleAccent: 'с Daruzen',
      description: 'Премиальные добавки из Турции для вашей яркой жизни.',
      cta: 'Смотреть каталог',
    },
    catalog: {
      title: 'Наш каталог',
      empty: 'По вашему запросу ничего не найдено',
    },
    cart: {
      badgeUnit: 'шт',
      title: 'Ваш заказ',
      clear: 'Очистить',
      empty: 'Корзина пуста',
      total: 'Итого',
      whatsapp: 'Оформить в WhatsApp',
      telegram: 'Написать в Telegram',
      orderGreeting: 'Здравствуйте! Хочу сделать заказ на сайте Daruzen:',
      buyNowGreeting: 'Здравствуйте! Хочу сразу купить:',
      orderTotal: 'Итого',
      buy: 'Купить',
      inCart: 'В корзину',
      buyNow: 'Купить сейчас',
    },
    about: {
      titlePre: 'Мы создаем культуру',
      titleAccent: 'заботы о себе',
      desc: 'Daruzen — это не просто магазин добавок. Это результат многолетнего поиска лучших формул и чистейших ингредиентов из самого сердца Турции. Мы верим, что премиальное качество должно быть доступно каждому.',
      features: [
        { title: 'Чистота состава', desc: 'Все наши продукты проходят строгий лабораторный контроль и не содержат лишних примесей.' },
        { title: 'Научный подход', desc: 'Мы сотрудничаем с ведущими нутрициологами Турции для разработки эффективных дозировок.' },
        { title: 'Золотой стандарт', desc: 'Прямые поставки позволяют нам гарантировать оригинальность каждой баночки.' },
      ],
    },
    contacts: {
      titlePre: 'Свяжитесь',
      titleAccent: 'с нами',
      desc: 'Есть вопросы? Мы всегда на связи, чтобы помочь вам с выбором или заказом.',
      office: 'Офис в Турции',
      officeAddr: 'Istanbul, Mecidiyeköy',
      email: 'E-mail',
      emailAddr: 'hello@daruzen.com',
      phone: 'Телефон',
      phoneNum: '+90 551 048 57 25',
      form: {
        nameLabel: 'Как вас зовут?',
        namePlaceholder: 'Александр',
        emailLabel: 'Ваш Email',
        emailPlaceholder: 'mail@example.com',
        msgLabel: 'Сообщение',
        msgPlaceholder: 'Чем мы можем вам помочь?',
        submit: 'Отправить сообщение',
        submitting: 'Отправляем...',
        submitted: 'Отправлено!',
      },
    },
    search: {
      placeholder: 'Поиск препаратов...',
      found: 'Найдено',
    },
    modal: {
      quantity: 'Количество',
      description: 'Описание',
      composition: 'Состав',
    },
    footer: {
      desc: 'Натуральные биодобавки и витамины из лучших ингредиентов. Качество, проверенное временем.',
      company: 'Компания',
      links: ['О нас', 'Доставка', 'Оплата', 'Контакты'],
      connect: 'Связаться',
      rights: 'Все права защищены.',
    },
    professor: {
      title: 'Dr. Hasib Sheikh',
      subtitle: 'Ассистент-профессор, Университет Хамдард, Бангладеш',
      description: 'Сейчас работает в Hamdard Gıda, İthalat, İhracat ve Dış Ticaret Ltd. Şirketi. Адрес: Güneşli Bağlar Mah. Koçman Caddesi Gül Sokak.',
    },
  },
  tr: {
    nav: {
      home: 'Ana Sayfa',
      catalog: 'Katalog',
      about: 'Hakkımızda',
      contacts: 'İletişim',
    },
    hero: {
      titlePre: 'Sağlık',
      titleAccent: 'Daruzen ile başlar',
      description: 'Parlak yaşamınız için Türkiye\'den premium takviyeler.',
      cta: 'Kataloğu Gör',
    },
    catalog: {
      title: 'Katalogumuz',
      empty: 'Aramanız için hiçbir sonuç bulunamadı',
    },
    cart: {
      badgeUnit: 'adet',
      title: 'Siparişiniz',
      clear: 'Temizle',
      empty: 'Sepet boş',
      total: 'Toplam',
      whatsapp: 'WhatsApp\'ta Sipariş Ver',
      telegram: 'Telegram\'da Yaz',
      orderGreeting: 'Merhaba! Daruzen sitesinden sipariş vermek istiyorum:',
      buyNowGreeting: 'Merhaba! Hemen satın almak istiyorum:',
      orderTotal: 'Toplam',
      buy: 'Satın Al',
      inCart: 'Sepete Ekle',
      buyNow: 'Hemen Al',
    },
    about: {
      titlePre: 'Özgün bir kültür',
      titleAccent: 'yaratıyoruz',
      desc: 'Daruzen sadece bir takviye mağazası değildir. Türkiye\'nin kalbinden en iyi formüllerin ve en saf içeriklerin yıllarca süren arayışının bir sonucudur. Premium kalitenin herkese ulaşabilir olduğuna inanıyoruz.',
      features: [
        { title: 'Saf içerik', desc: 'Tüm ürünlerimiz sıkı laboratuvar kontrolünden geçer ve gereksiz katkı madde içermez.' },
        { title: 'Bilimsel yaklaşım', desc: 'Etkili dozajlar geliştirmek için Türkiye\'nin önde gelen beslenme uzmanlarıyla iş birliği yapıyoruz.' },
        { title: 'Altın standart', desc: 'Doğrudan tedarik, her kutunun orijinalliğini garanti etmemizi sağlar.' },
      ],
    },
    contacts: {
      titlePre: 'Bizimle',
      titleAccent: 'iletişime geçin',
      desc: 'Sorularınız mı var? Seçim veya sipariş konusunda size yardımcı olmak için her zaman hazırız.',
      office: 'Türkiye Ofisi',
      officeAddr: 'İstanbul, Mecidiyeköy',
      email: 'E-posta',
      emailAddr: 'hello@daruzen.com',
      phone: 'Telefon',
      phoneNum: '+90 551 048 57 25',
      form: {
        nameLabel: 'Adınız nedir?',
        namePlaceholder: 'Ahmet',
        emailLabel: 'E-posta Adresiniz',
        emailPlaceholder: 'ornek@mail.com',
        msgLabel: 'Mesaj',
        msgPlaceholder: 'Size nasıl yardımcı olabiliriz?',
        submit: 'Mesaj Gönder',
        submitting: 'Gönderiliyor...',
        submitted: 'Gönderildi!',
      },
    },
    search: {
      placeholder: 'İlaç ara...',
      found: 'Bulundu',
    },
    modal: {
      quantity: 'Adet',
      description: 'Açıklama',
      composition: 'İçindekiler',
    },
    footer: {
      desc: 'En iyi içeriklerden doğal takviyeler ve vitaminler. Zamanın sınadığı kalite.',
      company: 'Şirket',
      links: ['Hakkımızda', 'Teslimat', 'Ödeme', 'İletişim'],
      connect: 'İletişim',
      rights: 'Tüm hakları saklıdır.',
    },
    professor: {
      title: 'Dr. Hasib Sheikh',
      subtitle: 'Hamdard Üniversitesi Bangladeş Yardımcı Doçenti',
      description: 'Hamdard Gıda, İthalat, İhracat ve Dış Ticaret Ltd. Şirketi\'nde çalışıyor. Güneşli Bağlar Mah. Koçman Caddesi Gül Sokak.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      about: 'About',
      contacts: 'Contacts',
    },
    hero: {
      titlePre: 'Health',
      titleAccent: 'begins with Daruzen',
      description: 'Premium supplements from Turkey for your vibrant life.',
      cta: 'View Catalog',
    },
    catalog: {
      title: 'Our Catalog',
      empty: 'No results found for your request',
    },
    cart: {
      badgeUnit: 'pcs',
      title: 'Your Order',
      clear: 'Clear',
      empty: 'Cart is empty',
      total: 'Total',
      whatsapp: 'Order via WhatsApp',
      telegram: 'Write in Telegram',
      orderGreeting: 'Hello! I would like to place an order on the Daruzen website:',
      buyNowGreeting: 'Hello! I would like to buy right now:',
      orderTotal: 'Total',
      buy: 'Buy',
      inCart: 'Add to Cart',
      buyNow: 'Buy Now',
    },
    about: {
      titlePre: 'We create a culture',
      titleAccent: 'of self-care',
      desc: 'Daruzen is more than just a supplement store. It is the result of a years-long search for the best formulas and purest ingredients from the heart of Turkey. We believe premium quality should be accessible to everyone.',
      features: [
        { title: 'Purity of composition', desc: 'All our products undergo strict laboratory control and contain no unnecessary impurities.' },
        { title: 'Scientific approach', desc: 'We collaborate with leading Turkish nutritionists to develop effective dosages.' },
        { title: 'Gold standard', desc: 'Direct supplies allow us to guarantee the authenticity of every jar.' },
      ],
    },
    contacts: {
      titlePre: 'Get in',
      titleAccent: 'touch with us',
      desc: 'Any questions? We are always here to help you with your choice or order.',
      office: 'Office in Turkey',
      officeAddr: 'Istanbul, Mecidiyeköy',
      email: 'E-mail',
      emailAddr: 'hello@daruzen.com',
      phone: 'Phone',
      phoneNum: '+90 551 048 57 25',
      form: {
        nameLabel: 'What is your name?',
        namePlaceholder: 'Alexander',
        emailLabel: 'Your Email',
        emailPlaceholder: 'mail@example.com',
        msgLabel: 'Message',
        msgPlaceholder: 'How can we help you?',
        submit: 'Send Message',
        submitting: 'Sending...',
        submitted: 'Sent!',
      },
    },
    search: {
      placeholder: 'Search products...',
      found: 'Found',
    },
    modal: {
      quantity: 'Quantity',
      description: 'Description',
      composition: 'Composition',
    },
    footer: {
      desc: 'Natural supplements and vitamins made from the finest ingredients. Quality tested by time.',
      company: 'Company',
      links: ['About', 'Delivery', 'Payment', 'Contacts'],
      connect: 'Connect',
      rights: 'All rights reserved.',
    },
    professor: {
      title: 'Dr. Hasib Sheikh',
      subtitle: 'Assistant Professor, Hamdard University Bangladesh',
      description: 'Currently working for Hamdard Gıda, İthalat, İhracat ve Dış Ticaret Ltd. Şirketi. Güneşli Bağlar Mah. Koçman Caddesi Gül Sokak.',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      catalog: 'الكتالوج',
      about: 'من نحن',
      contacts: 'اتصل بنا',
    },
    hero: {
      titlePre: 'الصحة',
      titleAccent: 'تبدأ مع Daruzen',
      description: 'مكملات غذائية متميزة من تركيا من أجل حياتك النابضة بالحياة.',
      cta: 'عرض الكتالوج',
    },
    catalog: {
      title: 'كتالوجنا',
      empty: 'لم يتم العثور على نتائج لطلبك',
    },
    cart: {
      badgeUnit: 'قطعة',
      title: 'طلبك',
      clear: 'مسح',
      empty: 'السلة فارغة',
      total: 'الإجمالي',
      whatsapp: 'اطلب عبر واتساب',
      telegram: 'راسل عبر تليجرام',
      orderGreeting: 'مرحباً! أود تقديم طلب على موقع Daruzen:',
      buyNowGreeting: 'مرحباً! أود الشراء الآن:',
      orderTotal: 'الإجمالي',
      buy: 'شراء',
      inCart: 'أضف إلى السلة',
      buyNow: 'اشترِ الآن',
    },
    about: {
      titlePre: 'نحن نصنع ثقافة',
      titleAccent: 'العناية بالذات',
      desc: 'Daruzen ليست مجرد متجر مكملات غذائية. إنها نتيجة سنوات من البحث عن أفضل التركيبات وأنقى المكونات من قلب تركيا. نحن نؤمن بأن الجودة الممتازة يجب أن تكون متاحة للجميع.',
      features: [
        { title: 'نقاء المكونات', desc: 'جميع منتجاتنا تخضع لرقابة مخبرية صارمة ولا تحتوي على شوائب غير ضرورية.' },
        { title: 'نهج علمي', desc: 'نتعاون مع كبار أخصائيي التغذية في تركيا لتطوير جرعات فعالة.' },
        { title: 'المعيار الذهبي', desc: 'التوريد المباشر يتيح لنا ضمان أصالة كل عبوة.' },
      ],
    },
    contacts: {
      titlePre: 'تواصل',
      titleAccent: 'معنا',
      desc: 'هل لديك أسئلة؟ نحن دائماً على اتصال لمساعدتك في الاختيار أو الطلب.',
      office: 'مكتب في تركيا',
      officeAddr: 'إسطنبول، مجيدية كوي',
      email: 'البريد الإلكتروني',
      emailAddr: 'hello@daruzen.com',
      phone: 'الهاتف',
      phoneNum: '+90 551 048 57 25',
      form: {
        nameLabel: 'ما اسمك؟',
        namePlaceholder: 'أحمد',
        emailLabel: 'بريدك الإلكتروني',
        emailPlaceholder: 'mail@example.com',
        msgLabel: 'الرسالة',
        msgPlaceholder: 'كيف يمكننا مساعدتك؟',
        submit: 'إرسال الرسالة',
        submitting: 'جارٍ الإرسال...',
        submitted: 'تم الإرسال!',
      },
    },
    search: {
      placeholder: 'ابحث عن المنتجات...',
      found: 'تم العثور',
    },
    modal: {
      quantity: 'الكمية',
      description: 'الوصف',
      composition: 'المكونات',
    },
    footer: {
      desc: 'مكملات غذائية طبيعية وفيتامينات مصنوعة من أفضل المكونات. جودة اختبرها الزمن.',
      company: 'الشركة',
      links: ['من نحن', 'التوصيل', 'الدفع', 'اتصل بنا'],
      connect: 'تواصل',
      rights: 'جميع الحقوق محفوظة.',
    },
    professor: {
      title: 'Dr. Hasib Sheikh',
      subtitle: 'أستاذ مساعد، جامعة همدرد بنغلاديش',
      description: 'يعمل حالياً في همدرد جيدا للاستيراد والتصدير والتجارة الخارجية المحدودة. حي غنيشلي باغلار مح. كوتشمان كاديسي غول سوكاك.',
    },
  },
} as const;

export const titles: Record<Lang, string> = {
  ru: 'Daruzen — Магазин здоровья',
  tr: 'Daruzen — Sağlık Mağazası',
  en: 'Daruzen — Health Store',
  ar: 'Daruzen — متجر الصحة',
};

type Currency = {
  symbol: string;
  locale: string;
  code: string;
  rate: number;
};

export const currencies: Record<Lang, Currency> = {
  ru: { symbol: '₽', locale: 'ru-RU', code: 'RUB', rate: 2.2 },
  tr: { symbol: '₺', locale: 'tr-TR', code: 'TRY', rate: 1 },
  en: { symbol: '$', locale: 'en-US', code: 'USD', rate: 0.025 },
  ar: { symbol: '₺', locale: 'tr-TR', code: 'TRY', rate: 1 },
};

export function formatPrice(amount: number, lang: Lang): string {
  const currency = currencies[lang];
  const converted = amount * currency.rate;
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(converted);
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'daruzen-lang';

function getInitialLang(): Lang {
  return 'ru';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = titles[lang];
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const value: LanguageContextValue = { lang, setLang, t: ui[lang] };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
