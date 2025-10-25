import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../api/config";

const categories = [
  { id: 1, name: 'Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', slug: 'phones' },
  { id: 2, name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', slug: 'laptops' },
  { id: 3, name: 'Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop', slug: 'speakers' },
  { id: 4, name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', slug: 'headphones' },
  { id: 5, name: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop', slug: 'cameras' }
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

  const getCategoryProducts = (categorySlug) => {
    return products.filter(p => 
      p.product_category === categorySlug || 
      p.category === categorySlug ||
      p.product_type === categorySlug
    ).slice(0, 6);
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
            className="absolute left-0 top-full bg-white shadow-lg w-full p-6 grid grid-cols-3 gap-6 z-50"
            onMouseEnter={() => timeoutRef.current && clearTimeout(timeoutRef.current)}
            onMouseLeave={handleMouseLeave}
          >
            {getCategoryProducts(categories[activeIndex].slug).map((prod, i) => (
              <div key={i} className="p-2 rounded transition cursor-pointer hover:bg-gray-50"
                   onClick={() => navigate('/product', { state: prod })}>
                <div className="flex items-center gap-3">
                  <img 
                    src={prod.product_img?.startsWith('http') ? prod.product_img : `${import.meta.env.VITE_API_URL}${prod.product_img}`}
                    className="w-12 h-12 object-cover rounded"
                    alt={prod.product_name}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/48x48'}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{prod.product_name}</h3>
                    <p className="text-xs text-gray-600">₹{prod.product_price}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
