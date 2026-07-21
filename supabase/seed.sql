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
  '{"ru":["60 жев. пастилок","500 мг масла черного тмина","10 мкг витамина D3","10 мг цинка","5 мг тимохинона"],"tr":["60 çiğn. jölesi","500 mg siyah kimyon yağı","10 mcg D3 vitamini","10 mg çinko","5 mg timokinon"],"en":["60 gummies","500 mg black seed oil","10 mcg Vitamin D3","10 mg Zinc","5 mg Thymoquinone"],"ar":["60 حلبة قابلة للمضغ","500 ملغ زيت الحبة السوداء","10 مكغ فيتامين D3","10 ملغ زنك","5 ملغ ثيموكينون"]}', 1),

('prod-2', 'vitamins', 2400, '/images/omg.webp',
 'Омега 3 Премиум', 'Omega 3 Premium', 'Omega 3 Premium', 'أوميغا 3 بريميوم',
 'Высокочистые капсулы рыбьего жира Омега-3 для здоровья сердца и мозга. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Kalp ve beyin sağlığı için yüksek saflıkta balık yağı kapsülleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'High-purity fish oil Omega-3 capsules for heart and brain health. A quality product to support your health. Natural composition and high effectiveness.',
 'كبسولات زيت السمك أوميغا 3 فائقة النقاء لصحة القلب والدماغ. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
  '{"ru":["1000 мг","ЭПК 300 мг","ДГК 200 мг","Натуральный лимонный вкус"],"tr":["1000 mg","EPA 300 mg","DHA 200 mg","Doğal limon aroması"],"en":["1000 mg","EPA 300 mg","DHA 200 mg","Natural lemon flavor"],"ar":["1000 ملغ","EPA 300 ملغ","DHA 200 ملغ","نكهة الليمون الطبيعية"]}', 2),

('prod-3', 'supplements', 1500, '/images/acv.webp',
 'ACV Мармелад', 'ACV Jöle', 'ACV Gummies', 'أقراص المكمّلات ACV',
 'Жевательный мармелад на основе яблочного уксуса для поддержки обмена веществ, детоксикации и здорового пищеварения.',
 'Metabolizma desteği, detoks ve sağlıklı sindirim için elma sirkesi bazlı çiğneme jölesi.',
 'Apple cider vinegar-based chewing gummies to support metabolism, detox and healthy digestion.',
 'أقراص قابلة للمضغ على أساس خل التفاح لدعم الأيض وإزالة السموم والهضم الصحي.',
  '{"ru":["60 жев. пастилок","500 мг яблочного уксуса","10 мкг витамина B12","5 мг пироксидина"],"tr":["60 çiğn. jölesi","500 mg elma sirkesi","10 mcg B12 vitamini","5 mg piridoksin"],"en":["60 gummies","500 mg apple cider vinegar","10 mcg Vitamin B12","5 mg Pyridoxine"],"ar":["60 حلبة قابلة للمضغ","500 ملغ خل التفاح","10 مكغ فيتامين B12","5 ملغ بيريدوكسين"]}', 3),

('prod-4', 'minerals', 1950, '/images/magnezyum.webp',
 'Магний Комплекс', 'Magnezyum Kompleks', 'Magnesium Complex', 'مجمّع المغنيسيوم',
 'Тройная смесь магния для расслабления мышц и улучшения сна. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Kas gevşemesi ve uyku kalitesi için üçlü magnezyum karışımı. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Triple magnesium blend for muscle relaxation and better sleep. A quality product to support your health. Natural composition and high effectiveness.',
 'مزيج ثلاثي المغنيسيوم لاسترخاء العضلات وتحسين النوم. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
  '{"ru":["400 мг","Глицинат 150 мг","Цитрат 150 мг","Малат 100 мг"],"tr":["400 mg","Glisinat 150 mg","Sitrat 150 mg","Malat 100 mg"],"en":["400 mg","Glycinate 150 mg","Citrate 150 mg","Malate 100 mg"],"ar":["400 ملغ","غلايسينات 150 ملغ","سترات 150 ملغ","مالات 100 ملغ"]}', 4),

('prod-5', 'supplements', 2200, '/images/dnl__.webp',
 'DNL Фитокомплекс', 'DNL Fito Kompleks', 'DNL Phyto Complex', 'المجمّع النباتي DNL',
 'Натуральный фитокомплекс для поддержки организма и общего укрепления здоровья. Качественный препарат на основе растительных компонентов.',
 'Vücudu desteklemek ve genel sağlığı güçlendirmek için doğal bitkisel kompleks. Bitkisel bileşenlere dayalı kaliteli bir ürün.',
 'Natural phyto-complex to support the body and strengthen overall health. A quality product based on plant components.',
 'مجمّع نباتي طبيعي لدعم الجسم وتعزيز الصحة العامة. منتج عالي الجودة مبني على مكونات نباتية.',
  '{"ru":["600 мг","Экстракт расторопши 200 мг","Экстракт одуванчика 150 мг","Артишок 100 мг"],"tr":["600 mg","Devedikeni ekstresi 200 mg","Karahindiba ekstresi 150 mg","Enginar 100 mg"],"en":["600 mg","Milk thistle extract 200 mg","Dandelion extract 150 mg","Artichoke 100 mg"],"ar":["600 ملغ","مستخلص شوك الحليب 200 ملغ","مستخلص الهندباء 150 ملغ","خرشوف 100 ملغ"]}', 5),

('prod-6', 'minerals', 1100, '/images/zincpng.webp',
 'Цинк Защита', 'Çinko Koruma', 'Zinc Protection', 'حماية الزنك',
 'Максимально сильная добавка цинка для сезонного иммунитета. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Mevsimsel bağışıklık için güçlü çinko takviyesi. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Maximum-strength zinc supplement for seasonal immunity. A quality product to support your health. Natural composition and high effectiveness.',
 'مكمّل زنك بأقصى قوة للمناعة الموسمية. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
  '{"ru":["50 мг","Глюконат цинка 50 мг","Витамин C 20 мг","Без ГМО","Без сахара"],"tr":["50 mg","Çinko glukonat 50 mg","C vitamini 20 mg","GDO''suz","Şekersiz"],"en":["50 mg","Zinc gluconate 50 mg","Vitamin C 20 mg","Non-GMO","Sugar-free"],"ar":["50 ملغ","غلوكونات الزنك 50 ملغ","فيتامين C 20 ملغ","خالٍ من الكائنات المعدلة جينياً","خالٍ من السكر"]}', 6),

('prod-7', 'supplements', 2100, '/images/enginar__.webp',
 'Экстракт расторопши и одуванчика', 'Devedikeni ve Karahindiba Ekstresi', 'Milk Thistle & Dandelion Extract', 'مستخلص شوك الحليب والهندباء',
 'Натуральные жевательные конфеты с экстрактом бузины, витамином С и цинком. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Kuş üzümü ekstresi, C vitamini ve çinko içeren doğal çiğneme şekerleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Natural chewing candies with elderberry extract, vitamin C and zinc. A quality product to support your health. Natural composition and high effectiveness.',
 'حلوى طبيعية قابلة للمضغ بمستخلص البلسان وفيتامين C والزنك. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
  '{"ru":["400 мг","Экстракт бузины 150 мг","Витамин C 20 мг","Цинк 10 мг","Без сахара"],"tr":["400 mg","Kuş üzümü ekstresi 150 mg","C vitamini 20 mg","Çinko 10 mg","Şekersiz"],"en":["400 mg","Elderberry extract 150 mg","Vitamin C 20 mg","Zinc 10 mg","Sugar-free"],"ar":["400 ملغ","مستخلص البلسان 150 ملغ","فيتامين C 20 ملغ","زنك 10 ملغ","خالٍ من السكر"]}', 7),

('prod-8', 'beauty', 3500, '/images/nadh_gummy.webp',
 'Антиоксидант', 'Antioksidan', 'Antioxidant', 'مضاد الأكسدة',
 'Гидролизованные пептиды коллагена для эластичности кожи и здоровья суставов. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Cilt esnekliği ve eklem sağlığı için hidrolize kolajen peptitleri. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Hydrolyzed collagen peptides for skin elasticity and joint health. A quality product to support your health. Natural composition and high effectiveness.',
 'ببتيدات الكولاجين المتحللة مائياً لمرونة البشرة وصحة المفاصل. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
  '{"ru":["500 мг","Гидролизованный коллаген 300 мг","Гиалуроновая кислота 50 мг","Витамин C 20 мг"],"tr":["500 mg","Hidrolize kolajen 300 mg","Hiyalüronik asit 50 mg","C vitamini 20 mg"],"en":["500 mg","Hydrolyzed collagen 300 mg","Hyaluronic acid 50 mg","Vitamin C 20 mg"],"ar":["500 ملغ","كولاجين محلول مائياً 300 ملغ","حمض الهيالورونيك 50 ملغ","فيتامين C 20 ملغ"]}', 8),

('prod-9', 'herbs', 2800, '/images/gimne.webp',
 'Хром', 'Krom', 'Chromium', 'الكروم',
 'Травяной экстракт с хромом для поддержания уровня сахара в крови и метаболизма. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Kan şekeri seviyesi ve metabolizma desteği için krom içeren bitkisel ekstre. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Herbal extract with chromium to support blood sugar levels and metabolism. A quality product to support your health. Natural composition and high effectiveness.',
 'مستخلص عشبي بالكروم لدعم مستويات سكر الدم والأيض. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
  '{"ru":["300 мг","Экстракт гимнемы 150 мг","Пиколинат хрома 100 мкг","Биотин 50 мкг"],"tr":["300 mg","Gymnema ekstresi 150 mg","Krom pikolinat 100 mcg","Biyotin 50 mcg"],"en":["300 mg","Gymnema extract 150 mg","Chromium picolinate 100 mcg","Biotin 50 mcg"],"ar":["300 ملغ","مستخلص غيمنيميا 150 ملغ","بيكولينات الكروم 100 مكغ","بيوتين 50 مكغ"]}', 9),

('prod-10', 'herbs', 2300, '/images/ginko_ginseng.webp',
 'Джинко Фитокомплекс', 'Ginkgo Fito Kompleks', 'Ginkgo Phyto Complex', 'المجمّع النباتي جينكو',
 'Натуральный фитокомплекс на основе гинкго билоба и женьшеня для поддержки мозговой активности, улучшения памяти и концентрации.',
 'Beyin aktivitesi, hafıza ve konsantrasyon desteği için ginkgo biloba ve ginseng bazlı doğal bitkisel kompleks.',
 'Natural phyto-complex based on ginkgo biloba and ginseng to support brain activity, improve memory and concentration.',
 'مجمّع نباتي طبيعي على أساس الجنكو بيلوبا والجنسنغ لدعم النشاط الذهني وتحسين الذاكرة والتركيز.',
  '{"ru":["300 мг","Экстракт гинкго билоба 150 мг","Экстракт женьшеня 100 мг","Витамин B6 5 мг"],"tr":["300 mg","Ginkgo biloba ekstresi 150 mg","Samsung ekstresi 100 mg","B6 vitamini 5 mg"],"en":["300 mg","Ginkgo biloba extract 150 mg","Ginseng extract 100 mg","Vitamin B6 5 mg"],"ar":["300 ملغ","مستخلص الجنكو بيلوبا 150 ملغ","مستخلص الجنسنغ 100 ملغ","فيتامين B6 5 ملغ"]}', 10),

('prod-11', 'vitamins', 1650, '/images/optimacomplex.webp',
 'Витамин B-Комплекс', 'B Vitamini Kompleksi', 'Vitamin B-Complex', 'فيتامين B المجمّع',
 'Полный комплекс витаминов группы B для энергетического обмена и поддержки нервной системы. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Enerji metabolizması ve sinir sistemi desteği için tam B vitamini kompleksi. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Complete B-group vitamin complex for energy metabolism and nervous system support. A quality product to support your health. Natural composition and high effectiveness.',
 'مجمّع فيتامينات B الكامل لدعم الأيض والجهاز العصبي. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
  '{"ru":["10 мг","B1 2 мг","B2 2 мг","B6 2 мг","B12 2 мкг","Ниацин 15 мг"],"tr":["10 mg","B1 2 mg","B2 2 mg","B6 2 mg","B12 2 mcg","Niasin 15 mg"],"en":["10 mg","B1 2 mg","B2 2 mg","B6 2 mg","B12 2 mcg","Niacin 15 mg"],"ar":["10 ملغ","B1 2 ملغ","B2 2 ملغ","B6 2 ملغ","B12 2 مكغ","نياسين 15 ملغ"]}', 11),

('prod-12', 'vitamins', 2900, '/images/multigummy.webp',
 'Мультивитамин Специальный', 'Özel Multivitamin', 'Special Multivitamin', 'فيتامينات متعددة خاصة',
 'Премиальная мультивитаминная формула для активного образа жизни и иммунитета. Качественный препарат для поддержания вашего здоровья. Натуральный состав и высокая эффективность.',
 'Aktif yaşam ve bağışıklık için premium multivitamin formülü. Sağlığınızı destekleyen kaliteli bir ürün. Doğal içerik ve yüksek etkililik.',
 'Premium multivitamin formula for an active lifestyle and immunity. A quality product to support your health. Natural composition and high effectiveness.',
 'تركيبة فيتامينات متعددة متميزة لنمط حياة نشط والمناعة. منتج عالي الجودة لدعم صحتك. تركيبة طبيعية وفعالية عالية.',
  '{"ru":["500 мг","Витамин C 60 мг","Цинк 10 мг","Селен 50 мкг","Биотин 50 мкг","Йод 100 мкг"],"tr":["500 mg","C vitamini 60 mg","Çinko 10 mg","Selen 50 mcg","Biyotin 50 mcg","İyot 100 mcg"],"en":["500 mg","Vitamin C 60 mg","Zinc 10 mg","Selenium 50 mcg","Biotin 50 mcg","Iodine 100 mcg"],"ar":["500 ملغ","فيتامين C 60 ملغ","زنك 10 ملغ","سيلينيوم 50 مكغ","بيوتين 50 مكغ","يود 100 مكغ"]}', 12)

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
