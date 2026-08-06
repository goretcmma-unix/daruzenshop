-- ВОССТАНОВЛЕНИЕ БАЗЫ ДАННЫХ
-- 1. Удаляем лишние товары которые я добавил
-- 2. Восстанавливаем правильные названия и фото для prod-1...prod-12

-- 1. Удаляем товары которые я добавил ошибочно
DELETE FROM products WHERE id IN (
  'prod-13', 'prod-14', 'prod-15', 'prod-16', 'prod-17', 'prod-18'
);

-- 2. Восстанавливаем правильные названия и фото
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
  name_tr = CASE id
    WHEN 'prod-1' THEN 'BSO Çiğneme Jölesi'
    WHEN 'prod-2' THEN 'Omega 3 Premium'
    WHEN 'prod-3' THEN 'ACV Jöle'
    WHEN 'prod-4' THEN 'Magnezyum Kompleks'
    WHEN 'prod-5' THEN 'DNL — Anti-stres Bitkisel Kompleks'
    WHEN 'prod-6' THEN 'DARUZEN Çinko Kompleks'
    WHEN 'prod-7' THEN 'Enginar + Devedikeni + Karahindiba'
    WHEN 'prod-8' THEN 'Antioksidan'
    WHEN 'prod-9' THEN 'Krom'
    WHEN 'prod-10' THEN 'Ginkgo biloba, ginseng ve sitikolin kompleksi'
    WHEN 'prod-11' THEN 'Optima Kompleks'
    WHEN 'prod-12' THEN 'MultiGummy Çoklu Vitamin Çiğneme Jölesi'
    ELSE name_tr
  END,
  name_en = CASE id
    WHEN 'prod-1' THEN 'BSO Chewing Gummies'
    WHEN 'prod-2' THEN 'Omega 3 Premium'
    WHEN 'prod-3' THEN 'ACV Gummies'
    WHEN 'prod-4' THEN 'Magnesium Complex'
    WHEN 'prod-5' THEN 'DNL — Anti-Stress Phyto Complex'
    WHEN 'prod-6' THEN 'DARUZEN Zinc Complex'
    WHEN 'prod-7' THEN 'Artichoke + Milk Thistle + Dandelion'
    WHEN 'prod-8' THEN 'Antioxidant'
    WHEN 'prod-9' THEN 'Chromium'
    WHEN 'prod-10' THEN 'Complex with Ginkgo biloba, ginseng and citicoline'
    WHEN 'prod-11' THEN 'Optima Complex'
    WHEN 'prod-12' THEN 'MultiGummy'
    ELSE name_en
  END,
  name_ar = CASE id
    WHEN 'prod-1' THEN 'أقراص بذور السوداء للمضغ'
    WHEN 'prod-2' THEN 'أوميغا 3 بريميوم'
    WHEN 'prod-3' THEN 'أقراص المكمّلات ACV'
    WHEN 'prod-4' THEN 'مجمّع المغنيسيوم'
    WHEN 'prod-5' THEN 'DNL — المركب النباتي المضاد للإجهاد'
    WHEN 'prod-6' THEN 'DARUZEN مركب الزنك'
    WHEN 'prod-7' THEN 'خرشوف + شوك الحليب + هندباء'
    WHEN 'prod-8' THEN 'مضاد الأكسدة'
    WHEN 'prod-9' THEN 'الكروم'
    WHEN 'prod-10' THEN 'مركب يحتوي على الجنكو بيلوبا والجنسنغ والسيتيكولين'
    WHEN 'prod-11' THEN 'أوبتيما كومبلكس'
    WHEN 'prod-12' THEN 'فيتامينات متعددة للمضغ'
    ELSE name_ar
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
  END,
  price = CASE id
    WHEN 'prod-1' THEN 1800
    WHEN 'prod-2' THEN 2400
    WHEN 'prod-3' THEN 1500
    WHEN 'prod-4' THEN 1950
    WHEN 'prod-5' THEN 2200
    WHEN 'prod-6' THEN 1100
    WHEN 'prod-7' THEN 2100
    WHEN 'prod-8' THEN 3500
    WHEN 'prod-9' THEN 2800
    WHEN 'prod-10' THEN 2300
    WHEN 'prod-11' THEN 1650
    WHEN 'prod-12' THEN 2900
    ELSE price
  END
WHERE id IN ('prod-1','prod-2','prod-3','prod-4','prod-5','prod-6','prod-7','prod-8','prod-9','prod-10','prod-11','prod-12');

-- 3. Проверка
SELECT id, name_ru, image, price 
FROM products 
ORDER BY sort_order DESC;