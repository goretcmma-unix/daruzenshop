import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { products, dedupeProducts, STOCK_SPECS_KEY, type Product, type Lang } from '../data';

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
  notes_ru: string | null;
  notes_tr: string | null;
  notes_en: string | null;
  notes_ar: string | null;
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
  const notes = {} as Record<Lang, string>;
  LANGS.forEach(l => {
    const n = r[`notes_${l}` as keyof ProductRow] as unknown as string | null;
    if (n) notes[l] = n;
  });
  return {
    id: r.id,
    names,
    categoryKey: r.category_key,
    price: Number(r.price),
    image: r.image,
    descriptions,
    specs: r.specs ?? undefined,
    notes: Object.keys(notes).length ? notes : undefined,
    createdAt: r.sort_order ?? undefined,
  };
};

let seeded = false;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    if (!supabase) return dedupeProducts(products);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: false, nullsFirst: false });
    if (error || !data || data.length === 0) {
      if (!seeded) {
        seeded = true;
        for (const p of products) {
          await supabase.from('products').upsert(productToRow(p)).catch(() => {});
        }
      }
      return dedupeProducts(products);
    }
    const dbRows = (data as ProductRow[]).map(rowToProduct);
    // Показываем ТОЛЬКО товары которые есть в data.ts
    // Локальные данные из data.ts имеют приоритет над базой
    const localIds = new Set(products.map(p => p.id));
    const filteredDb = dbRows.filter(dbP => localIds.has(dbP.id));
    const backfilled = filteredDb.map(dbP => {
      const localP = products.find(p => p.id === dbP.id);
      if (!localP) return dbP;
      // Локальные данные имеют приоритет, но сохраняем notes из базы если есть
      const merged: Product = {
        ...localP,
        notes: localP.notes ?? dbP.notes,
      };
      // Наличие хранится в базе (specs._stock) — переносим его в локальный товар,
      // чтобы тумблер «В наличии» сохранялся после перезагрузки
      const stockSpec = dbP.specs?.[STOCK_SPECS_KEY as Lang];
      if (stockSpec) {
        merged.specs = { ...(localP.specs ?? {}), [STOCK_SPECS_KEY as Lang]: stockSpec };
      }
      return merged;
    });
    // Локальные данные из data.ts имеют приоритет над базой
    // (backfilled = локальный товар + примечания и наличие из базы)
    const merged = dedupeProducts([...backfilled, ...products]);
    return merged.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0) || (b.id < a.id ? -1 : b.id > a.id ? 1 : 0));
  } catch {
    return dedupeProducts(products);
  }
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
  notes_ru: p.notes?.ru ?? null,
  notes_tr: p.notes?.tr ?? null,
  notes_en: p.notes?.en ?? null,
  notes_ar: p.notes?.ar ?? null,
  sort_order: p.createdAt ?? Math.floor(Date.now() / 1000),
});

export const upsertProduct = async (p: Product): Promise<void> => {
  if (!supabase) return;
  const row = productToRow(p);
  const { data } = await supabase.from('products').select('id').eq('id', p.id).maybeSingle();
  if (data) {
    const { data: updated, error } = await supabase.from('products').update(row).eq('id', p.id).select('id');
    if (error) throw error;
    if (!updated || updated.length === 0) {
      throw new Error('Нет прав на изменение товара — проверьте права админа в базе');
    }
  } else {
    const { error } = await supabase.from('products').insert(row);
    if (error) throw error;
  }
};

export const uploadProductImage = async (productId: string, blob: Blob): Promise<string> => {
  if (!supabase) throw new Error('Supabase не настроен');
  const path = `${productId}/${Date.now()}.webp`;
  const { error } = await supabase.storage.from('product_image').upload(path, blob, {
    contentType: 'image/webp',
  });
  if (error) throw error;
  const { data } = supabase.storage.from('product_image').getPublicUrl(path);
  return data.publicUrl;
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!supabase) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};

export const seedAllProducts = async (): Promise<number> => {
  if (!supabase) return 0;
  for (const p of products) {
    await upsertProduct(p);
  }
  return products.length;
};
