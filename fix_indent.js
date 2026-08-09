const fs = require('fs');
const filePath = 'src/AppStyles.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix broken indentation on .hero-section::before lines
content = content.replace(
  /^\s+\.hero-section::before \{/gm,
  '      .hero-section::before {'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Indentation fixed!');
