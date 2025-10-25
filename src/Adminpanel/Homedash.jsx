import React, { useEffect, useState } from "react";
import { Users, Package, Box } from "lucide-react";
import axios from "axios";

const Homedash = () => {
  const [recent, setrecent] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
.then((res) => {
      setrecent(res.data.ordata);
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "text-gray-400";
      case "Packaging":
        return "text-blue-500";
      case "On The Road":
        return "text-yellow-400 ";
      case "Delivered":
        return "text-green-500";
      default:
        return "text-red-500 ";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600">
          Here you can manage all your products, orders, and users.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <Users size={36} />
          <div>
            <p className="text-sm">Total Users</p>
            <p className="text-2xl font-bold">125</p>
          </div>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <Package size={36} />
          <div>
            <p className="text-sm">Total Orders</p>
            <p className="text-2xl font-bold">320</p>
          </div>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <Box size={36} />
          <div>
            <p className="text-sm">Products</p>
            <p className="text-2xl font-bold">58</p>
          </div>
        </div>
      </div>

      {/* Recent activity table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Orders Last (5)</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {recent.slice(-5).map((item) => (
              <tr key={item._id} className="text-center">
                <td className="border px-4 py-2">{item._id}</td>
                <td className="border px-4 py-2">
                  {item.fname} {item.lname}
                </td>
                <td className={`border px-4 py-2 font-semibold ${getStatusColor(item.tracking?.status)}`}>
                  {item.tracking?.status || "Unknown"}
                </td>
                <td className="border px-4 py-2">₹{item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homedash;
