import type { VercelRequest, VercelResponse } from '@vercel/node';

const KEY = '95951269814c4f8cab556217091acd28';
const SITE = 'drdaruzen.com';
const KEY_LOCATION = `https://${SITE}/${KEY}.txt`;

const ALL_URLS = [
  `https://${SITE}/ru`,
  `https://${SITE}/ru/about`,
  `https://${SITE}/ru/contacts`,
  `https://${SITE}/ru/product/prod-1`,
  `https://${SITE}/ru/product/prod-2`,
  `https://${SITE}/ru/product/prod-3`,
  `https://${SITE}/ru/product/prod-4`,
  `https://${SITE}/ru/product/prod-5`,
  `https://${SITE}/ru/product/prod-6`,
  `https://${SITE}/ru/product/prod-7`,
  `https://${SITE}/ru/product/prod-8`,
  `https://${SITE}/ru/product/prod-9`,
  `https://${SITE}/ru/product/prod-10`,
  `https://${SITE}/ru/product/prod-11`,
  `https://${SITE}/ru/product/prod-12`,
  `https://${SITE}/ru/product/prod-13`,
  `https://${SITE}/ru/product/prod-14`,
  `https://${SITE}/tr`,
  `https://${SITE}/tr/about`,
  `https://${SITE}/tr/contacts`,
  `https://${SITE}/tr/product/prod-1`,
  `https://${SITE}/tr/product/prod-2`,
  `https://${SITE}/tr/product/prod-3`,
  `https://${SITE}/tr/product/prod-4`,
  `https://${SITE}/tr/product/prod-5`,
  `https://${SITE}/tr/product/prod-6`,
  `https://${SITE}/tr/product/prod-7`,
  `https://${SITE}/tr/product/prod-8`,
  `https://${SITE}/tr/product/prod-9`,
  `https://${SITE}/tr/product/prod-10`,
  `https://${SITE}/tr/product/prod-11`,
  `https://${SITE}/tr/product/prod-12`,
  `https://${SITE}/tr/product/prod-13`,
  `https://${SITE}/tr/product/prod-14`,
  `https://${SITE}/en`,
  `https://${SITE}/en/about`,
  `https://${SITE}/en/contacts`,
  `https://${SITE}/en/product/prod-1`,
  `https://${SITE}/en/product/prod-2`,
  `https://${SITE}/en/product/prod-3`,
  `https://${SITE}/en/product/prod-4`,
  `https://${SITE}/en/product/prod-5`,
  `https://${SITE}/en/product/prod-6`,
  `https://${SITE}/en/product/prod-7`,
  `https://${SITE}/en/product/prod-8`,
  `https://${SITE}/en/product/prod-9`,
  `https://${SITE}/en/product/prod-10`,
  `https://${SITE}/en/product/prod-11`,
  `https://${SITE}/en/product/prod-12`,
  `https://${SITE}/en/product/prod-13`,
  `https://${SITE}/en/product/prod-14`,
  `https://${SITE}/ar`,
  `https://${SITE}/ar/about`,
  `https://${SITE}/ar/contacts`,
  `https://${SITE}/ar/product/prod-1`,
  `https://${SITE}/ar/product/prod-2`,
  `https://${SITE}/ar/product/prod-3`,
  `https://${SITE}/ar/product/prod-4`,
  `https://${SITE}/ar/product/prod-5`,
  `https://${SITE}/ar/product/prod-6`,
  `https://${SITE}/ar/product/prod-7`,
  `https://${SITE}/ar/product/prod-8`,
  `https://${SITE}/ar/product/prod-9`,
  `https://${SITE}/ar/product/prod-10`,
  `https://${SITE}/ar/product/prod-11`,
  `https://${SITE}/ar/product/prod-12`,
  `https://${SITE}/ar/product/prod-13`,
  `https://${SITE}/ar/product/prod-14`,
  `https://${SITE}`,
];

async function submitToIndexNow(urls: string[]) {
  const engines = [
    'https://api.indexnow.org/indexnow',
  ];

  const payload = JSON.stringify({
    host: SITE,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  });

  const results = await Promise.allSettled(
    engines.map(async (endpoint) => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: payload,
      });
      return { endpoint, status: res.status, ok: res.ok };
    })
  );

  return results;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const urls: string[] = req.body?.urls || ALL_URLS;

  try {
    const results = await submitToIndexNow(urls);
    res.status(200).json({ submitted: urls.length, results });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
