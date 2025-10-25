import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    image: 'https://media.istockphoto.com/id/1820830499/photo/parcel-or-paper-cartons-in-shopping-cart-on-a-laptop-keyboard.jpg?s=612x612&w=0&k=20&c=Hah15s6J_7MlI6Sg8w0T4P_1ikEr0lomE-6StzvWONM=',
  },
  {
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    image: 'https://plus.unsplash.com/premium_photo-1664475347754-f633cb166d13?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const Slider = () => {
  return (
    <div className="w-full md:h-[550px] mt-8 h-[600px]">
      <Swiper
        spaceBetween={0}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-full h-150"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-100px"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
