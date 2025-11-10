import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../api/config";

const categories = [
  {
    id: 1, 
    name: 'Mobiles & Tablets', 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', 
    slug: 'mobiles-tablets',
    subcategories: ['Smartphones', 'Tablets', 'Mobile Accessories', 'Cases & Covers', 'Power Banks', 'Screen Guards']
  },
  {
    id: 2, 
    name: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', 
    slug: 'electronics',
    subcategories: ['Laptops', 'Cameras', 'Headphones', 'Speakers', 'Gaming', 'Smart Watches']
  },
  {
    id: 3, 
    name: 'Fashion', 
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop', 
    slug: 'fashion',
    subcategories: ["Men's Clothing", "Women's Clothing", 'Footwear', 'Watches', 'Bags & Luggage', 'Jewellery']
  },
  {
    id: 4, 
    name: 'Home & Furniture', 
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', 
    slug: 'home-furniture',
    subcategories: ['Furniture', 'Home Decor', 'Kitchen & Dining', 'Bed & Bath', 'Garden & Outdoor', 'Tools & Hardware']
  },
  {
    id: 5, 
    name: 'TV & Appliances', 
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop', 
    slug: 'tv-appliances',
    subcategories: ['Televisions', 'Air Conditioners', 'Refrigerators', 'Washing Machines', 'Kitchen Appliances', 'Small Appliances']
  },
  {
    id: 6, 
    name: 'Beauty', 
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop', 
    slug: 'beauty',
    subcategories: ['Makeup', 'Skincare', 'Hair Care', 'Fragrances', 'Personal Care', 'Health & Wellness']
  },
  {
    id: 7, 
    name: 'Food & Grocery', 
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop', 
    slug: 'food-grocery',
    subcategories: ['Fresh Produce', 'Packaged Food', 'Beverages', 'Snacks', 'Dairy Products', 'Organic Food']
  }
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/api/products/');
        let data = res.data;
        if (res.data.productdata) data = res.data.productdata;
        else if (res.data.products) data = res.data.products;
        else if (res.data.data) data = res.data.data;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Products fetch error:', err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveIndex(null), 300);
  };

  const handleCategoryClick = (category) => {
    navigate('/products', {
      state: {
        filter: { category: category.slug },
        category: category.name
      }
    });
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate('/products', {
      state: {
        filter: { category: subcategory },
        category: subcategory
      }
    });
  };

  return (
    <div className="w-full bg-white shadow-md relative">
      {/* Swiper Main Categories */}
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{ 640: { slidesPerView: 4 }, 768: { slidesPerView: 5 }, 1024: { slidesPerView: 6 } }}
        className="px-4 py-3"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={category.id}>
            <div
              className="relative cursor-pointer hover:text-pink-600 transition flex flex-col items-center gap-1"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={category.image}
                className="w-16 h-16 object-cover rounded-md shadow-sm"
                alt={category.name}
              />
              <span className="text-sm font-semibold">{category.name}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dropdown */}
      <AnimatePresence>
        {activeIndex !== null && categories[activeIndex] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-full bg-white shadow-lg w-full p-6 grid grid-cols-3 gap-4 z-50 border border-gray-200"
            onMouseEnter={() => timeoutRef.current && clearTimeout(timeoutRef.current)}
            onMouseLeave={handleMouseLeave}
          >
            {categories[activeIndex].subcategories.map((subcategory, i) => (
              <div 
                key={i} 
                className="p-3 rounded-md transition cursor-pointer hover:bg-blue-50 hover:text-blue-600 border border-gray-100"
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                <h3 className="font-medium text-gray-800 text-sm hover:text-blue-600 transition-colors">
                  {subcategory}
                </h3>
              </div>
            ))}
            <div className="col-span-3 border-t border-gray-200 pt-4 mt-2">
              <button
                onClick={() => handleCategoryClick(categories[activeIndex])}
                className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                View All {categories[activeIndex].name} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
