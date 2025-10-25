import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";

export default function TeamSlider() {
    const team = [
        {
            id: 1,
            name: "Tom Cruise",
            role: "Founder & Chairman",
            img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?t=st=1755876201~exp=1755879801~hmac=4fe1b820a83112aa7d5777f48cb69cdcdfe31312cb1b8a4e8dd2ee37fcc004f8&w=1480",
        },
        {
            id: 2,
            name: "Emma Watson",
            role: "Managing Director",
            img: "https://img.freepik.com/free-photo/medium-shot-man-posing-indoors_23-2149438602.jpg?t=st=1755876256~exp=1755879856~hmac=c23f56babf52aa769d652a6890e549a3e3b4bd0148aa503b18526bf02a4414d5&w=1480",
        },
        {
            id: 3,
            name: "Will Smith",
            role: "Product Designer",
            img: "https://img.freepik.com/free-photo/young-handsome-guy-wearing-checkered-shirt-looking-standing-emotionless-white-wall_141793-30769.jpg?t=st=1755876307~exp=1755879907~hmac=b53fae6e238ea56a97c541ef23a04abe58477632fd01d1edb6656c68d3d19cee&w=1480",
        },
        {
            id: 4,
            name: "Scarlett Johansson",
            role: "Marketing Head",
            img: "https://img.freepik.com/free-photo/serious-young-man-standing-outdoors-with-his-arms-crossed_1262-19037.jpg?t=st=1755876356~exp=1755879956~hmac=a522fc5b3b54bd7799311c3d8d4b454af72e5ed2bcc4a271379436e621e83b82&w=1480",
        },
    ];

    return (
        <div className="px-8 py-12">
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                pagination={{ clickable: true }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper"
            >
                {team.map((member) => (
                    <SwiperSlide key={member.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="p-6 border rounded-lg shadow-md bg-white flex flex-col items-center hover:shadow-lg hover:-translate-y-2 transition"
                        >
                            <motion.img
                                src={member.img}
                                alt={member.name}
                                className="w-56 h-64 object-cover rounded-md mb-4"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            />
                            <h3 className="text-lg font-bold">{member.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{member.role}</p>
                            <div className="flex space-x-4 text-gray-600">
                                <motion.a whileHover={{ scale: 1.2 }} href="#">
                                    <FaTwitter className="hover:text-red-500 transition" />
                                </motion.a>
                                <motion.a whileHover={{ scale: 1.2 }} href="#">
                                    <FaInstagram className="hover:text-red-500 transition" />
                                </motion.a>
                                <motion.a whileHover={{ scale: 1.2 }} href="#">
                                    <FaLinkedin className="hover:text-red-500 transition" />
                                </motion.a>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
