import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

let spaCache: string | null = null;

export async function getSpaHtml(): Promise<string> {
  if (spaCache) return spaCache;
  const filePath = join(process.cwd(), 'dist', 'index.html');
  spaCache = await readFile(filePath, 'utf-8');
  return spaCache;
}