import { useState } from 'react';
import HeroVideo from '../components/home/HeroVideo';
import DeliveryApps from '../components/home/DeliveryApps';
import CinematicGallery from '../components/home/CinematicGallery';
import DestinationSection from '../components/home/DestinationSection';
import ReservationSection from '../components/home/ReservationSection';
import ReviewsSection from '../components/home/ReviewsSection';
import VideoGallery from '../components/home/VideoGallery'; 
import FAQSection from '../components/home/FAQSection';
import AuthModal from '../components/ui/AuthModal';

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div>
      {/* دکمه تست لاگین (بعدا در سایت واقعی حذف می‌شود) */}
      <button 
        onClick={() => setIsAuthOpen(true)} 
        className="fixed top-24 left-5 z-50 bg-[#FFD700] text-black px-4 py-2 rounded-full font-bold shadow-lg hover:bg-[#FFC700] transition-colors"
      >
        تست لاگین
      </button>

      <HeroVideo />
      <DeliveryApps />
      <CinematicGallery />
      <DestinationSection namespace="shiraz" dark />
      <DestinationSection namespace="doha" />
      <ReservationSection />
      <ReviewsSection />
      <VideoGallery />            
      <FAQSection />

      {/* پنجره لاگین */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(token, user) => {
          console.log("ورود موفق!", token, user);
          localStorage.setItem('customerToken', token);
          alert(`خوش آمدید ${user.name || user.phone || user.email}`);
          setIsAuthOpen(false);
        }} 
      />
    </div>
  );
}