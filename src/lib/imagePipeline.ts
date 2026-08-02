export const IMG_W = 600;
export const IMG_H = 800;
// Стандартный масштаб = как у самых первых товаров: товар занимает ~79% высоты
// кадра, со всех сторон остаётся небольшое пустое пространство.
export const IMG_PAD = 0.105;

// Вписывает исходное фото в стандартный кадр. Обрезаются только однотонные
// поля по краям (чтобы товар занимал кадр), без удаления фона внутри — никаких
// артефактов заливки и «экспозиции».
export const cropToStandard = (img: HTMLImageElement): HTMLCanvasElement => {
  let iw = img.naturalWidth, ih = img.naturalHeight;
  if (!iw || !ih) {
    const empty = document.createElement('canvas');
    empty.width = IMG_W;
    empty.height = IMG_H;
    return empty;
  }
  const MAX_DIM = 1600;
  const s = Math.min(1, MAX_DIM / Math.max(iw, ih));
  iw = Math.round(iw * s);
  ih = Math.round(ih * s);
  const tmp = document.createElement('canvas');
  tmp.width = iw; tmp.height = ih;
  const tctx = tmp.getContext('2d')!;
  tctx.fillStyle = '#fff';
  tctx.fillRect(0, 0, iw, ih);
  tctx.drawImage(img, 0, 0, iw, ih);
  const imageData = tctx.getImageData(0, 0, iw, ih);
  const px = imageData.data;

  // Цвет фона = медиана по рамке изображения
  const border: number[] = [];
  for (let x = 0; x < iw; x++) border.push(x, (ih - 1) * iw + x);
  for (let y = 0; y < ih; y++) border.push(y * iw, y * iw + iw - 1);
  const rs: number[] = [], gs: number[] = [], bs: number[] = [];
  for (const p of border) { const i = p * 4; rs.push(px[i]); gs.push(px[i + 1]); bs.push(px[i + 2]); }
  const sorted = (a: number[]) => [...a].sort((x, y) => x - y);
  const bgR = sorted(rs)[Math.floor(rs.length / 2)];
  const bgG = sorted(gs)[Math.floor(gs.length / 2)];
  const bgB = sorted(bs)[Math.floor(bs.length / 2)];

  const THRESH = 48;
  const isBg = (i: number) =>
    Math.max(Math.abs(px[i] - bgR), Math.abs(px[i + 1] - bgG), Math.abs(px[i + 2] - bgB)) < THRESH;

  const rowBg = (y: number): boolean => {
    const o = y * iw;
    for (let x = 0; x < iw; x++) if (!isBg((o + x) * 4)) return false;
    return true;
  };
  const colBg = (x: number): boolean => {
    for (let y = 0; y < ih; y++) if (!isBg((y * iw + x) * 4)) return false;
    return true;
  };

  let top = 0; while (top < ih - 1 && rowBg(top)) top++;
  let bottom = ih - 1; while (bottom > top && rowBg(bottom)) bottom--;
  let left = 0; while (left < iw - 1 && colBg(left)) left++;
  let right = iw - 1; while (right > left && colBg(right)) right--;

  // Фото полностью однотонное — оставляем как есть
  if (right <= left || bottom <= top) { left = 0; top = 0; right = iw - 1; bottom = ih - 1; }

  const cw = right - left + 1, ch = bottom - top + 1;

  const c = document.createElement('canvas');
  c.width = IMG_W; c.height = IMG_H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, IMG_W, IMG_H);

  const drawW = IMG_W * (1 - 2 * IMG_PAD);
  const drawH = IMG_H * (1 - 2 * IMG_PAD);
  const scale = Math.min(drawW / cw, drawH / ch);
  const sw = cw * scale, sh = ch * scale;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(tmp, left, top, cw, ch, (IMG_W - sw) / 2, (IMG_H - sh) / 2, sw, sh);
  return c;
};
