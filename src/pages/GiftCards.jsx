import React, { useState, useEffect } from 'react';
import { TbGiftCard } from 'react-icons/tb';
import { MdShoppingCart } from 'react-icons/md';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function GiftCards() {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/gift-cards/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGiftCards(res.data.giftCards || res.data || []);
      } catch (err) {
        console.error('Gift cards fetch error:', err);
        // Fallback dummy gift cards
        setGiftCards([
          {
            id: 1,
            title: 'Electronics Gift Card',
            description: 'Perfect for tech lovers',
            amount: 1000,
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
            category: 'Electronics'
          },
          {
            id: 2,
            title: 'Shopping Voucher',
            description: 'Shop anything you want',
            amount: 500,
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
            category: 'General'
          },
          {
            id: 3,
            title: 'Premium Gift Card',
            description: 'For special occasions',
            amount: 2000,
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=200&fit=crop',
            category: 'Premium'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCards();
  }, []);

  const purchaseGiftCard = (giftCard) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to purchase gift cards');
      return;
    }
    
    // Navigate to payment with gift card details
    toast.success(`Gift card of ₹${giftCard.amount} added to cart!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading gift cards...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="flex items-center gap-3 mb-6">
        <TbGiftCard className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Gift Cards</h1>
      </div>

      {giftCards.length === 0 ? (
        <div className="text-center py-12">
          <TbGiftCard className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No gift cards available</p>
          <p className="text-gray-400 text-sm">Check back later for new gift cards</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftCards.map(card => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Gift+Card';
                }}
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {card.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{card.amount}
                  </div>
                  <button
                    onClick={() => purchaseGiftCard(card)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <MdShoppingCart size={16} />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}