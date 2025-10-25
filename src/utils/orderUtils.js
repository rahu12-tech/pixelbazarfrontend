// Utility function to normalize order data from different API response formats
export const normalizeOrderData = (orders) => {
  return orders.map(order => ({
    ...order,
    _id: order._id || order.id || order.order_id,
    order_id: order.order_id || order._id || order.id,
    products: (order.products || order.items || []).map(product => ({
      _id: product._id || product.id,
      product_name: product.product_name || product.name || product.title || 'Product',
      product_price: Number(product.product_price || product.price || 0),
      product_img: product.product_img || product.image || product.img || '',
      quantity: Number(product.quantity || product.qty || 1),
      product_return: product.product_return || product.return_policy || '0'
    })),
    totalAmount: Number(order.total_amount || order.totalAmount || order.final_amount || order.amount || 0),
    payment: order.payment || { method: 'N/A', status: 'pending' },
    paymentMethod: order.payment?.method || order.paymentMethod || order.payment_method || 'N/A',
    payment_status: order.payment?.status || order.payment_status || order.paymentStatus || 'pending',
    // Address fields from payment form
    fname: order.fname || order.first_name || order.customer_name || 'N/A',
    lname: order.lname || order.last_name || '',
    email: order.email || order.customer_email || '',
    mobile: order.mobile || order.phone || order.contact_number || '',
    address: order.address || 'N/A',
    town: order.town || order.area || '',
    city: order.city || 'N/A',
    state: order.state || 'N/A',
    pincode: order.pincode || order.postal_code || 'N/A',
    shipping_address: order.shipping_address || null,
    tracking: order.tracking || {
      status: order.tracking_status || order.status || 'Order Placed',
      updatedAt: order.updatedAt || order.created_at || new Date()
    },
    createdAt: order.createdAt || order.created_at || new Date(),
    return: order.return || null,
    status: order.status || 'active'
  }));
};

// Function to format order for checkout
export const formatOrderForCheckout = (cartItems) => {
  return cartItems.map(item => ({
    _id: item.id || item._id,
    product_name: item.product_name,
    product_price: item.product_price,
    product_img: item.product_img,
    quantity: item.quantity,
    delivery: item.delivery || { deliveryCharge: 0 }
  }));
};