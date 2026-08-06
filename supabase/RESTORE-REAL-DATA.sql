-- ВОССТАНОВЛЕНИЕ НАСТОЯЩИХ ДАННЫХ ИЗ data.ts
-- Выполни этот SQL для восстановления правильных названий и фото

-- 1. Сначала проверь что есть в базе
SELECT id, name_ru, image FROM products ORDER BY sort_order DESC;

-- 2. Обновляем правильные названия и фото для товаров
UPDATE products SET
  name_ru = CASE id
    WHEN 'prod-1' THEN 'BSO Жевательные мармеладки'
    WHEN 'prod-2' THEN 'Омега 3 Премиум'
    WHEN 'prod-3' THEN 'ACV Мармелад'
    WHEN 'prod-4' THEN 'Магний Комплекс'
    WHEN 'prod-5' THEN 'DNL — Антистресс фитокомплекс'
    WHEN 'prod-6' THEN 'DARUZEN Цинк Комплекс'
    WHEN 'prod-7' THEN 'Артишок + расторопша + одуванчик'
    WHEN 'prod-8' THEN 'Антиоксидант'
    WHEN 'prod-9' THEN 'Хром'
    WHEN 'prod-10' THEN 'Комплекс с гинкго билоба, женьшенем и цитиколином'
    WHEN 'prod-11' THEN 'Оптима Комплекс'
    WHEN 'prod-12' THEN 'MultiGummy Мультивитаминные жевательные мармеладки'
    ELSE name_ru
  END,
  image = CASE id
    WHEN 'prod-1' THEN '/images/bso.webp'
    WHEN 'prod-2' THEN '/images/omg.webp'
    WHEN 'prod-3' THEN '/images/acv.webp'
    WHEN 'prod-4' THEN '/images/magnez.webp'
    WHEN 'prod-5' THEN '/images/dnl__.webp'
    WHEN 'prod-6' THEN '/images/zincpng.webp'
    WHEN 'prod-7' THEN '/images/enginar__.webp'
    WHEN 'prod-8' THEN '/images/nadh_gummy.webp'
    WHEN 'prod-9' THEN '/images/gimne.webp'
    WHEN 'prod-10' THEN '/images/ginko_ginseng.webp'
    WHEN 'prod-11' THEN '/images/optimacomplex.webp'
    WHEN 'prod-12' THEN '/images/multigummy.webp'
    ELSE image
  END
WHERE id IN ('prod-1','prod-2','prod-3','prod-4','prod-5','prod-6','prod-7','prod-8','prod-9','prod-10','prod-11','prod-12');

-- 3. Проверка после обновления
SELECT id, name_ru, image, price 
FROM products 
WHERE id IN ('prod-1','prod-2','prod-3','prod-4','prod-5','prod-6','prod-7','prod-8','prod-9','prod-10','prod-11','prod-12')
ORDER BY CAST(SUBSTRING(id FROM 6) AS INTEGER);