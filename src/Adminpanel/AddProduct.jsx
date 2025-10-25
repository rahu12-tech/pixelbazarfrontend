import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [product, setProduct] = useState({
    product_name: "",
    product_titel: "",
    product_price: "",
    product_oldPrice: "",
    product_brand: "",
    product_type: "",
    product_category: "",
    product_warranty: "",
    product_discount: "",
    product_des: "",
    product_img: "",
    product_return: "0",
    is_flash_sale: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const productWithLocation = {
          ...product,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        };
        const res = await axios.post("http://127.0.0.1:8000/addproduct", productWithLocation);
        toast.success(res.data.msg);

        setProduct({
          product_name: "",
          product_titel: "",
          product_price: "",
          product_oldPrice: "",
          product_brand: "",
          product_type: "",
          product_category: "",
          product_warranty: "",
          product_discount: "",
          product_des: "",
          product_img: "",
          product_return: "0",
          is_flash_sale: false,
        });

        navigate("/admin/showproduct");
      },
        (err) => {
          toast.error("Please allow location access!");
        });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong! Check backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Add New Product
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Product Name */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={product.product_name}
              onChange={handleChange}
              placeholder="Vivo V23"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Product Title */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Product Title</label>
            <input
              type="text"
              name="product_titel"
              value={product.product_titel}
              onChange={handleChange}
              placeholder="Vivo V23 with Stunning Camera"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Product Price */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              name="product_price"
              value={product.product_price}
              onChange={handleChange}
              placeholder="299.99"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Old Price */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Old Price ($)</label>
            <input
              type="number"
              name="product_oldPrice"
              value={product.product_oldPrice}
              onChange={handleChange}
              placeholder="349.99"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Brand */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="product_brand"
              value={product.product_brand}
              onChange={handleChange}
              placeholder="Vivo,Oppo,Samsung,Apple"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Type</label>
            <input
              type="text"
              name="product_type"
              value={product.product_type}
              onChange={handleChange}
              placeholder="Mobile,Laptop,Air Conditioner,Mixer"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Category</label>
            <select
              name="product_category"
              value={product.product_category}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Category</option>
              <option value="phones">Phones</option>
              <option value="laptops">Laptops</option>
              <option value="speakers">Speakers</option>
              <option value="headphones">Headphones</option>
              <option value="cameras">Cameras</option>
            </select>
          </div>

          {/* Warranty */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Warranty</label>
            <input
              type="text"
              name="product_warranty"
              value={product.product_warranty}
              onChange={handleChange}
              placeholder="1 Year Manufacturer Warranty"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Discount */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Discount</label>
            <input
              type="text"
              name="product_discount"
              value={product.product_discount}
              onChange={handleChange}
              placeholder="14%"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Return Policy */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Return Policy (Days)</label>
            <select
              name="product_return"
              value={product.product_return}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>
                  {i} {i === 1 ? "Day" : "Days"}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              name="product_img"
              value={product.product_img}
              onChange={handleChange}
              placeholder="https://example.com/image.png"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 font-medium text-gray-700">Description</label>
            <textarea
              name="product_des"
              value={product.product_des}
              onChange={handleChange}
              placeholder="Product description here..."
              rows="5"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
