import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { SITE, DESSERT_ARTICLE_SLUG, CATEGORY_LABELS } from './siteFacts.js';
import { PAGES } from './pages.js';
import { renderShell, esc, stripTags, clip, absUrl, breadcrumbLd } from './render.js';
import {
  homeSnapshot, menuSnapshot, articlesSnapshot, articleSnapshot, dessertSnapshot,
  contactSnapshot, aboutSnapshot, careersSnapshot,
} from './snapshots.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DIST = path.resolve(__dirname, '../../frontend/dist');

// Paths that are real React routes but must not be indexed or need no snapshot.
const APP_PREFIXES = ['/admin', '/checkout', '/profile'];
const CATEGORY_RE = /^\/menu\/category\/[^/]+$/;

/**
 * Serves the React app's index.html with page-specific SEO for crawlers,
 * plus /sitemap.xml and /llms.txt generated from the database.
 * Mount it AFTER all /api and /uploads routes.
 */
export function createSeoRouter({ Article, Dish, distDir = process.env.FRONTEND_DIST || DEFAULT_DIST }) {
  const router = express.Router();

  // ---------- tiny in-memory cache (protects the DB from crawler bursts) ----------
  const memo = new Map();
  const cached = async (key, ttlMs, fn) => {
    const hit = memo.get(key);
    if (hit && hit.exp > Date.now()) return hit.val;
    const val = await fn();
    memo.set(key, { val, exp: Date.now() + ttlMs });
    return val;
  };
  const MIN = 60 * 1000;

  const getArticles = () =>
    cached('articles', 5 * MIN, () =>
      Article.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .select('slug title excerpt publishedAt updatedAt images')
        .lean()
    );
  const getDishes = () =>
    cached('dishes', 5 * MIN, () => Dish.find({}).sort({ category: 1, code: 1 }).lean());
  const getArticle = (slug) =>
    cached(`article:${slug}`, 2 * MIN, () => Article.findOne({ slug, status: 'published' }).lean());

  // ---------- index.html template (re-read when a new deploy swaps dist) ----------
  let tpl = { mtime: 0, html: null };
  const template = () => {
    const file = path.join(distDir, 'index.html');
    try {
      const st = fs.statSync(file);
      if (st.mtimeMs !== tpl.mtime) tpl = { mtime: st.mtimeMs, html: fs.readFileSync(file, 'utf8') };
    } catch {
      /* during a dist swap keep serving the last good copy */
    }
    return tpl.html;
  };

  const dessertData = () =>
    cached('dessert-json', 10 * MIN, async () => {
      try {
        return JSON.parse(fs.readFileSync(path.join(distDir, 'seo-data', 'dessert-article.json'), 'utf8'));
      } catch {
        return null;
      }
    });

  // ---------- responses ----------
  const sendHtml = (res, status, html) => {
    // helmet's CSP/COOP would break inline handlers and the Google sign-in popup on the SPA shell
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('Content-Security-Policy-Report-Only');
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');
    res.status(status).set({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' }).send(html);
  };

  const page = async (res, status, pageData) => {
    const t = template();
    if (!t) return res.status(503).type('text/plain').send('Frontend build not found');
    return sendHtml(res, status, renderShell(t, pageData));
  };

  const guard = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error('[seo] error:', err?.message);
      next(err);
    }
  };

  // ---------- canonical: no trailing slash ----------
  router.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && req.path.length > 1 && req.path.endsWith('/')) {
      const q = req.originalUrl.slice(req.originalUrl.indexOf('?') === -1 ? req.originalUrl.length : req.originalUrl.indexOf('?'));
      return res.redirect(301, req.path.replace(/\/+$/, '') + q);
    }
    next();
  });

  // ---------- sitemap.xml ----------
  router.get('/sitemap.xml', guard(async (req, res) => {
    const [articles, dishes] = await Promise.all([getArticles(), getDishes()]);
    const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null);
    const latestDish = dishes.reduce((m, d) => (d.updatedAt && new Date(d.updatedAt) > m ? new Date(d.updatedAt) : m), new Date(0));
    const latestArticle = articles.reduce((m, a) => (a.updatedAt && new Date(a.updatedAt) > m ? new Date(a.updatedAt) : m), new Date(0));
    const urls = [
      { loc: '/', lastmod: day(latestArticle.getTime() ? latestArticle : null) },
      { loc: '/menu', lastmod: day(latestDish.getTime() ? latestDish : null) },
      { loc: '/articles', lastmod: day(latestArticle.getTime() ? latestArticle : null) },
      { loc: `/articles/${DESSERT_ARTICLE_SLUG}` },
      ...articles
        .filter((a) => a.slug && a.slug !== DESSERT_ARTICLE_SLUG)
        .map((a) => ({ loc: `/articles/${a.slug}`, lastmod: day(a.updatedAt || a.publishedAt) })),
      { loc: '/about' },
      { loc: '/contact' },
      { loc: '/careers' },
    ];
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map((u) => `  <url><loc>${esc(SITE.origin + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') +
      '\n</urlset>\n';
    res.set({ 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }).send(xml);
  }));

  // ---------- llms.txt ----------
  router.get('/llms.txt', guard(async (req, res) => {
    const articles = await getArticles();
    const lines = [
      `# ${SITE.name}`,
      '',
      `> Iranian (Persian) restaurant on Salwa Road in Doha, Qatar. Iranian kebabs, fresh nan, breakfast, combo meals, appetizers, drinks and Persian desserts (bastani sonnati ice cream, Faloodeh Shirazi). Order online or through Talabat.`,
      '',
      '## Key pages',
      `- [Home](${SITE.origin}/): Overview of the restaurant in Doha`,
      `- [Menu](${SITE.origin}/menu): Full menu with prices in QAR`,
      `- [Contact & location](${SITE.origin}/contact): Address, phone, opening hours, directions`,
      `- [About](${SITE.origin}/about): About the restaurant`,
      '',
      '## Articles',
      `- [Best Ice Cream in Qatar: Bastani Sonnati & Faloodeh Shirazi](${SITE.origin}/articles/${DESSERT_ARTICLE_SLUG}): Persian ice cream and faloodeh in Doha`,
      ...articles
        .filter((a) => a.slug && a.slug !== DESSERT_ARTICLE_SLUG)
        .slice(0, 30)
        .map((a) => `- [${(a.title?.en || a.slug).replace(/[\[\]]/g, '')}](${SITE.origin}/articles/${a.slug}): ${clip(stripTags(a.excerpt?.en || ''), 140)}`),
      '',
      '## Visit',
      `- Address: ${SITE.street}, ${SITE.city}, ${SITE.country}`,
      `- Phone: ${SITE.phone}`,
      `- Opening hours: ${SITE.hours}`,
      `- Order: ${SITE.talabatUrl}`,
      '',
    ];
    res.set({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }).send(lines.join('\n'));
  }));

  // ---------- HTML pages ----------
  router.get('/', guard(async (req, res) => {
    const [articles, dishes] = await Promise.all([getArticles(), getDishes()]);
    await page(res, 200, { ...PAGES['/'], path: '/', snapshot: homeSnapshot({ articles, dishes }) });
  }));

  router.get('/menu', guard(async (req, res) => {
    const dishes = await getDishes();
    const sections = Object.keys(CATEGORY_LABELS)
      .map((k) => ({
        '@type': 'MenuSection',
        name: CATEGORY_LABELS[k],
        hasMenuItem: dishes
          .filter((d) => d.category === k && d?.name?.en)
          .map((d) => ({
            '@type': 'MenuItem',
            name: d.name.en,
            ...(d?.description?.en ? { description: clip(stripTags(d.description.en), 200) } : {}),
            ...(typeof d.price === 'number' ? { offers: { '@type': 'Offer', price: String(d.price), priceCurrency: 'QAR' } } : {}),
          })),
      }))
      .filter((s) => s.hasMenuItem.length);
    await page(res, 200, {
      ...PAGES['/menu'],
      path: '/menu',
      snapshot: menuSnapshot(dishes),
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'Menu', name: `${SITE.name} Menu`, url: `${SITE.origin}/menu`, inLanguage: 'en', hasMenuSection: sections },
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Menu', path: '/menu' }]),
      ],
    });
  }));

  router.get('/articles', guard(async (req, res) => {
    const articles = await getArticles();
    await page(res, 200, {
      ...PAGES['/articles'],
      path: '/articles',
      snapshot: articlesSnapshot(articles),
      jsonLd: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Articles', path: '/articles' }])],
    });
  }));

  router.get(`/articles/${DESSERT_ARTICLE_SLUG}`, guard(async (req, res) => {
    const data = await dessertData();
    await page(res, 200, {
      ...PAGES.dessert,
      path: `/articles/${DESSERT_ARTICLE_SLUG}`,
      ogType: 'article',
      snapshot: dessertSnapshot(data),
      // JSON-LD for this page is emitted client-side by DessertArticle.jsx
    });
  }));

  router.get('/articles/:slug', guard(async (req, res) => {
    const slug = String(req.params.slug || '').toLowerCase();
    const article = /^[a-z0-9-]{1,120}$/.test(slug) ? await getArticle(slug) : null;
    if (!article) {
      return page(res, 404, { title: 'Article not found | Kabab Dagh Nan Dagh', description: 'This article could not be found.', path: `/articles/${slug}`, noindex: true });
    }
    const title = `${article.title?.en || slug} | ${SITE.name}`;
    const description = clip(article.excerpt?.en ? String(article.excerpt.en).replace(/\s+/g, ' ').trim() : stripTags(article.content?.en || ''), 155);
    const image = absUrl(article.images?.[0]) || SITE.ogImage;
    const url = `${SITE.origin}/articles/${article.slug}`;
    await page(res, 200, {
      title,
      description,
      path: `/articles/${article.slug}`,
      ogType: 'article',
      image,
      snapshot: articleSnapshot(article),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: clip(article.title?.en || slug, 110),
          description,
          image: [image],
          datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
          dateModified: (article.updatedAt || article.publishedAt) ? new Date(article.updatedAt || article.publishedAt).toISOString() : undefined,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          author: { '@type': 'Organization', name: SITE.name, url: SITE.origin },
          publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.logo } },
          inLanguage: 'en',
        },
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Articles', path: '/articles' }, { name: article.title?.en || slug, path: `/articles/${article.slug}` }]),
      ],
    });
  }));

  router.get('/about', guard((req, res) => page(res, 200, { ...PAGES['/about'], path: '/about', snapshot: aboutSnapshot() })));
  router.get('/contact', guard((req, res) => page(res, 200, { ...PAGES['/contact'], path: '/contact', snapshot: contactSnapshot() })));
  router.get('/careers', guard((req, res) => page(res, 200, { ...PAGES['/careers'], path: '/careers', snapshot: careersSnapshot() })));

  // ---------- everything else ----------
  router.use(guard(async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const p = req.path;
    if (p === '/api' || p.startsWith('/api/') || p.startsWith('/uploads/')) return next();
    // missing files (old hashed assets, typos) must be real 404s, not index.html
    if (/\.[a-z0-9]{1,8}$/i.test(p)) return res.status(404).type('text/plain').send('Not found');
    const isApp = APP_PREFIXES.some((x) => p === x || p.startsWith(`${x}/`)) || CATEGORY_RE.test(p);
    const t = template();
    if (!t) return res.status(503).type('text/plain').send('Frontend build not found');
    // React renders its own NotFound page; we only make the HTTP status honest.
    return sendHtml(res, isApp ? 200 : 404, t);
  }));

  return router;
}
