import { Helmet } from 'react-helmet-async'; // ✅ ایمپورت Helmet برای سئو
import HeroVideo from '../components/home/HeroVideo';
import DeliveryApps from '../components/home/DeliveryApps';
import CinematicGallery from '../components/home/CinematicGallery';
import DestinationSection from '../components/home/DestinationSection';
import ReservationSection from '../components/home/ReservationSection';
import ReviewsSection from '../components/home/ReviewsSection';
import VideoGallery from '../components/home/VideoGallery'; 
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  return (
    <div>
      {/* ✅ تگ‌های سئو برای صفحه اصلی (عنوان و توضیحات مخصوص صفحه اصلی) */}
      <Helmet>
        <title>كباب داغ نان داغ | أفضل كباب و طعام إيراني في الدوحة</title>
        <meta name="description" content="مطعم كباب داغ نان داغ، تجربة الطعم الأصيل والتقليدي الإيراني في قطر. اطلب الكباب والتموين عبر الإنترنت في الدوحة." />
      </Helmet>

      <HeroVideo />
      <DeliveryApps />
      <CinematicGallery />
      <DestinationSection namespace="shiraz" dark />
      <DestinationSection namespace="doha" />
      <ReservationSection />
      <ReviewsSection />
      <VideoGallery />            
      <FAQSection />
    </div>
  );
}