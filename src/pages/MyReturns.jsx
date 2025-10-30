import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { FaUndo, FaEye } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const MyReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/api/returns/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReturns(response.data.returns || []);
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'refund_completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pickup_scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading returns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-right" />
      
      <div className="flex items-center gap-3 mb-6">
        <FaUndo className="text-orange-600" size={28} />
        <h1 className="text-2xl font-bold">My Returns</h1>
      </div>

      {returns.length === 0 ? (
        <div className="text-center py-12">
          <FaUndo className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No returns found</p>
          <p className="text-gray-400 text-sm">Your return requests will appear here</p>
          <button
            onClick={() => navigate('/orderhistory')}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            View Orders
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((returnItem) => (
            <div key={returnItem.return_id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Return #{returnItem.return_id}</h3>
                  <p className="text-gray-600">Order ID: {returnItem.order_id}</p>
                  <p className="text-sm text-gray-500">
                    Requested on: {new Date(returnItem.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(returnItem.status)}`}>
                    {returnItem.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className="text-lg font-bold text-green-600 mt-2">₹{returnItem.refund_amount}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Reason:</strong> {returnItem.reason}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Refund Amount:</strong> ₹{returnItem.refund_amount}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/return-tracking/${returnItem.return_id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaEye size={16} />
                  Track Return
                </button>
                
                <button
                  onClick={() => navigate('/orderhistory')}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReturns;