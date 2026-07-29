import { Helmet } from 'react-helmet-async';
import HeroVideo from '../components/home/HeroVideo';
import DeliveryApps from '../components/home/DeliveryApps';
import CinematicGallery from '../components/home/CinematicGallery';
import VipExperienceSection from '../components/home/VipExperienceSection';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';
import ReservationSection from '../components/home/ReservationSection';
import ReviewsSection from '../components/home/ReviewsSection';
import VideoGallery from '../components/home/VideoGallery';
import FAQSection from '../components/home/FAQSection';
import MenuWaveSlider from '../components/home/MenuWaveSlider';
import SimpleWaveDivider from '../components/home/SimpleWaveDivider';

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>كباب داغ نان داغ | أفضل كباب و طعام إيراني في الدوحة</title>
        <meta name="description" content="مطعم كباب داغ نان داغ، تجربة الطعم الأصيل والتقليدي الإيراني في قطر. اطلب الكباب والتموين عبر الإنترنت في الدوحة." />
      </Helmet>

      <HeroVideo />
      <DeliveryApps />
      <CinematicGallery />
      
      <VipExperienceSection />
      {/* ✅ جداساز اول: مارکی غذاها */}
      <MenuWaveSlider />
      <WhyChooseUsSection />
      <ReservationSection />
      <ReviewsSection />
      <VideoGallery />
      
      {/* ✅ جداساز دوم: موج ساده */}
      <SimpleWaveDivider />
      
      <FAQSection />
    </div>
  );
}