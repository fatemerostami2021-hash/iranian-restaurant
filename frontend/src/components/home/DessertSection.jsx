import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DessertCanvas from '../desserts/DessertCanvas';
import DessertBrand from '../desserts/DessertBrand';
import { useDessertCopy } from '../../hooks/useDessertCopy';
import { dessertsAd } from '../../data/dessertsAd';
import '../desserts/desserts.css';
import '../desserts/dessertMotion.css';

/**
 * DessertSection v7 — brand header (headline + 3D bowl side by side) above the 16:9 video stage with ad copy.
 * The active dessert (falooda / bastani) is reported by the video stage and drives the bowl's colors.
 * ctaHref: where the button goes (change '/menu' if you have a dedicated dessert route).
 */
export default function DessertSection() {
  const { copy, lang, dir } = useDessertCopy();
  const ad = dessertsAd[lang] || dessertsAd.en;
  const [tone, setTone] = useState('falooda');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: ad.eyebrow,
    itemListElement: ['falooda', 'bastani'].map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'MenuItem', name: ad.items[k].name, description: ad.items[k].tagline },
    })),
  };

  return (
    <section className="dz dz-hero dz-cine" dir={dir} lang={lang} aria-label={ad.eyebrow}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <DessertBrand brand={ad.brand} headline={ad.headline} sub={ad.sub} tone={tone} />
      <DessertCanvas
        autoCycle
        cycleIntervalMs={12000}
        ad={ad}
        ctaHref="/menu"
        falooda={copy.items.falooda}
        bastani={copy.items.bastani}
        onActiveChange={setTone}
      />
    </section>
  );
}
