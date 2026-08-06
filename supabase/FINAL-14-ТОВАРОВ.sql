-- ФИНАЛЬНЫЙ SQL - ВОССТАНОВЛЕНИЕ ВСЕХ 14 ТОВАРОВ
-- Выполни этот SQL в Supabase SQL Editor

-- 1. Полная очистка
TRUNCATE TABLE products CASCADE;

-- 2. Вставляем все 14 товаров из data.ts с правильными названиями и фото
INSERT INTO products (id, category_key, price, image, name_ru, name_tr, name_en, name_ar, desc_ru, desc_tr, desc_en, desc_ar, specs, sort_order) VALUES
('prod-1', 'supplements', 1800, '/images/bso.webp',
 'BSO Жевательные мармеладки', 'BSO Çiğneme Jölesi', 'BSO Chewing Gummies', 'أقراص بذور السوداء للمضغ',
 'Daruzen BSO Gummy (60 жевательных пастилок) — комплекс с маслом черного тмина (BSO), витамином D3, тимохиноном и цинком для поддержки иммунитета. Способствует укреплению защитных сил организма, общему оздоровлению и повышению жизненного тонуса.',
 'Siyah kimyon yağı, D3 vitamini ve çinko içeren çiğneme jölesi.',
 'Chewing gummies with black seed oil, vitamin D3 and zinc.',
 'أقراص قابلة للمضغ بزيت الحبة السوداء وفيتامين D3 والزنك.',
 NULL, 1700000000),

('prod-2', 'vitamins', 2400, '/images/omg.webp',
 'Омега 3 Премиум', 'Omega 3 Premium', 'Omega 3 Premium', 'أوميغا 3 بريميوم',
 'Высококачественный источник омега-3 жирных кислот (EPA — 600 мг, DHA — 400 мг), полученных из норвежской рыбы. Способствует поддержанию здоровья сердца, мозга и зрения.',
 'İki kapsülde 1000 mg Omega-3 (600 mg EPA, 400 mg DHA) içeren yüksek saflıkta balık yağı.',
 'High-purity fish oil providing 1000 mg of Omega-3 per two capsules (600 mg EPA, 400 mg DHA).',
 'زيت سمك فائق النقاء يوفر 1000 ملغ من أوميغا 3 في كبسولتين (600 ملغ EPA، 400 ملغ DHA).',
 NULL, 1700000000),

('prod-3', 'supplements', 1500, '/images/acv.webp',
 'ACV Мармелад', 'ACV Jöle', 'ACV Gummies', 'أقراص المكمّلات ACV',
 'Daruzen ACV Gummy (60 жевательных пастилок) — комплекс с яблочным уксусом, фолиевой кислотой, витамином B12 и экстрактом граната для детоксикации и контроля веса.',
 'Elma sirkesi, pancar, nar ekstresi ve B9-B12 vitaminleri içeren çiğneme jölesi.',
 'Chewing gummies with apple cider vinegar, beetroot, pomegranate extract and vitamins B9 and B12.',
 'أقراص قابلة للمضغ تحتوي على خل التفاح والشمندر ومستخلص الرمان وفيتاميني B9 وB12.',
 NULL, 1700000000),

('prod-4', 'minerals', 1950, '/images/magnez.webp',
 'Магний Комплекс', 'Magnezyum Kompleks', 'Magnesium Complex', 'مجمّع المغنيسيوم',
 'Магний Complex 4 + Витамин B6 — сочетает четыре высокоусвояемые формы магния для поддержки нервной системы, мышц и сердца.',
 'Dört kolay emilen magnezyum formu (asetiltaurat, bisglisinat, malat ve sitrat) ve B6 vitamini.',
 'Four highly absorbable forms of magnesium (acetyltaurate, bisglycinate, malate and citrate) with vitamin B6.',
 'أربع صور سريعة الامتصاص من المغنيسيوم مع فيتامين B6.',
 NULL, 1700000000),

('prod-5', 'supplements', 2200, '/images/dnl__.webp',
 'DNL — Антистресс фитокомплекс', 'DNL — Anti-stres Bitkisel Kompleks', 'DNL — Anti-Stress Phyto Complex', 'DNL — المركب النباتي المضاد للإجهاد',
 'Комплекс растительных экстрактов (включая лаванду, базилик, боярышник и др.) помогает организму справляться с повседневным стрессом и нервным напряжением.',
 'Alıç, kereviz, kedi pençesi, fesleğen, lavanta, hibiskus ve diğerleri olmak üzere 11 bitkisel bileşenden oluşan kompleks.',
 'A phyto-complex of 11 plant ingredients including hawthorn, celery, basil, lavender and hibiscus.',
 'مركب نباتي من 11 مكونًا نباتيًا منها الزعرور والكرفس والريحان والخزامى.',
 NULL, 1700000000),

('prod-6', 'minerals', 1100, '/images/zincpng.webp',
 'DARUZEN Цинк Комплекс', 'DARUZEN Çinko Kompleks', 'DARUZEN Zinc Complex', 'DARUZEN مركب الزنك',
 'Цинк + Медь + Селен — комплекс для поддержки иммунной системы, антиоксидантной защиты и общего здоровья организма.',
 'Çinko, bakır ve selenyum kompleksi.',
 'A complex of zinc, copper and selenium.',
 'مركب من الزنك والنحاس والسيلينيوم.',
 NULL, 1700000000),

('prod-7', 'supplements', 2100, '/images/enginar__.webp',
 'Артишок + расторопша + одуванчик', 'Enginar + Devedikeni + Karahindiba', 'Artichoke + Milk Thistle + Dandelion', 'خرشوف + شوك الحليب + هندباء',
 'Экстракты артишока, расторопши и одуванчика — поддерживают здоровье печени, способствуют естественному очищению организма и нормальному желчеотделению.',
 'Enginar, devedikeni ve karahindiba ekstrelerinden oluşan doğal kompleks.',
 'A natural complex of artichoke, milk thistle and dandelion extracts.',
 'مركب طبيعي من مستخلصات الخرشوف وشوك الحليب والهندباء.',
 NULL, 1700000000),

('prod-8', 'beauty', 3500, '/images/nadh_gummy.webp',
 'Антиоксидант', 'Antioksidan', 'Antioxidant', 'مضاد الأكسدة',
 'Daruzen NADH Gummy (60 жевательных пастилок) — мощный антивозрастной комплекс в форме жевательных мармеладок с ежевичным вкусом. Содержит NADH, коэнзим Q10, глутатион и ресвератрол.',
 'Glutatyon, resveratrol, koenzim Q10 ve NADH ile B6-B12 vitaminlerinden oluşan güçlü antioksidan kompleks.',
 'A powerful antioxidant complex of glutathione, resveratrol, coenzyme Q10 and NADH.',
 'مركب مضاد للأكسدة قوي من الجلوتاثيون والريسفيراترول والإنزيم المساعد Q10 وNADH.',
 NULL, 1700000000),

('prod-9', 'herbs', 2800, '/images/gimne.webp',
 'Хром', 'Krom', 'Chromium', 'الكروم',
 'Комплекс экстракта джимнемы (500 мг) и хрома разработан для снижения тяги к сладкому и контроля уровня сахара в крови.',
 'Krom içeren gymnema ekstresi. Kan şekerinin normal seviyede kalmasına yardımcı olur.',
 'Gymnema extract with chromium. Helps maintain normal blood sugar levels.',
 'مستخلص جيمنيما مع الكروم. يساعد في الحفاظ على مستويات طبيعية من سكر الدم.',
 NULL, 1700000000),

('prod-10', 'herbs', 2300, '/images/ginko_ginseng.webp',
 'Комплекс с гинкго билоба, женьшенем и цитиколином', 'Ginkgo biloba, ginseng ve sitikolin kompleksi', 'Complex with Ginkgo biloba, ginseng and citicoline', 'مركب يحتوي على الجنكو بيلوبا والجنسنغ والسيتيكولين',
 'Гинкго билоба, женьшень и цитиколин — комплекс для поддержки памяти, концентрации внимания и когнитивных функций.',
 'Ginkgo biloba, Kore ginsengi ve sitikolin içeren sıvı kompleks. Hafızayı, konsantrasyonu ve beyin dolaşımını geliştirir.',
 'A liquid complex of ginkgo biloba, Korean ginseng and citicoline. Improves memory, concentration and cerebral circulation.',
 'مركب سائل من الجنكو بيلوبا والجنسنغ الكوري والسيتيكولين. يحسّن الذاكرة والتركيز والدورة الدموية الدماغية.',
 NULL, 1700000000),

('prod-11', 'vitamins', 1650, '/images/optimacomplex.webp',
 'Оптима Комплекс', 'Optima Kompleks', 'Optima Complex', 'أوبتيما كومبلكس',
 'Сбалансированный комплекс с лютеином, зеаксантином, омега-3, антиоксидантами и витаминами создан специально для поддержки остроты зрения и защиты сетчатки.',
 'Balık yağı Omega-3, kurkumin, koenzim Q10, C vitamini, çinko, lutein, astaksantin ve diğer aktif bileşenleri içeren çok bileşenli formül.',
 'A multi-ingredient formula with fish oil Omega-3, curcumin, coenzyme Q10, vitamin C, zinc, lutein, astaxanthin.',
 'تركيبة متعددة المكونات تحتوي على زيت السمك وأوميغا 3 والكركمين والإنزيم المساعد Q10 وفيتامين C والزنك واللوتين والأستازانتين.',
 NULL, 1700000000),

('prod-12', 'vitamins', 2900, '/images/multigummy.webp',
 'MultiGummy Мультивитаминные жевательные мармеладки', 'MultiGummy Çoklu Vitamin Çiğneme Jölesi', 'MultiGummy', 'فيتامينات متعددة للمضغ',
 'Daruzen MultiGummy (60 жевательных пастилок) — сбалансированный витаминный комплекс в форме жевательных мармеладок (со вкусом микса фруктов) для ежедневной поддержки организма.',
 'C, E, A ve B12 vitaminleri içeren çoklu vitamin çiğneme jölesi. Bağışıklığı, enerjiyi ve cilt sağlığını gün boyu destekler.',
 'Multivitamin chewing gummies with vitamins C, E, A and B12. Support immunity, energy and skin health throughout the day.',
 'أقراص فيتامينات متعددة قابلة للمضغ تحتوي على فيتامينات C وE وA وB12. تدعم المناعة والطاقة وصحة الجلد.',
 NULL, 1700000000),

('prod-1785669452074', 'herbs', 1400, 'https://fstihxljqljhfyubptsk.supabase.co/storage/v1/object/public/product_image/prod-1785669452074/1785669463531.webp',
 'Экстракт витекса священного с коэнзимом Q10', 'Koenzim Q10 içeren Hayıt Özü', 'Chasteberry Extract with Coenzyme Q10', 'مستخلص تشاستيبيري مع الإنزيم المساعد Q10',
 'Комплекс с экстрактами витекса и тысячелистника, коэнзимом Q10, L-аргинином, женьшенем, цинком, селеном и фолиевой кислотой — способствует поддержанию женского гормонального баланса.',
 'Hayıt özü bazlı, koenzim Q10, ginseng, çinko, folik asit ve selenyum içeren kadın kompleksi. Hormonal dengeyi ve kadın sağlığını destekler.',
 'A women\'s complex based on chasteberry (Vitex agnus-castus) extract with coenzyme Q10, ginseng, zinc, folic acid and selenium. Supports hormonal balance and women\'s health.',
 'مركب نسائي يعتمد على مستخلص تشاستيبيري مع الإنزيم المساعد Q10 والجنسنغ والزنك وحمض الفوليك والسيلينيوم. يدعم التوازن الهرموني وصحة المرأة.',
 NULL, 1749500000),

('prod-1785672176662', 'supplements', 3350, '/images/ironbis_soft.webp',
 'Железо бисглицинат + Витамин C', 'Demir bisglisinat + C Vitamini', 'Iron bisglycinate + Vitamin C', 'بيسجليسينات الحديد + فيتامين سي',
 'Железо бисглицинат + Витамин C — способствует восполнению дефицита железа, поддерживает нормальный уровень гемоглобина и снижает риск усталости и слабости.',
 'Demir Bisglisinat + C Vitamini, demir bisglisinat ve C vitaminini birleştiren bir besin takviyesidir.',
 'Iron Bisglycinate + Vitamin C is a dietary supplement that combines iron bisglycinate and vitamin C.',
 'بيسجليسينات الحديد + فيتامين سي هو مكمل غذائي يجمع بين بيسجليسينات الحديد وفيتامين سي.',
 NULL, 1750000000);

-- 3. Проверка
SELECT 
  id, 
  name_ru, 
  image,
  price,
  sort_order
FROM products 
ORDER BY sort_order DESC;