import api from "../api/axiosConfig";
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";
import { clearAllCarts } from "../utils/cartUtils";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

const Paymentway = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [productdata] = useState(() => {
    const data = location.state;
    console.log('Received checkout data:', data);
    
    if (!data || data.length === 0) {
      // Fallback: try to get from localStorage cart
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length > 0) {
        return localCart.map(item => ({
          _id: item.id || item._id || Date.now(),
          product_name: item.name || item.product_name || 'Product',
          product_price: item.price || item.product_price || 0,
          product_img: item.image || item.product_img || '',
          quantity: item.quantity || 1
        }));
      }
      
      // Final fallback
      return [{
        _id: '1',
        product_name: 'Sample Product',
        product_price: 100,
        product_img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop',
        quantity: 1
      }];
    }
    
    return data;
  });
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [errors, setErrors] = useState({});
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState("");
  const navigate = useNavigate();
  console.log('Product data:', productdata);
 

  const calculateTotal = () => {
    if (!productdata || productdata.length === 0) return 0;
    const subtotal = productdata.reduce((a, b) => a + (Number(b.product_price) || 0) * (Number(b.quantity) || 1), 0);
    const delivery = productdata[0]?.delivery?.deliveryCharge || 0;
    return subtotal + delivery;
  };

  const calculateFinalTotal = () => {
    const total = calculateTotal();
    return Math.max(0, total - couponDiscount);
  };

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    address: "",
    town: "",
    city: "",
    state: "",
    pincode: "",
    totalAmount: calculateTotal(),
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);




  const validationSchema = Yup.object().shape({
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    address: Yup.string().required("Address is required"),
    town: Yup.string().required("Town is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData({ ...formData, [name]: digitsOnly });
      }
    } else if (name === "pincode") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 6) {
        setFormData({ ...formData, [name]: digitsOnly });
        setPincode(digitsOnly);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setPincodeMsg("Please enter a coupon code");
      setPincodeStatus("error");
      return;
    }

    setCouponLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/apply-coupon/', {
        coupon_code: couponCode,
        order_amount: calculateTotal()
      });

      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        setCouponDiscount(res.data.discount_amount);
        setPincodeMsg(`Coupon applied! You saved ₹${res.data.discount_amount}`);
        setPincodeStatus("success");
      } else {
        setPincodeMsg(res.data.message || "Invalid coupon code");
        setPincodeStatus("error");
      }
    } catch (err) {
      console.error('Coupon apply error:', err);
      setPincodeMsg(err.response?.data?.message || "Failed to apply coupon");
      setPincodeStatus("error");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setPincodeMsg("");
    setPincodeStatus("");
  };

  const checkPincode = () => {
    if (pincode.length !== 6) {
      setIsPincodeValid(false);
      setPincodeMsg("Enter a valid 6-digit pincode");
      setPincodeStatus("error");
      return;
    }
    api.post("/api/check-pincode/", { pincode }).then((res) => {
      if (res.data.status === 200) {
        setDeliveryInfo(res.data);
        setIsPincodeValid(true);
        setPincodeMsg(res.data.msg);
        setPincodeStatus("success");
      } else {
        setDeliveryInfo(null);
        setIsPincodeValid(false);
        setPincodeMsg(res.data.msg);
        setPincodeStatus("error");
      }
    })
      .catch(() => {
        setIsPincodeValid(false);
        setPincodeMsg("Error checking pincode");
        setPincodeStatus("error");
      });
    
    // Uncomment when backend API is ready:
    // axios.post("http://127.0.0.1:8000/api/check-pincode", { pincode })
    //   .then((res) => {
    //     if (res.data.status === 200) {
    //       setDeliveryInfo(res.data);
    //       setIsPincodeValid(true);
    //       setPincodeMsg(res.data.msg);
    //       setPincodeStatus("success");
    //     } else {
    //       setDeliveryInfo(null);
    //       setIsPincodeValid(false);
    //       setPincodeMsg(res.data.msg);
    //       setPincodeStatus("error");
    //     }
    //   })
    //   .catch(() => {
    //     setIsPincodeValid(false);
    //     setPincodeMsg("Error checking pincode");
    //     setPincodeStatus("error");
    //   });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isPincodeValid) {
    setPincodeMsg("Please enter a valid pincode before proceeding!");
    setPincodeStatus("error");
    return;
  }

  try {
    await validationSchema.validate(formData, { abortEarly: false });
    setErrors({});
    const token = localStorage.getItem("token");

    if (paymentMethod === "cash on delivery") {
      const orderData = {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        town: formData.town,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        products: productdata,
        totalAmount: calculateTotal(),
        finalAmount: calculateFinalTotal(),
        couponCode: appliedCoupon?.code || null,
        couponDiscount: couponDiscount,
        paymentMethod: "COD"
      };
      
      console.log('Sending COD order data:', orderData);
      
      try {
        const orderRes = await api.post("/api/order/", orderData);
        
        console.log('COD Order response:', orderRes.data);
        
        // Clear cart from backend
        try {
          await api.delete('/api/cart/clear/');
        } catch (cartError) {
          console.log('Cart clear error:', cartError);
        }
        
        // Clear local cart
        localStorage.removeItem('cart');
        dispatch(clearCart());
        
        // Trigger cart update event
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Reset form immediately
        setFormData({
          fname: "",
          lname: "",
          email: "",
          mobile: "",
          address: "",
          town: "",
          city: "",
          state: "",
          pincode: "",
          totalAmount: 0,
        });
        
        // Reset other states
        setPincode("");
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode("");
        
        // Show success and redirect
        toast.success('Order placed successfully! Redirecting...');
        
        // Navigate to success page
        setTimeout(() => {
          navigate('/ordersuccess');
        }, 1000);
        return;
      } catch (error) {
        console.error('COD Order error:', error);
        toast.error(error.response?.data?.message || 'Failed to place order');
        return;
      }
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await startOnlinePayment(pos.coords.latitude, pos.coords.longitude, token);
      },
      async (err) => {
        console.log("Geo error", err);
        await startOnlinePayment(null, null, token);
      }
    );

  } catch (validationError) {
    const formattedErrors = {};
    validationError.inner?.forEach((err) => {
      formattedErrors[err.path] = err.message;
    });
    setErrors(formattedErrors);
  }
};



async function startOnlinePayment(latitude, longitude, token) {
  const orderData = {
    fname: formData.fname,
    lname: formData.lname,
    email: formData.email,
    mobile: formData.mobile,
    address: formData.address,
    town: formData.town,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    products: productdata,
    totalAmount: calculateTotal(),
    finalAmount: calculateFinalTotal(),
    couponCode: appliedCoupon?.code || null,
    couponDiscount: couponDiscount,
    paymentMethod: paymentMethod,
    latitude: latitude || null,
    longitude: longitude || null
  };
  
  console.log('Sending order data:', orderData);
  
  const orderRes = await api.post("/api/order/", orderData);

  const { data } = await api.post(
    "/api/create-order/",
    { amount: calculateFinalTotal(), currency: "INR" }
  );

  const options = {
    key: data.key_id,
    amount: data.order_amount,
    currency: data.currency,
    name: "Pixel Genix",
    order_id: data.order_id,
    description: "Payment via Razorpay",
    prefill: {
      name: `${formData.fname} ${formData.lname}`,
      email: formData.email,
      contact: formData.mobile,
    },
    theme: { color: "#07a291db" },
    handler: async function (response) {
      try {
        const verifyRes = await api.post(
          "/api/verify-payment/",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
        );

        if (verifyRes.data.success) {
          console.log('Payment verified successfully:', verifyRes.data);
          
          // Clear cart from backend
          const token = localStorage.getItem('token');
          await api.delete('/api/cart/clear/');
          
          // Clear local cart
          localStorage.removeItem('cart');
          dispatch(clearCart());
          
          // Trigger cart update event
          window.dispatchEvent(new Event('cartUpdated'));
          
          // Show success message and redirect
          toast.success('Payment successful! Redirecting to order success page...');
          setTimeout(() => {
            navigate('/ordersuccess');
          }, 1000);
        } else {
          console.error('Payment verification failed:', verifyRes.data);
          setPincodeMsg("Payment Verification Failed");
          setPincodeStatus("error");
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setPincodeMsg("Error verifying payment");
        setPincodeStatus("error");
      }
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}



  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-6 p-2">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Billing Form */}
      <div className="bg-white shadow-xl rounded-3xl p-6 w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Billing Details</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* First Name */}
          <div>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded w-full"
            />
            {errors.fname && (
              <p className="text-red-500 text-sm">{errors.fname}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded w-full"
            />
            {errors.lname && (
              <p className="text-red-500 text-sm">{errors.lname}</p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="border p-2 rounded w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="md:col-span-2">
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="border p-2 rounded w-full"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="border p-2 rounded w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          {/* Town */}
          <div>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleChange}
              placeholder="Town / Village"
              className="border p-2 rounded w-full"
            />
            {errors.town && (
              <p className="text-red-500 text-sm">{errors.town}</p>
            )}
          </div>

          {/* City */}
          <div>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="border p-2 rounded w-full"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="border p-2 rounded w-full"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter Pincode"
                className="p-2 border-b w-full outline-none"
              />
              <button
                type="button"
                onClick={checkPincode}
                className="bg-red-500 text-white px-4 cursor-pointer "
              >
                Search
              </button>
            </div>
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
            {pincodeMsg && (
              <p
                className={`mt-1 text-sm ${pincodeStatus === "success"
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {pincodeMsg}
              </p>
            )}
          </div>

          {/* Coupon Section */}
          <div className="md:col-span-2 mt-3">
            <h2 className="text-lg font-bold mb-3">Apply Coupon</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border p-2 rounded"
                disabled={appliedCoupon}
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              )}
            </div>
            {appliedCoupon && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4">
                <strong>{appliedCoupon.code}</strong> applied! You saved ₹{couponDiscount}
              </div>
            )}
          </div>

          {/* Payment Options */}
          <div className="md:col-span-2 mt-3">
            <h2 className="text-lg font-bold mb-3">Choose Payment Method</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span>Online Payment (UPI, Card, Netbanking)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="radio"
                name="payment"
                value="cash on delivery"
                checked={paymentMethod === "cash on delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span>Cash on Delivery</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-2 w-full mt-5 bg-red-500 text-white py-3 rounded-sm hover:bg-red-600 font-semibold transition"
          >
            {paymentMethod === "cash on delivery" ? "Place Order" : "Proceed to Payment"}
          </button>
        </form>
      </div>

      {/* Product Summary */}
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full md:w-1/3 h-[560px] overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
        <div className="space-y-3">
          {productdata && productdata.length > 0 ? productdata.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={item.product_img?.startsWith('http') ? item.product_img : `${import.meta.env.VITE_API_URL}${item.product_img}`} 
                  className="w-14 h-14 shadow-2xl object-cover rounded" 
                  alt={item.product_name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop';
                  }}
                />
                <div>
                  <p className="font-medium">{item.product_name || 'Product'}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                </div>
              </div>
              <p className="font-semibold">₹{(Number(item.product_price) || 0) * (Number(item.quantity) || 1)}</p>
            </div>
          )) : (
            <p className="text-gray-500">No products in cart</p>
          )}
        </div>
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{calculateTotal()}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount:</span>
              <span>-₹{couponDiscount}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Final Total:</span>
            <span>₹{calculateFinalTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paymentway;
