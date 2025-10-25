import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const NewArrival = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/products/");
                let data = res.data;
                if (res.data.productdata) data = res.data.productdata;
                else if (res.data.products) data = res.data.products;
                else if (res.data.data) data = res.data.data;
                
                // Show newest products based on creation date
                const sortedByDate = Array.isArray(data) ? 
                    data.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0)) : [];
                const featured = sortedByDate.slice(0, 5);
                setFeaturedProducts(featured);
            } catch (err) {
                console.error('Featured products error:', err);
                setFeaturedProducts([]);
            }
        };
        
        fetchFeaturedProducts();
    }, []);

    const handleViewDetails = (product) => {
        navigate('/product', { state: product });
    };
    
    const handleProductClick = (product) => {
        // Navigate to products page with related products of same type/brand
        navigate('/products', {
            state: {
                filter: {
                    type: product.product_type,
                    brand: product.product_brand
                },
                category: product.product_type || 'Related Products'
            }
        });
    };

    const leftAnimation = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };

    const rightAnimation = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };

    return (
        <section className="my-10 container mx-auto px-4">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="mb-6">
                <span className="text-red-500 text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-5 bg-red-500 rounded"></span>
                    Featured
                </span>
                <h2 className="text-2xl font-bold mt-1 text-gray-900">New Arrival</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Big Card */}
                {featuredProducts[0] && (
                    <motion.div
                        className="relative rounded-lg overflow-hidden group h-[300px] md:h-[500px]"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false }}
                        variants={leftAnimation}
                    >
                        <img
                            src={featuredProducts[0].product_img?.startsWith('http') ? 
                                featuredProducts[0].product_img : 
                                `http://127.0.0.1:8000${featuredProducts[0].product_img}`
                            }
                            alt={featuredProducts[0].product_name}
                            className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105 cursor-pointer"
                            onClick={() => handleProductClick(featuredProducts[0])}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/500x300?text=' + 
                                    encodeURIComponent(featuredProducts[0].product_name || 'Product');
                            }}
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="absolute bottom-4 left-4 text-white z-10 transition-transform duration-500 md:group-hover:scale-110">
                            <h3 className="text-lg font-semibold">{featuredProducts[0].product_name}</h3>
                            <p className="text-sm mb-2">{featuredProducts[0].product_description || 'Featured product with amazing features'}</p>
                            <button 
                                onClick={() => handleViewDetails(featuredProducts[0])}
                                className="bg-white text-black px-4 py-1 text-sm rounded hover:bg-gray-200"
                            >
                                View Details
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Right Side Small Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {featuredProducts.slice(1).map((product) => (
                        <motion.div
                            key={product._id}
                            className="relative rounded-lg overflow-hidden group h-[240px]"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false }}
                            variants={rightAnimation}
                        >
                            <img
                                src={product.product_img?.startsWith('http') ? 
                                    product.product_img : 
                                    `http://127.0.0.1:8000${product.product_img}`
                                }
                                alt={product.product_name}
                                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105 cursor-pointer"
                                onClick={() => handleProductClick(product)}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x240?text=' + 
                                        encodeURIComponent(product.product_name || 'Product');
                                }}
                            />
                            <div className="absolute inset-0 bg-black/25"></div>
                            <div className="absolute bottom-4 left-4 text-white z-10 transition-transform duration-500 md:group-hover:scale-110">
                                <h3 className="text-lg font-semibold">{product.product_name}</h3>
                                <p className="text-sm mb-2">{product.product_description || 'Amazing product with great features'}</p>
                                <button 
                                    onClick={() => handleViewDetails(product)}
                                    className="bg-white text-black px-4 py-1 text-sm rounded hover:bg-gray-200"
                                >
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrival;
