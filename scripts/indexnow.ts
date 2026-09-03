// Локальный запуск IndexNow: тянет все URL из живого sitemap и отправляет
// в поисковые системы, поддерживающие IndexNow (Яндекс, Bing и др.).
// Запуск: npm run indexnow

const SITE = 'https://drdaruzen.com';
const KEY = '95951269814c4f8cab556217091acd28';
const HOST = 'drdaruzen.com';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const SITEMAP_URL = `${SITE}/api/sitemap`;

const ENGINES = ['https://api.indexnow.org/indexnow', 'https://yandex.com/indexnow'];

async function fetchAllUrls(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const unique = [...new Set(urls)];
  // Приводим главные страницы к каноническому виду без завершающего "/"
  return unique.map((u) => (u === `${SITE}/` ? SITE : u.replace(/\/$/, '')));
}

async function submit(urls: string[]) {
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls });
  const results = await Promise.allSettled(
    ENGINES.map(async (endpoint) => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      });
      return { endpoint, status: res.status, ok: res.ok };
    })
  );
  return results;
}

try {
  const urls = await fetchAllUrls();
  console.log(`URL из sitemap: ${urls.length}`);
  console.log('Образцы:', urls.slice(0, 3), '…');
  const results = await submit(urls);
  let submitted = 0;
  for (const r of results) {
    if (r.status === 'fulfilled') {
      const v = r.value;
      console.log(`  ${v.endpoint} -> ${v.status} ok=${v.ok}`);
      if (v.ok) submitted++;
    } else {
      console.log(`  ERR: ${r.reason}`);
    }
  }
  console.log(`Готово: отправлено в ${submitted} из ${ENGINES.length} поисковых систем (${urls.length} URL).`);
} catch (err) {
  console.error('Ошибка:', err);
  process.exit(1);
}
