import type { Product, Lang } from '../data';

const TARGETS: Lang[] = ['tr', 'en', 'ar'];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const translateText = async (text: string, to: Lang): Promise<string> => {
  if (!text.trim()) return '';
  const url =
    'https://api.mymemory.translated.net/get?q=' +
    encodeURIComponent(text) +
    '&langpair=ru|' + to;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const t = data?.responseData?.translatedText;
    return typeof t === 'string' && t ? t : '';
  } catch {
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
    await delay(250);
    const [name, desc] = await Promise.all([
      translateText(p.names.ru, to),
      translateText(p.descriptions.ru, to),
    ]);
    if (name) result.names[to] = name;
    if (desc) result.descriptions[to] = desc;

    const ruSpecs = p.specs?.ru ?? [];
    if (ruSpecs.length) {
      const translated: string[] = [];
      for (const line of ruSpecs) {
        await delay(150);
        const t = await translateText(line, to);
        translated.push(t || line);
      }
      result.specs = { ...(result.specs ?? {}), [to]: translated };
    }
  }

  return result;
};
