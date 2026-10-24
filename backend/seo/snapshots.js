import sanitizeHtml from 'sanitize-html';
import { SITE, CATEGORY_LABELS, DESSERT_ARTICLE_SLUG } from './siteFacts.js';
import { esc, stripTags, clip } from './render.js';

const nav = () => `
<nav aria-label="Main">
  <a href="/">Home</a> <a href="/menu">Menu</a> <a href="/articles">Articles</a>
  <a href="/articles/${DESSERT_ARTICLE_SLUG}">Persian ice cream in Qatar</a>
  <a href="/about">About</a> <a href="/contact">Contact</a> <a href="/careers">Careers</a>
</nav>`;

const visit = () => `
<section>
  <h2>Visit Kabab Dagh Nan Dagh in Doha</h2>
  <address>
    ${esc(SITE.name)}, ${esc(SITE.street)}, ${esc(SITE.city)}, ${esc(SITE.country)}<br>
    Phone: <a href="${SITE.phoneHref}">${esc(SITE.phone)}</a><br>
    Email: <a href="mailto:${SITE.email}">${esc(SITE.email)}</a><br>
    Opening hours: ${esc(SITE.hours)}<br>
    <a href="${SITE.mapsUrl}">Directions on Google Maps</a>
  </address>
  <p>Order online on this website or through <a href="${SITE.talabatUrl}">Talabat</a>.
  Follow us on <a href="${SITE.instagramUrl}">Instagram</a> and <a href="${SITE.tiktokUrl}">TikTok</a>.</p>
</section>`;

const fmtDate = (d) => {
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? '' : x.toISOString().slice(0, 10);
};

const enTitle = (a) => a?.title?.en || a?.title?.fa || a?.slug || '';
const enExcerpt = (a) => a?.excerpt?.en || clip(stripTags(a?.content?.en || ''), 200);

export function homeSnapshot({ articles = [], dishes = [] }) {
  const names = dishes.slice(0, 10).map((d) => d?.name?.en).filter(Boolean);
  return `
<h1>Kabab Dagh Nan Dagh - Iranian Restaurant in Doha, Qatar</h1>
<p>Kabab Dagh Nan Dagh is an Iranian (Persian) restaurant on Salwa Road in Doha, Qatar.
The menu covers Iranian kebabs, breakfast, combo meals, appetizers and drinks, plus Persian desserts such as
traditional Persian ice cream (bastani sonnati) and Faloodeh Shirazi.</p>
${names.length ? `<h2>From the menu</h2><p>${names.map(esc).join(', ')}. <a href="/menu">See the full menu</a>.</p>` : '<p><a href="/menu">See the full menu</a>.</p>'}
${articles.length ? `<h2>Latest articles</h2><ul>${articles.slice(0, 6).map((a) => `<li><a href="/articles/${esc(a.slug)}">${esc(enTitle(a))}</a></li>`).join('')}</ul>` : ''}
<p><a href="/articles/${DESSERT_ARTICLE_SLUG}">Best ice cream in Qatar: Bastani Sonnati &amp; Faloodeh Shirazi</a></p>
${visit()}
${nav()}`;
}

export function menuSnapshot(dishes = []) {
  const groups = {};
  for (const d of dishes) (groups[d.category] ||= []).push(d);
  const order = Object.keys(CATEGORY_LABELS);
  const sections = order
    .filter((k) => groups[k]?.length)
    .map((k) => {
      const items = groups[k]
        .map((d) => {
          const name = d?.name?.en || d?.name?.fa;
          if (!name) return '';
          const desc = d?.description?.en ? ` - ${esc(clip(stripTags(d.description.en), 200))}` : '';
          const price = typeof d.price === 'number' ? ` - QAR ${d.price}` : '';
          return `<li><strong>${esc(name)}</strong>${price}${desc}</li>`;
        })
        .join('');
      return `<section><h2>${esc(CATEGORY_LABELS[k])}</h2><ul>${items}</ul></section>`;
    })
    .join('');
  return `
<h1>Menu - Kabab Dagh Nan Dagh, Doha</h1>
<p>Iranian kebabs, breakfast, combo meals, appetizers, drinks and Persian desserts. Prices in Qatari riyals (QAR).
Order online or through <a href="${SITE.talabatUrl}">Talabat</a>.</p>
${sections}
<p>Persian desserts: <a href="/articles/${DESSERT_ARTICLE_SLUG}">Bastani Sonnati &amp; Faloodeh Shirazi</a>.</p>
${visit()}
${nav()}`;
}

export function articlesSnapshot(articles = []) {
  const list = articles
    .map((a) => `<li><a href="/articles/${esc(a.slug)}">${esc(enTitle(a))}</a>${fmtDate(a.publishedAt) ? ` (${fmtDate(a.publishedAt)})` : ''} - ${esc(clip(enExcerpt(a), 180))}</li>`)
    .join('');
  return `
<h1>Articles &amp; Stories - Kabab Dagh Nan Dagh</h1>
<p>Persian food stories, recipes and guides from the Iranian restaurant in Doha, Qatar.</p>
<ul>
  <li><a href="/articles/${DESSERT_ARTICLE_SLUG}">Best Ice Cream in Qatar: Bastani Sonnati &amp; Faloodeh Shirazi</a></li>
  ${list}
</ul>
${nav()}`;
}

const SANITIZE = {
  allowedTags: ['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'blockquote', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'],
  allowedAttributes: { a: ['href'], img: ['src', 'alt'] },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
};

export function articleSnapshot(article) {
  const body = sanitizeHtml(article?.content?.en || '', SANITIZE);
  const excerpt = article?.excerpt?.en ? `<p><em>${esc(article.excerpt.en)}</em></p>` : '';
  return `
<article>
  <p><a href="/">Home</a> / <a href="/articles">Articles</a></p>
  <h1>${esc(enTitle(article))}</h1>
  <p>By ${esc(SITE.name)}${fmtDate(article.publishedAt) ? ` - <time datetime="${fmtDate(article.publishedAt)}">${fmtDate(article.publishedAt)}</time>` : ''}</p>
  ${excerpt}
  ${body}
</article>
${visit()}
${nav()}`;
}

// Generic renderer for the dessert article data exported at build time
// (frontend/scripts/export-seo-data.mjs). It does not need to know the exact structure.
const SKIP_KEY = /^(image|img|src|href|url|icon|alt|slug|id|cta|link|path|poster|video|lang|locale)$/i;
const HEAD_KEY = /(title|heading|headline|question|name)$/i;

function flatten(node, depth, out, state) {
  if (state.chars > 24000 || node == null) return;
  if (typeof node === 'string') {
    const t = node.trim();
    if (!t || /^(\/|https?:)/.test(t)) return;
    state.chars += t.length;
    out.push(`<p>${esc(t)}</p>`);
    return;
  }
  if (Array.isArray(node)) {
    if (node.length && node.every((x) => typeof x === 'string')) {
      const items = node.filter((x) => x.trim() && !/^(\/|https?:)/.test(x.trim()));
      state.chars += items.join('').length;
      if (items.length) out.push(`<ul>${items.map((x) => `<li>${esc(x.trim())}</li>`).join('')}</ul>`);
      return;
    }
    node.forEach((x) => flatten(x, depth + 1, out, state));
    return;
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (SKIP_KEY.test(k)) continue;
      if (typeof v === 'string' && HEAD_KEY.test(k) && v.trim()) {
        const tag = !state.h1 && depth <= 1 ? 'h1' : depth <= 2 ? 'h2' : 'h3';
        if (tag === 'h1') state.h1 = true;
        state.chars += v.length;
        out.push(`<${tag}>${esc(v.trim())}</${tag}>`);
      } else {
        flatten(v, depth + 1, out, state);
      }
    }
  }
}

export function dessertSnapshot(data) {
  const out = [];
  const state = { chars: 0, h1: false };
  if (data?.en) flatten(data.en, 1, out, state);
  const body = out.length
    ? out.join('\n')
    : `<h1>Best Ice Cream in Qatar: Bastani Sonnati &amp; Faloodeh Shirazi</h1>
<p>Kabab Dagh Nan Dagh serves traditional Persian ice cream (bastani sonnati) and Faloodeh Shirazi at its restaurant on Salwa Road in Doha, Qatar.</p>`;
  return `<article>${state.h1 || !out.length ? '' : '<h1>Best Ice Cream in Qatar: Bastani Sonnati &amp; Faloodeh Shirazi</h1>'}${body}</article>
${visit()}
${nav()}`;
}

export function contactSnapshot() {
  return `<h1>Contact &amp; Location - Kabab Dagh Nan Dagh, Doha</h1>${visit()}${nav()}`;
}
export function aboutSnapshot() {
  return `<h1>About Kabab Dagh Nan Dagh</h1>
<p>Kabab Dagh Nan Dagh is an Iranian restaurant on Salwa Road in Doha, Qatar, serving Iranian kebab, fresh nan, breakfast, combo meals and Persian desserts.</p>${visit()}${nav()}`;
}
export function careersSnapshot() {
  return `<h1>Careers at Kabab Dagh Nan Dagh, Doha</h1>
<p>Join the team at our Iranian restaurant in Doha, Qatar. Open roles and the online application form are on this page.</p>${visit()}${nav()}`;
}
