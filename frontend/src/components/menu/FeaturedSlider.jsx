import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';
import { getDishImageUrl, PLACEHOLDER_IMAGE } from '../../services/dishService';
import { useState } from 'react';

function SlideImage({ dish }) {
  const [src, setSrc] = useState(getDishImageUrl(dish));
  return (
    <img
      src={src}
      onError={() => setSrc(PLACEHOLDER_IMAGE)}
      alt=""
      className="w-full h-full object-cover"
    />
  );
}

export default function FeaturedSlider({ dishes }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  if (!dishes || dishes.length === 0) return null;

  return (
    <div className="mb-10 rounded-3xl overflow-hidden border border-primary/20">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={dishes.length > 3}
        slidesPerView={1.15}
        spaceBetween={12}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.3 },
        }}
        className="!pb-10"
      >
        {dishes.slice(0, 8).map((dish) => (
          <SwiperSlide key={dish._id}>
            <div className="relative h-56 rounded-2xl overflow-hidden group">
              <SlideImage dish={dish} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 start-0 end-0 p-4">
                <span className="inline-block text-[10px] font-bold text-black bg-[#d4af37] rounded-full px-2 py-0.5 mb-1">
                  {dish.price} QR
                </span>
                <h3 className="text-white font-bold text-sm drop-shadow">
                  {dish.name?.[lang] || dish.name?.en}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
