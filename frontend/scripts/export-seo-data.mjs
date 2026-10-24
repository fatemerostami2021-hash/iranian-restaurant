// Runs before `vite build` (npm "prebuild"). Copies the dessert article text into
// public/seo-data/ so the backend can put it in the HTML that crawlers receive.
// It never fails the build: if anything goes wrong it just skips.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, '..', 'public', 'seo-data');

try {
  const mod = await import(pathToFileURL(path.join(here, '..', 'src', 'data', 'dessertsArticleContent.js')).href);
  const en = mod.dessertsArticleContent?.en;
  if (!en) throw new Error('dessertsArticleContent.en not found');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'dessert-article.json'), JSON.stringify({ en }));
  console.log('[seo] exported seo-data/dessert-article.json');
} catch (e) {
  console.warn('[seo] dessert article export skipped:', e.message);
}
