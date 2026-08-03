-- Обновить sort_order для двух последних товаров,
-- чтобы появилась плашка "Новое" (возраст < 7 дней)
update public.products
set sort_order = case id
  when 'prod-1785669452074' then 1785669452
  when 'prod-1785672176662' then 1785672176
end
where id in ('prod-1785669452074', 'prod-1785672176662');

-- Проверка
select id, name_ru, sort_order from public.products order by sort_order desc;