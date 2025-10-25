import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

export default function BrandSlider() {
    const brands = [
        { id: 1, logo: "https://images.meesho.com/images/marketing/1743159302944.webp" }, // Nivea
        { id: 2, logo: "https://images.meesho.com/images/marketing/1743159322237.webp" }, // Himalaya
        { id: 3, logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" }, // Mi
        { id: 4, logo: "https://images.meesho.com/images/marketing/1743159363205.webp" }, // Bata
        { id: 5, logo: "https://images.meesho.com/images/marketing/1743159302944.webp" }, // WOW
        { id: 6, logo: "https://images.meesho.com/images/marketing/1743159377598.webp" }, // Adidas
        { id: 7, logo: "https://images.meesho.com/images/marketing/1743159393231.webp" }, // Nike
        { id: 8, logo: "https://1000logos.net/wp-content/uploads/2016/10/Apple-Logo.png" }, // Apple
        { id: 9, logo: "https://images.meesho.com/images/marketing/1743159415385.webp" }, // Pepsi
        { id: 10, logo: "https://1000logos.net/wp-content/uploads/2021/05/Coca-Cola-logo.png" }, // CocaCola
    ];

    return (
        <div className="w-full py-10 bg-purple-50">
            <Swiper
                spaceBetween={20}
                loop={true}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={2000}
                modules={[Autoplay]}
                breakpoints={{
                    320: { slidesPerView: 4 },  
                    640: { slidesPerView: 4 },  
                    1024: { slidesPerView: 6 },  
                    1280: { slidesPerView: 6 },  
                }}
                className="mySwiper"
            >
                {brands.map((brand) => (
                    <SwiperSlide key={brand.id}>
                        <div className="flex items-center justify-center p-3 md:p-6 bg-white rounded-2xl shadow-md">
                            <img
                                src={brand.logo}
                                alt="brand"
                                className="max-h-16 md:w-24 object-contain"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
