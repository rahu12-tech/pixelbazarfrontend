import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState(orderId || '');

  const statusSteps = [
    { status: 'Order Placed', icon: FaBox, description: 'Your order has been confirmed' },
    { status: 'Packaging', icon: FaBox, description: 'Your order is being prepared' },
    { status: 'On The Road', icon: FaTruck, description: 'Your order is out for delivery' },
    { status: 'Delivered', icon: FaCheckCircle, description: 'Your order has been delivered' }
  ];

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/orders/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Order tracking response:', response.data);
      setOrderData(response.data.order || response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = () => {
    if (trackingId.trim()) {
      // If same order ID, just refresh the data
      if (trackingId === orderId) {
        fetchOrderDetails(trackingId);
      } else {
        navigate(`/track-order/${trackingId}`);
      }
    }
  };

  const getCurrentStepIndex = (status) => {
    return statusSteps.findIndex(step => step.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Track Your Order</h1>
          
          {/* Search Box */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Order ID or Tracking Number"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleTrackOrder}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Track Order
            </button>
          </div>
        </div>

        {/* Order Details */}
        {orderData ? (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">Order Information</h2>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Order ID:</span> {orderData.order_id || orderData._id}</p>
                    <p><span className="font-medium">Order Date:</span> {new Date(orderData.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{orderData.totalAmount}</p>
                    <p><span className="font-medium">Payment Method:</span> {orderData.paymentMethod}</p>
                    <p><span className="font-medium">Payment Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        orderData.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {orderData.payment_status || 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{orderData.fname} {orderData.lname}</p>
                    <p>{orderData.address}</p>
                    <p>{orderData.town}, {orderData.city}</p>
                    <p>{orderData.state} - {orderData.pincode}</p>
                    <p>Phone: {orderData.mobile}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-6">Order Status</h2>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200"></div>
                <div 
                  className="absolute top-8 left-8 h-1 bg-red-500 transition-all duration-500"
                  style={{ 
                    width: `${(getCurrentStepIndex(orderData.tracking?.status || 'Order Placed') / (statusSteps.length - 1)) * 100}%` 
                  }}
                ></div>

                {/* Status Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= getCurrentStepIndex(orderData.tracking?.status || 'Order Placed');
                    const isCurrent = index === getCurrentStepIndex(orderData.tracking?.status || 'Order Placed');
                    const IconComponent = step.icon;

                    return (
                      <div key={index} className="flex flex-col items-center text-center max-w-xs">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          isCompleted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-red-200' : ''}`}>
                          <IconComponent size={24} />
                        </div>
                        <h3 className={`font-medium text-sm mb-1 ${isCompleted ? 'text-red-600' : 'text-gray-400'}`}>
                          {step.status}
                        </h3>
                        <p className="text-xs text-gray-500 px-2">{step.description}</p>
                        {isCurrent && (
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            Updated: {new Date(orderData.tracking?.updatedAt || orderData.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <FaMapMarkerAlt />
                  <span className="font-medium">Estimated Delivery:</span>
                  <span>{new Date(new Date(orderData.createdAt).setDate(new Date(orderData.createdAt).getDate() + 5)).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderData.products?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={item.product_img?.startsWith('http') ? item.product_img : `http://127.0.0.1:8000${item.product_img}`}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.product_name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₹{item.product_price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.product_price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaBox size={48} className="mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-4">
              {trackingId ? 
                `No order found with ID: ${trackingId}` : 
                'Enter your order ID or tracking number to track your order'
              }
            </p>
            <button
              onClick={() => navigate('/orderhistory')}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              View Order History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;