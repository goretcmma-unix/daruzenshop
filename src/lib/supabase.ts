import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { products, dedupeProducts, type Product, type Lang } from '../data';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, { persistSession: false }) : null;

interface ProductRow {
  id: string;
  category_key: Product['categoryKey'];
  price: number;
  image: string;
  name_ru: string;
  name_tr: string;
  name_en: string;
  name_ar: string;
  desc_ru: string;
  desc_tr: string;
  desc_en: string;
  desc_ar: string;
  specs: Partial<Record<Lang, string[]>> | null;
  sort_order: number | null;
}

const LANGS: Lang[] = ['ru', 'tr', 'en', 'ar'];

const rowToProduct = (r: ProductRow): Product => {
  const names = {} as Record<Lang, string>;
  const descriptions = {} as Record<Lang, string>;
  LANGS.forEach(l => {
    names[l] = r[`name_${l}` as keyof ProductRow] as unknown as string;
    descriptions[l] = r[`desc_${l}` as keyof ProductRow] as unknown as string;
  });
  return {
    id: r.id,
    names,
    categoryKey: r.category_key,
    price: Number(r.price),
    image: r.image,
    descriptions,
    specs: r.specs ?? undefined,
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  if (!supabase) return dedupeProducts(products);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true, nullsFirst: false });
  if (error || !data) return dedupeProducts(products);
  return dedupeProducts((data as ProductRow[]).map(rowToProduct));
};

const productToRow = (p: Product) => ({
  id: p.id,
  category_key: p.categoryKey,
  price: p.price,
  image: p.image,
  name_ru: p.names.ru,
  name_tr: p.names.tr,
  name_en: p.names.en,
  name_ar: p.names.ar,
  desc_ru: p.descriptions.ru,
  desc_tr: p.descriptions.tr,
  desc_en: p.descriptions.en,
  desc_ar: p.descriptions.ar,
  specs: p.specs ?? null,
});

export const upsertProduct = async (p: Product): Promise<void> => {
  if (!supabase) return;
  const { error } = await supabase.from('products').upsert(productToRow(p));
  if (error) throw error;
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!supabase) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};
