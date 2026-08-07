import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Lang = 'ru' | 'tr' | 'en' | 'ar';

// eslint-disable-next-line react-refresh/only-export-components
export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'ru', flag: '/images/flags/ru.svg', label: 'Русский' },
  { code: 'tr', flag: '/images/flags/tr.svg', label: 'Türkçe' },
  { code: 'en', flag: '/images/flags/gb.svg', label: 'English' },
  { code: 'ar', flag: '/images/flags/sa.svg', label: 'العربية' },
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
      titlePre: 'Что такое',
      titleAccent: 'Daruzen?',
      desc: 'Daruzen — это современный бренд премиальных пищевых добавок, созданный для людей, которые выбирают качество, безопасность и эффективность. Мы тщательно подбираем ингредиенты, сотрудничаем с надежными производителями и придерживаемся высоких стандартов качества на каждом этапе. Наша миссия — помогать людям заботиться о своем здоровье с помощью современных научных разработок, инновационных технологий и тщательно отобранных компонентов. Мы стремимся заслужить доверие каждого клиента, предлагая продукцию, сочетающую эффективность, безопасность и безупречное качество. Для нас Daruzen — это не просто бренд. Это философия заботы о здоровье, жизненной энергии и внутреннем балансе. Каждая наша формула создается с одной целью — помогать людям поддерживать активную, полноценную и здоровую жизнь, сохраняя высокие стандарты качества и доверия.',
      history: [
        { title: 'Происхождение имени', text: '«Daruzen» родилось из древнегреческого «daru» (δῶρον — «дар», «подарок») и «zen» — символа гармонии и баланса. Два корня, объединившись, дали имя нашему бренду.' },
        { title: 'Философия бренда', text: 'Здоровье — это не обязанность и не роскошь, а дар, который нужно беречь каждый день. «Daruzen» значит «дар жизни»: мы помогаем возвращать естественную силу и равновесие.' },
        { title: 'Путь к совершенству', text: 'Многолетний поиск лучших формул и чистейших ингредиентов из самого сердца Турции. Мы верим, что премиальное качество должно быть доступно каждому.' },
      ],
      features: [
        { title: 'Чистота состава', desc: 'Все наши продукты проходят строгий лабораторный контроль и не содержат лишних примесей.' },
        { title: 'Научный подход', desc: 'Мы сотрудничаем с профессором в области разработки БАДов и витаминов для создания эффективных и безопасных дозировок.' },
        { title: 'Золотой стандарт', desc: 'Прямые поставки позволяют нам гарантировать оригинальность каждой баночки.' },
      ],
      brand: {
        title: 'Философия бренда',
        intro: 'Daruzen — это не просто бренд. Это философия заботы о здоровье, жизненной энергии и внутреннем балансе.',
        items: [
          {
            title: 'Качество и безопасность',
            text: 'Daruzen — это современный бренд премиальных пищевых добавок, созданный для людей, которые выбирают качество, безопасность и эффективность. Мы тщательно подбираем ингредиенты, сотрудничаем с надежными производителями и придерживаемся высоких стандартов качества на каждом этапе.',
          },
          {
            title: 'Наша миссия',
            text: 'Наша миссия — помогать людям заботиться о своем здоровье с помощью современных научных разработок, инновационных технологий и тщательно отобранных компонентов. Мы стремимся заслужить доверие каждого клиента, предлагая продукцию, сочетающую эффективность, безопасность и безупречное качество.',
          },
          {
            title: 'Наша философия',
            text: 'Для нас Daruzen — это не просто бренд. Это философия заботы о здоровье, жизненной энергии и внутреннем балансе. Каждая наша формула создается с одной целью — помогать людям поддерживать активную, полноценную и здоровую жизнь, сохраняя высокие стандарты качества и доверия.',
          },
        ],
      },
      why: {
        title: 'Почему Daruzen?',
        p1: 'Название Daruzen вдохновлено богатым наследием Османской цивилизации, где медицина, знания и забота о здоровье занимали особое место. Мы создали имя, которое отражает связь с традициями прошлого и стремление к современным стандартам качества.',
        p2: 'Для нас Daruzen — это символ доверия, гармонии и заботы о человеке. Наш бренд объединяет уважение к историческому наследию с инновационными технологиями, создавая продукцию, которая помогает людям поддерживать здоровье, жизненную энергию и высокое качество жизни.',
      },
    },
    contacts: {
      titlePre: 'Свяжитесь',
      titleAccent: 'с нами',
      desc: 'Есть вопросы? Мы всегда на связи, чтобы помочь вам с выбором или заказом.',
      office: 'Офис в Турции',
      officeAddr: 'İSTANBUL, Mahmutbey Mah. Ordu Cad. No: 26, 3.kat, İç kapı No: 21, Bağcılar',
      email: 'E-mail',
      emailAddr: 'daruzenshop@outlook.com',
      phone: 'Телефон',
      phoneNum: '+90 544 679 10 12',
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
      substance: 'Вещество',
      dosage: 'Дозировка',
      daily: 'Норма',
      tabProduct: 'Описание',
      tabComposition: 'Состав',
      tabNote: 'Примечание',
      noteDosage: 'Дозировка',
      noteStorage: 'Хранение',
      noteWarning: 'Важно',
      noteInfo: 'Примечание',
      noteScrollHint: 'Свайп вниз',
    },
    footer: {
      desc: 'Натуральные биодобавки и витамины из лучших ингредиентов. Качество, проверенное временем.',
      company: 'Компания',
      links: ['О нас', 'Доставка', 'Оплата', 'Контакты'],
      connect: 'Связаться',
      rights: 'Все права защищены.',
      adminLink: 'Вход для администратора',
    },
    professor: {
      title: 'Доктор Хасиб Шейх',
      subtitle: 'доцент Университета Хамдард, Бангладеш',
      description: 'В настоящее время работает в компании Hamdard Food, Import, Export and Foreign Trade Ltd., расположенной в районе Гюнешли Баглар, на улицах Кочман и Гюль.',
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
      titlePre: 'Hakkımızda',
      titleAccent: '',
      desc: 'Daruzen sadece bir takviye mağazası değildir. Türkiye\'nin kalbinden en iyi formüllerin ve en saf içeriklerin yıllarca süren arayışının bir sonucudur. Premium kalitenin herkese ulaşabilir olduğuna inanıyoruz.',
      history: [
        { title: 'İsmin kökeni', text: '"Daruzen", Antik Yunanca "daru" (δῶρον — hediye, armağan) ve "zen" — uyum ve dengenin sembolü — kelimelerinden doğdu. İki kök birleşerek markamıza ad verdi.' },
        { title: 'Marka felsefesi', text: 'Sağlık bir görev ya da lüks değil, her gün korunması gereken bir hediyedir. "Daruzen", "yaşam hediyesi" demektir: doğal gücü ve dengeyi geri kazandırmaya yardımcı oluyoruz.' },
        { title: 'Mükemmelliğe giden yol', text: 'Türkiye\'nin kalbinden en iyi formüllerin ve en saf içeriklerin yıllarca süren arayışı. Premium kalitenin herkese ulaşabilir olduğuna inanıyoruz.' },
      ],
      features: [
        { title: 'Saf içerik', desc: 'Tüm ürünlerimiz sıkı laboratuvar kontrolünden geçer ve gereksiz katkı madde içermez.' },
        { title: 'Bilimsel yaklaşım', desc: 'Besin takviyeleri ve vitaminler alanında uzman bir profesörle iş birliği yaparak etkili ve güvenli dozajlar geliştiriyoruz.' },
        { title: 'Altın standart', desc: 'Doğrudan tedarik, her kutunun orijinalliğini garanti etmemizi sağlar.' },
      ],
      brand: {
        title: 'Marka Felsefesi',
        intro: 'Daruzen sadece bir marka değil. Sağlık, yaşam enerjisi ve iç denge konusunda bir özen felsefesidir.',
        items: [
          {
            title: 'Kalite ve Güvenlik',
            text: 'Daruzen, kaliteyi, güvenliği ve etkinliği seçen insanlar için yaratılmış modern bir premium gıda takviyesi markasıdır. İçerikleri özenle seçiyor, güvenilir üreticilerle iş birliği yapıyor ve her aşamada yüksek kalite standartlarına bağlı kalıyoruz.',
          },
          {
            title: 'Misyonumuz',
            text: 'Misyonumuz, modern bilimsel gelişmeler, yenilikçi teknolojiler ve özenle seçilmiş bileşenlerle insanların sağlıklarına dikkat etmelerine yardımcı olmaktır. Etkinlik, güvenlik ve kusursuz kaliteyi birleştiren ürünler sunarak her müşterinin güvenini kazanmayı hedefliyoruz.',
          },
          {
            title: 'Felsefemiz',
            text: 'Bizim için Daruzen sadece bir marka değil. Sağlık, yaşam enerjisi ve iç denge konusunda bir özen felsefesidir. Her formülümüz tek bir amaçla oluşturulur — insanların aktif, dolu dolu ve sağlıklı bir yaşam sürmelerine yardımcı olmak, yüksek kalite ve güven standartlarını korumak.',
          },
        ],
      },
      why: {
        title: 'Neden Daruzen?',
        p1: 'Daruzen adı, tıbbın, bilginin ve sağlığa özenin özel bir yer tuttuğu zengin Osmanlı medeniyeti mirasından ilham almıştır. Geçmişin gelenekleriyle bağlantıyı ve modern kalite standartlarına yönelik çabayı yansıtan bir isim yarattık.',
        p2: 'Bizim için Daruzen, güven, uyum ve insana özen sembolüdür. Markamız, tarihsel mirasa saygıyı yenilikçi teknolojilerle birleştirerek insanların sağlıklarını, yaşam enerjilerini ve yüksek yaşam kalitelerini sürdürmelerine yardımcı olan ürünler yaratır.',
      },
    },
    contacts: {
      titlePre: 'Bizimle',
      titleAccent: 'iletişime geçin',
      desc: 'Sorularınız mı var? Seçim veya sipariş konusunda size yardımcı olmak için her zaman hazırız.',
      office: 'Türkiye Ofisi',
      officeAddr: 'Mahmutbey Mah. Ordu Cad. No: 26 3.kat İç kapı No: 21 Bağcılar/İSTANBUL',
      email: 'E-posta',
      emailAddr: 'daruzenshop@outlook.com',
      phone: 'Telefon',
      phoneNum: '+90 544 679 10 12',
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
      substance: 'Madde',
      dosage: 'Dozaj',
      daily: 'Günlük değer',
      tabProduct: 'Açıklama',
      tabComposition: 'İçindekiler',
      tabNote: 'Not',
      noteDosage: 'Doz',
      noteStorage: 'Saklama',
      noteWarning: 'Önemli',
      noteInfo: 'Not',
      noteScrollHint: 'Aşağı kaydırın',
    },
    footer: {
      desc: 'En iyi içeriklerden doğal takviyeler ve vitaminler. Zamanın sınadığı kalite.',
      company: 'Şirket',
      links: ['Hakkımızda', 'Teslimat', 'Ödeme', 'İletişim'],
      connect: 'İletişim',
      rights: 'Tüm hakları saklıdır.',
      adminLink: 'Yönetici girişi',
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
      titlePre: 'About',
      titleAccent: '',
      desc: 'Daruzen is more than just a supplement store. It is the result of a years-long search for the best formulas and purest ingredients from the heart of Turkey. We believe premium quality should be accessible to everyone.',
      history: [
        { title: 'Origin of the name', text: '"Daruzen" was born from the Ancient Greek "daru" (δῶρον — gift) and "zen" — a symbol of harmony and balance. Two roots, united, gave the name to our brand.' },
        { title: 'Brand philosophy', text: 'Health is not a duty or a luxury, but a gift to be cherished every day. "Daruzen" means "gift of life": we help restore natural strength and balance.' },
        { title: 'The path to excellence', text: 'A years-long search for the best formulas and purest ingredients from the heart of Turkey. We believe premium quality should be accessible to everyone.' },
      ],
      features: [
        { title: 'Purity of composition', desc: 'All our products undergo strict laboratory control and contain no unnecessary impurities.' },
        { title: 'Scientific approach', desc: 'We collaborate with a professor specializing in supplements and vitamins to develop effective and safe dosages.' },
        { title: 'Gold standard', desc: 'Direct supplies allow us to guarantee the authenticity of every jar.' },
      ],
      brand: {
        title: 'Brand Philosophy',
        intro: 'For us, Daruzen is more than just a brand. It is a philosophy of caring for health, vital energy and inner balance.',
        items: [
          {
            title: 'Quality & Safety',
            text: 'Daruzen is a modern premium dietary supplement brand created for people who choose quality, safety and effectiveness. We carefully select ingredients, work with reliable manufacturers and maintain high quality standards at every stage.',
          },
          {
            title: 'Our Mission',
            text: 'Our mission is to help people take care of their health through modern scientific developments, innovative technologies and carefully selected components. We strive to earn the trust of every customer by offering products that combine effectiveness, safety and impeccable quality.',
          },
          {
            title: 'Our Philosophy',
            text: 'For us, Daruzen is more than just a brand. It is a philosophy of caring for health, vital energy and inner balance. Every formula we create has one goal — to help people lead an active, fulfilling and healthy life while maintaining high standards of quality and trust.',
          },
        ],
      },
      why: {
        title: 'Why Daruzen?',
        p1: 'The name Daruzen is inspired by the rich heritage of Ottoman civilization, where medicine, knowledge and care for health held a special place. We created a name that reflects a connection with the traditions of the past and a commitment to modern quality standards.',
        p2: 'For us, Daruzen is a symbol of trust, harmony and care for people. Our brand combines respect for historical heritage with innovative technologies, creating products that help people maintain health, vital energy and a high quality of life.',
      },
    },
    contacts: {
      titlePre: 'Get in',
      titleAccent: 'touch with us',
      desc: 'Any questions? We are always here to help you with your choice or order.',
      office: 'Office in Turkey',
      officeAddr: 'Mahmutbey, Ordu Street No: 26, 3rd Floor, Door No: 21, Bağcılar/İSTANBUL',
      email: 'E-mail',
      emailAddr: 'daruzenshop@outlook.com',
      phone: 'Phone',
      phoneNum: '+90 544 679 10 12',
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
      substance: 'Substance',
      dosage: 'Dosage',
      daily: 'Daily value',
      tabProduct: 'Description',
      tabComposition: 'Composition',
      tabNote: 'Note',
      noteDosage: 'Dosage',
      noteStorage: 'Storage',
      noteWarning: 'Important',
      noteInfo: 'Note',
      noteScrollHint: 'Swipe down',
    },
    footer: {
      desc: 'Natural supplements and vitamins made from the finest ingredients. Quality tested by time.',
      company: 'Company',
      links: ['About', 'Delivery', 'Payment', 'Contacts'],
      connect: 'Connect',
      rights: 'All rights reserved.',
      adminLink: 'Admin login',
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
      titlePre: 'من نحن',
      titleAccent: '',
      desc: 'Daruzen ليست مجرد متجر مكملات غذائية. إنها نتيجة سنوات من البحث عن أفضل التركيبات وأنقى المكونات من قلب تركيا. نحن نؤمن بأن الجودة الممتازة يجب أن تكون متاحة للجميع.',
      history: [
        { title: 'أصل الاسم', text: 'وُلد "Daruzen" من الكلمة اليونانية القديمة "daru" (δῶρον — هدية) و"zen" — رمز الانسجام والتوازن. جذرا الكلمة، بعد اندماجهما، أعطيا علامتنا اسمها.' },
        { title: 'فلسفة العلامة', text: 'الصحة ليست واجباً ولا رفاهية، بل هدية يجب الحفاظ عليها كل يوم. "Daruzen" تعني "هدية الحياة": نساعد على استعادة القوة الطبيعية والتوازن.' },
        { title: 'الطريق إلى الكمال', text: 'سنوات من البحث عن أفضل التركيبات وأنقى المكونات من قلب تركيا. نحن نؤمن بأن الجودة الممتازة يجب أن تكون متاحة للجميع.' },
      ],
      features: [
        { title: 'نقاء المكونات', desc: 'جميع منتجاتنا تخضع لرقابة مخبرية صارمة ولا تحتوي على شوائب غير ضرورية.' },
        { title: 'نهج علمي', desc: 'نتعاون مع أستاذ متخصص في مجال تطوير المكملات الغذائية والفيتامينات لتطوير جرعات فعالة وآمنة.' },
        { title: 'المعيار الذهبي', desc: 'التوريد المباشر يتيح لنا ضمان أصالة كل عبوة.' },
      ],
      brand: {
        title: 'فلسفة العلامة التجارية',
        intro: 'بالنسبة لنا، Daruzen ليست مجرد علامة تجارية. إنها فلسفة العناية بالصحة والطاقة الحيوية والتوازن الداخلي.',
        items: [
          {
            title: 'الجودة والسلامة',
            text: 'Daruzen هي علامة تجارية حديثة للمكملات الغذائية المتميزة، صُممت للأشخاص الذين يختارون الجودة والسلامة والفعالية. نختار المكونات بعناية، ونتعاون مع مصنّعين موثوقين ونلتزم بمعايير الجودة العالية في كل مرحلة.',
          },
          {
            title: 'المهمة والابتكار',
            text: 'مهمتنا هي مساعدة الناس على العناية بصحتهم من خلال التطورات العلمية الحديثة والتقنيات المبتكرة والمكونات المختارة بعناية. نسعى لكسب ثقة كل عميل من خلال تقديم منتجات تجمع بين الفعالية والسلامة والجودة التي لا تشوبها شائبة.',
          },
          {
            title: 'فلسفتنا',
            text: 'بالنسبة لنا، Daruzen ليست مجرد علامة تجارية. إنها فلسفة العناية بالصحة والطاقة الحيوية والتوازن الداخلي. كل تركيبة نصنعها تهدف إلى هدف واحد — مساعدة الناس على عيش حياة نشطة وكاملة وصحية مع الحفاظ على معايير عالية من الجودة والثقة.',
          },
        ],
      },
      why: {
        title: 'لماذا Daruzen؟',
        p1: 'اسم Daruzen مستوحى من التراث الغني للحضارة العثمانية، حيث احتلت الطب والمعرفة والرعاية الصحية مكانة خاصة. لقد أنشأنا اسماً يعكس الارتباط بتقاليد الماضي والسعي نحو معايير الجودة الحديثة.',
        p2: 'بالنسبة لنا، Daruzen هو رمز الثقة والانسجام والرعاية للإنسان. تجمع علامتنا بين احترام التراث التاريخي والتقنيات المبتكرة، مما يخلق منتجات تساعد الناس على الحفاظ على صحتهم وطاقتهم الحياتية وجودة حياتهم العالية.',
      },
    },
    contacts: {
      titlePre: 'تواصل',
      titleAccent: 'معنا',
      desc: 'هل لديك أسئلة؟ نحن دائماً على اتصال لمساعدتك في الاختيار أو الطلب.',
      office: 'مكتب في تركيا',
      officeAddr: 'Mahmutbey Mah. Ordu Cad. No: 26 3.kat İç kapı No: 21 Bağcılar/İSTANBUL',
      email: 'البريد الإلكتروني',
      emailAddr: 'daruzenshop@outlook.com',
      phone: 'الهاتف',
      phoneNum: '+90 544 679 10 12',
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
      substance: 'المادة',
      dosage: 'الجرعة',
      daily: 'القيمة اليومية',
      tabProduct: 'الوصف',
      tabComposition: 'المكونات',
      tabNote: 'ملاحظة',
      noteDosage: 'الجرعة',
      noteStorage: 'التخزين',
      noteWarning: 'مهم',
      noteInfo: 'ملاحظة',
      noteScrollHint: 'اسحب لأسفل',
    },
    footer: {
      desc: 'مكملات غذائية طبيعية وفيتامينات مصنوعة من أفضل المكونات. جودة اختبرها الزمن.',
      company: 'الشركة',
      links: ['من نحن', 'التوصيل', 'الدفع', 'اتصل بنا'],
      connect: 'تواصل',
      rights: 'جميع الحقوق محفوظة.',
      adminLink: 'تسجيل دخول المشرف',
    },
    professor: {
      title: 'Dr. Hasib Sheikh',
      subtitle: 'أستاذ مساعد، جامعة همدرد بنغلاديش',
      description: 'يعمل حالياً في Hamdard Gıda, İthalat, İhracat ve Dış Ticaret Ltd. Şirketi. Güneşli Bağlar Mah. Koçman Caddesi Gül Sokak.',
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
