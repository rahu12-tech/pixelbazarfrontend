import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from "jwt-decode"; // updated import
import { useAuth } from '../context/AuthContext';
// Axios instance with JWT support
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function Signup() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", location: { lat: null, lng: null } });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  // No automatic clearing - let user stay logged in

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    console.log("🔍 Checking existing login:");
    console.log("Token:", token);
    console.log("User:", user);
    
    // Only redirect if BOTH token and user exist and are valid (not null strings)
    if (token && token !== "null" && token !== "undefined" && 
        user && user !== "null" && user !== "undefined" && 
        token.length > 10) { // Basic token validation
      console.log("User already logged in, redirecting to home");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    
    // Name validation (only for signup)
    if (!isLogin && !otpSent && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Email validation (for both login and signup)
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!isLogin && !otpSent && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- Signup + OTP ----------------
const handleSignup = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      };

      try {
        console.log("sending signup data",updatedData);
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/signup/`, updatedData);
        if (data.msg === "OTP sent") {
          setMessage("OTP sent to your email.");
          setOtpSent(true);
          setErrors({});
        } else {
          setErrors({ general: data.msg });
        }
      } catch (err) {
        console.error('Signup error:', err);
        const errorMsg = err.response?.data?.msg || err.response?.data?.message || "Server error.";
        setErrors({ general: errorMsg });
      }
    },
    () => alert("Please allow location access!")
  );
};
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  if (!otp.trim()) return setErrors({ otp: "OTP is required" });

  try {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/verify-otp/`, {
      email: formData.email,
      otp,
      password: formData.password,
      name: formData.name,
      location: formData.location,
    });

    if (data.msg === "User created successfully") {
      setMessage("✅ Account created successfully! Please log in now.");
      setErrors({});
      
      // ✅ Hide OTP form, show login form
      setOtpSent(false);
      setIsLogin(true);

      // ✅ Clear OTP field only
      setOtp("");

      // ✅ Optional: reset name/password so login is clean
      setFormData({ ...formData, name: "", password: "" });
    } else {
      setErrors({ otp: data.msg });
    }
  } catch (err) {
    console.error("OTP verify error:", err);
    setErrors({ general: "Invalid OTP. Please try again." });
  }
};


  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   if (!otp.trim()) return setErrors({ otp: "OTP is required" });

  //   try {
  //     const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/verify-otp/`, {
  //       email: formData.email,
  //       otp,
  //       password: formData.password,
  //       location: formData.location,
  //     });

  //     if (data.msg === "User created successfully") {
  //       setMessage("Account created successfully! Please login.");
  //       setOtpSent(false);
  //       setErrors({});
  //       setIsLogin(true);
  //       setFormData({ name: "", email: "", password: "", location: { lat: null, lng: null } });
  //     } else {
  //       setErrors({ otp: data.msg });
  //     }
  //   } catch (err) {
  //     setErrors({ general: "Invalid OTP. Please try again." });
  //   }
  // };

  // ---------------- Login ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Form submitted for login");
    
    if (!validate()) {
      console.log("Validation failed");
      return;
    }

    try {
      console.log("Login attempt with:", { 
        email: formData.email, 
        password: formData.password ? "***" : "empty" 
      });
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/login/`, {
        email: formData.email,
        password: formData.password
      });
      
      console.log("Full login response:", response);
      console.log("Login response data:", response.data);
      
      const data = response.data;
      
      // Check different possible success conditions
      if (data.status === 200 || data.usertoken || data.token) {
        const token = data.usertoken || data.token;
        const user = data.exitsuser || data.user;
        
        // Store token first
        localStorage.setItem("token", token);
        
        try {
          // Check admin status from backend
          console.log("🔍 Calling admin check API...");
          console.log("🔍 API URL:", `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/check-admin/`);
          console.log("🔍 Token:", token);
          
          const adminCheckRes = await axios.get(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/user/profile/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log("🔍 Admin check response:", adminCheckRes.data);
          
          const userProfile = adminCheckRes.data.user || adminCheckRes.data;
          console.log("🔍 User profile:", userProfile);
          
          const isAdmin = userProfile?.is_admin || userProfile?.is_staff || userProfile?.is_superuser || 
                         userProfile?.email?.toLowerCase().includes('admin') ||
                         userProfile?.id === 1 || userProfile?.id === '1' ||
                         userProfile?.email === 'jakharrahul812@gmail.com';
          console.log("🔍 Is Admin:", isAdmin);
          
          const finalUser = isAdmin ? { ...user, role: 'admin' } : user;
          
          console.log('🔍 Calling authLogin with:', { token: token ? 'present' : 'missing', finalUser });
          // Update AuthContext immediately
          authLogin(token, finalUser);
          console.log('🔍 AuthLogin called successfully');
          
          setMessage("Logged in successfully!");
          setErrors({});
          setFormData({ name: "", email: "", password: "", location: { lat: null, lng: null } });
          
          if (isAdmin) {
            console.log("🔍 Redirecting to Django admin panel");
            window.location.href = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/admin/`;
          } else {
            console.log("🔍 Redirecting to home");
            navigate("/");
          }
          
        } catch (err) {
          console.log("🚨 Admin check API failed:", err.response?.status, err.response?.data);
          console.log("🚨 Error details:", err.message);
          
          console.log('🔍 Calling authLogin for regular user with:', { token: token ? 'present' : 'missing', user });
          // Update AuthContext for regular user
          authLogin(token, user);
          console.log('🔍 Regular user authLogin called successfully');
          
          setMessage("Logged in successfully!");
          setErrors({});
          setFormData({ name: "", email: "", password: "", location: { lat: null, lng: null } });
          
          console.log("🔍 Regular user, redirecting to home");
          navigate("/");
        }
        
      } else {
        setErrors({ general: data.msg || data.message || "Login failed" });
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      setErrors({ general: err.response?.data?.msg || err.response?.data?.message || "Server error. Try again later." });
    }
  };

  // ---------------- Google Login ----------------
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log("Google login attempt");
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/auth/google`, {
        credential: credentialResponse.credential
      });
      
      console.log("Google login response:", data);
      
      if (data.status === 200 && data.ustoken) {
        const token = data.ustoken;
        const decodedUser = jwt_decode(token);
        const userData = { email: decodedUser.email, name: decodedUser.name };
        
        // Update AuthContext immediately
        authLogin(token, userData);
        
        setMessage("Logged in with Google!");
        setErrors({});
        
        navigate("/");
      } else {
        setErrors({ general: "Google login failed" });
      }
    } catch (err) {
      console.error("Google login error:", err);
      setErrors({ general: "Google login failed. Please try again." });
    }
  };

  return (
    <GoogleOAuthProvider clientId="181896012509-iqbac94cc3k5qgqep5kdvlvok65nu80q.apps.googleusercontent.com">
      <div className="flex flex-col md:flex-row m-auto h-[600px]">
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center">
          <img
            src="https://img.freepik.com/premium-vector/secure-login-flat-style-design-vector-illustration-stock-illustration_357500-2157.jpg?w=2000"
            alt="Signup Illustration"
            className="w-full h-full"
          />
        </div>
        <div className="w-full bg-white md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl md:text-start text-center font-bold text-gray-900 mb-4">
              {isLogin ? "Log in to your account" : otpSent ? "Enter OTP" : "Create an account"}
            </h2>

            {errors.general && <p className="text-red-500 text-sm mb-2">{errors.general}</p>}
            {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

            <form
              className="space-y-4"
              onSubmit={isLogin ? handleLogin : otpSent ? handleVerifyOtp : handleSignup}
            >
              {!isLogin && !otpSent && (
                <>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                  <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </>
              )}

              {otpSent && !isLogin && (
                <>
                  <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
                  {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                </>
              )}

              {isLogin && (
                <>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
                  <Link to='/forget'>
                    <button className="text-blue-400 cursor-pointer mb-3">Forget Password</button>
                  </Link>
                </>
              )}

              <button type="submit" className="w-full cursor-pointer bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition">
                {isLogin ? "Log In" : otpSent ? "Verify OTP" : "Create Account"}
              </button>
            </form>

            {!isLogin && !otpSent && (
              <div className="mt-4">
                <p className="text-center text-gray-500 mb-2">or</p>
                <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log('Login Failed')} />
              </div>
            )}

            {!otpSent && (
              <p className="mt-6 text-center text-gray-600">
                {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => { 
                  setIsLogin(!isLogin); 
                  setErrors({}); 
                  setFormData({ name: "", email: "", password: "", location: { lat: null, lng: null } }); 
                  setMessage("");
                  setOtpSent(false);
                  setOtp("");
                }} className="text-black font-medium hover:underline cursor-pointer">
                  {isLogin ? "Create one" : "Log in"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}













