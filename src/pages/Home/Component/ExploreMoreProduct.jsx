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
        <div className="md:p-6 ">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="mb-6">
                <span className="text-red-500 text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-5 bg-red-500 rounded"></span>
                    Our Products
                </span>
                <h2 className="text-2xl font-bold mt-4 text-gray-900">
                    Explore Our Product
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
                {(exprole ? products : products.slice(0, 4)).map((product) => (
                    <div
                        key={product._id}
                        className="border border-gray-300 rounded-lg p-4 flex flex-col items-center relative group w-full md:w-72 h-80 transition"
                    >

                        <button
                            onClick={() => handleToggleWishlist(product)}
                            className="absolute top-2 right-3 text-gray-500 opacity-0 group-hover:opacity-100 transition"
                        >
                            {wishlistClicked[product._id] ? <IoIosHeart className="text-red-400" size={20} /> : <BsHeart size={18} />}
                        </button>


                        <div className="w-36 h-32 rounded-md mb-3 flex items-center justify-center">
                            <img
                                src={product.product_img?.startsWith('http') ? 
                                    product.product_img : 
                                    `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${product.product_img}`
                                }
                                alt={product.product_name}
                                onClick={() => { datial(product) }}
                                className="w-full h-full mx-auto object-contain rounded-sm transform transition duration-500 hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150x150?text=' + 
                                        encodeURIComponent(product.product_name || 'Product');
                                }}
                            />
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold mt-2 text-center">
                            {product.product_name}
                        </h3>

                        {/* Price */}
                        <p className="mt-1 text-center">
                            <span className="font-bold text-red-500">
                                {product.product_price}
                            </span>{" "}
                            <span className="line-through text-gray-400">
                                {product.product_oldPrice}
                            </span>
                        </p>

                        {/* Rating */}
                        <div className="flex items-center mt-1">
                            {renderStars(product?.rating)}
                            <span className="ml-2 text-sm text-gray-500">
                                ({product?.reviews || 0})
                            </span>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-3 w-full bg-black text-white text-sm py-2 rounded opacity-0 group-hover:opacity-100 cursor-pointer transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <button
                    onClick={() => navigate('/products', { 
                        state: { 
                            products: products,
                            category: 'All Products'
                        } 
                    })}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                    View All Products
                </button>
            </div>
        </div>
    );
};

export default ExploreMoreProduct;
