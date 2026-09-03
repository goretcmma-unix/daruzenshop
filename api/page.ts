import type { VercelRequest, VercelResponse } from '@vercel/node';

const SITE = 'https://drdaruzen.com';

type Lang = 'ru' | 'tr' | 'en' | 'ar';
const ALL_LANGS: Lang[] = ['ru', 'tr', 'en', 'ar'];

const PAGE_TITLE: Record<string, Record<Lang, string>> = {
  about: {
    ru: 'О бренде Daruzen — Качество, безопасность, эффективность | Daruzen',
    tr: 'Daruzen Hakkında — Kalite, Güvenlik, Etkinlik | Daruzen',
    en: 'About Daruzen — Quality, Safety, Effectiveness | Daruzen',
    ar: 'حول داروزن — الجودة، الأمان، الفعالية | داروزن',
  },
  contacts: {
    ru: 'Контакты Daruzen — Офис в Турции, телефон, e-mail | Daruzen',
    tr: 'Daruzen İletişim — Türkiye Ofisi, Telefon, E-posta | Daruzen',
    en: 'Daruzen Contacts — Turkey Office, Phone, E-mail | Daruzen',
    ar: 'اتصل بداروزن — مكتب تركيا، هاتف، بريد إلكتروني | داروزن',
  },
};

const PAGE_DESC: Record<string, Record<Lang, string>> = {
  about: {
    ru: 'Daruzen — это современный бренд премиальных пищевых добавок из Турции. Качество, безопасность и эффективность в каждой формуле.',
    tr: 'Daruzen, Türkiye\'den premium besin takviyeleri üreten modern bir markadır. Kalite, güvenlik ve etkinlik her formülde.',
    en: 'Daruzen is a modern premium food supplement brand from Turkey. Quality, safety and effectiveness in every formula.',
    ar: 'داروزن هي علامة تجارية حديثة للمكملات الغذائية المميزة من تركيا. الجودة والأمان والفعالية في كل تركيبة.',
  },
  contacts: {
    ru: 'Свяжитесь с Daruzen: офис в Стамбуле, Турция. Телефон +90 544 679 10 12, e-mail daruzenshop@outlook.com.',
    tr: 'Daruzen ile iletişime geçin: İstanbul, Türkiye ofisi. Telefon +90 544 679 10 12, e-posta daruzenshop@outlook.com.',
    en: 'Contact Daruzen: Istanbul, Turkey office. Phone +90 544 679 10 12, e-mail daruzenshop@outlook.com.',
    ar: 'تواصل مع داروزن: مكتب إسطنبول، تركيا. الهاتف +90 544 679 10 12، البريد daruzenshop@outlook.com.',
  },
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isBot(ua: string | undefined): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return /googlebot|bingbot|yandex|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|applebot|whatsapp|telegrambot|ai\.yandex|duckduckbot|baidu|sogou|petalbot/i.test(lower);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const page = (req.query.page as string) || '';
  const allowed = page === 'about' || page === 'contacts';
  if (!allowed) return res.status(404).send('Page not found');

  let lang: Lang = 'ru';
  if (ALL_LANGS.includes(req.query.lang as Lang)) {
    lang = req.query.lang as Lang;
  }

  const ua = req.headers['user-agent'];
  const bot = isBot(ua);

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

  const title = PAGE_TITLE[page][lang];
  const description = PAGE_DESC[page][lang];
  const canonical = `${SITE}/${lang}/${page}`;

  const hreflangTags = ALL_LANGS
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/${page}" />`)
    .join('\n    ');
  const hreflangXDefault = `<link rel="alternate" hreflang="x-default" href="${SITE}/ru/${page}" />`;

  const locale = lang === 'ru' ? 'ru_RU' : lang === 'tr' ? 'tr_TR' : lang === 'ar' ? 'ar_SA' : 'en_US';
  const navHome = lang === 'ru' ? 'Главная' : lang === 'tr' ? 'Ana Sayfa' : lang === 'ar' ? 'الرئيسية' : 'Home';
  const navLabel = page === 'about'
    ? (lang === 'ru' ? 'О нас' : lang === 'tr' ? 'Hakkımızda' : lang === 'ar' ? 'من نحن' : 'About')
    : (lang === 'ru' ? 'Контакты' : lang === 'tr' ? 'İletişim' : lang === 'ar' ? 'اتصل بنا' : 'Contacts');
  const openText = lang === 'ru' ? 'Открыть на сайте Daruzen' : lang === 'tr' ? 'Daruzen sitesinde aç' : lang === 'ar' ? 'فتح على موقع داروزن' : 'Open on Daruzen website';
  const homeHref = `${SITE}/${lang}`;

  const BODY: Record<string, Record<Lang, string>> = {
    about: {
      ru: 'Daruzen — это современный бренд премиальных пищевых добавок, созданный для людей, которые выбирают качество, безопасность и эффективность. Мы тщательно подбираем ингредиенты, сотрудничаем с надежными производителями и придерживаемся высоких стандартов качества на каждом этапе.',
      tr: 'Daruzen, kalite, güvenlik ve etkinliği seçen insanlar için üretilmiş modern bir premium besin takviyesi markasıdır. İçerikleri özenle seçiyor, güvenilir üreticilerle çalışıyor ve her aşamada yüksek kalite standartlarına bağlı kalıyoruz.',
      en: 'Daruzen is a modern premium food supplement brand created for people who choose quality, safety and effectiveness. We carefully select ingredients, work with reliable manufacturers and maintain high quality standards at every stage.',
      ar: 'داروزن هي علامة تجارية حديثة للمكملات الغذائية المميزة ابتُكرت للأشخاص الذين يختارون الجودة والأمان والفعالية. نختار المكونات بعناية، ونعمل مع مصنّعين موثوقين، ونلتزم بمعايير الجودة العالية في كل مرحلة.',
    },
    contacts: {
      ru: 'Офис: Mahmutbey Mah. Ordu Cad. No: 26, 3.kat, İç kapı No: 21, Bağcılar, İstanbul, Турция. Телефон: +90 544 679 10 12. E-mail: daruzenshop@outlook.com.',
      tr: 'Ofis: Mahmutbey Mah. Ordu Cad. No: 26, 3.kat, İç kapı No: 21, Bağcılar, İstanbul, Türkiye. Telefon: +90 544 679 10 12. E-posta: daruzenshop@outlook.com.',
      en: 'Office: Mahmutbey Mah. Ordu Cad. No: 26, 3.kat, İç kapı No: 21, Bağcılar, Istanbul, Turkey. Phone: +90 544 679 10 12. E-mail: daruzenshop@outlook.com.',
      ar: 'المكتب: محمودبي، شارع أوردو رقم 26، الطابق 3، بـغجلار، إسطنبول، تركيا. الهاتف: +90 544 679 10 12. البريد: daruzenshop@outlook.com.',
    },
  };

  const bodyText = BODY[page][lang];

  const html = `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${esc(canonical)}" />
    ${hreflangTags}
    ${hreflangXDefault}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${SITE}/images/og-image.png" />
    <meta property="og:site_name" content="Daruzen" />
    <meta property="og:locale" content="${locale}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=8" />
    <meta name="theme-color" content="#cf9b41" />
  </head>
  <body>
    <div style="max-width:900px;margin:0 auto;padding:24px 20px;font-family:sans-serif">
      <p><a href="${esc(homeHref)}">${esc(navHome)}</a> &gt; ${esc(navLabel)}</p>
      <h1>${esc(title.replace(/\s*\|\s*Daruzen\s*$/, ''))}</h1>
      <p>${esc(description)}</p>
      <p>${esc(bodyText)}</p>
      <p><a href="${esc(canonical)}">${esc(openText)}</a></p>
    </div>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=0, max-age=300');
  res.setHeader('Vary', 'User-Agent');
  res.status(200).send(html);
}
