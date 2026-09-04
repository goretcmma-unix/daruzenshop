import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const LANGS = ['ru', 'tr', 'en', 'ar'];
const SITE = 'https://drdaruzen.com';

const CATEGORY_SLUGS = ['supplements', 'vitamins', 'minerals', 'beauty', 'herbs'];

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string, hreflangs: string): string {
  return [
    '    <url>',
    '      <loc>' + loc + '</loc>',
    '      <lastmod>' + lastmod + '</lastmod>',
    '      <changefreq>' + changefreq + '</changefreq>',
    '      <priority>' + priority + '</priority>',
    hreflangs,
    '    </url>',
  ].join('\n');
}

function hreflangBlock(path: string): string {
  const lines = LANGS.map(function (hl) {
    return '      <xhtml:link rel="alternate" hreflang="' + hl + '" href="' + SITE + '/' + hl + path + '" />';
  });
  lines.push('      <xhtml:link rel="alternate" hreflang="x-default" href="' + SITE + '/en' + path + '" />');
  return lines.join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=0, must-revalidate');

  let productIds: string[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('products')
        .select('id');
      if (error) {
        console.error('Sitemap Supabase error:', error.message);
      }
      if (data) productIds = data.map((r: { id: string }) => r.id);
    } catch (e) {
      console.error('Sitemap fetch error:', e);
    }
  }

  const today = '2026-09-04';

  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  lines.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

  for (const l of LANGS) {
    lines.push(urlEntry(SITE + '/' + l + '/', today, 'weekly', '1.0', hreflangBlock('/')));
    lines.push(urlEntry(SITE + '/' + l + '/about', today, 'monthly', '0.9', hreflangBlock('/about')));
    lines.push(urlEntry(SITE + '/' + l + '/contacts', today, 'monthly', '0.7', hreflangBlock('/contacts')));
  }

  for (const slug of CATEGORY_SLUGS) {
    for (const l of LANGS) {
      lines.push(urlEntry(SITE + '/' + l + '/catalog/' + slug, today, 'weekly', '0.9', hreflangBlock('/catalog/' + slug)));
    }
  }

  for (const id of productIds) {
    for (const l of LANGS) {
      lines.push(urlEntry(SITE + '/' + l + '/product/' + id, today, 'weekly', '0.8', hreflangBlock('/product/' + id)));
    }
  }

  lines.push('</urlset>');

  res.status(200).send(lines.join('\n'));
}
