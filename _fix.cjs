const fs = require('fs');
const path = require('path');

const f = path.join(__dirname, 'public', 'favicon.svg');
let c = fs.readFileSync(f, 'utf8');

// Add glass gradient + shine overlay for the white rect
const glassGrad = '<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="15%" stop-color="#fafafa"/><stop offset="50%" stop-color="#e8e8e8"/><stop offset="100%" stop-color="#c8c8c8"/></linearGradient>';

c = c.replace('<filter id="blur">', glassGrad + '<filter id="blur">');

// Replace white rect fill with glass gradient
c = c.replace(
  'style="fill: rgb(255, 255, 255);" rx="30" ry="30" filter="url(#blur)" id="object-1"',
  'rx="30" ry="30" filter="url(#blur)" id="object-1" fill="url(#glass)"'
);

fs.writeFileSync(f, c, 'utf8');
console.log('SVG updated');
