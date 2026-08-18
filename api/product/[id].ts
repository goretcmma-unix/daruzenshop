import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE = 'https://drdaruzen.com';

const CATEGORY_LABELS: Record<string, string> = {
  supplements: 'Добавки',
  vitamins: 'Витамины',
  minerals: 'Минералы',
  beauty: 'Красота',
  herbs: 'Травы',
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
  const description = product.descriptions?.ru || product.descriptions?.en || '';
  const cat = CATEGORY_LABELS[product.categoryKey] || product.categoryKey;
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : SITE + product.image;
  const price = product.price || 0;

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8"/>
  <title>${name} — Daruzen | Купить витамины из Турции</title>
  <meta name="description" content="${name} — ${cat}. ${description.slice(0, 150)}. Daruzen — витамины и БАДы из Турции."/>
  <meta name="keywords" content="${name}, Daruzen, дарузен, турецкие витамины, ${cat}, купить витамины, БАДы"/>
  <meta property="og:title" content="${name} — Daruzen"/>
  <meta property="og:description" content="${name} — ${cat}. ${description.slice(0, 150)}"/>
  <meta property="og:image" content="${imageUrl}"/>
  <meta property="og:url" content="${SITE}/product/${id}"/>
  <meta property="og:type" content="product"/>
  <meta property="og:site_name" content="Daruzen"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${name} — Daruzen"/>
  <meta name="twitter:description" content="${name} — ${cat}"/>
  <meta name="twitter:image" content="${imageUrl}"/>
  <link rel="canonical" href="${SITE}/product/${id}"/>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": imageUrl,
    "brand": { "@type": "Brand", "name": "Daruzen" },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock",
      "url": `${SITE}/product/${id}`
    }
  })}</script>
  <meta http-equiv="refresh" content="0;url=${SITE}/product/${id}"/>
</head>
<body>
  <p>Redirecting to <a href="${SITE}/product/${id}">${name}</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(html);
}
