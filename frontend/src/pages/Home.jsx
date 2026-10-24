import { lazy } from 'react';
import HeroVideo from '../components/home/HeroVideo';
import DeliveryApps from '../components/home/DeliveryApps';
import FAQSection from '../components/home/FAQSection';
import MenuWaveSlider from '../components/home/MenuWaveSlider';
import SimpleWaveDivider from '../components/home/SimpleWaveDivider';
import LazyDessertSection from '../components/home/LazyDessertSection';
import LazyOnVisible from '../components/LazyOnVisible';

// Below-the-fold sections: separate chunks, mounted only when scrolled near.
const BestSellersGallery = lazy(() => import('../components/home/BestSellersGallery'));
const HomeExperienceSection = lazy(() => import('../components/home/HomeExperienceSection'));
const CinematicGallery = lazy(() => import('../components/home/CinematicGallery'));

// Title/description for this page come from RouteSeo.jsx
export default function Home() {
  return (
    <div>
      <HeroVideo />
      <MenuWaveSlider />
      <LazyDessertSection />

      <LazyOnVisible minHeight={620}>
        <BestSellersGallery />
      </LazyOnVisible>

      <LazyOnVisible minHeight={620}>
        <HomeExperienceSection />
      </LazyOnVisible>

      <LazyOnVisible minHeight={620}>
        <CinematicGallery />
      </LazyOnVisible>

      <DeliveryApps />
      <SimpleWaveDivider />

      {/* FAQ stays eager on purpose (SEO text / FAQ schema) */}
      <FAQSection />
    </div>
  );
}
