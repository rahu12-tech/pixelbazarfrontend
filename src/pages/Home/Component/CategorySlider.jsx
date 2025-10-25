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
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/categories/');
                setCategories(res.data.categories || res.data);
            } catch (err) {
                console.error('Categories fetch error:', err);
                // Fallback data
                setCategories([
                    { id: 1, name: 'Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', slug: 'phones' },
                    { id: 2, name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', slug: 'laptops' },
                    { id: 3, name: 'Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop', slug: 'speakers' },
                    { id: 4, name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', slug: 'headphones' },
                    { id: 5, name: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop', slug: 'cameras' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategories();
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
                <p className="text-gray-600">Explore our wide range of electronic products</p>
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