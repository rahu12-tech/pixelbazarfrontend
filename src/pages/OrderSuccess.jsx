import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cart/cartSlice';
import { clearAllCarts } from '../utils/cartUtils';
import { normalizeOrderData } from '../utils/orderUtils';
import api from '../api/axiosConfig';

export default function OrderSuccess() {
  const dispatch = useDispatch();
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    // Clear all carts when order success page loads
    clearAllCarts(dispatch, clearCart);
    
    // Fetch latest order
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/orders/')
      .then((res) => {
        console.log('OrderSuccess - Full API response:', res.data);
        
        // Handle new API response structure
        let orders = [];
        if (res.data.status === 200 && res.data.orders) {
          orders = res.data.orders;
        } else if (res.data.orders) {
          orders = res.data.orders;
        } else if (Array.isArray(res.data)) {
          orders = res.data;
        }
        
        console.log('OrderSuccess - Raw orders:', orders);
        
        // Normalize order data structure
        const normalizedOrders = normalizeOrderData(orders);
        console.log('OrderSuccess - Normalized orders:', normalizedOrders);
        
        if (normalizedOrders.length > 0) {
          console.log('OrderSuccess - Latest order:', normalizedOrders[0]);
        console.log('🔍 OrderSuccess - Latest order products:', JSON.stringify(normalizedOrders[0]?.products, null, 2));
        console.log('🔍 OrderSuccess - Products length:', normalizedOrders[0]?.products?.length);
          setLatestOrder(normalizedOrders[0]); // Get the latest order
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
                <span>₹{Number(latestOrder.total_amount || latestOrder.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>₹{Number(latestOrder.delivery_charges || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>₹{(Number(latestOrder.total_amount || latestOrder.totalAmount || 0) * 0.18).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Final Amount:</span>
                <span>₹{Number(latestOrder.final_amount || latestOrder.totalAmount || 0).toFixed(2)}</span>
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
