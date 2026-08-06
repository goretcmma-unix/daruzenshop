-- ФИНАЛЬНЫЙ SQL - ОБНОВЛЯЕТ ВСЁ СРАЗУ
-- Выполни этот файл в Supabase SQL Editor

-- 1. Полная очистка
TRUNCATE TABLE products CASCADE;

-- 2. Создаём все 14 товаров с правильными названиями и фото
INSERT INTO products (id, category_key, price, image, name_ru, name_tr, name_en, name_ar, desc_ru, desc_tr, desc_en, desc_ar, specs, sort_order) VALUES
('prod-1', 'supplements', 1800, '/images/bso.webp', 
 'BSO Жевательные мармеладки', 'BSO Çiğneme Jölesi', 'BSO Chewing Gummies', 'أقراص بذور السوداء للمضغ',
 'Daruzen BSO Gummy (60 жевательных пастилок) — комплекс с маслом черного тмина (BSO), витамином D3, тимохиноном и цинком для поддержки иммунитета.',
 'Siyah kimyon yağı, D3 vitamini ve çinko içeren çiğneme jölesi.',
 'Chewing gummies with black seed oil, vitamin D3 and zinc.',
 'أقراص قابلة للمضغ بزيت الحبة السوداء وفيتامين D3 والزنك.',
 NULL, 1700000000),

('prod-2', 'supplements', 1500, '/images/omg.webp',
 'Магний Цитрат', 'Magnezyum Sitrat', 'Magnesium Citrate', 'سيترات المغنيسيوم',
 'Daruzen Magnesium Citrate — цитрат магния в жевательных мармеладках.',
 'Daruzen Magnesium Citrate — çiğneme jölesi formunda magnezyum sitrat.',
 'Daruzen Magnesium Citrate — magnesium citrate in chewing gummies.',
 'Daruzen Magnesium Citrate — سيترات المغنيسيوم في أقراص قابلة للمضغ.',
 NULL, 1700000000),

('prod-3', 'vitamins', 2000, '/images/multigummy.webp',
 'Мультивитамины', 'Multivitamin', 'Multivitamin Gummies', 'مULTIVITAMIN',
 'Daruzen Multivitamin Gummies — комплекс жевательных мармеладок с 10+ витаминами и минералами.',
 'Daruzen Multivitamin Gummies — günlük bağışıklık, enerji ve genel sağlık desteği için 10+ vitamin ve mineral içeren çiğneme jölesi kompleksi.',
 'Daruzen Multivitamin Gummies — complex of chewing gummies with 10+ vitamins and minerals.',
 'Daruzen Multivitamin Gummies — مجموعة من الأقراص القابلة للمضغ مع أكثر من 10 فيتامينات ومعادن.',
 NULL, 1700000000),

('prod-4', 'vitamins', 1200, '/images/acv.webp',
 'Витамин D3', 'D3 Vitamini', 'Vitamin D3', 'فيتامين D3',
 'Daruzen Vitamin D3 — жевательные мармеладки с витамином D3 для поддержки иммунитета.',
 'Daruzen Vitamin D3 — bağışıklık, kemik ve kas sağlığı için D3 vitamini çiğneme jölesi.',
 'Daruzen Vitamin D3 — chewing gummies with vitamin D3 for immune support.',
 'Daruzen Vitamin D3 — أقراص قابلة للمضغ مع فيتامين D3 لدعم المناعة.',
 NULL, 1700000000),

('prod-5', 'supplements', 2500, '/images/magnez.webp',
 'BSO Комплекс', 'BSO Kompleksi', 'BSO Complex', 'BSO مركب',
 'Daruzen BSO Complex — комплекс с маслом черного тмина, тимохиноном и цинком.',
 'Daruzen BSO Complex — siyah kimyon yağı, timokinon ve çinko içeren çiğneme jölesi.',
 'Daruzen BSO Complex — complex with black seed oil, thymoquinone and zinc.',
 'Daruzen BSO Complex — مركب مع زيت الحبة السوداء والثيموكينون والزنك.',
 NULL, 1700000000),

('prod-6', 'supplements', 1600, '/images/ironbis_soft.webp',
 'Железо Комплекс', 'Demir Kompleksi', 'Iron Complex', 'حديد مركب',
 'Daruzen Iron Complex — комплекс железа с витамином C и фолиевой кислотой.',
 'Daruzen Iron Complex — C vitamini ve folik asit ile demir kompleksi çiğneme jölesi.',
 'Daruzen Iron Complex — iron complex with vitamin C and folic acid.',
 'Daruzen Iron Complex — مركب الحديد مع فيتامين C وحمض الفوليك.',
 NULL, 1700000000),

('prod-7', 'supplements', 2200, '/images/optimacomplex.webp',
 'Омега-3', 'Omega-3', 'Omega-3 Gummies', 'أوميغا-3',
 'Daruzen Omega-3 Gummies — жевательные мармеладки с омега-3 для поддержки сердца, мозга, зрения и здоровья суставов.',
 'Daruzen Omega-3 Gummies — kalp, beyin, görme ve eklem sağlığını destekleyen omega-3 çiğneme jölesi.',
 'Daruzen Omega-3 Gummies — chewing gummies with omega-3 for heart, brain, vision and joint health.',
 'Daruzen Omega-3 Gummies — أقراص قابلة للمضغ مع أوميغا-3 لدعم صحة القلب والدماغ والرؤية والمفاصل.',
 NULL, 1700000000),

('prod-8', 'vitamins', 1400, '/images/zincpng.webp',
 'Цинк + Витамин C', 'Çinko + C Vitamini', 'Zinc + Vitamin C', 'زنك + فيتامين C',
 'Daruzen Zinc + Vitamin C — цинк и витамин C в жевательных мармеладках для поддержки иммунитета, кожи, волос и ногтей.',
 'Daruzen Zinc + Vitamin C — bağışıklık, cilt, saç ve tırnak sağlığını destekleyen çinko ve C vitamini çiğneme jölesi.',
 'Daruzen Zinc + Vitamin C — zinc and vitamin C in chewing gummies for immune, skin, hair and nail health.',
 'Daruzen Zinc + Vitamin C — الزنك وفيتامين C في أقراص قابلة للمضغ لدعم المناعة وصحة الجلد والشعر والأظافر.',
 NULL, 1700000000),

('prod-9', 'supplements', 1900, '/images/dnl__.webp',
 'Пробиотики', 'Probiyotik', 'Probiotic Gummies', 'بروبيوتيك',
 'Daruzen Probiotic Gummies — пробиотики в жевательных мармеладках для поддержки здоровья кишечника, пищеварения и иммунитета.',
 'Daruzen Probiotic Gummies — bağırsak sağlığı, sindirim ve bağışıklığı destekleyen probiyotik çiğneme jölesi.',
 'Daruzen Probiotic Gummies — probiotics in chewing gummies for gut health, digestion and immune support.',
 'Daruzen Probiotic Gummies — بروبيوتيك في أقراص قابلة للمضغ لصحة الأمعاء والهضم والمناعة.',
 NULL, 1700000000),

('prod-10', 'minerals', 1700, '/images/enginar__.webp',
 'Кальций + D3', 'Kalsiyum + D3', 'Calcium + D3', 'كالسيوم + D3',
 'Daruzen Calcium + D3 — кальций с витамином D3 в жевательных мармеладках для поддержки здоровья костей, зубов и мышц.',
 'Daruzen Calcium + D3 — kemik, diş ve kas sağlığını destekleyen kalsiyum + D3 vitamini çiğneme jölesi.',
 'Daruzen Calcium + D3 — calcium with vitamin D3 in chewing gummies for bone, tooth and muscle health.',
 'Daruzen Calcium + D3 — الكالسيوم مع فيتامين D3 في أقراص قابلة للمضغ لدعم صحة العظام والأسنان والعضلات.',
 NULL, 1700000000),

('prod-11', 'vitamins', 1500, '/images/nadh_gummy.webp',
 'B-Комплекс', 'B Kompleksi', 'B-Complex', 'B مركب',
 'Daruzen B-Complex — комплекс витаминов группы B в жевательных мармеладках для поддержки энергии, нервной системы и общего метаболизма.',
 'Daruzen B-Complex — enerji, sinir sistemi ve genel metabolizma desteği için B vitamin kompleksi çiğneme jölesi.',
 'Daruzen B-Complex — B vitamin complex in chewing gummies for energy, nervous system and overall metabolism support.',
 'Daruzen B-Complex — مركب فيتامينات B في أقراص قابلة للمضغ لدعم الطاقة والجهاز العصبي والتمثيل الغذائي العام.',
 NULL, 1700000000),

('prod-12', 'beauty', 2500, '/images/gimne.webp',
 'Коллаген', 'Kolajen', 'Collagen Gummies', 'كولاجين',
 'Daruzen Collagen Gummies — коллаген в жевательных мармеладках для поддержки здоровья кожи, волос, ногтей и суставов.',
 'Daruzen Collagen Gummies — cilt, saç, tırnak ve eklem sağlığını destekleyen kolajen çiğneme jölesi.',
 'Daruzen Collagen Gummies — collagen in chewing gummies for skin, hair, nail and joint health support.',
 'Daruzen Collagen Gummies — الكولاجين في أقراص قابلة للمضغ لدعم صحة الجلد والشعر والأظافر والمفاصل.',
 NULL, 1700000000),

-- 2 новых товара
('prod-1785669452074', 'supplements', 2800, '/images/ginko_ginseng.webp',
 'Гинкго Комплекс', 'Ginkgo Kompleksi', 'Ginkgo Complex', 'جنكبو مركب',
 'Daruzen Ginkgo Complex — экстракт гинкго билоба с корейским женьшенем и цитиколином для поддержки памяти, концентрации и мозгового кровообращения.',
 'Daruzen Ginkgo Complex — bellek, konsantrasyon ve beyin kan dolaşımı için ginkgo biloba, Kore ginsengi ve sitikolin çiğneme jölesi.',
 'Daruzen Ginkgo Complex — ginkgo biloba extract with Korean ginseng and citicoline for memory, concentration and brain circulation support.',
 'Daruzen Ginkgo Complex — مستخلص الجنكو بيلوبا مع الجنسنغ الكوري والسيتيكولين لدعم الذاكرة والتركيز والدورة الدموية الدماغية.',
 NULL, 1749500000),

('prod-1785672176662', 'supplements', 1400, 'https://fstihxljqljhfyubptsk.supabase.co/storage/v1/object/public/product_image/prod-1785669452074/1785669463531.webp',
 'Экстракт витекса священного с коэнзимом Q10', 'Koenzim Q10 içeren Hayıt Özü', 'Vitex Complex with CoQ10', 'مستخلص فيتكس مع الإنزيم المساعد Q10',
 'Комплекс с экстрактами витекса и тысячелистника, коэнзимом Q10, L-аргинином, женьшенем, цинком, селеном и фолиевой кислотой — способствует поддержанию женского гормонального баланса, репродуктивного здоровья и регулярности менструального цикла.',
 'Hayıt özü bazlı, koenzim Q10, ginseng, çinko, folik asit ve selenyum içeren kadın kompleksi. Hormonal dengeyi ve kadın sağlığını destekler, PMS belirtilerinin hafiflemesine yardımcı olur.',
 'A women''s complex based on chasteberry (Vitex agnus-castus) extract with coenzyme Q10, ginseng, zinc, folic acid and selenium. Supports hormonal balance and women''s health, and helps ease PMS symptoms.',
 'مركب نسائي يعتمد على مستخلص تشاستيبيري (Vitex agnus-castus) مع الإنزيم المساعد Q10 والجنسنغ والزنك وحمض الفوليك والسيلينيوم. يدعم التوازن الهرموني وصحة المرأة ويساعد في تخفيف أعراض متلازمة ما قبل الحيض.',
 '{"ru":["| Экстракт витекса священного | 400 мг | — |","| Экстракт кайенского перца | 100 мг | — |","| Коэнзим Q10 | 100 мг | — |","| L-аргинин | 100 мг | — |","| Экстракт женьшеня | 80 мг | — |","| Цинк | 15 мг | 150% |"],"tr":["| Hayıt özü | 400 mg | — |","| Kırmızı biber özü | 100 mg | — |","| Koenzim Q10 | 100 mg | — |","| L-arginin | 100 mg | — |","| Ginseng özü | 80 mg | — |","| Çinko | 15 mg | %150 |"],"en":["| Chasteberry extract | 400 mg | — |","| Cayenne pepper extract | 100 mg | — |","| Coenzyme Q10 | 100 mg | — |","| L-arginine | 100 mg | — |","| Korean ginseng extract | 80 mg | — |","| Zinc | 15 mg | 150% |"],"ar":["| مستخلص تشاستيبيري | 400 ملغ | — |","| مستخلص الفلفل الكايين | 100 ملغ | — |","| الإنزيم المساعد Q10 | 100 ملغ | — |","| L-أرجينين | 100 ملغ | — |","| مستخلص الجنسنغ الكوري | 80 ملغ | — |","| الزنك | 15 ملغ | 150% |"]}',
 1750000000);

-- 3. Проверка
SELECT 
  id, 
  name_ru, 
  image,
  sort_order,
  CASE 
    WHEN sort_order > 1749500000 THEN 'НОВЫЙ ✓'
    ELSE 'старый'
  end as status
FROM products 
ORDER BY sort_order DESC;