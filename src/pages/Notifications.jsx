import React, { useState, useEffect } from 'react';
import { MdNotifications, MdShoppingCart, MdLocalShipping, MdCheckCircle } from 'react-icons/md';
import axios from 'axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch user's orders to generate notifications
        const res = await axios.get('http://127.0.0.1:8000/api/orders/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const orders = res.data.orders || [];
        
        // Generate notifications from orders
        const orderNotifications = orders.map(order => {
          const notifications = [];
          
          // Order placed notification
          notifications.push({
            id: `${order.order_id}-placed`,
            type: 'order_placed',
            title: 'Order Placed Successfully',
            message: `Your order ${order.order_id} has been placed successfully.`,
            timestamp: order.created_at,
            icon: <MdShoppingCart className="text-blue-500" size={24} />,
            read: false
          });

          // Order status notifications
          if (order.tracking?.status === 'Confirmed') {
            notifications.push({
              id: `${order.order_id}-confirmed`,
              type: 'order_confirmed',
              title: 'Order Confirmed',
              message: `Your order ${order.order_id} has been confirmed and is being prepared.`,
              timestamp: order.tracking.last_updated,
              icon: <MdCheckCircle className="text-green-500" size={24} />,
              read: false
            });
          }

          if (order.tracking?.status === 'Shipped') {
            notifications.push({
              id: `${order.order_id}-shipped`,
              type: 'order_shipped',
              title: 'Order Shipped',
              message: `Your order ${order.order_id} has been shipped. Tracking ID: ${order.tracking.tracking_id}`,
              timestamp: order.tracking.last_updated,
              icon: <MdLocalShipping className="text-orange-500" size={24} />,
              read: false
            });
          }

          if (order.tracking?.status === 'Delivered') {
            notifications.push({
              id: `${order.order_id}-delivered`,
              type: 'order_delivered',
              title: 'Order Delivered',
              message: `Your order ${order.order_id} has been delivered successfully.`,
              timestamp: order.tracking.last_updated,
              icon: <MdCheckCircle className="text-green-600" size={24} />,
              read: false
            });
          }

          return notifications;
        }).flat();

        // Sort by timestamp (newest first)
        orderNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setNotifications(orderNotifications);
      } catch (err) {
        console.error('Notifications fetch error:', err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <MdNotifications className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <MdNotifications className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No notifications yet</p>
          <p className="text-gray-400 text-sm">You'll see order updates and other notifications here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}