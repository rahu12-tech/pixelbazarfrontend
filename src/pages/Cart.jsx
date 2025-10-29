import React, { useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";
import { syncCartData } from "../utils/cartUtils";
import { formatOrderForCheckout } from "../utils/orderUtils";
import api from "../api/axiosConfig";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const [cartdata, setCartData] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [buydata] = useState(location.state || []);

  const subtotal = cartdata.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);

  const totalDelivery = cartdata.reduce((acc, item) => acc + Number(item.delivery?.deliveryCharge || 0), 0);

  const grandtotal = subtotal + totalDelivery - discount;

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/api/cart/")
      .then((res) => {
        console.log('Cart API response:', res.data);
        const cartItems = res.data.items || res.data.cartapidata || res.data || [];
        const normalizedCart = syncCartData(cartItems);
        setCartData(normalizedCart);
      })
      .catch((err) => {
        console.error('Cart fetch error:', err);
        setCartData([]);
      });
  }, []);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/coupons/apply/', {
        code: coupon,
        cartTotal: subtotal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Coupon API response:', res.data);
      
      if (res.data.success || res.data.discount) {
        const discountAmount = res.data.discount || res.data.discount_amount || 0;
        setDiscount(discountAmount);
        setAppliedCoupon({ code: coupon, ...res.data.coupon });
        toast.success(`Coupon applied! You saved ₹${discountAmount}`);
        setCoupon("");
      } else {
        toast.error(res.data.message || "Invalid coupon code");
      }
    } catch (err) {
      console.error('Coupon apply error:', err);
      toast.error(err.response?.data?.message || "Failed to apply coupon");
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  const handleRemoveItem = (item) => {
    const token = localStorage.getItem("token");
    api
      .delete(`/api/cart/${item.id}/remove/`)
      .then((res) => {
        toast.success(res.data.msg);
        setCartData((prev) => prev.filter((p) => p.id !== item.id));
      })
      .catch(() => toast.error("Failed to remove item"));
  };

  const updateQty = (id, type) => {
    setCartData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentQty = Number(item.quantity || 1);
          return {
            ...item,
            quantity:
              type === "inc" ? currentQty + 1 : Math.max(currentQty - 1, 1),
          };
        } else return item;
      })
    );
  };

  const proceedToCheckout = (grandtotal) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
    } else {
      // Format cart data for checkout
      const checkoutData = formatOrderForCheckout(cartdata);
      
      console.log('Checkout data:', checkoutData);
      navigate("/pay", { state: checkoutData });
    }
  };

  const BiDetail = (item) => {
    navigate("/product", { state: item });
  };

  return (
    <div className="container mx-auto p-0 md:p-6">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-800">
        Shopping Cart ({cartdata.length})
      </h2>
      <Toaster position="top-right" reverseOrder={false} />

      {cartdata.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartdata.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between rounded-lg p-4 shadow bg-white"
              >
                {/* Product Image */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    onClick={() => BiDetail(item)}
                    src={item.product_img || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                    alt={item.product_name}
                    className="w-24 h-24 cursor-pointer rounded object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.product_name}
                    </h3>
                    <p className="text-gray-600">₹{item.product_price}</p>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center rounded-lg">
                    <button
                      onClick={() => updateQty(item.id, "dec")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, "inc")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{(item.product_price * item.quantity).toFixed(2)}
                  </p>

                  <MdOutlineDelete
                    onClick={() => handleRemoveItem(item)}
                    className="text-2xl text-red-500 cursor-pointer hover:text-red-700"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right - Coupon + Total */}
          <div className="space-y-6">
            <div className="border p-1 md:p-6 rounded-lg shadow bg-white">
              <h3 className="text-sm md:text-xl font-bold mb-4">Apply Coupon</h3>
              
              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
                      <p className="text-sm text-green-600">You saved ₹{discount}</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon Code"
                    className="flex-1 border rounded md:px-4 md:py-2 placeholder:ps-2 focus:ring-2 focus:ring-red-400 outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-red-500 text-white px-2 text-sm md:text-xl md:px-5 md:py-2 rounded hover:bg-red-600"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div className="border p-2 md:p-6 rounded-lg shadow bg-white">
              <h3 className="text-2xl font-bold mb-6">Cart Total</h3>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Delivery:</span>
                <span className="font-medium">
                  ₹{totalDelivery.toFixed(2)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-3 text-green-600">
                  <span>Discount:</span>
                  <span className="font-medium">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-xl mb-6 text-gray-800">
                <span>Grand Total:</span>
                <span>₹{grandtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => proceedToCheckout(grandtotal)}
                className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
