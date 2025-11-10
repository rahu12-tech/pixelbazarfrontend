import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import { addToWishlist } from "../../../redux/wishlist/wishlistSlice";
import { BsHeart, BsEye, BsStar, BsStarFill } from "react-icons/bs";
import { IoIosHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import API from "../../../api/config";
import toast, { Toaster } from "react-hot-toast";



const ExploreMoreProduct = () => {
    const [exprole, setexprole] = useState(false);
    const dispatch = useDispatch();
    const [wishlistClicked, setWishlistClicked] = useState({});

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await API.get("/api/products/");
                console.log('ExploreMore API response:', res.data);
                
                let data = res.data;
                if (res.data.productdata) data = res.data.productdata;
                else if (res.data.products) data = res.data.products;
                else if (res.data.data) data = res.data.data;
                
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('ExploreMore products error:', err);
                setProducts([]);
            }
        };
        
        fetchProducts();
    }, []);

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to add items to cart");
            navigate('/signup');
            return;
        }

        const cartData = {
            product_id: product._id || product.id,
            quantity: 1
        };

        try {
            const res = await API.post("/api/cart/add/", cartData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.data.status === 200) {
                toast.success(res.data.msg || "Added to cart successfully");
            } else {
                toast.success("Added to cart successfully");
            }
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error('Cart error:', err);
            toast.error(err.response?.data?.msg || "Failed to add to cart");
        }
    };

    const handleToggleWishlist = (product) => {
        setWishlistClicked((prev) => ({
            ...prev,
            [product._id]: !prev[product._id],
        }));

        dispatch(
            addToWishlist({
                id: product._id,
                name: product.title,
                price: product.price,
                img: product.img,
            })
        );
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) =>
            i < (rating || 0) ? (
                <BsStarFill key={i} className="text-yellow-400" />
            ) : (
                <BsStar key={i} className="text-gray-300" />
            )
        );
    };

    const navigate = useNavigate();
    let datial = (product) => {
        navigate("/product", { state: product });
    }
    return (
        <div className="p-4 md:p-6">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="mb-4 md:mb-6">
                <span className="text-red-500 text-xs md:text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-4 md:h-5 bg-red-500 rounded"></span>
                    Our Products
                </span>
                <h2 className="text-lg md:text-2xl font-bold mt-2 md:mt-4 text-gray-900">
                    Explore Our Product
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {(exprole ? products : products.slice(0, 4)).map((product, index) => (
                    <div
                        key={product._id || product.id || index}
                        className="border border-gray-300 rounded-lg p-3 md:p-4 flex flex-col justify-between relative group w-full min-h-[280px] md:h-80 transition"
                    >

                        <button
                            onClick={() => handleToggleWishlist(product)}
                            className="absolute top-2 right-2 text-gray-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition z-10"
                        >
                            {wishlistClicked[product._id] ? <IoIosHeart className="text-red-400" size={16} /> : <BsHeart size={14} />}
                        </button>


                        <div className="flex flex-col flex-1">
                            <div className="w-20 h-20 md:w-36 md:h-32 rounded-md mb-2 md:mb-3 flex items-center justify-center mx-auto mt-2">
                                <img
                                    src={product.product_img?.startsWith('http') ? 
                                        product.product_img : 
                                        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${product.product_img}`
                                    }
                                    alt={product.product_name}
                                    onClick={() => { datial(product) }}
                                    className="w-full h-full mx-auto object-contain rounded-sm transform transition duration-300 hover:scale-105 cursor-pointer"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop';
                                    }}
                                />
                            </div>

                            {/* Title */}
                            <h3 className="font-medium text-center text-xs md:text-base line-clamp-2 px-1 mb-1">
                                {product.product_name}
                            </h3>

                            {/* Price */}
                            <p className="text-center mb-1">
                                <span className="font-bold text-red-500 text-sm md:text-base">
                                    ₹{product.product_price}
                                </span>{" "}
                                {product.product_oldPrice && (
                                    <span className="line-through text-gray-400 text-xs md:text-sm">
                                        ₹{product.product_oldPrice}
                                    </span>
                                )}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center justify-center mb-2">
                                <div className="flex text-xs">
                                    {renderStars(product?.rating)}
                                </div>
                                <span className="ml-1 text-xs text-gray-500">
                                    ({product?.reviews || 0})
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-black text-white text-xs md:text-sm py-1.5 md:py-2 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer transition mt-auto"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 md:mt-16 text-center">
                <button
                    onClick={() => navigate('/products', { 
                        state: { 
                            products: products,
                            category: 'All Products'
                        } 
                    })}
                    className="px-6 py-2 bg-red-600 text-white text-sm md:text-base rounded-lg shadow hover:bg-red-700 transition"
                >
                    View All Products
                </button>
            </div>
        </div>
    );
};

export default ExploreMoreProduct;
