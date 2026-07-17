import HeroVideo from '../components/home/HeroVideo';
import DeliveryApps from '../components/home/DeliveryApps';
import CinematicGallery from '../components/home/CinematicGallery';
import DestinationSection from '../components/home/DestinationSection';
import ReservationSection from '../components/home/ReservationSection';
import ReviewsSection from '../components/home/ReviewsSection';
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  return (
    <div>
      <HeroVideo />
      <DeliveryApps />
      <CinematicGallery />
      <DestinationSection namespace="shiraz" dark />
      <DestinationSection namespace="doha" />
      <ReservationSection />
      <ReviewsSection />
      <FAQSection />
    </div>
  );
}
