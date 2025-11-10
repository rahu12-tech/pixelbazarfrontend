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
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Use new categories directly (no API call for now)
        setCategories([
            { 
                id: 1, 
                name: 'Mobiles & Tablets', 
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', 
                slug: 'mobiles-tablets',
                subcategories: ['Smartphones', 'Tablets', 'Mobile Accessories']
            },
            { 
                id: 2, 
                name: 'Electronics', 
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', 
                slug: 'electronics',
                subcategories: ['Laptops', 'Headphones', 'Speakers', 'Cameras', 'Gaming']
            },
            { 
                id: 3, 
                name: 'Fashion', 
                image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop', 
                slug: 'fashion',
                subcategories: ["Men's Clothing", "Women's Clothing", 'Footwear', 'Accessories']
            },
            { 
                id: 4, 
                name: 'Home & Furniture', 
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', 
                slug: 'home-furniture',
                subcategories: ['Furniture', 'Home Decor', 'Kitchen']
            },
            { 
                id: 5, 
                name: 'TV & Appliances', 
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop', 
                slug: 'tv-appliances',
                subcategories: ['Televisions', 'Refrigerators', 'Washing Machines', 'Air Conditioners']
            },
            { 
                id: 6, 
                name: 'Beauty', 
                image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop', 
                slug: 'beauty',
                subcategories: ['Skincare', 'Makeup', 'Haircare']
            },
            { 
                id: 7, 
                name: 'Food & Grocery', 
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop', 
                slug: 'food-grocery',
                subcategories: ['Fruits & Vegetables', 'Dairy', 'Snacks']
            }
        ]);
        setLoading(false);
    }, []);

    const handleCategoryInteraction = (category, index) => {
        if (isMobile) {
            // Mobile: Toggle dropdown on click
            setActiveDropdown(activeDropdown === index ? null : index);
        } else {
            // Desktop: Show dropdown on hover
            setActiveDropdown(index);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setActiveDropdown(null);
        }
    };

    const handleCategoryClick = (category) => {
        navigate('/products', {
            state: {
                filter: {
                    category: category.slug
                },
                category: category.name
            }
        });
        setActiveDropdown(null);
    };

    const handleSubcategoryClick = (subcategory) => {
        navigate('/products', {
            state: {
                filter: {
                    category: subcategory
                },
                category: subcategory
            }
        });
        setActiveDropdown(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && !event.target.closest('.category-card')) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobile]);

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
                spaceBetween={10}
                slidesPerView={1.2}
                navigation={!isMobile}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                    480: { slidesPerView: 1.5, spaceBetween: 15 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                    1280: { slidesPerView: 5, spaceBetween: 20 }
                }}
                className="category-slider px-4 md:px-0"
            >
                {categories.map((category, index) => (
                    <SwiperSlide key={category.id}>
                        <div 
                            className="relative category-card"
                            onMouseEnter={() => !isMobile && handleCategoryInteraction(category, index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <motion.div
                                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full"
                                onClick={() => isMobile ? handleCategoryInteraction(category, index) : handleCategoryClick(category)}
                            >
                                <div className="relative h-32 md:h-48 overflow-hidden">
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
                                <div className="p-2 md:p-4 text-center">
                                    <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-1 md:mb-2 line-clamp-2">{category.name}</h3>
                                    <p className="text-xs md:text-sm text-gray-600 hidden md:block">Explore {category.name}</p>
                                </div>
                            </motion.div>

                            {/* Dropdown Menu */}
                            {activeDropdown === index && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="p-4">
                                        <div className="grid grid-cols-1 gap-2">
                                            {category.subcategories.map((subcategory, subIndex) => (
                                                <button
                                                    key={subIndex}
                                                    onClick={() => handleSubcategoryClick(subcategory)}
                                                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                                                >
                                                    {subcategory}
                                                </button>
                                            ))}
                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={() => handleCategoryClick(category)}
                                                    className="text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors w-full"
                                                >
                                                    View All {category.name}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))
            </Swiper>
        </section>
    );
};

export default CategorySlider;