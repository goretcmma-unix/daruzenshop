export default async function run(page, ui) {
  await page.waitForFunction(() => {
    const titles = [...document.querySelectorAll('h3, [class*=title]')].map(e => e.innerText);
    return titles.some(t => t.includes('Гинкго') || t.includes('Комплекс'));
  }, { timeout: 10000 });
  const cards = await page.evaluate(() => {
    return [...document.querySelectorAll('[class*=product-card], article, li')]
      .filter(e => e.querySelector('img'))
      .slice(0, 4)
      .map(c => ({
        title: c.querySelector('h3, [class*=title]')?.innerText,
        badges: [...c.querySelectorAll('span')].map(s => s.innerText.trim()).filter(Boolean).slice(0, 3),
      }));
  });
  return cards;
}
