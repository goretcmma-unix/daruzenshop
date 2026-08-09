import re

with open('src\\AppStyles.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken indentation on .hero-section::before lines in mobile media queries
content = re.sub(
    r'^(\s*\.hero-section::before \{)\s*$',
    r'      .hero-section::before {',
    content,
    flags=re.MULTILINE
)

with open('src\\AppStyles.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Indentation fixed!')
