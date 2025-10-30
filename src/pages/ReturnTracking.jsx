import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { FaBox, FaTruck, FaCheckCircle, FaUndo, FaClock } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const ReturnTracking = () => {
  const { returnId } = useParams();
  const navigate = useNavigate();
  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(true);

  const returnSteps = [
    { status: 'REQUESTED', icon: FaUndo, title: 'Return Requested', description: 'Return request submitted successfully' },
    { status: 'APPROVED', icon: FaCheckCircle, title: 'Return Approved', description: 'Return request approved by admin' },
    { status: 'PICKUP_SCHEDULED', icon: FaClock, title: 'Pickup Scheduled', description: 'Pickup scheduled with delivery partner' },
    { status: 'PICKED_UP', icon: FaTruck, title: 'Picked Up', description: 'Product picked up from your location' },
    { status: 'RECEIVED', icon: FaBox, title: 'Return Received', description: 'Product received at our warehouse' },
    { status: 'QUALITY_CHECK', icon: FaCheckCircle, title: 'Quality Check', description: 'Product quality verification in progress' },
    { status: 'REFUND_INITIATED', icon: FaCheckCircle, title: 'Refund Initiated', description: 'Refund process started' },
    { status: 'REFUND_COMPLETED', icon: FaCheckCircle, title: 'Refund Completed', description: 'Refund credited to your account' }
  ];

  useEffect(() => {
    if (returnId) {
      fetchReturnDetails();
    }
  }, [returnId]);

  const fetchReturnDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/returns/${returnId}/status/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReturnData(response.data);
    } catch (error) {
      console.error('Error fetching return details:', error);
      toast.error('Failed to load return details');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = (status) => {
    return returnSteps.findIndex(step => step.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading return details...</p>
        </div>
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Return not found</p>
          <button 
            onClick={() => navigate('/orderhistory')}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Return Tracking</h1>
              <p className="text-gray-600">Return ID: {returnData.return_id}</p>
              <p className="text-gray-600">Order ID: {returnData.order_id}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600">₹{returnData.refund_amount}</p>
              <p className="text-sm text-gray-500">Refund Amount</p>
            </div>
          </div>
        </div>

        {/* Return Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6">Return Progress</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200"></div>
            <div 
              className="absolute top-8 left-8 h-1 bg-green-500 transition-all duration-500"
              style={{ 
                width: `${(getCurrentStepIndex(returnData.status) / (returnSteps.length - 1)) * 100}%` 
              }}
            ></div>

            {/* Status Steps */}
            <div className="relative flex justify-between">
              {returnSteps.map((step, index) => {
                const isCompleted = index <= getCurrentStepIndex(returnData.status);
                const isCurrent = index === getCurrentStepIndex(returnData.status);
                const IconComponent = step.icon;

                return (
                  <div key={index} className="flex flex-col items-center text-center max-w-xs">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                      isCompleted ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-green-200 animate-pulse' : ''}`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className={`font-medium text-sm mb-1 ${isCompleted ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs px-2 ${isCompleted ? 'text-green-500' : 'text-gray-500'}`}>{step.description}</p>
                    {isCompleted && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        ✅ {isCurrent ? `Updated: ${new Date(returnData.last_updated).toLocaleString()}` : 'Completed'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Details */}
          <div className="mt-8 space-y-4">
            {returnSteps.slice(0, getCurrentStepIndex(returnData.status) + 1).map((step, index) => {
              const eventDate = index === 0 ? returnData.created_at || returnData.last_updated : 
                               index === getCurrentStepIndex(returnData.status) ? returnData.last_updated : 
                               returnData.created_at;
              const isCurrent = index === getCurrentStepIndex(returnData.status);
              
              return (
                <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 ${
                  isCurrent ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50'
                }`}>
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    isCurrent ? 'bg-green-500 animate-pulse' : 'bg-green-400'
                  }`}></div>
                  <div>
                    <h4 className={`font-medium ${
                      isCurrent ? 'text-green-800' : 'text-gray-800'
                    }`}>{step.title}</h4>
                    <p className={`text-sm ${
                      isCurrent ? 'text-green-700' : 'text-gray-600'
                    }`}>{step.description}</p>
                    <p className={`text-xs ${
                      isCurrent ? 'text-green-600 font-medium' : 'text-gray-500'
                    }`}>
                      {eventDate ? new Date(eventDate).toLocaleString() : 'Processing...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Return Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p><strong>Reason:</strong> {returnData.reason}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  returnData.status === 'REFUND_COMPLETED' ? 'bg-green-100 text-green-800' :
                  returnData.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {returnData.status}
                </span>
              </p>
              <p><strong>Refund Amount:</strong> ₹{returnData.refund_amount}</p>
            </div>
            <div>
              {returnData.pickup_date && (
                <p><strong>Pickup Date:</strong> {new Date(returnData.pickup_date).toLocaleDateString()}</p>
              )}
              <p><strong>Requested On:</strong> {new Date(returnData.last_updated).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/orderhistory')}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnTracking;