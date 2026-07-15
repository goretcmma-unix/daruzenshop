-- 1. Таблица
create table if not exists public.products (
  id           text primary key,
  category_key text not null,
  price        numeric not null,
  image        text not null,
  name_ru      text not null default '',
  name_tr      text not null default '',
  name_en      text not null default '',
  name_ar      text not null default '',
  desc_ru      text not null default '',
  desc_tr      text not null default '',
  desc_en      text not null default '',
  desc_ar      text not null default '',
  specs        jsonb,
  sort_order   integer
);

-- 2. Доступ (публичное чтение + запись для авторизованного админа)
alter table public.products enable row level security;

drop policy if exists "products read" on public.products;
create policy "products read" on public.products
  for select using (true);

drop policy if exists "products write" on public.products;
create policy "products write" on public.products
  for all to authenticated
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' )
  with check ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- 3. Начальные товары
insert into public.products (id, category_key, price, image, name_ru, name_tr, name_en, name_ar, desc_ru, desc_tr, desc_en, desc_ar, specs, sort_order) values
('prod-1', 'supplements', 1800, '/images/bso.webp',
 'BSO Жевательные конфеты', 'BSO Çiğneme Şekeri', 'BSO Chewing Candies', 'حلوى بذور السوداء القابلة للمضغ',
 'Жевательные конфеты с маслом черного тмина для иммунитета и общего самочувствия. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Bağışıklık ve genel sağlık için siyah kimyon yağı içeren çiğneme şekerleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Chewing candies with black seed oil for immunity and overall well-being. A quality product to support your health. Natural composition and high effectiveness.',
 'حلوى قابلة للمضغ بزيت الحبة السوداء لتعزيز المناعة والعافية العامة. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["60 конфет","Витамин D3","2% Тимохинон","Цинк"],"tr":["60 çekirdek","D3 Vitamini","%2 Timokinon","Çinko"],"en":["60 candies","Vitamin D3","2% Thymoquinone","Zinc"],"ar":["60 حبة","فيتامين D3","2% ثيموكينون","زنك"]}', 1),

('prod-2', 'vitamins', 2400, '/images/omg.webp',
 'Омега 3 Премиум', 'Omega 3 Premium', 'Omega 3 Premium', 'أوميغا 3 بريميوم',
 'Высокочистые капсулы рыбьего жира Омега-3 для здоровья сердца и мозга. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Kalp ve beyin sağlığı için yüksek saflıkta balık yağı kapsülleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'High-purity fish oil Omega-3 capsules for heart and brain health. A quality product to support your health. Natural composition and high effectiveness.',
 'كبسولات زيت السمك أوميغا 3 فائقة النقاء لصحة القلب والدماغ. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["1000мг","ЭПК/ДГК","Натуральный лимонный вкус"],"tr":["1000mg","EPA/DHA","Doğal limon aroması"],"en":["1000mg","EPA/DHA","Natural lemon flavor"],"ar":["1000mg","EPA/DHA","نكهة الليمون الطبيعية"]}', 2),

('prod-3', 'supplements', 1500, '/images/acv.webp',
 'ACV Мармелад', 'ACV Jöle', 'ACV Gummies', 'أقراص المكمّلات ACV',
 'Жевательный мармелад на основе яблочного уксуса для поддержки обмена веществ, детоксикации и здорового пищеварения.',
 'Metabolizma desteği, detoks ve sağlıklı sindirim için elma sirkesi bazlı çiğneme jölesi.',
 'Apple cider vinegar-based chewing gummies to support metabolism, detox and healthy digestion.',
 'أقراص قابلة للمضغ على أساس خل التفاح لدعم الأيض وإزالة السموم والهضم الصحي.',
 '{"ru":["Яблочный уксус","Детокс","60 жевательных пастилок"],"tr":["Elma sirkesi","Detoks","60 çiğneme jölesi"],"en":["Apple cider vinegar","Detox","60 chewing gummies"],"ar":["خل التفاح","إزالة السموم","60 قرصاً قابلاً للمضغ"]}', 3),

('prod-4', 'minerals', 1950, '/images/magnezyum.webp',
 'Магний Комплекс', 'Magnezyum Kompleks', 'Magnesium Complex', 'مجمّع المغنيسيوم',
 'Тройная смесь магния для расслабления мышц и улучшения сна. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Kas gevşemesi ve uyku kalitesi için üçlü magnezyum karışımı. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Triple magnesium blend for muscle relaxation and better sleep. A quality product to support your health. Natural composition and high effectiveness.',
 'مزيج ثلاثي المغنيسيوم لاسترخاء العضلات وتحسين النوم. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["400мг","Глицинат, Цитрат, Малат"],"tr":["400mg","Glisinat, Sitrat, Malat"],"en":["400mg","Glycinate, Citrate, Malate"],"ar":["400mg","غلايسينات، سترات، مالات"]}', 4),

('prod-5', 'supplements', 2200, '/images/dnl__.webp',
 'DNL Фитокомплекс', 'DNL Fito Kompleks', 'DNL Phyto Complex', 'المجمّع النباتي DNL',
 'Натуральный фитокомплекс для поддержки организма и общего укрепления здоровья. Качественный препарат на основе растительных компонентов.',
 'Vücudu desteklemek ve genel sağlığı güçlendirmek için doğal bitkisel kompleks. Bitkisel bileşenlere dayalı kaliteli bir ürün.',
 'Natural phyto-complex to support the body and strengthen overall health. A quality product based on plant components.',
 'مجمّع نباتي طبيعي لدعم الجسم وتعزيز الصحة العامة. منتج عالي الجودة مبني على مكونات نباتية.',
 '{"ru":["Растительный состав","Комплексное действие","Натуральные экстракты"],"tr":["Bitkisel içerik","Kompleks etki","Doğal ekstreler"],"en":["Plant-based formula","Complex action","Natural extracts"],"ar":["تركيبة نباتية","تأثير شامل","مستخلصات طبيعية"]}', 5),

('prod-6', 'minerals', 1100, '/images/zincpng.webp',
 'Цинк Защита', 'Çinko Koruma', 'Zinc Protection', 'حماية الزنك',
 'Максимально сильная добавка цинка для сезонного иммунитета. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Mevsimsel bağışıklık için güçlü çinko takviyesi. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Maximum-strength zinc supplement for seasonal immunity. A quality product to support your health. Natural composition and high effectiveness.',
 'مكمّل زنك بأقصى قوة للمناعة الموسمية. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["50мг","Глюконат цинка","Без ГМО"],"tr":["50mg","Çinko glukonat","GDO''suz"],"en":["50mg","Zinc gluconate","Non-GMO"],"ar":["50mg","غلوكونات الزنك","خالٍ من الكائنات المعدلة جينياً"]}', 6),

('prod-7', 'supplements', 2100, '/images/enginar__.webp',
 'Экстракт расторопши и одуванчика', 'Devedikeni ve Karahindiba Ekstresi', 'Milk Thistle & Dandelion Extract', 'مستخلص شوك الحليب والهندباء',
 'Натуральные жевательные конфеты с экстрактом бузины, витамином С и цинком. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Kuş üzümü ekstresi, C vitamini ve çinko içeren doğal çiğneme şekerleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Natural chewing candies with elderberry extract, vitamin C and zinc. A quality product to support your health. Natural composition and high effectiveness.',
 'حلوى طبيعية قابلة للمضغ بمستخلص البلسان وفيتامين C والزنك. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["Богат антиоксидантами","Без сахара","Подходит для детей"],"tr":["Antioksidan açısından zengin","Şekersiz","Çocuklar için uygun"],"en":["Rich in antioxidants","Sugar-free","Suitable for children"],"ar":["غني بمضادات الأكسدة","خالٍ من السكر","مناسب للأطفال"]}', 7),

('prod-8', 'beauty', 3500, '/images/nadh_gummy.webp',
 'Антиоксидант', 'Antioksidan', 'Antioxidant', 'مضاد الأكسدة',
 'Гидролизованные пептиды коллагена для эластичности кожи и здоровья суставов. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Cilt esnekliği ve eklem sağlığı için hidrolize kolajen peptitleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Hydrolyzed collagen peptides for skin elasticity and joint health. A quality product to support your health. Natural composition and high effectiveness.',
 'ببتيدات الكولاجين المتحللة مائياً لمرونة البشرة وصحة المفاصل. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["Морской коллаген","Гиалуроновая кислота","Витамин С"],"tr":["Deniz kolajeni","Hiyalüronik asit","C Vitamini"],"en":["Marine collagen","Hyaluronic acid","Vitamin C"],"ar":["كولاجين بحري","حمض الهيالورونيك","فيتامين C"]}', 8),

('prod-9', 'herbs', 2800, '/images/gimne.webp',
 'Хром', 'Krom', 'Chromium', 'الكروم',
 'Травяной экстракт с хромом для поддержания уровня сахара в крови и метаболизма. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Kan şekeri seviyesi ve metabolizma desteği için krom içeren bitkisel ekstre. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Herbal extract with chromium to support blood sugar levels and metabolism. A quality product to support your health. Natural composition and high effectiveness.',
 'مستخلص عشبي بالكروم لدعم مستويات سكر الدم والأيض. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["Гимнема Сильвестра","Пиколинат хрома","Поддержка метаболизма"],"tr":["Gymnema Sylvestre","Krom pikolinat","Metabolizma desteği"],"en":["Gymnema Sylvestre","Chromium picolinate","Metabolism support"],"ar":["غيمنيميا سيلفستريس","بيكولينات الكروم","دعم الأيض"]}', 9),

('prod-10', 'herbs', 2300, '/images/ginko_ginseng.webp',
 'Джинко Фитокомплекс', 'Ginkgo Fito Kompleks', 'Ginkgo Phyto Complex', 'المجمّع النباتي جينكو',
 'Натуральный фитокомплекс на основе гинкго билоба и женьшеня для поддержки мозговой активности, улучшения памяти и концентрации.',
 'Beyin aktivitesi, hafıza ve konsantrasyon desteği için ginkgo biloba ve ginseng bazlı doğal bitkisel kompleks.',
 'Natural phyto-complex based on ginkgo biloba and ginseng to support brain activity, improve memory and concentration.',
 'مجمّع نباتي طبيعي على أساس الجنكو بيلوبا والجنسنغ لدعم النشاط الذهني وتحسين الذاكرة والتركيز.',
 '{"ru":["Гинкго Билоба","Женьшень","Поддержка памяти"],"tr":["Ginkgo Biloba","Ginseng","Hafıza desteği"],"en":["Ginkgo Biloba","Ginseng","Memory support"],"ar":["جينكو بيلوبا","الجنسنغ","دعم الذاكرة"]}', 10),

('prod-11', 'vitamins', 1650, '/images/optimacomplex.webp',
 'Витамин B-Комплекс', 'B Vitamini Kompleksi', 'Vitamin B-Complex', 'فيتامين B المجمّع',
 'Полный комплекс витаминов группы B для энергетического обмена и поддержки нервной системы. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Enerji metabolizması ve sinir sistemi desteği için tam B vitamini kompleksi. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Complete B-group vitamin complex for energy metabolism and nervous system support. A quality product to support your health. Natural composition and high effectiveness.',
 'مجمّع فيتامينات B الكامل لدعم الأيض والجهاز العصبي. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["B1, B2, B6, B12","Заряд энергии","Ежедневная поддержка"],"tr":["B1, B2, B6, B12","Enerji kaynağı","Günlük destek"],"en":["B1, B2, B6, B12","Energy boost","Daily support"],"ar":["B1, B2, B6, B12","دفعة طاقة","دعم يومي"]}', 11),

('prod-12', 'vitamins', 2900, '/images/multigummy.webp',
 'Мультивитамин Специальный', 'Özel Multivitamin', 'Special Multivitamin', 'فيتامينات متعددة خاصة',
 'Премиальная мультивитаминная формула для активного образа жизни и иммунитета. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Aktif yaşam ve bağışıklık için premium multivitamin formülü. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Premium multivitamin formula for an active lifestyle and immunity. A quality product to support your health. Natural composition and high effectiveness.',
 'تركيبة فيتامينات متعددة متميزة لنمط حياة نشط والمناعة. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
 '{"ru":["Витамины A-Z","Богат минералами","Защита иммунитета"],"tr":["A''dan Z''ye Vitaminler","Mineraller açısından zengin","Bağışıklık koruması"],"en":["Vitamins A-Z","Rich in minerals","Immune protection"],"ar":["فيتامينات A-Z","غني بالمعادن","حماية المناعة"]}', 12)

on conflict (id) do update set
  category_key = excluded.category_key,
  price        = excluded.price,
  image        = excluded.image,
  name_ru      = excluded.name_ru,
  name_tr      = excluded.name_tr,
  name_en      = excluded.name_en,
  name_ar      = excluded.name_ar,
  desc_ru      = excluded.desc_ru,
  desc_tr      = excluded.desc_tr,
  desc_en      = excluded.desc_en,
  desc_ar      = excluded.desc_ar,
  specs        = excluded.specs,
  sort_order   = excluded.sort_order;
