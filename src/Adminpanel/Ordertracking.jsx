import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Ordertracking() {
  const [orders, setOrders] = useState([]);
  const statusSteps = ["Order Placed", "Packaging", "On The Road", "Delivered"];
  const statusReturn = ["requested", "approved", "rejected"];

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/orderapiadmin")
      .then((res) => setOrders(res.data.ordata))
      .catch((err) => console.error(err));
  }, []);

  const updateTracking = async (id, status) => {
    try {
      await axios.put(`http://127.0.0.1:8000/tracking/${id}`, { status });
      toast.success("Tracking Updated");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, tracking: { status, updatedAt: new Date() } } : o
        )
      );
    } catch {
      toast.error("Update failed");
    }
  };

  const updateReturnData = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/return/${id}`, { status });
      toast.success("Return Status Updated");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, return: { ...o.return, status, updatedAt: new Date() } }
            : o
        )
      );
    } catch {
      toast.error("Return update failed");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500";
      case "On The Road":
        return "bg-yellow-400";
      case "Packaging":
        return "bg-blue-500";
      case "Order Placed":
        return "bg-gray-400";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "requested":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-center" />
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Admin Order Tracking
      </h2>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No orders found.</p>
      )}

      <div className="flex flex-col space-y-6">
        {orders.map((order) => {
          const currentStepIndex = statusSteps.indexOf(order.tracking?.status || "Order Placed");
          return (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-2xl transition w-full"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm md:text-lg">
                    Order ID: {order._id}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Customer: {order.fname} {order.lname}
                  </p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Total: <span className="font-semibold">₹{order.totalAmount}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-white text-xs md:text-sm ${statusColor(order.tracking?.status)}`}>
                    {order.tracking?.status || "Order Placed"}
                  </span>
                  {order.return?.status && (
                    <span className={`px-2 md:px-3 py-1 rounded-full text-white text-xs md:text-sm ${statusColor(order.return?.status)}`}>
                      {order.return?.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col md:flex-row items-start md:items-center mb-4 space-y-2 md:space-y-0 md:space-x-2">
                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex-1 space-y-5 relative w-full md:w-auto">
                    <div className="h-2 rounded-full bg-gray-300">
                      <div
                        className={`h-2 rounded-full ${idx <= currentStepIndex  ? "bg-blue-500" : ""}`}
                        style={{ width: "100%" }}
                      />
                    </div>
                    <p className="absolute top-3 text-xs md:text-sm text-center w-full">{step}</p>
                  </div>
                ))}
              </div>

              {/* Product List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {order.products.map((p) => (
                  <div key={p._id} className="flex items-center gap-3 md:gap-4 border rounded-lg p-2 hover:bg-gray-50 transition">
                    <img
                      src={p.product_img}
                      alt={p.product_name}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <div>
                      <p className="font-medium text-sm md:text-base">{p.product_name}</p>
                      <p className="text-gray-600 text-xs md:text-sm">Price: ₹{p.product_price}</p>
                      <p className="text-gray-600 text-xs md:text-sm">Qty: {p.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking Update */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">
                  Update Tracking:
                </label>
                <select
                  className="border rounded-md px-3 py-2 w-full md:w-1/3 text-sm md:text-base"
                  value={order.tracking?.status || "Order Placed"}
                  onChange={(e) => updateTracking(order._id, e.target.value)}
                >
                  {statusSteps.map((step) => (
                    <option key={step} value={step}>
                      {step}
                    </option>
                  ))}
                </select>
              </div>

              {/* Return Update */}
              {order.return?.status && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">
                    Update Return:
                  </label>
                  <select
                    className="border rounded-md px-3 py-2 w-full md:w-1/3 mb-2 text-sm md:text-base"
                    value={order.return?.status || ""}
                    onChange={(e) => updateReturnData(order._id, e.target.value)}
                  >
                    {statusReturn.map((step) => (
                      <option key={step} value={step}>
                        {step}
                      </option>
                    ))}
                  </select>
                  <p className=" text-xs md:text-sm">
                   <strong className="font-semibold">Return Reason:</strong>  <span className="font-medium text-gray-600">{order.return.reason}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Ordertracking;
