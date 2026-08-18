import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const CATEGORY_META: Record<string, { label: string; titleSuffix: string; descSuffix: string; keywords: string }> = {
  supplements: {
    label: 'Добавки',
    titleSuffix: 'Купить БАДы из Турции — цена, отзывы | Daruzen',
    descSuffix: 'БАДы и добавки из Турции с доставкой. Натуральные добавки для здоровья, похудения, иммунитета.',
    keywords: 'БАДы, добавки, турецкие БАДы, натуральные добавки, добавки из Турции, купить БАДы, БАДы для здоровья, добавки для похудения, добавки для иммунитета',
  },
  vitamins: {
    label: 'Витамины',
    titleSuffix: 'Купить витамины из Турции — цена | Daruzen',
    descSuffix: 'Витамины из Турции с доставкой. Витамины для иммунитета, здоровья, красоты. Оригинальные турецкие витамины.',
    keywords: 'витамины, турецкие витамины, витамины из Турции, купить витамины, витамины для иммунитета, витамины для здоровья, витамины недорого',
  },
  minerals: {
    label: 'Минералы',
    titleSuffix: 'Купить минералы из Турции — цена | Daruzen',
    descSuffix: 'Минеральные добавки из Турции. Магний, цинк, железо, кальций — оригинальные турецкие минералы.',
    keywords: 'минералы, турецкие минералы, магний, цинк, железо, кальций, купить минералы, минералы из Турции',
  },
  beauty: {
    label: 'Красота',
    titleSuffix: 'Добавки для красоты из Турции — купить | Daruzen',
    descSuffix: 'Добавки для красоты и ухода из Турции. Коллаген, биотин, витамины для кожи, волос и ногтей.',
    keywords: 'красота, коллаген, биотин, витамины для кожи, витамины для волос, добавки для красоты, турецкие добавки для красоты',
  },
  herbs: {
    label: 'Травы',
    titleSuffix: 'Травяные добавки из Турции — купить | Daruzen',
    descSuffix: 'Натуральные травяные добавки из Турции. Травяные экстракты для здоровья и иммунитета.',
    keywords: 'травы, травяные добавки, экстракты, натуральные добавки, травяные экстракты из Турции, турецкие травы',
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) return res.status(400).send('Missing product id');

  let product: any = null;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      product = data;
    } catch {}
  }

  if (!product) return res.status(404).send('Product not found');

  const name = product.names?.ru || product.names?.en || id;
  const desc = product.descriptions?.ru || product.descriptions?.en || '';
  const meta = CATEGORY_META[product.categoryKey] || CATEGORY_META.supplements;
  const imageUrl = product.image?.startsWith('http') ? product.image : SITE + product.image;
  const price = product.price || 0;

  const title = `${name} — ${meta.titleSuffix}`;
  const description = `${name} — ${meta.descSuffix} ${desc.slice(0, 120)}`;
  const keywords = `${name}, ${meta.keywords}, дарузен, daruzen`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": desc,
    "image": imageUrl,
    "brand": { "@type": "Brand", "name": "Daruzen" },
    "category": meta.label,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock",
      "url": `${SITE}/product/${id}`,
      "seller": { "@type": "Organization", "name": "Daruzen" }
    }
  });

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <meta name="description" content="${description}"/>
  <meta name="keywords" content="${keywords}"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image" content="${imageUrl}"/>
  <meta property="og:url" content="${SITE}/product/${id}"/>
  <meta property="og:type" content="product"/>
  <meta property="og:site_name" content="Daruzen"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${imageUrl}"/>
  <link rel="canonical" href="${SITE}/product/${id}"/>
  <script type="application/ld+json">${jsonLd}</script>
  <meta http-equiv="refresh" content="0;url=${SITE}/product/${id}"/>
</head>
<body>
  <p>Переход на <a href="${SITE}/product/${id}">${name}</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(html);
}
