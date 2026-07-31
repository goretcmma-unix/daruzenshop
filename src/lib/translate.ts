import { parseCompositionLine, type Product, type Lang } from '../data';

const TARGETS: Lang[] = ['tr', 'en', 'ar'];

const UNIT_MAP: Record<Lang, Record<string, string>> = {
  ru: {},
  tr: { мкг: 'mcg', мг: 'mg', мл: 'ml', г: 'g', л: 'l', ед: 'IU', Ед: 'IU' },
  en: { мкг: 'mcg', мг: 'mg', мл: 'ml', г: 'g', л: 'l', ед: 'IU', Ед: 'IU' },
  ar: { мкг: 'مكغ', мг: 'ملغ', мл: 'مل', г: 'غ', л: 'ل', ед: 'IU', Ед: 'IU' },
};

const convertUnits = (text: string, to: Lang): string => {
  const units = UNIT_MAP[to];
  const keys = Object.keys(units).sort((a, b) => b.length - a.length);
  let out = text;
  for (const k of keys) out = out.split(k).join(units[k]);
  return out;
};

const LANGS_MAP: Record<Lang, string> = { ru: 'ru', tr: 'tr', en: 'en', ar: 'ar' };

/* ---------- providers ---------- */

async function googleTranslate(text: string, to: string, signal: AbortSignal): Promise<string | null> {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=' +
    to +
    '&dt=t&q=' +
    encodeURIComponent(text);
  const res = await fetch(url, { signal });
  const data = await res.json();
  const t = data?.[0]?.[0]?.[0];
  return typeof t === 'string' && t.trim() ? t.trim() : null;
}

async function myMemoryTranslate(text: string, to: string, signal: AbortSignal): Promise<string | null> {
  const url =
    'https://api.mymemory.translated.net/get?q=' +
    encodeURIComponent(text) +
    '&langpair=ru|' +
    to;
  const res = await fetch(url, { signal });
  const data = await res.json();
  const t = data?.responseData?.translatedText;
  return typeof t === 'string' && t.trim() ? t.trim() : null;
}

async function libretranslate(text: string, to: string, signal: AbortSignal): Promise<string | null> {
  const url = 'https://libretranslate.com/translate';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'ru', target: to, format: 'text' }),
    signal,
  });
  const data = await res.json();
  const t = data?.translatedText;
  return typeof t === 'string' && t.trim() ? t.trim() : null;
}

const PROVIDERS = [
  { name: 'google', fn: googleTranslate },
  { name: 'libre', fn: libretranslate },
  { name: 'mymemory', fn: myMemoryTranslate },
];

/* ---------- translate helper ---------- */

const translateText = async (text: string, to: Lang): Promise<string> => {
  if (!text.trim()) return '';
  const target = LANGS_MAP[to];

  for (const { name, fn } of PROVIDERS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const result = await fn(text, target, controller.signal);
      clearTimeout(timer);
      if (result) return result;
    } catch {
      clearTimeout(timer);
    }
  }
  return '';
};

/* ---------- batch translate product ---------- */

export const autoTranslateFromRu = async (p: Product): Promise<Product> => {
  const result: Product = {
    ...p,
    names: { ...p.names },
    descriptions: { ...p.descriptions },
    specs: p.specs ? { ...p.specs } : undefined,
  };

  const tasks: Promise<void>[] = [];

  for (const to of TARGETS) {
    tasks.push((async () => {
      const [name, desc] = await Promise.all([
        translateText(p.names.ru, to),
        translateText(p.descriptions.ru, to),
      ]);
      if (name) result.names[to] = name;
      if (desc) result.descriptions[to] = desc;

      const ruSpecs = p.specs?.ru ?? [];
      if (ruSpecs.length) {
        const translated = await Promise.all(
          ruSpecs.map(async line => {
            const { ingredient, dosage, daily, isHeader } = parseCompositionLine(line);
            if (isHeader) {
              const t = ingredient ? await translateText(ingredient, to) : '';
              return `# ${t || ingredient}`;
            }
            const translatedIngredient = ingredient ? await translateText(ingredient, to) : '';
            return [translatedIngredient || ingredient, convertUnits(dosage, to), convertUnits(daily, to)]
              .filter(Boolean)
              .join(' | ');
          })
        );
        result.specs = {
          ...(result.specs ?? {}),
          [to]: translated,
        };
      }
    })());
  }

  await Promise.all(tasks);

  for (const to of TARGETS) {
    if (!result.names[to]) result.names[to] = p.names.ru;
    if (!result.descriptions[to]) result.descriptions[to] = p.descriptions.ru;
  }

  return result;
};
