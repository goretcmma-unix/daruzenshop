import { useEffect, useState } from 'react';
import { cropToStandard, IMG_W, IMG_H } from './imagePipeline';

const memory = new Map<string, Promise<string>>();

const cacheKey = (src: string): string => {
  let h = 5381;
  for (let i = 0; i < src.length; i++) h = ((h * 33) ^ src.charCodeAt(i)) >>> 0;
  return 'daruzen:img4:' + h + ':' + src.length;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('load failed'));
    img.decoding = 'async';
    img.src = src;
  });

export const getNormalizedImage = (src: string): Promise<string> => {
  const cached = memory.get(src);
  if (cached) return cached;

  const key = cacheKey(src);
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const p = Promise.resolve(stored);
      memory.set(src, p);
      return p;
    }
  } catch { /* localStorage недоступен */ }

  const p = (async () => {
    try {
      const img = await loadImage(src);
      if (img.naturalWidth === IMG_W && img.naturalHeight === IMG_H) {
        return src;
      }
      const dataUrl = cropToStandard(img).toDataURL('image/webp', 0.95);
      try { localStorage.setItem(key, dataUrl); } catch { /* переполнение/приватный режим */ }
      return dataUrl;
    } catch {
      return src;
    }
  })();
  memory.set(src, p);
  return p;
};

export const useNormalizedImage = (src: string | undefined): string | undefined => {
  const [out, setOut] = useState<string | undefined>(src);
  const [prevSrc, setPrevSrc] = useState<string | undefined>(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setOut(src);
  }
  useEffect(() => {
    if (!src) return;
    let live = true;
    getNormalizedImage(src).then(n => { if (live) setOut(n); });
    return () => { live = false; };
  }, [src]);
  return out;
};
