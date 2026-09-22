-- Колонки реальных отзывов покупателей для фида Google и Schema.org.
-- Заполняются ТОЛЬКО настоящими оценками (политика Google запрещает выдуманные
-- рейтинги — за это дают manual action). Ничего заполнять не нужно, пока реальных
-- отзывов нет: когда появятся (рекомендуется модуль отзывов на сайте), достаточно
-- записать их в колонку reviews — фид/JSON-LD подхватят автоматически.
-- Чтобы колонки лежали заранее:

alter table public.products add column if not exists rating_value numeric;
alter table public.products add column if not exists review_count  integer;
alter table public.products add column if not exists reviews       jsonb default '[]'::jsonb;

-- Формат отзыва в reviews:
-- [{"author": "Имя", "rating": 5, "text": "Текст отзыва", "date": "2026-09-01"}]
-- Если reviews заполнен, фид и разметка считают rating_value/review_count сами.
-- Колонки rating_value/review_count — ручной запасной вариант, когда нужен средний
-- рейтинг без текстов отзывов.

-- Проверка
select id, name_ru, reviews, rating_value, review_count
from public.products
order by sort_order desc;