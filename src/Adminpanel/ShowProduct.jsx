import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function ShowProduct() {
  const [productapi, setproductapi] = useState([]);
  let statusSteps = ["stock", "outofstock"];

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
.then((res) => {
      setproductapi(res.data.productdata);
    });
  }, []);

  let deleteproduct = (id) => {
    axios.post("http://127.0.0.1:8000/deleteproduct", { id }).then((res) => {
      toast.success(res.data.msg);
      setproductapi((prev) => prev.filter((p) => p._id !== id));
    });
  };

  let updateStock = async (id, status) => {
    try {
      const res = await axios.put(`http://127.0.0.1:8000/stock/${id}`, { status });
      toast.success(res.data.msg);
      setproductapi((prev) =>
        prev.map((p) => (p._id === id ? res.data.product : p))
      );
    } catch (error) {
      toast.error("Error updating stock");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        📦 Product Management
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full border border-gray-200 rounded-xl">
          <thead className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Old Price</th>
              <th className="py-3 px-4 text-left">Discount</th>
              <th className="py-3 px-4 text-left">Brand</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Warranty</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-center">Stock</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {productapi.map((prod) => (
              <tr
                key={prod._id}
                className="border-t hover:bg-gray-50 transition duration-200"
              >
                {/* Image */}
                <td className="py-3 px-4">
                  <img
                    src={prod.product_img}
                    alt={prod.product_name}
                    className="w-16 h-16 object-contain rounded-md shadow"
                  />
                </td>

                {/* Info */}
                <td className="py-3 px-4 font-semibold text-gray-800">
                  {prod.product_name}
                </td>
                <td className="py-3 px-4">{prod.product_titel}</td>
                <td className="py-3 px-4 text-green-600 font-bold">
                  ₹{prod.product_price}
                </td>
                <td className="py-3 px-4 line-through text-gray-400">
                  ₹{prod.product_oldPrice}
                </td>
                <td className="py-3 px-4">
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                    {prod.product_discount}
                  </span>
                </td>
                <td className="py-3 px-4">{prod.product_brand}</td>
                <td className="py-3 px-4">{prod.product_type}</td>
                <td className="py-3 px-4">{prod.product_warranty}</td>
                <td className="py-3 px-4 text-sm max-w-xs truncate">
                  {prod.product_des}
                </td>

                {/* Stock Column (Separate) */}
                <td className="py-3 px-4 text-center">
                  <select
                    className="border rounded-lg px-3 py-2 w-full md:w-32 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                    value={prod.product_IsStock?.status || "stock"}
                    onChange={(e) => updateStock(prod._id, e.target.value)}
                  >
                    {statusSteps.map((step) => (
                      <option key={step} value={step}>
                        {step}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Actions Column */}
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm font-medium">
                      ✏ Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteproduct(prod._id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow text-sm font-medium"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {productapi.length === 0 && (
              <tr>
                <td
                  colSpan="12"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No Products Found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShowProduct;
