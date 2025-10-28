import api from "../api/axiosConfig";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../redux/wishlist/wishlistSlice";

import { BiHeart } from "react-icons/bi";
import { IoIosHeart } from "react-icons/io";
import { BsEye } from "react-icons/bs";
import { CgShoppingCart } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductPage() {
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(2);
    const [selectedColor, setSelectedColor] = useState("red");
    const [isInWishlist, setIsInWishlist] = useState(false);
    let location = useLocation();
    const [productdel, setproductdel] = useState(location.state || null);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(productdel)

    // ✅ If no product is passed in state
    if (!productdel) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                ⚠️ No product data found!
            </div>
        );
    }


    const Related = [
        {
            id: 1,
            title: "HAVIT HV-G92 Gamepad",
            price: 120,
            oldPrice: 160,
            discount: "-40%",
            rating: 88,
            img: "/red-gamepad.png",
        },
        {
            id: 2,
            title: "AK-900 Wired Keyboard",
            price: 960,
            oldPrice: 1160,
            discount: "-35%",
            rating: 75,
            img: "/keyboard.png",
        },
        {
            id: 3,
            title: "IPS LCD Gaming Monitor",
            price: 370,
            oldPrice: 400,
            discount: "-30%",
            rating: 99,
            img: "/monitor.png",
        },
        {
            id: 4,
            title: "RGB liquid CPU Cooler",
            price: 160,
            oldPrice: 170,
            rating: 65,
            img: "/cooler.png",
        },
    ];

    let handleAddToCart = (data) => {
        let token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }
        
        const cartData = {
            product_id: data._id || data.id,
            quantity: 1
        };
        
        api
            .post("/api/cart/add/", cartData)
            .then((res) => {
                if (res.data.status === 200) {
                    toast.success(res.data.msg || "Added to cart successfully!");
                } else {
                    toast.success("Added to cart successfully!");
                }
                window.dispatchEvent(new Event('cartUpdated'));
            })
            .catch((err) => {
                console.error('Cart error:', err);
                toast.error(err.response?.data?.msg || "Failed to add to cart");
            });
    };

    const handleAddToWishlist = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to add to wishlist");
            return;
        }

        try {
            const res = await api.post('/api/wishlist/add/', {
                product_id: product._id || product.id
            });
            
            if (res.data.status === 200 || res.data.message) {
                toast.success(res.data.message || "Added to wishlist!");
                setIsInWishlist(true);
                
                // Also add to Redux store
                dispatch(addToWishlist({
                    id: product._id || product.id,
                    name: product.product_name,
                    price: product.product_price,
                    img: product.product_img
                }));
                
                // Trigger wishlist update event
                window.dispatchEvent(new Event('wishlistUpdated'));
            }
        } catch (err) {
            console.error('Wishlist error:', err);
            toast.error(err.response?.data?.message || "Failed to add to wishlist");
        }
    };

    return (
        <>
            <div className="p-6 max-w-6xl mx-auto">
                <Toaster position="top-right" reverseOrder={false} />

                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    Account / Gaming /{" "}
                    <span className="text-black font-medium">
                        {productdel?.product_name}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Side - Images */}
                    <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-1 flex flex-col gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    src={productdel?.product_img?.startsWith('http') ? productdel.product_img : `${import.meta.env.VITE_API_URL}${productdel?.product_img}`}
                                    alt={`thumb${i}`}
                                    className="rounded-lg cursor-pointer hover:border-red-500 w-full h-20 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';
                                    }}
                                />
                            ))}
                        </div>
                        <div className="col-span-4">
                            <img
                                src={productdel?.product_img?.startsWith('http') ? productdel.product_img : `${import.meta.env.VITE_API_URL}${productdel?.product_img}`}
                                alt={productdel?.product_name || 'Product'}
                                className="w-full md:h-[500px] rounded-lg object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop';
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className=" w-full">
                        <h2 className="text-2xl font-semibold">
                            {productdel?.product_name}
                        </h2>
                        <h2 className="font-semibold mt-3">
                            {productdel?.product_titel}
                        </h2>

                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-yellow-500">{productdel?.rating}</span>
                            <span className="text-sm text-gray-500">(150 Reviews)</span>
                            <span className={`text-sm ml-2 font-semibold ${productdel?.product_IsStock?.status === 'stock' ? 'text-green-600' : 'text-red-600'}`}>
                                {productdel?.product_IsStock?.status === "stock" ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        <p className="text-2xl font-bold mt-4 mb-3">
                            Price: ${productdel?.product_price}
                        </p>
                        <p className="line-through text-gray-500 text-sm ">
                            Old Price: ${productdel?.product_oldPrice}
                        </p>
                        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                            {productdel?.product_des}
                        </p>

                        <hr className="my-4" />
                        <p>
                            <strong className="font-bold">Product Warranty: </strong>
                            {productdel?.product_warranty}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => handleAddToCart(productdel)}
                                className="bg-red-500 cursor-pointer text-white px-6 py-3 rounded-md hover:bg-red-600 flex items-center gap-2"
                            >
                                <CgShoppingCart size={20} />
                                Add To Cart
                            </button>
                            
                            <button
                                onClick={() => handleAddToWishlist(productdel)}
                                className={`border-2 px-4 py-3 rounded-md transition flex items-center gap-2 ${
                                    isInWishlist 
                                        ? 'border-red-500 bg-red-50 text-red-600' 
                                        : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                                }`}
                            >
                                {isInWishlist ? (
                                    <IoIosHeart className="text-red-500" size={20} />
                                ) : (
                                    <BiHeart size={20} />
                                )}
                                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>

                        <div className="mb-3">
                            <p>
                                <strong className="font-semibold">Delivery by</strong>{" "}
                                {new Date(
                                    new Date(productdel?.createdAt).setDate(
                                        new Date(productdel?.createdAt).getDate() + 5
                                    )
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Delivery Info */}
                        <div className="border rounded-md p-4 space-y-4">
                            <div>
                                <div className="font-medium">
                                    {productdel?.delivery?.deliveryCharge === 0 ? (
                                        <span className="text-green-600">
                                            Free Delivery
                                        </span>
                                    ) : (
                                        <span className="text-red-600">
                                            Delivery Charge: ₹{productdel?.delivery?.deliveryCharge || 0}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    5 Days for Delivery Availability
                                </p>
                            </div>
                            <div>
                                <div className="font-medium">Return Delivery</div>
                                <p className="text-sm text-gray-500">
                                    {productdel?.product_return === "0" ? (
                                        <>This product is not returnable</>
                                    ) : (
                                        <>Free {productdel?.product_return || 7} Days Delivery Returns.{" "}
                                            <a href="#" className="underline">Details</a>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Items */}
            {/* <div className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-6 bg-red-500 rounded"></div>
                    <h2 className="text-lg font-semibold">Related Item</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Related.map((item) => (
                        <div
                            key={item.id}
                            className="relative border rounded-2xl p-4 shadow-sm hover:shadow-md transition group"
                        >
                            {item.discount && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                    {item.discount}
                                </span>
                            )}

                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button className="bg-white p-1 rounded-full shadow hover:text-red-500">
                                    <BiHeart size={16} />
                                </button>
                                <button className="bg-white p-1 rounded-full shadow hover:text-black">
                                    <BsEye size={16} />
                                </button>
                            </div>

                            <img
                                src={item.img}
                                alt={item.title}
                                className="h-32 mx-auto mb-4 object-contain"
                            />

                            <h3 className="text-sm font-medium">{item.title}</h3>

                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-red-600 font-semibold">
                                    ${item.price}
                                </span>
                                {item.oldPrice && (
                                    <span className="text-gray-400 line-through text-sm">
                                        ${item.oldPrice}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1 mt-2 text-yellow-500 text-sm">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                                <span className="text-gray-400 text-xs ml-1">
                                    ({item.rating})
                                </span>
                            </div>

                            <button className="w-full mt-3 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                                <CgShoppingCart size={16} /> Add To Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div> */}
        </>
    );
}
