import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { BsHeart } from 'react-icons/bs';
import { IoIosHeart } from 'react-icons/io';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistClicked, setWishlistClicked] = useState({});
  const [loading, setLoading] = useState(true);

  const { filter, category, products: passedProducts } = location.state || {};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (passedProducts) {
          setProducts(passedProducts);
          setFilteredProducts(passedProducts);
        } else {
          // Try multiple API endpoints
          const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
          const endpoints = [
            `${baseURL}/api/products/`,
            `${baseURL}/products/`,
            `${baseURL}/api/product/`
          ];
          
          let data = [];
          for (const endpoint of endpoints) {
            try {
              const res = await axios.get(endpoint);
              console.log(`ProductsPage ${endpoint} response:`, res.data);
              
              let responseData = res.data;
              if (res.data.productdata) responseData = res.data.productdata;
              else if (res.data.products) responseData = res.data.products;
              else if (res.data.data) responseData = res.data.data;
              
              if (Array.isArray(responseData) && responseData.length > 0) {
                data = responseData;
                break;
              }
            } catch (err) {
              console.log(`${endpoint} failed:`, err.message);
            }
          }
          
          setProducts(data);
          
          // Apply filters if provided
          if (filter) {
            console.log('🔍 Filter being applied:', filter);
            console.log('🔍 First product structure:', data[0]);
            
            const filtered = data.filter(p => {
              console.log('🔍 Product fields:', {
                product_category: p.product_category,
                category: p.category,
                product_type: p.product_type,
                product_brand: p.product_brand
              });
              
              // Handle both old and new data formats
              const categoryMatch = !filter.category || 
                // Direct matches
                p.product_category === filter.category || 
                p.category?.slug === filter.category ||
                p.subcategory?.slug === filter.category ||
                
                // OLD DATA COMPATIBILITY (temporary)
                (filter.category === 'Smartphones' && p.product_category === 'phones') ||
                (filter.category === 'smartphones' && p.product_category === 'phones') ||
                (filter.category === 'mobiles-tablets' && p.product_category === 'phones') ||
                
                // NEW DATA MAPPING
                (filter.category === 'smartphones' && p.product_category === 'mobiles-tablets') ||
                (filter.category === 'tablets' && p.product_category === 'mobiles-tablets') ||
                (filter.category === 'laptops' && p.product_category === 'electronics') ||
                (filter.category === 'headphones' && p.product_category === 'electronics');
              
              console.log('🔍 Category match:', categoryMatch, 'for filter:', filter.category);
              
              return (!filter.type || p.product_type === filter.type) &&
                     (!filter.brand || p.product_brand === filter.brand) &&
                     categoryMatch;
            });
            
            console.log('🔍 Filtered results:', filtered.length, 'out of', data.length);
            setFilteredProducts(filtered);
          } else {
            setFilteredProducts(data);
          }
        }
      } catch (err) {
        console.error('Products fetch error:', err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, category, passedProducts]);

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
      const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const res = await axios.post(`${baseURL}/api/cart/add/`, cartData, {
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
    setWishlistClicked(prev => ({ ...prev, [product._id]: !prev[product._id] }));
  };

  const goToDetail = (product) => {
    navigate("/product", { state: product });
  };

  const handleViewDetails = (product) => {
    navigate('/product', { state: product });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {category ? `${category} Products` : 'Products'}
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition relative group">
            {product.product_discount && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {product.product_discount}%
              </span>
            )}
            
            <button
              onClick={() => handleToggleWishlist(product)}
              className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-100 transition"
            >
              {wishlistClicked[product._id] ? 
                <IoIosHeart className="text-red-400" size={20} /> : 
                <BsHeart size={18} />
              }
            </button>

            <img
              src={product.product_img?.startsWith('http') ? 
                product.product_img : 
                `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${product.product_img}`
              }
              alt={product.product_name}
              onClick={() => goToDetail(product)}
              className="w-full h-48 object-contain rounded cursor-pointer hover:scale-105 transition"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop';
              }}
            />

            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                {product.product_name}
              </h3>
              
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={14}
                    className={i < (product.rating || 4) ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviews || '0'})
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-500 font-bold text-lg">
                  ₹{product.product_price}
                </span>
                {product.product_oldPrice && (
                  <span className="line-through text-gray-400 text-sm">
                    ₹{product.product_oldPrice}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-gray-800 text-white text-sm py-2 rounded hover:bg-gray-900 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleViewDetails(product)}
                  className="flex-1 bg-blue-500 text-white text-sm py-2 rounded hover:bg-blue-600 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}