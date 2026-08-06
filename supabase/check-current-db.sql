-- Проверка текущего состояния базы
SELECT 
  id, 
  name_ru,
  image,
  price,
  sort_order
FROM products 
ORDER BY sort_order DESC;