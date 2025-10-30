import api from '../api/axiosConfig';
import React, { useEffect, useState } from 'react';
import jsPDF from "jspdf";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { normalizeOrderData } from '../utils/orderUtils';

function Orderhistory() {
    const [orderdata, setOrderdata] = useState([]);
    const [returnModal, setReturnModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reason, setReason] = useState("");
    const [extraText, setExtraText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            setOrderdata([]);
            return;
        }
        
        api
            .get('/api/orders/')
            .then((res) => {
                // Handle API response structure
                let orders = [];
                if (res.data.status === 200 && res.data.orders) {
                    orders = res.data.orders;
                } else if (res.data.orders) {
                    orders = res.data.orders;
                } else if (Array.isArray(res.data)) {
                    orders = res.data;
                }
                
                // Debug: Check what's in the latest order
                if (orders.length > 0) {
                    console.log('🔍 RAW Latest Order:', orders[0]);
                    console.log('🔍 RAW Products Data:', orders[0].products);
                    console.log('🔍 RAW Products Length:', orders[0].products?.length);
                }
                
                // Normalize order data structure
                const normalizedOrders = normalizeOrderData(orders);
                
                if (normalizedOrders.length > 0) {
                    console.log('🔍 NORMALIZED Latest Order:', normalizedOrders[0]);
                    console.log('🔍 NORMALIZED Products:', normalizedOrders[0].products);
                    console.log('🔍 NORMALIZED Products Length:', normalizedOrders[0].products?.length);
                }
                
                setOrderdata(normalizedOrders);
            })
            .catch((err) => {
                console.error('Orders fetch error:', err);
                console.error('Error response:', err.response);
                
                setOrderdata([]);
            });
    }, []);

    const statusSteps = ["Order Placed", "Packaging", "On The Road", "Delivered"];

    const taxbutton = (order) => {
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        doc.setFontSize(20);
        doc.text("Tax Invoice", 220, 40);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 40, 100);
        doc.text("Billing & Shipping Address:", 40, 170);
        doc.text(`${order.fname} ${order.lname}, ${order.address}, ${order.city}, ${order.state} - ${order.pincode}`, 40, 190, { maxWidth: 500 });
        doc.text(`Phone: ${order.mobile}`, 40, 210);
        doc.setFontSize(14);
        doc.text("Products", 40, 250);

        let y = 280;
        doc.setFontSize(12);
        doc.text("Product", 40, y);
        doc.text("Qty", 300, y);
        doc.text("Price", 400, y);
        doc.text("Total", 500, y);
        y += 20;

        order.products.forEach((prod) => {
            doc.text(prod.product_name, 40, y, { maxWidth: 250 });
            doc.text(String(prod.quantity), 300, y);
            doc.text(`₹${prod.product_price}`, 400, y);
            doc.text(`₹${(prod.product_price * prod.quantity).toFixed(2)}`, 500, y);
            y += 20;
        });

        y += 20;
        doc.setFontSize(12);
        doc.text(`Subtotal: ₹${order.total_amount || order.totalAmount}`, 400, y);
        y += 15;
        doc.text(`Delivery Charges: ₹${order.delivery_charges || 0}`, 400, y);
        y += 15;
        const gst = (((order.total_amount || order.totalAmount || 0) * 18) / 100).toFixed(2);
        doc.text(`GST (18%): ₹${gst}`, 400, y);
        y += 15;
        doc.setFontSize(14);
        doc.text(`Final Amount: ₹${order.final_amount || order.totalAmount}`, 400, y);
        y += 40;
        doc.setFontSize(10);
        doc.text("Thank you for shopping with us!", 220, y);
        doc.save(`invoice-${order._id}.pdf`);
    };

    const OrderCancel = (orderId) => {
        const token = localStorage.getItem('token');
        api.post(`/api/orders/${orderId}/cancel/`, {})
            .then((res) => {
                toast.success(res.data.msg || 'Order cancelled successfully');
                setOrderdata(prev => prev.map(order => 
                    order.order_id === orderId ? { ...order, status: 'cancelled' } : order
                ));
            })
            .catch((err) => {
                console.error('Cancel error:', err);
                toast.error(err.response?.data?.msg || 'Failed to cancel order');
            });
    };

    const submitReturn = async () => {
        if (!reason) {
            toast.error("Please select reason for return");
            return;
        }
        if (reason === "other" && !extraText.trim()) {
            toast.error("Please specify your reason");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await api.post(
                `/api/orders/${selectedOrder.order_id || selectedOrder._id}/return/`,
                {
                    reason: reason === "other" ? extraText : reason,
                    order_id: selectedOrder.order_id || selectedOrder._id,
                    products: selectedOrder.products
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Return request response:', res.data);
            toast.success(res.data.message || "Return request submitted successfully!");
            
            // Update order data with return status - support multiple formats
            setOrderdata(prev => prev.map(o => {
                if (o._id === selectedOrder._id || o.order_id === selectedOrder.order_id) {
                    const returnData = {
                        status: "requested",
                        reason: reason === "other" ? extraText : reason,
                        requestedAt: new Date().toISOString(),
                        return_id: res.data.return_id || `RET${Date.now()}`
                    };
                    
                    return {
                        ...o,
                        // Add to multiple possible fields for compatibility
                        return: returnData,
                        return_status: returnData,
                        return_requests: [returnData]
                    };
                }
                return o;
            }));

            setReason("");
            setExtraText("");
            setReturnModal(false);
            
            // Refresh page data to get latest return info
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error('Return request error:', err);
            toast.error(err.response?.data?.message || "Failed to request return");
        }
    };

    return (
        <div className="p-2 md:p-4 bg-gray-100 h-[600px] overflow-scroll">
            <Toaster position='top-right' reverseOrder={false} />
            <h2 className="text-lg md:text-xl font-bold mb-6 text-center">Order History</h2>

            {orderdata.length === 0 && <p className="text-center text-gray-300">No orders found.</p>}

            <div className="space-y-4">
                {orderdata.map((order) => {
                    const currentStepIndex = statusSteps.indexOf(order.tracking?.status || "Order Placed");
                    const isDelivered = order.tracking?.status === "Delivered";

                    // Debug: Check return data structure
                    console.log('🔍 Order return data:', {
                        order_id: order.order_id,
                        return_requests: order.return_requests,
                        return_status: order.return_status,
                        return: order.return
                    });
                    
                    // Return eligibility check - check multiple possible fields
                    const hasActiveReturn = (order.return_requests && order.return_requests.length > 0) || 
                                          order.return_status || 
                                          order.return;
                    
                    const latestReturn = order.return_requests?.[0] || 
                                       order.return_status || 
                                       order.return;
                    
                    const canReturn = isDelivered && !hasActiveReturn && order.products.some((prod) => {
                        if (!prod.product_return || prod.product_return.toLowerCase() === "0") return false;

                        const deliveryDate = new Date(order.tracking?.updatedAt || order.createdAt);
                        const returnDays = parseInt(prod.product_return, 10);
                        if (isNaN(returnDays)) return false;

                        const returnExpiry = new Date(deliveryDate);
                        returnExpiry.setDate(deliveryDate.getDate() + returnDays);

                        return new Date() <= returnExpiry;
                    });
                    
                    // Can request return again only if previous was rejected
                    const canReturnAgain = isDelivered && latestReturn && latestReturn.status === 'rejected';

                    return (
                        <div key={order._id} className={`relative rounded-lg p-3 md:p-4 shadow ${isDelivered ? "bg-gray-200" : "bg-white"}`}>
                            {isDelivered && <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-1 rounded-t-lg"> Delivery Successful</div>}

                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2 mt-6">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Order ID: {order.order_id || order._id}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {(order.products && order.products.length > 0) ? order.products.length : 'No'} Products · Placed on {new Date(order.createdAt || order.created_at).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Status: <span className="font-semibold text-blue-600">{order.tracking?.status || 'Order Placed'}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-800 text-lg md:text-xl">
                                        ₹{order.totalAmount || 0}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {order.paymentMethod || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="border-t border-b border-gray-200 py-2 mb-3 space-y-2">
                                {(order.products && order.products.length > 0) ? order.products.map((prod, index) => {
                                    console.log('🔍 Product Data:', prod);
                                    // Use pre-formatted image URL from orderUtils or construct it
                                    const finalImageUrl = prod.image_url || 
                                        (() => {
                                            const imageUrl = prod.product_img || prod.image || prod.img;
                                            if (!imageUrl) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop';
                                            if (imageUrl.startsWith('http')) return imageUrl;
                                            if (imageUrl.startsWith('/media/')) return `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${imageUrl}`;
                                            if (imageUrl.startsWith('media/')) return `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/${imageUrl}`;
                                            return `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/media/${imageUrl}`;
                                        })();
                                    
                                    console.log('🔍 Product Image Data:', {
                                        product_img: prod.product_img,
                                        image: prod.image,
                                        img: prod.img,
                                        image_url: prod.image_url,
                                        finalImageUrl
                                    });
                                    
                                    return (
                                        <div key={prod._id || prod.id || index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <img 
                                                    src={finalImageUrl}
                                                    alt={prod.product_name || prod.name || 'Product'}
                                                    className="h-16 w-16 object-contain rounded border" 
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop';
                                                    }}
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">{prod.product_name || prod.name || 'Product Name'}</p>
                                                    <p className="text-xs text-gray-500">Qty: {prod.quantity || 1}</p>
                                                    <p className="text-xs text-gray-400">Price: ₹{prod.product_price || prod.price || 0}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 font-semibold">
                                                ₹{((prod.product_price || prod.price || 0) * (prod.quantity || 1)).toFixed(2)}
                                            </p>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <p>No product details available</p>
                                        <p className="text-xs">Order Amount: ₹{order.totalAmount || order.total_amount || 0}</p>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 p-3 rounded mb-3">
                                <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>₹{order.total_amount || order.totalAmount || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Charges:</span>
                                        <span>₹{order.delivery_charges || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>GST (18%):</span>
                                        <span>₹{(((order.total_amount || order.totalAmount || 0) * 18) / 100).toFixed(2)}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-semibold">
                                        <span>Final Amount:</span>
                                        <span>₹{order.final_amount || order.totalAmount || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Address */}
                            <div className="text-sm text-gray-600 mb-3 space-y-1">
                                <p><strong>Payment Method:</strong> 
                                    {(() => {
                                        const method = order.payment?.method || order.paymentMethod || 'N/A';
                                        if (method === 'razorpay') return 'Online Payment';
                                        if (method === 'COD' || method === 'cash on delivery') return 'Cash on Delivery';
                                        return method;
                                    })()
                                }</p>
                                <p><strong>Payment Status:</strong> 
                                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                        (order.payment?.status === 'completed') ? 'bg-green-100 text-green-800' : 
                                        (order.payment?.method === 'COD' || order.payment?.method === 'cash on delivery') ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {(() => {
                                            const method = order.payment?.method || order.paymentMethod;
                                            const status = order.payment?.status || order.payment_status;
                                            
                                            if (method === 'COD' || method === 'cash on delivery') {
                                                return order.tracking?.status === 'Delivered' ? 'COD - Paid' : 'COD - Pending';
                                            }
                                            if (method === 'razorpay' || method === 'online') {
                                                return status === 'completed' || status === 'paid' ? 'Paid' : 'Payment Pending';
                                            }
                                            return 'Pending';
                                        })()
                                    }
                                    </span>
                                </p>
                                <p><strong>Shipping Address:</strong> 
                                    {(() => {
                                        // Check if shipping_address object exists
                                        if (order.shipping_address && order.shipping_address.name && order.shipping_address.name.trim()) {
                                            const addr = order.shipping_address;
                                            return `${addr.name}, ${addr.address}, ${addr.locality}, ${addr.city}, ${addr.state} - ${addr.pincode}${addr.phone ? `, Phone: ${addr.phone}` : ''}`;
                                        }
                                        
                                        // Check if individual address fields exist
                                        if (order.fname && order.fname.trim()) {
                                            const addressParts = [];
                                            if (order.fname || order.lname) addressParts.push(`${order.fname || ''} ${order.lname || ''}`.trim());
                                            if (order.address && order.address.trim()) addressParts.push(order.address);
                                            if (order.town && order.town.trim()) addressParts.push(order.town);
                                            if (order.city && order.city.trim()) addressParts.push(order.city);
                                            if (order.state && order.state.trim()) addressParts.push(order.state);
                                            if (order.pincode && order.pincode.trim()) addressParts.push(`- ${order.pincode}`);
                                            if (order.mobile && order.mobile.trim()) addressParts.push(`Phone: ${order.mobile}`);
                                            
                                            return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
                                        }
                                        
                                        return 'Address not available';
                                    })()
                                }</p>
                                <p><strong>Expected Delivery:</strong> {new Date(new Date(order.createdAt || order.created_at).setDate(new Date(order.createdAt || order.created_at).getDate() + 5)).toLocaleDateString()}</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative mb-6">
                                <div className="absolute top-3 left-0 right-0 h-1 bg-gray-300"></div>
                                <div className="absolute top-3 left-0 h-1 bg-green-600 transition-all duration-700 ease-in-out" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}></div>
                                <div className="flex justify-between relative z-10">
                                    {statusSteps.map((step, idx) => (
                                        <div key={idx} className="flex-1 text-center">
                                            <div className={`w-6 h-6 mx-auto rounded-full border flex items-center justify-center transition duration-300 ${idx <= currentStepIndex ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-400"}`}>
                                                {idx + 1}
                                            </div>
                                            <p className="mt-1 text-[10px] sm:text-xs">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="bg-gray-50 p-2 rounded text-gray-700 text-sm">
                                <p>Order placed successfully.</p>
                                <p className="text-blue-600"> Tracking Status: {order.tracking?.status} (Updated on{" "} {new Date(order.tracking?.updatedAt).toLocaleString()})</p>
                                
                                {/* Return Status Section */}
                                {hasActiveReturn && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className={`font-semibold text-sm ${
                                                    latestReturn.status === 'refund_completed' ? 'text-green-600' :
                                                    latestReturn.status === 'rejected' ? 'text-red-600' :
                                                    'text-orange-600'
                                                }`}>
                                                    🔄 Return Status: {latestReturn.status ? latestReturn.status.replace('_', ' ').toUpperCase() : 'REQUESTED'}
                                                </p>
                                                <p className="text-xs text-gray-600">Return ID: {latestReturn.return_id || latestReturn.id || 'N/A'}</p>
                                                {latestReturn.reason && <p className="text-xs text-gray-600">Reason: {latestReturn.reason}</p>}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const returnId = latestReturn.return_id || latestReturn.id;
                                                    if (returnId) {
                                                        navigate(`/return-tracking/${returnId}`);
                                                    } else {
                                                        toast.error('Return ID not found');
                                                    }
                                                }}
                                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Track Order */}
                                <button
                                    onClick={() => {
                                        // Refresh order data instead of navigating
                                        const token = localStorage.getItem('token');
                                        if (token) {
                                            api.get('/api/orders/')
                                                .then((res) => {
                                                    let orders = [];
                                                    if (res.data.status === 200 && res.data.orders) {
                                                        orders = res.data.orders;
                                                    } else if (res.data.orders) {
                                                        orders = res.data.orders;
                                                    } else if (Array.isArray(res.data)) {
                                                        orders = res.data;
                                                    }
                                                    const normalizedOrders = normalizeOrderData(orders);
                                                    setOrderdata(normalizedOrders);
                                                    toast.success('Order status refreshed!');
                                                })
                                                .catch((err) => {
                                                    console.error('Refresh error:', err);
                                                    toast.error('Failed to refresh order status');
                                                });
                                        }
                                    }}
                                    className="w-full sm:w-auto p-2 px-6 py-2 rounded mt-3 font-semibold bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Track Order
                                </button>

                                {/* Cancel or Return Button Logic */}
                                {!isDelivered && order.status !== 'cancelled' ? (
                                    <button
                                        onClick={() => OrderCancel(order.order_id)}
                                        className="w-full sm:w-auto p-2 px-6 py-2 rounded mt-3 font-semibold bg-gray-300 hover:bg-gray-200 text-black"
                                    >
                                        Cancel Order
                                    </button>
                                ) : order.status === 'cancelled' ? (
                                    <button
                                        disabled
                                        className="w-full sm:w-auto p-2 px-6 py-2 rounded mt-3 font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                                    >
                                        Cancelled
                                    </button>
                                ) : hasActiveReturn ? (
                                    <button
                                        onClick={() => {
                                            const returnId = latestReturn.return_id || latestReturn.id;
                                            if (returnId) {
                                                navigate(`/return-tracking/${returnId}`);
                                            } else {
                                                toast.error('Return ID not found');
                                            }
                                        }}
                                        className={`w-full sm:w-auto p-2 px-6 py-2 rounded mt-3 font-semibold ${
                                            latestReturn.status === 'refund_completed' ? 'bg-green-500 text-white' :
                                            latestReturn.status === 'rejected' ? 'bg-red-500 text-white' :
                                            'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {latestReturn.status === 'refund_completed' ? 'Refund Completed' :
                                         latestReturn.status === 'rejected' ? 'Return Rejected' :
                                         'Track Return'}
                                    </button>
                                ) : (canReturn || canReturnAgain) ? (
                                    <button
                                        onClick={() => { setSelectedOrder(order); setReturnModal(true); }}
                                        className="w-full sm:w-auto p-2 px-6 py-2 rounded mt-3 font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                                    >
                                        {canReturnAgain ? 'Request Return Again' : 'Return Order'}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full sm:w-auto p-2 px-6 py-2 rounded mt-3 font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                                    >
                                        Return Not Available
                                    </button>
                                )}

                                {/* Download Invoice */}
                                <button
                                    onClick={() => taxbutton(order)}
                                    className="w-full sm:w-auto p-2 bg-gray-300 hover:bg-gray-200 font-semibold text-black px-6 py-2 rounded mt-3"
                                >
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Return Modal */}
            {returnModal && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-brightness-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Return Order</h3>
                        <select value={reason} onChange={e => setReason(e.target.value)} className="border p-2 rounded w-full mb-3">
                            <option value="">-- Select Reason for Return --</option>
                            <option value="defective">Product defective / damaged</option>
                            <option value="wrong">Wrong product delivered</option>
                            <option value="missing">Missing accessories / parts</option>
                            <option value="not_as_described">Product not as described</option>
                            <option value="used">Received used / open box item</option>
                            <option value="performance">Performance issue</option>
                            <option value="other">Other (please specify)</option>
                        </select>
                        {reason === "other" && <input type="text" value={extraText} onChange={e => setExtraText(e.target.value)} placeholder="Please specify your reason" className="border p-2 rounded w-full mb-3" />}
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setReturnModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={submitReturn} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Submit Return</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orderhistory;
