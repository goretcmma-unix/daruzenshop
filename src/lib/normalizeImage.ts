import { useEffect, useState } from 'react';
import { cropToStandard, IMG_W, IMG_H, IMG_PAD } from './imagePipeline';

const memory = new Map<string, Promise<string>>();

const cacheKey = (src: string): string => {
  let h = 5381;
  for (let i = 0; i < src.length; i++) h = ((h * 33) ^ src.charCodeAt(i)) >>> 0;
  return 'daruzen:img2:' + h + ':' + src.length;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('load failed'));
    img.decoding = 'async';
    img.src = src;
  });

const drawToCanvas = (img: HTMLImageElement): { canvas: HTMLCanvasElement; data: Uint8ClampedArray } => {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = iw; c.height = ih;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return { canvas: c, data: ctx.getImageData(0, 0, iw, ih).data };
};

// Безопасная оценка границ товара: порог по яркости (не flood-fill), чтобы
// не срезать светлые участки (верх мармеладок/светлых упаковок).
const SAFE_LUM = 242;
const MIN_STANDARD = 0.65;

const measureSafeBox = (img: HTMLImageElement): { left: number; top: number; right: number; bottom: number } | null => {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const { data } = drawToCanvas(img);
  let top = ih, bottom = 0, left = iw, right = 0;
  for (let y = 0; y < ih; y++) {
    for (let x = 0; x < iw; x++) {
      const p = (y * iw + x) * 4;
      const l = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
      if (l < SAFE_LUM) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  if (bottom <= top || right <= left) return null;
  return { left, top, right, bottom };
};

// Кроп к боксу товара и вписывание в стандартный кадр. Без flood-fill —
// только масштабирование, поэтому верх товара никогда не «закрашивается».
const fitToStandard = (img: HTMLImageElement, box: { left: number; top: number; right: number; bottom: number }): string => {
  const PAD = 3;
  const left = Math.max(0, box.left - PAD);
  const top = Math.max(0, box.top - PAD);
  const right = Math.min(img.naturalWidth, box.right + PAD);
  const bottom = Math.min(img.naturalHeight, box.bottom + PAD);
  const cw = right - left, ch = bottom - top;

  const drawW = IMG_W * (1 - 2 * IMG_PAD);
  const drawH = IMG_H * (1 - 2 * IMG_PAD);
  const scale = Math.min(drawW / cw, drawH / ch);
  const sw = cw * scale, sh = ch * scale;

  const c = document.createElement('canvas');
  c.width = IMG_W; c.height = IMG_H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, IMG_W, IMG_H);
  ctx.drawImage(img, left, top, cw, ch, (IMG_W - sw) / 2, (IMG_H - sh) / 2, sw, sh);
  return c.toDataURL('image/webp', 0.85);
};

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
      const iw = img.naturalWidth, ih = img.naturalHeight;
      if (iw === IMG_W && ih === IMG_H) {
        const box = measureSafeBox(img);
        const hPct = box ? (box.bottom - box.top) / ih : 1;
        if (hPct >= MIN_STANDARD) {
          // Уже стандартный масштаб — не трогаем (иначе срезается светлый верх)
          return src;
        }
        const dataUrl = fitToStandard(img, box!);
        try { localStorage.setItem(key, dataUrl); } catch { /* переполнение/приватный режим */ }
        return dataUrl;
      }
      const dataUrl = cropToStandard(img).toDataURL('image/webp', 0.85);
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
