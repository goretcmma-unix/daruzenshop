import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const url = 'https://fstihxljqljhfyubptsk.supabase.co';
const anonKey = fs.readFileSync('C:/Users/goret/OneDrive/Рабочий стол/daruzen/daruzenshop/.env', 'utf8')
  .split('\n').map(l => l.trim()).find(l => l.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=').slice(1).join('=');

const supabase = createClient(url, anonKey, { persistSession: false });

const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: false, nullsFirst: false });
if (error) { console.error('ERR', error); process.exit(1); }
for (const r of data) {
  const specs = r.specs;
  const ru = specs?.ru;
  console.log('===== ' + r.id + ' | ' + r.name_ru + ' =====');
  console.log('  has specs: ' + (ru ? 'YES (' + ru.length + ' lines)' : 'NO'));
  if (ru) {
    const tableLines = ru.filter(l => l.includes('|') && !l.includes('**'));
    console.log('  table rows: ' + tableLines.length);
    console.log('  first rows: ' + JSON.stringify(tableLines.slice(0, 4)));
  }
}
