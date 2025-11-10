import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CategorySlider = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Use new categories directly (no API call for now)
        setCategories([
            { id: 1, name: 'Mobiles & Tablets', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', slug: 'mobiles-tablets' },
            { id: 2, name: 'Electronics', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', slug: 'electronics' },
            { id: 3, name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop', slug: 'fashion' },
            { id: 4, name: 'Home & Furniture', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', slug: 'home-furniture' },
            { id: 5, name: 'TV & Appliances', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop', slug: 'tv-appliances' },
            { id: 6, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop', slug: 'beauty' },
            { id: 7, name: 'Food & Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop', slug: 'food-grocery' }
        ]);
        setLoading(false);
    }, []);

    const handleCategoryClick = (category) => {
        navigate('/products', {
            state: {
                filter: {
                    category: category.slug
                },
                category: category.name
            }
        });
    };

    if (loading) {
        return (
            <div className="bg-gray-200 rounded-md h-64 flex items-center justify-center my-12">
                <div className="text-gray-500">Loading categories...</div>
            </div>
        );
    }

    return (
        <section className="my-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Shop by Category</h2>
                <p className="text-gray-600">Explore our wide range of products across all categories</p>
            </div>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 }
                }}
                className="category-slider"
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.id}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                                <p className="text-sm text-gray-600">Explore {category.name}</p>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default CategorySlider;