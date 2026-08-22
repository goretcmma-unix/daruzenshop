const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Bump corner radius on the white rect
const f = path.join(__dirname, 'public', 'favicon.svg');
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/id="object-1" fill="url\(#glass\)"/, 'rx="50" ry="50"');
fs.writeFileSync(f, c, 'utf8');

// Now regenerate icons
let svg = c;
svg = svg.replace(/<bx:export>[\s\S]*?<\/bx:export>/g, '');
svg = svg.replace(/xmlns:bx="[^"]*"\s*/g, '');
const svgBuf = Buffer.from(svg);
const pub = path.join(__dirname, 'public');

async function run() {
  const sizes = [16, 32, 48, 96, 120, 144, 192, 512];
  for (const s of sizes) {
    await sharp(svgBuf).resize(s, s).png().toFile(path.join(pub, 'favicon-' + s + '.png'));
  }
  await sharp(svgBuf).resize(512, 512).png().toFile(path.join(pub, 'favicon.png'));
  await sharp(svgBuf).resize(512, 512).png().toFile(path.join(pub, 'search-icon.png'));

  const icoSizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of icoSizes) {
    pngBuffers.push(await sharp(svgBuf).resize(s, s).png().toBuffer());
  }
  const headerLen = 6, dirEntryLen = 16;
  const dirLen = headerLen + dirEntryLen * icoSizes.length;
  let dataOffset = dirLen;
  const entries = [];
  for (let i = 0; i < icoSizes.length; i++) {
    entries.push({ size: icoSizes[i], data: pngBuffers[i], offset: dataOffset });
    dataOffset += pngBuffers[i].length;
  }
  const buf = Buffer.alloc(dataOffset);
  buf.writeUInt16LE(0, 0); buf.writeUInt16LE(1, 2); buf.writeUInt16LE(icoSizes.length, 4);
  for (let i = 0; i < entries.length; i++) {
    const off = headerLen + i * dirEntryLen, e = entries[i];
    buf.writeUInt8(e.size, off); buf.writeUInt8(e.size, off + 1);
    buf.writeUInt16LE(0, off + 2); buf.writeUInt16LE(1, off + 4); buf.writeUInt16LE(32, off + 6);
    buf.writeUInt32LE(e.data.length, off + 8); buf.writeUInt32LE(e.offset, off + 12);
  }
  for (const e of entries) e.data.copy(buf, e.offset);
  fs.writeFileSync(path.join(pub, 'favicon.ico'), buf);
  console.log('All icons done');
}
run().catch(e => console.error(e));
