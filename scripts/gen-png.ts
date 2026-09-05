import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGE_DIR = 'public/images';
const files = [
  'acv.webp', 'bso.webp', 'chasteberry.webp', 'dnl__.webp',
  'enginar__.webp', 'gimne.webp', 'ginko_ginseng.webp',
  'ironbis_soft.webp', 'magnez.webp', 'multigummy.webp', 'nadh_gummy.webp',
  'omg.webp', 'optimacomplex.webp', 'zincpng.webp',
];

(async () => {
  for (const f of files) {
    const src = path.join(IMAGE_DIR, f);
    if (!fs.existsSync(src)) { console.log('MISS', f); continue; }
    const name = f.replace(/\.webp$/i, '');
    const out = path.join(IMAGE_DIR, name + '-1200.png');
    const meta = await sharp(src).metadata();
    if (meta.width === 1200 && meta.height === 1600) {
      console.log('SKIP (already 1200x1600)', name);
      continue;
    }
    await sharp(src)
      .resize({ width: 1200, height: 1600, fit: 'fill' })
      .png({ compressionLevel: 9, palette: true, colors: 256 })
      .toFile(out);
    console.log('OK', name, '->', out);
  }
})().catch((e) => { console.error(e); process.exit(1); });