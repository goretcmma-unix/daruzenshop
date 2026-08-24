const fs = require('fs');
const sharp = require('sharp');
const svg = fs.readFileSync('public/favicon.svg', 'utf8');
const buf = Buffer.from(svg, 'utf8');
const sizes = [16,32,48,96,120,144,180,192,512];
Promise.all(sizes.map(s => sharp(buf).resize(s,s).png().toFile('public/favicon-'+s+'.png')))
  .then(() => sharp(buf).resize(512,512).png().toFile('public/favicon.png'))
  .then(() => { fs.copyFileSync('public/favicon-48.png', 'public/favicon.ico'); console.log('all done'); });