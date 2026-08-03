import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const url = 'https://fstihxljqljhfyubptsk.supabase.co';
const anonKey = fs.readFileSync('C:/Users/goret/OneDrive/Рабочий стол/daruzen/daruzenshop/.env', 'utf8')
  .split('\n').map(l => l.trim()).find(l => l.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=').slice(1).join('=');

const supabase = createClient(url, anonKey, { persistSession: false });

// Test 1: UPDATE a single cell on a test product, check if it errors and if rowCount changes
const testId = 'prod-999-test-tmp';
const { data: ins, error: insErr } = await supabase.from('products').insert({
  id: testId,
  category_key: 'herbs',
  price: 1,
  image: '',
  name_ru: 'test', name_tr: 'test', name_en: 'test', name_ar: 'test',
  desc_ru: 'x', desc_tr: 'x', desc_en: 'x', desc_ar: 'x',
  specs: { ru: ['A | 1'] },
  sort_order: 999999
}).select('id');
console.log('INSERT:', insErr ? ('ERR ' + insErr.message) : 'OK ' + JSON.stringify(ins));

const { data: upd, error: updErr, count } = await supabase.from('products').update({ name_ru: 'updated' }).eq('id', testId).select('id');
console.log('UPDATE:', updErr ? ('ERR ' + updErr.message) : ('OK count=' + JSON.stringify(upd)));

const { error: delErr } = await supabase.from('products').delete().eq('id', testId);
console.log('DELETE:', delErr ? ('ERR ' + delErr.message) : 'OK');
