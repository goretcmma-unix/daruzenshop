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

let cachedAssets: string | null = null;
let cacheTime = 0;

async function getAssets(): Promise<string> {
  if (cachedAssets && Date.now() - cacheTime < 60000) return cachedAssets;
  try {
    const resp = await fetch(SITE, { redirect: 'follow' });
    const html = await resp.text();
    const bodyMatch = html.match(/<body[\s\S]*?<\/body>/);
    if (!bodyMatch) return '';
    const body = bodyMatch[0];
    const tags: string[] = [];
    const scriptRegex = /<script[^>]*src="([^"]+)"[^>]*><\/script>/g;
    const moduleRegex = /<script[^>]*src="([^"]+)"[^>]*>/g;
    const linkRegex = /<link[^>]*href="([^"]+)"[^>]*>/g;
    let m;
    while ((m = scriptRegex.exec(body)) !== null) tags.push(m[0]);
    while ((m = moduleRegex.exec(body)) !== null) if (!tags.includes(m[0])) tags.push(m[0]);
    const headMatch = html.match(/<head[\s\S]*?<\/head>/);
    if (headMatch) {
      const head = headMatch[0];
      while ((m = linkRegex.exec(head)) !== null) {
        if (m[1].includes('/assets/') && !m[1].includes('fonts.googleapis')) tags.push(m[0]);
      }
    }
    cachedAssets = tags.join('\n    ');
    cacheTime = Date.now();
    return cachedAssets;
  } catch {
    return '';
  }
}

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": desc,
    "image": [imageUrl],
    "sku": id,
    "mpn": id,
    "brand": { "@type": "Brand", "name": "Daruzen" },
    "category": catLabel,
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "12" },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock",
      "url": `${SITE}/product/${id}`,
      "seller": { "@type": "Organization", "name": "Daruzen" }
    }
  };

  const assets = await getAssets();

  const html = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="keywords" content="${esc(keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${SITE}/product/${id}" />
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${SITE}/product/${id}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="600" />
    <meta property="og:site_name" content="Daruzen" />
    <meta property="og:locale" content="ru_RU" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
 <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192.png" />
    <meta name="theme-color" content="#cf9b41" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Cairo:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="manifest" href="/manifest.json" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Daruzen","url":"${SITE}","logo":"${SITE}/images/dr.svg.png"}</script>
    <script>history.scrollRestoration='manual'</script>
    ${assets}
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <div style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:sans-serif">
        <h1>${esc(name)}</h1>
        <p>${esc(desc)}</p>
        <p><strong>Цена:</strong> ${price} ₽</p>
        <p><img src="${imageUrl}" alt="${esc(name)}" width="600" /></p>
        <p><a href="${SITE}/product/${id}">Открыть на сайте Daruzen</a></p>
      </div>
    </noscript>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(html);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
