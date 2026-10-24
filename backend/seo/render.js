import { SITE } from './siteFacts.js';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const stripTags = (html = '') =>
  String(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export const clip = (s = '', n = 155) => {
  const t = String(s).trim();
  if (t.length <= n) return t;
  return t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
};

export const absUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  return `${SITE.origin}${u.startsWith('/') ? '' : '/'}${u}`;
};

const jsonLdTag = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// The snapshot is real HTML for crawlers that do not run JavaScript. It is visually hidden
// (screen-reader style) so people never see an unstyled page flash before React starts,
// and React replaces it as soon as it mounts.
const SNAPSHOT_CSS =
  '<style data-seo>.seo-snapshot{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}</style>';

/**
 * Takes the built frontend/dist/index.html and returns it with page-specific
 * <title>, meta, canonical, JSON-LD and a text snapshot inside #root.
 * Tags React Helmet also emits carry data-rh="true", so Helmet replaces them cleanly
 * (no duplicates). JSON-LD has no data-rh, so Helmet leaves it alone.
 */
export function renderShell(template, page = {}) {
  const {
    title = '',
    description = '',
    path = '/',
    ogType = 'website',
    image = SITE.ogImage,
    noindex = false,
    jsonLd = [],
    snapshot = '',
  } = page;

  let html = template;

  if (title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
    html = html.replace(/<meta\s+(?:name|property)="(?:description|og:[^"]*|twitter:[^"]*)"[^>]*>\s*/gi, '');
  }
  if (noindex) {
    html = html.replace(/<meta\s+name="robots"[^>]*>\s*/i, '');
  }

  const url = `${SITE.origin}${path}`;
  const head = [];
  if (title) {
    head.push(`<title>${esc(title)}</title>`);
    head.push(`<meta data-rh="true" name="description" content="${esc(description)}" />`);
    head.push(`<meta data-rh="true" property="og:type" content="${esc(ogType)}" />`);
    head.push(`<meta data-rh="true" property="og:site_name" content="${esc(SITE.name)}" />`);
    head.push(`<meta data-rh="true" property="og:locale" content="en_US" />`);
    head.push(`<meta data-rh="true" property="og:title" content="${esc(title)}" />`);
    head.push(`<meta data-rh="true" property="og:description" content="${esc(description)}" />`);
    head.push(`<meta data-rh="true" property="og:url" content="${esc(url)}" />`);
    head.push(`<meta data-rh="true" property="og:image" content="${esc(image)}" />`);
    head.push(`<meta data-rh="true" name="twitter:card" content="summary_large_image" />`);
    head.push(`<meta data-rh="true" name="twitter:title" content="${esc(title)}" />`);
    head.push(`<meta data-rh="true" name="twitter:description" content="${esc(description)}" />`);
    head.push(`<meta data-rh="true" name="twitter:image" content="${esc(image)}" />`);
  }
  if (noindex) head.push('<meta name="robots" content="noindex, follow" />');
  else if (title) head.push(`<link data-rh="true" rel="canonical" href="${esc(url)}" />`);
  for (const obj of jsonLd) head.push(jsonLdTag(obj));
  if (snapshot) head.push(SNAPSHOT_CSS);

  html = html.replace('</head>', () => `${head.join('\n    ')}\n  </head>`);

  if (snapshot) {
    html = html.replace(/<div id="root">\s*<\/div>/, () => `<div id="root"><main class="seo-snapshot">${snapshot}</main></div>`);
  }
  return html;
}

export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE.origin}${it.path}`,
  })),
});
