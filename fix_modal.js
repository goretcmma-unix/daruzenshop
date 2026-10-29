const fs = require('fs');
const p = 'src/components/ProductModal.tsx';
let c = fs.readFileSync(p, 'utf8');

// Find the modal-info-wrapper line
const target = '<div class="modal-info-wrapper">';
const idx = c.indexOf(target);
if (idx === -1) {
  console.log('NOT FOUND');
  process.exit(1);
}

// Find line start
const lineStart = c.lastIndexOf('\n', idx) + 1;
const lineContent = c.substring(lineStart, idx + target.length);
console.log('Line to replace:', JSON.stringify(lineContent));

const oldLine = lineContent;
const newLine =
  '                  <ShareButton\n' +
  '                    iconOnly\n' +
  '                    title={selectedProduct.name}\n' +
  '                    text={selectedProduct.description}\n' +
  '                    url={`https://drdaruzen.com/${lang}/product/${selectedProduct.id}`}\n' +
  '                  />\n' +
  '                  <div class="modal-info-wrapper">';

c = c.replace(oldLine, newLine);
fs.writeFileSync(p, c, 'utf8');
console.log('SUCCESS: ShareButton iconOnly added to ProductModal.tsx');
