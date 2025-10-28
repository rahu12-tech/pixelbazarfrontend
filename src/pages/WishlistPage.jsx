import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/wishlist/wishlistSlice";
import { MdOutlineDelete } from "react-icons/md";
import { CgShoppingCart } from "react-icons/cg";
import api from "../api/axiosConfig";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/api/wishlist/');
      const items = res.data.data || res.data.items || res.data || [];
      setWishlistItems(items);
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      await api.delete(`/api/wishlist/${item.id}/remove/`);
      toast.success('Removed from wishlist');
      setWishlistItems(prev => prev.filter(w => w.id !== item.id));
      dispatch(removeFromWishlist(item.id));
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      console.error('Remove wishlist error:', err);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      const cartData = {
        product_id: item.product?.id || item.product_id || item.id,
        quantity: 1
      };
      
      const res = await api.post('/api/cart/add/', cartData);
      toast.success('Added to cart successfully!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('Failed to add to cart');
    }
  };

  const handleProductClick = (item) => {
    const product = item.product || item;
    navigate('/product', { state: product });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-6">Wishlist ({wishlistItems.length})</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => {
            const product = item.product || item;
            const imageUrl = product.product_img?.startsWith('http') ? 
              product.product_img : 
              `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${product.product_img}`;
            
            return (
              <div key={item.id} className="border rounded-lg p-4 relative group hover:shadow-lg transition">
                <button
                  onClick={() => handleRemoveFromWishlist(item)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition z-10"
                >
                  <MdOutlineDelete className="text-xl" />
                </button>
                
                <div 
                  className="cursor-pointer"
                  onClick={() => handleProductClick(item)}
                >
                  <img 
                    src={imageUrl}
                    alt={product.product_name || product.name}
                    className="w-full h-48 object-contain rounded mb-3"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop';
                    }}
                  />
                  
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.product_name || product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-red-500 font-bold text-lg">
                      ₹{product.product_price || product.price}
                    </span>
                    {product.product_oldPrice && (
                      <span className="line-through text-gray-400 text-sm">
                        ₹{product.product_oldPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <CgShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
