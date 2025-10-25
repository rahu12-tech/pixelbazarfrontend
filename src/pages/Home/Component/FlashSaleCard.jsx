import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import { addToWishlist } from "../../../redux/wishlist/wishlistSlice";
import { BsHeart } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function FlashSalesPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 19, seconds: 56 });
  const [productapi, setProductApi] = useState([]);
  const dispatch = useDispatch();
  const [wishlistClicked, setWishlistClicked] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

 // Fetch products
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products/");
      console.log("FlashSale API response:", res.data);
      
      let data = res.data;
      if (res.data.productdata) data = res.data.productdata;
      else if (res.data.products) data = res.data.products;
      else if (res.data.data) data = res.data.data;
      
      console.log("FlashSale products:", data);
      // Show products marked as flash sale
      const flashSaleProducts = Array.isArray(data) ? data.filter(p => p.is_flash_sale || p.flash_sale).slice(0, 8) : [];
      setProductApi(flashSaleProducts);
    } catch (err) {
      console.error("FlashSale products error:", err);
      // Set dummy products for FlashSale
      setProductApi([
        { _id: '1', product_name: 'Flash Sale Item', product_price: 99, product_oldPrice: 149, product_img: '/placeholder.jpg', rating: 4 }
      ]);
    }
  };

  fetchProducts();
}, []);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    const cartData = {
      product_id: product._id || product.id,
      quantity: 1
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/cart/add/", cartData, {
        headers: { Authorization: `Bearer ${token}` },
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
    setWishlistClicked((prev) => ({ ...prev, [product.id]: !prev[product.id] }));
    dispatch(
      addToWishlist({
        id: product.id,
        name: product.product_name,
        price: product.price,
        img: product.product_img,
      })
    );
  };

  const datial = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/product/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/product", { state: { ...product, delivery: res.data.delivery } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product details.");
    }
  };

  return (
    <section className="container mx-auto px-1 md:py-6 my-10">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Heading + Countdown */}
      <div className="flex items-center justify-between mb-6 p-3 shadow-md rounded-sm">
        <div>
          <p className="text-red-500 font-semibold">Today's</p>
          <h2 className="text-xl md:text-2xl font-bold">Flash Sales</h2>
        </div>
        <div className="flex gap-1 md:gap-4 font-mono ">
          <div>{String(timeLeft.days).padStart(2, "0")} <span className="text-sm">Days</span></div> :
          <div>{String(timeLeft.hours).padStart(2, "0")} <span className="text-sm">Hours</span></div> :
          <div>{String(timeLeft.minutes).padStart(2, "0")} <span className="text-sm">Minutes</span></div> :
          <div>{String(timeLeft.seconds).padStart(2, "0")} <span className="text-sm">Seconds</span></div>
        </div>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{ 320: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
        loop={productapi.length > 4}
      >
        {productapi.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center relative group">
              {product.discount && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {product.discount}
                </span>
              )}
              <button
                onClick={() => handleToggleWishlist(product)}
                className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-100 transition"
              >
                {wishlistClicked[product.id] ? <IoIosHeart className="text-red-400" size={20} /> : <BsHeart size={18} />}
              </button>
               <img
      src={product.product_img?.startsWith('http') ? product.product_img : `http://127.0.0.1:8000${product.product_img}`}
      alt={product.product_name}
      style={{ width: "150px", height: "150px" }}
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/150x150?text=' + encodeURIComponent(product.product_name || 'Product');
      }}
    />
              <h3 className="font-semibold mt-2 text-center">{product.product_name}</h3>
              <div className="flex justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={14} className={i < product.rating ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <p className="mt-1">
                ₹{product.product_price}{" "}
                <span className="line-through text-gray-500">₹{product.product_oldPrice}</span>
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 w-full bg-black text-white text-sm py-2 rounded hover:bg-gray-800 cursor-pointer transition"
              >
                Add to Cart
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
