import React, { useState, useEffect } from 'react';
import { RiCoupon3Line } from 'react-icons/ri';
import { MdContentCopy } from 'react-icons/md';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/coupons/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCoupons(res.data.coupons || res.data || []);
      } catch (err) {
        console.error('Coupons fetch error:', err);
        // Fallback dummy coupons
        setCoupons([
          {
            id: 1,
            code: 'WELCOME10',
            title: 'Welcome Offer',
            description: 'Get 10% off on your first order',
            discount: 10,
            minAmount: 500,
            maxDiscount: 100,
            validTill: '2024-12-31',
            isActive: true
          },
          {
            id: 2,
            code: 'SAVE20',
            title: 'Big Save',
            description: 'Save 20% on orders above ₹1000',
            discount: 20,
            minAmount: 1000,
            maxDiscount: 200,
            validTill: '2024-11-30',
            isActive: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading coupons...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="flex items-center gap-3 mb-6">
        <RiCoupon3Line className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">My Coupons</h1>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-12">
          <RiCoupon3Line className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No coupons available</p>
          <p className="text-gray-400 text-sm">Check back later for exciting offers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map(coupon => (
            <div key={coupon.id} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <RiCoupon3Line size={24} />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {coupon.discount}% OFF
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2">{coupon.title}</h3>
                <p className="text-sm mb-4 opacity-90">{coupon.description}</p>
                
                <div className="bg-white/20 rounded p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-lg">{coupon.code}</span>
                    <button
                      onClick={() => copyCouponCode(coupon.code)}
                      className="bg-white text-blue-600 p-2 rounded hover:bg-gray-100 transition"
                    >
                      <MdContentCopy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-xs space-y-1 opacity-80">
                  <p>Min order: ₹{coupon.minAmount}</p>
                  <p>Max discount: ₹{coupon.maxDiscount}</p>
                  <p>Valid till: {new Date(coupon.validTill).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}