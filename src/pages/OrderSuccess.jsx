import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cart/cartSlice';
import { clearAllCarts } from '../utils/cartUtils';
import axios from 'axios';

export default function OrderSuccess() {
  const dispatch = useDispatch();
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    // Clear all carts when order success page loads
    clearAllCarts(dispatch, clearCart);
    
    // Fetch latest order
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:8000/api/orders/', { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then((res) => {
        const orders = res.data.orders || [];
        if (orders.length > 0) {
          setLatestOrder(orders[0]); // Get the latest order
        }
      })
      .catch((err) => console.error('Error fetching latest order:', err));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="bg-green-100 rounded-full p-4 mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Your order has been successfully placed!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us. A confirmation email has been sent to your registered email address.
        </p>

        {/* Order Details */}
        {latestOrder && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 w-full">
            <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-medium">{latestOrder.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>
                  {(() => {
                    const method = latestOrder.paymentMethod || latestOrder.payment?.method;
                    if (method === 'COD' || method === 'cash on delivery') return 'Cash on Delivery';
                    if (method === 'razorpay' || method === 'online') return 'Online Payment';
                    return method || 'N/A';
                  })()
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{latestOrder.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>₹{latestOrder.delivery_charges || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>₹{((latestOrder.total_amount * 18) / 100).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Final Amount:</span>
                <span>₹{latestOrder.final_amount}</span>
              </div>
            </div>
          </div>
        )}

        <div className="w-full flex gap-4 justify-center">
          <Link to='/orderhistory'>
            <button className="w-full sm:w-auto border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded transition">
              See Order
            </button>
          </Link>
          <Link to='/'>
            <button className="w-full sm:w-auto border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded transition">
              Go to Home Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
