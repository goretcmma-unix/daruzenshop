-- Удаление лишних/старых товаров из базы
-- Выполни этот SQL в Supabase SQL Editor

-- 1. Удаляем товар "Артишок Комплекс" (лишний, которого нет в data.ts)
DELETE FROM products 
WHERE name_ru = 'Артишок Комплекс'
   OR name_ru LIKE '%Артишок Комплекс%';

-- 2. Удаляем другие лишние товары которые я ошибочно добавил
DELETE FROM products 
WHERE id IN (
  'prod-13', 'prod-14', 'prod-15', 'prod-16', 'prod-17', 'prod-18'
);

-- 3. Проверка - показываем что осталось
SELECT id, name_ru, image, price 
FROM products 
ORDER BY sort_order DESC;