-- Rename long numeric IDs to clean prod-13 / prod-14
-- Run this in Supabase SQL Editor

UPDATE products SET id = 'prod-13' WHERE id = 'prod-1785669452074';
UPDATE products SET id = 'prod-14' WHERE id = 'prod-1785672176662';
