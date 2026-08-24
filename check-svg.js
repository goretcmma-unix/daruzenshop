const fs = require('fs');
const svg = fs.readFileSync('public/favicon.svg', 'utf8');
const paths = svg.match(/<path[^>]*>/g);
console.log('Total paths:', paths ? paths.length : 0);
if (paths) {
  paths.forEach((p, i) => {
    const fillMatch = p.match(/fill[=:]["']?([^;"'>\s]+)/);
    const fill = fillMatch ? fillMatch[1] : 'inherited';
    const idMatch = p.match(/id=["']([^"']+)/);
    const id = idMatch ? idMatch[1] : '';
    const dMatch = p.match(/d=["']([^"']{0,80})/);
    const d = dMatch ? dMatch[1] : '';
    console.log('Path', i, '| id:', id, '| fill:', fill, '| d:', d + '...');
  });
}
