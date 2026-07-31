export const IMG_W = 600;
export const IMG_H = 800;
// Стандартный масштаб = как у самых первых товаров: товар занимает ~79% высоты
// кадра, со всех сторон остаётся небольшое пустое пространство.
export const IMG_PAD = 0.105;

export const cropToStandard = (img: HTMLImageElement): HTMLCanvasElement => {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const tmp = document.createElement('canvas');
  tmp.width = iw; tmp.height = ih;
  const tctx = tmp.getContext('2d')!;
  tctx.fillStyle = '#fff';
  tctx.fillRect(0, 0, iw, ih);
  tctx.drawImage(img, 0, 0);
  const imageData = tctx.getImageData(0, 0, iw, ih);
  const px = imageData.data;
  const N = iw * ih;

  const border: number[] = [];
  for (let x = 0; x < iw; x++) border.push(x, (ih - 1) * iw + x);
  for (let y = 0; y < ih; y++) border.push(y * iw, y * iw + iw - 1);
  const rs: number[] = [], gs: number[] = [], bs: number[] = [];
  for (const p of border) { const i = p * 4; rs.push(px[i]); gs.push(px[i + 1]); bs.push(px[i + 2]); }
  const sorted = (a: number[]) => [...a].sort((x, y) => x - y);
  const bgR = sorted(rs)[Math.floor(rs.length / 2)];
  const bgG = sorted(gs)[Math.floor(gs.length / 2)];
  const bgB = sorted(bs)[Math.floor(bs.length / 2)];

  const diff = new Float32Array(N);
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    diff[p] = Math.max(Math.abs(px[i] - bgR), Math.abs(px[i + 1] - bgG), Math.abs(px[i + 2] - bgB));
  }

  const hist = new Float64Array(256);
  for (let p = 0; p < N; p++) hist[Math.min(255, Math.round(diff[p]))]++;
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0, wB = 0, best = 0, bestVar = 0;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = N - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB, mF = (sum - sumB) / wF;
    const v = wB * wF * (mB - mF) * (mB - mF);
    if (v > bestVar) { bestVar = v; best = t; }
  }
  const distThreshold = best;

  const removed = new Uint8Array(N);
  const queue = new Int32Array(N);
  let qHead = 0, qTail = 0;
  const pushP = (p: number) => { if (removed[p]) return; removed[p] = 1; queue[qTail++] = p; };
  for (let x = 0; x < iw; x++) {
    if (diff[x] <= distThreshold) pushP(x);
    const b = (ih - 1) * iw + x;
    if (diff[b] <= distThreshold) pushP(b);
  }
  for (let y = 0; y < ih; y++) {
    const l = y * iw, r = y * iw + iw - 1;
    if (diff[l] <= distThreshold) pushP(l);
    if (diff[r] <= distThreshold) pushP(r);
  }
  while (qHead < qTail) {
    const p = queue[qHead++];
    const x = p % iw, y = (p / iw) | 0;
    if (x > 0 && !removed[p - 1] && diff[p - 1] <= distThreshold) pushP(p - 1);
    if (x < iw - 1 && !removed[p + 1] && diff[p + 1] <= distThreshold) pushP(p + 1);
    if (y > 0 && !removed[p - iw] && diff[p - iw] <= distThreshold) pushP(p - iw);
    if (y < ih - 1 && !removed[p + iw] && diff[p + iw] <= distThreshold) pushP(p + iw);
  }

  let top = ih, bottom = 0, left = iw, right = 0;
  for (let p = 0; p < N; p++) {
    if (removed[p]) continue;
    const x = p % iw, y = (p / iw) | 0;
    if (y < top) top = y;
    if (y > bottom) bottom = y;
    if (x < left) left = x;
    if (x > right) right = x;
  }
  if (!(bottom > top && right > left)) { top = 0; bottom = ih; left = 0; right = iw; }
  const cw = right - left, ch = bottom - top;

  for (let p = 0; p < N; p++) {
    if (removed[p]) { const i = p * 4; px[i] = 255; px[i + 1] = 255; px[i + 2] = 255; px[i + 3] = 255; }
  }
  tctx.putImageData(imageData, 0, 0);

  const drawW = IMG_W * (1 - 2 * IMG_PAD);
  const drawH = IMG_H * (1 - 2 * IMG_PAD);
  const scale = Math.min(drawW / cw, drawH / ch);
  const sw = cw * scale, sh = ch * scale;
  const c = document.createElement('canvas');
  c.width = IMG_W; c.height = IMG_H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, IMG_W, IMG_H);
  ctx.drawImage(tmp, left, top, cw, ch, (IMG_W - sw) / 2, (IMG_H - sh) / 2, sw, sh);
  return c;
};
