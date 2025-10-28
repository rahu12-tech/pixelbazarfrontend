import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiShoppingCart, CiHeart } from "react-icons/ci";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineAccountCircle, MdOutlineNotificationsNone, MdOutlineLogout } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import { RiCoupon3Line } from "react-icons/ri";
import { TbGiftCard, TbCoinRupee } from "react-icons/tb";
import { FaStar } from "react-icons/fa6";
import { BiSolidShoppingBags } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import genix_bazar from '../assets/genix_bazar.png'
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(false);
  const { isLoggedIn, user, cartCount, wishlistCount, logout: authLogout, updateCartCount, updateWishlistCount } = useAuth();

  const navigate = useNavigate();



  const fetchCartCount = () => {
    const token = localStorage.getItem("token");
    if (!token || !isLoggedIn) {
      updateCartCount(0);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/cart/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const cartItems = res.data.data || res.data || [];
        updateCartCount(cartItems.length);
      })
      .catch((err) => {
        console.error("Cart fetch failed:", err);
        if (err.response?.status === 401) {
          authLogout();
        }
        updateCartCount(0);
      });
  };

  const fetchWishlistCount = () => {
    const token = localStorage.getItem("token");
    if (!token || !isLoggedIn) {
      updateWishlistCount(0);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/wishlist/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const wishlistItems = res.data.data || res.data.items || res.data || [];
        updateWishlistCount(wishlistItems.length);
      })
      .catch((err) => {
        console.error("Wishlist fetch failed:", err);
        updateWishlistCount(0);
      });
  };

  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();
  }, [isLoggedIn]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [isLoggedIn]);




  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/products/`)
      .then((res) => setProducts(res.data.productdata || res.data))
      .catch(() => toast.error("Failed to fetch products"));
  }, []);


  // Use dynamic wishlist count from API instead of Redux
  // const wishlistQty = useSelector((state) => state.wishlist.totalQty || 0);

  const filteredProducts = products.filter((item) => {
    const combined = `${item.product_brand || ""} ${item.product_name || ""} ${item.product_titel || ""} ${item.product_type || ""}`.toLowerCase();
    return combined.includes(searchTerm.toLowerCase());
  });

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      authLogout();
      
      if (token) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/auth/logout/`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.log("Logout API failed, but local logout successful");
        }
      }
      
      toast.success("Logged out successfully");
      navigate("/signup");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  // Toggle quantity, profile dropdown etc handled in CartPage

  return (
    <header className="bg-white text-black shadow-md sticky top-0 z-50">
      <Toaster position="top-right" />
      <div className="container mx-auto flex justify-between items-center p-4">

        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to="/" className="text-red-900">
            <img src={genix_bazar} alt="" className="w-30"/>
          </Link>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <Link to="/about" className="hover:text-gray-600">About</Link>
          <Link to="/contact" className="hover:text-gray-600">Contact</Link>
          <Link to="/contact" className="hover:text-gray-600">Become a Seller</Link>
        </nav>

        {/* Right Side: Search + Icons */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {/* Search Bar */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-black text-black"
            />
            <FaSearch className="absolute right-2 top-2 text-gray-600" />

            {/* Search Results Dropdown */}
            {searchTerm && (
              <div className="absolute top-10 left-0 w-full bg-white shadow-md rounded-md max-h-60 overflow-y-auto z-50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <Link
                      key={item._id}
                      to={`/product/${item._id}`}
                      className="block px-3 py-2 hover:bg-gray-100"
                      onClick={() => setSearchTerm("")}
                    >
                      <div>{item.product_brand}</div>
                      <div>{item.product_type}</div>
                      <div>{item.product_name}</div>
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-2 text-gray-500">No products found</p>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="relative">
            <Link to="/wishlist">
              <CiHeart className="cursor-pointer" size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {wishlistCount}
            </span>
          </div>

          {/* Cart */}
          <div className="relative">
            <Link to="/cart">
              <CiShoppingCart className="cursor-pointer" size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          </div>

          {/* Profile */}
          {isLoggedIn && user ? (
            <div
              className="relative flex flex-col items-center justify-center cursor-pointer"
              onMouseEnter={() => setActiveIndex(true)}
              onMouseLeave={() => setActiveIndex(false)}
            >
              <div className="flex flex-col items-center">
                <MdOutlineAccountCircle className="text-gray-800 hover:text-gray-700 transition-colors" size={28} />
                <span className="mt-1 text-sm font-medium text-black">{user.name || user.username || user.email}</span>
              </div>

              {activeIndex && (
                <div className="absolute top-12 right-0 w-64 bg-white rounded-md shadow-md z-50 border border-gray-200">
                  <Link to="/editprofile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <MdOutlineAccountCircle className="text-blue-600" size={20} />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/orderhistory" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <BiSolidShoppingBags className="text-blue-600" size={20} />
                    <span>Orders</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <CiHeart className="text-blue-600" size={20} />
                    <span>Wishlist</span>
                  </Link>
                  <Link to="/coupons" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <RiCoupon3Line className="text-blue-600" size={20} />
                    <span>Coupons</span>
                  </Link>
                  <Link to="/giftcards" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <TbGiftCard className="text-blue-600" size={20} />
                    <span>Gift Cards</span>
                  </Link>
                  <Link to="/notifications" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <MdOutlineNotificationsNone className="text-blue-600" size={20} />
                    <span>Notifications</span>
                  </Link>
                  <button onClick={logout} className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left">
                    <MdOutlineLogout className="text-blue-600" size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/signup">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition">
                  Login
                </button>
              </Link>
              <a 
                href={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/admin/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition">
                  Admin
                </button>
              </a>
            </div>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex gap-3 md:hidden">
          <div className="relative">
            <Link to="/wishlist">
              <CiHeart className="cursor-pointer" size={26} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {wishlistCount}
            </span>
          </div>
          <div className="relative">
            <Link to="/cart">
              <CiShoppingCart className="cursor-pointer" size={26} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          </div>
          <button className="text-xl text-black" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg z-50 p-6 space-y-6"
          >
            <Link to="/" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>Contact</Link>
            {!isLoggedIn && (
              <>
                <Link to="/signup" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>Login</Link>
                <a 
                  href={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/admin/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg font-medium text-red-600 hover:text-red-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </a>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
