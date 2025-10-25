import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); 

  if (!token || !user) {
    return <Navigate to="/signup" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;
