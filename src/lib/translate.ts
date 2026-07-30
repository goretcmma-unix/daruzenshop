import type { Product, Lang } from '../data';

const TARGETS: Lang[] = ['tr', 'en', 'ar'];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const translateText = async (text: string, to: Lang): Promise<string> => {
  if (!text.trim()) return '';
  const url =
    'https://api.mymemory.translated.net/get?q=' +
    encodeURIComponent(text) +
    '&langpair=ru|' + to;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    clearTimeout(timeout);
    const t = data?.responseData?.translatedText;
    return typeof t === 'string' && t ? t : '';
  } catch {
    clearTimeout(timeout);
    return '';
  }
};

export const autoTranslateFromRu = async (p: Product): Promise<Product> => {
  const result: Product = {
    ...p,
    names: { ...p.names },
    descriptions: { ...p.descriptions },
    specs: p.specs ? { ...p.specs } : undefined,
  };

  for (const to of TARGETS) {
    await delay(100);
    const [name, desc, ...specs] = await Promise.all([
      translateText(p.names.ru, to),
      translateText(p.descriptions.ru, to),
      ...(p.specs?.ru ?? []).map(line => translateText(line, to)),
    ]);
    if (name) result.names[to] = name;
    if (desc) result.descriptions[to] = desc;

    if (specs.length) {
      result.specs = {
        ...(result.specs ?? {}),
        [to]: specs.map((t, i) => t || (p.specs?.ru ?? [])[i]),
      };
    }
  }

  return result;
};
