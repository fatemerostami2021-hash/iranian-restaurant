import { Helmet } from 'react-helmet-async';
import { useDessertCopy } from '../hooks/useDessertCopy';
import '../components/desserts/desserts.css';

/**
 * DessertsMenu — the new page where the Falooda, Bastani and intro texts
 * now live. The home page is a silent video hero; this page is the readable menu.
 *
 * Reachable at /desserts-menu (see scripts/patch-app-desserts-menu.cjs).
 */
export default function DessertsMenu() {
  const { copy, lang, dir } = useDessertCopy();
  const M = copy.menu;
  const items = copy.items;

  const cards = [
    { key: 'falooda', tone: 'falooda', tag: M.tagFalooda, item: items.falooda },
    { key: 'bastani', tone: 'bastani', tag: M.tagBastani, item: items.bastani },
  ];

  return (
    <main className="dz dz-menu" dir={dir} lang={lang}>
      <Helmet>
        <title>{M.metaTitle}</title>
        <meta name="description" content={M.metaDesc} />
      </Helmet>

      <header className="dz-menu__head">
        <h1 className="dz-menu__title">{M.title}</h1>
        <p className="dz-menu__lead">{M.lead}</p>
      </header>

      <div className="dz-menu__grid">
        {cards.map((c) => (
          <article key={c.key} className="dz-menu__card" data-tone={c.tone}>
            <span className="dz-menu__tag">{c.tag}</span>
            <h2 className="dz-menu__name">{c.item.name}</h2>
            <p className="dz-menu__alt">{c.item.alt}</p>
            <p className="dz-menu__blurb">{c.item.blurb}</p>
          </article>
        ))}
      </div>

      <div className="dz-menu__divider" aria-hidden="true" />
    </main>
  );
}
