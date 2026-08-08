-- Включить/пересоздать права доступа для админ-панели.
-- Выполнить один раз в Supabase Dashboard → SQL Editor.
--
-- Что это чинит:
--   * «Нет в наличии» / «В наличии» (тумблер) — через update в базе
--   * добавление НОВЫХ товаров — через insert
--   * удаление товаров — через delete
--   * загрузку фото — через storage (product_image)
--   * ошибку «Could not find the 'notes_ar' column» — если колонок примечаний нет

-- 0. Колонки примечаний (если их ещё нет в таблице)
alter table public.products add column if not exists notes_ru text;
alter table public.products add column if not exists notes_tr text;
alter table public.products add column if not exists notes_en text;
alter table public.products add column if not exists notes_ar text;

-- 1. Чтение для всех посетителей (магазин)
alter table public.products enable row level security;

drop policy if exists "products read" on public.products;
create policy "products read" on public.products
  for select using (true);

-- 2. Запись (insert / update / delete) только для авторизованного админа
drop policy if exists "products write" on public.products;
create policy "products write" on public.products
  for all to authenticated
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' )
  with check ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- 3. Назначить роль admin аккаунту владельца магазина
--    (если вход в админку под другим email — замените в where)
update auth.users
set raw_app_meta_data = jsonb_set(coalesce(raw_app_meta_data, '{}'), '{role}', '"admin"')
where email = 'daruzenshop@gmail.com';

-- 4. Хранилище фото: публичное чтение + загрузка админом
insert into storage.buckets (id, name, public) values ('product_image', 'product_image', true)
on conflict (id) do update set public = true;

drop policy if exists "product_image read" on storage.objects;
create policy "product_image read" on storage.objects
  for select using (bucket_id = 'product_image');

drop policy if exists "product_image write" on storage.objects;
create policy "product_image write" on storage.objects
  for all to authenticated
  using ( bucket_id = 'product_image' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' )
  with check ( bucket_id = 'product_image' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );
