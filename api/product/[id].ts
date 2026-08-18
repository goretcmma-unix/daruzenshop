import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const CATEGORY_LABELS: Record<string, string> = {
  supplements: 'БАД',
  vitamins: 'Витамины',
  minerals: 'Минералы',
  beauty: 'Добавки для красоты',
  herbs: 'Травяная добавка',
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
  const catLabel = CATEGORY_LABELS[product.categoryKey] || 'Добавки';
  const imageUrl = product.image?.startsWith('http') ? product.image : SITE + product.image;
  const price = product.price || 0;

  const firstSentence = desc.split(/[.!]\s/)[0] || '';

  const title = `${name} — купить ${catLabel.toLowerCase()} из Турции | Daruzen`;
  const description = `${name}. ${firstSentence}. Купить с доставкой из Турции. Daruzen — оригинал по лучшей цене.`;
  const keywords = `${name}, ${catLabel.toLowerCase()} из турции, купить ${catLabel.toLowerCase()}, ${name} купить, турция витамины, дарузен, daruzen, ${firstSentence}`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": desc,
    "image": [imageUrl],
    "sku": id,
    "mpn": id,
    "brand": { "@type": "Brand", "name": "Daruzen" },
    "category": catLabel,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "12"
    },
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
</head>
<body>
  <h1>${name}</h1>
  <p>${desc}</p>
  <p><strong>Цена:</strong> ${price} ₽</p>
  <p><img src="${imageUrl}" alt="${name}" width="600"/></p>
  <noscript><p>Включите JavaScript для полноценного просмотра.</p></noscript>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(html);
}
