import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const LANGS = ['ru', 'tr', 'en', 'ar'];
const SITE = 'https://drdaruzen.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  let productIds: string[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase
        .from('products')
        .select('id')
        .order('created_at', { ascending: false });
      if (data) productIds = data.map((r: { id: string }) => r.id);
    } catch {}
  }

  const today = new Date().toISOString().slice(0, 10);

  const staticPages = LANGS.flatMap((l) => [
    `<url><loc>${SITE}/${l}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority>
        ${LANGS.map((hl) => `<xhtml:link rel="alternate" hreflang="${hl}" href="${SITE}/${hl}/" />`).join('\n        ')}
        <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/en/" />
      </url>`,
    `<url><loc>${SITE}/${l}/about</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority>
        ${LANGS.map((hl) => `<xhtml:link rel="alternate" hreflang="${hl}" href="${SITE}/${hl}/about" />`).join('\n        ')}
        <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/en/about" />
      </url>`,
    `<url><loc>${SITE}/${l}/contacts</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority>
        ${LANGS.map((hl) => `<xhtml:link rel="alternate" hreflang="${hl}" href="${SITE}/${hl}/contacts" />`).join('\n        ')}
        <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/en/contacts" />
      </url>`,
  ]);

  const productUrls = productIds.map((id) => {
    const langUrls = LANGS.map(
      (l) => `<url><loc>${SITE}/${l}/product/${id}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>
        ${LANGS.map((hl) => `<xhtml:link rel="alternate" hreflang="${hl}" href="${SITE}/${hl}/product/${id}" />`).join('\n        ')}
        <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/en/product/${id}" />
      </url>`
    ).join('\n    ');

    return langUrls;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${staticPages.join('\n  ')}
  ${productUrls.join('\n  ')}
</urlset>`;

  res.status(200).send(xml);
}
