import api from '../api/axiosConfig';

// Utility function to clear both local and server cart
export const clearAllCarts = async (dispatch, clearCartAction) => {
  try {
    // Clear Redux cart
    dispatch(clearCartAction());
    
    // Clear server cart
    const token = localStorage.getItem('token');
    if (token) {
      await api.delete('/api/cart/clear/');
    }
    
    // Clear localStorage cart as backup
    localStorage.removeItem('cart');
    
    console.log('All carts cleared successfully');
  } catch (error) {
    console.error('Error clearing carts:', error);
  }
};

// Function to sync cart data between different sources
export const syncCartData = (serverCart, localCart) => {
  // Normalize cart data structure
  const normalizedCart = (serverCart || []).map(item => {
    return {
      id: item.id || item._id,
      product: item.product || {},
      product_name: item.product?.product_name || item.name || 'Product',
      product_price: Number(item.product?.product_price || item.price || item.total_price || 0),
      product_img: item.product?.product_img || item.image || '',
      quantity: Number(item.quantity || 1),
      delivery: item.delivery || { deliveryCharge: 0 }
    };
  });
  
  return normalizedCart;
};