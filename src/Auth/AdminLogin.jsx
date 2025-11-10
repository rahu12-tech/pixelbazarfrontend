import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/login/`, {
        email: formData.email,
        password: formData.password
      });
      
      const data = response.data;
      
      if (data.status === 200 || data.usertoken || data.token) {
        const token = data.usertoken || data.token;
        const user = data.exitsuser || data.user;
        
        // Check if user is admin
        const isAdmin = user?.role === 'admin' || user?.is_staff === true || user?.is_superuser === true;
        
        if (!isAdmin) {
          toast.error("Access denied. Admin privileges required.");
          setLoading(false);
          return;
        }
        
        // Store admin data
        const adminUser = { ...user, role: 'admin' };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(adminUser));
        
        toast.success("Admin login successful!");
        
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
        
      } else {
        toast.error(data.msg || "Login failed");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Admin Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Admin Password"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in as Admin"}
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-red-600 hover:text-red-500 text-sm"
            >
              Back to User Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;